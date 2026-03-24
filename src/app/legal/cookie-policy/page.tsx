import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - DocPrompt AI",
  description:
    "Learn about how DocPrompt AI uses cookies and similar technologies to improve your experience.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 lg:px-20">
        <h1 className="mb-2 text-[32px] font-bold leading-tight text-[#111] md:text-[32px]">
          Cookie Policy
        </h1>
        <p className="mb-10 text-sm text-[#666]">
          Last updated: March 2026
        </p>

        <div className="space-y-8 text-base leading-relaxed text-[#333]">
          {/* 1 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a
              website. They help us remember your preferences, understand how you
              use our service, and improve your overall experience.
            </p>
            <p className="mt-3">
              DocPrompt AI uses cookies and similar technologies (such as local
              storage) to provide, secure, and analyze our services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              2. Types of Cookies We Use
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="pb-2 text-left font-medium text-[#111]">
                      Category
                    </th>
                    <th className="pb-2 text-left font-medium text-[#111]">
                      Purpose
                    </th>
                    <th className="pb-2 text-left font-medium text-[#111]">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  <tr>
                    <td className="py-3 font-medium">Strictly Necessary</td>
                    <td className="py-3">
                      Authentication, security, session management
                    </td>
                    <td className="py-3">Session / 30 days</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Functional</td>
                    <td className="py-3">
                      Remember preferences, language settings, theme
                    </td>
                    <td className="py-3">Up to 1 year</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Analytics</td>
                    <td className="py-3">
                      Understand usage patterns, improve performance
                    </td>
                    <td className="py-3">Up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              3. Managing Your Cookie Preferences
            </h2>
            <p>
              When you first visit DocPrompt AI (international version), you will
              see a cookie consent banner. You may:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Accept all cookies</strong> — Enable all cookie
                categories.
              </li>
              <li>
                <strong>Reject optional cookies</strong> — Only strictly
                necessary cookies will be used.
              </li>
              <li>
                <strong>Customize</strong> — Choose which categories to enable.
              </li>
            </ul>
            <p className="mt-3">
              You can update your preferences at any time through the cookie
              settings link in the footer or your account settings.
            </p>
            <p className="mt-3">
              You may also manage cookies through your browser settings. Note
              that disabling certain cookies may affect the functionality of our
              service.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              4. Third-Party Cookies
            </h2>
            <p>
              Some cookies are placed by third-party services that we use to
              operate and improve our platform:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Google Analytics</strong> — Website usage analytics
              </li>
              <li>
                <strong>Cloudflare</strong> — CDN performance and security
              </li>
              <li>
                <strong>Lemon Squeezy</strong> — Payment processing (international version)
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              5. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              6. Contact Us
            </h2>
            <p>
              If you have questions about our use of cookies, please contact us
              at:
            </p>
            <p className="mt-2 text-[#666]">
              Email: privacy@docprompt.ai
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
