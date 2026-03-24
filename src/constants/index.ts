import type { PricingPlan, UserLimits } from "@/types";

// Task type labels
export const TASK_TYPES = {
  ai_rewrite: { label: "AI文档改写", labelEn: "AI Rewrite", icon: "Sparkles" },
  file_convert: { label: "格式转换", labelEn: "File Convert", icon: "FileText" },
  remove_watermark: { label: "图片去水印", labelEn: "Remove Watermark", icon: "Image" },
  add_watermark: { label: "加水印", labelEn: "Add Watermark", icon: "Stamp" },
  ocr: { label: "OCR识别", labelEn: "OCR", icon: "ScanText" },
} as const;

// Task status labels
export const TASK_STATUS = {
  pending: { label: "等待中", labelEn: "Pending", color: "text-yellow-600" },
  processing: { label: "处理中", labelEn: "Processing", color: "text-blue-600" },
  completed: { label: "已完成", labelEn: "Completed", color: "text-green-600" },
  failed: { label: "失败", labelEn: "Failed", color: "text-red-600" },
  cancelled: { label: "已取消", labelEn: "Cancelled", color: "text-gray-500" },
} as const;

// Supported file formats
export const SUPPORTED_FORMATS = {
  ai_rewrite: {
    input: [".docx", ".pdf", ".txt", ".md"],
    output: [".docx", ".pdf", ".txt", ".md"],
  },
  file_convert: {
    input: [".pdf", ".docx", ".doc", ".pptx", ".xlsx", ".png", ".jpg", ".jpeg", ".webp"],
    output: [".pdf", ".docx", ".pptx", ".xlsx", ".png", ".jpg", ".webp"],
  },
  remove_watermark: {
    input: [".png", ".jpg", ".jpeg", ".webp"],
    output: [".png", ".jpg", ".webp"],
  },
  add_watermark: {
    input: [".png", ".jpg", ".jpeg", ".webp"],
    output: [".png", ".jpg", ".webp"],
  },
  ocr: {
    input: [".png", ".jpg", ".jpeg", ".webp", ".pdf"],
    output: [".txt", ".docx", ".pdf"],
  },
} as const;

// User limits by license type
export const LICENSE_LIMITS: Record<string, UserLimits> = {
  free: {
    daily_tasks: 3,
    max_file_size_mb: 10,
    max_concurrent_tasks: 1,
    max_file_count_per_task: 3,
  },
  basic: {
    daily_tasks: 30,
    max_file_size_mb: 50,
    max_concurrent_tasks: 3,
    max_file_count_per_task: 10,
  },
  pro: {
    daily_tasks: 100,
    max_file_size_mb: 200,
    max_concurrent_tasks: 10,
    max_file_count_per_task: 50,
  },
  enterprise: {
    daily_tasks: 999,
    max_file_size_mb: 500,
    max_concurrent_tasks: 50,
    max_file_count_per_task: 200,
  },
};

// Pricing plans (CNY)
export const PRICING_PLANS_CNY: PricingPlan[] = [
  {
    id: "free",
    type: "free",
    name: "免费版",
    name_en: "Free",
    description: "体验基础功能",
    description_en: "Try basic features",
    features: [
      { name: "每日3次任务", name_en: "3 tasks/day", included: true },
      { name: "最大文件10MB", name_en: "Max 10MB per file", included: true },
      { name: "1个并发任务", name_en: "1 concurrent task", included: true },
      { name: "批量处理", name_en: "Batch processing", included: false },
      { name: "优先处理", name_en: "Priority processing", included: false },
      { name: "API访问", name_en: "API access", included: false },
    ],
    limits: LICENSE_LIMITS.free,
    price_cny: 0,
    price_usd: 0,
    period: null,
    is_popular: false,
    sort_order: 0,
  },
  {
    id: "basic-monthly",
    type: "basic",
    name: "基础版",
    name_en: "Basic",
    description: "适合个人轻度使用",
    description_en: "For light personal use",
    features: [
      { name: "每日30次任务", name_en: "30 tasks/day", included: true },
      { name: "最大文件50MB", name_en: "Max 50MB per file", included: true },
      { name: "3个并发任务", name_en: "3 concurrent tasks", included: true },
      { name: "批量处理(10个文件)", name_en: "Batch (10 files)", included: true },
      { name: "优先处理", name_en: "Priority processing", included: false },
      { name: "API访问", name_en: "API access", included: false },
    ],
    limits: LICENSE_LIMITS.basic,
    price_cny: 29,
    price_usd: 4.99,
    period: "monthly",
    is_popular: false,
    sort_order: 1,
  },
  {
    id: "pro-monthly",
    type: "pro",
    name: "专业版",
    name_en: "Pro",
    description: "适合专业用户和团队",
    description_en: "For professionals and teams",
    features: [
      { name: "每日100次任务", name_en: "100 tasks/day", included: true },
      { name: "最大文件200MB", name_en: "Max 200MB per file", included: true },
      { name: "10个并发任务", name_en: "10 concurrent tasks", included: true },
      { name: "批量处理(50个文件)", name_en: "Batch (50 files)", included: true },
      { name: "优先处理", name_en: "Priority processing", included: true },
      { name: "API访问", name_en: "API access", included: true },
    ],
    limits: LICENSE_LIMITS.pro,
    price_cny: 99,
    price_usd: 14.99,
    period: "monthly",
    is_popular: true,
    sort_order: 2,
  },
  {
    id: "enterprise-yearly",
    type: "enterprise",
    name: "企业版",
    name_en: "Enterprise",
    description: "适合大型团队和企业",
    description_en: "For large teams and enterprises",
    features: [
      { name: "无限次任务", name_en: "Unlimited tasks", included: true },
      { name: "最大文件500MB", name_en: "Max 500MB per file", included: true },
      { name: "50个并发任务", name_en: "50 concurrent tasks", included: true },
      { name: "批量处理(200个文件)", name_en: "Batch (200 files)", included: true },
      { name: "优先处理", name_en: "Priority processing", included: true },
      { name: "API访问", name_en: "API access", included: true },
    ],
    limits: LICENSE_LIMITS.enterprise,
    price_cny: 999,
    price_usd: 149.99,
    period: "yearly",
    is_popular: false,
    sort_order: 3,
  },
];

// Task processing limits
export const TASK_LIMITS = {
  timeout_ms: 300_000, // 5 minutes
  max_retries: 3,
  retry_delay_ms: 5_000,
  poll_interval_ms: 2_000,
  max_poll_count: 150,
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  max_file_size_mb: 500,
  max_file_count: 200,
  allowed_mime_types: [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/markdown",
  ],
} as const;

// Share link settings
export const SHARE_DEFAULTS = {
  expires_days: 7,
  max_downloads: 100,
  code_length: 8,
  password_length: 4,
} as const;

// Site info
export const SITE_INFO = {
  name: "DocPrompt AI",
  name_en: "DocPrompt AI",
  description: "智能文档处理平台",
  description_en: "Smart Document Processing Platform",
  support_email: "support@docprompt.ai",
  feedback_email: "feedback@docprompt.ai",
  github: "https://github.com/docprompt-ai",
  icp: "",
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: "AI文档改写", labelEn: "AI Rewrite", href: "/ai-rewrite" },
  { label: "格式转换", labelEn: "Convert", href: "/file-convert" },
  { label: "去水印", labelEn: "Remove WM", href: "/remove-watermark" },
  { label: "加水印", labelEn: "Add WM", href: "/add-watermark" },
  { label: "OCR识别", labelEn: "OCR", href: "/ocr" },
  { label: "定价", labelEn: "Pricing", href: "/pricing" },
] as const;

// User navigation items
export const USER_NAV_ITEMS = [
  { label: "用户中心", labelEn: "Dashboard", href: "/dashboard" },
  { label: "任务历史", labelEn: "History", href: "/history" },
  { label: "订单记录", labelEn: "Orders", href: "/orders" },
  { label: "分享管理", labelEn: "Shares", href: "/shares" },
] as const;

// Legal page slugs
export const LEGAL_SLUGS = [
  "terms",
  "privacy",
  "cookies",
  "dmca",
] as const;
