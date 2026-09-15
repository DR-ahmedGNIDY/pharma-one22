import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ProductCard } from "@/components/product/ProductCard";
import { siteUrl } from "@/lib/seo";
import {
  getCategoryBySlug,
  getCategoryProducts,
  getSubCategories,
  getCategoryIntro,
  categoryMetaDescription,
  PRODUCTS_PER_PAGE,
} from "@/lib/categories";

/**
 * Renders one page of a category listing.
 *
 * Shared by /category/[slug] (page 1) and /category/[slug]/page/[n]. Page
 * numbers live in the path rather than a `?page=` search param: reading a
 * search param opts a route out of Next's full route cache, which meant every
 * category request — including page 1, the page that matters — was rendered
 * from scratch and spent about a second on the server before anything painted.
 */
export async function CategoryView({
  slug,
  pageNum,
}: {
  slug: string;
  pageNum: number;
}) {
  const decoded = decodeURIComponent(slug);
  const category = await getCategoryBySlug(decoded);
  if (!category) notFound();

  const { products, total, totalPages } = await getCategoryProducts(
    category._id,
    pageNum
  );

  // A page past the end is a 404, not an empty grid — an empty page returning
  // 200 is exactly the soft 404 pattern Google reports.
  if (pageNum > totalPages && total > 0) notFound();

  const subCategories = await getSubCategories(category._id);
  const intro = getCategoryIntro(category);
  const basePath = `/category/${encodeURIComponent(category.slug)}`;
  const pageHref = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);

  // Structured data describes page 1 only; it used to sit in the layout, where
  // it was emitted on every paginated page while listing page 1's products.
  const categoryUrl = `${siteUrl}${basePath}`;
  const jsonLd =
    pageNum === 1
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${categoryUrl}#collection`,
              url: categoryUrl,
              name: category.name,
              description: categoryMetaDescription(category, total),
              isPartOf: { "@id": `${siteUrl}/#website` },
              inLanguage: "ar-EG",
            },
            {
              "@type": "ItemList",
              "@id": `${categoryUrl}#itemlist`,
              name: category.name,
              numberOfItems: total,
              itemListElement: products
                .slice(0, PRODUCTS_PER_PAGE)
                .map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${siteUrl}/product/${p._id}`,
                  name: p.name,
                })),
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${categoryUrl}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "الرئيسية",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "المتجر",
                  item: `${siteUrl}/shop`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: categoryUrl,
                },
              ],
            },
          ],
        }
      : null;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

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
          {pageNum === 1 ? (
            <span className="text-cream">{category.name}</span>
          ) : (
            <>
              <Link href={basePath} className="hover:text-gold transition-colors">
                {category.name}
              </Link>
              <ChevronLeft size={14} aria-hidden />
              <span className="text-cream">صفحة {pageNum}</span>
            </>
          )}
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
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product as any}
                priority={index < 4}
              />
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
                href={pageHref(pageNum - 1)}
                rel="prev"
                className="px-4 py-2 rounded-xl border border-gold/20 text-gold hover:bg-gold/10 transition-colors text-sm"
              >
                السابق
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (n) => n === 1 || n === totalPages || Math.abs(n - pageNum) <= 2
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
                      href={pageHref(n)}
                      className="px-4 py-2 rounded-xl border border-gold/20 text-gold-muted hover:text-gold hover:border-gold/40 transition-colors text-sm"
                    >
                      {n.toLocaleString("ar-EG")}
                    </Link>
                  )}
                </span>
              ))}

            {pageNum < totalPages && (
              <Link
                href={pageHref(pageNum + 1)}
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
