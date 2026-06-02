"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Palette,
  Droplets,
  Wind,
  SprayCan,
  Hand,
  Scissors,
  Gift,
} from "lucide-react";

const categories = [
  {
    id: "makeup",
    name: "المكياج",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80",
    count: 2500,
  },
  {
    id: "skincare",
    name: "العناية بالبشرة",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80",
    count: 1800,
  },
  {
    id: "haircare",
    name: "العناية بالشعر",
    icon: Wind,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&q=80",
    count: 1200,
  },
  {
    id: "perfumes",
    name: "العطور",
    icon: SprayCan,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80",
    count: 900,
  },
  {
    id: "bodycare",
    name: "العناية بالجسم",
    icon: Hand,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&q=80",
    count: 800,
  },
  {
    id: "tools",
    name: "الأدوات",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
    count: 600,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-10 bg-[#0a0a0a]">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-cream mb-4">تسوقي حسب الفئة</h2>
          <p className="text-lg text-gold-muted">اكتشفي مجموعتنا الواسعة</p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/shop?category=${category.id}`}
                className="group relative block overflow-hidden rounded-xl aspect-[4/5]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />

                <div className="absolute inset-0 flex flex-col items-center justify-end p-3 pb-4">
                  <div className="w-9 h-9 rounded-full bg-gold/15 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-gold/25 transition-colors">
                    <category.icon className="text-gold" size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-cream group-hover:text-gold-light transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-gold-muted mt-0.5">
                    {category.count.toLocaleString("ar-EG")} منتج
                  </p>
                </div>

                <div className="absolute inset-0 border border-transparent group-hover:border-gold/25 rounded-xl transition-colors duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
