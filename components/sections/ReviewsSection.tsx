"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "سارة أحمد",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    text: "أفضل متجر تجميل اشتريت منه! المنتجات أصلية 100% والتوصيل سريع جداً.",
    product: "The Ordinary Niacinamide",
  },
  {
    id: 2,
    name: "نور محمد",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    text: "خدمة عملاء ممتازة وسريعة في الرد. المنتجات وصلتني في نفس اليوم.",
    product: "MAC Matte Lipstick",
  },
  {
    id: 3,
    name: "فاطمة علي",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    rating: 4,
    text: "أسعار ممتازة مقارنة بالمحلات التانية. العروض الحصرية بتوفري كتير.",
    product: "CeraVe Moisturizing Cream",
  },
  {
    id: 4,
    name: "مريم خالد",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    text: "أول مرة أطلب منهم والصراحة تجربة رائعة. التغليف كان فاخر جداً.",
    product: "Estée Lauder Night Repair",
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-10 bg-[#0a0a0a]">
      <div className="container-luxury max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-cream mb-2">آراء عملائنا</h2>
          <p className="text-lg text-gold-muted">شاهدي ما تقوله عملائنا عن تجربة التسوق</p>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="luxury-card p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-5">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gold/20">
                    <Image
                      src={reviews[currentIndex].avatar}
                      alt={reviews[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-right">
                  <Quote className="text-gold/15 mb-2 mx-auto md:mx-0" size={24} />

                  <div className="flex items-center justify-center md:justify-start gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < reviews[currentIndex].rating
                            ? "text-gold fill-gold"
                            : "text-gold/20"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-cream/85 text-x1 leading-relaxed mb-4">
                    "{reviews[currentIndex].text}"
                  </p>

                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                    <span className="font-bold text-gold text-xl">
                      {reviews[currentIndex].name}
                    </span>
                    <span className="text-gold-muted text-lg">
                      | {reviews[currentIndex].product}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={prevReview}
              className="w-12 h-12 rounded-full border border-gold/15 flex items-center justify-center text-gold/60 hover:border-gold/40 hover:text-gold transition-all"
            >
              <ChevronRight size={22} />
            </button>

            <div className="flex gap-1.5">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-gold w-5"
                      : "bg-gold/20 w-1.5 hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-7 h-7 rounded-full border border-gold/15 flex items-center justify-center text-gold/60 hover:border-gold/40 hover:text-gold transition-all"
            >
              <ChevronLeft size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
