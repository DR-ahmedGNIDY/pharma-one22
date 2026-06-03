"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Percent, Sparkles, Truck } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "عروض حصرية",
    subtitle: "خصومات تصل حتى",
    discount: "50%",
    description: "خصومات تصل حتى 50% على منتجات مختارة",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
    cta: "تسوقي الآن",
    link: "/offers",
    icon: Percent,
  },
  {
    id: 2,
    title: "وصل حديثاً",
    subtitle: "اكتشفي أحدث",
    discount: "المنتجات",
    description: "أحدث المنتجات العالمية وصلت متجرنا",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    cta: "اكتشفي الآن",
    link: "/shop?new=true",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "عناية متكاملة",
    subtitle: "روتينك اليومي",
    discount: "للبشرة",
    description: "روتينك اليومي لبشرة صحية ومشرقة",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    cta: "اكتشفي الآن",
    link: "/shop?category=skincare",
    icon: Truck,
  },
];

export function OffersSection() {
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
          <h2 className="text-3xl md:text-5xl font-bold text-cream mb-4">عروض مميزة</h2>
          <p className="text-lg text-gold-muted">لا تفوتي فرصة الحصول على أفضل الأسعار</p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={offer.link}
                className="group relative block overflow-hidden rounded-xl h-[280px]"
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="mb-auto pt-4">
                    <div className="w-8 h-8 rounded-full bg-gold/15 backdrop-blur-sm flex items-center justify-center">
                      <offer.icon className="text-gold" size={16} />
                    </div>
                  </div>

                  <p className="text-gold-light/70 text-lg mb-4">{offer.subtitle}</p>
                  <h3 className="text-2xl font-bold text-cream mb-4">{offer.title}</h3>
                  <p className="text-gold text-4xl md:text-7xl font-bold mb-4 gold-text">{offer.discount}</p>
                  <p className="text-gold-muted text-lg mb-4 line-clamp-2">{offer.description}</p>

                  <div className="flex items-center gap-2 text-gold text-lg group-hover:gap-3 transition-all">
                    <span className="font-medium">{offer.cta}</span>
                    <ArrowLeft size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
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
