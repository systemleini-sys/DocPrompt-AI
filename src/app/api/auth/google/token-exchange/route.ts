import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
);

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ success: false, error: "缺少code", code: 400 }, { status: 400 });
    }

    // Exchange code for tokens
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`;
    const ticket = await client.getToken(code);

    if (!ticket.tokens) {
      return NextResponse.json({ success: false, error: "获取token失败", code: 400 }, { status: 400 });
    }

    const { tokens } = ticket;
    const idToken = tokens.id_token;

    if (!idToken) {
      return NextResponse.json({ success: false, error: "未获取到ID令牌", code: 400 }, { status: 400 });
    }

    // Verify ID Token
    const verification = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    const payload = verification.getPayload();

    if (!payload) {
      return NextResponse.json({ success: false, error: "无效的Google令牌", code: 401 }, { status: 401 });
    }

    // Send idToken to backend login API
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    console.error("[TOKEN EXCHANGE ERROR]", error);
    return NextResponse.json({ success: false, error: "登录失败", code: 500 }, { status: 500 });
  }
}
