import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { siteUrl } from "@/lib/seo";
import {
  getCategoryBySlug,
  getCategoryProducts,
  getSubCategories,
  getAllCategories,
  getCategoryIntro,
  PRODUCTS_PER_PAGE,
} from "@/lib/categories";

// Category pages are prerendered at build. Rebuild them hourly so new, removed
// or deactivated products show up without waiting for a deploy.
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

/** Pre-render every category at build time; new ones render on demand. */
export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats.map((c) => ({ slug: encodeURIComponent(c.slug) }));
}

/**
 * Paginated views must not share page 1's canonical, or Google sees several
 * URLs claiming to be the same page. Each page canonicalises to itself.
 */
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || "1", 10) || 1);
  if (pageNum === 1) return {};

  const decoded = decodeURIComponent(slug);
  const category = await getCategoryBySlug(decoded);
  if (!category) return {};

  const base = `${siteUrl}/category/${encodeURIComponent(category.slug)}`;
  return {
    title: `${category.name} — صفحة ${pageNum}`,
    alternates: { canonical: `${base}?page=${pageNum}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const decoded = decodeURIComponent(slug);
  const category = await getCategoryBySlug(decoded);
  if (!category) notFound();

  const pageNum = Math.max(1, parseInt(page || "1", 10) || 1);
  const { products, total, totalPages } = await getCategoryProducts(
    category._id,
    pageNum
  );

  // Requesting a page beyond the end is a 404, not an empty grid — an empty
  // page returning 200 is exactly the soft 404 pattern Google reports.
  if (pageNum > totalPages && total > 0) notFound();

  const subCategories = await getSubCategories(category._id);
  const intro = getCategoryIntro(category);
  const basePath = `/category/${encodeURIComponent(category.slug)}`;

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
          <Link href="/shop" className="hover:text-gold transition-colors">
            المتجر
          </Link>
          <ChevronLeft size={14} aria-hidden />
          <span className="text-cream">{category.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            {category.name}
          </h1>
          <p className="text-gold-muted">
            {total.toLocaleString("ar-EG")} منتج متاح
            {totalPages > 1 && ` · صفحة ${pageNum} من ${totalPages}`}
          </p>
        </header>

        {subCategories.length > 0 && (
          <nav aria-label="التصنيفات الفرعية" className="mb-10">
            <ul className="flex flex-wrap gap-3">
              {subCategories.map((sub) => (
                <li key={sub._id}>
                  <Link
                    href={`/category/${encodeURIComponent(sub.slug)}`}
                    className="inline-block px-4 py-2 rounded-xl border border-gold/20 text-gold-muted hover:border-gold/40 hover:text-gold transition-colors text-sm"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product as any} />
            ))}
          </div>
        ) : (
          <p className="text-gold-muted py-16 text-center">
            لا توجد منتجات في هذا التصنيف حالياً.
          </p>
        )}

        {/* Real paginated links — crawlable, unlike a "load more" button */}
        {totalPages > 1 && (
          <nav
            aria-label="تصفح الصفحات"
            className="flex items-center justify-center gap-3 mt-12 flex-wrap"
          >
            {pageNum > 1 && (
              <Link
                href={pageNum === 2 ? basePath : `${basePath}?page=${pageNum - 1}`}
                rel="prev"
                className="px-4 py-2 rounded-xl border border-gold/20 text-gold hover:bg-gold/10 transition-colors text-sm"
              >
                السابق
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (n) =>
                  n === 1 ||
                  n === totalPages ||
                  Math.abs(n - pageNum) <= 2
              )
              .map((n, idx, arr) => (
                <span key={n} className="flex items-center gap-3">
                  {idx > 0 && arr[idx - 1] !== n - 1 && (
                    <span className="text-gold-muted">…</span>
                  )}
                  {n === pageNum ? (
                    <span
                      aria-current="page"
                      className="px-4 py-2 rounded-xl bg-gold text-black font-bold text-sm"
                    >
                      {n.toLocaleString("ar-EG")}
                    </span>
                  ) : (
                    <Link
                      href={n === 1 ? basePath : `${basePath}?page=${n}`}
                      className="px-4 py-2 rounded-xl border border-gold/20 text-gold-muted hover:text-gold hover:border-gold/40 transition-colors text-sm"
                    >
                      {n.toLocaleString("ar-EG")}
                    </Link>
                  )}
                </span>
              ))}

            {pageNum < totalPages && (
              <Link
                href={`${basePath}?page=${pageNum + 1}`}
                rel="next"
                className="px-4 py-2 rounded-xl border border-gold/20 text-gold hover:bg-gold/10 transition-colors text-sm"
              >
                التالي
              </Link>
            )}
          </nav>
        )}

        {/* Editorial content sits below the grid so it never pushes products
            down, but still gives the page real indexable copy. */}
        {intro && pageNum === 1 && (
          <section className="mt-20 max-w-3xl">
            <h2 className="text-2xl font-bold text-cream mb-6">
              {intro.heading}
            </h2>
            <div className="space-y-4">
              {intro.body.map((paragraph, i) => (
                <p key={i} className="text-gold-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
