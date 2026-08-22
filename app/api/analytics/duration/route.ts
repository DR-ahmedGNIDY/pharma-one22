import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PageView from "@/models/PageView";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { id, duration } = body;

    if (!id || typeof duration !== "number" || duration < 0) {
      return NextResponse.json(
        { success: false, message: "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    await PageView.findByIdAndUpdate(id, {
      duration: Math.min(Math.round(duration), 3600),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UPDATE DURATION ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
