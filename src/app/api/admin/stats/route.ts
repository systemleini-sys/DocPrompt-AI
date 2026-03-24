export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const [usersRes, activeRes, tasksRes, ordersRes] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id", { count: "exact", head: true }).gte("last_login_at", todayISO),
      supabase.from("tasks").select("id", { count: "exact", head: true }).gte("created_at", todayISO),
      supabase.from("orders").select("amount", { count: "exact", head: true }).eq("status", "paid"),
    ]);

    const totalRevenue = (ordersRes.data ?? []).reduce((sum: number, o: { amount: number }) => sum + (o.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: usersRes.count ?? 0,
        todayActiveUsers: activeRes.count ?? 0,
        todayTasks: tasksRes.count ?? 0,
        totalRevenue,
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      const authErr = error as { code: number; message: string };
      return NextResponse.json({ success: false, error: authErr.message, code: authErr.code }, { status: authErr.code });
    }
    console.error("[ADMIN STATS ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
