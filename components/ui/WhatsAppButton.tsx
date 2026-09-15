import { Phone } from "lucide-react";
import { createWhatsAppLink } from "@/lib/utils";

/**
 * Floating WhatsApp button. Hover and press feedback are CSS transforms and the
 * dot pulses with Tailwind's animate-pulse, so this renders on the server and
 * ships no JavaScript. It sits in the shop layout and appears on every page.
 */
export function WhatsAppButton() {
  const link = createWhatsAppLink(
    "+201022262971",
    "مرحبًا، أريد الاستفسار عن منتجات Pharma One Cosmetics"
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 active:scale-95 transition-[transform,box-shadow] duration-200"
    >
      <Phone size={24} className="text-white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full animate-pulse" />
    </a>
  );
}
