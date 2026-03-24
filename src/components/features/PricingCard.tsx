'use client';

import { Check } from "lucide-react";
import Button from "../ui/Button";

interface PricingCardProps {
  name: string;
  price: number;
  currency?: "CNY" | "USD";
  period?: string;
  features: string[];
  popular?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  name,
  price,
  currency = "CNY",
  period = "/月",
  features,
  popular = false,
  onSelect,
}: PricingCardProps) {
  const symbol = currency === "CNY" ? "¥" : "$";

  return (
    <div
      className={`
        relative flex flex-col p-6 bg-white rounded-2xl border-2 transition-colors
        ${popular ? "border-[#165DFF] shadow-md" : "border-[#E5E5E5] shadow-sm hover:border-[#999]"}
      `}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#165DFF] text-white text-xs font-medium rounded-full">
          推荐
        </span>
      )}

      <h3 className="text-base font-semibold text-[#111]">{name}</h3>
      <div className="mt-3 flex items-baseline gap-0.5">
        <span className="text-3xl font-bold text-[#111]">
          {symbol}{price}
        </span>
        <span className="text-sm text-[#666]">{period}</span>
      </div>

      <ul className="mt-6 space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[#333]">
            <Check className="w-4 h-4 text-[#00B42A] mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button
          variant={popular ? "primary" : "outline"}
          fullWidth
          onClick={onSelect}
        >
          选择方案
        </Button>
      </div>
    </div>
  );
}
