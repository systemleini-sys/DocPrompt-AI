import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

const TITLES: Record<string, string> = {
  terms: "服务条款",
  privacy: "隐私政策",
  cookies: "Cookie政策",
  dmca: "DMCA",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = TITLES[params.slug] ?? "法律条款";
  return {
    title,
    description: `DocPrompt AI ${title}`,
  };
}

export default function LegalPage({ params }: Props) {
  const title = TITLES[params.slug] ?? "法律条款";

  return (
    <main className="min-h-screen container-mobile py-module-lg">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-h1-mobile md:text-h1 text-text-main mb-8">{title}</h1>
        <div className="prose max-w-none">
          <p className="text-body text-text-light">法律条款内容将在此处显示。</p>
        </div>
      </div>
    </main>
  );
}
