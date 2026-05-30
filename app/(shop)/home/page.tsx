"use client";

import { useState } from "react";
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

const newArrivals: Product[] = [
  {
    _id: "7",
    name: "Dior Addict Lip Glow",
    slug: "dior-addict-lip-glow",
    brand: { _id: "b7", name: "DIOR", slug: "dior", logo: "", categories: [], isActive: true, order: 7 },
    category: { _id: "c1", name: "المكياج", slug: "makeup", isActive: true, order: 1 },
    images: ["https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400&q=80"],
    description: "ملمع شفاه ديور أديكت",
    price: 850,
    stock: 25,
    sku: "DIOR-001",
    rating: 4.9,
    reviewCount: 450,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ["مكياج", "ملمع شفاه"],
    specifications: [],
    createdAt: "2024-12-01",
  },
  {
    _id: "8",
    name: "CeraVe Hydrating Cleanser",
    slug: "cerave-hydrating-cleanser",
    brand: { _id: "b8", name: "CeraVe", slug: "cerave", logo: "", categories: [], isActive: true, order: 8 },
    category: { _id: "c2", name: "العناية بالبشرة", slug: "skincare", isActive: true, order: 2 },
    images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80"],
    description: "غسول مرطب سيرافي",
    price: 320,
    stock: 80,
    sku: "CV-001",
    rating: 4.7,
    reviewCount: 1800,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ["عناية بالبشرة", "غسول"],
    specifications: [],
    createdAt: "2024-12-01",
  },
  {
    _id: "9",
    name: "Chanel Coco Mademoiselle EDP",
    slug: "chanel-coco-mademoiselle",
    brand: { _id: "b9", name: "CHANEL", slug: "chanel", logo: "", categories: [], isActive: true, order: 9 },
    category: { _id: "c3", name: "العطور", slug: "perfumes", isActive: true, order: 3 },
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80"],
    description: "عطر كوكو مادموزيل من شانيل",
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
  {
    _id: "10",
    name: "Maybelline Lash Sensational Mascara",
    slug: "maybelline-lash-sensational",
    brand: { _id: "b10", name: "MAYBELLINE", slug: "maybelline", logo: "", categories: [], isActive: true, order: 10 },
    category: { _id: "c1", name: "المكياج", slug: "makeup", isActive: true, order: 1 },
    images: ["https://images.unsplash.com/photo-1631214524115-6f8eb1beb6f8?w=400&q=80"],
    description: "ماسكارا لاش سينسيشنال من ميبيلين",
    price: 195,
    stock: 100,
    sku: "MB-001",
    rating: 4.6,
    reviewCount: 1500,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ["مكياج", "ماسكارا"],
    specifications: [],
    createdAt: "2024-12-01",
  },
  {
    _id: "11",
    name: "Kérastase Elixir Ultime Hair Oil",
    slug: "kerastase-elixir-ultime",
    brand: { _id: "b11", name: "Kérastase", slug: "kerastase", logo: "", categories: [], isActive: true, order: 11 },
    category: { _id: "c4", name: "العناية بالشعر", slug: "haircare", isActive: true, order: 4 },
    images: ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=80"],
    description: "زيت إليكسير ألتيم للشعر من كيراستاز",
    price: 750,
    stock: 35,
    sku: "KR-001",
    rating: 4.8,
    reviewCount: 600,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ["عناية بالشعر", "زيت"],
    specifications: [],
    createdAt: "2024-12-01",
  },
  {
    _id: "12",
    name: "Nuxe Huile Prodigieuse Multi-Purpose Dry Oil",
    slug: "nuxe-huile-prodigieuse",
    brand: { _id: "b12", name: "Nuxe", slug: "nuxe", logo: "", categories: [], isActive: true, order: 12 },
    category: { _id: "c5", name: "العناية بالجسم", slug: "bodycare", isActive: true, order: 5 },
    images: ["https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&q=80"],
    description: "زيت نوكس الجاف متعدد الاستخدامات",
    price: 450,
    stock: 45,
    sku: "NX-001",
    rating: 4.7,
    reviewCount: 800,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ["عناية بالجسم", "زيت"],
    specifications: [],
    createdAt: "2024-12-01",
  },
];


export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const filteredBestSellers = selectedBrand
  ? bestSellers.filter((product) => {
      const brandSlug =
        typeof product.brand === "string"
          ? product.brand
          : product.brand?.slug;

      return brandSlug?.toLowerCase() === selectedBrand.toLowerCase();
    })
  : bestSellers;

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
        products={newArrivals}
        viewAllLink="/shop?new=true"
        badge="NEW ARRIVALS"
      />
      <ReviewsSection />
    </>
  );
}
