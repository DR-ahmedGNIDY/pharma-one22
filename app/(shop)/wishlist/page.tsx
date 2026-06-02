"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

const wishlistProducts: Product[] = [
  {
    _id: "1",
    name: "HUDA BEAUTY The New Nude Eyeshadow Palette",
    slug: "huda-beauty-new-nude-eyeshadow",
    brand: { _id: "b1", name: "HUDA BEAUTY", slug: "huda-beauty", logo: "", categories: [], isActive: true, order: 1 },
    category: { _id: "c1", name: "المكياج", slug: "makeup", isActive: true, order: 1 },
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"],
    description: "باليت ظلال عيون نيود",
    price: 1850,
    discountPrice: 1480,
    discountPercentage: 20,
    stock: 50,
    sku: "HB-001",
    rating: 4.8,
    reviewCount: 1250,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ["مكياج", "ظلال عيون"],
    specifications: [],
    createdAt: "2024-01-01",
  },
  {
    _id: "5",
    name: "Estée Lauder Advanced Night Repair Serum",
    slug: "estee-lauder-night-repair",
    brand: { _id: "b5", name: "Estée Lauder", slug: "estee-lauder", logo: "", categories: [], isActive: true, order: 5 },
    category: { _id: "c2", name: "العناية بالبشرة", slug: "skincare", isActive: true, order: 2 },
    images: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80"],
    description: "سيروم النهار المتقدم",
    price: 1395,
    discountPrice: 1116,
    discountPercentage: 20,
    stock: 40,
    sku: "EL-001",
    rating: 4.8,
    reviewCount: 1100,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ["عناية بالبشرة", "سيروم"],
    specifications: [],
    createdAt: "2024-01-01",
  },
  {
    _id: "9",
    name: "Chanel Coco Mademoiselle EDP",
    slug: "chanel-coco-mademoiselle",
    brand: { _id: "b9", name: "CHANEL", slug: "chanel", logo: "", categories: [], isActive: true, order: 9 },
    category: { _id: "c3", name: "العطور", slug: "perfumes", isActive: true, order: 3 },
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80"],
    description: "عطر كوكو مادموزيل",
    price: 2495,
    stock: 20,
    sku: "CH-001",
    rating: 4.9,
    reviewCount: 920,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ["عطور", "عطر نسائي"],
    specifications: [],
    createdAt: "2024-12-01",
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cream mb-4">المفضلة</h1>
            <p className="text-gold-muted">{wishlistProducts.length} منتج في المفضلة</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
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
            {wishlistProducts.map((product, index) => (
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
