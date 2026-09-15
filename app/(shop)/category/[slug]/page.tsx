import { getAllCategories } from "@/lib/categories";
import { CategoryView } from "./CategoryView";

// Cached and rebuilt hourly. This page reads no search params — that is what
// lets it be cached at all — so new, removed or deactivated products appear
// within the hour instead of only after a deploy.
export const revalidate = 3600;

/** Pre-render every category at build time; new ones render on demand. */
export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats.map((c) => ({ slug: encodeURIComponent(c.slug) }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryView slug={slug} pageNum={1} />;
}
