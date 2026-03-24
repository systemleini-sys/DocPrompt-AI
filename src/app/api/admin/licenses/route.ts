export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

// GET: 获取激活码列表（管理后台）
export async function GET(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: "鏈櫥锟?", code: 401 }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    // TODO: 接入 Supabase
    // const { data, count } = await supabase
    //   .from("licenses")
    //   .select("*", { count: "exact" })
    //   .eq(status === "used" ? "used" : "id", status === "used" ? 1 : undefined)
    //   .range(offset, offset + pageSize - 1)
    //   .order("id", { ascending: false });

    return NextResponse.json({
      success: true,
      data: {
        list: [
          { id: 1, code: "DOCPROMO-BASIC-XXXX1", level: 1, used: 1, user_id: 101, used_at: "2026-03-20T10:00:00Z" },
          { id: 2, code: "DOCPROMO-PRO-XXXX2", level: 2, used: 0, user_id: null, used_at: null },
          { id: 3, code: "DOCPROMO-LIFETIME-XXXX3", level: 3, used: 0, user_id: null, used_at: null },
        ],
        total: 3,
        page,
        pageSize,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "获取激活码列表失败", code: 500 }, { status: 500 });
  }
}

// POST: 鎵归噺鐢熸垚婵€娲荤爜
export async function POST(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: "鏈櫥锟?", code: 401 }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { count = 1, level = 1 } = body;

    if (!count || count < 1 || count > 100) {
      return NextResponse.json({ success: false, error: "鐢熸垚鏁伴噺椤诲湪 1-100 涔嬮棿", code: 400 }, { status: 400 });
    }

    if (![1, 2, 3].includes(level)) {
      return NextResponse.json({ success: false, error: "无效的等级", code: 400 }, { status: 400 });
    }

    const levelNames: Record<number, string> = { 1: "BASIC", 2: "PRO", 3: "LIFETIME" };

    const codes = Array.from({ length: count }, () => ({
      code: `DOCPROMO-${levelNames[level]}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      level,
      used: 0,
      user_id: null,
      used_at: null,
    }));

    // TODO: 鎵归噺鎻掑叆 Supabase
    // await supabase.from("licenses").insert(codes);

    return NextResponse.json({
      success: true,
      data: { generated: count, codes },
    });
  } catch {
    return NextResponse.json({ success: false, error: "生成激活码失败", code: 500 }, { status: 500 });
  }
}
