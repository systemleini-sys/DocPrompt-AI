export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TASK_LIMITS } from "@/constants";

const REWRITE_STYLES = ["formal", "casual", "academic", "creative", "concise", "expand"] as const;

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
    const { fileUrl, style } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "璇锋彁渚涙枃浠跺湴鍧€", code: 400 }, { status: 400 });
    }
    if (!style || !REWRITE_STYLES.includes(style)) {
      return NextResponse.json({ success: false, error: `改写风格无效，支持 ${REWRITE_STYLES.join(", ")}`, code: 400 }, { status: 400 });
    }

    const taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "ai_rewrite",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { style },
    });

    // 模拟 AI 改写处理（30秒超时，最多重试3次）
    processRewrite(taskId, authData.user.id, fileUrl, style, 0);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "processing" } });
  } catch (error) {
    console.error("[AI REWRITE ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

async function processRewrite(
  taskId: string,
  userId: string,
  fileUrl: string,
  style: string,
  retryCount: number
) {
  const MAX_RETRIES = TASK_LIMITS.max_retries;
  const TIMEOUT_MS = 30_000;

  try {
    // 模拟处理延迟（后续接入实际 AI 模型）
    await Promise.race([
      new Promise((resolve) => setTimeout(resolve, 3000)),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)),
    ]);

    const outputUrl = fileUrl.replace(/(\.[^.]+)$/, `_rewritten_${style}$1`);

    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, TASK_LIMITS.retry_delay_ms));
      processRewrite(taskId, userId, fileUrl, style, retryCount + 1);
    } else {
      await supabase.from("tasks").update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "处理失败",
      }).eq("id", taskId);
    }
  }
}
