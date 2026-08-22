import mongoose, { Schema, Document } from "mongoose";

export interface IPageView extends Document {
  visitorId: string;
  sessionId: string;
  path: string;
  device: "mobile" | "tablet" | "desktop";
  referrer?: string;
  duration: number;
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    visitorId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    path: { type: String, required: true },
    device: { type: String, enum: ["mobile", "tablet", "desktop"], default: "desktop" },
    referrer: { type: String, default: "" },
    duration: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PageViewSchema.index({ createdAt: -1 });

export default mongoose.models.PageView ||
  mongoose.model<IPageView>("PageView", PageViewSchema);
