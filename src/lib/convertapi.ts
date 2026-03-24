/**
 * ConvertAPI integration for file format conversion
 */

const CONVERTAPI_SECRET = process.env.CONVERTAPI_SECRET!;

interface ConvertAPIResult {
  Files: { Url: string; FileName: string; FileSize: number }[];
}

/**
 * Convert a file from one format to another using ConvertAPI
 * @param inputUrl - URL or file path of the source file
 * @param fromFormat - Source format (e.g., "pdf", "docx", "png")
 * @param toFormat - Target format (e.g., "docx", "pdf", "png")
 * @returns Buffer of the converted file
 */
export async function convertFile(
  inputUrl: string,
  fromFormat: string,
  toFormat: string
): Promise<{ buffer: Buffer; fileName: string }> {
  const url = `https://v2.convertapi.com/convert/${fromFormat.toLowerCase()}/to/${toFormat.toLowerCase()}?Secret=${CONVERTAPI_SECRET}&StoreFile=true`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Parameters: [{ Name: "File", Value: inputUrl }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ConvertAPI error (${response.status}): ${errorText}`);
  }

  const result: ConvertAPIResult = await response.json();

  if (!result.Files || result.Files.length === 0) {
    throw new Error("ConvertAPI returned no files");
  }

  const fileUrl = result.Files[0].Url;
  const fileName = result.Files[0].FileName;

  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(`Failed to download converted file: ${fileResponse.status}`);
  }

  const buffer = Buffer.from(await fileResponse.arrayBuffer());
  return { buffer, fileName };
}

/**
 * Detect file format from URL/filename extension
 */
export function detectFormatFromUrl(url: string): string {
  // Remove query string and extract extension
  const pathname = url.split("?")[0];
  const match = pathname.match(/\.([a-z0-9]+)$/i);
  if (!match) throw new Error("无法从文件路径中检测格式");
  return match[1].toLowerCase();
}

/**
 * Normalize format names (e.g., "doc" -> "docx" for ConvertAPI compatibility)
 */
export function normalizeFormat(format: string): string {
  const map: Record<string, string> = {
    jpg: "jpg",
    jpeg: "jpg",
    png: "png",
    pdf: "pdf",
    doc: "docx",
    docx: "docx",
    ppt: "pptx",
    pptx: "pptx",
    xls: "xlsx",
    xlsx: "xlsx",
  };
  const normalized = map[format.toLowerCase()];
  if (!normalized) return format.toLowerCase();
  return normalized;
}
