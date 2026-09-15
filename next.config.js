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

      // Category pagination moved from ?page=N into the path. Reading a search
      // param opts a route out of the full route cache, so the old URLs forced
      // every category request — page 1 included — to render from scratch.
      {
        source: "/category/:slug",
        has: [{ type: "query", key: "page", value: "(?<n>\\d+)" }],
        destination: "/category/:slug/page/:n",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
