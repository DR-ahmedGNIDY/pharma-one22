import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Pharma One Cosmetics - كل منتجات التجميل في مكان واحد",
  description:
    "أكثر من 7000 منتج من أكثر من 100 براند عالمي. تسوق الآن أفضل منتجات التجميل والعناية بالبشرة والشعر والعطور.",
};

export const viewport = {
  width: "device-width",
  initialScale: 0.85,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-black text-cream font-arabic min-h-screen overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}