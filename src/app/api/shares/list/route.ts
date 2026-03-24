export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ShareLink } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ success: false, error: "登录已过期，请重新登录", code: 401 }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("page_size") ?? "20", 10)));

    const { data: shares, error, count } = await supabase
      .from("share_links")
      .select("*", { count: "exact" })
      .eq("user_id", authData.user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error("[SHARES LIST ERROR]", error);
      return NextResponse.json({ success: false, error: "查询失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        items: (shares ?? []) as unknown as ShareLink[],
        total: count ?? 0,
        page,
        page_size: pageSize,
        total_pages: Math.ceil((count ?? 0) / pageSize),
      },
    });
  } catch (error) {
    console.error("[SHARES LIST ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
