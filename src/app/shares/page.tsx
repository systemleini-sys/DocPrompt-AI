"use client";

import { useState } from "react";
import { Plus, Link2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import ShareLinkCard from "@/components/features/ShareLinkCard";

const mockShares = [
  { id: 1, fileName: "项目需求文档.docx", link: "https://docprompt.ai/s/Xk9mP2qR", views: 23, expiresAt: "2026-03-30" },
  { id: 2, fileName: "产品图片-无水印.png", link: "https://docprompt.ai/s/Az7wN3jK", views: 156, expiresAt: "2026-04-01" },
  { id: 3, fileName: "合同扫描件.pdf", link: "https://docprompt.ai/s/Bm4pL8hT", views: 5, expiresAt: "2026-03-25" },
];

export default function SharesPage() {
  const [shares, setShares] = useState(mockShares);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFile, setNewFile] = useState("");

  const handleCreate = () => {
    if (!newFile.trim()) return;
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setShares((prev) => [
      {
        id: Date.now(),
        fileName: newFile.trim(),
        link: `https://docprompt.ai/s/${code}`,
        views: 0,
        expiresAt: "2026-04-01",
      },
      ...prev,
    ]);
    setNewFile("");
    setShowCreateModal(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F7F7]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-[#111]">分享管理</h1>
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              创建分享
            </Button>
          </div>

          {shares.length > 0 ? (
            <div className="space-y-3">
              {shares.map((share) => (
                <ShareLinkCard
                  key={share.id}
                  fileName={share.fileName}
                  link={share.link}
                  views={share.views}
                  expiresAt={share.expiresAt}
                  onDelete={() => setShares((prev) => prev.filter((s) => s.id !== share.id))}
                />
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <Link2 className="w-10 h-10 text-[#E5E5E5] mx-auto mb-3" />
              <p className="text-sm text-[#999]">暂无分享链接</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                创建第一个分享
              </Button>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="创建分享链接" size="sm">
        <div className="space-y-4">
          <Input label="文件名称" placeholder="输入要分享的文件名" value={newFile} onChange={(e) => setNewFile(e.target.value)} />
          <Button fullWidth onClick={handleCreate}>
            生成分享链接
          </Button>
        </div>
      </Modal>
    </>
  );
}
