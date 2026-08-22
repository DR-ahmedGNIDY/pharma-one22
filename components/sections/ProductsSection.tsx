"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

interface ProductsSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllLink: string;
  badge?: string;
}

export function ProductsSection({
  title,
  subtitle,
  products,
  viewAllLink,
  badge,
}: ProductsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 270;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 bg-[#0a0a0a]">
      <div className="container-luxury">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-cream">{title}</h2>
            <p className="text-lg md:text-xl text-gold-muted mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => scroll("right")}
                aria-label="التمرير لليمين"
                className="w-7 h-7 rounded-full border border-gold/15 flex items-center justify-center text-gold/60 hover:border-gold/40 hover:text-gold transition-all"
              >
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => scroll("left")}
                aria-label="التمرير لليسار"
                className="w-7 h-7 rounded-full border border-gold/15 flex items-center justify-center text-gold/60 hover:border-gold/40 hover:text-gold transition-all"
              >
                <ChevronLeft size={14} />
              </button>
            </div>
            <Link
              href={viewAllLink}
              className="hidden sm:flex items-center gap-2 text-lg text-gold hover:text-gold-light transition-colors"
            >
              <span>الكل</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Products Slider */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 min-h-[430px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.length === 0 &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[240px] aspect-[240/430] rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="shrink-0 w-[240px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
