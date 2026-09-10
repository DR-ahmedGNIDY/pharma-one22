import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "عذراً، الصفحة التي تبحثين عنها غير متوفرة.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-lg">
        <p className="text-7xl md:text-8xl font-bold gold-text mb-6">404</p>

        <h1 className="text-2xl md:text-3xl font-bold text-cream mb-4">
          الصفحة غير موجودة
        </h1>

        <p className="text-gold-muted leading-relaxed mb-10">
          عذراً، الصفحة التي تبحثين عنها غير متوفرة أو تم نقلها. يمكنكِ العودة
          إلى الصفحة الرئيسية أو تصفح منتجاتنا.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-gold py-3 px-8">
            الصفحة الرئيسية
          </Link>
          <Link
            href="/shop"
            className="py-3 px-8 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            تصفحي المتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
