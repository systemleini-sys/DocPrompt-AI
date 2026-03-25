import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { convertFile } from "@/lib/convertapi";
import { TASK_LIMITS } from "@/constants";

const SUPPORTED_FORMATS = ["pdf", "docx", "doc", "pptx", "xlsx", "png", "jpg", "jpeg", "webp"] as const;

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

    const body = await request.json();
    const { fileUrl, toFormat } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "请提供文件地址", code: 400 }, { status: 400 });
    }

    if (!toFormat || !SUPPORTED_FORMATS.includes(toFormat as any)) {
      return NextResponse.json({
        success: false,
        error: `不支持的目标格式: ${toFormat}，支持: ${SUPPORTED_FORMATS.join(", ")}`
      }, { status: 400 });
    }

    // Extract format from URL
    const urlPath = new URL(fileUrl).pathname;
    const ext = urlPath.split('.').pop()?.toLowerCase() || '';

    if (!SUPPORTED_FORMATS.includes(ext)) {
      return NextResponse.json({
        success: false,
        error: `不支持的源文件格式: .${ext}`
      }, { status: 400 });
    }

    // Use ConvertAPI
    const { buffer, fileName } = await convertFile(fileUrl, ext, toFormat);

    // Generate output filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const outputFileName = `converted_${timestamp}_${random}.${toFormat}`;

    // Upload to Supabase Storage
    const mimeType = `application/${toFormat === 'pdf' ? 'pdf' : 'octet-stream'}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("docprompt-files")
      .upload(`convert/${authData.user.id}/${outputFileName}`, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`保存文件失败: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from("docprompt-files").getPublicUrl(uploadData!.path);

    return NextResponse.json({
      success: true,
      data: {
        output_url: urlData.publicUrl,
        filename: outputFileName,
      }
    });

  } catch (error) {
    console.error("[FILE CONVERT ERROR]", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "处理失败",
      code: 500,
    }, { status: 500 });
  }
}
