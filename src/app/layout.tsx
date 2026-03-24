import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DocPrompt AI - AI-Powered Document Processing",
    template: "%s | DocPrompt AI",
  },
  description:
    "智能文档处理平台：AI改写、格式转换、OCR识别、去水印、加水印，一站搞定所有文档需求。",
  keywords: [
    "AI", "document", "PDF", "OCR", "watermark", "rewrite", "file converter",
    "DocPrompt AI", "AI文档改写", "格式转换", "图片去水印", "加水印", "OCR识别", "文档处理",
  ],
  authors: [{ name: "DocPrompt AI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DocPrompt AI",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://docprompt.ai",
    siteName: "DocPrompt AI",
    title: "DocPrompt AI - AI-Powered Document Processing",
    description: "智能文档处理平台：AI改写、格式转换、OCR识别、去水印、加水印。",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocPrompt AI",
    description: "智能文档处理平台",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#165DFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
