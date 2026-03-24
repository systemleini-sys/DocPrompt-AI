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

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ success: false, error: "请提供任务ID", code: 400 }, { status: 400 });
    }

    const { data: task } = await supabase
      .from("tasks")
      .select("id, user_id")
      .eq("id", taskId)
      .single();

    if (!task) {
      return NextResponse.json({ success: false, error: "任务不存在", code: 404 }, { status: 404 });
    }

    if (task.user_id !== authData.user.id) {
      return NextResponse.json({ success: false, error: "无权操作此任务", code: 403 }, { status: 403 });
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      console.error("[TASK DELETE ERROR]", error);
      return NextResponse.json({ success: false, error: "删除任务失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[TASK DELETE ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
