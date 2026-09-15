"use client";

import { useState } from "react";
import { BrandsSection } from "@/components/sections/BrandsSection";

/**
 * Client wrapper that owns the brand strip's selection state, so the homepage
 * itself can be a Server Component.
 *
 * The homepage used to filter its product row by the selected brand too, but
 * selecting a brand navigates straight to that brand's page, so the filtered
 * row was never actually seen. Only the highlight state remains.
 */
export function HomeBrands() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  return (
    <BrandsSection
      selectedBrand={selectedBrand}
      onSelectBrand={setSelectedBrand}
    />
  );
}
