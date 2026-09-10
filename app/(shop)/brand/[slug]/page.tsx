import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

import { getBrandProducts, refName } from "@/lib/products";
import { getBrandBySlug } from "@/lib/categories";
import { BrandProductGrid } from "./BrandProductGrid";

/**
 * Brand page — a Server Component.
 *
 * The brand name, description, logo and full product grid are rendered on the
 * server; only the category filter chips are interactive.
 */
export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  const brand = await getBrandBySlug(decoded);
  if (!brand) notFound();

  const products = await getBrandProducts(decoded);

  const categories = Array.from(
    new Set(products.map((p) => refName(p.category)).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        <nav
          aria-label="مسار التنقل"
          className="flex items-center flex-wrap gap-2 text-sm text-gold-muted mb-8"
        >
          <Link href="/" className="hover:text-gold transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft size={14} aria-hidden />
          <Link href="/brands" className="hover:text-gold transition-colors">
            البراندات
          </Link>
          <ChevronLeft size={14} aria-hidden />
          <span className="text-cream">{brand.name}</span>
        </nav>

        <header className="luxury-card p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold/30 to-gold-dark/30 flex items-center justify-center shrink-0 overflow-hidden relative">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              ) : (
                <span className="text-gold font-bold text-3xl">
                  {brand.name[0]}
                </span>
              )}
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-bold gold-text mb-3">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="text-gold-muted max-w-2xl leading-relaxed">
                  {brand.description}
                </p>
              )}
              <p className="text-sm text-gold-muted mt-3">
                {products.length.toLocaleString("ar-EG")} منتج متاح
              </p>
            </div>
          </div>
        </header>

        <BrandProductGrid products={products as any[]} categories={categories} />
      </div>
    </div>
  );
}
