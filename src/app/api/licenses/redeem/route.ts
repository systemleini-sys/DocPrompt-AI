export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

const LICENSE_PLANS: Record<string, { days: number | null; features: string[] }> = {
  basic: { days: 30, features: ["daily_tasks:50", "max_file_size_mb:50", "max_concurrent_tasks:3"] },
  pro: { days: 30, features: ["daily_tasks:200", "max_file_size_mb:200", "max_concurrent_tasks:5"] },
  lifetime: { days: null, features: ["daily_tasks:999", "max_file_size_mb:500", "max_concurrent_tasks:10"] },
};

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "请提供激活码", code: 400 }, { status: 400 });
    }

    const trimmedCode = code.trim().toUpperCase();

    const { data: license, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("code", trimmedCode)
      .single();

    if (error || !license) {
      return NextResponse.json({ success: false, error: "激活码不存在", code: 404 }, { status: 404 });
    }
    if (license.used) {
      return NextResponse.json({ success: false, error: "该激活码已被使用", code: 400 }, { status: 400 });
    }
    if (!LICENSE_PLANS[license.level]) {
      return NextResponse.json({ success: false, error: "激活等级无效", code: 400 }, { status: 400 });
    }

    const plan = LICENSE_PLANS[license.level];
    const now = new Date().toISOString();
    const expiresAt = plan.days ? new Date(Date.now() + plan.days * 86400000).toISOString() : null;

    const [updateLicense, updateUser] = await Promise.all([
      supabase
        .from("licenses")
        .update({ used: true, user_id: user.id, used_at: now })
        .eq("code", trimmedCode),
      supabase
        .from("users")
        .update({
          license: { type: license.level, expires_at: expiresAt, features: plan.features },
          limits: {
            daily_tasks: plan.days === null ? 999 : license.level === "basic" ? 50 : 200,
            max_file_size_mb: plan.days === null ? 500 : license.level === "basic" ? 50 : 200,
            max_concurrent_tasks: plan.days === null ? 10 : license.level === "basic" ? 3 : 5,
            max_file_count_per_task: 20,
          },
          updated_at: now,
        })
        .eq("id", user.id),
    ]);

    if (updateLicense.error || updateUser.error) {
      console.error("[REDEEM LICENSE ERROR]", updateLicense.error, updateUser.error);
      return NextResponse.json({ success: false, error: "激活失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { activated: true, level: license.level, expiresAt },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const authErr = error as { code: number; message: string };
      return NextResponse.json({ success: false, error: authErr.message, code: authErr.code }, { status: authErr.code });
    }
    console.error("[REDEEM LICENSE ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
