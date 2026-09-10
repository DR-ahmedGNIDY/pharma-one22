import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";
import {
  getCategoryBySlug,
  getCategoryProducts,
  categoryMetaDescription,
  PRODUCTS_PER_PAGE,
} from "@/lib/categories";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const category = await getCategoryBySlug(decoded);

  if (!category) {
    return {
      title: "التصنيف غير موجود",
      description: "عذراً، هذا التصنيف غير متوفر.",
      robots: { index: false, follow: true },
    };
  }

  const { total } = await getCategoryProducts(category._id, 1);
  const title = `${category.name}`;
  const description = categoryMetaDescription(category, total);

  // The canonical always points at page 1 of the category. Paginated views set
  // their own canonical in the page component via the `page` search param.
  const canonicalUrl = `${siteUrl}/category/${encodeURIComponent(
    category.slug
  )}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${category.name} | فارما وان كوزماتيكس`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Pharma One Cosmetics",
      images: category.image
        ? [{ url: category.image, width: 1200, height: 630, alt: category.name }]
        : defaultOgImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | فارما وان كوزماتيكس`,
      description,
      images: category.image ? [category.image] : defaultTwitterImages,
    },
  };
}

export default async function CategoryLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const category = await getCategoryBySlug(decoded);

  let jsonLd: object | null = null;

  if (category) {
    const { products, total } = await getCategoryProducts(category._id, 1);
    const categoryUrl = `${siteUrl}/category/${encodeURIComponent(
      category.slug
    )}`;

    jsonLd = {
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
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
