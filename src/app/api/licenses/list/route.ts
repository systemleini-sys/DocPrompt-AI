export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
    const used = searchParams.get("used");
    const level = searchParams.get("level");
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from("licenses")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (used === "true") query = query.eq("used", true);
    else if (used === "false") query = query.eq("used", false);

    if (level) query = query.eq("level", level);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET LICENSES ERROR]", error);
      return NextResponse.json({ success: false, error: "查询失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        list: data ?? [],
        pagination: { page, pageSize, total: count ?? 0 },
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const authErr = error as { code: number; message: string };
      return NextResponse.json({ success: false, error: authErr.message, code: authErr.code }, { status: authErr.code });
    }
    console.error("[GET LICENSES ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
