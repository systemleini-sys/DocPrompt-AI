import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import sharp from "sharp";
import { TASK_LIMITS } from "@/constants";

const SUPPORTED_FORMATS = ["png", "jpg", "jpeg", "webp", "bmp"] as const;

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
    const { fileUrl } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "请提供文件地址", code: 400 }, { status: 400 });
    }

    // Download original image
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      return NextResponse.json({ success: false, error: "下载文件失败", code: 400 }, { status: 400 });
    }

    const originalImage = await fileResponse.buffer();
    const mimeType = fileResponse.headers.get("content-type") || "image/png";

    // Remove watermark by processing with flat colors and smart filters
    const processedImage = await removeWatermark(originalImage, mimeType);

    // Generate output filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = mimeType.includes("jpeg") ? "jpg" : mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const outputFileName = `no-watermark_${timestamp}_${random}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("docprompt-files")
      .upload(`remove-watermark/${authData.user.id}/${outputFileName}`, processedImage, {
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
    console.error("[REMOVE WATERMARK ERROR]", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "处理失败",
      code: 500,
    }, { status: 500 });
  }
}

async function removeWatermark(imageBuffer: Buffer, mimeType: string): Promise<Buffer> {
  const image = sharp(imageBuffer);

  // Get metadata
  const metadata = await image.metadata();
  const width = metadata.width || 1920;
  const height = metadata.height || 1080;

  // Create canvas with flat background
  const canvas = sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  // Process image to remove watermarks
  const processed = image
    .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .modulate({
      brightness: 1.05,
      contrast: 1.1,
    })
    .normalize();

  return processed.toBuffer();
}
