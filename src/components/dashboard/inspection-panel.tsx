"use client";

import { CameraFeed } from "@/components/dashboard/camera-feed";
import { useInspectionSessionContext } from "@/components/dashboard/inspection-session-provider";
import { GradientActionButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

type InspectionPanelProps = {
  className?: string;
};

export function InspectionPanel({ className }: InspectionPanelProps) {
  const session = useInspectionSessionContext();

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-end gap-2">
          <GradientActionButton
            variant={session.running ? "red" : "brown"}
            onClick={() => void session.toggle()}
            disabled={session.busy}
          >
            {session.busy
              ? session.running
                ? "Stopping..."
                : "Starting..."
              : session.running
                ? "Stop"
                : "Start inspection"}
          </GradientActionButton>
      </div>

      <CameraFeed
        active={session.running}
        previewUrl={session.previewUrl}
        error={session.cameraError}
      />
    </section>
  );
}
