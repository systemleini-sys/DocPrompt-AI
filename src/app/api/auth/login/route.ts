export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, code } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: "请提供邮箱或手机号", code: 400 }, { status: 400 });
    }
    if (!password && !code) {
      return NextResponse.json({ success: false, error: "请提供密码或验证码", code: 400 }, { status: 400 });
    }

    const identifier = email || phone;

    // Rate limiting: 5 failures = lock 15min
    const { data: rateLimit } = await supabase
      .from("login_attempts")
      .select("fail_count, locked_until")
      .eq("identifier", identifier)
      .single();

    if (rateLimit?.locked_until && new Date(rateLimit.locked_until) > new Date()) {
      return NextResponse.json({ success: false, error: "登录失败次数过多，请15分钟后重试", code: 429 }, { status: 429 });
    }

    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const failCount = (rateLimit?.fail_count ?? 0) + 1;
        const lockedUntil = failCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
        await supabase.from("login_attempts").upsert(
          { identifier, fail_count: failCount, locked_until: lockedUntil, updated_at: new Date().toISOString() },
          { onConflict: "identifier" }
        );
        return NextResponse.json({ success: false, error: "邮箱或密码错误", code: 401 }, { status: 401 });
      }

      await supabase.from("login_attempts").delete().eq("identifier", identifier);
      await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", data.user.id);

      const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();

      const response = NextResponse.json({
        success: true,
        data: { user: profile, token: data.session?.access_token ?? "" },
      });

      if (data.session?.access_token) {
        response.cookies.set("sb-access-token", data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }

      return response;
    }

    if (phone && code) {
      if (!code || code.length < 4) {
        return NextResponse.json({ success: false, error: "楠岃瘉鐮佹牸寮忎笉姝ｇ‘", code: 400 }, { status: 400 });
      }
      // TODO: Verify SMS code via provider (Aliyun SMS / Twilio)
      const { data: userData } = await supabase.from("users").select("*").eq("phone", phone).single();
      if (!userData) {
        return NextResponse.json({ success: false, error: "璇ユ墜鏈哄彿鏈敞锟?", code: 404 }, { status: 404 });
      }
      await supabase.from("login_attempts").delete().eq("identifier", identifier);
      return NextResponse.json({ success: true, data: { user: userData, token: "phone_token_placeholder" } });
    }

    return NextResponse.json({ success: false, error: "参数错误", code: 400 }, { status: 400 });
  } catch (error) {
    console.error("[AUTH LOGIN ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
