import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

/* Static pages that always appear in the sitemap */
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${siteUrl}/home`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${siteUrl}/shop`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${siteUrl}/offers`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  },
  {
    url: `${siteUrl}/brands`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    url: `${siteUrl}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${siteUrl}/faq`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${siteUrl}/return-policy`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await dbConnect();

    const rawProducts = await Product.find({ isActive: true }).select("_id updatedAt").lean();
    const rawBrands   = await Brand.find({ isActive: true }).select("slug updatedAt").lean();
    const products = rawProducts as unknown as { _id: any; updatedAt?: Date }[];
    const brands   = rawBrands   as unknown as { slug: string; updatedAt?: Date }[];

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${siteUrl}/product/${p._id}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${siteUrl}/brand/${b.slug}`,
      lastModified: b.updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...brandRoutes];
  } catch {
    // If the DB is unreachable during build, return only static pages
    return staticRoutes;
  }
}
