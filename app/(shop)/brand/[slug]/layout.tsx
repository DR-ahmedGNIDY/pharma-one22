import { cache } from "react";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

const getBrand = cache(async (slug: string) => {
  try {
    await dbConnect();
    const brand = await Brand.findOne({ slug })
      .populate("categories", "name")
      .lean();
    return brand as any;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) {
    return { title: "البراند غير موجود", robots: { index: false, follow: false } };
  }

  const categoryNames: string[] = (brand.categories || []).map(
    (c: any) => (typeof c === "object" ? c.name : c)
  );

  const title = `${brand.name} | منتجات أصيلة`;
  const description =
    brand.description?.substring(0, 160) ||
    `تصفحي جميع منتجات ${brand.name} الأصيلة — ${categoryNames.join("، ")}. متوفرة بأسعار مميزة وتوصيل سريع.`;

  const canonicalUrl = `${siteUrl}/brand/${slug}`;

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
        : [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: brand.name }],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function BrandSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
