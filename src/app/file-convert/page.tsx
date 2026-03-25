"use client";

import { useState } from "react";
import { Download, RotateCcw, Loader2, FileText, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { SUPPORTED_FORMATS } from "@/constants";

const targetFormats = [
  { key: "pdf", label: "PDF", icon: FileText },
  { key: "docx", label: "Word (DOCX)", icon: FileText },
  { key: "pptx", label: "PowerPoint (PPTX)", icon: FileText },
  { key: "xlsx", label: "Excel (XLSX)", icon: FileText },
  { key: "png", label: "PNG", icon: FileText },
  { key: "jpg", label: "JPG", icon: FileText },
  { key: "webp", label: "WebP", icon: FileText },
] as const;

export default function FileConvertPage() {
  const [phase, setPhase] = useState<"upload" | "processing" | "done">("upload");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [targetFormat, setTargetFormat] = useState("pdf");

  const handleProcess = async () => {
    if (!fileName) return;

    setPhase("processing");
    setProgress(0);
    setTaskId("");
    setOutputUrl("");

    try {
      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "file_convert",
          fileUrl: "/api/upload",
          toFormat: targetFormat,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.error || "处理失败");
        setPhase("upload");
        return;
      }

      setTaskId(result.data.taskId);
      await pollTask(result.data.taskId);
    } catch (error) {
      alert("网络错误，请重试");
      setPhase("upload");
    }
  };

  const pollTask = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasks/status?id=${id}`);
        const data = await res.json();

        if (!res.ok) {
          clearInterval(interval);
          setPhase("upload");
          alert(data.error || "查询任务失败");
          return;
        }

        setProgress(data.data.progress || 0);

        if (data.data.status === "completed") {
          clearInterval(interval);
          setPhase("done");
          if (data.data.outputFiles?.[0]?.url) {
            setOutputUrl(data.data.outputFiles[0].url);
          }
        } else if (data.data.status === "failed") {
          clearInterval(interval);
          setPhase("upload");
          alert(data.data.errorMessage || "处理失败");
        }
      } catch {
        clearInterval(interval);
        setPhase("upload");
      }
    }, 1000);
  };

  const handleReset = () => {
    setPhase("upload");
    setProgress(0);
    setFileName("");
    setOutputUrl("");
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
              支持多种文档和图片格式互转
            </p>
          </div>

          <Card padding="lg">
            {/* Upload */}
            {phase === "upload" && (
              <div className="space-y-6">
                <div>
                  <FileUpload
                    accept=".pdf,.docx,.doc,.pptx,.xlsx,.png,.jpg,.jpeg,.webp"
                    hint="支持 PDF、Word、Excel、PPT、图片等格式"
                    onFileSelect={(f) => {
                      setFileName(f.name);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#333] block mb-2">
                    转换为目标格式
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {targetFormats.map((fmt) => {
                      const Icon = fmt.icon;
                      return (
                        <button
                          key={fmt.key}
                          onClick={() => setTargetFormat(fmt.key)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                            targetFormat === fmt.key
                              ? "border-[#165DFF] bg-blue-50"
                              : "border-[#E5E5E5] hover:border-[#999]"
                          )}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-sm">{fmt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleProcess}
                  disabled={!fileName}
                  className="mt-4"
                >
                  <ArrowRight className="w-4 h-4" />
                  开始转换
                </Button>
              </div>
            )}

            {/* Processing */}
            {phase === "processing" && (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                    <Loader2 className="w-6 h-6 text-[#165DFF] animate-spin" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#111]">
                    正在转换...
                  </p>
                </div>
                <ProgressBar value={progress} status="processing" />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="success">转换完成</Badge>
                </div>
                {outputUrl && (
                  <div className="aspect-video bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm text-[#666]">
                        文件已转换完成，可下载
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  {outputUrl && (
                    <Button fullWidth size="lg" onClick={() => window.open(outputUrl, '_blank')}>
                      <Download className="w-4 h-4" />
                      下载文件
                    </Button>
                  )}
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
