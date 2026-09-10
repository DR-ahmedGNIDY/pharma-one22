import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";



export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // NOTE: /_next/ must stay crawlable — it serves the JS, CSS and
        // optimised images Googlebot needs to render the site and to
        // discover product imagery via /_next/image.
        disallow: [
          "/admin/",
          "/account/",
          "/api/",
          "/cart",
          "/wishlist",
          "/login",
          "/register",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
