"use client";

import { useState } from "react";
import { Gift, CheckCircle, XCircle, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

const mockHistory = [
  { code: "XXXX-XXXX-A1B2", plan: "专业版", time: "2026-03-20 14:30", status: "success" },
  { code: "YYYY-YYYY-C3D4", plan: "基础版", time: "2026-02-15 09:00", status: "success" },
  { code: "ZZZZ-ZZZZ-E5F6", plan: "基础版", time: "2026-01-10 18:20", status: "expired" },
];

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    setResult(code.startsWith("X") ? "success" : "error");
    setLoading(false);
    if (code.startsWith("X")) setCode("");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-lg mx-auto px-4 py-16">
          <Card>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#165DFF]/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-[#165DFF]" />
              </div>
              <h1 className="text-xl font-semibold text-[#111]">激活码兑换</h1>
              <p className="text-sm text-[#666] mt-1">输入激活码，立即激活会员权益</p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="请输入激活码，如 XXXX-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
              />
              <Button fullWidth loading={loading} onClick={handleRedeem}>
                立即兑换
              </Button>
            </div>

            {result === "success" && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-green-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                兑换成功！会员权益已激活。
              </div>
            )}
            {result === "error" && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600">
                <XCircle className="w-4 h-4 shrink-0" />
                激活码无效或已过期，请检查后重试。
              </div>
            )}
          </Card>

          {/* Redeem History */}
          <div className="mt-8">
            <h2 className="text-base font-semibold text-[#111] mb-4">兑换记录</h2>
            <div className="space-y-2">
              {mockHistory.map((item, i) => (
                <Card key={i} padding="sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#111]">{item.code}</p>
                      <p className="text-xs text-[#999] mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.status === "success" ? "success" : "warning"}>
                        {item.plan}
                      </Badge>
                      <p className="text-xs text-[#999] mt-1">
                        {item.status === "success" ? "已激活" : "已过期"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
