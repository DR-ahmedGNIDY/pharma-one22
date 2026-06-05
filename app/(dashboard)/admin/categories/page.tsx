"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Image as ImageIcon } from "lucide-react";
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف الفئة؟")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل حذف الفئة");
        return;
      }

      toast.success("تم حذف الفئة بنجاح");

      setCategories((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحذف");
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
          <h1 className="text-3xl font-bold text-cream mb-4">الفئات</h1>
          <p className="text-gold-muted">إدارة فئات المتجر</p>
        </div>
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
          <div className="text-gold">جاري التحميل...</div>
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
                    <ImageIcon className="text-gold" size={24} />
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-cream mb-4">
                {category.name}
              </h3>

              <p className="text-gold-muted text-sm mb-3">
                {category.description || "لا يوجد وصف"}
              </p>

              <div className="text-xs text-gold">{category.slug}</div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
