import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

export const metadata: Metadata = {
  title: "البراندات العالمية | أكثر من 100 براند أصيل",
  description:
    "تصفحي أكثر من 100 براند عالمي أصيل — ديور، شانيل، MAC، لوريال، هدى بيوتي، The Ordinary، CeraVe وغيرها. جميع المنتجات مضمونة الأصالة.",
  alternates: {
    canonical: `${siteUrl}/brands`,
  },
  openGraph: {
    title: "البراندات العالمية | فارما وان كوزماتيكس",
    description:
      "أكثر من 100 براند عالمي أصيل في مكان واحد — تسوقي براندك المفضل الآن.",
    url: `${siteUrl}/brands`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "البراندات العالمية | فارما وان كوزماتيكس",
    description: "أكثر من 100 براند عالمي أصيل.",
  },
};

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
