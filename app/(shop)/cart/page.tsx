"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Gift,
} from "lucide-react";
import { useCartStore } from "@/hooks/useStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice)();
  const discountedTotal = useCartStore((state) => state.getDiscountedTotal)();
  const totalItems = useCartStore((state) => state.getTotalItems)();

  const savings = discountedTotal - totalPrice;

  const handleWhatsAppCheckout = () => {
    const message = `
مرحباً 👋

أرغب في طلب المنتجات التالية:

${items
  .map(
    (item, index) => `
${index + 1}- ${item.product.name}

البراند:
${
  typeof item.product.brand === "string"
    ? item.product.brand
    : item.product.brand?.name || ""
}

الكمية: ${item.quantity}

السعر:
${formatPrice(
  (item.product.discountPrice || item.product.price) * item.quantity
)}

رابط المنتج:
${window.location.origin}/product/${item.product._id}
`
  )
  .join("\n")}

------------------------

إجمالي الطلب:
${formatPrice(totalPrice)}
`;

    window.open(
      `https://wa.me/201022262971?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container-luxury">
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <ShoppingBag size={80} className="mx-auto text-gold/20" />
            </motion.div>

            <h1 className="text-3xl font-bold text-cream mb-4">
              سلة التسوق فارغة
            </h1>

            <p className="text-gold-muted mb-8 max-w-md mx-auto">
              ابدئي التسوق واكتشفي منتجاتنا المميزة من أفضل البراندات العالمية
            </p>

            <Link
              href="/shop"
              className="btn-gold inline-flex items-center gap-2"
            >
              <span>استكشفي المنتجات</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        <h1 className="text-3xl font-bold text-cream mb-2">سلة التسوق</h1>

        <p className="text-gold-muted mb-8">
          {totalItems} منتج في السلة
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const price =
                item.product.discountPrice || item.product.price;

              const originalPrice = item.product.price;

              const itemTotal = price * item.quantity;

              const itemOriginalTotal =
                originalPrice * item.quantity;

              return (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="luxury-card p-6"
                >
                  <div className="flex gap-6">
                    <Link
                      href={`/product/${item.product._id}`}
                      className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0"
                    >
                      <Image
                        src={
                          item.product.images?.[0] ||
                          "/images/placeholder.jpg"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm text-gold-muted mb-1">
                            {typeof item.product.brand === "string"
                              ? item.product.brand
                              : item.product.brand?.name}
                          </p>

                          <Link
                            href={`/product/${item.product._id}`}
                            className="text-lg font-medium text-cream hover:text-gold transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                        </div>

                        <button
                          onClick={() => {
                            removeItem(item.product._id);
                            toast.success("تمت الإزالة من السلة");
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-gold">
                          {formatPrice(price)}
                        </span>

                        {item.product.discountPrice && (
                          <span className="text-sm text-gold-muted line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="text-lg font-bold text-cream w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-cream">
                            {formatPrice(itemTotal)}
                          </p>

                          {item.product.discountPrice && (
                            <p className="text-xs text-green-400">
                              وفري{" "}
                              {formatPrice(
                                itemOriginalTotal - itemTotal
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <button
              onClick={() => {
                clearCart();
                toast.success("تم إفراغ السلة");
              }}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              إفراغ السلة
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card p-6 sticky top-32">
              <h2 className="text-xl font-bold text-cream mb-6">
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gold-muted">
                    المجموع الفرعي
                  </span>
                  <span className="text-cream">
                    {formatPrice(discountedTotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gold-muted">الخصم</span>
                  <span className="text-green-400">
                    -{formatPrice(savings)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gold-muted">الشحن</span>
                  <span className="text-gold">مجاني</span>
                </div>

                <div className="border-t border-gold/10 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-cream">
                      الإجمالي
                    </span>

                    <span className="font-bold text-gold text-xl">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-400">
                    <Gift size={18} />
                    <span className="text-sm font-medium">
                      وفري {formatPrice(savings)} على هذا الطلب!
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-4 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 text-base hover:opacity-90 transition"
              >
                <span>اطلب عبر واتساب</span>
                <ArrowRight size={18} />
              </button>

              <Link
                href="/shop"
                className="w-full text-center text-sm text-gold-muted hover:text-gold mt-4 block transition-colors"
              >
                مواصلة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}