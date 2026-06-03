import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const product = await Product.findOne({ slug })
      .populate("brand")
      .populate("category");

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "المنتج غير موجود",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY SLUG ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تحميل المنتج",
      },
      { status: 500 }
    );
  }
}