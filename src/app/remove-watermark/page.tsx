"use client";

import { useState } from "react";
import { ImageOff, Download, RotateCcw, Eye, EyeOff, SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";

type Phase = "upload" | "settings" | "processing" | "done";

export default function RemoveWatermarkPage() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [progress, setProgress] = useState(0);
  const [strength, setStrength] = useState(75);
  const [showComparison, setShowComparison] = useState(true);
  const [fileName, setFileName] = useState("");

  const simulateProcess = () => {
    setPhase("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("done");
          return 100;
        }
        return p + Math.random() * 12 + 4;
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
          <div className="py-8 md:py-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111]">
              图片去水印
            </h1>
            <p className="mt-2 text-[#666] text-sm md:text-base">
              AI 智能识别并去除图片水印，恢复原始画质
            </p>
          </div>

          <Card padding="lg">
            {/* Upload */}
            {phase === "upload" && (
              <FileUpload
                accept=".png,.jpg,.jpeg,.webp"
                hint="支持 PNG、JPG、WebP 格式，单个文件不超过 50MB"
                onFileSelect={(f) => {
                  setFileName(f.name);
                  setPhase("settings");
                }}
              />
            )}

            {/* Settings */}
            {phase === "settings" && (
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
                  <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="w-4 h-4 text-[#666]" />
                    <p className="text-sm font-medium text-[#111]">处理参数</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#333]">修复强度</span>
                        <span className="text-sm text-[#666]">{strength}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={strength}
                        onChange={(e) => setStrength(Number(e.target.value))}
                        className="w-full h-2 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#165DFF]"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-[#999]">轻柔</span>
                        <span className="text-xs text-[#999]">强力</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview placeholder */}
                <div className="relative aspect-video bg-[#F7F7F7] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <ImageOff className="w-10 h-10 text-[#999] mx-auto" />
                      <p className="mt-2 text-sm text-[#999]">图片预览</p>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={simulateProcess}>
                  <ImageOff className="w-4 h-4" />
                  开始去水印
                </Button>
              </div>
            )}

            {/* Processing */}
            {phase === "processing" && (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto animate-pulse">
                    <ImageOff className="w-6 h-6 text-[#165DFF]" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#111]">
                    AI 正在去除水印...
                  </p>
                  <p className="text-xs text-[#999] mt-1">
                    智能修复中，请稍候
                  </p>
                </div>
                <ProgressBar value={progress} status="processing" />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="success">去水印完成</Badge>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-1.5 text-sm text-[#666] hover:text-[#111] cursor-pointer"
                  >
                    {showComparison ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {showComparison ? "隐藏对比" : "显示对比"}
                  </button>
                </div>

                {/* Comparison */}
                {showComparison && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-video bg-[#F7F7F7] rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs font-medium text-[#999] mb-2">处理前</p>
                        <div className="w-32 h-20 bg-[#E5E5E5] rounded-lg flex items-center justify-center">
                          <ImageOff className="w-6 h-6 text-[#999]" />
                        </div>
                      </div>
                    </div>
                    <div className="aspect-video bg-blue-50/50 rounded-xl flex items-center justify-center border border-blue-100">
                      <div className="text-center">
                        <p className="text-xs font-medium text-[#165DFF] mb-2">处理后</p>
                        <div className="w-32 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">✨</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button fullWidth size="lg">
                    <Download className="w-4 h-4" />
                    下载图片
                  </Button>
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
