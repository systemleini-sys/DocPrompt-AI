"use client";

import { useState } from "react";
import { User, Crown, Shield, ChevronRight, Sparkles, FileText, Image, ScanText, RefreshCw, History, CreditCard } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import QuotaBar from "@/components/features/QuotaBar";
import TaskCard from "@/components/features/TaskCard";

const quickActions = [
  { label: "AI改写", icon: Sparkles, href: "/ai-rewrite", color: "bg-blue-50 text-[#165DFF]" },
  { label: "格式转换", icon: FileText, href: "/file-convert", color: "bg-purple-50 text-purple-600" },
  { label: "OCR识别", icon: ScanText, href: "/ocr", color: "bg-green-50 text-green-600" },
  { label: "去水印", icon: Image, href: "/remove-watermark", color: "bg-orange-50 text-orange-600" },
  { label: "加水印", icon: RefreshCw, href: "/add-watermark", color: "bg-pink-50 text-pink-600" },
  { label: "任务历史", icon: History, href: "/history", color: "bg-gray-50 text-gray-600" },
];

const mockTasks = [
  { id: 1, fileName: "项目需求文档.docx", fileType: "AI改写", status: "completed" as const, time: "2小时前" },
  { id: 2, fileName: "发票扫描件.pdf", fileType: "OCR识别", status: "completed" as const, time: "5小时前" },
  { id: 3, fileName: "产品图片.jpg", fileType: "图片去水印", status: "processing" as const, time: "10分钟前" },
  { id: 4, fileName: "年度报告.pptx", fileType: "格式转换", status: "completed" as const, time: "昨天" },
  { id: 5, fileName: "团队合照.png", fileType: "加水印", status: "error" as const, time: "2天前" },
];

export default function DashboardPage() {
  const [user] = useState({
    name: "张三",
    email: "zhangsan@example.com",
    phone: "138****8888",
    plan: "专业版",
    expiresAt: "2026-06-30",
    avatar: null,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* User Info Card */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#165DFF] to-[#4080FF] flex items-center justify-center shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-semibold text-[#111]">{user.name}</h1>
                  <Badge variant="success">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.plan}
                  </Badge>
                </div>
                <p className="text-sm text-[#666] mt-1">{user.email} · {user.phone}</p>
                <p className="text-xs text-[#999] mt-0.5">会员到期：{user.expiresAt}</p>
              </div>
              <div className="flex gap-2 sm:shrink-0">
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4" />
                  续费
                </Button>
                <Button variant="ghost" size="sm">
                  <Shield className="w-4 h-4" />
                  安全设置
                </Button>
              </div>
            </div>
          </Card>

          {/* Usage Overview */}
          <Card className="mb-6">
            <h2 className="text-base font-semibold text-[#111] mb-4">使用概览</h2>
            <div className="space-y-5">
              <QuotaBar used={47} total={100} label="AI改写" />
              <QuotaBar used={18} total={100} label="OCR识别" />
              <QuotaBar used={5} total={50} label="图片去水印" />
              <QuotaBar used={2} total={50} label="加水印" />
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mb-6">
            <h2 className="text-base font-semibold text-[#111] mb-4">快捷操作</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#F7F7F7] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-[#333]">{action.label}</span>
                </a>
              ))}
            </div>
          </Card>

          {/* Recent Tasks */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#111]">最近任务</h2>
              <a href="/history" className="flex items-center gap-1 text-sm text-[#165DFF] hover:underline">
                查看全部 <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-2">
              {mockTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  fileName={task.fileName}
                  fileType={task.fileType}
                  status={task.status}
                  time={task.time}
                />
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
