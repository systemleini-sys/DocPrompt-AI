"use client";

import { useState } from "react";
import { Copy, Trash2, Link as LinkIcon, Check, ExternalLink } from "lucide-react";

interface ShareLinkCardProps {
  fileName: string;
  link: string;
  views: number;
  expiresAt?: string;
  onCopy?: () => void;
  onDelete?: () => void;
}

export default function ShareLinkCard({
  fileName,
  link,
  views,
  expiresAt,
  onCopy,
  onDelete,
}: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#F7F7F7] flex items-center justify-center shrink-0">
          <LinkIcon className="w-4 h-4 text-[#165DFF]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#111] truncate">{fileName}</p>
          <p className="text-xs text-[#999] truncate">{link}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#666]">
        <span>访问 {views} 次</span>
        {expiresAt && <span>有效期至 {expiresAt}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 h-9 text-sm font-medium text-[#111] border border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "已复制" : "复制链接"}
        </button>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 border border-[#E5E5E5] rounded-xl text-[#666] hover:bg-[#F7F7F7] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          onClick={onDelete}
          className="flex items-center justify-center w-9 h-9 border border-[#E5E5E5] rounded-xl text-[#999] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
