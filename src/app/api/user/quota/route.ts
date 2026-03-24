export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { LICENSE_LIMITS } from "@/constants";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const today = new Date().toISOString().split("T")[0];

    const { data: usage } = await supabase
      .from("user_limits")
      .select("ai_used, ocr_used, watermark_used, pdf_used")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const limits = LICENSE_LIMITS[user.license?.type ?? "free"] ?? LICENSE_LIMITS.free;

    return NextResponse.json({
      success: true,
      data: {
        used: usage ?? { ai_used: 0, ocr_used: 0, watermark_used: 0, pdf_used: 0 },
        limits,
      },
    });
  } catch (error: unknown) {
    const code = error instanceof Error && "code" in error ? (error as Record<string, number>).code : 500;
    const msg = error instanceof Error ? error.message : "获取配额失败";
    return NextResponse.json({ success: false, error: msg, code }, { status: code });
  }
}
