export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ success: false, error: "缺少 idToken", code: 400 }, { status: 400 });
    }

    // TODO: Verify Google ID Token using google-auth-library
    // const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    // const payload = ticket.getPayload();
    const payload = { sub: "google_mock_id", email: "user@gmail.com", name: "Google User", picture: null as string | null };

    const { data: existingUser } = await supabase.from("users").select("*").eq("email", payload.email).single();

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
      await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", userId);
    } else {
      userId = crypto.randomUUID();
      const now = new Date().toISOString();
      await supabase.from("users").insert({
        id: userId, email: payload.email, name: payload.name, avatar_url: payload.picture,
        license_type: "free", auth_provider: "google",
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
    console.error("[GOOGLE AUTH ERROR]", error);
    return NextResponse.json({ success: false, error: "Google 登录失败", code: 500 }, { status: 500 });
  }
}
