"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Phone } from "lucide-react";
import Link from "next/link";
import { RichContent } from "@/components/shared/RichContent";

export default function ReturnPolicyPage() {
  const [title, setTitle] = useState("سياسة الاسترجاع والاستبدال");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages/return-policy")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.page) {
          setTitle(data.page.title || title);
          setContent(data.page.content || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-gold" size={32} />
          </div>
          <span className="text-gold text-sm font-medium tracking-wider mb-2 block">
            RETURN POLICY
          </span>
          <h1 className="text-4xl font-bold text-cream mb-4">{title}</h1>
          <p className="text-gold-muted max-w-lg mx-auto">
            نحن نضمن رضاكم التام. إليك تفاصيل سياسة الاسترجاع والاستبدال
          </p>
        </motion.div>

        {/* Main Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="luxury-card p-8 mb-10"
        >
          {loading ? (
            <p className="text-gold-muted">جاري التحميل...</p>
          ) : (
            <RichContent content={content} />
          )}
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="luxury-card p-8 text-center"
        >
          <h2 className="text-xl font-bold text-cream mb-4">هل تحتاجين مساعدة؟</h2>
          <p className="text-gold-muted mb-6">
            فريق خدمة العملاء جاهز لمساعدتك في أي استفسار
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="tel:+201022262971"
              className="btn-gold inline-flex items-center gap-2"
            >
              <Phone size={18} />
              <span>اتصلي بنا</span>
            </a>
            <Link
              href="/contact"
              className="btn-outline-gold inline-flex items-center gap-2"
            >
              <span>تواصلي معنا</span>
            </Link>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
