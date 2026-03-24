"use client";

import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "首页", href: "/" },
  { label: "AI 改写", href: "/rewrite" },
  { label: "格式转换", href: "/convert" },
  { label: "OCR", href: "/ocr" },
  { label: "定价", href: "/pricing" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-[#E5E5E5]/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#165DFF] flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-[#111] font-semibold text-base">DocPrompt</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-[#333] hover:text-[#111] rounded-lg hover:bg-[#F7F7F7] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 h-9 text-sm font-medium text-[#111] border border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7] transition-colors"
            >
              登录
            </Link>
            <button
              className="w-9 h-9 rounded-xl border border-[#E5E5E5] flex items-center justify-center text-[#666] hover:bg-[#F7F7F7] transition-colors md:hidden cursor-pointer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-[slideInRight_250ms_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-14 px-4 border-b border-[#E5E5E5]">
              <span className="text-[#111] font-semibold">菜单</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-[#666] hover:bg-[#F7F7F7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-[#333] rounded-xl hover:bg-[#F7F7F7] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2 border-[#E5E5E5]" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-[#333] rounded-xl hover:bg-[#F7F7F7] transition-colors"
              >
                <User className="w-4 h-4" />
                登录 / 注册
              </Link>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
