export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { data, error } = await supabase
      .from("system_settings")
      .select("*");

    if (error) {
      console.error("[GET ADMIN SETTINGS ERROR]", error);
      return NextResponse.json({ success: false, error: "获取系统配置失败", code: 500 }, { status: 500 });
    }

    const settings: Record<string, unknown> = {};
    for (const row of data ?? []) {
      settings[row.key as string] = row.value;
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const authErr = error as { code: number; message: string };
      return NextResponse.json({ success: false, error: authErr.message, code: authErr.code }, { status: authErr.code });
    }
    console.error("[GET ADMIN SETTINGS ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "请求体无效", code: 400 }, { status: 400 });
    }

    const now = new Date().toISOString();
    const upserts = Object.entries(body).map(([key, value]) => ({
      key,
      value,
      updated_at: now,
    }));

    const { error } = await supabase
      .from("system_settings")
      .upsert(upserts, { onConflict: "key" });

    if (error) {
      console.error("[UPDATE ADMIN SETTINGS ERROR]", error);
      return NextResponse.json({ success: false, error: "更新系统配置失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { updated: true } });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const authErr = error as { code: number; message: string };
      return NextResponse.json({ success: false, error: authErr.message, code: authErr.code }, { status: authErr.code });
    }
    console.error("[UPDATE ADMIN SETTINGS ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
