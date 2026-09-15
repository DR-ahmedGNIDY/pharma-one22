import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { siteUrl } from "@/lib/seo";
import { renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  try {
    await dbConnect();
    const categories = (await Category.find({ isActive: true })
      .select("slug updatedAt")
      .lean()) as unknown as { slug: string; updatedAt?: Date }[];

    return xmlResponse(
      renderUrlset(
        categories.map((c) => ({
          loc: `${siteUrl}/category/${encodeURIComponent(c.slug)}`,
          lastmod: c.updatedAt,
        }))
      )
    );
  } catch {
    return xmlResponse(renderUrlset([]));
  }
}
