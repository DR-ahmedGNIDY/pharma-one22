"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

interface ContentPageProps {
  slug: string;
  icon: LucideIcon;
  tagline: string;
  fallbackTitle: string;
}

export function ContentPage({ slug, icon: Icon, tagline, fallbackTitle }: ContentPageProps) {
  const [title, setTitle] = useState(fallbackTitle);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.page) {
          setTitle(data.page.title || fallbackTitle);
          setContent(data.page.content || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, fallbackTitle]);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Icon className="text-gold" size={32} />
          </div>
          <span className="text-gold text-sm font-medium tracking-wider mb-2 block">
            {tagline}
          </span>
          <h1 className="text-4xl font-bold text-cream mb-4">{title}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="luxury-card p-8"
        >
          {loading ? (
            <p className="text-gold-muted">جاري التحميل...</p>
          ) : (
            <MarkdownContent content={content} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
