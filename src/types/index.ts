export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  license: License;
  limits: UserLimits;
  created_at: string;
  updated_at: string;
  last_login_at: string;
}

export type LicenseType = "free" | "basic" | "pro" | "enterprise";

export interface License {
  type: LicenseType;
  expires_at: string | null;
  features: string[];
}

export interface UserLimits {
  daily_tasks: number;
  max_file_size_mb: number;
  max_concurrent_tasks: number;
  max_file_count_per_task: number;
}

export type TaskStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskType =
  | "ai_rewrite"
  | "file_convert"
  | "remove_watermark"
  | "add_watermark"
  | "ocr";

export interface Task {
  id: string;
  user_id: string;
  type: TaskType;
  status: TaskStatus;
  input_files: TaskFile[];
  output_files: TaskFile[];
  progress: number;
  error_message: string | null;
  options: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TaskFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
}

export interface Order {
  id: string;
  user_id: string;
  license_type: LicenseType;
  amount: number;
  currency: "CNY" | "USD";
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  paid_at: string | null;
  license_starts_at: string;
  license_ends_at: string | null;
  created_at: string;
}

export interface ShareLink {
  id: string;
  task_id: string;
  user_id: string;
  code: string;
  password: string | null;
  max_downloads: number | null;
  download_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PricingPlan {
  id: string;
  type: LicenseType;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  features: PricingFeature[];
  limits: UserLimits;
  price_cny: number | null;
  price_usd: number | null;
  period: "monthly" | "yearly" | "lifetime" | null;
  is_popular: boolean;
  sort_order: number;
}

export interface PricingFeature {
  name: string;
  name_en: string;
  included: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  type: "notice" | "update" | "maintenance" | "promotion";
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  type: "bug" | "feature" | "other";
  title: string;
  description: string;
  contact: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FileUploadResponse {
  file_id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
}
