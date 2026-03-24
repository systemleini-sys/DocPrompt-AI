export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

const CN_COUNTRY_CODES = ["CN", "HK", "MO", "TW"];

export async function GET(request: NextRequest) {
  try {
    const country =
      request.headers.get("cf-ipcountry") ??
      request.headers.get("x-vercel-ip-country") ??
      null;

    if (country) {
      const isCn = CN_COUNTRY_CODES.includes(country.toUpperCase());
      return NextResponse.json({
        success: true,
        data: {
          region: isCn ? "cn" : "intl",
          country,
        },
      });
    }

    const xff = request.headers.get("x-forwarded-for");
    const ip = xff ? xff.split(",")[0].trim() : null;

    if (ip && (ip.startsWith("10.") || ip.startsWith("172.") || ip.startsWith("192.168.") || ip === "::1" || ip === "127.0.0.1")) {
      return NextResponse.json({
        success: true,
        data: { region: "cn", country: "CN", ip },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        region: "intl",
        country: null,
        ip,
      },
    });
  } catch (error) {
    console.error("[GEO ERROR]", error);
    return NextResponse.json({ success: false, error: "服务器内部错误", code: 500 }, { status: 500 });
  }
}
