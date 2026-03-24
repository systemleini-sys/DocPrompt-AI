export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: share, error } = await supabase
      .from("share_links")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error || !share) {
      return NextResponse.json({ success: false, error: "分享链接不存在或已失效", code: 404 }, { status: 404 });
    }

    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      await supabase.from("share_links").update({ is_active: false }).eq("id", id);
      return NextResponse.json({ success: false, error: "分享链接已过期", code: 410 }, { status: 410 });
    }

    if (share.max_downloads && share.download_count >= share.max_downloads) {
      return NextResponse.json({ success: false, error: "鍒嗕韩閾炬帴宸茶揪涓嬭浇涓婇檺", code: 410 }, { status: 410 });
    }

    const { data: task } = await supabase
      .from("tasks")
      .select("id, type, status, output_files")
      .eq("id", share.task_id)
      .single();

    await supabase
      .from("share_links")
      .update({ download_count: (share.download_count ?? 0) + 1 })
      .eq("id", id);

    return NextResponse.json({ success: true, data: { share, task } });
  } catch (error) {
    console.error("[SHARE ACCESS ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ success: false, error: "登录已过期，请重新登录", code: 401 }, { status: 401 });
    }

    const { id } = await params;

    const { data: share } = await supabase
      .from("share_links")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (!share) {
      return NextResponse.json({ success: false, error: "分享链接不存在", code: 404 }, { status: 404 });
    }

    if (share.user_id !== authData.user.id) {
      return NextResponse.json({ success: false, error: "无权操作此分享链接", code: 403 }, { status: 403 });
    }

    const { error } = await supabase.from("share_links").update({ is_active: false }).eq("id", id);
    if (error) {
      console.error("[SHARE DELETE ERROR]", error);
      return NextResponse.json({ success: false, error: "删除分享链接失败", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[SHARE DELETE ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
