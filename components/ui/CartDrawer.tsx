"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/hooks/useStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.getTotalPrice)();
  const totalItems = useCartStore((state) => state.getTotalItems)();

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="فتح سلة التسوق"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-shadow"
      >
        <ShoppingBag size={22} className="text-black" />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-black-light z-50 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <h2 className="text-xl font-bold gold-text">سلة التسوق</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="إغلاق السلة"
                  className="p-2 text-gold-muted hover:text-gold transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={64} className="text-gold/20 mb-4" />
                    <p className="text-gold-muted text-lg mb-4">سلة التسوق فارغة</p>
                    <p className="text-gold-muted/60 text-sm mb-6">
                      ابدئي التسوق واكتشفي منتجاتنا المميزة
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="btn-outline-gold"
                    >
                      استكشفي المنتجات
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 p-4 bg-black rounded-xl border border-gold/10"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.product.images[0] || "/images/placeholder.jpg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-cream line-clamp-2 mb-4">
                            {item.product.name}
                          </h4>
                          <p className="text-gold text-sm font-bold mb-4">
                            {formatPrice(item.product.discountPrice || item.product.price)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product._id, item.quantity - 1)
                                }
                                aria-label="إنقاص الكمية"
                                className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product._id, item.quantity + 1)
                                }
                                aria-label="زيادة الكمية"
                                className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product._id)}
                              aria-label="حذف من السلة"
                              className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gold/10 bg-black">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-muted">المجموع الفرعي</span>
                      <span className="text-cream">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-muted">الشحن</span>
                      <span className="text-gold">مجاني</span>
                    </div>
                    <div className="border-t border-gold/10 pt-3 flex justify-between">
                      <span className="font-bold text-cream">الإجمالي</span>
                      <span className="font-bold text-gold text-lg">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="btn-gold w-full flex items-center justify-center gap-2"
                  >
                    <span>إتمام الطلب</span>
                    <ArrowRight size={18} />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-sm text-gold-muted hover:text-gold mt-3 transition-colors"
                  >
                    مواصلة التسوق
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
