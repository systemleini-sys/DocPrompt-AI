"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#165DFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#666]">正在跳转...</p>
      </div>
    </div>
  );
}
