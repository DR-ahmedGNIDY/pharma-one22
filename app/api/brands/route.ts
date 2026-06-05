import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";
import { requireAdmin } from "@/lib/requireAdmin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function GET() {
  try {
    await dbConnect();

    const brands = await Brand.find()
      .populate("categories")
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error("GET BRANDS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تحميل البراندات",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      slug,
      description,
      logo,
      banner,
      categories,
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "اسم البراند مطلوب",
        },
        { status: 400 }
      );
    }

    if (!logo) {
      return NextResponse.json(
        {
          success: false,
          message: "لوجو البراند مطلوب",
        },
        { status: 400 }
      );
    }

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "اختار فئة واحدة على الأقل",
        },
        { status: 400 }
      );
    }

    const finalSlug =
      slug && slug.trim() !== ""
        ? slug.trim().toLowerCase()
        : slugify(name);

    const existingBrand = await Brand.findOne({
      $or: [
        { name },
        { slug: finalSlug },
      ],
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          success: false,
          message: "البراند موجود بالفعل",
        },
        { status: 400 }
      );
    }

    const brand = await Brand.create({
      name,
      slug: finalSlug,
      description: description || "",
      logo,
      banner: banner || "",
      categories,
      isActive: true,
      order: 0,
    });

    return NextResponse.json({
      success: true,
      brand,
    });
  } catch (error) {
    console.error("CREATE BRAND ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل إنشاء البراند",
      },
      { status: 500 }
    );
  }
}