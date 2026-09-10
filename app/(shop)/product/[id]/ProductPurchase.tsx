"use client";

import { useState } from "react";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { formatPrice, createWhatsAppLink } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/hooks/useStore";
import toast from "react-hot-toast";

interface Props {
  product: any;
}

/**
 * Everything on the product page that needs browser state: quantity, cart,
 * wishlist and share. Product data arrives as a prop from the server component
 * — this component never fetches.
 */
export function ProductPurchase({ product }: Props) {
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product._id)
  );

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`تمت إضافة ${quantity} قطعة إلى السلة!`);
  };

  const handleWhatsAppOrder = () => {
    const message = `مرحبًا، أريد طلب المنتج التالي:
${product.name}
الكمية: ${quantity}
السعر: ${formatPrice((product.discountPrice || product.price) * quantity)}
رابط المنتج: ${window.location.origin}/product/${product._id}`;
    window.open(createWhatsAppLink("+201022262971", message), "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ رابط المنتج!");
    } catch {
      /* user dismissed the share sheet — nothing to report */
    }
  };

  return (
    <>
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-gold-light font-medium">الكمية:</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="إنقاص الكمية"
            className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
          >
            <Minus size={16} />
          </button>
          <span className="text-xl font-bold text-cream w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(Math.max(product.stock, 1), quantity + 1))
            }
            aria-label="زيادة الكمية"
            className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1 btn-gold py-4 flex items-center justify-center gap-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} />
          <span>{inStock ? "أضف إلى السلة" : "غير متوفر حالياً"}</span>
        </button>
        <button
          onClick={handleWhatsAppOrder}
          className="flex-1 py-4 px-6 rounded-full bg-green-600 text-white font-bold flex items-center justify-center gap-3 hover:bg-green-500 transition-all"
        >
          <Phone size={20} />
          <span>اطلبي عبر واتساب</span>
        </button>
      </div>

      {/* Wishlist & Share */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            toggleWishlist(product._id);
            toast.success(
              isInWishlist ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة!"
            );
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
            isInWishlist
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-gold/20 text-gold-muted hover:border-gold/40 hover:text-gold"
          }`}
        >
          <Heart size={18} className={isInWishlist ? "fill-red-400" : ""} />
          <span className="text-sm">
            {isInWishlist ? "في المفضلة" : "أضف إلى المفضلة"}
          </span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/20 text-gold-muted hover:border-gold/40 hover:text-gold transition-all"
        >
          <Share2 size={18} />
          <span className="text-sm">مشاركة</span>
        </button>
      </div>
    </>
  );
}
