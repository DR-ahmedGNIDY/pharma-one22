"use client";

import { Lock } from "lucide-react";
import { ContentPage } from "@/components/shared/ContentPage";

export default function PrivacyPage() {
  return (
    <ContentPage
      slug="privacy"
      icon={Lock}
      tagline="PRIVACY POLICY"
      fallbackTitle="سياسة الخصوصية"
    />
  );
}
