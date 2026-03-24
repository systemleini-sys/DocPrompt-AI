-- DocPrompt AI 数据库初始化 SQL
-- 在 Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor) 中执行此文件

-- =============================================
-- 1. 用户表
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash TEXT,
  nickname VARCHAR(50) DEFAULT '',
  avatar TEXT,
  role INT DEFAULT 0 CHECK (role >= 0 AND role <= 2),
  membership_level INT DEFAULT 0 CHECK (membership_level >= 0 AND membership_level <= 3),
  expired_at TIMESTAMPTZ,
  status INT DEFAULT 1 CHECK (status >= 0 AND status <= 2),
  login_fail_count INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  consecutive_login_days INT DEFAULT 0,
  last_login_at TIMESTAMPTZ,
  google_id VARCHAR(255) UNIQUE,
  apple_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.role IS '0=普通用户 1=管理员 2=超级管理员';
COMMENT ON COLUMN users.membership_level IS '0=免费 1=Basic 2=Pro 3=终身';
COMMENT ON COLUMN users.status IS '0=禁用 1=正常 2=已注销';

-- =============================================
-- 2. 用户每日次数表
-- =============================================
CREATE TABLE IF NOT EXISTS user_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  ai_used INT DEFAULT 0 CHECK (ai_used >= 0),
  ocr_used INT DEFAULT 0 CHECK (ocr_used >= 0),
  watermark_remove_used INT DEFAULT 0 CHECK (watermark_remove_used >= 0),
  watermark_add_used INT DEFAULT 0 CHECK (watermark_add_used >= 0),
  pdf_used INT DEFAULT 0 CHECK (pdf_used >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

COMMENT ON TABLE user_limits IS '用户每日使用次数';
COMMENT ON COLUMN user_limits.date IS 'UTC+8 日期，每日0点重置';

-- =============================================
-- 3. 任务表
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ai_rewrite','ocr','remove_watermark','add_watermark','file_convert')),
  status INT DEFAULT 0 CHECK (status >= 0 AND status <= 4),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  file_name VARCHAR(255),
  file_url TEXT,
  file_md5 VARCHAR(32),
  file_size BIGINT DEFAULT 0,
  result_url TEXT,
  share_key VARCHAR(100),
  error_message TEXT,
  retry_count INT DEFAULT 0,
  options JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '24 hours')
);

COMMENT ON TABLE tasks IS '用户处理任务';
COMMENT ON COLUMN tasks.status IS '0=待处理 1=处理中 2=已完成 3=失败 4=已取消';
COMMENT ON COLUMN tasks.expires_at IS '24小时后自动过期';

-- =============================================
-- 4. 激活码表
-- =============================================
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  level INT NOT NULL CHECK (level >= 1 AND level <= 3),
  used INT DEFAULT 0 CHECK (used >= 0 AND used <= 1),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE licenses IS '激活码/兑换码';
COMMENT ON COLUMN licenses.level IS '1=Basic 2=Pro 3=终身';

-- =============================================
-- 5. 订单表
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic','pro','lifetime')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'CNY' CHECK (currency IN ('CNY','USD')),
  payment_method VARCHAR(50),
  payment_status INT DEFAULT 0 CHECK (payment_status >= 0 AND payment_status <= 3),
  payment_url TEXT,
  paid_at TIMESTAMPTZ,
  license_starts_at TIMESTAMPTZ DEFAULT now(),
  license_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '15 minutes')
);

COMMENT ON TABLE orders IS '支付订单';
COMMENT ON COLUMN orders.payment_status IS '0=待支付 1=已支付 2=已关闭 3=已退款';

-- =============================================
-- 6. 分享链接表
-- =============================================
CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  file_name VARCHAR(255),
  file_url TEXT NOT NULL,
  share_key VARCHAR(100) NOT NULL UNIQUE,
  download_count INT DEFAULT 0,
  max_downloads INT DEFAULT 0,
  is_active INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days')
);

COMMENT ON TABLE share_links IS '文件分享链接';
COMMENT ON COLUMN share_links.max_downloads IS '0=无限';

-- =============================================
-- 7. 通知表
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_read INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE notifications IS '用户站内通知';

-- =============================================
-- 8. 系统配置表
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE settings IS '系统配置';

-- =============================================
-- 9. 反馈表
-- =============================================
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bug','feature','other')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  contact VARCHAR(255),
  status INT DEFAULT 0 CHECK (status >= 0 AND status <= 3),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE feedbacks IS '用户反馈';

-- =============================================
-- 10. 公告表
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) DEFAULT '',
  content TEXT NOT NULL,
  content_en TEXT DEFAULT '',
  type VARCHAR(20) DEFAULT 'notice' CHECK (type IN ('notice','update','maintenance','promotion')),
  is_published INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE announcements IS '系统公告';

-- =============================================
-- 插入默认系统配置
-- =============================================
INSERT INTO settings (key, value, description) VALUES
  ('free_ai_daily_limit', '2', '免费用户AI改写每日次数'),
  ('free_ocr_daily_limit', '3', '免费用户OCR每日次数'),
  ('free_watermark_daily_limit', '1', '免费用户去水印每日次数'),
  ('basic_ai_daily_limit', '20', 'Basic用户AI改写每日次数'),
  ('basic_ocr_daily_limit', '-1', 'Basic用户OCR每日次数（-1=无限）'),
  ('basic_watermark_daily_limit', '10', 'Basic用户去水印每日次数'),
  ('pro_ai_daily_limit', '50', 'Pro用户AI改写每日次数'),
  ('pro_ocr_daily_limit', '-1', 'Pro用户OCR每日次数'),
  ('pro_watermark_daily_limit', '30', 'Pro用户去水印每日次数'),
  ('lifetime_ai_daily_limit', '20', '终身用户AI改写每日次数'),
  ('lifetime_ocr_daily_limit', '-1', '终身用户OCR每日次数'),
  ('lifetime_watermark_daily_limit', '10', '终身用户去水印每日次数'),
  ('max_file_size_mb', '50', '最大文件大小（MB）'),
  ('max_concurrent_tasks', '2', '单用户最大并发任务数'),
  ('max_daily_tasks_per_ip', '50', '单IP每日最大任务数'),
  ('max_daily_fail_tasks', '20', '单用户每日最大失败任务数'),
  ('task_timeout_seconds', '30', '任务超时时间（秒）'),
  ('max_task_retries', '3', '单任务最大重试次数'),
  ('file_expire_hours', '24', '文件保存时长（小时）'),
  ('max_share_per_file', '3', '单文件最大分享数'),
  ('price_basic_cny', '9.9', 'Basic月价（人民币）'),
  ('price_pro_cny', '19.9', 'Pro月价（人民币）'),
  ('price_lifetime_cny', '149', '终身版价格（人民币）'),
  ('price_basic_usd', '2.99', 'Basic月价（美元）'),
  ('price_pro_usd', '5.99', 'Pro月价（美元）'),
  ('price_lifetime_usd', '49.99', '终身版价格（美元）'),
  ('share_expire_days', '7', '分享链接过期天数'),
  ('login_lock_minutes', '15', '登录失败锁定时长（分钟）'),
  ('login_max_fail', '5', '登录最大失败次数')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 索引
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users(apple_id);
CREATE INDEX IF NOT EXISTS idx_user_limits_user_date ON user_limits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_file_md5 ON tasks(file_md5, created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_expires ON tasks(expires_at) WHERE status != 3;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_share_links_key ON share_links(share_key);
CREATE INDEX IF NOT EXISTS idx_share_links_user ON share_links(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, published_at DESC);

-- =============================================
-- 自动过期任务清理函数（每日执行）
-- =============================================
CREATE OR REPLACE FUNCTION clean_expired_tasks()
RETURNS void AS $$
BEGIN
  DELETE FROM tasks WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 每日次数重置函数（每日0点 UTC+8 = 16:00 UTC）
-- =============================================
CREATE OR REPLACE FUNCTION reset_daily_limits()
RETURNS void AS $$
BEGIN
  -- 逻辑重置：通过日期字段自动隔离，无需物理删除
  -- user_limits 表使用 UNIQUE(user_id, date) 约束
  -- 查询时按当天日期查询即可
  NULL;
END;
$$ LANGUAGE plpgsql;
