export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadFile, generateFileKey } from "@/lib/supabase-storage";
import { convertFile, detectFormatFromUrl, normalizeFormat } from "@/lib/convertapi";
import { TASK_LIMITS, SUPPORTED_FORMATS } from "@/constants";

const ALL_OUTPUT_FORMATS = Array.from(
  new Set(Object.values(SUPPORTED_FORMATS).flatMap((f) => f.output))
);

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    // 1. 验证登录
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ success: false, error: "登录已过期，请重新登录", code: 401 }, { status: 401 });
    }

    // 2. 解析请求
    const body = await request.json();
    const { fileUrl, convertType } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "请提供文件地址", code: 400 }, { status: 400 });
    }
    if (!convertType || !ALL_OUTPUT_FORMATS.includes(convertType)) {
      return NextResponse.json({ success: false, error: `不支持的目标格式: ${convertType}`, code: 400 }, { status: 400 });
    }

    // 3. 检测源格式
    const rawFromFormat = detectFormatFromUrl(fileUrl);
    const fromFormat = normalizeFormat(rawFromFormat);
    const toFormat = normalizeFormat(convertType);

    if (fromFormat === toFormat) {
      return NextResponse.json({ success: false, error: "源格式与目标格式相同", code: 400 }, { status: 400 });
    }

    // 4. 创建任务记录
    const taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "file_convert",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { convertType, fromFormat, toFormat },
    });

    // 5. 异步处理转换
    processFileConvert(taskId, fileUrl, fromFormat, toFormat, authData.user.id, 0);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "processing" } });
  } catch (error) {
    console.error("[FILE CONVERT ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

async function processFileConvert(
  taskId: string,
  fileUrl: string,
  fromFormat: string,
  toFormat: string,
  userId: string,
  retryCount: number
) {
  try {
    // 调用 ConvertAPI
    const { buffer, fileName } = await convertFile(fileUrl, fromFormat, toFormat);

    // 上传到 Supabase Storage
    const fileKey = generateFileKey("converted", fileName);
    const blob = new Blob([new Uint8Array(buffer)]);
    const outputUrl = await uploadFile(blob, fileKey);

    // 更新任务状态
    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl, fileName }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);
  } catch (error) {
    console.error(`[FILE CONVERT RETRY ${retryCount}]`, error);

    if (retryCount < TASK_LIMITS.max_retries) {
      await new Promise((resolve) => setTimeout(resolve, TASK_LIMITS.retry_delay_ms));
      processFileConvert(taskId, fileUrl, fromFormat, toFormat, userId, retryCount + 1);
    } else {
      const errorMsg = error instanceof Error ? error.message : "格式转换失败";
      await supabase.from("tasks").update({
        status: "failed",
        error_message: errorMsg,
      }).eq("id", taskId);
    }
  }
}
