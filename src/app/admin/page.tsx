"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Ticket,
  Settings,
  Menu,
  X,
  ArrowLeft,
  Plus,
  Search,
} from "lucide-react";

type MenuItem = "overview" | "users" | "tasks" | "codes" | "settings";

const menuItems: { key: MenuItem; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "数据概览", icon: <LayoutDashboard size={20} /> },
  { key: "users", label: "用户管理", icon: <Users size={20} /> },
  { key: "tasks", label: "任务管理", icon: <FileText size={20} /> },
  { key: "codes", label: "激活码管理", icon: <Ticket size={20} /> },
  { key: "settings", label: "系统设置", icon: <Settings size={20} /> },
];

/* ───────── Overview ───────── */
function Overview() {
  const cards = [
    { title: "总用户", value: "1,234", change: "+12.5%", icon: <Users size={24} />, up: true },
    { title: "今日活跃", value: "89", change: "+3.2%", icon: <LayoutDashboard size={24} />, up: true },
    { title: "今日任务", value: "256", change: "-2.1%", icon: <FileText size={24} />, up: false },
    { title: "本月收入", value: "¥12,345", change: "+8.7%", icon: <Ticket size={24} />, up: true },
  ];
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">数据概览</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div
            key={c.title}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{c.title}</span>
              <span className="text-gray-400">{c.icon}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{c.value}</div>
            <div className={`mt-2 text-sm font-medium ${c.up ? "text-green-500" : "text-red-500"}`}>
              {c.change} <span className="text-gray-400 font-normal">vs 上月</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Users ───────── */
function UsersPanel() {
  const [search, setSearch] = useState("");
  const rows = [
    { id: 1, name: "张三", email: "zhangsan@example.com", level: "Pro", status: "正常", date: "2025-01-15" },
    { id: 2, name: "李四", email: "lisi@example.com", level: "Free", status: "正常", date: "2025-02-20" },
    { id: 3, name: "王五", email: "wangwu@example.com", level: "Pro", status: "封禁", date: "2025-03-01" },
    { id: 4, name: "赵六", email: "zhaoliu@example.com", level: "Enterprise", status: "正常", date: "2025-03-10" },
    { id: 5, name: "孙七", email: "sunqi@example.com", level: "Free", status: "正常", date: "2025-04-05" },
    { id: 6, name: "周八", email: "zhouba@example.com", level: "Pro", status: "正常", date: "2025-04-18" },
  ];
  const filtered = rows.filter(
    (r) =>
      r.name.includes(search) || r.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">用户管理</h2>
      <div className="relative mb-4 w-full max-w-sm">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索用户..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#165DFF]/30 focus:border-[#165DFF] transition"
        />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="px-5 py-3 font-medium">ID</th>
              <th className="px-5 py-3 font-medium">昵称</th>
              <th className="px-5 py-3 font-medium">邮箱</th>
              <th className="px-5 py-3 font-medium">等级</th>
              <th className="px-5 py-3 font-medium">状态</th>
              <th className="px-5 py-3 font-medium">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-500">#{r.id}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-5 py-3 text-gray-500">{r.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    r.level === "Enterprise"
                      ? "bg-purple-50 text-purple-600"
                      : r.level === "Pro"
                      ? "bg-[#165DFF]/10 text-[#165DFF]"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {r.level}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${r.status === "正常" ? "bg-green-400" : "bg-red-400"}`} />
                  {r.status}
                </td>
                <td className="px-5 py-3 text-gray-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Tasks ───────── */
function TasksPanel() {
  const rows = [
    { id: "TSK-001", user: "张三", type: "PDF转Word", status: "已完成", pages: 12, date: "2025-04-20 14:30" },
    { id: "TSK-002", user: "李四", type: "PDF转PPT", status: "进行中", pages: 34, date: "2025-04-20 15:10" },
    { id: "TSK-003", user: "王五", type: "PDF转Excel", status: "已完成", pages: 5, date: "2025-04-20 16:00" },
    { id: "TSK-004", user: "赵六", type: "PDF转Markdown", status: "失败", pages: 0, date: "2025-04-20 16:45" },
    { id: "TSK-005", user: "孙七", type: "PDF转Word", status: "已完成", pages: 28, date: "2025-04-21 09:20" },
    { id: "TSK-006", user: "周八", type: "PDF转PPT", status: "排队中", pages: 15, date: "2025-04-21 10:05" },
    { id: "TSK-007", user: "张三", type: "PDF转Excel", status: "已完成", pages: 8, date: "2025-04-21 11:30" },
  ];
  const statusColor: Record<string, string> = {
    已完成: "bg-green-50 text-green-600",
    进行中: "bg-blue-50 text-blue-600",
    失败: "bg-red-50 text-red-600",
    排队中: "bg-yellow-50 text-yellow-600",
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">任务管理</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="px-5 py-3 font-medium">任务ID</th>
              <th className="px-5 py-3 font-medium">用户</th>
              <th className="px-5 py-3 font-medium">类型</th>
              <th className="px-5 py-3 font-medium">页数</th>
              <th className="px-5 py-3 font-medium">状态</th>
              <th className="px-5 py-3 font-medium">时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-mono text-gray-500 text-xs">{r.id}</td>
                <td className="px-5 py-3 text-gray-900">{r.user}</td>
                <td className="px-5 py-3 text-gray-600">{r.type}</td>
                <td className="px-5 py-3 text-gray-500">{r.pages}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Codes ───────── */
function CodesPanel() {
  const codes = [
    { code: "DP-XXXX-YYYY-ZZZZ", type: "Pro月卡", status: "未使用", user: "—", date: "2025-04-20" },
    { code: "DP-AAAA-BBBB-CCCC", type: "Pro季卡", status: "已使用", user: "张三", date: "2025-04-18" },
    { code: "DP-DDDD-EEEE-FFFF", type: "Enterprise年卡", status: "未使用", user: "—", date: "2025-04-19" },
    { code: "DP-GGGG-HHHH-IIII", type: "Pro月卡", status: "已过期", user: "—", date: "2025-01-10" },
    { code: "DP-JJJJ-KKKK-LLLL", type: "Pro季卡", status: "已使用", user: "李四", date: "2025-04-15" },
    { code: "DP-MMMM-NNNN-OOOO", type: "Pro月卡", status: "未使用", user: "—", date: "2025-04-21" },
  ];
  const statusColor: Record<string, string> = {
    未使用: "bg-blue-50 text-blue-600",
    已使用: "bg-green-50 text-green-600",
    已过期: "bg-gray-100 text-gray-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">激活码管理</h2>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#165DFF] text-white text-sm font-medium hover:bg-[#165DFF]/90 transition">
          <Plus size={16} /> 生成激活码
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="px-5 py-3 font-medium">激活码</th>
              <th className="px-5 py-3 font-medium">类型</th>
              <th className="px-5 py-3 font-medium">状态</th>
              <th className="px-5 py-3 font-medium">使用者</th>
              <th className="px-5 py-3 font-medium">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 font-mono text-xs text-gray-900">{c.code}</td>
                <td className="px-5 py-3 text-gray-600">{c.type}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[c.status] ?? ""}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{c.user}</td>
                <td className="px-5 py-3 text-gray-500">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Settings ───────── */
function SettingsPanel() {
  const [form, setForm] = useState({
    siteName: "DocPrompt AI",
    defaultLang: "zh-CN",
    maxFileSize: "50",
    dailyTaskLimit: "100",
    enableRegister: true,
    enableAI: true,
    maintenanceMode: false,
  });
  const toggle = (key: "enableRegister" | "enableAI" | "maintenanceMode") =>
    setForm((f) => ({ ...f, [key]: !f[key] }));
  const change = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">系统设置</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-2xl">
        {[
          { label: "站点名称", key: "siteName", type: "text" },
          { label: "默认语言", key: "defaultLang", type: "text" },
          { label: "文件大小限制 (MB)", key: "maxFileSize", type: "text" },
          { label: "每日任务上限", key: "dailyTaskLimit", type: "text" },
        ].map((item) => (
          <div key={item.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{item.label}</label>
            <input
              type={item.type}
              value={form[item.key as keyof typeof form] as string}
              onChange={(e) => change(item.key, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#165DFF]/30 focus:border-[#165DFF] transition"
            />
          </div>
        ))}

        {[
          { label: "开放注册", key: "enableRegister" as const },
          { label: "AI 功能", key: "enableAI" as const },
          { label: "维护模式", key: "maintenanceMode" as const },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <button
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form[item.key] ? "bg-[#165DFF]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form[item.key] ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}

        <button className="px-6 py-2.5 rounded-xl bg-[#165DFF] text-white text-sm font-medium hover:bg-[#165DFF]/90 transition">
          保存设置
        </button>
      </div>
    </div>
  );
}

/* ───────── Page ───────── */
export default function AdminPage() {
  const [active, setActive] = useState<MenuItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const panel: Record<MenuItem, React.ReactNode> = {
    overview: <Overview />,
    users: <UsersPanel />,
    tasks: <TasksPanel />,
    codes: <CodesPanel />,
    settings: <SettingsPanel />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            DocPrompt <span className="text-[#165DFF]">AI</span>
          </span>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active === item.key
                  ? "bg-[#165DFF]/10 text-[#165DFF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={16} />
            返回前台
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="p-6 lg:p-8">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm"
            >
              <Menu size={18} />
              菜单
            </button>
          </div>
          {panel[active]}
        </div>
      </main>
    </div>
  );
}
