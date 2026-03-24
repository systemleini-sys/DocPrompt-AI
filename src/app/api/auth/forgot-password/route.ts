export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "请提供邮箱", code: 400 }, { status: 400 });
    }

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) {
      return NextResponse.json({ success: false, error: "该邮箱未注册", code: 404 }, { status: 404 });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });
    if (error) {
      return NextResponse.json({ success: false, error: "发送重置邮件失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { message: "重置邮件已发送" } });
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
