import mongoose, { Schema, Document } from "mongoose";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  content: string;
  faqs?: IFaqItem[];
  updatedAt: Date;
}

const FaqItemSchema = new Schema<IFaqItem>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    faqs: { type: [FaqItemSchema], default: undefined },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
