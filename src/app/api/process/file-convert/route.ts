export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TASK_LIMITS } from "@/constants";
import { SUPPORTED_FORMATS } from "@/constants";

const ALL_OUTPUT_FORMATS = Array.from(new Set(Object.values(SUPPORTED_FORMATS).flatMap((f) => f.output)));

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
    const { fileUrl, convertType } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "璇锋彁渚涙枃浠跺湴鍧€", code: 400 }, { status: 400 });
    }
    if (!convertType || !ALL_OUTPUT_FORMATS.includes(convertType)) {
      return NextResponse.json({ success: false, error: `涓嶆敮鎸佺殑鐩爣鏍煎紡: ${convertType}`, code: 400 }, { status: 400 });
    }

    const taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "file_convert",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { convertType },
    });

    processFileConvert(taskId, fileUrl, convertType, 0);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "processing" } });
  } catch (error) {
    console.error("[FILE CONVERT ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

async function processFileConvert(taskId: string, fileUrl: string, convertType: string, retryCount: number) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const outputUrl = fileUrl.replace(/(\.[^.]+)$/, `_converted${convertType}`);

    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);
  } catch {
    if (retryCount < TASK_LIMITS.max_retries) {
      await new Promise((resolve) => setTimeout(resolve, TASK_LIMITS.retry_delay_ms));
      processFileConvert(taskId, fileUrl, convertType, retryCount + 1);
    } else {
      await supabase.from("tasks").update({
        status: "failed",
        error_message: "格式转换失败",
      }).eq("id", taskId);
    }
  }
}
