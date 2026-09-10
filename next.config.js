/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.example.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },

  async redirects() {
    return [
      // The homepage now lives at "/". Keep the old /home URL alive as a
      // permanent redirect so any existing links and Google's index consolidate
      // onto the canonical homepage.
      { source: "/home", destination: "/", permanent: true },

      // Categories moved from a query parameter on /shop to real pages.
      // /shop?category=skincare had no canonical, title or H1 of its own and
      // rendered identically to /shop, so these consolidate onto the new URLs.
      ...Object.entries({
        makeup: "المكياج",
        skincare: "العناية-بالبشرة",
        haircare: "العناية-بالشعر",
        perfumes: "العطور",
        bodycare: "العناية-بالجسم",
        tools: "الأدوات-والإكسسوارات",
      }).map(([key, slug]) => ({
        source: "/shop",
        has: [{ type: "query", key: "category", value: key }],
        destination: `/category/${encodeURIComponent(slug)}`,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
