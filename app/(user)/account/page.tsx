"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronLeft,
  Package,
  Truck,
  Check,
  Clock,
} from "lucide-react";

const sidebarLinks = [
  { name: "حسابي", href: "/account", icon: User },
  { name: "طلباتي", href: "/account/orders", icon: ShoppingBag },
  { name: "المفضلة", href: "/wishlist", icon: Heart },
  { name: "العناوين", href: "/account/addresses", icon: MapPin },
  { name: "الإعدادات", href: "/account/settings", icon: Settings },
];

const recentOrders = [
  { id: "PO-123456", date: "2024-12-20", total: 1850, status: "delivered", items: 3 },
  { id: "PO-123457", date: "2024-12-15", total: 2750, status: "shipped", items: 5 },
  { id: "PO-123458", date: "2024-12-10", total: 950, status: "processing", items: 2 },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="luxury-card p-6 sticky top-32">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <User className="text-gold" size={32} />
                </div>
                <h2 className="font-bold text-cream">سارة أحمد</h2>
                <p className="text-sm text-gold-muted">sara@email.com</p>
              </div>

              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold-muted hover:text-gold hover:bg-gold/5 transition-all"
                  >
                    <link.icon size={18} />
                    <span className="text-sm">{link.name}</span>
                    <ChevronLeft size={14} className="mr-auto" />
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gold/10">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all w-full">
                  <LogOut size={18} />
                  <span className="text-sm">تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "إجمالي الطلبات", value: "12", icon: ShoppingBag },
                { label: "الطلبات المكتملة", value: "10", icon: Check },
                { label: "قيد الشحن", value: "1", icon: Truck },
                { label: "المفضلة", value: "8", icon: Heart },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="luxury-card p-5 text-center"
                >
                  <stat.icon className="text-gold mx-auto mb-4" size={24} />
                  <p className="text-2xl font-bold text-cream">{stat.value}</p>
                  <p className="text-xs text-gold-muted">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="luxury-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-cream">آخر الطلبات</h2>
                <Link href="/account/orders" className="text-sm text-gold hover:text-gold-light">
                  مشاهدة الكل
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-black rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        order.status === "delivered"
                          ? "bg-green-500/20"
                          : order.status === "shipped"
                          ? "bg-purple-500/20"
                          : "bg-yellow-500/20"
                      }`}>
                        {order.status === "delivered" ? (
                          <Check size={18} className="text-green-400" />
                        ) : order.status === "shipped" ? (
                          <Truck size={18} className="text-purple-400" />
                        ) : (
                          <Clock size={18} className="text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-cream font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-gold-muted">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-bold">{order.total} ج.م</p>
                      <p className="text-xs text-gold-muted">{order.items} منتج</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
