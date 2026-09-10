import type { Metadata } from "next";
import { siteUrl, defaultOgImages } from "@/lib/seo";
import {
  getProduct,
  cleanSku,
  skuAsGtin,
  refName,
  refSlug,
  truncateForMeta,
} from "@/lib/products";

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
      robots: { index: false, follow: true },
    };
  }

  const brandName = refName(product.brand);
  const categoryName = refName(product.category);

  const title = `${product.name}${brandName ? ` - ${brandName}` : ""}`;

  // Fall back to a composed description when the product has no copy of its
  // own, so no product page ships an empty meta description.
  const rawDescription =
    product.shortDescription ||
    product.description ||
    [product.name, brandName, categoryName].filter(Boolean).join(" - ");

  const description = truncateForMeta(rawDescription);

  const canonicalUrl = `${siteUrl}/product/${id}`;
  const images = product.images || [];

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
    ].filter(Boolean) as string[],

    alternates: { canonical: canonicalUrl },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Pharma One Cosmetics",
      images: images.length
        ? images.slice(0, 4).map((url: string) => ({
            url,
            width: 800,
            height: 800,
            alt: product.name,
          }))
        : defaultOgImages,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length ? [images[0]] : ["/og-image.jpg"],
    },
  };
}

/* ── Layout: injects Product + Breadcrumb JSON-LD ─────────────────────── */
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
    const brandName = refName(product.brand);
    const categoryName = refName(product.category);
    const categorySlug = refSlug(product.category);
    const images = product.images || [];
    const price = product.discountPrice || product.price;
    const productUrl = `${siteUrl}/product/${id}`;

    /* Offer ------------------------------------------------------------- */
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EGP",
      price: String(price),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      // Google warns when an offer has no price validity window. One year out
      // is a reasonable default for a catalogue without scheduled promotions.
      priceValidUntil: new Date(Date.now() + 365 * 864e5)
        .toISOString()
        .split("T")[0],
      seller: { "@id": `${siteUrl}/#organization` },
    };

    /* Product ------------------------------------------------------------ */
    const productNode: Record<string, unknown> = {
      "@type": "Product",
      "@id": `${productUrl}#product`,
      name: product.name,
      description: truncateForMeta(
        product.description || product.shortDescription || "",
        5000
      ),
      sku: cleanSku(product.sku),
      image: images,
      url: productUrl,
      offers: offer,
    };

    // Most SKUs in this catalogue are manufacturer barcodes. Publishing the
    // GTIN lets Google match the product against its own catalogue, which is
    // close to a requirement for merchant listings.
    const gtin = skuAsGtin(product.sku);
    if (gtin) {
      productNode.gtin = gtin;
      productNode[`gtin${gtin.length}`] = gtin;
    }

    if (brandName) {
      productNode.brand = { "@type": "Brand", name: brandName };
    }
    if (categoryName) {
      productNode.category = categoryName;
    }

    // Only emit aggregateRating when real ratings exist. Publishing a zero
    // rating is a structured-data policy violation, not just a warning.
    if ((product.reviewCount ?? 0) > 0 && (product.rating ?? 0) > 0) {
      productNode.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Number(product.rating),
        reviewCount: Number(product.reviewCount),
        bestRating: 5,
        worstRating: 1,
      };
    }

    // Map product specifications onto additionalProperty so the attributes
    // shown on the page are machine-readable too.
    if (product.specifications?.length) {
      productNode.additionalProperty = product.specifications.map((spec) => ({
        "@type": "PropertyValue",
        name: spec.key,
        value: spec.value,
      }));
    }

    /* Breadcrumb --------------------------------------------------------- */
    const crumbs: { name: string; item: string }[] = [
      { name: "الرئيسية", item: siteUrl },
      { name: "المتجر", item: `${siteUrl}/shop` },
    ];
    if (categoryName) {
      crumbs.push({
        name: categoryName,
        item: categorySlug
          ? `${siteUrl}/category/${encodeURIComponent(categorySlug)}`
          : `${siteUrl}/shop`,
      });
    }
    crumbs.push({ name: product.name, item: productUrl });

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        productNode,
        {
          "@type": "BreadcrumbList",
          "@id": `${productUrl}#breadcrumb`,
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: c.item,
          })),
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
