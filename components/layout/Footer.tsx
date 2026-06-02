"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
  Shield,
  Truck,
  Headphones,
  Gift,
  ChevronUp,
} from "lucide-react";
import { createWhatsAppLink } from "@/lib/utils";

const footerLinks = {
  "معلومات": [
    { name: "من نحن", href: "/about" },
    { name: "سياسة الخصوصية", href: "/privacy" },
    { name: "الشروط والأحكام", href: "/terms" },
    { name: "سياسة الاسترجاع", href: "/return-policy" },
    { name: "الأسئلة الشائعة", href: "/faq" },
  ],
  "خدمة العملاء": [
    { name: "تتبع الطلب", href: "/account/orders" },
    { name: "طرق الدفع", href: "/payment-methods" },
    { name: "الشحن والتوصيل", href: "/shipping" },
    { name: "الاسترجاع والاستبدال", href: "/return-policy" },
    { name: "تواصل معنا", href: "/contact" },
  ],
  "تواصل معنا": [
    { name: "+20 102 226 2971", href: "tel:+201022262971", icon: Phone },
    { name: "support@pharmaone.com", href: "mailto:support@pharmaone.com", icon: Mail },
    { name: "سوهاج - شارع الجمهورية", href: "#", icon: MapPin },
  ],
};

const features = [
  { icon: Gift, title: "منتجات أصلية 100%", desc: "جودة مضمونة" },
  { icon: Truck, title: "توصيل سريع", desc: "إلى جميع مناطق المملكة" },
  { icon: Shield, title: "دفع آمن", desc: "خيارات دفع متعددة" },
  { icon: Headphones, title: "دعم عملاء", desc: "متاح 24/7" },
];

export function Footer() {
  const whatsappLink = createWhatsAppLink(
    "+201022262971",
    "مرحبًا، أريد الاستفسار عن منتجات Pharma One Cosmetics"
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black-light border-t border-gold/10">
      {/* Features Bar */}
      <div className="border-b border-gold/10">
        <div className="container-luxury py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <feature.icon className="text-gold" size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-cream">{feature.title}</h4>
                  <p className="text-xs text-gold-muted">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container-luxury py-12">
        <div className="bg-gradient-to-r from-gold/10 to-transparent rounded-2xl p-8 md:p-12 border border-gold/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-2xl font-bold gold-text mb-4">
                اشتركي في نشرتنا البريدية
              </h3>
              <p className="text-gold-muted">
                واحصلي على أحدث العروض والمنتجات الجديدة
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="أدخلي بريدك الإلكتروني"
                className="flex-1 md:w-80 bg-black border border-gold/20 rounded-full py-3 px-6 text-sm text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
              />
              <button className="btn-gold whitespace-nowrap">اشتركي الآن</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14">
                <Image
                  src="/images/logo.png"
                  alt="Pharma One Cosmetics"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold gold-text">PHARMA ONE</h2>
                <p className="text-xs text-gold-muted tracking-[0.2em]">
                  COSMETICS
                </p>
              </div>
            </Link>
            <p className="text-gold-muted text-sm leading-relaxed mb-6 max-w-sm">
              وجهتك الأولى لأفضل منتجات التجميل العالمية. أكثر من 7000 منتج من
              أكثر من 100 براند عالمي موثوق.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-gold font-bold mb-4 text-sm">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gold-muted hover:text-gold transition-colors flex items-center gap-2"
                    >
                      {"icon" in link && link.icon && (
                        <link.icon size={14} />
                      )}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Copyright */}
      <div className="border-t border-gold/10">
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gold-muted">طرق الدفع:</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center">
                  <CreditCard size={14} className="text-gold" />
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] text-gold font-bold">
                  VISA
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] text-gold font-bold">
                  MAST
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] text-gold font-bold">
                  STC
                </div>
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] text-gold font-bold">
                  APPLE
                </div>
              </div>
            </div>
            <p className="text-xs text-gold-muted">
              جميع الحقوق محفوظة © 2024 Pharma One Cosmetics
            </p>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
