"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

type OrderStatus = "paid" | "pending" | "closed";

interface Order {
  id: string;
  plan: string;
  amount: number;
  status: OrderStatus;
  time: string;
}

const mockOrders: Order[] = [
  { id: "DP20260320001", plan: "专业版 (月付)", amount: 99, status: "paid", time: "2026-03-20 14:30:22" },
  { id: "DP20260315002", plan: "基础版 (月付)", amount: 29, status: "paid", time: "2026-03-15 09:12:05" },
  { id: "DP20260310003", plan: "专业版 (月付)", amount: 99, status: "pending", time: "2026-03-10 18:45:33" },
  { id: "DP20260228004", plan: "基础版 (月付)", amount: 29, status: "closed", time: "2026-02-28 10:20:17" },
  { id: "DP20260215005", plan: "免费版 (升级)", amount: 0, status: "paid", time: "2026-02-15 08:00:00" },
];

const statusConfig: Record<OrderStatus, { label: string; variant: "success" | "warning" | "info" }> = {
  paid: { label: "已支付", variant: "success" },
  pending: { label: "待支付", variant: "warning" },
  closed: { label: "已关闭", variant: "info" },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const filtered = filter === "all" ? mockOrders : mockOrders.filter((o) => o.status === filter);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold text-[#111] mb-6">订单记录</h1>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {([["all", "全部"], ["paid", "已支付"], ["pending", "待支付"], ["closed", "已关闭"]] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                    filter === key
                      ? "bg-[#165DFF] text-white"
                      : "bg-white text-[#666] border border-[#E5E5E5] hover:border-[#999]"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Orders Table */}
          <Card padding="none">
            {filtered.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E5E5]">
                        <th className="text-left py-3.5 px-5 text-[#666] font-medium">订单号</th>
                        <th className="text-left py-3.5 px-5 text-[#666] font-medium">套餐</th>
                        <th className="text-left py-3.5 px-5 text-[#666] font-medium">金额</th>
                        <th className="text-left py-3.5 px-5 text-[#666] font-medium">状态</th>
                        <th className="text-left py-3.5 px-5 text-[#666] font-medium">时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((order) => {
                        const sc = statusConfig[order.status];
                        return (
                          <tr key={order.id} className="border-b border-[#F7F7F7] last:border-0 hover:bg-[#FAFAFA]">
                            <td className="py-3.5 px-5 text-[#111] font-mono text-xs">{order.id}</td>
                            <td className="py-3.5 px-5 text-[#333]">{order.plan}</td>
                            <td className="py-3.5 px-5 text-[#111] font-medium">
                              {order.amount === 0 ? "免费" : `¥${order.amount}`}
                            </td>
                            <td className="py-3.5 px-5"><Badge variant={sc.variant}>{sc.label}</Badge></td>
                            <td className="py-3.5 px-5 text-[#999]">{order.time}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Cards */}
                <div className="sm:hidden divide-y divide-[#F7F7F7]">
                  {filtered.map((order) => {
                    const sc = statusConfig[order.status];
                    return (
                      <div key={order.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#999]">{order.id}</span>
                          <Badge variant={sc.variant}>{sc.label}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-[#111]">{order.plan}</span>
                          <span className="text-sm font-medium text-[#111]">
                            {order.amount === 0 ? "免费" : `¥${order.amount}`}
                          </span>
                        </div>
                        <p className="text-xs text-[#999] mt-1">{order.time}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-16 text-center">
                <Receipt className="w-10 h-10 text-[#E5E5E5] mx-auto mb-3" />
                <p className="text-sm text-[#999]">暂无订单记录</p>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
