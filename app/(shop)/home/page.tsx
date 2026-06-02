"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { OffersSection } from "@/components/sections/OffersSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { Product } from "@/types";

// Demo products data - UNCHANGED
const bestSellers: Product[] = [
  {
    _id: "1",
    name: "HUDA BEAUTY The New Nude Eyeshadow Palette",
    slug: "huda-beauty-new-nude-eyeshadow",
    brand: { _id: "b1", name: "HUDA BEAUTY", slug: "huda-beauty", logo: "", categories: [], isActive: true, order: 1 },
    category: { _id: "c1", name: "المكياج", slug: "makeup", isActive: true, order: 1 },
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"],
    description: "باليت ظلال عيون نيود من هدى بيوتي",
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
    tags: ["مكياج", "ظلال عيون", "نيود"],
    specifications: [],
    createdAt: "2024-01-01",
  },
  {
    _id: "2",
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    slug: "the-ordinary-niacinamide",
    brand: { _id: "b2", name: "The Ordinary", slug: "the-ordinary", logo: "", categories: [], isActive: true, order: 2 },
    category: { _id: "c2", name: "العناية بالبشرة", slug: "skincare", isActive: true, order: 2 },
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80"],
    description: "سيروم نياسيناميد للعناية بالبشرة",
    price: 275,
    discountPrice: 220,
    discountPercentage: 20,
    stock: 100,
    sku: "TO-001",
    rating: 4.9,
    reviewCount: 3200,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ["عناية بالبشرة", "سيروم"],
    specifications: [],
    createdAt: "2024-01-01",
  },
  {
    _id: "3",
    name: "L'Oréal Paris Infallible 24H Fresh Wear Foundation",
    slug: "loreal-infallible-foundation",
    brand: { _id: "b3", name: "L'Oréal", slug: "loreal", logo: "", categories: [], isActive: true, order: 3 },
    category: { _id: "c1", name: "المكياج", slug: "makeup", isActive: true, order: 1 },
    images: ["https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&q=80"],
    description: "كريم أساس إنفاليبل 24 ساعة",
    price: 350,
    discountPrice: 280,
    discountPercentage: 20,
    stock: 75,
    sku: "LO-001",
    rating: 4.7,
    reviewCount: 850,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ["مكياج", "كريم أساس"],
    specifications: [],
    createdAt: "2024-01-01",
  },
  {
    _id: "4",
    name: "MAC Cosmetics Matte Lipstick - Ruby Woo",
    slug: "mac-matte-lipstick-ruby-woo",
    brand: { _id: "b4", name: "MAC", slug: "mac", logo: "", categories: [], isActive: true, order: 4 },
    category: { _id: "c1", name: "المكياج", slug: "makeup", isActive: true, order: 1 },
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80"],
    description: "أحمر شفاه ماتي ماك - روبي وو",
    price: 495,
    discountPrice: 396,
    discountPercentage: 20,
    stock: 60,
    sku: "MAC-001",
    rating: 4.9,
    reviewCount: 2100,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ["مكياج", "أحمر شفاه"],
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
    description: "سيروم النهار المتقدم من إستي لودر",
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
    _id: "6",
    name: "YSL Libre Eau de Parfum",
    slug: "ysl-libre-edp",
    brand: { _id: "b6", name: "YSL", slug: "ysl", logo: "", categories: [], isActive: true, order: 6 },
    category: { _id: "c3", name: "العطور", slug: "perfumes", isActive: true, order: 3 },
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"],
    description: "عطر ليبري من إيف سان لوران",
    price: 1795,
    discountPrice: 1436,
    discountPercentage: 20,
    stock: 30,
    sku: "YSL-001",
    rating: 4.8,
    reviewCount: 670,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    tags: ["عطور", "عطر نسائي"],
    specifications: [],
    createdAt: "2024-01-01",
  },
];



export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
const [products, setProducts] = useState<any[]>([]);

useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (data.success) {
      setProducts(data.products);
    }
  } catch (error) {
    console.error(error);
  }
};
  const filteredBestSellers = selectedBrand
  ? bestSellers.filter((product) => {
      const brandSlug =
        typeof product.brand === "string"
          ? product.brand
          : product.brand?.slug;

      return brandSlug?.toLowerCase() === selectedBrand.toLowerCase();
    })
  : bestSellers;
const latestProducts = [...products]
  .sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )
  .slice(0, 8);
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
  products={filteredBestSellers}
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
