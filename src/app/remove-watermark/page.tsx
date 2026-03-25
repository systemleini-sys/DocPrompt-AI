"use client";

import { useState } from "react";
import { Download, RotateCcw, Loader2, Image as ImageIcon } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

export default function RemoveWatermarkPage() {
  const [phase, setPhase] = useState<"upload" | "processing" | "done">("upload");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [outputUrl, setOutputUrl] = useState("");

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
          type: "remove_watermark",
          fileUrl: "/api/upload",
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
              去除图片水印
            </h1>
            <p className="mt-2 text-[#666] text-sm md:text-base">
              智能识别并去除图片水印，恢复原始画质
            </p>
          </div>

          <Card padding="lg">
            {/* Upload */}
            {phase === "upload" && (
              <div>
                <FileUpload
                  accept=".png,.jpg,.jpeg,.webp"
                  hint="支持 PNG、JPG、WebP 格式"
                  onFileSelect={(f) => {
                    setFileName(f.name);
                  }}
                />
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleProcess}
                  disabled={!fileName}
                  className="mt-6"
                >
                  <Loader2 className="w-4 h-4" />
                  去除水印
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
                    正在处理...
                  </p>
                </div>
                <ProgressBar value={progress} status="processing" />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="success">去除完成</Badge>
                </div>
                {outputUrl && (
                  <div className="relative aspect-video bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
                    <img
                      src={outputUrl}
                      alt="处理结果"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  {outputUrl && (
                    <Button fullWidth size="lg" onClick={() => window.open(outputUrl, '_blank')}>
                      <Download className="w-4 h-4" />
                      下载图片
                    </Button>
                  )}
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                    继续处理
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
