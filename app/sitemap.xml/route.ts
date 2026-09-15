import { siteUrl } from "@/lib/seo";
import {
  CHILD_SITEMAPS,
  renderSitemapIndex,
  xmlResponse,
} from "@/lib/sitemap";

// Keep in step with SITEMAP_REVALIDATE; route segment config must be a literal.
export const revalidate = 3600;

/**
 * Sitemap index.
 *
 * This is the URL submitted to Search Console and declared in robots.txt, so
 * it stays at /sitemap.xml and points at one child sitemap per content type.
 * Search Console then reports indexing coverage for products, categories and
 * brands separately.
 */
export async function GET() {
  const now = new Date();
  return xmlResponse(
    renderSitemapIndex(
      CHILD_SITEMAPS.map((name) => ({ loc: `${siteUrl}/${name}`, lastmod: now }))
    )
  );
}
