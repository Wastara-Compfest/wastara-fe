"use client";

import Link from "next/link";

import { useOptionalInspectionSession } from "@/components/dashboard/inspection-session-provider";
import { cn } from "@/lib/utils";

type InspectionStatusBannerProps = {
  className?: string;
  showLiveLink?: boolean;
};

export function InspectionStatusBanner({
  className,
  showLiveLink = false,
}: InspectionStatusBannerProps) {
  const session = useOptionalInspectionSession();

  if (!session?.running) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 text-[13px] text-emerald-900">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
        </span>
        <span className="font-medium">Inspection running</span>
        <span className="text-emerald-700">
          {session.modelConnected ? "Model connected" : "Connecting to model..."}
          {session.alertCount > 0 ? ` · ${session.alertCount} alerts` : ""}
        </span>
      </div>

      {showLiveLink ? (
        <Link
          href="/dashboard/live"
          className="text-[12px] font-medium text-emerald-800 underline-offset-2 hover:underline"
        >
          Open live view
        </Link>
      ) : null}
    </div>
  );
}
