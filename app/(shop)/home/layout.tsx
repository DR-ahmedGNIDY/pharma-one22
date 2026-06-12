import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

export const metadata: Metadata = {
  title: "فارما وان كوزماتيكس | Pharma One Cosmetics",
  description:
    "اكتشفي أكثر من 7000 منتج تجميل وعناية من أشهر البراندات العالمية بأسعار مميزة وتوصيل سريع لجميع أنحاء مصر.",
  alternates: {
    canonical: `${siteUrl}/home`,
  },
  openGraph: {
    title: "فارما وان كوزماتيكس | الصفحة الرئيسية",
    description:
      "أكثر من 7000 منتج تجميل من 100+ براند عالمي — مكياج، عناية بالبشرة، عطور وأكثر.",
    url: `${siteUrl}/home`,
    type: "website",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
