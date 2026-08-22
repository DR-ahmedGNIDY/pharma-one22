import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

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
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
