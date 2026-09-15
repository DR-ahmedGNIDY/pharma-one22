import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  shippingAddress: {
    label: string;
    street: string;
    city: string;
    governorate: string;
    postalCode?: string;
  };
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cod" | "card" | "wallet";
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      label: { type: String, default: "العنوان الرئيسي" },
      street: { type: String, required: true },
      city: { type: String, required: true },
      governorate: { type: String, required: true },
      postalCode: { type: String },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "wallet"],
      default: "cod",
    },
    trackingNumber: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
