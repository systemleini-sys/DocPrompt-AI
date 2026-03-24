"use client";

import { useState } from "react";
import { ScanText, Download, Copy, Check, RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

type Lang = "zh" | "en" | "auto";
type Phase = "upload" | "options" | "processing" | "done";

const languages: { key: Lang; label: string }[] = [
  { key: "auto", label: "自动识别" },
  { key: "zh", label: "中文" },
  { key: "en", label: "英文" },
];

const sampleResult = `DocPrompt AI - 智能文档处理平台

产品介绍
DocPrompt AI 是一款基于人工智能技术的文档处理工具，提供以下核心功能：

1. AI 文档改写 - 智能改写文档内容，支持多种风格
2. 格式转换 - PDF、Word 等格式互转
3. OCR 识别 - 精准识别图片和 PDF 中的文字
4. 图片去水印 - AI 智能去除图片水印
5. 自定义加水印 - 为图片添加个性化水印

联系方式
邮箱：support@docprompt.ai
官网：https://docprompt.ai`;

export default function OcrPage() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [lang, setLang] = useState<Lang>("auto");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");

  const simulateOcr = () => {
    setPhase("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("done");
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPhase("upload");
    setProgress(0);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header />

      <main className="pt-20 pb-12 px-4 lg:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="py-8 md:py-12 text-center">
            <Badge variant="info">精准识别</Badge>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold text-[#111]">
              OCR 文字识别
            </h1>
            <p className="mt-2 text-[#666] text-sm md:text-base">
              上传图片或 PDF，AI 快速提取文字内容
            </p>
          </div>

          <Card padding="lg">
            {/* Upload */}
            {phase === "upload" && (
              <FileUpload
                accept=".png,.jpg,.jpeg,.webp,.pdf"
                hint="支持 PNG、JPG、WebP、PDF 格式，单个文件不超过 50MB"
                onFileSelect={(f) => {
                  setFileName(f.name);
                  setPhase("options");
                }}
              />
            )}

            {/* Options */}
            {phase === "options" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#111]">
                    已选择：{fileName}
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-sm text-[#666] hover:text-[#111] cursor-pointer"
                  >
                    重新选择
                  </button>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#111] mb-3">
                    识别语言
                  </p>
                  <div className="flex gap-2">
                    {languages.map((l) => (
                      <button
                        key={l.key}
                        onClick={() => setLang(l.key)}
                        className={cn(
                          "px-5 py-2.5 text-sm rounded-xl border-2 transition-all cursor-pointer",
                          lang === l.key
                            ? "border-[#165DFF] bg-blue-50/50 text-[#165DFF] font-medium"
                            : "border-[#E5E5E5] text-[#333] hover:border-[#999]"
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={simulateOcr}>
                  <ScanText className="w-4 h-4" />
                  开始识别
                </Button>
              </div>
            )}

            {/* Processing */}
            {phase === "processing" && (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                    <ScanText className="w-6 h-6 text-[#165DFF]" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#111]">
                    AI 正在识别文字...
                  </p>
                  <p className="text-xs text-[#999] mt-1">
                    正在分析图像内容
                  </p>
                </div>
                <ProgressBar value={progress} status="processing" />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="success">识别完成</Badge>
                  <span className="text-xs text-[#999]">
                    共识别约 200 字
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={sampleResult}
                    className="w-full h-64 p-4 bg-[#F7F7F7] rounded-xl text-sm text-[#111] leading-relaxed resize-none outline-none border-none font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-[#E5E5E5] text-xs text-[#666] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        复制
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button fullWidth size="lg">
                    <Download className="w-4 h-4" />
                    下载 TXT
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                    继续识别
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer locale="en" />
    </div>
  );
}
