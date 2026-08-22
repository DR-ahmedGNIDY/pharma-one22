"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [title, setTitle] = useState("الأسئلة الشائعة");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/pages/faq")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.page) {
          setTitle(data.page.title || title);
          setFaqs(data.page.faqs || []);
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
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="text-gold" size={32} />
          </div>
          <span className="text-gold text-sm font-medium tracking-wider mb-2 block">
            FAQ
          </span>
          <h1 className="text-4xl font-bold text-cream mb-4">{title}</h1>
          <p className="text-gold-muted max-w-lg mx-auto">
            إليك إجابات على الأسئلة الأكثر شيوعاً. إذا لم تجدي إجابتك، تواصلي معنا
          </p>
        </motion.div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-gold-muted text-center">جاري التحميل...</p>
          ) : (
            faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="luxury-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-right"
                >
                  <span className="font-bold text-cream text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-gold" size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-gold/10 pt-4">
                          <p className="text-gold-muted leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
