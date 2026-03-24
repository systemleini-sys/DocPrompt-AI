interface FooterProps {
  locale?: "cn" | "en";
}

const cn = {
  product: { title: "产品功能", items: ["AI 改写", "格式转换", "OCR 识别", "批量处理", "API 接口"] },
  about: { title: "关于", items: ["关于我们", "使用教程", "更新日志", "帮助中心"] },
  legal: { title: "法律条款", items: ["用户协议", "隐私政策"] },
  contact: { title: "联系我们", items: ["客服邮箱", "微信公众号", "加入我们"] },
  copyright: `© ${new Date().getFullYear()} DocPrompt AI. All rights reserved.`,
};

const en = {
  product: { title: "Product", items: ["AI Rewrite", "Format Convert", "OCR", "Batch Process", "API"] },
  about: { title: "About", items: ["About Us", "Tutorials", "Changelog", "Help Center"] },
  legal: { title: "Legal", items: ["Terms of Service", "Privacy Policy", "Cookie Policy", "DMCA"] },
  contact: { title: "Contact", items: ["Email Support", "Twitter", "Careers"] },
  copyright: `© ${new Date().getFullYear()} DocPrompt AI. All rights reserved.`,
};

export default function Footer({ locale = "cn" }: FooterProps) {
  const t = locale === "cn" ? cn : en;

  return (
    <footer className="bg-[#F7F7F7] border-t border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[t.product, t.about, t.legal, t.contact].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-[#111] mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item}>
                    <span className="text-sm text-[#666] hover:text-[#111] cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[#E5E5E5] text-center text-xs text-[#999]">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
