import { getOfferProducts } from "@/lib/products";
import { siteUrl } from "@/lib/seo";
import OffersClient from "./OffersClient";

// Rebuild the offer list hourly; without this it is frozen at build time and
// offers added from the admin panel would not appear until the next deploy.
export const revalidate = 3600;

/**
 * Offers page — a Server Component wrapper.
 *
 * Offer products are resolved on the server so they are in the initial HTML;
 * the client component keeps the banners and entrance animations.
 */
export default async function OffersPage() {
  const products = await getOfferProducts();

  const jsonLd = products.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${siteUrl}/offers#itemlist`,
        name: "منتجات على العرض",
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/product/${p._id}`,
          name: p.name,
        })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <OffersClient initialProducts={products as any} />
    </>
  );
}
