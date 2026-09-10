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
    ];
  },
};

module.exports = nextConfig;
