import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DocPrompt AI",
  description:
    "Read the Terms of Service for DocPrompt AI. Covers user responsibilities, intellectual property, disclaimers, and more.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
        <h1 className="text-4xl font-bold tracking-tight">
          服务条款 / Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          最后更新：2025 年 3 月 23 日 / Last updated: March 23, 2025
        </p>

        {/* ===================== 中文版 ===================== */}
        <section className="mt-12 space-y-8">
          <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold">
            中文版（适用中国大陆用户）
          </h2>

          <div>
            <h3 className="text-lg font-semibold">1. 服务描述</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              DocPrompt AI（以下简称&ldquo;本服务&rdquo;）是由 DocPrompt
              团队（以下简称&ldquo;我们&rdquo;）运营的在线文档智能处理平台。本服务利用人工智能技术，为用户提供文档解读、内容提取、格式转换、智能问答等功能。本服务按&ldquo;现状&rdquo;和&ldquo;现有&rdquo;基础提供，我们不保证服务的持续性、无错误性或完全兼容性。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. 使用资格</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              您必须年满 16 周岁方可使用本服务。如果您未满 18
              周岁，须在法定监护人的陪同和同意下使用本服务。使用本服务即表示您声明并保证您满足上述年龄要求。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. 用户责任</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                不得利用本服务从事任何违反法律法规的行为，包括但不限于传播违法信息、侵犯他人合法权益。
              </li>
              <li>
                不得上传含有病毒、恶意代码或其他有害成分的文件。
              </li>
              <li>
                不得对本服务进行反向工程、反编译、反汇编，或以其他方式试图获取服务源代码。
              </li>
              <li>
                不得利用自动化工具（爬虫、机器人等）过度访问或滥用本服务的接口。
              </li>
              <li>
                您对通过本服务生成内容的准确性和合法性承担全部责任。
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">4. 账号注册与管理</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              您须使用真实、准确的信息注册账号。您有义务妥善保管账号和密码的安全，对账号下发生的一切行为负责。如发现账号被未经授权使用，请立即联系我们。
            </p>
            <p className="mt-2 leading-relaxed text-gray-700">
              <strong>账号注销与数据清除：</strong>
              您可随时通过&ldquo;设置 → 账号 → 注销账号&rdquo;提交注销请求。我们将在收到请求后
              7
              个工作日内完成注销，并删除您的所有个人数据及文档记录。注销后，账号不可恢复，已购买的付费服务（含终身版）不予退款。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">5. 知识产权</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              本服务的所有内容，包括但不限于软件、界面设计、标识、文档、算法，均受中国及国际知识产权法律保护。您上传的原始文档，其知识产权归您所有。基于您文档生成的 AI
              输出内容，您享有合理使用权，但须遵守本服务条款。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">6. 终身版特别条款</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              &ldquo;终身版&rdquo;是指一次性付费购买后，在当前产品版本下永久使用的授权。终身版用户享有以下权利和限制：
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                <strong>不可退款：</strong>终身版一经购买，除法律另有规定外，不支持退款。
              </li>
              <li>
                <strong>不可转让：</strong>终身版授权仅限购买者本人使用，不得转让、出售或赠与第三方。
              </li>
              <li>
                <strong>功能范围：</strong>终身版权益仅涵盖购买时当前版本的功能。后续新增的高级功能可能需要额外付费。
              </li>
              <li>
                <strong>维护承诺：</strong>我们将持续维护终身版可用性，但保留因技术、法律或运营原因调整服务的权利，届时将提前
                30 天通知。
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">7. 免责声明</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              AI
              生成内容可能存在不准确、不完整或过时的情况。本服务提供的所有输出仅供参考，不构成专业法律、医疗、财务或其他专业建议。您应在做出任何重要决策前咨询相关专业人士。我们对因使用本服务或依赖
              AI
              输出内容而产生的任何直接、间接、附带或后果性损失不承担责任。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">8. 服务终止</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              我们有权在以下情况下暂停或终止您对本服务的访问权限：(1)
              违反本服务条款；(2)
              涉嫌违法行为；(3) 长期不活跃（连续 12
              个月未登录）。终止后，我们将按照账号注销流程处理您的数据。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">9. 争议解决</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              本服务条款适用中华人民共和国法律。因本服务产生的或与本服务相关的任何争议，双方应首先通过友好协商解决。协商不成的，任何一方均可向我们所在地有管辖权的人民法院提起诉讼。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">10. 条款变更</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              我们保留随时修改本服务条款的权利。修改后的条款将在本页面公布，并通过邮件或站内通知的方式告知您。继续使用本服务即视为您同意修改后的条款。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">11. 联系我们</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              如有任何疑问，请通过以下方式联系我们：
              <br />
              邮箱：legal@docprompt.ai
            </p>
          </div>
        </section>

        {/* ===================== 英文版 ===================== */}
        <section className="mt-20 space-y-8">
          <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold">
            English Version (International Users)
          </h2>

          <div>
            <h3 className="text-lg font-semibold">1. Description of Service</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              DocPrompt AI (the &ldquo;Service&rdquo;) is an online document intelligence
              platform operated by the DocPrompt team (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). The
              Service leverages artificial intelligence to provide document
              interpretation, content extraction, format conversion, intelligent
              Q&amp;A, and related features. The Service is provided on an &ldquo;as is&rdquo;
              and &ldquo;as available&rdquo; basis. We do not guarantee uninterrupted,
              error-free, or fully compatible operation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Eligibility</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              You must be at least 16 years of age to use the Service. If you
              are under 18, you must use the Service under the supervision and
              consent of a parent or legal guardian. By using the Service, you
              represent and warrant that you meet these age requirements.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. User Responsibilities</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                You shall not use the Service for any unlawful purpose, including
                but not limited to distributing illegal content or infringing on
                the rights of others.
              </li>
              <li>
                You shall not upload files containing viruses, malware, or other
                harmful components.
              </li>
              <li>
                You shall not reverse-engineer, decompile, disassemble, or
                otherwise attempt to access the source code of the Service.
              </li>
              <li>
                You shall not use automated tools (scrapers, bots, etc.) to
                excessively access or abuse the Service APIs.
              </li>
              <li>
                You bear full responsibility for the accuracy and legality of
                content generated through the Service.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              4. Account Registration &amp; Management
            </h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              You must register using accurate and truthful information. You are
              responsible for maintaining the security of your account and
              password. You are liable for all activities under your account. If
              you suspect unauthorized use, contact us immediately.
            </p>
            <p className="mt-2 leading-relaxed text-gray-700">
              <strong>Account Deletion &amp; Data Erasure:</strong> You may request
              account deletion at any time via Settings → Account → Delete
              Account. We will process the request within 7 business days and
              permanently delete all your personal data and document records. Once
              deleted, the account cannot be recovered, and paid services
              (including Lifetime plans) are non-refundable.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">5. Intellectual Property</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              All content of the Service — including but not limited to software,
              interface design, logos, documentation, and algorithms — is
              protected by applicable intellectual property laws. You retain
              ownership of the original documents you upload. You are granted a
              reasonable use license for AI-generated output based on your
              documents, subject to these Terms.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">6. Lifetime Plan Special Terms</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              The &ldquo;Lifetime Plan&rdquo; is a one-time payment granting perpetual access
              to the current version of the Service. Lifetime Plan users are
              subject to the following:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 leading-relaxed text-gray-700">
              <li>
                <strong>Non-Refundable:</strong> Except where required by law,
                Lifetime Plan purchases are not eligible for refunds.
              </li>
              <li>
                <strong>Non-Transferable:</strong> The license is for the
                original purchaser only and may not be sold, transferred, or
                gifted to third parties.
              </li>
              <li>
                <strong>Scope of Features:</strong> The Lifetime Plan covers
                features available at the time of purchase. Future premium
                features may require additional payment.
              </li>
              <li>
                <strong>Maintenance Commitment:</strong> We will maintain the
                Lifetime Plan&apos;s availability, but reserve the right to modify
                the Service due to technical, legal, or operational reasons with
                30 days&apos; advance notice.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">7. Disclaimer</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              AI-generated content may be inaccurate, incomplete, or outdated.
              All output is provided for informational purposes only and does not
              constitute professional legal, medical, financial, or other expert
              advice. You should consult qualified professionals before making
              any important decisions. We disclaim all liability for any direct,
              indirect, incidental, or consequential damages arising from the use
              of the Service or reliance on AI output.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">8. Termination</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              We may suspend or terminate your access to the Service if: (1) you
              violate these Terms; (2) you engage in unlawful activity; or (3)
              your account is inactive for 12 consecutive months. Upon
              termination, your data will be handled in accordance with the
              account deletion process.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">9. Dispute Resolution</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              These Terms are governed by the laws of the jurisdiction in which
              we operate, without regard to conflict-of-law principles. Any
              dispute arising out of or relating to these Terms shall first be
              resolved through good-faith negotiation. If negotiation fails,
              disputes shall be submitted to binding arbitration in accordance
              with the rules of the relevant arbitration body, or to the
              competent courts of our jurisdiction.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">10. Changes to Terms</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              We reserve the right to modify these Terms at any time. Updated
              Terms will be posted on this page, and we will notify you via
              email or in-app notification. Your continued use of the Service
              after changes are posted constitutes acceptance of the revised
              Terms.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">11. Contact Us</h3>
            <p className="mt-2 leading-relaxed text-gray-700">
              If you have any questions, please contact us at:
              <br />
              Email: legal@docprompt.ai
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
