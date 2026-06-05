export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: "user" | "admin";
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  governorate: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  banner?: string;
  description?: string;
  categories: Category[] | string[];
  isActive: boolean;
  order: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  parent?: string | Category;
  isActive: boolean;
  order: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: Brand | string;
  category: Category | string;
  subCategory?: Category | string;
  images: string[];
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOffer?: boolean;
  tags: string[];
  specifications: { key: string; value: string }[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cod" | "card" | "wallet";
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  product: string;
  order: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: "hero" | "promo" | "category" | "footer";
  isActive: boolean;
  order: number;
}

export interface Settings {
  _id: string;
  siteName: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    snapchat?: string;
    twitter?: string;
    youtube?: string;
  };
  shippingCost: number;
  freeShippingThreshold: number;
}

export interface FilterOptions {
  brands?: string[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "best-seller";
}
