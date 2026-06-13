"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlistStore } from "@/hooks/useStore";
import { Product } from "@/types";

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((state) => state.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          wishlistIds.map(async (id) => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.success ? data.product : null;
          })
        );
        setProducts(results.filter(Boolean) as Product[]);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
        <div className="text-gold-muted">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cream mb-4">المفضلة</h1>
            <p className="text-gold-muted">{products.length} منتج في المفضلة</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={80} className="mx-auto text-gold/20 mb-6" />
            <h2 className="text-2xl font-bold text-cream mb-4">المفضلة فارغة</h2>
            <p className="text-gold-muted mb-8 max-w-md mx-auto">
              أضفي منتجاتك المفضلة إلى قائمة المفضلة للوصول إليها بسهولة
            </p>
            <Link href="/shop" className="btn-gold inline-flex items-center gap-2">
              <span>استكشفي المنتجات</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
