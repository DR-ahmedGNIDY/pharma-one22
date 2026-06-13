"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);
    toast.success("تم إرسال رابط إعادة تعيين كلمة المرور!");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card p-8"
        >
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Image
                src="/images/logo1.webp"
                alt="Pharma One"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-cream mb-2">
              نسيتي كلمة المرور؟
            </h1>
            <p className="text-sm text-gold-muted">
              أدخلي بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-400" size={32} />
              </div>
              <h2 className="text-xl font-bold text-cream mb-2">تم الإرسال!</h2>
              <p className="text-gold-muted mb-6">
                تحققي من بريدك الإلكتروني واتبعي الرابط لإعادة تعيين كلمة المرور
              </p>
              <Link href="/login" className="btn-gold inline-flex items-center gap-2">
                <span>العودة لتسجيل الدخول</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gold-light mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>إرسال الرابط</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {!isSubmitted && (
            <p className="text-center text-sm text-gold-muted mt-6">
              تذكرتي كلمة المرور؟{" "}
              <Link
                href="/login"
                className="text-gold hover:text-gold-light font-medium transition-colors"
              >
                سجلي الدخول
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
