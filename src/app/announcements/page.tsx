"use client";

import { useState } from "react";
import { Megaphone, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const announcements = [
  {
    id: 1,
    title: "DocPrompt AI v2.0 正式发布",
    time: "2026-03-20",
    summary: "全新界面设计，支持批量处理和 API 接入，处理速度提升 3 倍。",
    detail: "经过三个月的精心打磨，DocPrompt AI v2.0 正式发布！本次更新包括：1) 全新的极简界面设计，操作更加直观；2) 支持最多 200 个文件的批量处理；3) 开放 API 接口，支持开发者集成；4) AI 引擎升级，处理速度提升 3 倍，准确率进一步提升。感谢所有内测用户的宝贵反馈！",
    pinned: true,
  },
  {
    id: 2,
    title: "OCR 识别支持更多语言",
    time: "2026-03-15",
    summary: "OCR 功能新增日语、韩语、法语、德语等 12 种语言支持。",
    detail: "OCR 识别功能现已支持中文、英文、日语、韩语、法语、德语、西班牙语、葡萄牙语、俄语、阿拉伯语、意大利语、荷兰语共 12 种语言。识别准确率平均达到 98.5% 以上，手写体识别也得到显著优化。",
    pinned: false,
  },
  {
    id: 3,
    title: "春促活动：专业版限时 7 折",
    time: "2026-03-10",
    summary: "3月10日至3月31日，专业版月付套餐限时 7 折优惠，仅需 ¥69/月。",
    detail: "为庆祝 DocPrompt AI 用户突破 10 万，我们推出春促活动：专业版月付套餐限时 7 折，原价 ¥99/月，活动价仅需 ¥69/月。活动时间：2026年3月10日至3月31日。点击「定价」页面即可享受优惠！",
    pinned: false,
  },
  {
    id: 4,
    title: "系统维护通知",
    time: "2026-03-05",
    summary: "3月6日凌晨 2:00-4:00 进行系统维护，届时服务将暂停。",
    detail: "为提升服务稳定性，我们将于 2026年3月6日凌晨 2:00-4:00（北京时间）进行系统升级维护。维护期间所有服务将暂停使用，请提前做好安排。给您带来的不便，敬请谅解。",
    pinned: false,
  },
];

export default function AnnouncementsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6 p-4 rounded-card bg-amber-50 border border-amber-200 text-amber-800">
            <p className="font-medium">🚧 功能建设中</p>
            <p className="text-sm mt-1">该功能正在开发中，敬请期待。</p>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Megaphone className="w-5 h-5 text-[#165DFF]" />
            <h1 className="text-xl font-semibold text-[#111]">公告中心</h1>
          </div>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full flex items-start gap-3 p-5 text-left hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.pinned && (
                        <span className="px-1.5 py-0.5 bg-[#165DFF]/10 text-[#165DFF] text-xs font-medium rounded">
                          置顶
                        </span>
                      )}
                      <h2 className="text-sm font-semibold text-[#111]">{item.title}</h2>
                    </div>
                    <p className="text-xs text-[#999] mt-1">{item.time}</p>
                    {expandedId !== item.id && (
                      <p className="text-sm text-[#666] mt-2 line-clamp-2">{item.summary}</p>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#999] shrink-0 mt-1 transition-transform ${expandedId === item.id ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedId === item.id && (
                  <div className="px-5 pb-5 text-sm text-[#333] leading-relaxed border-t border-[#F7F7F7] pt-4">
                    {item.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
