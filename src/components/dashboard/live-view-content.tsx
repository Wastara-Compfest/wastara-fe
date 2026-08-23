"use client";

import { LiveDefectFeed } from "@/components/dashboard/live-defect-feed";
import { InspectionPanel } from "@/components/dashboard/inspection-panel";
import { InspectionStatusBanner } from "@/components/dashboard/inspection-status-banner";
import { ModelStatusBadge } from "@/components/dashboard/model-status-badge";
import { useOptionalInspectionSession } from "@/components/dashboard/inspection-session-provider";
import { PageContent, PageHero } from "@/components/dashboard/page-hero";

export function LiveViewContent() {
  const session = useOptionalInspectionSession();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageHero
        title="Live View"
        description="Camera inspection"
        badge={<ModelStatusBadge running={session?.running ?? false} />}
      />

      <PageContent>
        <div className="flex flex-col gap-10">
          <InspectionPanel />
          <InspectionStatusBanner />
          <LiveDefectFeed />
        </div>
      </PageContent>
    </div>
  );
}
