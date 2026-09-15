import type { Metadata } from "next";
import { siteUrl, defaultOgImages, defaultTwitterImages } from "@/lib/seo";
import {
  getCategoryBySlug,
  getCategoryProducts,
  categoryMetaDescription,
} from "@/lib/categories";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
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

  // Paginated pages override this canonical with their own.
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

// The JSON-LD that used to live here moved into CategoryView: emitted from the
// layout it appeared on every paginated page while describing page 1's
// products. It now renders only on page 1, where it is accurate.
export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
