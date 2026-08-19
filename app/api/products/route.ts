import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

function slugify(text: string): string {
  const result = text
    .trim()
    // Keep: Arabic letters/diacritics, Latin letters, digits, spaces, hyphens
    // Remove: anything else (punctuation, special chars invalid in URLs)
    .replace(/[^؀-ۿݐ-ݿ\w\s-]/g, "")
    .toLowerCase()
    .replace(/[\s-]+/g, "-")  // collapse whitespace and hyphens into single hyphen
    .replace(/^-+|-+$/g, ""); // trim edge hyphens

  return result || "product";
}

async function uniqueSlug(base: string): Promise<string> {
  const existing = await Product.findOne({ slug: base }).select("_id").lean();
  if (!existing) return base;
  // Append 6-digit random suffix until unique
  let candidate: string;
  do {
    candidate = `${base}-${Math.floor(100000 + Math.random() * 900000)}`;
  } while (await Product.findOne({ slug: candidate }).select("_id").lean());
  return candidate;
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      sku,
      images,
      isOffer,
    } = body;

    if (!name || !brand || !category || !description || !price || !sku) {
      return NextResponse.json(
        { success: false, message: "جميع الحقول المطلوبة غير مكتملة" },
        { status: 400 }
      );
    }

    // Uniqueness is based on SKU only — names may be similar
    const existingSku = await Product.findOne({ sku }).select("_id").lean();
    if (existingSku) {
      return NextResponse.json(
        { success: false, message: "رقم SKU موجود بالفعل، يرجى استخدام رقم تعريفي مختلف" },
        { status: 400 }
      );
    }

    // Generate slug; append random suffix if another product already has the same slug
    const slug = await uniqueSlug(slugify(name));

    const product = await Product.create({
      name,
      slug,
      brand,
      category,
      description,
      price,
      discountPrice: discountPrice || null,
      stock,
      sku,
      images: images || [],
      isActive: true,
      isOffer: isOffer ?? false,
      rating: 0,
      reviewCount: 0,
      tags: [],
      specifications: [],
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء حفظ المنتج" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const isOffer = searchParams.get("isOffer");
    const brandSlug = searchParams.get("brandSlug");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const filter: Record<string, unknown> = {};
    if (isOffer === "true") filter.isOffer = true;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    if (brandSlug) {
      const Brand = (await import("@/models/Brand")).default;
      const brand = await Brand.findOne({ slug: brandSlug }).select("_id").lean();
      if (brand) {
        filter.brand = (brand as any)._id.toString();
      } else {
        return NextResponse.json({ success: true, products: [] });
      }
    }

    // Backward-compatible: without ?page, return every matching product as before.
    // Callers migrated to pagination should pass ?page=1&limit=20.
    if (!pageParam) {
      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .populate("brand")
        .populate("category");

      return NextResponse.json({
        success: true,
        products,
      });
    }

    const page = Math.max(1, parseInt(pageParam, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam || "20", 10) || 20));

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("brand")
        .populate("category"),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      products,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "فشل تحميل المنتجات" },
      { status: 500 }
    );
  }
}
