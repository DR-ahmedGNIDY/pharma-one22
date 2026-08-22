"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Phone,
  Check,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
import { formatPrice, createWhatsAppLink } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/hooks/useStore";
import toast from "react-hot-toast";

// Demo product data



export default function ProductDetailPage() {
const params = useParams();

const [product, setProduct] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [similarProducts, setSimilarProducts] = useState<any[]>([]);
const [selectedImage, setSelectedImage] = useState(0);
const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
const isInWishlist = useWishlistStore(
  (state) => state.isInWishlist
)(product?._id);
  const id = params.id as string;

const loadSimilarProducts = async (categoryId: string) => {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (data.success) {
      const filtered = data.products
        .filter(
          (p: any) =>
            p._id !== product?._id &&
            (
              typeof p.category === "object"
                ? p.category?._id === categoryId
                : p.category === categoryId
            )
        )
        .slice(0, 4);

      setSimilarProducts(filtered);
    }
  } catch (error) {
    console.error(error);
  }
};

const loadProduct = async () => {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();

    if (data.success) {
      setProduct(data.product);

      if (data.product?.category?._id) {
        loadSimilarProducts(data.product.category._id);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (id) {
    loadProduct();
  }
}, [id]);
  const [isZoomed, setIsZoomed] = useState(false);


if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      جاري تحميل المنتج...
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      المنتج غير موجود
    </div>
  );
}



  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const brandName = typeof product.brand === "string" ? product.brand : product.brand?.name ?? "";

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`تمت إضافة ${quantity} قطعة إلى السلة!`);
  };

  const handleWhatsAppOrder = () => {
    const message = `مرحبًا، أريد طلب المنتج التالي:
${product.name}
الكمية: ${quantity}
السعر: ${formatPrice((product.discountPrice || product.price) * quantity)}`;
    window.open(createWhatsAppLink("+201022262971", message), "_blank");
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gold-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
          <ChevronLeft size={14} />
          <Link href="/shop" className="hover:text-gold transition-colors">المتجر</Link>
          <ChevronLeft size={14} />
          <span className="text-cream">{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-black-light cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={product.images?.[selectedImage] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    خصم {product.discountPercentage}%
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    جديد
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-gold text-black text-sm font-bold px-3 py-1.5 rounded-full">
                    الأكثر مبيعاً
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === index
                      ? "border-gold shadow-gold-sm"
                      : "border-transparent hover:border-gold/30"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <Link
              href={`/brand/${typeof product.brand === "string" ? "" : product.brand?.slug ?? ""}`}
              className="inline-block text-gold text-sm font-medium hover:text-gold-light transition-colors"
            >
              {brandName}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-cream leading-tight">
              {product.name}
            </h1>

            {/* Reviews */}
            <div className="flex items-center gap-3">
              <span className="text-gold-muted">
                ({product.reviewCount.toLocaleString("ar-EG")} تقييم)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-gold">
                    {formatPrice(product.discountPrice!)}
                  </span>
                  <span className="text-xl text-gold-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                    وفري {formatPrice(product.price - (product.discountPrice || 0))}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gold-muted leading-relaxed">
              {product.shortDescription || product.description.substring(0, 150)}
            </p>

            {/* SKU & Stock */}
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gold-muted">
                رقم المنتج: <span className="text-cream">{product.sku}</span>
              </span>
              <span className="flex items-center gap-1 text-green-400">
                <Check size={14} />
                متوفر في المخزن ({product.stock} قطعة)
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-gold-light font-medium">الكمية:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold text-cream w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold py-4 flex items-center justify-center gap-3 text-base"
              >
                <ShoppingCart size={20} />
                <span>أضف إلى السلة</span>
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 py-4 px-6 rounded-full bg-green-600 text-white font-bold flex items-center justify-center gap-3 hover:bg-green-500 transition-all"
              >
                <Phone size={20} />
                <span>اطلبي عبر واتساب</span>
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  toggleWishlist(product._id);
                  toast.success(isInWishlist ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة!");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  isInWishlist
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-gold/20 text-gold-muted hover:border-gold/40 hover:text-gold"
                }`}
              >
                <Heart size={18} className={isInWishlist ? "fill-red-400" : ""} />
                <span className="text-sm">
                  {isInWishlist ? "في المفضلة" : "أضف إلى المفضلة"}
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/20 text-gold-muted hover:border-gold/40 hover:text-gold transition-all">
                <Share2 size={18} />
                <span className="text-sm">مشاركة</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold/10">
              <div className="text-center">
                <Truck className="mx-auto text-gold mb-2" size={24} />
                <p className="text-lg text-gold-muted">توصيل سريع</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto text-gold mb-2" size={24} />
                <p className="text-lg text-gold-muted">100%</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto text-gold mb-2" size={24} />
                <p className="text-lg text-gold-muted">استرجاع خلال 14 يوم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-1 bg-black-light rounded-xl p-1 mb-8 w-fit">
            {[
              { id: "description", label: "الوصف" },
              { id: "specs", label: "المواصفات" },
              { id: "reviews", label: "التقييمات" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gold text-black"
                    : "text-gold-muted hover:text-gold"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="luxury-card p-8"
            >
              {activeTab === "description" && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-cream/90 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {product.specifications?.map(
  (spec: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-black rounded-xl"
                    >
                      <span className="text-gold-muted">{spec.key}</span>
                      <span className="text-cream font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-12">
                  <p className="text-gold-muted mb-4">التقييمات قريباً</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Similar Products */}
        <div>
          <h2 className="text-2xl font-bold text-cream mb-8">منتجات مشابهة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
