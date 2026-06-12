import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | فارما وان كوزماتيكس",
  description:
    "إجابات على أكثر الأسئلة شيوعاً حول الطلبات، الشحن، الإرجاع، وضمان أصالة المنتجات في فارما وان كوزماتيكس.",
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: "الأسئلة الشائعة | فارما وان كوزماتيكس",
    description: "كل ما تحتاج معرفته عن الطلبات والشحن والإرجاع.",
    url: `${siteUrl}/faq`,
    type: "website",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
