export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { PaginatedResponse, Task } from "@/types";

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
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let query = supabase
      .from("tasks")
      .select("*", { count: "exact" })
      .eq("user_id", authData.user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (type) {
      query = query.eq("type", type);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data: tasks, error, count } = await query;

    if (error) {
      console.error("[TASKS LIST ERROR]", error);
      return NextResponse.json({ success: false, error: "查询失败", code: 500 }, { status: 500 });
    }

    const result: PaginatedResponse<Task> = {
      items: (tasks ?? []) as unknown as Task[],
      total: count ?? 0,
      page,
      page_size: pageSize,
      total_pages: Math.ceil((count ?? 0) / pageSize),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[TASKS LIST ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
