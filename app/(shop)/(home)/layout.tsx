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
  // No manual hero preload here. It pointed at the original
  // /images/banners/panar5.webp (66 KB), while <Image priority> in HeroSection
  // renders — and already preloads — the resized /_next/image variant (~18 KB
  // on a phone). Phones downloaded both, and the original was never displayed.
  return <>{children}</>;
}
