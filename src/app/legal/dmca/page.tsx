import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Notice - DocPrompt AI",
  description:
    "DocPrompt AI respects intellectual property rights. Learn about our DMCA takedown policy and how to file a notice.",
};

export default function DMCAPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-10 lg:px-20">
        <h1 className="mb-2 text-[32px] font-bold leading-tight text-[#111] md:text-[32px]">
          DMCA Notice & Takedown Policy
        </h1>
        <p className="mb-10 text-sm text-[#666]">
          Last updated: March 2026
        </p>

        <div className="space-y-8 text-base leading-relaxed text-[#333]">
          {/* 1 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              1. Copyright Infringement Notification
            </h2>
            <p>
              DocPrompt AI respects the intellectual property rights of others
              and expects our users to do the same. In accordance with the
              Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512, we
              will respond expeditiously to claims of copyright infringement
              committed using our service.
            </p>
            <p className="mt-3">
              If you believe that your copyrighted work has been used or
              accessed through DocPrompt AI in a way that constitutes copyright
              infringement, please provide our designated copyright agent with
              the following information in writing:
            </p>

            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>
                A physical or electronic signature of a person authorized to act
                on behalf of the owner of the copyright that has been allegedly
                infringed.
              </li>
              <li>
                Identification of the copyrighted work claimed to have been
                infringed, or, if multiple works at a single online site are
                covered by a single notification, a representative list of such
                works.
              </li>
              <li>
                Identification of the specific material that is claimed to be
                infringing and that is to be removed or have access disabled,
                and information reasonably sufficient to permit the service
                provider to locate the material.
              </li>
              <li>
                Contact information for the notifier, including address,
                telephone number, and email address.
              </li>
              <li>
                A statement that the notifier has a good faith belief that the
                material is not authorized by the copyright owner, its agent, or
                the law.
              </li>
              <li>
                A statement, under penalty of perjury, that the information in
                the notification is accurate and that the notifying party is
                authorized to act on behalf of the owner of the copyright that
                is allegedly infringed.
              </li>
            </ol>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              2. Designated Copyright Agent
            </h2>
            <p>
              All DMCA takedown notices should be sent to our designated
              copyright agent:
            </p>
            <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 text-[#333]">
              <p className="font-medium">DocPrompt AI Copyright Agent</p>
              <p className="mt-1">Email: dmca@docprompt.ai</p>
              <p className="mt-1">Subject Line: DMCA Takedown Notice</p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              3. Counter-Notification
            </h2>
            <p>
              If you believe that your content was removed or disabled as a
              result of a mistake or misidentification, you may send a written
              counter-notification to our copyright agent containing:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-6">
              <li>
                Your physical or electronic signature.
              </li>
              <li>
                Identification of the material that has been removed or to which
                access has been disabled and the location at which the material
                appeared before it was removed or disabled.
              </li>
              <li>
                A statement, under penalty of perjury, that you have a good
                faith belief that the material was removed or disabled as a
                result of mistake or misidentification.
              </li>
              <li>
                Your name, address, telephone number, and a statement that you
                consent to the jurisdiction of the federal court in your
                district, and that you will accept service of process from the
                person who provided the original DMCA notification.
              </li>
            </ol>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              4. Repeat Infringers
            </h2>
            <p>
              In accordance with the DMCA, DocPrompt AI will terminate access
              for users or accounts that are determined to be repeat infringers.
              A repeat infringer is any user who has been the subject of three
              (3) or more valid DMCA takedown notices.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              5. Disclaimer
            </h2>
            <p>
              DocPrompt AI acts as a tool provider. Users are solely responsible
              for the content they upload, process, and share through our
              platform. We do not review user content prior to processing and
              are not liable for any copyright infringement committed by users.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#111]">
              6. Contact
            </h2>
            <p>
              For any questions regarding this DMCA policy, please contact us
              at{" "}
              <span className="text-[#165DFF]">dmca@docprompt.ai</span>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
