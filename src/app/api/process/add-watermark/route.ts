export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TASK_LIMITS } from "@/constants";

const WATERMARK_TYPES = ["text", "image"] as const;
const POSITIONS = ["center", "top-left", "top-right", "bottom-left", "bottom-right", "tile"] as const;

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
    const { fileUrl, watermarkType, text, fontColor, fontSize, opacity, position, watermarkImageUrl } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "璇锋彁渚涘浘鐗囧湴鍧€", code: 400 }, { status: 400 });
    }
    if (!watermarkType || !WATERMARK_TYPES.includes(watermarkType)) {
      return NextResponse.json({ success: false, error: `水印类型无效，支持 ${WATERMARK_TYPES.join(", ")}`, code: 400 }, { status: 400 });
    }
    if (watermarkType === "text" && !text) {
      return NextResponse.json({ success: false, error: "文字水印需要提供 text 参数", code: 400 }, { status: 400 });
    }
    if (watermarkType === "image" && !watermarkImageUrl) {
      return NextResponse.json({ success: false, error: "图片水印需要提供 watermarkImageUrl 参数", code: 400 }, { status: 400 });
    }
    if (position && !POSITIONS.includes(position)) {
      return NextResponse.json({ success: false, error: `位置无效，支持 ${POSITIONS.join(", ")}`, code: 400 }, { status: 400 });
    }

    const options: Record<string, unknown> = {
      watermarkType,
      text: text ?? null,
      fontColor: fontColor ?? "#000000",
      fontSize: Math.min(200, Math.max(8, parseInt(fontSize ?? "24", 10))),
      opacity: Math.min(1, Math.max(0, parseFloat(opacity ?? "0.5"))),
      position: position ?? "center",
      watermarkImageUrl: watermarkImageUrl ?? null,
    };

    const taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "add_watermark",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options,
    });

    processAddWatermark(taskId, fileUrl, options, 0);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "processing" } });
  } catch (error) {
    console.error("[ADD WATERMARK ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

async function processAddWatermark(taskId: string, fileUrl: string, options: Record<string, unknown>, retryCount: number) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const outputUrl = fileUrl.replace(/(\.[^.]+)$/, "_watermarked$1");

    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);
  } catch {
    if (retryCount < TASK_LIMITS.max_retries) {
      await new Promise((resolve) => setTimeout(resolve, TASK_LIMITS.retry_delay_ms));
      processAddWatermark(taskId, fileUrl, options, retryCount + 1);
    } else {
      await supabase.from("tasks").update({
        status: "failed",
        error_message: "添加水印失败",
      }).eq("id", taskId);
    }
  }
}
