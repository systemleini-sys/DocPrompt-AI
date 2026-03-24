export const maxDuration = 300; // 5 minutes for Vercel

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { extractTextFromImage } from "@/lib/ai";

const BUCKET_NAME = 'docprompt-files';
const SUPPORTED_LANGUAGES = ["zh", "en", "ja", "ko", "fr", "de", "es", "auto"] as const;
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "bmp", "gif", "tiff", "tif"]);
const MIME_TYPE_MAP: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", bmp: "image/bmp", gif: "image/gif",
  tiff: "image/tiff", tif: "image/tiff",
};

export async function POST(request: NextRequest) {
  let taskId: string | undefined;

  try {
    // 1. Auth
    const token = request.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "请先登录", code: 401 }, { status: 401 });
    }

    const { data: authData } = await supabase.auth.getUser(token);
    if (!authData.user) {
      return NextResponse.json({ success: false, error: "登录已过期，请重新登录", code: 401 }, { status: 401 });
    }

    const body = await request.json();
    const { fileUrl, language } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "请提供文件地址", code: 400 }, { status: 400 });
    }
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json({ success: false, error: `不支持的语言: ${language}`, code: 400 }, { status: 400 });
    }

    // 2. Create task
    taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "ocr",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { language },
    });

    // 3. Download file
    await supabase.from("tasks").update({ progress: 10 }).eq("id", taskId);

    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`下载文件失败: ${fileResponse.status}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const urlPath = new URL(fileUrl).pathname;
    const ext = urlPath.split('.').pop()?.toLowerCase() || '';

    let ocrText = '';

    if (IMAGE_EXTENSIONS.has(ext)) {
      // 4a. Image: convert to base64 and call OCR
      await supabase.from("tasks").update({ progress: 30 }).eq("id", taskId);

      const base64 = Buffer.from(fileBuffer).toString('base64');
      const mimeType = MIME_TYPE_MAP[ext] || 'image/png';

      await supabase.from("tasks").update({ progress: 50 }).eq("id", taskId);
      ocrText = await extractTextFromImage(base64, mimeType);
    } else if (ext === 'pdf') {
      // 4b. PDF: extract text with pdf-parse, fallback to not supported
      await supabase.from("tasks").update({ progress: 30 }).eq("id", taskId);

      try {
        const pdfParse = (await import('pdf-parse')) as unknown as (buffer: Buffer) => Promise<{ text: string }>;
        const pdfData = await pdfParse(Buffer.from(fileBuffer));
        ocrText = pdfData.text;
      } catch (pdfError) {
        console.error("[OCR PDF PARSE ERROR]", pdfError);
        throw new Error('PDF 文件解析失败');
      }
    } else {
      throw new Error(`不支持的文件格式: .${ext}，请上传图片（PNG/JPG/WebP）或 PDF`);
    }

    if (!ocrText?.trim()) {
      throw new Error('未能识别到文字内容，请确认图片或 PDF 包含清晰的文字');
    }

    // 5. Save result to Storage
    await supabase.from("tasks").update({ progress: 80 }).eq("id", taskId);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const outputFileName = `ocr_${timestamp}_${random}.txt`;
    const outputKey = `ocr/${authData.user.id}/${outputFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(outputKey, new Blob([ocrText], { type: 'text/plain;charset=utf-8' }), { upsert: true });

    if (uploadError) {
      throw new Error(`保存结果失败: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData!.path);
    const outputUrl = urlData.publicUrl;

    // 6. Update task to completed
    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl, filename: outputFileName, text: ocrText }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "completed", output_url: outputUrl } });
  } catch (error) {
    console.error("[OCR ERROR]", error);

    if (taskId) {
      await supabase.from("tasks").update({
        status: "failed",
        error_message: error instanceof Error ? error.message : "处理失败",
      }).eq("id", taskId);
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "服务器内部错误",
      code: 500,
    }, { status: 500 });
  }
}
