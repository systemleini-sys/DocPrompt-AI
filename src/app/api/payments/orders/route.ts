export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const offset = (page - 1) * pageSize;

    const { data, error, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("[GET ORDERS ERROR]", error);
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
    console.error("[GET ORDERS ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
