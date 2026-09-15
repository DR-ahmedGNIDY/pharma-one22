import { siteUrl } from "@/lib/seo";

/**
 * How long a generated sitemap is served before it is rebuilt, in seconds.
 *
 * The sitemaps query the database, so without this Next.js prerenders them
 * once at build time and they never change until the next deploy — products
 * added from the admin panel would stay invisible to Google in the meantime.
 */
export const SITEMAP_REVALIDATE = 3600;

export interface SitemapEntry {
  /** Absolute URL, already percent-encoded where needed. */
  loc: string;
  lastmod?: Date | string;
  /** Absolute image URLs shown on the page. */
  images?: string[];
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isoDate(value: Date | string | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Resolve a stored image path (Cloudinary URL or /public path) to an absolute URL. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return encodeURI(decodeURI(path));
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${encodeURI(path)}`;
}

/** A <urlset> document. Adds the image namespace only when images are present. */
export function renderUrlset(entries: SitemapEntry[]): string {
  const hasImages = entries.some((e) => e.images?.length);
  const ns = hasImages
    ? ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : ' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

  const body = entries
    .map((entry) => {
      const lastmod = isoDate(entry.lastmod);
      const images = (entry.images ?? [])
        .map(
          (src) =>
            `<image:image><image:loc>${xmlEscape(src)}</image:loc></image:image>`
        )
        .join("");
      return `<url><loc>${xmlEscape(entry.loc)}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
      }${images}</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset${ns}>\n${body}\n</urlset>\n`;
}

/** A <sitemapindex> document pointing at child sitemaps. */
export function renderSitemapIndex(
  sitemaps: { loc: string; lastmod?: Date | string }[]
): string {
  const body = sitemaps
    .map((s) => {
      const lastmod = isoDate(s.lastmod);
      return `<sitemap><loc>${xmlEscape(s.loc)}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
      }</sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

/** The child sitemaps listed in /sitemap.xml. */
export const CHILD_SITEMAPS = [
  "sitemap-pages.xml",
  "sitemap-categories.xml",
  "sitemap-brands.xml",
  "sitemap-products.xml",
] as const;
