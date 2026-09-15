import { HeroSection } from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import {
  getLatestProducts,
  getOfferProducts,
  getRandomProducts,
} from "@/lib/products";
import { getCategoryCountsByName } from "@/lib/categories";
import { HomeBrands } from "./HomeBrands";

// Rebuild hourly: the product rows stay current and the random selection
// rotates, without querying the database on every visit.
export const revalidate = 3600;

/**
 * Homepage — a Server Component.
 *
 * It used to be a client component that fetched /api/products with no limit —
 * the whole catalogue, about 2.8 MB of JSON — then shuffled and sorted it in
 * the browser to show sixteen cards. On a mid-range phone that blocked the main
 * thread for over three seconds. The sixteen products are now picked in the
 * database and rendered into the HTML.
 */
export default async function HomePage() {
  const [featuredProducts, latestProducts, offerProducts, categoryCounts] =
    await Promise.all([
      getRandomProducts(8),
      getLatestProducts(8),
      getOfferProducts(),
      getCategoryCountsByName(),
    ]);

  return (
    <>
      <HeroSection />
      <HomeBrands />
      <ProductsSection
        title="الأكثر مبيعاً"
        subtitle="اكتشفي المنتجات الأكثر شعبية بين عملائنا"
        products={featuredProducts as any}
        viewAllLink="/shop?best-sellers=true"
        badge="BEST SELLERS"
      />
      <CategoriesSection countByName={categoryCounts} />
      <OffersSection offerProducts={offerProducts as any} />
      <ProductsSection
        title="وصل حديثاً"
        subtitle="تعرفي على أحدث المنتجات في متجرنا"
        products={latestProducts as any}
        viewAllLink="/shop?new=true"
        badge="NEW ARRIVALS"
      />
      <ReviewsSection />
    </>
  );
}
