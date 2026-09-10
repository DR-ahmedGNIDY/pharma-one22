import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";



export const metadata: Metadata = {
  title: "تسوقي الآن | جميع المنتجات",
  description:
    "تصفحي أكثر من 7000 منتج تجميل وعناية. فلتري حسب البراند أو الفئة أو السعر وجدي المنتج المثالي لكِ.",
  alternates: {
    canonical: `${siteUrl}/shop`,
  },
  openGraph: {
    title: "المتجر | فارما وان كوزماتيكس",
    description:
      "أكثر من 7000 منتج تجميل — مكياج، عناية بالبشرة، عطور، عناية بالشعر.",
    url: `${siteUrl}/shop`,
    type: "website",
    images: defaultOgImages,
  },
  twitter: {
    card: "summary",
    title: "المتجر | فارما وان كوزماتيكس",
    description: "أكثر من 7000 منتج تجميل من 100+ براند عالمي.",
    images: defaultTwitterImages,
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
