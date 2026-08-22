import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await dbConnect();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "فشل تحميل الإعدادات" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const body = await req.json();

    const {
      siteName,
      contactEmail,
      contactPhone,
      whatsappNumber,
      whatsappMessage,
      address,
      socialLinks,
      shippingCost,
      freeShippingThreshold,
      taxRate,
      currency,
      metaTitle,
      metaDescription,
    } = body;

    const update: Record<string, unknown> = {};
    if (typeof siteName === "string") update.siteName = siteName;
    if (typeof contactEmail === "string") update.contactEmail = contactEmail;
    if (typeof contactPhone === "string") update.contactPhone = contactPhone;
    if (typeof whatsappNumber === "string") update.whatsappNumber = whatsappNumber;
    if (typeof whatsappMessage === "string") update.whatsappMessage = whatsappMessage;
    if (typeof address === "string") update.address = address;
    if (socialLinks && typeof socialLinks === "object") {
      update.socialLinks = {
        facebook: socialLinks.facebook || "",
        instagram: socialLinks.instagram || "",
        tiktok: socialLinks.tiktok || "",
        snapchat: socialLinks.snapchat || "",
        twitter: socialLinks.twitter || "",
        youtube: socialLinks.youtube || "",
      };
    }
    if (typeof shippingCost === "number") update.shippingCost = shippingCost;
    if (typeof freeShippingThreshold === "number")
      update.freeShippingThreshold = freeShippingThreshold;
    if (typeof taxRate === "number") update.taxRate = taxRate;
    if (typeof currency === "string") update.currency = currency;
    if (typeof metaTitle === "string") update.metaTitle = metaTitle;
    if (typeof metaDescription === "string") update.metaDescription = metaDescription;

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "فشل حفظ الإعدادات" },
      { status: 500 }
    );
  }
}
