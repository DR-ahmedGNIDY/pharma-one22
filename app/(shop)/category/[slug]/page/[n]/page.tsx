import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { siteUrl } from "@/lib/seo";
import { getCategoryBySlug } from "@/lib/categories";
import { CategoryView } from "../../CategoryView";

// Paginated pages are rendered on demand and then cached, like page 1.
export const revalidate = 3600;
export const dynamicParams = true;

// An empty list still opts this route into the full route cache: nothing is
// prerendered at build, but each page is cached after its first request.
// Without it the route is rendered from scratch every time.
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string; n: string }> };

function parsePage(n: string): number | null {
  if (!/^\d+$/.test(n)) return null;
  const num = parseInt(n, 10);
  // Page 1 lives at the category's own URL; /page/1 would duplicate it.
  return num >= 2 ? num : null;
}

/**
 * Each paginated page canonicalises to itself. Without this it would inherit
 * the category layout's canonical, and every page would claim to be page 1.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, n } = await params;
  const pageNum = parsePage(n);
  if (!pageNum) return {};

  const category = await getCategoryBySlug(decodeURIComponent(slug));
  if (!category) return {};

  const base = `${siteUrl}/category/${encodeURIComponent(category.slug)}`;
  return {
    title: `${category.name} — صفحة ${pageNum}`,
    alternates: { canonical: `${base}/page/${pageNum}` },
  };
}

export default async function CategoryPaginatedPage({ params }: Props) {
  const { slug, n } = await params;
  const pageNum = parsePage(n);
  if (!pageNum) notFound();

  return <CategoryView slug={slug} pageNum={pageNum} />;
}
