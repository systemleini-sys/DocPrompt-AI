"use client";

import { X } from "lucide-react";
import Link from "next/link";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: { label: string; href: string }[];
}

export default function MobileNav({ open, onClose, items }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-[slideInRight_250ms_ease-out]">
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#E5E5E5]">
          <span className="text-[#111] font-semibold">导航</span>
          <button onClick={onClose} className="p-1 rounded-lg text-[#666] hover:bg-[#F7F7F7] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="px-4 py-3 text-sm text-[#333] rounded-xl hover:bg-[#F7F7F7] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
