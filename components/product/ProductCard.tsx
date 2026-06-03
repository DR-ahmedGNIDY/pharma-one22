"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  MessageCircle,
} from "lucide-react";

import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/hooks/useStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export function ProductCard({
  product,
  showQuickView = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product._id)
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, 1);
    toast.success("تمت الإضافة إلى السلة بنجاح!");
  };


  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product._id);

    toast.success(
      isInWishlist
        ? "تمت الإزالة من المفضلة"
        : "تمت الإضافة إلى المفضلة!"
    );
  };


  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `
مرحبا 👋
أريد طلب هذا المنتج:

${product.name}

السعر: ${formatPrice(
  product.discountPrice || product.price
)}

رابط المنتج:
${window.location.origin}/product/${product.slug}
`;

    window.open(
      `https://wa.me/201022262971?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };


  const discountPercentage =
    product.discountPercentage || 0;

  const hasDiscount = discountPercentage > 0;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >

      <Link href={`/product/${product.slug}`}>

        <div
          className="luxury-card relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-t-2xl">

            <Image
              src={
                product.images[0] ||
                "/images/placeholder.jpg"
              }
              alt={product.name}
              fill
              className="
                object-cover
                transition-transform
                duration-700
                group-hover:scale-110
              "
            />


            {/* Hover */}
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              className="
                absolute
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
              "
            >

              {showQuickView && (
                <button
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/20
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-gold
                    hover:text-black
                  "
                >
                  <Eye size={18} />
                </button>
              )}

            </motion.div>


            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="
                absolute
                top-3
                left-3
                w-9
                h-9
                rounded-full
                bg-black/50
                flex
                items-center
                justify-center
              "
            >
              <Heart
                size={16}
                className={
                  isInWishlist
                    ? "text-red-500 fill-red-500"
                    : "text-white"
                }
              />
            </button>

          </div>


          {/* Info */}
          <div className="p-4">

            <p className="text-xs text-gold-muted mb-4">
              {typeof product.brand === "string"
                ? product.brand
                : product.brand.name}
            </p>


            <h3
              className="
                text-sm
                text-cream
                mb-4
                line-clamp-2
                group-hover:text-gold
              "
            >
              {product.name}
            </h3>


            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">

              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-gold fill-gold"
                      : "text-gold-muted"
                  }
                />
              ))}

              <span className="text-x1 text-gold-muted">
                ({product.reviewCount})
              </span>

            </div>


            {/* Price */}
            <div className="mb-4">

              <span className="text-x2 font-bold text-gold">

                {formatPrice(
                  product.discountPrice ||
                    product.price
                )}

              </span>

            </div>


            {/* Cart */}
            <button
              onClick={handleAddToCart}
              className="
                w-full
                py-2.5
                rounded-xl
                bg-gold/10
                text-gold
                flex
                justify-center
                gap-2
                hover:bg-gold
                hover:text-black
              "
            >
              <ShoppingCart size={16} />
              أضف إلى السلة
            </button>


            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppOrder}
              className="
                mt-2
                w-full
                py-2.5
                rounded-xl
                bg-[#25D366]
                text-white
                font-bold
                flex
                justify-center
                gap-2
                hover:shadow-[0_0_18px_rgba(37,211,102,0.5)]
              "
            >
              <MessageCircle size={16} />
              اطلب عبر واتساب
            </button>


          </div>

        </div>

      </Link>

    </motion.div>
  );
}