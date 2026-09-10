import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";

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
    images: defaultOgImages,
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
