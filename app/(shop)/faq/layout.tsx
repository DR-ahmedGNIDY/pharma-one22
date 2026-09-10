import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";



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
    images: defaultOgImages,
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
