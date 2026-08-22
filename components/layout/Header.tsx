"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/hooks/useStore";
import { useScrollPosition } from "@/hooks/useScroll";
import { cn, createWhatsAppLink, formatPrice } from "@/lib/utils";

interface SearchResultItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  discountPrice?: number;
  brand?: { name: string; slug: string } | string;
}

const navLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "المكياج", href: "/shop?category=makeup" },
  { name: "العناية بالبشرة", href: "/shop?category=skincare" },
  { name: "العناية بالشعر", href: "/shop?category=haircare" },
  { name: "العطور", href: "/shop?category=perfumes" },
  { name: "العناية بالجسم", href: "/shop?category=bodycare" },
  { name: "الأدوات والإكسسوارات", href: "/shop?category=tools" },
  { name: "البراندات", href: "/brands" },
  { name: "العروض", href: "/offers" },
];

export function Header() {
  const { isScrolled } = useScrollPosition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMobileResults, setShowMobileResults] = useState(false);
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems)();
  const router = useRouter();
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const mobileSearchBoxRef = useRef<HTMLDivElement>(null);

  const runSearch = async (query: string, mobile: boolean) => {
    if (!query.trim()) {
      setSearchResults([]);
      if (mobile) setShowMobileResults(false);
      else setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setSearchResults(data.success ? data.products : []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      if (mobile) setShowMobileResults(true);
      else setShowResults(true);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => runSearch(searchQuery, false), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => runSearch(mobileSearchQuery, true), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileSearchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (mobileSearchBoxRef.current && !mobileSearchBoxRef.current.contains(e.target as Node)) {
        setShowMobileResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (productId: string, mobile: boolean) => {
    router.push(`/product/${productId}`);
    if (mobile) {
      setShowMobileResults(false);
      setIsSearchOpen(false);
      setMobileSearchQuery("");
    } else {
      setShowResults(false);
    }
  };

  const getBrandName = (brand?: { name: string; slug: string } | string) =>
    typeof brand === "string" ? brand : brand?.name || "";

  const whatsappLink = createWhatsAppLink(
    "+201022262971",
    "مرحبًا، أريد الاستفسار عن منتجات Pharma One Cosmetics"
  );

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
     <header
  className="fixed top-0 right-0 left-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gold/10 shadow-2xl"
>
        {/* Top Bar */}
        <div className="border-b border-gold/10">
          <div className="container-luxury py-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gold-light/70">
              <span>توصيل  لجميع المحافظات</span>
              <span className="hidden sm:inline">منتجات أصلية 100%</span>
              <span className="hidden md:inline">دفع آمن</span>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-3">
                  <span className="text-gold-light">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">خروج</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-gold-light hover:text-gold transition-colors"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container-luxury pt-6 pb-4 lg:pt-[44px] lg:pb-2">
          <div className="flex flex-row-reverse lg:flex lg:items-center lg:justify-between items-center gap-8 w-full overflow-x-clip">
           {/* Logo Center */}
{/* Logo Center */}
{/* ================= MOBILE LOGO ================= */}
<Link
  href="/"
  className="flex lg:hidden items-center justify-start"
>
  <div className="relative w-[310px] h-[70px] overflow-visible flex items-center justify-center">
    <Image
      src="/images/logo1.webp"
      alt="Pharma One Cosmetics"
      width={700}
      height={220}
      priority
      sizes="310px"
      className="object-contain w-auto h-[180px] max-w-none"
    />
  </div>
</Link>

{/* ================= DESKTOP LOGO ================= */}
<Link
  href="/"
  className="hidden lg:flex items-center justify-center"
>
  <div className="relative w-[400px] h-[70px] overflow-visible flex items-center justify-center">
    <Image
      src="/images/logo1.webp"
      alt="Pharma One Cosmetics"
      width={700}
      height={220}
      priority
      sizes="400px"
      className="object-contain w-auto h-[215px] max-w-none"
    />
  </div>
</Link>



  
              

            {/* Search Bar - Desktop */}
<div className="hidden lg:flex w-[420px]">
              <div className="relative w-full" ref={searchBoxRef}>
                <input
                  type="text"
                  placeholder="ابحث عن منتج، براند، أو كلمة مفتاحية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                  className="w-full bg-black-light border border-gold/20 rounded-full py-3 px-5 pr-12 text-sm text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 focus:shadow-gold-sm transition-all"
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                  size={18}
                />

                <AnimatePresence>
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 left-0 bg-black-light border border-gold/20 rounded-2xl shadow-2xl max-h-[420px] overflow-y-auto z-50"
                    >
                      {isSearching ? (
                        <div className="p-4 text-sm text-gold-muted text-center">
                          جاري البحث...
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-sm text-gold-muted text-center">
                          لا توجد نتائج مطابقة لـ &quot;{searchQuery}&quot;
                        </div>
                      ) : (
                        <ul className="divide-y divide-gold/10">
                          {searchResults.map((product) => (
                            <li key={product._id}>
                              <button
                                type="button"
                                onClick={() => handleResultClick(product._id, false)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gold/5 transition-colors text-right"
                              >
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
                                  {product.images?.[0] && (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-cream truncate">{product.name}</p>
                                  <p className="text-xs text-gold-muted truncate">
                                    {getBrandName(product.brand)}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-gold whitespace-nowrap">
                                  {formatPrice(product.discountPrice || product.price)}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

{/* Actions */}
<div className="order-2 md:order-3">

  {/* ================= MOBILE ACTIONS ================= */}
  <div className="flex lg:hidden items-center gap-4 mr-auto">

    {/* Mobile Menu */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
      className="p-2 text-gold-light hover:text-gold transition-colors"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>

    {/* Cart Mobile */}
    <Link
      href="/cart"
      aria-label="سلة التسوق"
      className="flex p-2 text-gold-light hover:text-gold transition-colors relative"
    >
      <ShoppingBag size={26} />

      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center"
        >
          {totalItems}
        </motion.span>
      )}
    </Link>

    {/* WhatsApp Mobile */}
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-gold-light hover:text-gold transition-colors text-sm font-medium"
    >
      <MessageCircle size={21} />
      <span>WhatsApp</span>
    </a>

    {/* Search Mobile */}
    <button
      onClick={() => setIsSearchOpen(!isSearchOpen)}
      aria-label="بحث"
      className="p-2 mr-4 text-gold-light hover:text-gold transition-colors"
    >
      <Search size={21} />
    </button>

  </div>

  {/* ================= DESKTOP ACTIONS ================= */}
  <div className="hidden lg:flex items-center gap-4">

    {/* WhatsApp Desktop */}
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-black px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-gold transition-all duration-300 hover:scale-105"
    >
      <MessageCircle size={16} />
      <span>اطلب عبر واتساب</span>
    </a>

    {/* Wishlist */}
    <Link
      href="/wishlist"
      aria-label="المفضلة"
      className="flex p-2 text-gold-light hover:text-gold transition-colors relative"
    >
      <Heart size={22} />

      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
        0
      </span>
    </Link>

    {/* Cart */}
    <Link
      href="/cart"
      aria-label="سلة التسوق"
      className="flex p-2 text-gold-light hover:text-gold transition-colors relative"
    >
      <ShoppingBag size={22} />

      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center"
        >
          {totalItems}
        </motion.span>
      )}
    </Link>

    {/* Account */}
    <Link
      href={session ? "/account" : "/login"}
      aria-label="الحساب"
      className="flex p-2 text-gold-light hover:text-gold transition-colors"
    >
      <User size={22} />
    </Link>

  </div>

</div>
</div>
</div>


        {/* Navigation - Desktop */}
        <nav className="hidden lg:block border-t border-gold/10 bg-black/80 backdrop-blur-md">
          <div className="container-luxury">
            <ul className="flex items-center justify-center gap-3 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
px-6 py-3
text-[15px]
font-semibold
tracking-wide
text-gold-light/80
hover:text-yellow-400
transition-all duration-300
relative
group
rounded-xl
hover:bg-white/[0.03]
hover:shadow-[0_0_20px_rgba(212,175,55,0.08)]
"
                  >
                    {link.name}
                    <span
  className="
  absolute
  bottom-1
  right-1/2
  translate-x-1/2
  w-0
  h-[2px]
  bg-gradient-to-r
  from-yellow-400
  to-yellow-600
  rounded-full
  transition-all
  duration-500
  group-hover:w-[70%]
  shadow-[0_0_12px_rgba(255,215,0,0.7)]
"
/>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Search Overlay Mobile */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full right-0 left-0 bg-black-light border-b border-gold/20 p-4"
            >
              <div className="relative" ref={mobileSearchBoxRef}>
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  autoFocus
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-gold/20 rounded-full py-4 px-6 pr-14 text-base text-cream placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 focus:shadow-2xl transition-all"
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-muted"
                  size={18}
                />

                <AnimatePresence>
                  {showMobileResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 left-0 bg-[#111] border border-gold/20 rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto z-50"
                    >
                      {isSearching ? (
                        <div className="p-4 text-sm text-gold-muted text-center">
                          جاري البحث...
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-sm text-gold-muted text-center">
                          لا توجد نتائج مطابقة لـ &quot;{mobileSearchQuery}&quot;
                        </div>
                      ) : (
                        <ul className="divide-y divide-gold/10">
                          {searchResults.map((product) => (
                            <li key={product._id}>
                              <button
                                type="button"
                                onClick={() => handleResultClick(product._id, true)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gold/5 transition-colors text-right"
                              >
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
                                  {product.images?.[0] && (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-cream truncate">{product.name}</p>
                                  <p className="text-xs text-gold-muted truncate">
                                    {getBrandName(product.brand)}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-gold whitespace-nowrap">
                                  {formatPrice(product.discountPrice || product.price)}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-black-light z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src="/images/logo1.webp"
                        alt="Pharma One"
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold gold-text">PHARMA ONE</h2>
                      <p className="text-xs text-gold-muted tracking-wider">
                        COSMETICS
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="إغلاق القائمة"
                    className="p-2 text-gold-light hover:text-gold"
                  >
                    <X size={24} />
                  </button>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-black px-4 py-3 rounded-full font-bold text-sm mb-6"
                >
                  <MessageCircle size={18} />
                  <span>اطلب عبر واتساب</span>
                </a>

                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center py-3 px-4 text-gold-light/80 hover:text-gold hover:bg-gold/5 rounded-lg transition-all"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gold/10">
                  <div className="space-y-3 text-sm text-gold-muted">
                    <p>📞 +20 102 226 2971</p>
                    <p>📧 support@pharmaone.com</p>
                    <p>📍 سوهاج - شارع الجمهورية</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
