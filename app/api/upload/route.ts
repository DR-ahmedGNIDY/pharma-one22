import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const imageUrl = await uploadImage(
      body.image,
      "pharma-one/products"
    );

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      { status: 500 }
    );
  }
}