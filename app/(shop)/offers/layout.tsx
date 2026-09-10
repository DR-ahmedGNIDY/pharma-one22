import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";



export const metadata: Metadata = {
  title: "عروض حصرية وخصومات | تخفيضات تصل إلى 50%",
  description:
    "لا تفوتي أفضل العروض والخصومات على منتجات التجميل العالمية. تخفيضات تصل إلى 50% على المكياج، العناية بالبشرة، العطور وأكثر.",
  alternates: {
    canonical: `${siteUrl}/offers`,
  },
  openGraph: {
    title: "عروض حصرية | فارما وان كوزماتيكس",
    description:
      "خصومات تصل إلى 50% على منتجات التجميل العالمية. عروض محدودة — اطلبي الآن!",
    url: `${siteUrl}/offers`,
    type: "website",
    images: defaultOgImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "عروض حصرية | فارما وان كوزماتيكس",
    description: "خصومات تصل إلى 50% على منتجات التجميل العالمية.",
    images: defaultTwitterImages,
  },
};

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
