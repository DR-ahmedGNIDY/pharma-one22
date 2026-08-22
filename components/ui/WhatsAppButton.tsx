"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { createWhatsAppLink } from "@/lib/utils";

export function WhatsAppButton() {
  const link = createWhatsAppLink(
    "+201022262971",
    "مرحبًا، أريد الاستفسار عن منتجات Pharma One Cosmetics"
  );

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow"
    >
      <Phone size={24} className="text-white" />
      <motion.span
        className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.a>
  );
}
