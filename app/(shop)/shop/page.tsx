import type { Metadata } from "next";
import { getShopProducts, searchProducts } from "@/lib/products";
import { siteUrl } from "@/lib/seo";
import ShopClient from "./ShopClient";

// Category keys used in /shop?category=… mapped to real Category.slug values.
const catSlugMap: Record<string, string> = {
  makeup: "المكياج",
  skincare: "العناية-بالبشرة",
  perfumes: "العطور",
  haircare: "العناية-بالشعر",
  bodycare: "العناية-بالجسم",
  tools: "الأدوات-والإكسسوارات",
};

type SearchParams = Promise<{ category?: string; q?: string }>;

/**
 * Search result pages are kept out of the index: every query would otherwise
 * become its own thin, near-duplicate URL. Links on them are still followed.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  if (!query) return {};
  return {
    title: `نتائج البحث عن "${query}"`,
    robots: { index: false, follow: true },
  };
}

/**
 * Shop listing — a Server Component wrapper.
 *
 * It resolves products on the server and hands them to the client component as
 * its starting data, so real product links, names and prices are in the initial
 * HTML. `?q=` runs a search, which is the target the site's SearchAction
 * structured data declares.
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, q } = await searchParams;
  const query = q?.trim() ?? "";
  const categorySlug = category ? catSlugMap[category] : undefined;

  const initialProducts = query
    ? await searchProducts(query)
    : await getShopProducts(categorySlug);

  // ItemList only for the plain listing — search results are noindex anyway.
  const jsonLd =
    !query && !categorySlug && initialProducts.length
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${siteUrl}/shop#itemlist`,
          name: "جميع المنتجات",
          itemListElement: initialProducts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${siteUrl}/product/${p._id}`,
            name: p.name,
          })),
        }
      : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Keyed so a new search remounts the client and drops the old results. */}
      <ShopClient
        key={query || categorySlug || "all"}
        initialProducts={initialProducts as any}
        searchQuery={query}
      />
    </>
  );
}
