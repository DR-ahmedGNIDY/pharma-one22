"use client";

import { FileText } from "lucide-react";
import { ContentPage } from "@/components/shared/ContentPage";

export default function TermsPage() {
  return (
    <ContentPage
      slug="terms"
      icon={FileText}
      tagline="TERMS & CONDITIONS"
      fallbackTitle="الشروط والأحكام"
    />
  );
}
