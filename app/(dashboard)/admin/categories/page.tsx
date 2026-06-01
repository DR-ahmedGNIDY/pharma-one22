"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل تحميل الفئات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل إضافة الفئة");
        return;
      }

      toast.success("تم إضافة الفئة بنجاح");

      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
      });

      setIsModalOpen(false);

      loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream mb-1">
            الفئات
          </h1>
          <p className="text-gold-muted">
            إدارة فئات المتجر
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={18} />
          <span>إضافة فئة</span>
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
            placeholder="البحث في الفئات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-gold">
            جاري التحميل...
          </div>
        ) : (
          filteredCategories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="luxury-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <ImageIcon
                      className="text-gold"
                      size={24}
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-gold/10 text-gold">
                    <Edit2 size={14} />
                  </button>

                  <button className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-cream mb-2">
                {category.name}
              </h3>

              <p className="text-gold-muted text-sm mb-3">
                {category.description || "لا يوجد وصف"}
              </p>

              <div className="text-xs text-gold">
                {category.slug}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black-light border border-gold/20 rounded-2xl w-full max-w-lg"
          >
            <div className="p-6 border-b border-gold/10">
              <h2 className="text-xl font-bold text-cream">
                إضافة فئة جديدة
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm text-gold-light mb-2">
                  اسم الفئة
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
                <label className="block text-sm text-gold-light mb-2">
                  Slug
                </label>

                <input
                  type="text"
                  required
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
                <label className="block text-sm text-gold-light mb-2">
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

              <button
                type="submit"
                className="w-full btn-gold py-3"
              >
                حفظ الفئة
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}