import type { Metadata } from "next";

/**
 * Single source of truth for the canonical site origin.
 *
 * NEXT_PUBLIC_SITE_URL MUST be set in the production environment to the exact
 * origin the site is served from, with no trailing slash. It drives canonical
 * tags, sitemap URLs, robots.txt and every JSON-LD `@id` / `url` value — so a
 * wrong value silently mis-canonicalises the entire site.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharma1cosmetic.com"
).replace(/\/+$/, "");

export const siteName = "Pharma One Cosmetics";

/**
 * Default social preview image.
 *
 * Next.js does NOT deep-merge `openGraph` between a parent and child layout:
 * a child that declares its own `openGraph` object replaces the parent's
 * entirely, images included. Any layout that sets `openGraph` must therefore
 * spell out its images, or every share of that page renders with no preview.
 */
export const defaultOgImages: NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> = [
  {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Pharma One Cosmetics - متجر التجميل الأول في مصر",
    type: "image/jpeg",
  },
];

/** Same image, in the shape the `twitter` metadata field expects. */
export const defaultTwitterImages = ["/og-image.jpg"];
