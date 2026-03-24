export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, nickname } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: "请提供邮箱或手机号", code: 400 }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ success: false, error: "请设置密码", code: 400 }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "密码至少6位", code: 400 }, { status: 400 });
    }

    // Check uniqueness
    if (email) {
      const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
      if (existing) return NextResponse.json({ success: false, error: "该邮箱已注册", code: 409 }, { status: 409 });
    }
    if (phone) {
      // TODO: 接入短信验证码验证
      const { data: existing } = await supabase.from("users").select("id").eq("phone", phone).single();
      if (existing) return NextResponse.json({ success: false, error: "该手机号已注册", code: 409 }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    const displayName = nickname || email?.split("@")[0] || phone || "用户";
    const now = new Date().toISOString();

    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email: email ?? null,
      phone: phone ?? null,
      password_hash: passwordHash,
      nickname: displayName,
      role: 0,
      membership_level: 0,
      status: 1,
      login_fail_count: 0,
      consecutive_login_days: 0,
      created_at: now,
      updated_at: now,
      last_login_at: now,
    });
    if (insertError) {
      console.error("[REGISTER INSERT ERROR]", insertError);
      return NextResponse.json({ success: false, error: "创建用户失败", code: 500 }, { status: 500 });
    }

    const today = now.split("T")[0];
    await supabase.from("user_limits").insert({
      user_id: userId,
      date: today,
    });

    return NextResponse.json({ success: true, data: { message: "注册成功" } }, { status: 201 });
  } catch (error) {
    console.error("[AUTH REGISTER ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
