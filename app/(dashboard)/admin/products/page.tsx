"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ProductForm {
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  stock: number;
  sku: string;
  description: string;
}

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    brand: "",
    category: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    sku: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.discountPrice > 0 && formData.discountPrice >= formData.price) {
      toast.error("سعر الخصم يجب أن يكون أقل من السعر الأصلي");
      return;
    }

    // Calculate discount percentage
    const discountPercentage = formData.discountPrice > 0
      ? Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)
      : 0;

    toast.success(`تم إضافة المنتج بنجاح! الخصم: ${discountPercentage}%`);
    setIsModalOpen(false);
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      sku: "",
      description: "",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream mb-1">المنتجات</h1>
          <p className="text-gold-muted">إدارة منتجات المتجر</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={18} />
          <span>إضافة منتج</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="luxury-card p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted" size={18} />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
            />
          </div>
          <select className="bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50">
            <option>كل الفئات</option>
            <option>المكياج</option>
            <option>العناية بالبشرة</option>
            <option>العطور</option>
          </select>
          <select className="bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50">
            <option>كل البراندات</option>
            <option>HUDA BEAUTY</option>
            <option>The Ordinary</option>
            <option>MAC</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="luxury-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">المنتج</th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">البراند</th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">السعر</th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">المخزون</th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">الحالة</th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gold/5 hover:bg-gold/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                      <ImageIcon className="text-gold" size={20} />
                    </div>
                    <div>
                      <p className="text-cream text-sm font-medium">The Ordinary Niacinamide</p>
                      <p className="text-gold-muted text-xs">SKU: TO-001</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-cream text-sm">The Ordinary</td>
                <td className="py-4 px-6">
                  <span className="text-gold font-bold">220 ج.م</span>
                  <span className="text-gold-muted text-xs line-through mr-2">275 ج.م</span>
                </td>
                <td className="py-4 px-6 text-cream text-sm">100</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                    نشط
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black-light border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gold/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cream">إضافة منتج جديد</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gold-muted hover:text-gold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">البراند</label>
                  <select
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  >
                    <option value="">اختر البراند</option>
                    <option value="huda-beauty">HUDA BEAUTY</option>
                    <option value="the-ordinary">The Ordinary</option>
                    <option value="mac">MAC</option>
                    <option value="loreal">L'Oréal</option>
                    <option value="dior">DIOR</option>
                    <option value="chanel">CHANEL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">الفئة</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  >
                    <option value="">اختر الفئة</option>
                    <option value="makeup">المكياج</option>
                    <option value="skincare">العناية بالبشرة</option>
                    <option value="perfumes">العطور</option>
                    <option value="haircare">العناية بالشعر</option>
                    <option value="bodycare">العناية بالجسم</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">السعر الأصلي</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">سعر الخصم (اختياري)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice || ""}
                    onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">المخزون</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              {/* Auto-calculated discount preview */}
              {formData.discountPrice > 0 && formData.price > 0 && (
                <div className="p-4 bg-gold/10 rounded-xl border border-gold/20">
                  <p className="text-sm text-gold">
                    نسبة الخصم المحسوبة: {" "}
                    <span className="font-bold">
                      {Math.round(((formData.price - formData.discountPrice) / formData.price) * 100)}%
                    </span>
                  </p>
                  {formData.discountPrice >= formData.price && (
                    <p className="text-sm text-red-400 mt-1">
                      ⚠️ سعر الخصم يجب أن يكون أقل من السعر الأصلي
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm text-gold-light mb-2">الوصف</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gold-light mb-2">صور المنتج</label>
                <div>
  <label className="block text-sm text-gold-light mb-2">
    صور المنتج
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
    onChange={(e) => {
      console.log("FILE SELECTED", e.target.files?.[0]);
    }}
  />
</div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-gold py-3">
                  حفظ المنتج
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gold/20 text-gold hover:bg-gold/5 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
