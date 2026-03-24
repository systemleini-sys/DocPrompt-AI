"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleOAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      const errorMessage = errorParam === "access_denied"
        ? "用户取消了授权"
        : "Google授权失败";
      setError(errorMessage);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      return;
    }

    if (!code) {
      router.push("/auth/login?error=no_code");
      return;
    }

    // Exchange code for token
    const exchangeCodeForToken = async () => {
      try {
        const res = await fetch("/api/auth/google/token-exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (data.success) {
          // Redirect to dashboard on success
          router.push("/dashboard");
        } else {
          // Show error
          setError(data.error || "登录失败");
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      } catch (error) {
        console.error("[TOKEN EXCHANGE ERROR]", error);
        setError("网络错误，请重试");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    };

    exchangeCodeForToken();
  }, [code, router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#165DFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        {error ? (
          <>
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-[#666] text-sm">正在返回...</p>
          </>
        ) : (
          <p className="text-[#666]">正在登录...</p>
        )}
      </div>
    </div>
  );
}
