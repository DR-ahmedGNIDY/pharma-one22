"use client";

import { useState, useEffect, useMemo } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { Product } from "@/types";

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch(console.error);
  }, []);

  // Stabilized with useMemo — prevents random re-sort on every render (fixes CLS)
  const randomProducts = useMemo(
    () => [...products].sort(() => Math.random() - 0.5).slice(0, 8),
    [products]
  );

  const latestProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      selectedBrand
        ? randomProducts.filter((product: any) => {
            const brandSlug =
              typeof product.brand === "string"
                ? product.brand
                : product.brand?.slug;
            return brandSlug?.toLowerCase() === selectedBrand.toLowerCase();
          })
        : randomProducts,
    [randomProducts, selectedBrand]
  );

  return (
    <>
      <HeroSection />
      <BrandsSection
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />
      <ProductsSection
        title="الأكثر مبيعاً"
        subtitle="اكتشفي المنتجات الأكثر شعبية بين عملائنا"
        products={filteredProducts}
        viewAllLink="/shop?best-sellers=true"
        badge="BEST SELLERS"
      />
      <CategoriesSection />
      <OffersSection />
      <ProductsSection
        title="وصل حديثاً"
        subtitle="تعرفي على أحدث المنتجات في متجرنا"
        products={latestProducts}
        viewAllLink="/shop?new=true"
        badge="NEW ARRIVALS"
      />
      <ReviewsSection />
    </>
  );
}
