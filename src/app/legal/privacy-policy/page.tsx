import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DocPrompt AI",
  description:
    "DocPrompt AI Privacy Policy. Learn how we collect, use, store, and share your data, and your rights under PIPL and GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
        <h1 className="text-4xl font-bold tracking-tight">
          隐私政策 / Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          最后更新：2025 年 3 月 23 日 / Last updated: March 23, 2025
        </p>

        {/* ===================== 中文版（PIPL） ===================== */}
        <section className="mt-12 space-y-8">
          <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold">
            中文版（适用中国大陆用户 · 符合《个人信息保护法》）
          </h2>

          <div>
            <h3 className="text-lg font-semibold">1. 我们是谁</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              DocPrompt AI（以下简称&ldquo;我们&rdquo;）重视您的隐私。本隐私政策说明我们如何收集、使用、存储和共享您的个人信息。本政策依据《中华人民共和国个人信息保护法》《中华人民共和国数据安全法》及相关法律法规制定。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. 我们收集的信息</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              <strong>您主动提供的信息：</strong>
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>注册信息：邮箱地址、用户名。</li>
              <li>支付信息：支付订单号（我们不存储银行卡号等完整支付凭证）。</li>
              <li>您上传的文档内容（用于 AI 处理）。</li>
            </ul>
            <p className="mt-3 leading-relaxed text-gray-700">
              <strong>自动收集的信息：</strong>
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>设备信息：浏览器类型、操作系统、设备标识符。</li>
              <li>使用数据：页面访问记录、功能使用频次、错误日志。</li>
              <li>Cookie 和类似技术（详见 Cookie 政策）。</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. 信息使用目的</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>提供、维护和改进本服务。</li>
              <li>处理您的文档请求并返回 AI 生成结果。</li>
              <li>验证您的身份并保障账号安全。</li>
              <li>发送服务通知和安全警报。</li>
              <li>进行匿名化的数据分析以优化产品体验。</li>
              <li>遵守法律法规要求。</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">4. 信息存储与安全</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              我们的服务器部署在中国境内（及必要的境外服务节点）。我们采用行业标准的安全措施（SSL/TLS
              加密、访问控制、数据脱敏）保护您的个人信息。
            </p>
            <p className="mt-2 font-semibold text-gray-800">
              文件保存期限：您上传的文档在服务器上仅保留 24
              小时，到期后自动删除。我们不会将您的文档用于训练 AI 模型。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">5. 信息共享</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                <strong>服务提供商：</strong>
                云计算服务商（如阿里云）、支付处理商（如支付宝、微信支付），仅限履行其服务职能所必需。
              </li>
              <li>
                <strong>法律要求：</strong>
                根据法律法规、监管要求或司法程序的要求。
              </li>
              <li>
                <strong>安全保护：</strong>
                为保护我们、用户或公众的权利、财产或安全。
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">6. 您的权利</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              根据《个人信息保护法》，您享有以下权利：
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                <strong>知情权：</strong>了解我们如何处理您的个人信息。
              </li>
              <li>
                <strong>查阅与复制权：</strong>获取您的个人信息副本。
              </li>
              <li>
                <strong>更正权：</strong>更正不准确的个人信息。
              </li>
              <li>
                <strong>删除权：</strong>请求删除您的个人信息（注销账号后自动执行）。
              </li>
              <li>
                <strong>撤回同意权：</strong>撤回此前给予的同意，不影响撤回前基于同意的处理合法性。
              </li>
              <li>
                <strong>限制或拒绝处理权：</strong>在法律规定的情形下，限制或拒绝我们处理您的个人信息。
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">7. Cookie 使用</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              我们使用 Cookie 和类似技术来提升您的使用体验。有关详细信息，请参阅我们的{" "}
              <a
                href="/legal/cookie-policy"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Cookie 政策
              </a>
              。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">8. 未成年人保护</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              本服务面向 16 周岁以上用户。我们不会有意收集 16
              周岁以下未成年人的个人信息。如果我们发现无意中收集了此类信息，将立即删除。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">9. 联系我们</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              如需行使您的权利或有任何隐私相关问题，请联系：
              <br />
              邮箱：privacy@docprompt.ai
              <br />
              如您对我们的回复不满意，您有权向网信部门或市场监管部门投诉举报。
            </p>
          </div>
        </section>

        {/* ===================== 英文版（GDPR） ===================== */}
        <section className="mt-20 space-y-8">
          <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold">
            English Version (International Users · GDPR Compliant)
          </h2>

          <div>
            <h3 className="text-lg font-semibold">1. Who We Are</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              DocPrompt AI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
              respects your privacy. This Privacy Policy explains how we
              collect, use, store, and share your personal data. This policy is
              prepared in compliance with the EU General Data Protection
              Regulation (GDPR) and applicable data protection laws.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Data We Collect</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              <strong>Information you provide:</strong>
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                Account information: email address, display name.
              </li>
              <li>
                Payment information: order reference numbers (we do not store
                full card numbers or payment credentials).
              </li>
              <li>
                Documents you upload for AI processing.
              </li>
            </ul>
            <p className="mt-3 leading-relaxed text-gray-700">
              <strong>Automatically collected information:</strong>
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                Device information: browser type, operating system, device
                identifiers.
              </li>
              <li>
                Usage data: page views, feature usage frequency, error logs.
              </li>
              <li>
                Cookies and similar technologies (see our Cookie Policy).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. Purpose of Processing</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                Providing, maintaining, and improving the Service.
              </li>
              <li>
                Processing your document requests and returning AI-generated
                results.
              </li>
              <li>
                Verifying your identity and securing your account.
              </li>
              <li>
                Sending service notifications and security alerts.
              </li>
              <li>
                Conducting anonymized data analysis to improve product
                experience.
              </li>
              <li>
                Complying with legal obligations.
              </li>
            </ul>
            <p className="mt-2 leading-relaxed text-gray-700">
              <strong>Legal basis (GDPR Art. 6):</strong> We process your data
              based on (a) contract performance, (b) legitimate interests, (c)
              consent, and (d) legal compliance, as applicable to each processing
              activity.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">4. Data Storage &amp; Security</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              Your data is stored on secure servers with industry-standard
              protection (SSL/TLS encryption, access controls, data
              minimization, pseudonymization).
            </p>
            <p className="mt-2 font-semibold text-gray-800">
              Document Retention: Uploaded documents are retained on our servers
              for a maximum of 24 hours only, after which they are automatically
              deleted. We do not use your documents to train AI models.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">5. Data Sharing</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              We do not sell your personal data. We share data only:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                <strong>Service Providers:</strong> Cloud infrastructure
                providers (e.g., AWS, Vercel), payment processors (e.g., Stripe),
                limited to what is necessary to perform their services.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law,
                regulation, or legal process.
              </li>
              <li>
                <strong>Safety:</strong> To protect the rights, property, or
                safety of DocPrompt AI, our users, or the public.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">6. Your Rights (GDPR Art. 12–23)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                <strong>Right of Access:</strong> Obtain a copy of your personal
                data.
              </li>
              <li>
                <strong>Right to Rectification:</strong> Correct inaccurate data.
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your
                personal data.
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> Limit how we
                process your data.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> Receive your data in
                a structured, machine-readable format.
              </li>
              <li>
                <strong>Right to Object:</strong> Object to processing based on
                legitimate interests or for direct marketing.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> Withdraw consent at
                any time without affecting prior lawful processing.
              </li>
              <li>
                <strong>Right to Lodge a Complaint:</strong> With a supervisory
                authority in your jurisdiction.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">7. Cookie Usage</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              We use cookies and similar technologies to enhance your
              experience. Please see our{" "}
              <a
                href="/legal/cookie-policy"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Cookie Policy
              </a>{" "}
              for details.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">8. Children&apos;s Privacy</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              The Service is intended for users aged 16 and above. We do not
              knowingly collect personal data from children under 16. If we
              become aware that we have inadvertently collected such data, we
              will delete it immediately.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">9. Contact Us</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              To exercise your rights or for any privacy-related inquiries:
              <br />
              Email: privacy@docprompt.ai
              <br />
              Data Protection Officer (DPO): dpo@docprompt.ai
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
