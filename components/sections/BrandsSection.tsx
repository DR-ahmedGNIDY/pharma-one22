"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
}

interface BrandsSectionProps {
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
}

const CARD_WIDTH = 150;
const CARD_GAP = 20; // gap-5
const AUTO_SPEED = 40; // px per second
const COPIES = 4;
const RESUME_DELAY = 1600; // ms after manual interaction before auto-scroll resumes

export function BrandsSection({
  selectedBrand,
  onSelectBrand,
}: BrandsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setWidthRef = useRef(0);

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

  useEffect(() => {
    if (brands.length === 0) return;

    const setWidth = brands.length * (CARD_WIDTH + CARD_GAP);
    setWidthRef.current = setWidth;
    offsetRef.current = -setWidth;
    lastTimeRef.current = null;

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
    }

    const tick = (time: number) => {
      // Always reschedule first — any error below must never permanently
      // kill the loop (a dead loop silently freezes the marquee forever).
      rafRef.current = requestAnimationFrame(tick);

      try {
        if (lastTimeRef.current === null) lastTimeRef.current = time;
        // Clamp delta so a throttled/backgrounded tab can't produce a huge
        // single-frame jump when it regains focus.
        const delta = Math.min(time - lastTimeRef.current, 200);
        lastTimeRef.current = time;

        if (!pausedRef.current && setWidthRef.current > 0) {
          offsetRef.current += (AUTO_SPEED * delta) / 1000;

          // Modulo-safe wrap: works even after a large jump, not just a
          // single-setWidth step.
          if (offsetRef.current >= 0) {
            offsetRef.current =
              (offsetRef.current % setWidthRef.current) - setWidthRef.current;
          }

          if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
          }
        }
      } catch (error) {
        console.error("BRANDS MARQUEE TICK ERROR:", error);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [brands]);

  const pauseTemporarily = useCallback(() => {
    pausedRef.current = true;

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (setWidthRef.current === 0) return;

    pauseTemporarily();

    const step = 350;
    offsetRef.current += direction === "right" ? step : -step;

    if (offsetRef.current >= 0 || offsetRef.current <= -setWidthRef.current) {
      const width = setWidthRef.current;
      offsetRef.current = ((offsetRef.current % width) + width) % width - width;
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      trackRef.current.style.transition = "transform 0.4s ease";
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "";
      }, 400);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-black border-b border-gold/10">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#D4AF37] text-2xl">♛</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]">
              البراندات العالمية
            </h2>
          </div>

          <div className="flex justify-center gap-5 overflow-hidden pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[150px] h-[150px] rounded-3xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const loopedBrands =
    brands.length > 0
      ? Array.from({ length: COPIES }).flatMap(() => brands)
      : [];

  return (
    <section className="py-16 bg-black border-b border-gold/10">
      <div className="container-luxury">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl">♛</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]">
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
              aria-label="التمرير لليمين"
              className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={() => scroll("left")}
              aria-label="التمرير لليسار"
              className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <div
          dir="ltr"
          className="overflow-hidden pb-4"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
            pausedRef.current = false;
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-5 w-max will-change-transform"
          >
            {loopedBrands.map((brand, index) => (
              <motion.div
                key={`${brand._id}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % brands.length) * 0.04 }}
                className="shrink-0"
              >
                <div
                  onClick={() =>
                    onSelectBrand(
                      selectedBrand === brand.slug ? null : brand.slug
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
                    <div className="relative w-full h-full">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes="150px"
                        className="object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
