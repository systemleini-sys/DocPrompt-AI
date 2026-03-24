export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "鏈櫥锟?", code: 401 }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[GET PROFILE ERROR]", error);
    return NextResponse.json({ success: false, error: "获取资料失败", code: 500 }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { nickname, avatar } = body;

    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (nickname !== undefined) updates.name = String(nickname).slice(0, 50);
    if (avatar !== undefined) updates.avatar_url = String(avatar).slice(0, 500);

    const { error } = await supabase.from("users").update(updates).eq("id", user.id);
    if (error) {
      return NextResponse.json({ success: false, error: "更新失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { message: "更新成功" } });
  } catch (error: unknown) {
    const code = error instanceof Error && "code" in error ? (error as Record<string, number>).code : 500;
    const msg = error instanceof Error ? error.message : "更新失败";
    return NextResponse.json({ success: false, error: msg, code }, { status: code });
  }
}
