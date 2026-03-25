import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import sharp from "sharp";
import { TASK_LIMITS } from "@/constants";

const WATERMARK_TYPES = ["text", "image"] as const;
const POSITIONS = ["center", "top-left", "top-right", "bottom-left", "bottom-right", "tile"] as const;

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
    const { fileUrl, watermarkType, text, fontColor, fontSize, opacity, position, watermarkImageUrl } = body;

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

    let processedImage: sharp.Sharp;

    if (watermarkType === "text") {
      processedImage = await addTextWatermark(originalImage, {
        text,
        fontSize: parseInt(fontSize as string),
        fontColor,
        opacity: parseInt(opacity as string),
        position,
      });
    } else {
      processedImage = await addImageWatermark(originalImage, watermarkImageUrl as string, {
        opacity: parseInt(opacity as string),
        position,
      });
    }

    // Generate output filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = mimeType.includes("jpeg") ? "jpg" : mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const outputFileName = `watermarked_${timestamp}_${random}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("docprompt-files")
      .upload(`watermark/${authData.user.id}/${outputFileName}`, processedImage, {
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
    console.error("[ADD WATERMARK ERROR]", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "处理失败",
      code: 500,
    }, { status: 500 });
  }
}

async function addTextWatermark(
  imageBuffer: Buffer,
  options: {
    text: string;
    fontSize: number;
    fontColor: string;
    opacity: number;
    position: string;
  }
): Promise<sharp.Sharp> {
  const { text, fontSize, fontColor, opacity, position } = options;

  const overlay = sharp({
    create: {
      width: 2000,
      height: 2000,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  // Use SVG overlay for text
  const svg = `
    <svg width="2000" height="2000" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        font-size="${fontSize * 2}"
        fill="${fontColor}"
        fill-opacity="${opacity / 100}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="sans-serif"
      >
        ${text}
      </text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  return sharp(imageBuffer)
    .composite([{
      input: svgBuffer,
      top: 0,
      left: 0,
    }]);
}

async function addImageWatermark(
  imageBuffer: Buffer,
  watermarkImageUrl: string,
  options: {
    opacity: number;
    position: string;
  }
): Promise<sharp.Sharp> {
  const { opacity, position } = options;

  // Download watermark image
  const watermarkResponse = await fetch(watermarkImageUrl);
  if (!watermarkResponse.ok) {
    throw new Error("下载水印图片失败");
  }

  const watermarkBuffer = await watermarkResponse.buffer();
  const watermarkImage = sharp(watermarkBuffer);

  const metadata = await watermarkImage.metadata();
  const watermarkSize = Math.min(metadata.width || 100, metadata.height || 100);

  // Calculate position
  const positions = {
    center: { left: 50, top: 50 },
    top: { left: 50, top: 10 },
    top_left: { left: 10, top: 10 },
    top_right: { left: 90, top: 10 },
    bottom: { left: 50, top: 90 },
    bottom_left: { left: 10, top: 90 },
    bottom_right: { left: 90, top: 90 },
  };

  const pos = positions[position as keyof typeof positions] || positions.center;

  return sharp(imageBuffer)
    .composite([{
      input: watermarkBuffer,
      left: (100 - pos.left) / 100 * 2000,
      top: (100 - pos.top) / 100 * 2000,
      blend: "overlay",
      opacity: opacity / 100,
    }]);
}
