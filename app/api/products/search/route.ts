import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Brand from "@/models/Brand";

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json({ success: true, products: [] });
    }

    const safeQuery = escapeRegex(q);
    const regex = new RegExp(safeQuery, "i");

    // Brands whose name matches the query, so we can match products by brand name too
    const matchingBrands = await Brand.find({ name: { $regex: regex } })
      .select("_id")
      .lean();
    const matchingBrandIds = matchingBrands.map((b: any) => b._id);

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: regex } },
        { tags: { $regex: regex } },
        { brand: { $in: matchingBrandIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("SEARCH PRODUCTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "فشل البحث عن المنتجات" },
      { status: 500 }
    );
  }
}
