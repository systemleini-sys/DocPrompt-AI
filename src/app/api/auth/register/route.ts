export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, nickname } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: "请提供邮箱或手机号", code: 400 }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ success: false, error: "璇疯缃瘑锟?", code: 400 }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "密码至少6位", code: 400 }, { status: 400 });
    }

    if (email) {
      const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
      if (existing) return NextResponse.json({ success: false, error: "该邮箱已注册", code: 409 }, { status: 409 });
    }
    if (phone) {
      const { data: existing } = await supabase.from("users").select("id").eq("phone", phone).single();
      if (existing) return NextResponse.json({ success: false, error: "该手机号已注册", code: 409 }, { status: 409 });
    }

    let userId: string;
    if (email) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return NextResponse.json({ success: false, error: error.message, code: 400 }, { status: 400 });
      userId = data.user!.id;
    } else {
      userId = crypto.randomUUID();
    }

    const displayName = nickname || email?.split("@")[0] || phone || "用户";
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email: email ?? null,
      phone: phone ?? null,
      name: displayName,
      avatar_url: null,
      license_type: "free",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    });
    if (insertError) return NextResponse.json({ success: false, error: "创建用户失败", code: 500 }, { status: 500 });

    const today = new Date().toISOString().split("T")[0];
    await supabase.from("user_limits").insert({
      user_id: userId,
      ai_used: 0, ocr_used: 0, watermark_used: 0, pdf_used: 0,
      date: today,
    });

    return NextResponse.json({ success: true, data: { message: "注册成功" } }, { status: 201 });
  } catch (error) {
    console.error("[AUTH REGISTER ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
