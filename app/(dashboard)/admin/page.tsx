"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Users, DollarSign, Package } from "lucide-react";

type RecentOrder = { id: string; customer: string; total: number; status: string; date: string };
type TopProduct = { name: string; sales: number; revenue: number };

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const recentOrders: RecentOrder[] = [];
  const topProducts: TopProduct[] = [];

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) setProductsCount(data.products.length);
      })
      .catch(() => setProductsCount(0));
  }, []);

  const stats = [
    {
      title: "إجمالي المبيعات",
      value: "0 ج.م",
      icon: DollarSign,
    },
    {
      title: "الطلبات",
      value: "0",
      icon: ShoppingBag,
    },
    {
      title: "العملاء",
      value: "0",
      icon: Users,
    },
    {
      title: "المنتجات",
      value: productsCount === null ? "..." : productsCount.toLocaleString("ar-EG"),
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cream mb-1">لوحة التحكم</h1>
        <p className="text-gold-muted">نظرة عامة على أداء المتجر</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="luxury-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <stat.icon className="text-gold" size={24} />
              </div>
            </div>
            <h3 className="text-gold-muted text-sm mb-3">{stat.title}</h3>
            <p className="text-2xl font-bold text-cream">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cream">آخر الطلبات</h2>
            <button className="text-sm text-gold hover:text-gold-light transition-colors">
              مشاهدة الكل
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 && (
              <p className="text-gold-muted text-sm text-center py-6">لا توجد طلبات بعد</p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-black rounded-xl"
              >
                <div>
                  <p className="text-cream font-medium text-sm">{order.id}</p>
                  <p className="text-gold-muted text-xs">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold font-bold">{order.total} ج.م</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-500/20 text-green-400"
                      : order.status === "processing"
                      ? "bg-blue-500/20 text-blue-400"
                      : order.status === "shipped"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {order.status === "delivered" ? "تم التوصيل"
                      : order.status === "processing" ? "قيد المعالجة"
                      : order.status === "shipped" ? "تم الشحن"
                      : "معلق"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="luxury-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cream">المنتجات الأكثر مبيعاً</h2>
            <button className="text-sm text-gold hover:text-gold-light transition-colors">
              مشاهدة الكل
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 && (
              <p className="text-gold-muted text-sm text-center py-6">لا توجد بيانات مبيعات بعد</p>
            )}
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-cream text-sm font-medium">{product.name}</p>
                  <p className="text-gold-muted text-xs">{product.sales} مبيعة</p>
                </div>
                <div className="text-gold font-bold text-sm">
                  {product.revenue.toLocaleString("ar-EG")} ج.م
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
