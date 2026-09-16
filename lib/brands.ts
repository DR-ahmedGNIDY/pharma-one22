import { cache } from "react";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

export interface BrandListItem {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  /** Category names this brand sells in, taken from its live products. */
  categories: string[];
  /** Number of active products. */
  productCount: number;
}

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

/**
 * Every active brand, with its real product count and the categories it
 * actually sells in.
 *
 * The brands page used to render a hand-written list of twelve famous names
 * with invented product counts, ten of which linked to brand pages that do not
 * exist and returned 404. The database holds the real brands.
 */
export const getAllBrands = cache(async (): Promise<BrandListItem[]> => {
  try {
    await dbConnect();

    const [brands, grouped] = await Promise.all([
      Brand.find({ isActive: true }).sort({ order: 1, name: 1 }).lean(),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: { brand: "$brand", category: "$category" }, count: { $sum: 1 } } },
      ]),
    ]);

    // Resolve category ids to names once, rather than populating per product.
    const Category = (await import("@/models/Category")).default;
    const categories = await Category.find({}).select("name").lean();
    const categoryName = new Map(
      categories.map((c: any) => [String(c._id), c.name as string])
    );

    const countByBrand = new Map<string, number>();
    const categoriesByBrand = new Map<string, Set<string>>();

    for (const row of grouped as any[]) {
      const brandId = String(row._id.brand);
      countByBrand.set(brandId, (countByBrand.get(brandId) ?? 0) + row.count);

      const name = categoryName.get(String(row._id.category));
      if (name) {
        if (!categoriesByBrand.has(brandId)) categoriesByBrand.set(brandId, new Set());
        categoriesByBrand.get(brandId)!.add(name);
      }
    }

    const list = (brands as any[]).map((b) => ({
      _id: String(b._id),
      name: b.name as string,
      slug: b.slug as string,
      logo: b.logo as string | undefined,
      description: b.description as string | undefined,
      categories: [...(categoriesByBrand.get(String(b._id)) ?? [])],
      productCount: countByBrand.get(String(b._id)) ?? 0,
    }));

    // Brands that actually carry products come first.
    list.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name, "ar"));

    return serialize(list);
  } catch {
    return [];
  }
});
