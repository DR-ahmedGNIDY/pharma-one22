import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "معرّف المنتج غير صحيح" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
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
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تحميل المنتج",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "معرّف المنتج غير صحيح" },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      {
        new: true,
        runValidators: true,
      }
    )
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
      message: "تم تعديل المنتج بنجاح",
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تعديل المنتج",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "المنتج غير موجود",
        },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل حذف المنتج",
      },
      { status: 500 }
    );
  }
}