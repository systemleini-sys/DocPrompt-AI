export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PLANS: Record<string, { days: number | null; features: string[] }> = {
  basic: { days: 30, features: ["daily_tasks:50", "max_file_size_mb:50", "max_concurrent_tasks:3"] },
  pro: { days: 30, features: ["daily_tasks:200", "max_file_size_mb:200", "max_concurrent_tasks:5"] },
  lifetime: { days: null, features: ["daily_tasks:999", "max_file_size_mb:500", "max_concurrent_tasks:10"] },
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "缺少必要参数", code: 400 }, { status: 400 });
    }
    if (status !== "paid" && status !== "failed") {
      return NextResponse.json({ success: false, error: "无效的状态", code: 400 }, { status: 400 });
    }

    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ success: false, error: "订单不存在", code: 404 }, { status: 404 });
    }
    if (order.status !== "pending") {
      return NextResponse.json({ success: false, error: "订单状态已变更，不可重复处理", code: 400 }, { status: 400 });
    }

    const now = new Date().toISOString();

    await supabase
      .from("orders")
      .update({ status, paid_at: status === "paid" ? now : null, updated_at: now })
      .eq("id", orderId);

    if (status === "failed") {
      return NextResponse.json({ success: true, data: { orderId, status: "failed" } });
    }

    // 激活会员
    const plan = PLANS[order.plan_id];
    if (!plan) {
      return NextResponse.json({ success: true, data: { orderId, status: "paid", licenseActivated: false } });
    }

    const expiresAt = plan.days ? new Date(Date.now() + plan.days * 86400000).toISOString() : null;

    await supabase
      .from("users")
      .update({
        license: { type: order.plan_id, expires_at: expiresAt, features: plan.features },
        limits: {
          daily_tasks: plan.days === null ? 999 : order.plan_id === "basic" ? 50 : 200,
          max_file_size_mb: plan.days === null ? 500 : order.plan_id === "basic" ? 50 : 200,
          max_concurrent_tasks: plan.days === null ? 10 : order.plan_id === "basic" ? 3 : 5,
          max_file_count_per_task: 20,
        },
        updated_at: now,
      })
      .eq("id", order.user_id);

    return NextResponse.json({
      success: true,
      data: { orderId, status: "paid", licenseActivated: true, planId: order.plan_id, expiresAt },
    });
  } catch (error) {
    console.error("[PAYMENT WEBHOOK ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
