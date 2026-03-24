"use client";

import { FileText, Download, RefreshCw, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";

type TaskStatus = "pending" | "processing" | "completed" | "error";

interface TaskCardProps {
  fileName: string;
  fileType: string;
  status: TaskStatus;
  time: string;
  onDownload?: () => void;
  onRetry?: () => void;
  onDelete?: () => void;
}

const statusMap: Record<TaskStatus, { label: string; variant: "info" | "warning" | "success" | "error" }> = {
  pending: { label: "等待中", variant: "info" },
  processing: { label: "处理中", variant: "warning" },
  completed: { label: "已完成", variant: "success" },
  error: { label: "失败", variant: "error" },
};

export default function TaskCard({
  fileName,
  fileType,
  status,
  time,
  onDownload,
  onRetry,
  onDelete,
}: TaskCardProps) {
  const { label, variant } = statusMap[status];

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-[#165DFF]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#111] truncate">{fileName}</p>
        <p className="text-xs text-[#999] mt-0.5">
          {fileType} · {time}
        </p>
      </div>

      <Badge variant={variant}>{label}</Badge>

      <div className="flex items-center gap-1 shrink-0">
        {status === "completed" && (
          <button
            onClick={onDownload}
            className="p-2 rounded-lg text-[#666] hover:bg-[#F7F7F7] hover:text-[#165DFF] transition-colors cursor-pointer"
            title="下载"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        {status === "error" && (
          <button
            onClick={onRetry}
            className="p-2 rounded-lg text-[#666] hover:bg-[#F7F7F7] hover:text-[#165DFF] transition-colors cursor-pointer"
            title="重试"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-[#999] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
          title="删除"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
