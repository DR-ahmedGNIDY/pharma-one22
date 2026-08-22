"use client";

import { Info } from "lucide-react";
import { ContentPage } from "@/components/shared/ContentPage";

export default function AboutPage() {
  return (
    <ContentPage
      slug="about"
      icon={Info}
      tagline="ABOUT US"
      fallbackTitle="من نحن"
    />
  );
}
