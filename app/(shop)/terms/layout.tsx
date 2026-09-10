import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";

export const metadata: Metadata = {
  title: "الشروط والأحكام | فارما وان كوزماتيكس",
  description: "الشروط والأحكام الخاصة باستخدام موقع فارما وان كوزماتيكس.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: "الشروط والأحكام | فارما وان كوزماتيكس",
    description: "الشروط والأحكام الخاصة باستخدام موقع فارما وان كوزماتيكس.",
    url: `${siteUrl}/terms`,
    type: "website",
    images: defaultOgImages,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
