import type { Metadata } from "next";
import { siteUrl, defaultTwitterImages } from "@/lib/seo";
import { getBrandBySlug } from "@/lib/categories";
import { getBrandProducts, truncateForMeta } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const brand = await getBrandBySlug(decoded);

  if (!brand) {
    return {
      title: "البراند غير موجود",
      robots: { index: false, follow: true },
    };
  }

  const categoryNames: string[] = (brand.categories || []).map((c: any) =>
    typeof c === "object" ? c.name : c
  );

  const title = `${brand.name} | منتجات أصيلة`;
  const description = brand.description
    ? truncateForMeta(brand.description)
    : `تصفحي جميع منتجات ${brand.name} الأصيلة${
        categoryNames.length ? ` — ${categoryNames.join("، ")}` : ""
      }. متوفرة بأسعار مميزة وتوصيل سريع لجميع أنحاء مصر.`;

  const canonicalUrl = `${siteUrl}/brand/${encodeURIComponent(decoded)}`;

  return {
    title,
    description,
    keywords: [brand.name, ...categoryNames, "فارما وان", "شراء اون لاين"],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Pharma One Cosmetics",
      images: brand.logo
        ? [{ url: brand.logo, width: 400, height: 400, alt: brand.name }]
        : [
            {
              url: "/og-image.jpg",
              width: 1200,
              height: 630,
              alt: brand.name,
            },
          ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: brand.logo ? [brand.logo] : defaultTwitterImages,
    },
  };
}

export default async function BrandSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const brand = await getBrandBySlug(decoded);

  let jsonLd: object | null = null;

  if (brand) {
    const products = await getBrandProducts(decoded);
    const brandUrl = `${siteUrl}/brand/${encodeURIComponent(decoded)}`;

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Brand",
          "@id": `${brandUrl}#brand`,
          name: brand.name,
          url: brandUrl,
          ...(brand.logo ? { logo: brand.logo } : {}),
          ...(brand.description ? { description: brand.description } : {}),
        },
        {
          "@type": "ItemList",
          "@id": `${brandUrl}#itemlist`,
          name: brand.name,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 30).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${siteUrl}/product/${p._id}`,
            name: p.name,
          })),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${brandUrl}#breadcrumb`,
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
              name: "البراندات",
              item: `${siteUrl}/brands`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: brand.name,
              item: brandUrl,
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
