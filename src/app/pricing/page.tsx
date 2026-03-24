"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingCard from "@/components/features/PricingCard";
import Badge from "@/components/ui/Badge";

const faqs = [
  { q: "免费版有什么限制？", a: "免费版每日可使用3次任务，单文件最大10MB，1个并发任务。适合轻度体验产品功能。" },
  { q: "可以随时取消订阅吗？", a: "月付套餐可以随时取消，取消后当前计费周期内仍可正常使用，到期后自动降级为免费版。" },
  { q: "支持哪些支付方式？", a: "支持微信支付、支付宝、银联卡。企业版支持对公转账，请联系我们获取详细信息。" },
  { q: "升级后会立即生效吗？", a: "是的，支付成功后立即生效。您的额度将实时更新，无需等待。" },
  { q: "终身版和月付版有什么区别？", a: "功能完全一致。终身版一次性付费永久使用，适合长期用户。月付版按月计费，灵活性更高。" },
  { q: "可以退款吗？", a: "购买后7天内且使用次数不超过10次，可申请全额退款。请通过客服邮箱联系我们。" },
];

const monthlyPlans = [
  { name: "免费版", price: 0, period: "", popular: false, features: ["每日3次任务", "最大文件10MB", "1个并发任务"] },
  { name: "基础版", price: 29, period: "/月", popular: false, features: ["每日30次任务", "最大文件50MB", "3个并发任务", "批量处理10个文件"] },
  { name: "专业版", price: 99, period: "/月", popular: true, features: ["每日100次任务", "最大文件200MB", "10个并发任务", "批量处理50个文件", "优先处理", "API访问"] },
];

const lifetimePlans = [
  { name: "基础版", price: 199, period: "/永久", popular: false, features: ["每日30次任务", "最大文件50MB", "3个并发任务", "批量处理10个文件"] },
  { name: "专业版", price: 599, period: "/永久", popular: true, features: ["每日100次任务", "最大文件200MB", "10个并发任务", "批量处理50个文件", "优先处理", "API访问"] },
  { name: "企业版", price: 2999, period: "/永久", popular: false, features: ["无限次任务", "最大文件500MB", "50个并发任务", "批量处理200个文件", "优先处理", "专属客服"] },
];

const comparisonRows = [
  { feature: "每日任务次数", free: "3次", basic: "30次", pro: "100次" },
  { feature: "最大文件大小", free: "10MB", basic: "50MB", pro: "200MB" },
  { feature: "并发任务数", free: "1个", basic: "3个", pro: "10个" },
  { feature: "批量处理", free: <X className="w-4 h-4 text-[#999] mx-auto" />, basic: "10个文件", pro: "50个文件" },
  { feature: "优先处理", free: <X className="w-4 h-4 text-[#999] mx-auto" />, basic: <X className="w-4 h-4 text-[#999] mx-auto" />, pro: <Check className="w-4 h-4 text-[#00B42A] mx-auto" /> },
  { feature: "API访问", free: <X className="w-4 h-4 text-[#999] mx-auto" />, basic: <X className="w-4 h-4 text-[#999] mx-auto" />, pro: <Check className="w-4 h-4 text-[#00B42A] mx-auto" /> },
  { feature: "客服支持", free: "社区", basic: "邮件", pro: "专属客服" },
];

export default function PricingPage() {
  const [tab, setTab] = useState<"monthly" | "lifetime">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = tab === "monthly" ? monthlyPlans : lifetimePlans;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-20 pb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight">Choose Your Plan</h1>
          <p className="mt-4 text-lg text-[#666] max-w-xl mx-auto">简洁、透明、按需选择。找到最适合你的方案。</p>
        </section>

        {/* Tab Switch */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-[#F7F7F7] rounded-xl">
            <button
              onClick={() => setTab("monthly")}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                tab === "monthly" ? "bg-white text-[#111] shadow-sm" : "text-[#666] hover:text-[#333]"
              }`}
            >
              月付
            </button>
            <button
              onClick={() => setTab("lifetime")}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                tab === "lifetime" ? "bg-white text-[#111] shadow-sm" : "text-[#666] hover:text-[#333]"
              }`}
            >
              终身
              <Badge variant="warning" className="ml-1.5">省60%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          {/* Lifetime Notice */}
          {tab === "lifetime" && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>终身版说明：</strong>终身版为一次性付费，永久享受对应套餐权益。不支持退款，请确认后再购买。产品持续迭代更新，终身版用户将自动获得所有功能升级。
            </div>
          )}

          {/* Comparison Table */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-[#111] text-center mb-8">功能对比</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="text-left py-4 px-4 text-[#666] font-medium">功能</th>
                    <th className="text-center py-4 px-4 text-[#666] font-medium">免费版</th>
                    <th className="text-center py-4 px-4 text-[#666] font-medium">基础版</th>
                    <th className="text-center py-4 px-4 text-[#666] font-medium">专业版</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature as string} className="border-b border-[#F7F7F7]">
                      <td className="py-3.5 px-4 text-[#333]">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center text-[#666]">{row.free}</td>
                      <td className="py-3.5 px-4 text-center text-[#666]">{row.basic}</td>
                      <td className="py-3.5 px-4 text-center text-[#666]">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] text-center mb-8">常见问题</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-[#E5E5E5] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-[#111] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
                  >
                    {faq.q}
                    <ChevronIcon open={openFaq === i} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-[#666] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-[#999] transition-transform ${open ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
