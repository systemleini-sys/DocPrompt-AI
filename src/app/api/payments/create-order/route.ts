export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

const PLANS: Record<string, { name: string; price: number; days: number | null }> = {
  basic: { name: "基础版", price: 29.9, days: 30 },
  pro: { name: "专业版", price: 99.9, days: 30 },
  lifetime: { name: "终身版", price: 299, days: null },
};

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { planId } = await request.json();
    if (!planId || !PLANS[planId]) {
      return NextResponse.json({ success: false, error: "无效的套餐类型", code: 400 }, { status: 400 });
    }

    const plan = PLANS[planId];
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        user_id: user.id,
        plan_id: planId,
        amount: plan.price,
        currency: "CNY",
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[CREATE ORDER ERROR]", error);
      return NextResponse.json({ success: false, error: "创建订单失败", code: 500 }, { status: 500 });
    }

    // 鍚庣画鎺ュ叆鐪熷疄鏀粯锛堝井淇℃敮锟?/ 鏀粯瀹濓級锛屾浛鎹互涓嬫ā锟?URL
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/pay?orderId=${orderId}`;

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        planId,
        planName: plan.name,
        amount: plan.price,
        currency: "CNY",
        paymentUrl,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const authErr = error as { code: number; message: string };
      return NextResponse.json({ success: false, error: authErr.message, code: authErr.code }, { status: authErr.code });
    }
    console.error("[CREATE ORDER ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
