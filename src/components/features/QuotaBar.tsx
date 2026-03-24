interface QuotaBarProps {
  used: number;
  total: number;
  label?: string;
}

export default function QuotaBar({ used, total, label = "使用次数" }: QuotaBarProps) {
  const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const isLow = percent >= 90;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-[#333]">{label}</span>
        <span className={`text-sm font-medium ${isLow ? "text-red-500" : "text-[#666]"}`}>
          {used} / {total}
        </span>
      </div>
      <div className="h-2 bg-[#F7F7F7] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isLow ? "bg-red-500" : "bg-[#165DFF]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {isLow && (
        <p className="text-xs text-red-500 mt-1.5">
          额度即将用完，请升级套餐
        </p>
      )}
    </div>
  );
}
