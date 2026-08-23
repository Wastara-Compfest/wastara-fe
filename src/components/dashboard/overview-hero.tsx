import { PageHero } from "@/components/dashboard/page-hero";
import { SummaryCards } from "@/components/dashboard/summary-cards";

export function OverviewHero() {
  return (
    <PageHero
      title="Overview"
      description="Ringkasan defect yang terdeteksi"
    >
      <SummaryCards />
    </PageHero>
  );
}
