import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";
import { getAllBrands } from "@/lib/brands";

/**
 * Title and description are built from the brands actually in the database.
 *
 * They used to be fixed text promising "more than 100 brands" and naming Dior,
 * Chanel, MAC and Huda Beauty — none of which the store carries — so the
 * search result for this page advertised products a visitor could not find.
 * The brands named now are the ones with the most live products.
 */
export async function generateMetadata(): Promise<Metadata> {
  const brands = await getAllBrands();
  const stocked = brands.filter((b) => b.productCount > 0);
  const count = brands.length;
  const topNames = stocked.slice(0, 5).map((b) => b.name.trim());

  const title = count
    ? `البراندات | ${count.toLocaleString("ar-EG")} براند أصلي`
    : "البراندات";

  const description = topNames.length
    ? `تصفحي ${count.toLocaleString("ar-EG")} براند أصلي في فارما وان كوزماتيكس — ${topNames.join("، ")} وغيرها. منتجات أصلية بأسعار مميزة وتوصيل لجميع أنحاء مصر.`
    : "تصفحي البراندات الأصلية في فارما وان كوزماتيكس — منتجات أصلية بأسعار مميزة وتوصيل لجميع أنحاء مصر.";

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/brands` },
    openGraph: {
      title: `${title} | فارما وان كوزماتيكس`,
      description,
      url: `${siteUrl}/brands`,
      type: "website",
      images: defaultOgImages,
    },
    twitter: {
      card: "summary",
      title: `${title} | فارما وان كوزماتيكس`,
      description,
      images: defaultTwitterImages,
    },
  };
}

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
