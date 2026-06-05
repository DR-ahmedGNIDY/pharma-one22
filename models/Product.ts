import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
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
  isOffer: boolean;
  tags: string[];
  specifications: { key: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    discountPercentage: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    tags: [{ type: String }],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  if (this.discountPrice && this.discountPrice > 0) {
    if (this.discountPrice >= this.price) {
      const err = new Error("سعر الخصم يجب أن يكون أقل من السعر الأصلي");
      return next(err);
    }
    this.discountPercentage = Math.round(
      ((this.price - this.discountPrice) / this.price) * 100
    );
  } else {
    this.discountPercentage = 0;
  }
  next();
});

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ brand: 1, category: 1 });
ProductSchema.index({ isFeatured: 1, isBestSeller: 1, isNewArrival: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
