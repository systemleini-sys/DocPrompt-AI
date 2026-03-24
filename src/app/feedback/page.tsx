"use client";

import { useState } from "react";
import { MessageSquare, Bug, Lightbulb, CircleHelp, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const feedbackTypes = [
  { key: "bug", label: "Bug 反馈", icon: Bug, color: "text-red-500" },
  { key: "suggestion", label: "功能建议", icon: Lightbulb, color: "text-amber-500" },
  { key: "other", label: "其他", icon: CircleHelp, color: "text-[#666]" },
];

export default function FeedbackPage() {
  const [type, setType] = useState<string>("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!type || !content.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F7F7F7]">
          <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold text-[#111]">提交成功</h2>
            <p className="text-sm text-[#666] mt-2">感谢您的反馈，我们会尽快处理。</p>
            <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(false); setType(""); setContent(""); setEmail(""); }}>
              继续反馈
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-lg mx-auto px-4 py-8">
          <Card>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#165DFF]/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-[#165DFF]" />
              </div>
              <h1 className="text-xl font-semibold text-[#111]">用户反馈</h1>
              <p className="text-sm text-[#666] mt-1">您的每一条反馈都对我们很重要</p>
            </div>

            {/* Feedback Type */}
            <div className="mb-5">
              <label className="text-sm font-medium text-[#333] mb-2 block">反馈类型</label>
              <div className="grid grid-cols-3 gap-2">
                {feedbackTypes.map((ft) => (
                  <button
                    key={ft.key}
                    onClick={() => setType(ft.key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors cursor-pointer ${
                      type === ft.key
                        ? "border-[#165DFF] bg-[#165DFF]/5"
                        : "border-[#E5E5E5] bg-white hover:border-[#999]"
                    }`}
                  >
                    <ft.icon className={`w-5 h-5 ${type === ft.key ? ft.color : "text-[#999]"}`} />
                    <span className={`text-xs ${type === ft.key ? "text-[#111] font-medium" : "text-[#666]"}`}>
                      {ft.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="text-sm font-medium text-[#333] mb-1.5 block">详细描述</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请描述您遇到的问题或建议..."
                rows={5}
                className="w-full px-4 py-3 text-sm text-[#111] placeholder:text-[#999] border border-[#E5E5E5] rounded-xl bg-white outline-none focus:border-[#165DFF] transition-colors resize-none"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <Input
                label="联系邮箱（可选）"
                type="email"
                placeholder="方便我们回复您"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button fullWidth loading={loading} onClick={handleSubmit} disabled={!type || !content.trim()}>
              提交反馈
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
