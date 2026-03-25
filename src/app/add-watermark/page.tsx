"use client";

import { useState } from "react";
import { Stamp, Download, RotateCcw, Type, Image as ImageIcon, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type WmType = "text" | "image";
type Phase = "upload" | "settings" | "preview" | "processing" | "done";

const positions = [
  { key: "center", label: "居中" },
  { key: "bottom-right", label: "右下角" },
  { key: "bottom-left", label: "左下角" },
  { key: "top-right", label: "右上角" },
  { key: "top-left", label: "左上角" },
  { key: "tile", label: "平铺" },
];

export default function AddWatermarkPage() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [wmType, setWmType] = useState<WmType>("text");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [taskId, setTaskId] = useState("");
  const [outputUrl, setOutputUrl] = useState("");

  // Text watermark settings
  const [wmText, setWmText] = useState("DocPrompt AI");
  const [fontSize, setFontSize] = useState(32);
  const [wmColor, setWmColor] = useState("#000000");
  const [opacity, setOpacity] = useState(30);
  const [position, setPosition] = useState("bottom-right");

  const handleProcess = async () => {
    setPhase("processing");
    setProgress(0);
    setTaskId("");
    setOutputUrl("");

    try {
      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "add_watermark",
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
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header />

      <main className="pt-20 pb-12 px-4 lg:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 p-4 rounded-card bg-amber-50 border border-amber-200 text-amber-800">
            <p className="font-medium">🚧 功能建设中</p>
            <p className="text-sm mt-1">该功能正在开发中，敬请期待。</p>
          </div>
          <div className="py-8 md:py-12 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111]">
              自定义加水印
            </h1>
            <p className="mt-2 text-[#666] text-sm md:text-base">
              为图片添加文字或图片水印，保护你的原创内容
            </p>
          </div>

          <Card padding="lg">
            {/* Upload */}
            {phase === "upload" && (
              <FileUpload
                accept=".png,.jpg,.jpeg,.webp"
                hint="支持 PNG、JPG、WebP 格式"
                onFileSelect={(f) => {
                  setFileName(f.name);
                  setPhase("settings");
                }}
              />
            )}

            {/* Settings */}
            {(phase === "settings" || phase === "preview") && (
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

                {/* Type toggle */}
                <div className="flex gap-2 p-1 bg-[#F7F7F7] rounded-xl">
                  {(
                    [
                      { key: "text", icon: Type, label: "文字水印" },
                      { key: "image", icon: ImageIcon, label: "图片水印" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setWmType(t.key)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer",
                        wmType === t.key
                          ? "bg-white text-[#111] shadow-sm"
                          : "text-[#666]"
                      )}
                    >
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Text settings */}
                {wmType === "text" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#333]">
                        水印文字
                      </label>
                      <input
                        type="text"
                        value={wmText}
                        onChange={(e) => setWmText(e.target.value)}
                        placeholder="输入水印文字"
                        className="mt-1.5 w-full h-11 px-4 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#111] outline-none focus:border-[#165DFF] transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#333]">字体大小</span>
                        <span className="text-sm text-[#666]">{fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min={12}
                        max={120}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-2 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#165DFF]"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#333]">水印颜色</label>
                      <div className="mt-1.5 flex items-center gap-3">
                        <input
                          type="color"
                          value={wmColor}
                          onChange={(e) => setWmColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-[#E5E5E5] cursor-pointer"
                        />
                        <span className="text-sm text-[#666]">{wmColor}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image watermark */}
                {wmType === "image" && (
                  <div>
                    <label className="text-sm font-medium text-[#333]">
                      上传水印图片
                    </label>
                    <div className="mt-1.5">
                      <FileUpload
                        accept=".png,.jpg,.jpeg,.webp,.svg"
                        hint="推荐使用透明背景的 PNG 或 SVG"
                        onFileSelect={() => {}}
                      />
                    </div>
                  </div>
                )}

                {/* Common settings */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#333]">透明度</span>
                      <span className="text-sm text-[#666]">{opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-[#E5E5E5] rounded-full appearance-none cursor-pointer accent-[#165DFF]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#333] mb-2 block">
                      水印位置
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {positions.map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setPosition(p.key)}
                          className={cn(
                            "py-2 px-3 text-xs rounded-lg border transition-all cursor-pointer",
                            position === p.key
                              ? "border-[#165DFF] bg-blue-50 text-[#165DFF] font-medium"
                              : "border-[#E5E5E5] text-[#666] hover:border-[#999]"
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="relative aspect-video bg-[#F7F7F7] rounded-xl overflow-hidden flex items-center justify-center">
                  <div
                    className="text-lg font-medium select-none"
                    style={{
                      color: wmType === "text" ? wmColor : "#000",
                      opacity: opacity / 100,
                      fontSize: `${Math.min(fontSize, 48)}px`,
                    }}
                  >
                    {wmType === "text" ? wmText : "水印预览"}
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={handleProcess}>
                  <Stamp className="w-4 h-4" />
                  添加水印
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
                    正在添加水印...
                  </p>
                </div>
                <ProgressBar value={progress} status="processing" />
              </div>
            )}

            {/* Done */}
            {phase === "done" && (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="success">水印添加完成</Badge>
                </div>
                {outputUrl && (
                  <div className="relative aspect-video bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
                    <img
                      src={outputUrl}
                      alt="水印预览"
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
