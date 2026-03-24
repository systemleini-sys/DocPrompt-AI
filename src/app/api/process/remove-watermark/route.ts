export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TASK_LIMITS } from "@/constants";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ success: false, error: "登录已过期，请重新登录", code: 401 }, { status: 401 });
    }

    const body = await request.json();
    const { fileUrl, strength } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "璇锋彁渚涘浘鐗囧湴鍧€", code: 400 }, { status: 400 });
    }

    const strengthValue = Math.min(100, Math.max(1, parseInt(String(strength ?? "50"), 10)));

    const taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "remove_watermark",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { strength: strengthValue },
    });

    processRemoveWatermark(taskId, fileUrl, strengthValue, 0);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "processing" } });
  } catch (error) {
    console.error("[REMOVE WATERMARK ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

async function processRemoveWatermark(taskId: string, fileUrl: string, strength: number, retryCount: number) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const baseName = fileUrl.replace(/\.[^.]+$/, "");
    const ext = fileUrl.match(/\.[^.]+$/)?.[0] ?? ".png";
    const outputUrl = baseName + "_no_watermark" + ext;

    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);
  } catch {
    if (retryCount < TASK_LIMITS.max_retries) {
      await new Promise((resolve) => setTimeout(resolve, TASK_LIMITS.retry_delay_ms));
      processRemoveWatermark(taskId, fileUrl, strength, retryCount + 1);
    } else {
      await supabase.from("tasks").update({
        status: "failed",
        error_message: "去水印处理失败" }).eq("id", taskId);
    }
  }
}
