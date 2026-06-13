"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
{
id: 1,
title: "براندات التجميل العالمية",
subtitle: "YSL · DIOR · CHANEL",
description: "اكتشفي أرقي منتجات التجميل من جميع البراندات العالمية",
image: "/images/banners/panar5.webp",
cta: {
primary: "تسوقي الآن",
secondary: "اكتشفي المزيد",
},
link: {
primary: "/shop?category=perfumes",
secondary: "/brands",
},
},
{
id: 2,
title: "مكياج احترافي",
subtitle: "HUDA BEAUTY · MAC · DIOR",
description: ".أحدث صيحات المكياج من أشهر البراندات العالمية",
image: "/images/banners/panar2.webp",
cta: {
primary: "اكتشفي المجموعة",
secondary: "العروض",
},
link: {
primary: "/shop?category=makeup",
secondary: "/offers",
},
},
];

export function HeroSection() {
const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
const timer = setInterval(() => {
setCurrentSlide((prev) => (prev + 1) % slides.length);
}, 5000);


return () => clearInterval(timer);


}, []);

return (
  <section className="relative h-[70vh] md:h-[85vh] min-h-[550px] md:min-h-[650px] overflow-hidden">


  {/* Background */}
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      <Image
        src={slides[currentSlide].image}
        alt={slides[currentSlide].title}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
    </motion.div>
  </AnimatePresence>

  {/* Content */}
  <div className="relative z-10 h-full">
    <div className="container mx-auto px-4 sm:px-6 md:px-16 h-full flex items-center justify-center md:justify-start text-center md:text-right">

      <div className="w-full max-w-md md:max-w-2xl px-2 md:px-0">

        <motion.div
          key={currentSlide}
          dir="rtl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Subtitle */}
          <p className="text-gold text-sm tracking-[0.3em] mb-5 uppercase">
            {slides[currentSlide].subtitle}
          </p>

          {/* Title */}
          <h1 className="text-[42px] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4 md:mb-6">
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-xl text-white/80 leading-relaxed md:leading-loose mb-6 md:mb-10 max-w-full md:max-w-xl">
            {slides[currentSlide].description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 md:gap-5 w-full sm:w-auto">

            <Link
              href={slides[currentSlide].link.primary}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:scale-105 transition-all duration-300 text-center"
            >
              {slides[currentSlide].cta.primary}
            </Link>

            <Link
              href={slides[currentSlide].link.secondary}
              className="border border-yellow-500/40 text-white px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-yellow-500/10 transition-all duration-300 text-center"
            >
              {slides[currentSlide].cta.secondary}
            </Link>

          </div>

        </motion.div>

      </div>

    </div>
  </div>

  {/* Arrows */}
  <button
    onClick={() =>
      setCurrentSlide(
        (prev) => (prev - 1 + slides.length) % slides.length
      )
    }
    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-gold/20 flex items-center justify-center text-gold"
  >
    <ChevronLeft size={20} />
  </button>

  <button
    onClick={() =>
      setCurrentSlide(
        (prev) => (prev + 1) % slides.length
      )
    }
    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-gold/20 flex items-center justify-center text-gold"
  >
    <ChevronRight size={20} />
  </button>

  </section>
);
}
