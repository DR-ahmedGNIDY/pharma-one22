"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";

interface Props {
  products: any[];
  categories: string[];
}

/**
 * Category filter over a brand's products.
 *
 * The products arrive as a prop already rendered by the server component, so
 * the unfiltered grid — and every product link in it — is in the initial HTML.
 * This component only narrows what is already there.
 */
export function BrandProductGrid({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((p) =>
        typeof p.category === "object"
          ? p.category?.name === activeCategory
          : p.category === activeCategory
      )
    : products;

  return (
    <>
      {categories.length > 1 && (
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === null
                ? "bg-gold text-black"
                : "bg-black-light border border-gold/20 text-gold-muted hover:text-gold"
            }`}
          >
            كل المنتجات
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-gold text-black"
                  : "bg-black-light border border-gold/20 text-gold-muted hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gold-muted text-lg">
            لا توجد منتجات في هذا التصنيف
          </p>
        </div>
      )}
    </>
  );
}
