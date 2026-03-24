export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TASK_LIMITS } from "@/constants";

const SUPPORTED_LANGUAGES = ["zh", "en", "ja", "ko", "fr", "de", "es", "auto"] as const;

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
    const { fileUrl, language } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "璇锋彁渚涙枃浠跺湴鍧€", code: 400 }, { status: 400 });
    }
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json({ success: false, error: `不支持的语言: ${language}`, code: 400 }, { status: 400 });
    }

    const taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "ocr",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { language },
    });

    // 妯℃嫙 OCR 澶勭悊锛堝悗缁帴鍏ヨ锟?OCR API锟?    processOcr(taskId, fileUrl, language, 0);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "processing" } });
  } catch (error) {
    console.error("[OCR ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function processOcr(taskId: string, fileUrl: string, language: string, retryCount: number) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: (fileUrl as string).split(".").slice(0, -1).join(".") + "_ocr.txt", text: "模拟OCR识别结果文本" }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);
  } catch {
    if (retryCount < TASK_LIMITS.max_retries) {
      await new Promise((resolve) => setTimeout(resolve, TASK_LIMITS.retry_delay_ms));
      processOcr(taskId, fileUrl, language, retryCount + 1);
    } else {
      await supabase.from("tasks").update({
        status: "failed",
        error_message: "OCR处理失败",
      }).eq("id", taskId);
    }
  }
}
