"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Plus,
  X,
  Check,
  AlertTriangle,
  Upload,
  Tag,
  DollarSign,
  Package,
  FileText,
  Hash,
  Trash2,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProductForm {
  name: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  discountPrice: number;
  stock: number;
  sku: string;
  description: string;
  shortDescription: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  specifications: { key: string; value: string }[];
}



const subCategories: Record<string, string[]> = {
  makeup: ["ظلال عيون", "أحمر شفاه", "كريم أساس", "ماسكارا", "ملمع شفاه", "كونسيلر", "بلاشر", "هايلايتر"],
  skincare: ["سيروم", "غسول", "مرطب", "مقشر", "تونر", "واقي شمس", "ماسك"],
  perfumes: ["عطر نسائي", "عطر رجالي", "عطر يونيسكس", "عطر شرقي", "عطر زهري"],
  haircare: ["شامبو", "بلسم", "زيت", "ماسك شعر", "سيروم شعر", "بروتين"],
  bodycare: ["لوشن", "زيت جسم", "مقشر", "صابون", "مزيل عرق"],
  tools: ["فرش مكياج", "ميرور", "أدوات العناية", "إكسسوارات"],
};


export default function AddProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    slug: "",
    brand: "",
    category: "",
    subCategory: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    sku: "",
    description: "",
    shortDescription: "",
    tags: [],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isActive: true,
    specifications: [{ key: "", value: "" }],
  });

  const [brands, setBrands] = useState<any[]>([]);
const [categories, setCategories] = useState<any[]>([]);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const [brandsRes, categoriesRes] = await Promise.all([
      fetch("/api/brands"),
      fetch("/api/categories"),
    ]);

    const brandsData = await brandsRes.json();
    const categoriesData = await categoriesRes.json();

    if (brandsData.success) {
      setBrands(brandsData.brands);
    }

    if (categoriesData.success) {
      setCategories(categoriesData.categories);
    }
  } catch (error) {
    console.error(error);
    toast.error("فشل تحميل البيانات");
  }
};

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0621-\u064A\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const discountPercentage =
    formData.discountPrice > 0 && formData.price > 0 && formData.discountPrice < formData.price
      ? Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)
      : 0;

  const isDiscountValid =
    formData.discountPrice === 0 ||
    (formData.discountPrice > 0 && formData.discountPrice < formData.price);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  console.log("FILE SELECTED");

  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = async () => {
    try {
      toast.loading("جاري رفع الصورة...", {
        id: "upload",
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: reader.result,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setImages((prev) => [...prev, data.url]);

        toast.success("تم رفع الصورة بنجاح", {
          id: "upload",
        });
      } else {
        toast.error("فشل رفع الصورة", {
          id: "upload",
        });
      }
    } catch {
      toast.error("حدث خطأ أثناء الرفع", {
        id: "upload",
      });
    }
  };
};

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.name.trim() !== "" &&
          formData.brand !== "" &&
          formData.category !== "" &&
          formData.sku.trim() !== ""
        );
      case 2:
        return formData.price > 0 && isDiscountValid && formData.stock >= 0;
      case 3:
        return formData.description.trim() !== "";
      case 4:
        return images.length > 0;
      default:
        return true;
    }
  };

  
    const handleSubmit = async () => {
  if (
    !validateStep(1) ||
    !validateStep(2) ||
    !validateStep(3) ||
    !validateStep(4)
  ) {
    toast.error("يرجى ملء جميع الحقول المطلوبة");
    return;
  }

  try {
    setIsSubmitting(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        price: formData.price,
        discountPrice: formData.discountPrice,
        stock: formData.stock,
        sku: formData.sku,
        images,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "فشل حفظ المنتج");
      return;
    }

    toast.success("تم إضافة المنتج بنجاح");

    router.push("/admin/products");
  } catch (error) {
    console.error(error);
    toast.error("حدث خطأ أثناء الحفظ");
  } finally {
    setIsSubmitting(false);
  }
};

  const steps = [
    { id: 1, label: "المعلومات الأساسية", icon: FileText },
    { id: 2, label: "السعر والمخزون", icon: DollarSign },
    { id: 3, label: "الوصف والتفاصيل", icon: FileText },
    { id: 4, label: "الصور والوسوم", icon: ImageIcon },
    { id: 5, label: "المراجعة", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container-luxury max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/products"
              className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all"
            >
              <ArrowRight size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-cream">إضافة منتج جديد</h1>
          </div>
          <p className="text-gold-muted mr-12">أضفي منتجاً جديداً إلى متجرك</p>
        </motion.div>

        {/* Steps Progress */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                currentStep === step.id
                  ? "bg-gold text-black"
                  : currentStep > step.id
                  ? "bg-gold/20 text-gold"
                  : "bg-black-light text-gold-muted"
              }`}
            >
              <step.icon size={16} />
              <span>{step.label}</span>
              {currentStep > step.id && <Check size={14} />}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="luxury-card p-8"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <FileText className="text-gold" size={22} />
                المعلومات الأساسية
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gold-light mb-2">
                    اسم المنتج <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="مثال: HUDA BEAUTY The New Nude Eyeshadow Palette"
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                  />
                  {formData.slug && (
                    <p className="text-xs text-gold-muted mt-1">
                      الرابط: /product/{formData.slug}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    البراند <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  >
                    <option value="">اختر البراند</option>
                    {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                    {brand.name}
                    </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    SKU <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted" size={16} />
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="مثال: HB-001"
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-10 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    الفئة الرئيسية <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value, subCategory: "" })
                    }
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  >
                    <option value="">اختر الفئة</option>
{categories.map((category) => (
  <option key={category._id} value={category._id}>
    {category.name}
  </option>
))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gold-light mb-2">الفئة الفرعية</label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    disabled={!formData.category}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50 disabled:opacity-50"
                  >
                    <option value="">اختر الفئة الفرعية</option>
                    {formData.category &&
                      subCategories[formData.category]?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Product Status */}
              <div className="pt-4 border-t border-gold/10">
                <label className="block text-sm text-gold-light mb-3">حالة المنتج</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "isActive", label: "نشط", color: "green" },
                    { id: "isFeatured", label: "مميز", color: "gold" },
                    { id: "isNewArrival", label: "وصل حديثاً", color: "blue" },
                    { id: "isBestSeller", label: "الأكثر مبيعاً", color: "purple" },
                  ].map((status) => (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          [status.id]: !prev[status.id as keyof ProductForm],
                        }))
                      }
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                        formData[status.id as keyof ProductForm]
                          ? `border-${status.color}-500 bg-${status.color}-500/10 text-${status.color}-400`
                          : "border-gold/20 text-gold-muted hover:border-gold/40"
                      }`}
                    >
                      {formData[status.id as keyof ProductForm] && <Check size={14} />}
                      <span className="text-sm">{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Price & Stock */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <DollarSign className="text-gold" size={22} />
                السعر والمخزون
              </h2>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    السعر الأصلي <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted" size={16} />
                    <input
                      type="number"
                      min="0"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                      placeholder="0.00"
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-10 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    سعر الخصم <span className="text-gold-muted">(اختياري)</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted" size={16} />
                    <input
                      type="number"
                      min="0"
                      value={formData.discountPrice || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, discountPrice: Number(e.target.value) })
                      }
                      placeholder="0.00"
                      className={`w-full bg-black border rounded-xl py-3 pr-10 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 ${
                        !isDiscountValid ? "border-red-500" : "border-gold/20"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    المخزون <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted" size={16} />
                    <input
                      type="number"
                      min="0"
                      value={formData.stock || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: Number(e.target.value) })
                      }
                      placeholder="0"
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-10 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Preview */}
              <div className="p-5 bg-gold/5 rounded-xl border border-gold/20">
                <h3 className="text-sm font-bold text-gold mb-3">معاينة السعر</h3>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gold-muted mb-1">السعر الأصلي</p>
                    <p className="text-lg font-bold text-cream">
                      {formData.price > 0 ? `${formData.price} ج.م` : "--"}
                    </p>
                  </div>
                  {formData.discountPrice > 0 && (
                    <>
                      <div className="text-gold-muted">→</div>
                      <div>
                        <p className="text-xs text-gold-muted mb-1">سعر الخصم</p>
                        <p className="text-lg font-bold text-gold">
                          {formData.discountPrice} ج.م
                        </p>
                      </div>
                      <div className="text-gold-muted">→</div>
                      <div>
                        <p className="text-xs text-gold-muted mb-1">نسبة الخصم</p>
                        <p className="text-lg font-bold text-green-400">
                          {discountPercentage}%
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {!isDiscountValid && (
                  <div className="flex items-center gap-2 text-red-400 text-sm mt-3">
                    <AlertTriangle size={16} />
                    <span>سعر الخصم يجب أن يكون أقل من السعر الأصلي</span>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gold-light">المواصفات</label>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors"
                  >
                    <Plus size={16} />
                    <span>إضافة مواصفة</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <GripVertical className="text-gold-muted" size={16} />
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, "key", e.target.value)}
                        placeholder="الخاصية (مثال: اللون)"
                        className="flex-1 bg-black border border-gold/20 rounded-xl py-2.5 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 text-sm"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, "value", e.target.value)}
                        placeholder="القيمة (مثال: نيود)"
                        className="flex-1 bg-black border border-gold/20 rounded-xl py-2.5 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 text-sm"
                      />
                      {formData.specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecification(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Description */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <FileText className="text-gold" size={22} />
                الوصف والتفاصيل
              </h2>

              <div>
                <label className="block text-sm text-gold-light mb-2">
                  الوصف المختصر <span className="text-gold-muted">(يظهر في البطاقات)</span>
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  placeholder="وصف مختصر للمنتج (2-3 كلمات)"
                  maxLength={100}
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                />
                <p className="text-xs text-gold-muted mt-1 text-left">
                  {formData.shortDescription.length}/100
                </p>
              </div>

              <div>
                <label className="block text-sm text-gold-light mb-2">
                  الوصف الكامل <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="اكتبي وصفاً تفصيلياً للمنتج..."
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>

              {formData.description && (
                <div className="p-5 bg-black rounded-xl border border-gold/10">
                  <h3 className="text-sm font-bold text-gold mb-3">معاينة الوصف</h3>
                  <div className="text-cream/80 text-sm whitespace-pre-line leading-relaxed">
                    {formData.description}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Images & Tags */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <ImageIcon className="text-gold" size={22} />
                الصور والوسوم
              </h2>

              <div>
                <label className="block text-sm text-gold-light mb-3">
                  صور المنتج <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 right-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded-full">
                          رئيسية
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="col-span-2">
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="bg-white text-black p-3 rounded"
  />
</div>
                    
                </div>
                <p className="text-xs text-gold-muted">
                  يمكنك رفع حتى 10 صور. الصورة الأولى هي الصورة الرئيسية.
                </p>
              </div>

              <div className="pt-4 border-t border-gold/10">
                <label className="block text-sm text-gold-light mb-3">الوسوم</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="اكتبي وسم ثم Enter"
                    className="flex-1 bg-black border border-gold/20 rounded-xl py-2.5 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 rounded-xl bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm"
                    >
                      <Tag size={12} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="mr-1 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                {formData.tags.length === 0 && (
                  <p className="text-sm text-gold-muted">لا توجد وسوم مضافة</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                <Check className="text-gold" size={22} />
                مراجعة المنتج
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">اسم المنتج</h3>
                    <p className="text-cream font-medium">{formData.name || "--"}</p>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">البراند / الفئة</h3>
                    <p className="text-cream">
                      {brands.find((b) => b._id === formData.brand)?.name || "--"} /
                      {categories.find((c) => c._id === formData.category)?.name || "--"}
                    </p>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">السعر</h3>
                    <p className="text-cream">
                      {formData.price > 0 ? (
                        <>
                          <span className="text-gold font-bold">{formData.discountPrice || formData.price} ج.م</span>
                          {formData.discountPrice > 0 && (
                            <span className="text-gold-muted line-through mr-2">
                              {formData.price} ج.م
                            </span>
                          )}
                          {discountPercentage > 0 && (
                            <span className="text-green-400 text-sm mr-2">
                              (-{discountPercentage}%)
                            </span>
                          )}
                        </>
                      ) : (
                        "--"
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">المخزون / SKU</h3>
                    <p className="text-cream">
                      {formData.stock} قطعة / {formData.sku || "--"}
                    </p>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">الحالة</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.isActive && (
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">نشط</span>
                      )}
                      {formData.isFeatured && (
                        <span className="px-2 py-1 rounded-full bg-gold/20 text-gold text-xs">مميز</span>
                      )}
                      {formData.isNewArrival && (
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">جديد</span>
                      )}
                      {formData.isBestSeller && (
                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">الأكثر مبيعاً</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">الوصف المختصر</h3>
                    <p className="text-cream text-sm">{formData.shortDescription || "--"}</p>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">الوصف الكامل</h3>
                    <p className="text-cream/80 text-sm whitespace-pre-line line-clamp-6">
                      {formData.description || "--"}
                    </p>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">الصور ({images.length})</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((img, i) => (
                        <img key={i} src={img} alt={`Preview ${i}`} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      ))}
                      {images.length === 0 && <p className="text-sm text-gold-muted">لا توجد صور</p>}
                    </div>
                  </div>
                  <div className="p-4 bg-black rounded-xl border border-gold/10">
                    <h3 className="text-sm text-gold-muted mb-2">الوسوم</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-gold/10 text-gold text-xs">{tag}</span>
                      ))}
                      {formData.tags.length === 0 && <p className="text-sm text-gold-muted">لا توجد وسوم</p>}
                    </div>
                  </div>
                </div>
              </div>

              {(!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="text-red-400 shrink-0" size={20} />
                  <p className="text-red-400 text-sm">
                    يرجى ملء جميع الحقول المطلوبة في الخطوات السابقة قبل الحفظ
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gold/10">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/20 text-gold hover:bg-gold/5 transition-all disabled:opacity-30"
            >
              <ArrowRight size={18} />
              <span>السابق</span>
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setCurrentStep((prev) => prev + 1);
                  } else {
                    toast.error("يرجى ملء جميع الحقول المطلوبة");
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-black font-bold hover:shadow-gold transition-all"
              >
                <span>التالي</span>
                <ArrowLeft size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gold text-black font-bold hover:shadow-gold transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>حفظ المنتج</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
