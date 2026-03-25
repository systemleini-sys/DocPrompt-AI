import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TASK_LIMITS } from "@/constants";

const BUCKET_NAME = 'docprompt-files';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "未选择文件", code: 400 }, { status: 400 });
    }

    // Check file size
    const maxSize = TASK_LIMITS.max_file_size_mb * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `文件大小超过限制，最大支持 ${TASK_LIMITS.max_file_size_mb}MB`,
        code: 400,
      }, { status: 400 });
    }

    // Generate file path
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop()?.toLowerCase() || "unknown";
    const filePath = `upload/${timestamp}_${random}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`上传失败: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData!.path);

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.publicUrl,
        filename: file.name,
        size: file.size,
        mime_type: file.type,
      }
    });

  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "上传失败",
      code: 500,
    }, { status: 500 });
  }
}
