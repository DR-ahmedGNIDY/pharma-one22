import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Brand from "@/models/Brand";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const brand = await Brand.findById(id).populate("categories");

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "البراند غير موجود",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brand,
    });
  } catch (error) {
    console.error("GET BRAND ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تحميل البراند",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json();

    const {
      name,
      slug,
      description,
      logo,
      banner,
      categories,
      isActive,
    } = body;

    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        logo,
        banner,
        categories,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("categories");

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "البراند غير موجود",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brand,
      message: "تم تعديل البراند بنجاح",
    });
  } catch (error) {
    console.error("UPDATE BRAND ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل تعديل البراند",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          message: "البراند غير موجود",
        },
        { status: 404 }
      );
    }

    await Brand.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "تم حذف البراند بنجاح",
    });
  } catch (error) {
    console.error("DELETE BRAND ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "فشل حذف البراند",
      },
      { status: 500 }
    );
  }
}