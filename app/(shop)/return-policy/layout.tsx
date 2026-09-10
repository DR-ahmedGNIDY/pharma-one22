import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";



export const metadata: Metadata = {
  title: "سياسة الإرجاع والاستبدال | فارما وان كوزماتيكس",
  description:
    "تعرفي على سياسة الإرجاع والاستبدال في فارما وان كوزماتيكس. نضمن لك حق الإرجاع خلال 14 يوماً من تاريخ الاستلام.",
  alternates: {
    canonical: `${siteUrl}/return-policy`,
  },
  openGraph: {
    title: "سياسة الإرجاع | فارما وان كوزماتيكس",
    description: "إرجاع مضمون خلال 14 يوماً — تسوقي بثقة.",
    url: `${siteUrl}/return-policy`,
    type: "website",
    images: defaultOgImages,
  },
};

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
