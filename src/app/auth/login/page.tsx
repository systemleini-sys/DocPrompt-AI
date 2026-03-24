"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type LoginMethod = "email" | "phone";
type Tab = "login" | "register";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    nickname: "",
    code: "",
  });

  const validate = () => {
    const e: Record<string, string> = {};

    if (tab === "login") {
      if (loginMethod === "email") {
        if (!form.email.trim()) e.email = "请输入邮箱地址";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "请输入有效的邮箱地址";
        if (!form.password) e.password = "请输入密码";
      } else {
        if (!form.phone.trim()) e.phone = "请输入手机号";
        else if (!/^1\d{10}$/.test(form.phone)) e.phone = "请输入有效的手机号";
        if (!form.code.trim()) e.code = "请输入验证码";
        else if (form.code.length < 4) e.code = "验证码格式不正确";
      }
    } else {
      // register - email only for now
      if (!form.email.trim()) e.email = "请输入邮箱地址";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "请输入有效的邮箱地址";
      if (!form.password) e.password = "请输入密码";
      else if (form.password.length < 6) e.password = "密码至少需要 6 个字符";
      if (form.nickname.trim() && form.nickname.trim().length > 50) e.nickname = "昵称最多50个字符";
      if (!agreed) e.agreed = "请先同意服务条款和隐私政策";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);

    try {
      let url: string;
      let body: Record<string, string>;

      if (tab === "login") {
        url = "/api/auth/login";
        if (loginMethod === "email") {
          body = { email: form.email, password: form.password };
        } else {
          body = { phone: form.phone, code: form.code };
        }
      } else {
        url = "/api/auth/register";
        body = {
          email: form.email,
          password: form.password,
          ...(form.nickname.trim() ? { nickname: form.nickname.trim() } : {}),
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setServerError(data.error || "操作失败");
        return;
      }

      if (tab === "register") {
        // Auto login after register
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          router.push("/dashboard");
        } else {
          setTab("login");
          setServerError("注册成功，请登录");
        }
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const [smsCountdown, setSmsCountdown] = useState(0);
  const handleSendCode = () => {
    if (!form.phone.trim() || !/^1\d{10}$/.test(form.phone)) {
      setErrors({ ...errors, phone: "请输入有效的手机号" });
      return;
    }
    // TODO: 调用短信发送 API
    setSmsCountdown(60);
    const timer = setInterval(() => {
      setSmsCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    if (!GOOGLE_CLIENT_ID) {
      setServerError("Google OAuth配置不完整，请联系管理员");
      return;
    }

    try {
      // 创建OAuth2授权窗口
      const scope = "email profile openid";
      const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`;

      // 打开新窗口进行OAuth授权
      const width = 500;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      const popup = window.open(
        authUrl,
        "Google OAuth",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        setServerError("无法打开Google授权窗口，请检查浏览器拦截设置");
        return;
      }

      // 监听窗口关闭或消息
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== process.env.NEXT_PUBLIC_SITE_URL) return;

        if (event.data.type === "google-oauth-success") {
          window.removeEventListener("message", handleMessage);
          if (popup) {
            popup.close();
          }
          setServerError("");
        } else if (event.data.type === "google-oauth-error") {
          window.removeEventListener("message", handleMessage);
          if (popup) {
            popup.close();
          }
          setServerError(event.data.message || "Google登录失败");
        }
      };

      window.addEventListener("message", handleMessage);

      // 监听窗口关闭（用户取消）
      const checkPopupClosed = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", handleMessage);
        }
      }, 500);

    } catch (error) {
      setServerError("Google登录失败，请重试");
      console.error("[GOOGLE LOGIN ERROR]", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex">
      {/* Left - Brand (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#165DFF] flex-col justify-between p-12 text-white">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-white font-semibold text-xl">DocPrompt</span>
          </Link>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            让 AI 为你的文档工作
          </h2>
          <p className="mt-4 text-white/70 text-base leading-relaxed">
            DocPrompt AI 提供智能文档改写、格式转换、OCR 识别等服务，帮助你高效处理各类文档任务。
          </p>
        </div>
        <p className="text-white/40 text-sm">© 2024 DocPrompt AI</p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#165DFF] flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-[#111] font-semibold text-xl">
                DocPrompt
              </span>
            </Link>
          </div>

          {/* Tab */}
          <div className="flex mb-8 bg-[#E8E8E8] rounded-xl p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setErrors({});
                  setServerError("");
                }}
                className={`
                  flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer
                  ${
                    tab === t
                      ? "bg-white text-[#111] shadow-sm"
                      : "text-[#666] hover:text-[#333]"
                  }
                `}
              >
                {t === "login" ? "登录" : "注册"}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-[#111]">
            {tab === "login" ? "欢迎回来" : "创建账号"}
          </h1>
          <p className="mt-1.5 text-sm text-[#666]">
            {tab === "login"
              ? "登录以继续使用 DocPrompt AI"
              : "注册以开始使用所有功能"}
          </p>

          {/* Social login */}
          <div className="mt-6 space-y-2.5">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 h-11 bg-white border border-[#E5E5E5] rounded-xl text-sm font-medium text-[#333] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              使用 Google 账号登录
            </button>
            {/* Apple login disabled - TODO: implement with apple-auth */}
            {/* <button className="w-full flex items-center justify-center gap-3 h-11 bg-[#111] rounded-xl text-sm font-medium text-white hover:bg-[#333] transition-colors cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              使用 Apple 账号{tab === "login" ? "登录" : "注册"}
            </button> */}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-6 mb-5">
            <div className="flex-1 h-px bg-[#E5E5E5]" />
            <span className="text-xs text-[#999]">或使用邮箱登录</span>
            <div className="flex-1 h-px bg-[#E5E5E5]" />
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Login method toggle */}
          {tab === "login" && (
            <div className="flex mb-4 bg-[#E8E8E8] rounded-lg p-0.5">
              <button
                onClick={() => { setLoginMethod("email"); setErrors({}); setServerError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                  loginMethod === "email" ? "bg-white text-[#111] shadow-sm" : "text-[#666]"
                }`}
              >
                邮箱登录
              </button>
              <button
                onClick={() => { setLoginMethod("phone"); setErrors({}); setServerError(""); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
                  loginMethod === "phone" ? "bg-white text-[#111] shadow-sm" : "text-[#666]"
                }`}
              >
                手机号登录
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <Input
                label="昵称（选填）"
                placeholder="请输入昵称"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                error={errors.nickname}
              />
            )}

            {tab === "login" && loginMethod === "email" || tab === "register" ? (
              <Input
                label="邮箱"
                type="email"
                placeholder="请输入邮箱地址"
                icon={<Mail className="w-4 h-4" />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
            ) : null}

            {tab === "login" && loginMethod === "phone" && (
              <Input
                label="手机号"
                type="tel"
                placeholder="请输入手机号"
                icon={<Phone className="w-4 h-4" />}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
              />
            )}

            {(tab === "register" || (tab === "login" && loginMethod === "email")) && (
              <div className="relative">
                <Input
                  label="密码"
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  icon={<Lock className="w-4 h-4" />}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-[#999] hover:text-[#666] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {tab === "login" && loginMethod === "phone" && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    label="验证码"
                    type="text"
                    placeholder="请输入验证码"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    error={errors.code}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={smsCountdown > 0}
                  className="mt-[26px] px-4 h-[42px] text-sm font-medium rounded-lg border border-[#E5E5E5] text-[#165DFF] hover:bg-[#F0F6FF] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors cursor-pointer"
                >
                  {smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码"}
                </button>
              </div>
            )}

            {tab === "login" && loginMethod === "email" && (
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-[#165DFF] hover:underline">
                  忘记密码？
                </Link>
              </div>
            )}

            {tab === "register" && (
              <>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) setErrors({ ...errors, agreed: "" });
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-[#E5E5E5] accent-[#165DFF]"
                  />
                  <span className="text-sm text-[#666]">
                    我已阅读并同意{" "}
                    <Link href="/legal/terms-of-service" className="text-[#165DFF] hover:underline">服务条款</Link>{" "}
                    和{" "}
                    <Link href="/legal/privacy-policy" className="text-[#165DFF] hover:underline">隐私政策</Link>
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-xs text-red-500 -mt-2">{errors.agreed}</p>
                )}
              </>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              {tab === "login" ? "登录" : "注册"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
