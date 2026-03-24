type ProgressStatus = "idle" | "uploading" | "processing" | "completed" | "error";

interface ProgressBarProps {
  value: number;
  status?: ProgressStatus;
}

const statusColors: Record<ProgressStatus, string> = {
  idle: "bg-[#E5E5E5]",
  uploading: "bg-[#165DFF]",
  processing: "bg-[#7B61FF]",
  completed: "bg-[#00B42A]",
  error: "bg-red-500",
};


export default function ProgressBar({
  value,
  status = "idle",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-[#F7F7F7] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${statusColors[status]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-[#666] min-w-[3rem] text-right">
        {status === "completed" ? "✓" : `${Math.round(clamped)}%`}
      </span>
    </div>
  );
}
