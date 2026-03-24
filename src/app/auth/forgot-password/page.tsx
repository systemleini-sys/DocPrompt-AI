"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("请输入邮箱地址");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("请输入有效的邮箱地址");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#666] hover:text-[#111] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回登录
        </Link>

        {sent ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-green-500" />
            </div>
            <h1 className="mt-5 text-xl font-bold text-[#111]">
              重置链接已发送
            </h1>
            <p className="mt-2 text-sm text-[#666] leading-relaxed">
              我们已将密码重置链接发送至
              <br />
              <span className="font-medium text-[#333]">{email}</span>
              <br />
              请查收邮箱并点击链接重置密码。
            </p>
            <p className="mt-4 text-xs text-[#999]">
              没有收到？请检查垃圾邮件，或{" "}
              <button
                onClick={() => setSent(false)}
                className="text-[#165DFF] hover:underline cursor-pointer"
              >
                重新发送
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7 text-[#165DFF]" />
            </div>
            <h1 className="mt-5 text-xl font-bold text-[#111]">忘记密码</h1>
            <p className="mt-2 text-sm text-[#666]">
              输入你的注册邮箱，我们将发送密码重置链接。
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="邮箱地址"
                type="email"
                placeholder="请输入注册邮箱"
                icon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                error={error}
              />
              <Button type="submit" fullWidth loading={loading} size="lg">
                发送重置链接
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
