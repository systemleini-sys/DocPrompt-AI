export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ success: false, error: "登录已过期，请重新登录", code: 401 }, { status: 401 });
    }

    const { error, count } = await supabase
      .from("tasks")
      .delete({ count: "exact" })
      .eq("user_id", authData.user.id);

    if (error) {
      console.error("[TASKS CLEAR ERROR]", error);
      return NextResponse.json({ success: false, error: "清空任务失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { deleted_count: count ?? 0 } });
  } catch (error) {
    console.error("[TASKS CLEAR ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
