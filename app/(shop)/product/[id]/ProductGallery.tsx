"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  images: string[];
  name: string;
  discountPercentage?: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

/**
 * Interactive image gallery.
 *
 * The first image is also rendered by the server (see page.tsx) so the product
 * photo is in the initial HTML and is the LCP element; this component takes
 * over selection and zoom once hydrated.
 */
export function ProductGallery({
  images,
  name,
  discountPercentage,
  isNewArrival,
  isBestSeller,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const safeImages = images.length ? images : ["/images/placeholder.jpg"];
  const hasDiscount = (discountPercentage ?? 0) > 0;

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % safeImages.length);
  const prevImage = () =>
    setSelectedImage(
      (prev) => (prev - 1 + safeImages.length) % safeImages.length
    );

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-black-light cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <motion.div
          animate={{ scale: isZoomed ? 1.5 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <Image
            src={safeImages[selectedImage]}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="الصورة السابقة"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={nextImage}
              aria-label="الصورة التالية"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              خصم {discountPercentage}%
            </span>
          )}
          {isNewArrival && (
            <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              جديد
            </span>
          )}
          {isBestSeller && (
            <span className="bg-gold text-black text-sm font-bold px-3 py-1.5 rounded-full">
              الأكثر مبيعاً
            </span>
          )}
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {safeImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              aria-label={`عرض الصورة ${index + 1} من ${safeImages.length}`}
              className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedImage === index
                  ? "border-gold shadow-gold-sm"
                  : "border-transparent hover:border-gold/30"
              }`}
            >
              <Image
                src={image}
                alt={`${name} - صورة ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
