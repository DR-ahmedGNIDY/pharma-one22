"use client";

import { useEffect, useState } from "react";
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
  isOffer: boolean;
}

const defaultForm: ProductForm = {
  name: "",
  brand: "",
  category: "",
  price: 0,
  discountPrice: 0,
  stock: 0,
  sku: "",
  description: "",
  isOffer: false,
};

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState<ProductForm>(defaultForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [brandsRes, categoriesRes, productsRes] = await Promise.all([
        fetch("/api/brands"),
        fetch("/api/categories"),
        fetch("/api/products"),
      ]);

      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();
      const productsData = await productsRes.json();

      if (productsData.success) setProducts(productsData.products);
      if (brandsData.success) setBrands(brandsData.brands);
      if (categoriesData.success) setCategories(categoriesData.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(defaultForm);
    setImages([]);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      brand:
        typeof product.brand === "object"
          ? product.brand?._id
          : product.brand || "",
      category:
        typeof product.category === "object"
          ? product.category?._id
          : product.category || "",
      price: product.price || 0,
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 0,
      sku: product.sku || "",
      description: product.description || "",
      isOffer: product.isOffer ?? false,
    });
    setImages(product.images || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(defaultForm);
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        formData.discountPrice > 0 &&
        formData.discountPrice >= formData.price
      ) {
        toast.error("سعر الخصم يجب أن يكون أقل من السعر الأصلي");
        return;
      }

      const isEditing = !!editingProduct;
      const url = isEditing
        ? `/api/products/${editingProduct._id}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل حفظ المنتج");
        return;
      }

      toast.success(
        isEditing ? "تم تعديل المنتج بنجاح" : "تم حفظ المنتج بنجاح"
      );

      closeModal();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ المنتج");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف المنتج؟")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل حذف المنتج");
        return;
      }

      toast.success("تم حذف المنتج بنجاح");
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cream mb-3">المنتجات</h1>
          <p className="text-gold-muted">إدارة منتجات المتجر</p>
        </div>
        <button
          onClick={openAddModal}
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
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
            />
          </div>
          <select className="bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50">
            <option value="">كل الفئات</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select className="bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50">
            <option value="">كل البراندات</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="luxury-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">
                المنتج
              </th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">
                البراند
              </th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">
                السعر
              </th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">
                المخزون
              </th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">
                الحالة
              </th>
              <th className="text-right py-4 px-6 text-gold-muted text-sm font-medium">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gold-muted">
                  لا توجد منتجات
                </td>
              </tr>
            )}
            {filteredProducts.map((product: any, index: number) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gold/5 hover:bg-gold/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gold/10 overflow-hidden flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-gold" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-cream text-sm font-medium">
                        {product.name}
                      </p>
                      <p className="text-gold-muted text-xs">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6 text-cream text-sm">
                  {typeof product.brand === "object"
                    ? product.brand?.name
                    : product.brand}
                </td>

                <td className="py-4 px-6">
                  <span className="text-gold font-bold">
                    {product.discountPrice || product.price} ج.م
                  </span>
                  {product.discountPrice > 0 && (
                    <span className="text-gold-muted text-xs line-through mr-2">
                      {product.price} ج.م
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-cream text-sm">
                  {product.stock}
                </td>

                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      product.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {product.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black-light border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gold/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cream">
                {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gold-muted hover:text-gold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    البراند
                  </label>
                  <select
                    required
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
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
                    الفئة
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
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
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    السعر الأصلي
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    سعر الخصم (اختياري)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: Number(e.target.value),
                      })
                    }
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">
                    المخزون
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              {formData.discountPrice > 0 && formData.price > 0 && (
                <div className="p-4 bg-gold/10 rounded-xl border border-gold/20">
                  <p className="text-sm text-gold">
                    نسبة الخصم المحسوبة:{" "}
                    <span className="font-bold">
                      {Math.round(
                        ((formData.price - formData.discountPrice) /
                          formData.price) *
                          100
                      )}
                      %
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
                <label className="block text-sm text-gold-light mb-2">
                  الوصف
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>

              {/* Offers Toggle */}
              <div className="flex items-center justify-between p-4 bg-gold/5 rounded-xl border border-gold/20">
                <div>
                  <p className="text-sm font-medium text-cream">عروض</p>
                  <p className="text-xs text-gold-muted mt-0.5">
                    تفعيل هذا الخيار يجعل المنتج يظهر في قسم العروض
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isOffer: !formData.isOffer })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    formData.isOffer ? "bg-gold" : "bg-gold/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                      formData.isOffer ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gold-light mb-2">
                  صور المنتج
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = async () => {
                      try {
                        toast.loading("جاري رفع الصورة...", { id: "upload" });

                        const res = await fetch("/api/upload", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ image: reader.result }),
                        });

                        const data = await res.json();

                        if (data.success) {
                          setImages((prev) => [...prev, data.url]);
                          toast.success("تم رفع الصورة بنجاح", {
                            id: "upload",
                          });
                        } else {
                          toast.error("فشل رفع الصورة", { id: "upload" });
                        }
                      } catch {
                        toast.error(
                          "حدث خطأ أثناء الرفع محتمل ان حجم الصورة اكثر من 2 ميجا",
                          { id: "upload" }
                        );
                      }
                    };
                  }}
                />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-24 object-cover rounded-lg border border-gold/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-gold py-3">
                  {editingProduct ? "تعديل المنتج" : "حفظ المنتج"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
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
