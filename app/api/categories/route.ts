import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

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

    const categories = await Category.find()
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تحميل الفئات",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      description,
      icon,
      image,
      parent,
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "اسم الفئة مطلوب",
        },
        { status: 400 }
      );
    }

    const slug =
  body.slug && body.slug.trim() !== ""
    ? body.slug.trim().toLowerCase()
    : slugify(name);

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "الفئة موجودة بالفعل",
        },
        { status: 400 }
      );
    }

    const category = await Category.create({
  name,
  slug,
  description: description || "",
  icon: icon || "",
  image: image || "",
  parent: parent || null,
  isActive: true,
  order: 0,
});

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل إنشاء الفئة",
      },
      { status: 500 }
    );
  }
}