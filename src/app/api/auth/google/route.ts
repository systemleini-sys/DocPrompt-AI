export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
);

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ success: false, error: "缺少 idToken", code: 400 }, { status: 400 });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json({ success: false, error: "无效的Google令牌", code: 401 }, { status: 401 });
    }

    const { data: existingUser } = await supabase.from("users").select("*").eq("email", payload.email).single();

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
      const now = new Date().toISOString();
      await supabase.from("users").update({ last_login_at: now, updated_at: now }).eq("id", userId);
    } else {
      userId = randomUUID();
      const now = new Date().toISOString();
      await supabase.from("users").insert({
        id: userId,
        email: payload.email || "",
        nickname: payload.name || "Google User",
        avatar: payload.picture || null,
        role: 0,
        membership_level: 0,
        status: 1,
        google_id: payload.sub || "",
        created_at: now,
        updated_at: now,
        last_login_at: now,
      });
      await supabase.from("user_limits").insert({
        user_id: userId,
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
