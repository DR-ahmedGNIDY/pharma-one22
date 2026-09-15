import { siteUrl } from "@/lib/seo";
import { renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

// No <lastmod> for these: a timestamp regenerated every hour would claim the
// pages changed when they did not, and Google stops trusting lastmod values
// that are consistently wrong.
const PAGES = [
  "",
  "/shop",
  "/offers",
  "/brands",
  "/contact",
  "/faq",
  "/about",
  "/return-policy",
  "/privacy",
  "/terms",
];

export async function GET() {
  return xmlResponse(renderUrlset(PAGES.map((path) => ({ loc: `${siteUrl}${path}` }))));
}
