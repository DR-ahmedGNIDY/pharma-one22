import { cache } from "react";
import type { Metadata } from "next";
import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

/* ── Single DB fetch per request (deduped by React cache) ─────────────── */
const getProduct = cache(async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  try {
    await dbConnect();
    const product = await Product.findById(id)
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .lean();
    return product as any;
  } catch {
    return null;
  }
});

/* ── Dynamic metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "المنتج غير موجود",
      description: "عذراً، هذا المنتج غير متوفر.",
      robots: { index: false, follow: false },
    };
  }

  const brandName =
    typeof product.brand === "object" ? product.brand?.name : product.brand;
  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  const title = `${product.name}${brandName ? ` - ${brandName}` : ""}`;
  const description = (
    product.shortDescription ||
    product.description ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  const canonicalUrl = `${siteUrl}/product/${id}`;
  const images = (product.images as string[]) || [];
  const ogImage = images[0] || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: [
      product.name,
      brandName,
      categoryName,
      "شراء اون لاين",
      "فارما وان",
      ...(product.tags || []),
    ].filter(Boolean),

    alternates: { canonical: canonicalUrl },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Pharma One Cosmetics",
      images: images.slice(0, 4).map((url: string) => ({
        url,
        width: 800,
        height: 800,
        alt: product.name,
      })),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ── Layout: injects Product JSON-LD structured data ──────────────────── */
export default async function ProductPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  let jsonLd: object | null = null;

  if (product) {
    const brandName =
      typeof product.brand === "object" ? product.brand?.name : product.brand;
    const images = (product.images as string[]) || [];
    const price = product.discountPrice || product.price;
    const availability =
      product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${siteUrl}/product/${id}`,
      name: product.name,
      description: product.description || product.shortDescription || "",
      sku: product.sku,
      image: images,
      url: `${siteUrl}/product/${id}`,

      brand: brandName
        ? { "@type": "Brand", name: brandName }
        : undefined,

      offers: {
        "@type": "Offer",
        url: `${siteUrl}/product/${id}`,
        priceCurrency: "EGP",
        price: String(price),
        availability,
        seller: {
          "@type": "Organization",
          name: "Pharma One Cosmetics",
        },
      },

      ...(product.rating > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(product.rating),
          reviewCount: String(product.reviewCount || 1),
          bestRating: "5",
          worstRating: "1",
        },
      }),
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
