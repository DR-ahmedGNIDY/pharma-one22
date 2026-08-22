import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | فارما وان كوزماتيكس",
  description: "سياسة الخصوصية وحماية البيانات في فارما وان كوزماتيكس.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: "سياسة الخصوصية | فارما وان كوزماتيكس",
    description: "سياسة الخصوصية وحماية البيانات في فارما وان كوزماتيكس.",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
