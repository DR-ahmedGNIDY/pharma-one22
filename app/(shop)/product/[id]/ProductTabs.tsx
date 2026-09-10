"use client";

import { useState } from "react";

interface Props {
  description: string;
  specifications?: { key: string; value: string }[];
  rating?: number;
  reviewCount?: number;
}

type TabId = "description" | "specs" | "reviews";

/**
 * Product detail tabs.
 *
 * Every panel is rendered into the DOM and non-active ones are hidden with
 * `hidden`, rather than being conditionally rendered. That keeps the full
 * description and the specification table inside the server HTML, so Google
 * sees them without needing to click anything.
 */
export function ProductTabs({
  description,
  specifications,
  rating,
  reviewCount,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const hasSpecs = (specifications?.length ?? 0) > 0;
  const hasReviews = (reviewCount ?? 0) > 0;

  const tabs: { id: TabId; label: string; show: boolean }[] = [
    { id: "description", label: "الوصف", show: true },
    { id: "specs", label: "المواصفات", show: hasSpecs },
    { id: "reviews", label: "التقييمات", show: true },
  ];

  return (
    <div className="mb-16">
      <div
        role="tablist"
        className="flex gap-1 bg-black-light rounded-xl p-1 mb-8 w-fit"
      >
        {tabs
          .filter((t) => t.show)
          .map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gold text-black"
                  : "text-gold-muted hover:text-gold"
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>

      <div className="luxury-card p-8">
        <div
          id="panel-description"
          role="tabpanel"
          hidden={activeTab !== "description"}
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-cream/90 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>

        {hasSpecs && (
          <div id="panel-specs" role="tabpanel" hidden={activeTab !== "specs"}>
            <div className="grid md:grid-cols-2 gap-4">
              {specifications!.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black rounded-xl"
                >
                  <span className="text-gold-muted">{spec.key}</span>
                  <span className="text-cream font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          id="panel-reviews"
          role="tabpanel"
          hidden={activeTab !== "reviews"}
        >
          {hasReviews ? (
            <div className="py-6">
              <p className="text-cream text-lg mb-2">
                متوسط التقييم:{" "}
                <span className="text-gold font-bold">
                  {Number(rating).toFixed(1)} / 5
                </span>
              </p>
              <p className="text-gold-muted text-sm">
                بناءً على {reviewCount} تقييم
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gold-muted mb-2">
                لا توجد تقييمات لهذا المنتج بعد
              </p>
              <p className="text-gold-muted/70 text-sm">
                كوني أول من يشارك رأيها بعد الشراء
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
