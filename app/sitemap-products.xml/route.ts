import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { siteUrl } from "@/lib/seo";
import { absoluteUrl, renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

// A single sitemap file may hold 50,000 URLs. The catalogue is about 1,100
// products today, so one file is plenty; split by page if it nears the limit.
export async function GET() {
  try {
    await dbConnect();
    const products = (await Product.find({ isActive: true })
      .select("_id updatedAt images")
      .lean()) as unknown as {
      _id: unknown;
      updatedAt?: Date;
      images?: string[];
    }[];

    return xmlResponse(
      renderUrlset(
        products.map((p) => ({
          loc: `${siteUrl}/product/${String(p._id)}`,
          lastmod: p.updatedAt,
          // Listing images here is the most direct way to get product photos
          // discovered for Google Images.
          images: (p.images ?? []).filter(Boolean).map(absoluteUrl),
        }))
      )
    );
  } catch {
    return xmlResponse(renderUrlset([]));
  }
}
