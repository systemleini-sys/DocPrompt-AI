import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingCard from "@/components/features/PricingCard";
import { PRICING_PLANS_CNY } from "@/constants";
import {
  Sparkles,
  FileText,
  ScanText,
  ImageOff,
  Stamp,
  Share2,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

export const metadata = {
  title: "DocPrompt AI - AI-Powered Document Processing",
  description:
    "智能文档处理平台：AI改写、格式转换、OCR识别、去水印、加水印，一站搞定所有文档需求。",
};

const featureCards = [
  {
    icon: Sparkles,
    title: "AI 文档改写",
    desc: "智能改写文档内容，支持正式、通俗、学术、创意等多种风格，保持原意的同时提升表达。",
    href: "/ai-rewrite",
  },
  {
    icon: FileText,
    title: "格式转换",
    desc: "PDF↔Word、合并PDF、拆分PDF、压缩PDF，支持多种格式互转，批量处理更高效。",
    href: "/file-convert",
  },
  {
    icon: ScanText,
    title: "OCR 文字识别",
    desc: "精准识别图片和PDF中的文字，支持中英文及多语言，识别结果一键复制或导出。",
    href: "/ocr",
  },
  {
    icon: ImageOff,
    title: "图片去水印",
    desc: "AI智能去除图片水印，恢复图片原始质量，支持批量处理，效果自然无痕。",
    href: "/remove-watermark",
  },
  {
    icon: Stamp,
    title: "自定义加水印",
    desc: "支持文字和图片水印，自定义字体、颜色、透明度和位置，保护你的原创内容。",
    href: "/add-watermark",
  },
  {
    icon: Share2,
    title: "文件分享",
    desc: "生成分享链接，设置过期时间和下载次数限制，安全便捷地分享文件给他人。",
    href: "/shares",
  },
];

const testimonials = [
  { name: "张明", role: "产品经理", text: "DocPrompt 的 AI 改写功能帮我节省了大量时间，文档质量也提升了不少。" },
  { name: "Sarah K.", role: "Marketing Director", text: "Format conversion is blazing fast. We process hundreds of files daily without issues." },
  { name: "李伟", role: "设计师", text: "去水印效果超出预期，处理后图片质量几乎没有损失，非常推荐。" },
];

const trustBadges = [
  { icon: Shield, text: "数据安全加密" },
  { icon: Zap, text: "秒级处理速度" },
  { icon: Globe, text: "支持多语言" },
];

export default function HomePage() {
  const displayPlans = PRICING_PLANS_CNY.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#111] tracking-tight leading-tight">
            AI-Powered
            <br />
            <span className="text-[#165DFF]">Document Processing</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-[#666] max-w-2xl mx-auto leading-relaxed">
            一站式智能文档处理平台。AI 改写、格式转换、OCR 识别、去水印、加水印——让文档工作更高效。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 h-12 px-8 bg-[#165DFF] text-white text-base font-medium rounded-xl hover:bg-[#1350D6] transition-colors"
            >
              开始使用
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 h-12 px-8 border border-[#E5E5E5] text-[#111] text-base font-medium rounded-xl hover:bg-[#F7F7F7] transition-colors"
            >
              查看定价
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-8 text-[#999]">
            {trustBadges.map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-sm">
                <b.icon className="w-4 h-4" />
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-[#111]">
              核心功能
            </h2>
            <p className="mt-3 text-[#666] text-base md:text-lg">
              六大智能工具，覆盖文档处理全场景
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-[#165DFF]" />
                </div>
                <h3 className="text-base font-semibold text-[#111] group-hover:text-[#165DFF] transition-colors">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[#666] leading-relaxed">
                  {f.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-[#111]">
              简单透明的定价
            </h2>
            <p className="mt-3 text-[#666] text-base md:text-lg">
              免费开始，按需升级
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {displayPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                name={plan.name_en}
                price={plan.price_usd ?? 0}
                currency="USD"
                period={plan.period === "monthly" ? "/mo" : ""}
                features={plan.features
                  .filter((f) => f.included)
                  .map((f) => f.name_en)}
                popular={plan.is_popular}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="text-sm text-[#165DFF] hover:underline"
            >
              查看完整方案对比 →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-[#111]">
              用户评价
            </h2>
            <p className="mt-3 text-[#666]">来自真实用户的反馈</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <p className="text-sm text-[#333] leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#165DFF]/10 flex items-center justify-center text-sm font-semibold text-[#165DFF]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111]">{t.name}</p>
                    <p className="text-xs text-[#999]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 lg:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111]">
            准备好提升文档处理效率了吗？
          </h2>
          <p className="mt-3 text-[#666]">
            免费注册，立即体验所有功能。
          </p>
          <div className="mt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 h-12 px-8 bg-[#165DFF] text-white text-base font-medium rounded-xl hover:bg-[#1350D6] transition-colors"
            >
              免费开始
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer locale="en" />
    </div>
  );
}
