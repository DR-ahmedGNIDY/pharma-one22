"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo: string;
  banner?: string;
  categories: Category[];
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface BrandForm {
  name: string;
  slug: string;
  description: string;
  logo: string;
  categories: string[];
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formData, setFormData] = useState<BrandForm>({
    name: "",
    slug: "",
    description: "",
    logo: "",
    categories: [],
  });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo: "",
      categories: [],
    });

    setEditingBrand(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);

    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || "",
      logo: brand.logo || "",
      categories: brand.categories.map((cat) => cat._id),
    });

    setIsModalOpen(true);
  };
  useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);

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
  } finally {
    setLoading(false);
  }
};

const toggleCategory = (categoryId: string) => {
  setFormData((prev) => ({
    ...prev,
    categories: prev.categories.includes(categoryId)
      ? prev.categories.filter((id) => id !== categoryId)
      : [...prev.categories, categoryId],
  }));
};

const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = async () => {
    try {
      toast.loading("جاري رفع اللوجو...", {
        id: "upload-logo",
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
        setFormData((prev) => ({
          ...prev,
          logo: data.url,
        }));

        toast.success("تم رفع اللوجو بنجاح", {
          id: "upload-logo",
        });
      } else {
        toast.error("فشل رفع اللوجو", {
          id: "upload-logo",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("حدث خطأ أثناء رفع اللوجو", {
        id: "upload-logo",
      });
    }
  };
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.logo) {
    toast.error("يرجى رفع لوجو البراند");
    return;
  }

  if (formData.categories.length === 0) {
    toast.error("اختار فئة واحدة على الأقل");
    return;
  }

  try {
    setIsSubmitting(true);

    const url = editingBrand
      ? `/api/brands/${editingBrand._id}`
      : "/api/brands";

    const method = editingBrand ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "فشل الحفظ");
      return;
    }

    toast.success(
      editingBrand
        ? "تم تعديل البراند بنجاح"
        : "تم إضافة البراند بنجاح"
    );

    setIsModalOpen(false);

    resetForm();

    await loadData();
  } catch (error) {
    console.error(error);

    toast.error("حدث خطأ أثناء الحفظ");
  } finally {
    setIsSubmitting(false);
  }
};

const handleDelete = async (id: string) => {
  const confirmed = window.confirm(
    "هل أنت متأكد من حذف هذا البراند؟"
  );

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/brands/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      toast.error(data.message || "فشل الحذف");
      return;
    }

    toast.success("تم حذف البراند بنجاح");

    await loadData();
  } catch (error) {
    console.error(error);

    toast.error("حدث خطأ أثناء الحذف");
  }
};
return (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-cream mb-1">
          البراندات
        </h1>
        <p className="text-gold-muted">
          إدارة براندات المتجر
        </p>
      </div>

      <button
        onClick={openAddModal}
        className="btn-gold flex items-center gap-2"
      >
        <Plus size={18} />
        <span>إضافة براند</span>
      </button>
    </div>

    {/* Search */}
    <div className="luxury-card p-4">
      <div className="relative">
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
          size={18}
        />

        <input
          type="text"
          placeholder="البحث في البراندات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
        />
      </div>
    </div>

    {/* Brands Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="text-gold">
          جاري التحميل...
        </div>
      ) : (
        filteredBrands.map((brand, index) => (
          <motion.div
            key={brand._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="luxury-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gold/10 flex items-center justify-center">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    className="text-gold"
                    size={24}
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(brand)}
                  className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all"
                >
                  <Edit2 size={14} />
                </button>

                <button
                  onClick={() => handleDelete(brand._id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-cream mb-4">
              {brand.name}
            </h3>

            <p className="text-gold-muted text-sm mb-4">
              {brand.description || "لا يوجد وصف"}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {brand.categories?.map((cat) => (
                <span
                  key={cat._id}
                  className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full"
                >
                  {cat.name}
                </span>
              ))}
            </div>

            <div className="text-xs text-gold">
              {brand.slug}
            </div>
          </motion.div>
        ))
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black-light border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gold/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-cream">
              {editingBrand
                ? "تعديل البراند"
                : "إضافة براند جديد"}
            </h2>

            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="text-gold-muted hover:text-gold"
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >
            <div>
              <label className="block text-sm text-gold-light mb-4">
                اسم البراند
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-"),
                  })
                }
                className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
              />
            </div>

            <div>
              <label className="block text-sm text-gold-light mb-4">
                Slug
              </label>

              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value,
                  })
                }
                className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
              />
            </div>

            <div>
              <label className="block text-sm text-gold-light mb-4">
                الوصف
              </label>

              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
              />
            </div>

            <div>
              <label className="block text-sm text-gold-light mb-4">
                الفئات
              </label>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() =>
                      toggleCategory(category._id)
                    }
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.categories.includes(
                        category._id
                      )
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-gold-muted"
                    }`}
                  >
                    {formData.categories.includes(
                      category._id
                    ) && <Check size={14} />}

                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gold-light mb-4">
                اللوجو
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />

              {formData.logo && (
                <img
                  src={formData.logo}
                  alt="logo"
                  className="w-24 h-24 mt-4 rounded-xl object-cover"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold py-3"
            >
              {isSubmitting
                ? "جاري الحفظ..."
                : editingBrand
                ? "حفظ التعديلات"
                : "إضافة البراند"}
            </button>
          </form>
        </motion.div>
      </div>
    )}
  </div>
);
}