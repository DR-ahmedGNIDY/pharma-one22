import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "من نحن | فارما وان كوزماتيكس",
  description: "تعرفي على Pharma One Cosmetics ووجهتك الأولى لمنتجات التجميل العالمية.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "من نحن | فارما وان كوزماتيكس",
    description: "تعرفي على Pharma One Cosmetics ووجهتك الأولى لمنتجات التجميل العالمية.",
    url: `${siteUrl}/about`,
    type: "website",
    images: defaultOgImages,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
