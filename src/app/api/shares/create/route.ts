export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SHARE_DEFAULTS } from "@/constants";

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

    const { data: user } = await supabase.from("users").select("license").eq("id", authData.user.id).single();
    if (!user) {
      return NextResponse.json({ success: false, error: "用户不存在", code: 404 }, { status: 404 });
    }

    const licenseType = (user.license as { type: string })?.type ?? "free";
    if (licenseType === "free") {
      return NextResponse.json({ success: false, error: "免费用户不支持分享功能，请升级会员", code: 403 }, { status: 403 });
    }

    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ success: false, error: "请提供任务ID", code: 400 }, { status: 400 });
    }

    // 妫€鏌ヨ浠诲姟鏄惁灞炰簬褰撳墠用户
    const { data: task } = await supabase.from("tasks").select("id").eq("id", taskId).eq("user_id", authData.user.id).single();
    if (!task) {
      return NextResponse.json({ success: false, error: "任务不存在或无权操作", code: 404 }, { status: 404 });
    }

    // 妫€鏌ュ崟鏂囦欢鍒嗕韩鏁伴噺闄愬埗锛堟渶锟?鏉★級
    const { count: existingShares } = await supabase
      .from("share_links")
      .select("*", { count: "exact", head: true })
      .eq("task_id", taskId)
      .eq("is_active", true);

    if ((existingShares ?? 0) >= 3) {
      return NextResponse.json({ success: false, error: "该文件已有活跃分享链接", code: 400 }, { status: 400 });
    }

    const shareKey = generateShareKey(SHARE_DEFAULTS.code_length);
    const expiresAt = new Date(Date.now() + SHARE_DEFAULTS.expires_days * 24 * 60 * 60 * 1000).toISOString();

    const { data: share, error } = await supabase.from("share_links").insert({
      task_id: taskId,
      user_id: authData.user.id,
      code: shareKey,
      expires_at: expiresAt,
      max_downloads: SHARE_DEFAULTS.max_downloads,
      is_active: true,
    }).select().single();

    if (error) {
      console.error("[SHARE CREATE ERROR]", error);
      return NextResponse.json({ success: false, error: "创建分享链接失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: share });
  } catch (error) {
    console.error("[SHARE CREATE ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

function generateShareKey(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}
