import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import dbConnect from "@/lib/db";
import Page from "@/models/Page";
import { requireAdmin } from "@/lib/requireAdmin";
import { PAGE_SLUGS, pageDefaults, PageSlug } from "@/lib/pageDefaults";

function isValidSlug(slug: string): slug is PageSlug {
  return (PAGE_SLUGS as readonly string[]).includes(slug);
}

function sanitizePageContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "em", "ul", "ol", "li", "br", "span"],
    allowedAttributes: {
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(right|left|center|justify)$/],
        "font-size": [/^\d+(?:px|rem|em)$/],
      },
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, message: "صفحة غير موجودة" },
        { status: 404 }
      );
    }

    await dbConnect();

    let page = await Page.findOne({ slug });

    if (!page) {
      page = await Page.create({ slug, ...pageDefaults[slug] });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("GET PAGE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "فشل تحميل الصفحة" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, message: "صفحة غير موجودة" },
        { status: 404 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { title, content, faqs } = body;

    const update: Record<string, unknown> = {};
    if (typeof title === "string") update.title = title;
    if (typeof content === "string") update.content = sanitizePageContent(content);
    if (slug === "faq" && Array.isArray(faqs)) update.faqs = faqs;

    const page = await Page.findOneAndUpdate(
      { slug },
      { $set: update, $setOnInsert: { slug } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("UPDATE PAGE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "فشل حفظ الصفحة" },
      { status: 500 }
    );
  }
}
