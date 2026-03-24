export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadFile, generateFileKey } from "@/lib/supabase-storage";
import { UPLOAD_LIMITS } from "@/constants";

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "请选择要上传的文件", code: 400 }, { status: 400 });
    }

    if (!UPLOAD_LIMITS.allowed_mime_types.includes(file.type as typeof UPLOAD_LIMITS.allowed_mime_types[number])) {
      return NextResponse.json({ success: false, error: `不支持的文件类型: ${file.type}`, code: 400 }, { status: 400 });
    }

    const maxSize = UPLOAD_LIMITS.max_file_size_mb * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: `文件大小超过限制（最大${UPLOAD_LIMITS.max_file_size_mb}MB）`, code: 400 }, { status: 400 });
    }

    const fileKey = generateFileKey(authData.user.id, file.name);
    const fileUrl = await uploadFile(file, fileKey);

    const result = {
      file_id: crypto.randomUUID(),
      filename: file.name,
      url: fileUrl,
      size: file.size,
      mime_type: file.type,
      file_key: fileKey,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json({ success: false, error: "文件上传失败", code: 500 }, { status: 500 });
  }
}
