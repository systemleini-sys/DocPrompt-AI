"use client";

import { useState } from "react";
import {
  FileDown,
  FileUp,
  Merge,
  Scissors,
  Minimize2,
  Download,
  RotateCcw,
  Crown,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

type ConvertType =
  | "pdf-to-word"
  | "word-to-pdf"
  | "merge-pdf"
  | "split-pdf"
  | "compress-pdf";

type Phase = "select" | "upload" | "processing" | "done";

const convertTypes: {
  key: ConvertType;
  icon: React.ElementType;
  label: string;
  desc: string;
  accept: string;
  pro?: boolean;
}[] = [
  {
    key: "pdf-to-word",
    icon: FileDown,
    label: "PDF → Word",
    desc: "将 PDF 转换为可编辑的 Word 文档",
    accept: ".pdf",
  },
  {
    key: "word-to-pdf",
    icon: FileUp,
    label: "Word → PDF",
    desc: "将 Word 文档转换为 PDF 格式",
    accept: ".docx,.doc",
  },
  {
    key: "merge-pdf",
    icon: Merge,
    label: "合并 PDF",
    desc: "将多个 PDF 文件合并为一个",
    accept: ".pdf",
  },
  {
    key: "split-pdf",
    icon: Scissors,
    label: "拆分 PDF",
    desc: "按页码范围拆分 PDF 文件",
    accept: ".pdf",
  },
  {
    key: "compress-pdf",
    icon: Minimize2,
    label: "压缩 PDF",
    desc: "减小 PDF 文件体积",
    accept: ".pdf",
  },
];

export default function FileConvertPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [convertType, setConvertType] = useState<ConvertType | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const selected = convertTypes.find((c) => c.key === convertType);

  const handleSelect = (key: ConvertType) => {
    setConvertType(key);
    setPhase("upload");
  };

  const simulateConvert = () => {
    setPhase("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("done");
          return 100;
        }
        return p + Math.random() * 20 + 5;
      });
    }, 250);
  };

  const handleReset = () => {
    setPhase("select");
    setConvertType(null);
    setProgress(0);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header />

      <main className="pt-20 pb-12 px-4 lg:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="py-8 md:py-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111]">
              文件格式转换
            </h1>
            <p className="mt-2 text-[#666] text-sm md:text-base">
              支持多种格式互转，快速、精准、保持原有排版
            </p>
          </div>

          <Card padding="lg">
            {/* Select type */}
            {phase === "select" && (
              <div className="space-y-3">
                {convertTypes.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleSelect(c.key)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left cursor-pointer",
                      "border-[#E5E5E5] hover:border-[#165DFF] hover:bg-blue-50/30"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <c.icon className="w-5 h-5 text-[#165DFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#111]">
                          {c.label}
                        </p>
                        {c.pro && (
                          <Badge variant="warning">
                            <Crown className="w-3 h-3 mr-0.5" />
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#666] mt-0.5">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Upload */}
            {phase === "upload" && selected && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <selected.icon className="w-4 h-4 text-[#165DFF]" />
                    </div>
                    <p className="text-sm font-medium text-[#111]">
                      {selected.label}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-[#666] hover:text-[#111] cursor-pointer"
                  >
                    返回
                  </button>
                </div>

                <FileUpload
                  accept={selected.accept}
                  hint={`请上传 ${selected.accept.replace(/\./g, "").toUpperCase()} 格式文件`}
                  onFileSelect={(f) => {
                    setFileName(f.name);
                  }}
                />

                {fileName && (
                  <Button fullWidth size="lg" onClick={simulateConvert}>
                    开始转换
                  </Button>
                )}
              </div>
            )}

            {/* Processing */}
            {phase === "processing" && (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                    <FileDown className="w-6 h-6 text-[#165DFF]" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#111]">
                    正在转换文件...
                  </p>
                </div>
                <ProgressBar value={progress} status="processing" />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-6 py-2">
                <div className="text-center">
                  <Badge variant="success">转换完成</Badge>
                  <p className="mt-2 text-sm text-[#111]">
                    {fileName || "文件"} 已成功转换
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button fullWidth size="lg">
                    <Download className="w-4 h-4" />
                    下载文件
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                    继续转换
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
