"use client";

import { useEffect, useState } from "react";

import {
  DefectBreakdownList,
  DefectPieChart,
} from "@/components/dashboard/defect-pie-chart";
import { DefectTableSection } from "@/components/dashboard/defect-table";
import { OverviewHero } from "@/components/dashboard/overview-hero";
import { PageContent } from "@/components/dashboard/page-hero";
import type { DefectEvent } from "@/lib/defect-event";
import { loadRecentDefects } from "@/lib/review-data";

export function DashboardOverview() {
  const [events, setEvents] = useState<DefectEvent[]>([]);

  useEffect(() => {
    void loadRecentDefects(10)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <OverviewHero />

      <PageContent>
        <div className="flex flex-col gap-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <DefectPieChart />
            <DefectBreakdownList />
          </div>

          <DefectTableSection
            title="Recent detections"
            description="Anomali yang terdeteksi"
            events={events}
            limit={10}
            showLiveLink
          />
        </div>
      </PageContent>
    </div>
  );
}
