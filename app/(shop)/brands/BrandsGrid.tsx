"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import type { BrandListItem } from "@/lib/brands";

/**
 * Search box and grid for the brands page.
 *
 * The brands arrive already rendered from the server, so every brand link is
 * in the initial HTML and crawlable; this component only filters what is
 * already there.
 */
export function BrandsGrid({ brands }: { brands: BrandListItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filteredBrands = query
    ? brands.filter((brand) => brand.name.toLowerCase().includes(query))
    : brands;

  return (
    <>
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
            size={20}
          />
          <input
            type="text"
            placeholder="ابحثي عن براند..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black-light border border-gold/20 rounded-full py-4 pr-12 pl-6 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 focus:shadow-gold-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBrands.map((brand, index) => (
          <Link key={brand.slug} href={`/brand/${encodeURIComponent(brand.slug)}`}>
            <div className="luxury-card p-6 group hover:border-gold/40 transition-all h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center shrink-0 overflow-hidden">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="64px"
                      priority={index < 8}
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="text-gold font-bold text-xl">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-cream group-hover:text-gold transition-colors truncate">
                    {brand.name}
                  </h2>
                  <p className="text-sm text-gold-muted">
                    {brand.productCount.toLocaleString("ar-EG")} منتج
                  </p>
                </div>
              </div>

              {brand.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {brand.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 text-gold text-sm group-hover:gap-2 transition-all">
                <span>تصفحي المنتجات</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gold-muted text-lg">لا توجد براندات مطابقة للبحث</p>
        </div>
      )}
    </>
  );
}
