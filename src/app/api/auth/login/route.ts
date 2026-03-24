export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const MAX_FAIL = 5;
const LOCK_MINUTES = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, code } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: "请提供邮箱或手机号", code: 400 }, { status: 400 });
    }

    // ========== 邮箱 + 密码登录 ==========
    if (email && password) {
      if (!password) {
        return NextResponse.json({ success: false, error: "请提供密码", code: 400 }, { status: 400 });
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError || !user) {
        return NextResponse.json({ success: false, error: "邮箱或密码错误", code: 401 }, { status: 401 });
      }

      // Check account status
      if (user.status !== 1) {
        return NextResponse.json({ success: false, error: "账号已被禁用", code: 403 }, { status: 403 });
      }

      // Check lock
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const remainMin = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60000);
        return NextResponse.json(
          { success: false, error: `登录失败次数过多，请${remainMin}分钟后再试`, code: 429 },
          { status: 429 }
        );
      }

      // Verify password
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        const newFailCount = (user.login_fail_count ?? 0) + 1;
        const lockedUntil = newFailCount >= MAX_FAIL
          ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString()
          : null;
        await supabase
          .from("users")
          .update({
            login_fail_count: newFailCount,
            locked_until: lockedUntil,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (newFailCount >= MAX_FAIL) {
          return NextResponse.json(
            { success: false, error: "登录失败次数过多，请15分钟后再试", code: 429 },
            { status: 429 }
          );
        }
        return NextResponse.json({ success: false, error: "邮箱或密码错误", code: 401 }, { status: 401 });
      }

      // Login success
      const sessionToken = randomUUID();
      const now = new Date().toISOString();
      await supabase
        .from("users")
        .update({
          login_fail_count: 0,
          locked_until: null,
          last_login_at: now,
          updated_at: now,
        })
        .eq("id", user.id);

      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            membership_level: user.membership_level,
          },
          token: sessionToken,
        },
      });

      response.cookies.set("session-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // ========== 手机号 + 验证码登录（占位） ==========
    if (phone && code) {
      if (!code || code.length < 4) {
        return NextResponse.json({ success: false, error: "验证码格式不正确", code: 400 }, { status: 400 });
      }
      // TODO: 通过短信服务商验证验证码（阿里云短信 / Twilio）
      const { data: user } = await supabase.from("users").select("*").eq("phone", phone).single();
      if (!user) {
        return NextResponse.json({ success: false, error: "该手机号未注册", code: 404 }, { status: 404 });
      }

      if (user.status !== 1) {
        return NextResponse.json({ success: false, error: "账号已被禁用", code: 403 }, { status: 403 });
      }

      const sessionToken = randomUUID();
      const now = new Date().toISOString();
      await supabase
        .from("users")
        .update({ login_fail_count: 0, locked_until: null, last_login_at: now, updated_at: now })
        .eq("id", user.id);

      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            membership_level: user.membership_level,
          },
          token: sessionToken,
        },
      });

      response.cookies.set("session-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "参数错误", code: 400 }, { status: 400 });
  } catch (error) {
    console.error("[AUTH LOGIN ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
