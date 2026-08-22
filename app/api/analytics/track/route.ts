import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PageView from "@/models/PageView";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { visitorId, sessionId, path, device, referrer } = body;

    if (!visitorId || !sessionId || !path) {
      return NextResponse.json(
        { success: false, message: "بيانات ناقصة" },
        { status: 400 }
      );
    }

    const pageView = await PageView.create({
      visitorId: String(visitorId).slice(0, 100),
      sessionId: String(sessionId).slice(0, 100),
      path: String(path).slice(0, 300),
      device: ["mobile", "tablet", "desktop"].includes(device) ? device : "desktop",
      referrer: referrer ? String(referrer).slice(0, 300) : "",
    });

    return NextResponse.json({ success: true, id: pageView._id });
  } catch (error) {
    console.error("TRACK PAGEVIEW ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
