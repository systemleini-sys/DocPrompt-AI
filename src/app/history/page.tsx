"use client";

import { useState } from "react";
import { Trash2, Inbox } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TaskCard from "@/components/features/TaskCard";

type FilterType = "all" | "ai_rewrite" | "ocr" | "file_convert" | "remove_watermark" | "add_watermark";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "ai_rewrite", label: "AI改写" },
  { key: "ocr", label: "OCR" },
  { key: "file_convert", label: "格式转换" },
  { key: "remove_watermark", label: "去水印" },
  { key: "add_watermark", label: "加水印" },
];

const mockTasks = [
  { id: 1, fileName: "项目需求文档.docx", fileType: "AI改写", type: "ai_rewrite" as const, status: "completed" as const, time: "2小时前" },
  { id: 2, fileName: "发票扫描件.pdf", fileType: "OCR识别", type: "ocr" as const, status: "completed" as const, time: "5小时前" },
  { id: 3, fileName: "产品图片.jpg", fileType: "图片去水印", type: "remove_watermark" as const, status: "processing" as const, time: "10分钟前" },
  { id: 4, fileName: "年度报告.pptx", fileType: "格式转换", type: "file_convert" as const, status: "completed" as const, time: "昨天" },
  { id: 5, fileName: "团队合照.png", fileType: "加水印", type: "add_watermark" as const, status: "error" as const, time: "2天前" },
  { id: 6, fileName: "合同文件.pdf", fileType: "AI改写", type: "ai_rewrite" as const, status: "completed" as const, time: "3天前" },
  { id: 7, fileName: "身份证扫描.jpg", fileType: "OCR识别", type: "ocr" as const, status: "completed" as const, time: "5天前" },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showClearModal, setShowClearModal] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.type === filter);

  const handleClear = () => {
    setTasks([]);
    setShowClearModal(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-[#111]">任务历史</h1>
            {tasks.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setShowClearModal(true)}>
                <Trash2 className="w-4 h-4" />
                清空全部
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                  filter === f.key
                    ? "bg-[#165DFF] text-white"
                    : "bg-white text-[#666] border border-[#E5E5E5] hover:border-[#999]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Task List */}
          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  fileName={task.fileName}
                  fileType={task.fileType}
                  status={task.status}
                  time={task.time}
                  onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                />
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <Inbox className="w-10 h-10 text-[#E5E5E5] mx-auto mb-3" />
              <p className="text-sm text-[#999]">
                {tasks.length === 0 ? "暂无任务记录" : "该类型暂无任务"}
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      <Modal open={showClearModal} onClose={() => setShowClearModal(false)} title="确认清空" size="sm">
        <p className="text-sm text-[#666] mb-6">确定要清空所有任务记录吗？此操作不可撤销。</p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setShowClearModal(false)}>
            取消
          </Button>
          <Button variant="primary" fullWidth onClick={handleClear}>
            确认清空
          </Button>
        </div>
      </Modal>
    </>
  );
}
