"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { createWhatsAppLink } from "@/lib/utils";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "الهاتف",
    content: "+20 102 226 2971",
    link: "tel:+201022262971",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    content: "support@pharmaone.com",
    link: "mailto:support@pharmaone.com",
  },
  {
    icon: MapPin,
    title: "العنوان",
    content: "سوهاج - شارع الجمهورية - ش ضيف الله - برج الحاج عبداللطيف",
    link: "#",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    content: "السبت - الخميس: 9 ص - 11 م",
    link: "#",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const whatsappLink = createWhatsAppLink(
    "+201022262971",
    "مرحبًا، أريد الاستفسار عن منتجات Pharma One Cosmetics"
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-wider mb-2 block">
            CONTACT US
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            تواصلي معنا
          </h1>
          <p className="text-gold-muted max-w-lg mx-auto">
            نحن هنا لمساعدتك. تواصلي معنا عبر أي من القنوات التالية
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.a
              key={info.title}
              href={info.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="luxury-card p-6 text-center group hover:border-gold/40 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                <info.icon className="text-gold" size={24} />
              </div>
              <h3 className="font-bold text-cream mb-2">{info.title}</h3>
              <p className="text-sm text-gold-muted">{info.content}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="luxury-card p-8"
          >
            <h2 className="text-2xl font-bold text-cream mb-6">أرسلي رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-3">الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-3">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gold-light mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gold-light mb-2">الموضوع</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream focus:outline-none focus:border-gold/50"
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="order">استفسار عن طلب</option>
                    <option value="product">استفسار عن منتج</option>
                    <option value="return">طلب استرجاع</option>
                    <option value="complaint">شكوى</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gold-light mb-2">الرسالة</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتبي رسالتك هنا..."
                  className="w-full bg-black border border-gold/20 rounded-xl py-3 px-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold py-4 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          </motion.div>

          {/* WhatsApp & Social */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* WhatsApp Card */}
            <div className="luxury-card p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-green-400" size={36} />
              </div>
              <h3 className="text-xl font-bold text-cream mb-3">تواصلي عبر واتساب</h3>
              <p className="text-gold-muted mb-6">
                رد سريع مباشر على استفساراتك
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-500 transition-colors"
              >
                <MessageCircle size={20} />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>

            {/* Social Media */}
            <div className="luxury-card p-8">
              <h3 className="text-xl font-bold text-cream mb-6 text-center">تابعينا على</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Instagram, name: "Instagram", color: "hover:bg-pink-500/20 hover:text-pink-400" },
                  { icon: Facebook, name: "Facebook", color: "hover:bg-blue-500/20 hover:text-blue-400" },
                  { icon: Twitter, name: "Twitter", color: "hover:bg-sky-500/20 hover:text-sky-400" },
                  { icon: Youtube, name: "Youtube", color: "hover:bg-red-500/20 hover:text-red-400" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className={`flex items-center gap-3 p-4 rounded-xl bg-black border border-gold/10 text-gold-muted transition-all ${social.color}`}
                  >
                    <social.icon size={20} />
                    <span className="text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
