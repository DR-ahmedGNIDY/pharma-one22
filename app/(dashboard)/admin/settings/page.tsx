"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  FileText,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  snapchat: string;
  twitter: string;
  youtube: string;
}

interface SettingsForm {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  address: string;
  socialLinks: SocialLinks;
  shippingCost: number;
  freeShippingThreshold: number;
  taxRate: number;
  currency: string;
  metaTitle: string;
  metaDescription: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface PageForm {
  title: string;
  content: string;
  faqs?: FaqItem[];
}

const PAGES: { slug: string; label: string }[] = [
  { slug: "about", label: "من نحن" },
  { slug: "privacy", label: "سياسة الخصوصية" },
  { slug: "terms", label: "الشروط والأحكام" },
  { slug: "return-policy", label: "سياسة الاسترجاع" },
  { slug: "faq", label: "الأسئلة الشائعة" },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<"general" | "pages">("general");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SettingsForm | null>(null);

  const [activePage, setActivePage] = useState("about");
  const [pageForm, setPageForm] = useState<PageForm | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (tab === "pages") {
      loadPage(activePage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, activePage]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.success) {
        setForm({
          siteName: data.settings.siteName || "",
          contactEmail: data.settings.contactEmail || "",
          contactPhone: data.settings.contactPhone || "",
          whatsappNumber: data.settings.whatsappNumber || "",
          whatsappMessage: data.settings.whatsappMessage || "",
          address: data.settings.address || "",
          socialLinks: {
            facebook: data.settings.socialLinks?.facebook || "",
            instagram: data.settings.socialLinks?.instagram || "",
            tiktok: data.settings.socialLinks?.tiktok || "",
            snapchat: data.settings.socialLinks?.snapchat || "",
            twitter: data.settings.socialLinks?.twitter || "",
            youtube: data.settings.socialLinks?.youtube || "",
          },
          shippingCost: data.settings.shippingCost ?? 0,
          freeShippingThreshold: data.settings.freeShippingThreshold ?? 0,
          taxRate: data.settings.taxRate ?? 0,
          currency: data.settings.currency || "EGP",
          metaTitle: data.settings.metaTitle || "",
          metaDescription: data.settings.metaDescription || "",
        });
      } else {
        toast.error("فشل تحميل الإعدادات");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (slug: string) => {
    try {
      setPageLoading(true);
      const res = await fetch(`/api/pages/${slug}`);
      const data = await res.json();

      if (data.success) {
        setPageForm({
          title: data.page.title || "",
          content: data.page.content || "",
          faqs: data.page.faqs || [],
        });
      } else {
        toast.error("فشل تحميل الصفحة");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحميل الصفحة");
    } finally {
      setPageLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!form) return;

    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل حفظ الإعدادات");
        return;
      }

      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePage = async () => {
    if (!pageForm) return;

    try {
      setPageSaving(true);
      const res = await fetch(`/api/pages/${activePage}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageForm),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "فشل حفظ الصفحة");
        return;
      }

      toast.success("تم حفظ الصفحة بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setPageSaving(false);
    }
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    if (!pageForm) return;
    const faqs = [...(pageForm.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    setPageForm({ ...pageForm, faqs });
  };

  const addFaq = () => {
    if (!pageForm) return;
    setPageForm({
      ...pageForm,
      faqs: [...(pageForm.faqs || []), { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    if (!pageForm) return;
    setPageForm({
      ...pageForm,
      faqs: (pageForm.faqs || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-cream mb-1">الإعدادات</h1>
        <p className="text-gold-muted">إدارة بيانات المتجر وروابط السوشيال ميديا ومحتوى الصفحات</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gold/10">
        <button
          onClick={() => setTab("general")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
            tab === "general"
              ? "border-gold text-gold"
              : "border-transparent text-gold-muted hover:text-gold"
          }`}
        >
          <SettingsIcon size={16} />
          إعدادات عامة
        </button>
        <button
          onClick={() => setTab("pages")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
            tab === "pages"
              ? "border-gold text-gold"
              : "border-transparent text-gold-muted hover:text-gold"
          }`}
        >
          <FileText size={16} />
          محتوى الصفحات
        </button>
      </div>

      {tab === "general" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {loading || !form ? (
            <div className="text-gold">جاري التحميل...</div>
          ) : (
            <>
              <div className="luxury-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-cream mb-2">بيانات التواصل</h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gold-light mb-2">اسم المتجر</label>
                    <input
                      type="text"
                      value={form.siteName}
                      onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">رقم الهاتف</label>
                    <input
                      type="text"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">رقم الواتساب</label>
                    <input
                      type="text"
                      value={form.whatsappNumber}
                      onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gold-light mb-2">رسالة الواتساب الافتراضية</label>
                    <input
                      type="text"
                      value={form.whatsappMessage}
                      onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gold-light mb-2">العنوان</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>
                </div>
              </div>

              <div className="luxury-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-cream mb-2">روابط السوشيال ميديا</h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gold-light mb-2">
                      <Facebook size={14} /> فيسبوك
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={form.socialLinks.facebook}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, facebook: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/40"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gold-light mb-2">
                      <Instagram size={14} /> إنستجرام
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={form.socialLinks.instagram}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, instagram: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/40"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gold-light mb-2">
                      <Twitter size={14} /> تويتر / X
                    </label>
                    <input
                      type="url"
                      placeholder="https://x.com/..."
                      value={form.socialLinks.twitter}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, twitter: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/40"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-gold-light mb-2">
                      <Youtube size={14} /> يوتيوب
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={form.socialLinks.youtube}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, youtube: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">تيك توك</label>
                    <input
                      type="url"
                      placeholder="https://tiktok.com/@..."
                      value={form.socialLinks.tiktok}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, tiktok: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">سناب شات</label>
                    <input
                      type="url"
                      placeholder="https://snapchat.com/add/..."
                      value={form.socialLinks.snapchat}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: { ...form.socialLinks, snapchat: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/40"
                    />
                  </div>
                </div>
              </div>

              <div className="luxury-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-cream mb-2">الشحن والضريبة</h2>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm text-gold-light mb-2">تكلفة الشحن</label>
                    <input
                      type="number"
                      value={form.shippingCost}
                      onChange={(e) =>
                        setForm({ ...form, shippingCost: Number(e.target.value) })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">
                      حد الشحن المجاني
                    </label>
                    <input
                      type="number"
                      value={form.freeShippingThreshold}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          freeShippingThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">نسبة الضريبة %</label>
                    <input
                      type="number"
                      value={form.taxRate}
                      onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>
                </div>
              </div>

              <div className="luxury-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-cream mb-2">SEO</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gold-light mb-2">عنوان الميتا</label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">وصف الميتا</label>
                    <textarea
                      rows={3}
                      value={form.metaDescription}
                      onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="btn-gold flex items-center gap-2 px-8 py-3"
              >
                <Save size={18} />
                {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
              </button>
            </>
          )}
        </motion.div>
      )}

      {tab === "pages" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap gap-2">
            {PAGES.map((p) => (
              <button
                key={p.slug}
                onClick={() => setActivePage(p.slug)}
                className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                  activePage === p.slug
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gold/20 text-gold-muted hover:text-gold"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {pageLoading || !pageForm ? (
            <div className="text-gold">جاري التحميل...</div>
          ) : (
            <div className="luxury-card p-6 space-y-5">
              <div>
                <label className="block text-sm text-gold-light mb-2">عنوان الصفحة</label>
                <input
                  type="text"
                  value={pageForm.title}
                  onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream"
                />
              </div>

              {activePage === "faq" ? (
                <div className="space-y-4">
                  <label className="block text-sm text-gold-light">الأسئلة والأجوبة</label>

                  {(pageForm.faqs || []).map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gold/10 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="السؤال"
                          value={faq.question}
                          onChange={(e) => updateFaq(index, "question", e.target.value)}
                          className="flex-1 bg-black border border-gold/20 rounded-xl py-2 px-3 text-cream"
                        />
                        <button
                          onClick={() => removeFaq(index)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <textarea
                        placeholder="الإجابة"
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                        className="w-full bg-black border border-gold/20 rounded-xl py-2 px-3 text-cream"
                      />
                    </div>
                  ))}

                  <button
                    onClick={addFaq}
                    className="flex items-center gap-2 text-sm text-gold hover:opacity-80"
                  >
                    <Plus size={16} /> إضافة سؤال جديد
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gold-light mb-2">محتوى الصفحة</label>
                  <textarea
                    rows={14}
                    value={pageForm.content}
                    onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream leading-relaxed"
                  />
                </div>
              )}

              <button
                onClick={handleSavePage}
                disabled={pageSaving}
                className="btn-gold flex items-center gap-2 px-8 py-3"
              >
                <Save size={18} />
                {pageSaving ? "جاري الحفظ..." : "حفظ الصفحة"}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
