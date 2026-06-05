import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
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

    if (
      !name ||
      !brand ||
      !category ||
      !description ||
      !price ||
      !sku
    ) {
      return NextResponse.json(
        { success: false, message: "جميع الحقول المطلوبة غير مكتملة" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const existingProduct = await Product.findOne({
      $or: [{ slug }, { sku }],
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, message: "المنتج موجود بالفعل" },
        { status: 400 }
      );
    }

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
      {
        success: false,
        message: "حدث خطأ أثناء حفظ المنتج",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const isOffer = searchParams.get("isOffer");

    const filter: Record<string, unknown> = {};
    if (isOffer === "true") filter.isOffer = true;

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
      {
        success: false,
        message: "فشل تحميل المنتجات",
      },
      { status: 500 }
    );
  }
}