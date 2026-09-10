import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";



export const metadata: Metadata = {
  // `absolute` opts out of the root template ("%s | فارما وان كوزماتيكس").
  // Without it the homepage title renders the brand name twice.
  title: {
    absolute: "فارما وان كوزماتيكس | متجر منتجات التجميل والعناية في مصر",
  },
  description:
    "اكتشفي أكثر من 7000 منتج تجميل وعناية من أشهر البراندات العالمية بأسعار مميزة وتوصيل سريع لجميع أنحاء مصر.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "فارما وان كوزماتيكس | الصفحة الرئيسية",
    description:
      "أكثر من 7000 منتج تجميل من 100+ براند عالمي — مكياج، عناية بالبشرة، عطور وأكثر.",
    url: siteUrl,
    type: "website",
    images: defaultOgImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "فارما وان كوزماتيكس | الصفحة الرئيسية",
    description:
      "أكثر من 7000 منتج تجميل من 100+ براند عالمي — مكياج، عناية بالبشرة، عطور وأكثر.",
    images: defaultTwitterImages,
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preload LCP hero image — Server Component link is hoisted to <head> by React/Next.js */}
      <link
        rel="preload"
        href="/images/banners/panar5.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      {children}
    </>
  );
}
