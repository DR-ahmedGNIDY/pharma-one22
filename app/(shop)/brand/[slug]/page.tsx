"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

export default function BrandDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBrandData = async () => {
      try {
        // Fetch brand info
        const brandRes = await fetch(`/api/brands?slug=${slug}`);
        const brandData = await brandRes.json();
        if (brandData.success && brandData.brands?.length > 0) {
          setBrand(brandData.brands[0]);
        }

        // Fetch products for this brand by slug
        const productsRes = await fetch(`/api/products?brandSlug=${slug}`);
        const productsData = await productsRes.json();
        if (productsData.success) {
          const prods: Product[] = productsData.products;
          setProducts(prods);

          // Extract unique category names
          const cats = Array.from(
            new Set(
              prods
                .map((p) =>
                  typeof p.category === "object" ? p.category.name : p.category
                )
                .filter(Boolean)
            )
          ) as string[];
          setCategories(cats);
        }
      } catch (err) {
        console.error("Brand page load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [slug]);

  const filteredProducts = activeCategory
    ? products.filter((p) =>
        typeof p.category === "object"
          ? p.category.name === activeCategory
          : p.category === activeCategory
      )
    : products;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        جاري التحميل...
      </div>
    );
  }

  const brandName = brand?.name || slug.toUpperCase();
  const brandDescription = brand?.description || "";

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gold-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft size={14} />
          <Link href="/brands" className="hover:text-gold transition-colors">
            البراندات
          </Link>
          <ChevronLeft size={14} />
          <span className="text-cream">{brandName}</span>
        </nav>

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold/30 to-gold-dark/30 flex items-center justify-center shrink-0 overflow-hidden">
              {brand?.logo ? (
                <img
                  src={brand.logo}
                  alt={brandName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gold font-bold text-3xl">
                  {brandName[0]}
                </span>
              )}
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-bold gold-text mb-3">
                {brandName}
              </h1>
              {brandDescription && (
                <p className="text-gold-muted max-w-2xl">{brandDescription}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gold-muted text-lg">
              لا توجد منتجات في هذا البراند حتى الآن
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
