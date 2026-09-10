import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Truck, Shield, RotateCcw, Check } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import {
  getProduct,
  getRelatedProducts,
  refName,
  refSlug,
  refId,
} from "@/lib/products";

import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";
import { ProductTabs } from "./ProductTabs";

/**
 * Product detail page — a Server Component.
 *
 * The name, price, description, images, SKU, availability, breadcrumb and
 * related products are all rendered on the server so they exist in the initial
 * HTML. Only quantity/cart/wishlist/gallery/tab state lives on the client.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  // Real 404 status — previously a missing product rendered with HTTP 200,
  // which Google reports as a soft 404.
  if (!product) notFound();

  const brandName = refName(product.brand);
  const brandSlug = refSlug(product.brand);
  const categoryName = refName(product.category);
  const categorySlug = refSlug(product.category);
  const categoryId = refId(product.category);

  const related = categoryId
    ? await getRelatedProducts(categoryId, product._id)
    : [];

  const hasDiscount = (product.discountPercentage ?? 0) > 0;
  const inStock = product.stock > 0;
  const savings = product.discountPrice
    ? product.price - product.discountPrice
    : 0;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        {/* Breadcrumb — server-rendered, so it is a real crawlable link path */}
        <nav
          aria-label="مسار التنقل"
          className="flex items-center flex-wrap gap-2 text-sm text-gold-muted mb-8"
        >
          <Link href="/" className="hover:text-gold transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft size={14} aria-hidden />
          <Link href="/shop" className="hover:text-gold transition-colors">
            المتجر
          </Link>
          {categoryName && (
            <>
              <ChevronLeft size={14} aria-hidden />
              <Link
                href={
                  categorySlug ? `/shop?category=${categorySlug}` : "/shop"
                }
                className="hover:text-gold transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronLeft size={14} aria-hidden />
          <span className="text-cream">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <ProductGallery
            images={product.images || []}
            name={product.name}
            discountPercentage={product.discountPercentage}
            isNewArrival={product.isNewArrival}
            isBestSeller={product.isBestSeller}
          />

          <div className="space-y-6">
            {brandName && (
              <Link
                href={brandSlug ? `/brand/${brandSlug}` : "/brands"}
                className="inline-block text-gold text-sm font-medium hover:text-gold-light transition-colors"
              >
                {brandName}
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-cream leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline flex-wrap gap-4">
              {hasDiscount && product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-gold">
                    {formatPrice(product.discountPrice)}
                  </span>
                  <span className="text-xl text-gold-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                    وفري {formatPrice(savings)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.reviewCount ? (
              <p className="text-sm text-gold-muted">
                <span className="text-gold font-bold">
                  {Number(product.rating).toFixed(1)}
                </span>{" "}
                من 5 · {product.reviewCount} تقييم
              </p>
            ) : null}

            <p className="text-gold-muted leading-relaxed">
              {product.shortDescription ||
                (product.description || "").slice(0, 150)}
            </p>

            {/* SKU & stock — availability now reflects the real stock value */}
            <div className="flex items-center flex-wrap gap-6 text-sm">
              <span className="text-gold-muted">
                رقم المنتج: <span className="text-cream">{product.sku}</span>
              </span>
              {inStock ? (
                <span className="flex items-center gap-1 text-green-400">
                  <Check size={14} aria-hidden />
                  متوفر في المخزن ({product.stock} قطعة)
                </span>
              ) : (
                <span className="text-red-400">غير متوفر حالياً</span>
              )}
            </div>

            <ProductPurchase product={product} />

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold/10">
              <div className="text-center">
                <Truck className="mx-auto text-gold mb-2" size={24} aria-hidden />
                <p className="text-lg text-gold-muted">توصيل سريع</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto text-gold mb-2" size={24} aria-hidden />
                <p className="text-lg text-gold-muted">منتج أصلي 100%</p>
              </div>
              <div className="text-center">
                <RotateCcw
                  className="mx-auto text-gold mb-2"
                  size={24}
                  aria-hidden
                />
                <p className="text-lg text-gold-muted">استرجاع خلال 14 يوم</p>
              </div>
            </div>
          </div>
        </div>

        <ProductTabs
          description={product.description}
          specifications={product.specifications}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-cream mb-8">منتجات مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {related.map((item) => (
                <ProductCard key={item._id} product={item as any} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
