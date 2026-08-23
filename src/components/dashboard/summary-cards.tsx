"use client";

import { useEffect, useState } from "react";

import type { DashboardSummary } from "@/lib/defect-event";
import { loadDashboardSummary } from "@/lib/review-data";

export function SummaryCards() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    void loadDashboardSummary()
      .then((data) => {
        setSummary({
          totalDetected: data.potential_defects,
          pendingReview: data.pending_review,
          confirmed: data.confirmed,
          falsePositive: data.false_positives,
          defectRatePercent: data.defect_rate_percent,
        });
      })
      .catch(() => {
        setSummary({
          totalDetected: 0,
          pendingReview: 0,
          confirmed: 0,
          falsePositive: 0,
          defectRatePercent: 0,
        });
      });
  }, []);

  const cards = [
    { title: "Total detected", value: summary?.totalDetected ?? "—" },
    { title: "Pending review", value: summary?.pendingReview ?? "—" },
    { title: "Confirmed", value: summary?.confirmed ?? "—" },
    { title: "False positive", value: summary?.falsePositive ?? "—" },
    {
      title: "Defect rate",
      value: summary ? `${summary.defectRatePercent}%` : "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-black/[0.06] bg-white px-5 py-4"
        >
          <p className="text-[13px] font-medium text-muted">{card.title}</p>
          <p className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-heading">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
