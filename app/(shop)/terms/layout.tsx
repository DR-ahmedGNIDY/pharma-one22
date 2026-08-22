import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

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
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
