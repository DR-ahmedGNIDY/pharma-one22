import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

function slugify(text: string): string {
  // Extract Latin characters only — Arabic chars are stripped by \w in JS regex
  const latin = text
    .toLowerCase()
    .trim()
    .replace(/[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g, "") // strip Arabic
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, ""); // trim edge hyphens

  // Pure Arabic name — use a stable prefix so the slug is not empty
  return latin || "product";
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

    const filter: Record<string, unknown> = {};
    if (isOffer === "true") filter.isOffer = true;

    if (brandSlug) {
      const Brand = (await import("@/models/Brand")).default;
      const brand = await Brand.findOne({ slug: brandSlug }).select("_id").lean();
      if (brand) {
        filter.brand = (brand as any)._id.toString();
      } else {
        return NextResponse.json({ success: true, products: [] });
      }
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("brand")
      .populate("category");

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "فشل تحميل المنتجات" },
      { status: 500 }
    );
  }
}
