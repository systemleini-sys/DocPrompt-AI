export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { identityToken, user: appleUser } = await request.json();
    if (!identityToken) {
      return NextResponse.json({ success: false, error: "缺少 identityToken", code: 400 }, { status: 400 });
    }

    // TODO: Verify Apple identityToken using jose or apple-auth
    // const decoded = await jwtVerify(identityToken, applePublicKey);
    const payload = { sub: "apple_mock_id", email: appleUser?.email ?? null as string | null };

    const { data: existingUser } = await supabase.from("users").select("*").eq("email", payload.email).single();

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
      await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", userId);
    } else {
      userId = crypto.randomUUID();
      const now = new Date().toISOString();
      await supabase.from("users").insert({
        id: userId, email: payload.email, name: appleUser?.name ?? "Apple 用户",
        auth_provider: "apple", license_type: "free",
        created_at: now, updated_at: now, last_login_at: now,
      });
      await supabase.from("user_limits").insert({
        user_id: userId, ai_used: 0, ocr_used: 0, watermark_used: 0, pdf_used: 0,
        date: now.split("T")[0],
      });
    }

    const { data: profile } = await supabase.from("users").select("*").eq("id", userId).single();
    return NextResponse.json({ success: true, data: { user: profile } });
  } catch (error) {
    console.error("[APPLE AUTH ERROR]", error);
    return NextResponse.json({ success: false, error: "Apple 登录失败", code: 500 }, { status: 500 });
  }
}
