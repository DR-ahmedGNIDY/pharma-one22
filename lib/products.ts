import { cache } from "react";
import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export interface ProductRef {
  _id: string;
  name?: string;
  slug?: string;
}

export interface ProductDoc {
  _id: string;
  name: string;
  slug?: string;
  brand?: ProductRef | string | null;
  category?: ProductRef | string | null;
  images: string[];
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number | null;
  discountPercentage?: number;
  stock: number;
  sku: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  specifications?: { key: string; value: string }[];
  updatedAt?: Date;
}

/** Turn a Mongoose lean() result into plain JSON-safe data for client props. */
function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

/**
 * Fetch one active product by id.
 *
 * Wrapped in React `cache()` so the page and its sibling layout
 * (`generateMetadata` + JSON-LD) share a single database round trip per
 * request instead of querying three times.
 */
export const getProduct = cache(
  async (id: string): Promise<ProductDoc | null> => {
    if (!Types.ObjectId.isValid(id)) return null;
    try {
      await dbConnect();
      const product = await Product.findOne({ _id: id, isActive: true })
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();
      return product ? serialize(product as unknown as ProductDoc) : null;
    } catch {
      return null;
    }
  }
);

/**
 * Products in the same category, excluding the current one.
 *
 * Resolved on the server in a single indexed query so the related-products
 * rail is present in the initial HTML — it used to download the entire
 * catalogue to the browser to render four cards.
 */
export const getRelatedProducts = cache(
  async (
    categoryId: string,
    excludeId: string,
    limit = 4
  ): Promise<ProductDoc[]> => {
    if (!Types.ObjectId.isValid(categoryId)) return [];
    try {
      await dbConnect();
      const products = await Product.find({
        category: categoryId,
        isActive: true,
        _id: { $ne: excludeId },
      })
        .sort({ isBestSeller: -1, createdAt: -1 })
        .limit(limit)
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();
      return serialize(products as unknown as ProductDoc[]);
    } catch {
      return [];
    }
  }
);

/**
 * First page of the shop listing, resolved on the server.
 *
 * Used to put a real product grid into the initial HTML of /shop. The client
 * component takes this as its starting data and only refetches when the
 * visitor changes a filter, instead of downloading the whole catalogue on
 * every page view.
 */
export const getShopProducts = cache(
  async (categorySlug?: string, limit = 24): Promise<ProductDoc[]> => {
    try {
      await dbConnect();

      const filter: Record<string, unknown> = { isActive: true };

      if (categorySlug) {
        const Category = (await import("@/models/Category")).default;
        const cat = await Category.findOne({ slug: categorySlug })
          .select("_id")
          .lean();
        if (!cat) return [];
        filter.category = (cat as any)._id;
      }

      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();

      return serialize(products as unknown as ProductDoc[]);
    } catch {
      return [];
    }
  }
);

/**
 * Read a product's SKU, trimmed.
 *
 * A meaningful share of the catalogue has leading/trailing whitespace in the
 * sku field, which breaks exact matching for GTIN lookups and feed validation.
 */
export function cleanSku(sku: string | undefined | null): string {
  return String(sku ?? "").trim();
}

/**
 * Return the SKU as a GTIN when it is one.
 *
 * Most of this catalogue stores the manufacturer barcode in the `sku` field —
 * an EAN-13 like "6224008073482". Google matches products against its own
 * catalogue by GTIN, so surfacing it lifts eligibility for merchant listings
 * considerably. Anything that is not a valid 8/12/13/14-digit number (internal
 * reference codes, for example) returns null rather than a fabricated value.
 */
export function skuAsGtin(sku: string | undefined | null): string | null {
  const clean = cleanSku(sku);
  return /^\d{8}$|^\d{12,14}$/.test(clean) ? clean : null;
}

/** Read a populated ref's display name, whichever shape it arrived in. */
export function refName(
  ref: ProductRef | string | null | undefined
): string {
  if (!ref) return "";
  return typeof ref === "string" ? "" : ref.name ?? "";
}

/** Read a populated ref's slug, whichever shape it arrived in. */
export function refSlug(
  ref: ProductRef | string | null | undefined
): string {
  if (!ref) return "";
  return typeof ref === "string" ? "" : ref.slug ?? "";
}

/** Read a populated ref's id, whichever shape it arrived in. */
export function refId(
  ref: ProductRef | string | null | undefined
): string {
  if (!ref) return "";
  return typeof ref === "string" ? ref : ref._id ?? "";
}

/**
 * Truncate on a word boundary rather than mid-word.
 *
 * `substring(0, 160)` used to cut Arabic descriptions in the middle of a word,
 * which looks broken in the SERP and costs click-through.
 */
export function truncateForMeta(text: string, max = 160): string {
  const clean = (text || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/**
 * All active products for a brand, resolved on the server.
 *
 * Brand pages previously fetched this in the browser, so the product grid —
 * and every link in it — was invisible to crawlers.
 */
export const getBrandProducts = cache(
  async (brandSlug: string): Promise<ProductDoc[]> => {
    try {
      await dbConnect();
      const Brand = (await import("@/models/Brand")).default;
      const brand = await Brand.findOne({ slug: brandSlug, isActive: true })
        .select("_id")
        .lean();
      if (!brand) return [];

      const products = await Product.find({
        brand: (brand as any)._id,
        isActive: true,
      })
        .sort({ isBestSeller: -1, createdAt: -1 })
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();

      return serialize(products as unknown as ProductDoc[]);
    } catch {
      return [];
    }
  }
);

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Product search, resolved on the server.
 *
 * Mirrors /api/products/search (name, tags, or brand name) so that
 * /shop?q=… — the search URL declared in the site's SearchAction markup —
 * returns real results in its HTML instead of ignoring the query.
 */
export const searchProducts = cache(
  async (query: string, limit = 48): Promise<ProductDoc[]> => {
    const q = query.trim();
    if (!q) return [];
    try {
      await dbConnect();
      const regex = new RegExp(escapeRegex(q), "i");
      const Brand = (await import("@/models/Brand")).default;
      const brands = await Brand.find({ name: { $regex: regex } })
        .select("_id")
        .lean();

      const products = await Product.find({
        isActive: true,
        $or: [
          { name: { $regex: regex } },
          { tags: { $regex: regex } },
          { brand: { $in: brands.map((b: any) => b._id) } },
        ],
      })
        .sort({ isBestSeller: -1, createdAt: -1 })
        .limit(limit)
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();

      return serialize(products as unknown as ProductDoc[]);
    } catch {
      return [];
    }
  }
);

/**
 * A random selection of active products, resolved on the server.
 *
 * The homepage used to download the entire catalogue (about 2.8 MB of JSON)
 * to the browser and shuffle it there to show eight cards, which blocked the
 * main thread for seconds on a phone. `$sample` picks them in the database.
 * Callers cache the result for their revalidate window, so the selection
 * rotates at that interval rather than on every request.
 */
export const getRandomProducts = cache(
  async (limit = 8): Promise<ProductDoc[]> => {
    try {
      await dbConnect();
      const sampled = await Product.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: limit } },
        { $project: { _id: 1 } },
      ]);
      const ids = sampled.map((s: { _id: unknown }) => s._id);

      const products = await Product.find({ _id: { $in: ids } })
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();

      // $in does not preserve order; restore the sampled order.
      const byId = new Map(products.map((p: any) => [String(p._id), p]));
      const ordered = ids
        .map((id) => byId.get(String(id)))
        .filter(Boolean);

      return serialize(ordered as unknown as ProductDoc[]);
    } catch {
      return [];
    }
  }
);

/** The most recently added active products, resolved on the server. */
export const getLatestProducts = cache(
  async (limit = 8): Promise<ProductDoc[]> => {
    try {
      await dbConnect();
      const products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .lean();
      return serialize(products as unknown as ProductDoc[]);
    } catch {
      return [];
    }
  }
);

/** Active offer products, resolved on the server for /offers. */
export const getOfferProducts = cache(async (): Promise<ProductDoc[]> => {
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true, isOffer: true })
      .sort({ createdAt: -1 })
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .lean();
    return serialize(products as unknown as ProductDoc[]);
  } catch {
    return [];
  }
});
