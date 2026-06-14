import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pharma-one.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "فارما وان كوزماتيكس | Pharma One Cosmetics",
    template: "%s | فارما وان كوزماتيكس",
  },

  description:
    "أكبر متجر إلكتروني لمنتجات التجميل والعناية في مصر. أكثر من 7000 منتج من أكثر من 100 براند عالمي أصيل — مكياج، عناية بالبشرة، عطور، عناية بالشعر بأسعار مميزة.",

  keywords: [
    "متجر تجميل",
    "منتجات تجميل",
    "كوزماتيكس مصر",
    "مكياج",
    "عناية بالبشرة",
    "عطور",
    "عناية بالشعر",
    "فارما وان",
    "تسوق اون لاين",
    "براندات عالمية",
    "ديور",
    "شانيل",
    "MAC مصر",
    "لوريال",
    "هدى بيوتي",
    "skincare Egypt",
    "makeup online Egypt",
    "perfumes Egypt",
    "Pharma One Cosmetics",
  ],

  authors: [{ name: "Pharma One Cosmetics", url: siteUrl }],
  creator: "Pharma One Cosmetics",
  publisher: "Pharma One Cosmetics",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: "Pharma One Cosmetics",
    title: "فارما وان كوزماتيكس | أكثر من 7000 منتج تجميل",
    description:
      "أكبر متجر إلكتروني لمنتجات التجميل والعناية في مصر. أكثر من 7000 منتج من 100+ براند عالمي أصيل.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pharma One Cosmetics - متجر التجميل الأول في مصر",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "فارما وان كوزماتيكس | Pharma One Cosmetics",
    description:
      "أكبر متجر إلكتروني لمنتجات التجميل في مصر. أكثر من 7000 منتج من 100+ براند عالمي.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: siteUrl,
    languages: { "ar-EG": siteUrl },
  },

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },

  category: "shopping",

  icons: {
    icon: "/icon.webp",
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 0.85,
  maximumScale: 1,
};

/* ── Organisation + WebSite JSON-LD ─────────────────────────────────────── */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Pharma One Cosmetics",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo1.webp`,
        width: 200,
        height: 60,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+201022262971",
        contactType: "customer service",
        availableLanguage: "Arabic",
        areaServed: "EG",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "EG",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "فارما وان كوزماتيكس",
      description:
        "أكبر متجر إلكتروني لمنتجات التجميل والعناية في مصر",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "ar-EG",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnect to external image hosts to reduce DNS + TLS handshake latency */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-black text-cream font-arabic min-h-screen overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
