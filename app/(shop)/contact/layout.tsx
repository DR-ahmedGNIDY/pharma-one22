import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";



export const metadata: Metadata = {
  title: "تواصل معنا | فارما وان كوزماتيكس",
  description:
    "تواصلي مع فريق خدمة عملاء فارما وان كوزماتيكس عبر واتساب أو البريد الإلكتروني. نحن هنا لمساعدتك في كل ما تحتاجين.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "تواصل معنا | فارما وان كوزماتيكس",
    description: "فريق خدمة عملاء متخصص لمساعدتك على مدار اليوم.",
    url: `${siteUrl}/contact`,
    type: "website",
    images: defaultOgImages,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
