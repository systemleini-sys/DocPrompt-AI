"use client";

import { useState } from "react";
import { Sparkles, Download, RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import QuotaBar from "@/components/features/QuotaBar";
import { cn } from "@/lib/utils";

type Style = "formal" | "casual" | "academic" | "creative";
type Phase = "upload" | "options" | "processing" | "done";

const styles: { key: Style; label: string; desc: string }[] = [
  { key: "formal", label: "正式", desc: "适用于商务、公文等正式场合" },
  { key: "casual", label: "通俗", desc: "通俗易懂，适合日常阅读" },
  { key: "academic", label: "学术", desc: "专业术语，适合学术论文" },
  { key: "creative", label: "创意", desc: "更有表现力的创意写法" },
];

const originalText =
  "人工智能技术在近年来取得了显著的进展，特别是在自然语言处理领域。大语言模型的出现使得机器能够更好地理解和生成人类语言，这为文档处理、内容创作等领域带来了革命性的变化。";

const rewrittenTexts: Record<Style, string> = {
  formal:
    "近年来，人工智能技术实现了长足发展，其中自然语言处理领域的突破尤为突出。大语言模型的问世，大幅提升了机器在理解与生成人类语言方面的能力，由此推动了文档处理及内容创作等行业发生深刻变革。",
  casual:
    "最近几年 AI 技术进步特别快，尤其是自然语言处理这块。大语言模型让电脑越来越懂我们说的话了，写东西、处理文件这些事都变得轻松不少。",
  academic:
    "人工智能技术在近年的研究中取得了里程碑式进展，尤其体现在自然语言处理（NLP）领域。基于 Transformer 架构的大规模预训练语言模型（LLM）显著增强了机器在语义理解与文本生成方面的性能，从而深刻影响了文档智能处理与自动化内容生成等应用方向。",
  creative:
    'AI 正在以惊人速度进化，尤其是让机器真正"读懂"和"写好"人类语言这件事。大语言模型的诞生，就像给文档处理和内容创作装上了一台强大的引擎——一切都在被重新定义。',
};

export default function AIRewritePage() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [selectedStyle, setSelectedStyle] = useState<Style>("formal");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const simulateProcessing = () => {
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
          {/* Header */}
          <div className="py-8 md:py-12 text-center">
            <Badge variant="info">AI 驱动</Badge>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold text-[#111]">
              AI 文档改写
            </h1>
            <p className="mt-2 text-[#666] text-sm md:text-base">
              上传文档，选择改写风格，AI 为你生成高质量的改写版本
            </p>
          </div>

          {/* Quota */}
          <div className="mb-6">
            <QuotaBar used={2} total={3} />
          </div>

          <Card padding="lg">
            {/* Upload */}
            {phase === "upload" && (
              <div className="space-y-4">
                <FileUpload
                  accept=".docx,.pdf,.txt,.md"
                  hint="支持 DOCX、PDF、TXT、Markdown 格式，单个文件不超过 50MB"
                  onFileSelect={(f) => {
                    setFileName(f.name);
                    setPhase("options");
                  }}
                />
              </div>
            )}

            {/* Options */}
            {phase === "options" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#111]">
                    已选择：{fileName || "未命名文件"}
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
                    选择改写风格
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setSelectedStyle(s.key)}
                        className={cn(
                          "text-left p-4 rounded-xl border-2 transition-all cursor-pointer",
                          selectedStyle === s.key
                            ? "border-[#165DFF] bg-blue-50/50"
                            : "border-[#E5E5E5] hover:border-[#999]"
                        )}
                      >
                        <p className="text-sm font-medium text-[#111]">
                          {s.label}
                        </p>
                        <p className="text-xs text-[#666] mt-0.5">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={simulateProcessing}>
                  <Sparkles className="w-4 h-4" />
                  开始改写
                </Button>
              </div>
            )}

            {/* Processing */}
            {phase === "processing" && (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="w-6 h-6 text-[#165DFF]" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#111]">
                    AI 正在改写文档...
                  </p>
                  <p className="text-xs text-[#999] mt-1">
                    这可能需要几秒钟
                  </p>
                </div>
                <ProgressBar
                  value={progress}
                  status="processing"
                />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#111]">
                    改写完成
                    <Badge variant="success" className="ml-2">
                      {styles.find((s) => s.key === selectedStyle)?.label}风格
                    </Badge>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="p-4 bg-[#F7F7F7] rounded-xl">
                    <p className="text-xs font-medium text-[#999] uppercase tracking-wide mb-2">
                      原文
                    </p>
                    <p className="text-sm text-[#333] leading-relaxed">
                      {originalText}
                    </p>
                  </div>
                  {/* Rewritten */}
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="text-xs font-medium text-[#165DFF] uppercase tracking-wide mb-2">
                      改写后
                    </p>
                    <p className="text-sm text-[#111] leading-relaxed">
                      {rewrittenTexts[selectedStyle]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button fullWidth size="lg">
                    <Download className="w-4 h-4" />
                    下载改写文档
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4" />
                    继续改写
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
