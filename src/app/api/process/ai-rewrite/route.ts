export const maxDuration = 300; // 5 minutes for Vercel

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rewriteDocument } from "@/lib/ai";


const BUCKET_NAME = 'docprompt-files';
const REWRITE_STYLES = ["formal", "casual", "academic", "creative", "concise", "expand"] as const;

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
    const { fileUrl, style } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "请提供文件地址", code: 400 }, { status: 400 });
    }
    if (!style || !REWRITE_STYLES.includes(style)) {
      return NextResponse.json({ success: false, error: `改写风格无效，支持: ${REWRITE_STYLES.join(", ")}`, code: 400 }, { status: 400 });
    }

    // 2. Create task
    taskId = crypto.randomUUID();
    await supabase.from("tasks").insert({
      id: taskId,
      user_id: authData.user.id,
      type: "ai_rewrite",
      status: "processing",
      input_files: [{ url: fileUrl }],
      output_files: [],
      progress: 0,
      options: { style },
    });

    await supabase.from("tasks").update({ progress: 10 }).eq("id", taskId);

    // 3. Download file and extract text
    await supabase.from("tasks").update({ progress: 20 }).eq("id", taskId);

    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`下载文件失败: ${fileResponse.status}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const urlPath = new URL(fileUrl).pathname;
    const ext = urlPath.split('.').pop()?.toLowerCase() || '';
    let textContent = '';

    if (ext === 'txt' || ext === 'md') {
      textContent = new TextDecoder('utf-8').decode(fileBuffer);
    } else if (ext === 'pdf') {
      try {
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: Buffer.from(fileBuffer) });
        const pdfData = await parser.getText();
        textContent = pdfData.text;
      } catch {
        throw new Error('PDF 文件解析失败，请转换为 TXT 后再试');
      }
    } else if (ext === 'docx') {
      throw new Error('暂不支持 DOCX 格式，请转换为 TXT 或 PDF 后再试');
    } else {
      textContent = new TextDecoder('utf-8').decode(fileBuffer);
    }

    if (!textContent.trim()) {
      throw new Error('文件内容为空或无法提取文本');
    }

    // 4. Call AI to rewrite
    await supabase.from("tasks").update({ progress: 40 }).eq("id", taskId);

    const rewrittenText = await rewriteDocument(textContent, style);

    if (!rewrittenText?.trim()) {
      throw new Error('AI 改写返回内容为空');
    }

    // 5. Save result to Storage
    await supabase.from("tasks").update({ progress: 80 }).eq("id", taskId);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const outputFileName = `rewritten_${style}_${timestamp}_${random}.txt`;
    const outputKey = `ai-rewrite/${authData.user.id}/${outputFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(outputKey, new Blob([rewrittenText], { type: 'text/plain;charset=utf-8' }), { upsert: true });

    if (uploadError) {
      throw new Error(`保存结果失败: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData!.path);
    const outputUrl = urlData.publicUrl;

    // 6. Update task to completed
    await supabase.from("tasks").update({
      status: "completed",
      progress: 100,
      output_files: [{ url: outputUrl, filename: outputFileName }],
      completed_at: new Date().toISOString(),
    }).eq("id", taskId);

    return NextResponse.json({ success: true, data: { task_id: taskId, status: "completed", output_url: outputUrl } });
  } catch (error) {
    console.error("[AI REWRITE ERROR]", error);

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
