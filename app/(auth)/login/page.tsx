"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        toast.success("تم تسجيل الدخول بنجاح!");
        router.push("/admin");
        router.refresh();
      }
    } catch {
      toast.error("حدث خطأ ما. حاولي مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl">
        <div className="luxury-card overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Image Side */}
            <div className="relative hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80"
                alt="Luxury Cosmetics"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 right-0 p-8">
                <h2 className="text-3xl font-bold gold-text mb-2">مرحباً بعودتك</h2>
                <p className="text-gold-light/80">
                  سجلي الدخول للوصول إلى حسابك ومتابعة طلباتك
                </p>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-8 md:p-12">
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
                  <h1 className="text-2xl font-bold text-cream mb-2">
                    تسجيل الدخول
                  </h1>
                  <p className="text-sm text-gold-muted">
                    أدخلي بياناتك للوصول إلى حسابك
                  </p>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 rounded-xl border border-gold/20 text-cream flex items-center justify-center gap-3 hover:bg-gold/5 transition-colors mb-6"
                >
                  <Chrome size={20} className="text-gold" />
                  <span className="text-sm">الدخول بحساب Google</span>
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gold/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-black-light text-gold-muted">
                      أو الدخول بالبريد الإلكتروني
                    </span>
                  </div>
                </div>

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

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gold-muted cursor-pointer">
                      <input type="checkbox" className="rounded border-gold/20 bg-black text-gold focus:ring-gold" />
                      <span>تذكرني</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-gold hover:text-gold-light transition-colors"
                    >
                      نسيتي كلمة المرور؟
                    </Link>
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
                        <span>تسجيل الدخول</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-gold-muted mt-6">
                  ليس لديك حساب؟{" "}
                  <Link
                    href="/register"
                    className="text-gold hover:text-gold-light font-medium transition-colors"
                  >
                    سجلي الآن
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
