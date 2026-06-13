"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Chrome } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ ما");
      }

      toast.success("تم إنشاء الحساب بنجاح!");

      // Auto login
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ ما. حاولي مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl">
        <div className="luxury-card overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Image Side */}
            <div className="relative hidden md:block order-2">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
                alt="Luxury Cosmetics"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold gold-text mb-2">انضمي إلينا</h2>
                <p className="text-gold-light/80">
                  أنشئي حسابك الآن واستمتعي بتجربة تسوق فاخرة
                </p>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-8 md:p-12 order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                  <h1 className="text-2xl font-bold text-cream mb-1">
                    إنشاء حساب جديد
                  </h1>
                  <p className="text-sm text-gold-muted">
                    أنشئي حسابك للاستمتاع بمزايا حصرية
                  </p>
                </div>

                {/* Google Sign Up */}
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full py-3 px-4 rounded-xl border border-gold/20 text-cream flex items-center justify-center gap-3 hover:bg-gold/5 transition-colors mb-6"
                >
                  <Chrome size={20} className="text-gold" />
                  <span className="text-sm">التسجيل بحساب Google</span>
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gold/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-black-light text-gold-muted">
                      أو التسجيل بالبريد الإلكتروني
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gold-light mb-2">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <User
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                        size={18}
                      />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="الاسم الكامل"
                        className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    </div>
                  </div>

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
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="example@email.com"
                        className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">
                      رقم الهاتف
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                        size={18}
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+20 1XX XXX XXXX"
                        className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-12 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted hover:text-gold"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gold-light mb-2">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full bg-black border border-gold/20 rounded-xl py-3 pr-12 pl-4 text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      required
                      className="rounded border-gold/20 bg-black text-gold focus:ring-gold"
                    />
                    <span className="text-gold-muted">
                      أوافق على{" "}
                      <Link href="/terms" className="text-gold hover:underline">
                        الشروط والأحكام
                      </Link>{" "}
                      و{" "}
                      <Link href="/privacy" className="text-gold hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </span>
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
                        <span>إنشاء الحساب</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-gold-muted mt-6">
                  لديك حساب بالفعل؟{" "}
                  <Link
                    href="/login"
                    className="text-gold hover:text-gold-light font-medium transition-colors"
                  >
                    سجلي الدخول
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
