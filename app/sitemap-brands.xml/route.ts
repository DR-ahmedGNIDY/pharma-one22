import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import { siteUrl } from "@/lib/seo";
import { renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  try {
    await dbConnect();
    const brands = (await Brand.find({ isActive: true })
      .select("slug updatedAt")
      .lean()) as unknown as { slug: string; updatedAt?: Date }[];

    return xmlResponse(
      renderUrlset(
        brands.map((b) => ({
          loc: `${siteUrl}/brand/${encodeURIComponent(b.slug)}`,
          lastmod: b.updatedAt,
        }))
      )
    );
  } catch {
    return xmlResponse(renderUrlset([]));
  }
}
