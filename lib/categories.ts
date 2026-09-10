import { cache } from "react";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import type { ProductDoc } from "@/lib/products";

export interface CategoryDoc {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: string | null;
  isActive: boolean;
  order: number;
  updatedAt?: Date;
}

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

/**
 * Editorial intro copy shown under a category's product grid.
 *
 * `Category.description` in the database takes priority — this is only the
 * fallback so a category page is never published without useful content. Once
 * an admin fills in the description field, that wins automatically.
 */
const defaultIntros: Record<string, { heading: string; body: string[] }> = {
  "العناية-بالبشرة": {
    heading: "كيف تختارين منتجات العناية بالبشرة المناسبة لكِ",
    body: [
      "تبدأ العناية الفعّالة بالبشرة بمعرفة نوع بشرتك. البشرة الجافة تحتاج مرطبات غنية بالسيراميدات والزبدة النباتية، بينما تناسب البشرة الدهنية التركيبات الخفيفة الخالية من الزيوت وغير المسببة لانسداد المسام. أما البشرة الحساسة فتستفيد من المنتجات الخالية من العطور والكحول.",
      "الروتين الأساسي يتكوّن من ثلاث خطوات: غسول لطيف، ثم مرطب مناسب لنوع بشرتك، ثم واقي شمس بمعامل حماية 30 على الأقل في الصباح. يمكنك إضافة سيروم مركّز مثل فيتامين سي صباحًا أو الريتينول ليلًا بعد أن يعتاد جلدك على الروتين الأساسي.",
      "ابدئي بمنتج جديد واحد كل أسبوعين حتى تتمكني من معرفة سبب أي تحسّن أو تهيّج. ونوصي دائمًا بتجربة المنتج على منطقة صغيرة خلف الأذن قبل استخدامه على الوجه.",
    ],
  },
  "العناية-بالشعر": {
    heading: "دليل اختيار منتجات العناية بالشعر",
    body: [
      "يختلف احتياج الشعر باختلاف نوعه وحالته. الشعر الجاف والتالف يحتاج ماسكات وزيوت غنية بالبروتين والكيراتين لإعادة بناء الخصلة، بينما يحتاج الشعر الدهني شامبو منظّفًا لفروة الرأس مع بلسم يُوضع على الأطراف فقط.",
      "للشعر المصبوغ أو المعالج كيميائيًا، اختاري منتجات خالية من الكبريتات للحفاظ على اللون لفترة أطول. أما مشاكل تساقط الشعر فتحتاج منتجات تعمل على فروة الرأس نفسها لا على الطول فقط، مثل السيرومات المحتوية على البروكابيل أو الكافيين.",
      "استخدمي الماسك مرة إلى مرتين أسبوعيًا حسب حالة الشعر، وتجنّبي الإفراط في المنتجات البروتينية لأنها قد تجعل الشعر متيبسًا مع الوقت.",
    ],
  },
  "العناية-بالجسم": {
    heading: "العناية بالجسم — ما الذي يحتاجه جلدك فعلًا",
    body: [
      "جلد الجسم أسمك من جلد الوجه لكنه يفقد الترطيب بسرعة، خصوصًا في مناطق المرفقين والركبتين والكعبين. أفضل وقت لوضع مرطب الجسم هو مباشرة بعد الاستحمام والبشرة لا تزال رطبة قليلًا، لأن ذلك يحبس الماء داخل الجلد.",
      "لليدين المعرّضتين للغسل المتكرر، اختاري كريمًا مرمِّمًا يحتوي على الجليسرين أو اليوريا. وللبشرة شديدة الجفاف أو المعرّضة للتهيّج، تناسبها كريمات السيكا المهدّئة.",
      "التقشير مرة أسبوعيًا يساعد على تجديد الجلد وامتصاص المرطب بشكل أفضل، لكن تجنّبيه على الجلد المتهيّج أو بعد إزالة الشعر مباشرة.",
    ],
  },
  العطور: {
    heading: "كيف تختارين عطرك المناسب",
    body: [
      "تنقسم العطور حسب تركيز الزيوت العطرية: العطر (Parfum) هو الأعلى تركيزًا وأطولها ثباتًا، يليه ماء العطر (Eau de Parfum) وهو الأكثر شيوعًا وتوازنًا، ثم ماء التواليت (Eau de Toilette) الأخف والأنسب للنهار والجو الحار.",
      "يتغيّر العطر على البشرة عبر ثلاث مراحل: المقدمة التي تُشم في الدقائق الأولى، ثم القلب الذي يظهر بعد نحو نصف ساعة وهو الطابع الحقيقي للعطر، ثم القاعدة التي تبقى لساعات. لذلك لا تحكمي على عطر من رشّة واحدة في المتجر.",
      "لثبات أطول، رشّي العطر على المناطق الدافئة مثل الرسغين وخلف الأذنين وعلى بشرة مرطّبة، ولا تفركي المعصمين معًا لأن ذلك يكسر جزيئات العطر.",
    ],
  },
  المكياج: {
    heading: "أساسيات اختيار المكياج",
    body: [
      "يبدأ المكياج الناجح من الأساس. اختاري درجة كريم الأساس بتجربتها على خط الفك لا على اليد، وتحت الإضاءة الطبيعية، لأن لون الوجه والرقبة قد يختلفان.",
      "لنوع البشرة دور كبير: البشرة الدهنية تناسبها التركيبات المطفية طويلة الثبات، بينما تناسب البشرة الجافة كريمات الأساس ذات اللمسة المشرقة والمرطّبة.",
      "لا تُهملي خطوة التمهيد (البرايمر) فهي التي تحدّد مدة ثبات المكياج، ولا تنسي إزالة المكياج كاملًا قبل النوم مهما كان الوقت متأخرًا.",
    ],
  },
  "الأدوات-والإكسسوارات": {
    heading: "أدوات التجميل والعناية بها",
    body: [
      "الأدوات الجيدة تصنع فرقًا حقيقيًا في نتيجة المكياج والعناية. فرش المكياج الطبيعية تناسب المستحضرات البودرية، بينما تعطي الفرش الصناعية نتيجة أفضل مع المنتجات السائلة والكريمية.",
      "نظّفي الفرش أسبوعيًا بماء فاتر وشامبو لطيف، واتركيها تجف أفقيًا لا رأسيًا حتى لا يتسرّب الماء إلى قاعدة الفرشاة ويفكّ لاصقها. الفرش غير النظيفة سبب شائع لظهور حبوب الوجه.",
      "استبدلي الإسفنجات كل ثلاثة أشهر تقريبًا، فهي تحتفظ بالرطوبة وتصبح بيئة مناسبة للبكتيريا مع الاستخدام المتكرر.",
    ],
  },
};

export function getCategoryIntro(category: CategoryDoc) {
  // A description written by an admin always wins over the built-in copy.
  if (category.description && category.description.trim().length > 40) {
    return { heading: `عن ${category.name}`, body: [category.description.trim()] };
  }
  return defaultIntros[category.slug] ?? null;
}

/** Short meta-description sentence per category, used when none is set. */
export function categoryMetaDescription(
  category: CategoryDoc,
  productCount: number
): string {
  if (category.description && category.description.trim().length > 40) {
    return category.description.trim().slice(0, 160);
  }
  const count = productCount ? `${productCount} منتج` : "منتجات";
  return `تسوقي ${category.name} من فارما وان كوزماتيكس — ${count} من براندات عالمية أصيلة بأسعار مميزة وتوصيل سريع لجميع أنحاء مصر.`;
}

export const getAllCategories = cache(async (): Promise<CategoryDoc[]> => {
  try {
    await dbConnect();
    const cats = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return serialize(cats as unknown as CategoryDoc[]);
  } catch {
    return [];
  }
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<CategoryDoc | null> => {
    try {
      await dbConnect();
      const cat = await Category.findOne({ slug, isActive: true }).lean();
      return cat ? serialize(cat as unknown as CategoryDoc) : null;
    } catch {
      return null;
    }
  }
);

/** Direct children of a category — supports the model's `parent` field. */
export const getSubCategories = cache(
  async (parentId: string): Promise<CategoryDoc[]> => {
    try {
      await dbConnect();
      const cats = await Category.find({ parent: parentId, isActive: true })
        .sort({ order: 1, name: 1 })
        .lean();
      return serialize(cats as unknown as CategoryDoc[]);
    } catch {
      return [];
    }
  }
);

export const PRODUCTS_PER_PAGE = 24;

export const getCategoryProducts = cache(
  async (
    categoryId: string,
    page = 1
  ): Promise<{ products: ProductDoc[]; total: number; totalPages: number }> => {
    try {
      await dbConnect();
      const filter = { category: categoryId, isActive: true };
      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ isBestSeller: -1, createdAt: -1 })
          .skip((page - 1) * PRODUCTS_PER_PAGE)
          .limit(PRODUCTS_PER_PAGE)
          .populate("brand", "name slug")
          .populate("category", "name slug")
          .lean(),
        Product.countDocuments(filter),
      ]);
      return {
        products: serialize(products as unknown as ProductDoc[]),
        total,
        totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
      };
    } catch {
      return { products: [], total: 0, totalPages: 1 };
    }
  }
);

/** Product counts keyed by category id, for nav and listing badges. */
export const getCategoryCounts = cache(
  async (): Promise<Record<string, number>> => {
    try {
      await dbConnect();
      const rows = await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);
      return Object.fromEntries(
        rows.map((r: any) => [String(r._id), r.count as number])
      );
    } catch {
      return {};
    }
  }
);

export const getBrandBySlug = cache(async (slug: string) => {
  try {
    await dbConnect();
    const Brand = (await import("@/models/Brand")).default;
    const brand = await Brand.findOne({ slug, isActive: true })
      .populate("categories", "name slug")
      .lean();
    return brand ? serialize(brand as any) : null;
  } catch {
    return null;
  }
});
