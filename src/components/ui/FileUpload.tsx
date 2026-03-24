"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, File, X, CheckCircle, AlertCircle } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "done" | "error";

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileSelect?: (file: File) => void;
  hint?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function FileUpload({
  accept,
  maxSize = 50 * 1048576,
  onFileSelect,
  hint = "支持 PDF、Word、Excel、PPT、图片等格式，单个文件不超过 50MB",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      if (f.size > maxSize) {
        setStatus("error");
        setFile(f);
        return;
      }
      setStatus("uploading");
      setFile(f);
      onFileSelect?.(f);
      setTimeout(() => setStatus("done"), 800);
    },
    [maxSize, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const clear = useCallback(() => {
    setFile(null);
    setStatus("idle");
  }, []);

  return (
    <div className="w-full">
      {file ? (
        <div className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-xl">
          <File className="w-8 h-8 text-[#165DFF] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#111] truncate">
              {file.name}
            </p>
            <p className="text-xs text-[#666]">{formatSize(file.size)}</p>
          </div>
          {status === "uploading" && (
            <div className="w-4 h-4 border-2 border-[#165DFF] border-t-transparent rounded-full animate-spin" />
          )}
          {status === "done" && (
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          )}
          {status === "error" && (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          )}
          <button
            onClick={clear}
            className="p-1 rounded-lg text-[#999] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed rounded-2xl
            cursor-pointer transition-colors duration-150
            ${dragOver ? "border-[#165DFF] bg-blue-50/50" : "border-[#E5E5E5] hover:border-[#999]"}
          `}
        >
          <UploadCloud className={`w-10 h-10 ${dragOver ? "text-[#165DFF]" : "text-[#999]"}`} />
          <div className="text-center">
            <p className="text-sm font-medium text-[#333]">
              拖拽文件到此处，或 <span className="text-[#165DFF]">点击上传</span>
            </p>
            <p className="text-xs text-[#999] mt-1">{hint}</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
