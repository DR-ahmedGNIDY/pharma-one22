"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

interface BrandsSectionProps {
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
}

export function BrandsSection({
  selectedBrand,
  onSelectBrand,
}: BrandsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const res = await fetch("/api/brands");

      const data = await res.json();

      if (data.success) {
        setBrands(data.brands || []);
      }
    } catch (error) {
      console.error("LOAD BRANDS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-black border-b border-gold/10">
        <div className="container-luxury">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37]">
              جاري تحميل البراندات...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black border-b border-gold/10">
      <div className="container-luxury">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl">♛</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]">
            البراندات العالمية
          </h2>

          <p className="text-[#D4AF37]/80 text-lg">
            {brands.length} براند متاح
          </p>
        </div>

        {brands.length > 0 && (
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="shrink-0"
            >
              <div
                onClick={() =>
                  onSelectBrand(
                    selectedBrand === brand.slug
                      ? null
                      : brand.slug
                  )
                }
                className="cursor-pointer"
              >
                <div
                  className={`
                    w-[150px]
                    h-[150px]
                    rounded-3xl
                    flex
                    items-center
                    justify-center
                    p-5
                    transition-all
                    duration-500

                    ${
                      selectedBrand === brand.slug
                        ? `
                          bg-gradient-to-b
                          from-[#2a2110]
                          to-[#0B0B0B]
                          border
                          border-[#D4AF37]
                          shadow-[0_0_35px_rgba(212,175,55,0.45)]
                          scale-105
                        `
                        : `
                          bg-gradient-to-b
                          from-[#181818]
                          to-[#0B0B0B]
                          border
                          border-[#D4AF37]/20
                          hover:border-[#D4AF37]
                          hover:-translate-y-2
                          hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]
                        `
                    }
                  `}
                >
                  <span
                    className="
                      text-[#D4AF37]
                      font-bold
                      text-lg
                      tracking-wide
                      text-center
                      drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]
                    "
                  >
                    {brand.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#D4AF37]/70">
              لا توجد براندات مضافة حالياً
            </p>
          </div>
        )}
      </div>
    </section>
  );
}