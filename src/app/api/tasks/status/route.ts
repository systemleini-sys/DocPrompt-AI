export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const taskId = request.nextUrl.searchParams.get("taskId");
    if (!taskId) {
      return NextResponse.json({ success: false, error: "缺少 taskId", code: 400 }, { status: 400 });
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .select("id, type, status, progress, output_files, error_message, created_at, completed_at")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single();

    if (error || !task) {
      return NextResponse.json({ success: false, error: "任务不存在", code: 404 }, { status: 404 });
    }

    const resultUrl = (task.output_files as Array<{ url?: string }>)?.[0]?.url ?? null;
    return NextResponse.json({ success: true, data: { ...task, result_url: resultUrl } });
  } catch (error: unknown) {
    const code = error instanceof Error && "code" in error ? (error as Record<string, number>).code : 500;
    const msg = error instanceof Error ? error.message : "查询失败";
    return NextResponse.json({ success: false, error: msg, code }, { status: code });
  }
}
