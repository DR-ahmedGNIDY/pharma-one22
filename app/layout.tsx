import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { headers } from "next/headers";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") || "";
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-black text-cream font-arabic min-h-screen overflow-x-hidden">
        <Providers>
          {!isAdminPage && <Header />}

          <main>{children}</main>

          {!isAdminPage && (
            <>
              <Footer />
              <WhatsAppButton />
              <CartDrawer />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}