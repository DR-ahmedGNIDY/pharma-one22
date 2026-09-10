import { getShopProducts } from "@/lib/products";
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

/**
 * Shop listing — a Server Component wrapper.
 *
 * It resolves the first page of products on the server and hands them to the
 * client component as its starting data. That puts real product links, names
 * and prices into the initial HTML (previously the page shipped an empty shell
 * and then downloaded the entire catalogue in the browser).
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categorySlug = category ? catSlugMap[category] : undefined;

  const initialProducts = await getShopProducts(categorySlug);

  return <ShopClient initialProducts={initialProducts as any} />;
}
