export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { LICENSE_LIMITS } from "@/constants";
import type { TaskType } from "@/types";

const VALID_TYPES: TaskType[] = ["ai_rewrite", "ocr", "remove_watermark", "add_watermark", "file_convert"];

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { type, fileUrl, fileMd5 } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ success: false, error: "无效的任务类型", code: 400 }, { status: 400 });
    }

    const limits = LICENSE_LIMITS[user.license?.type ?? "free"] ?? LICENSE_LIMITS.free;
    const today = new Date().toISOString().split("T")[0];

    // Check daily quota
    const { data: usage } = await supabase
      .from("user_limits")
      .select("ai_used, ocr_used, watermark_used, pdf_used")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const used = usage ?? { ai_used: 0, ocr_used: 0, watermark_used: 0, pdf_used: 0 };
    const totalUsed = used.ai_used + used.ocr_used + used.watermark_used + used.pdf_used;
    if (totalUsed >= limits.daily_tasks) {
      return NextResponse.json({ success: false, error: "今日使用次数已用完", code: 429 }, { status: 429 });
    }

    // Check concurrent tasks (max 2 for safety)
    const { count: runningCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["pending", "processing"]);
    if ((runningCount ?? 0) >= Math.min(limits.max_concurrent_tasks, 2)) {
      return NextResponse.json({ success: false, error: "并发任务数已达上限", code: 429 }, { status: 429 });
    }

    // MD5 dedup within 5 minutes
    if (fileMd5) {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: dupTask } = await supabase
        .from("tasks")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("input_md5", fileMd5)
        .gte("created_at", fiveMinAgo)
        .single();
      if (dupTask) {
        return NextResponse.json({ success: false, error: "璇ユ枃锟?鍒嗛挓鍐呭凡鎻愪氦锛岃鍕块噸澶嶆彁锟?", code: 409 }, { status: 409 });
      }
    }

    // Check failure count (max 20/day)
    const { count: failCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "failed")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    if ((failCount ?? 0) >= 20) {
      return NextResponse.json({ success: false, error: "今日失败次数过多，请明天再试", code: 429 }, { status: 429 });
    }

    // Deduct quota
    const quotaField = type === "ai_rewrite" ? "ai_used" : type === "ocr" ? "ocr_used" : type.includes("watermark") ? "watermark_used" : "pdf_used";
    if (usage) {
      await supabase.from("user_limits").update({ [quotaField]: (usage as Record<string, number>)[quotaField] + 1 }).eq("user_id", user.id).eq("date", today);
    } else {
      await supabase.from("user_limits").insert({
        user_id: user.id, date: today,
        ai_used: quotaField === "ai_used" ? 1 : 0,
        ocr_used: quotaField === "ocr_used" ? 1 : 0,
        watermark_used: quotaField === "watermark_used" ? 1 : 0,
        pdf_used: quotaField === "pdf_used" ? 1 : 0,
      });
    }

    // Create task
    const taskId = crypto.randomUUID();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { error } = await supabase.from("tasks").insert({
      id: taskId,
      user_id: user.id,
      type,
      status: "pending",
      progress: 0,
      input_files: fileUrl ? [{ url: fileUrl }] : [],
      output_files: [],
      options: body,
      input_md5: fileMd5 ?? null,
      client_ip: ip,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (error) {
      return NextResponse.json({ success: false, error: "创建任务失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { taskId, status: "pending" } }, { status: 201 });
  } catch (error: unknown) {
    const code = error instanceof Error && "code" in error ? (error as Record<string, number>).code : 500;
    const msg = error instanceof Error ? error.message : "创建任务失败";
    return NextResponse.json({ success: false, error: msg, code }, { status: code });
  }
}
