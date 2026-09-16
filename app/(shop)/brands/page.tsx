import { getAllBrands } from "@/lib/brands";
import { siteUrl } from "@/lib/seo";
import { BrandsGrid } from "./BrandsGrid";

export const revalidate = 3600;

/**
 * Brands index — a Server Component.
 *
 * It used to render a hand-written list of twelve brand names with invented
 * product counts. Ten of those linked to brand pages that do not exist and
 * returned 404, while the 96 real brands in the database had no link from
 * anywhere except their own products' pages.
 */
export default async function BrandsPage() {
  const brands = await getAllBrands();

  const jsonLd = brands.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${siteUrl}/brands#itemlist`,
        name: "البراندات",
        numberOfItems: brands.length,
        itemListElement: brands.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/brand/${encodeURIComponent(b.slug)}`,
          name: b.name,
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="container-luxury">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl">♛</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#D4AF37] mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            البراندات العالمية
          </h1>

          <p className="text-[#D4AF37] text-lg md:text-xl opacity-90">
            {brands.length.toLocaleString("ar-EG")} براند عالمي أصلي
          </p>
        </header>

        <BrandsGrid brands={brands} />
      </div>
    </div>
  );
}
