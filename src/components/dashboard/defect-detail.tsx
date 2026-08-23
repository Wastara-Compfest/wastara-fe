"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PageContent } from "@/components/dashboard/page-hero";
import { cn } from "@/lib/utils";
import { defectTypeLabel } from "@/lib/defect-types";
import type { DefectEvent } from "@/lib/defect-event";
import { statusLabels } from "@/lib/defect-event";
import { getDefectById } from "@/lib/review-data";

function StatusBadge({ status }: { status: DefectEvent["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium",
        status === "PENDING_REVIEW" && "bg-amber-50 text-amber-700",
        status === "CONFIRMED" && "bg-emerald-50 text-emerald-700",
        status === "FALSE_POSITIVE" && "bg-canvas text-muted",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function DefectDetail({ defectId }: { defectId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<DefectEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getDefectById(defectId).then((item) => {
      if (!active) {
        return;
      }
      setEvent(item);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [defectId]);

  useEffect(() => {
    if (event?.status === "PENDING_REVIEW") {
      router.replace(`/dashboard/review/${encodeURIComponent(event.id)}`);
    }
  }, [event, router]);

  if (loading) {
    return (
      <PageContent>
        <p className="text-[13px] text-muted">Loading...</p>
      </PageContent>
    );
  }

  if (!event) {
    return (
      <PageContent>
        <Link
          href="/dashboard/live"
          className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-heading"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <p className="mt-6 text-[15px] font-medium text-heading">Not found</p>
      </PageContent>
    );
  }

  if (event.status === "PENDING_REVIEW") {
    return (
      <PageContent>
        <p className="text-[13px] text-muted">Redirecting to review...</p>
      </PageContent>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageContent>
        <Link
          href="/dashboard/live"
          className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-heading"
        >
          <ArrowLeft className="size-4" />
          Live View
        </Link>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-heading">
              {event.id}
            </h1>
            <StatusBadge status={event.status} />
          </div>
          <span className="tabular-nums text-[14px] font-medium text-heading">
            {event.anomalyScore.toFixed(2)}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl bg-[#eef0f3]">
          {event.evidenceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.evidenceUrl}
              alt={`Evidence ${event.id}`}
              className="aspect-video w-full object-contain"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center text-[13px] text-subtle">
              No evidence
            </div>
          )}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] sm:grid-cols-3">
          <div>
            <dt className="text-muted">Time</dt>
            <dd className="mt-0.5 font-medium text-heading">{event.timestamp}</dd>
          </div>
          <div>
            <dt className="text-muted">Frame</dt>
            <dd className="mt-0.5 font-medium text-heading">{event.frames}</dd>
          </div>
          <div>
            <dt className="text-muted">Position</dt>
            <dd className="mt-0.5 font-medium text-heading">{event.position}</dd>
          </div>
          <div>
            <dt className="text-muted">Defect type</dt>
            <dd className="mt-0.5 font-medium text-heading">
              {event.defectType ? defectTypeLabel(event.defectType) : "—"}
            </dd>
          </div>
          {event.machineId ? (
            <div>
              <dt className="text-muted">Machine</dt>
              <dd className="mt-0.5 font-medium text-heading">{event.machineId}</dd>
            </div>
          ) : null}
          {event.verifiedBy ? (
            <div>
              <dt className="text-muted">Verified by</dt>
              <dd className="mt-0.5 font-medium text-heading">{event.verifiedBy}</dd>
            </div>
          ) : null}
          {event.verifiedAt ? (
            <div>
              <dt className="text-muted">Verified at</dt>
              <dd className="mt-0.5 font-medium text-heading">{event.verifiedAt}</dd>
            </div>
          ) : null}
          {event.rejectReason ? (
            <div className="sm:col-span-3">
              <dt className="text-muted">Reject reason</dt>
              <dd className="mt-0.5 font-medium text-heading">{event.rejectReason}</dd>
            </div>
          ) : null}
        </dl>
      </PageContent>
    </div>
  );
}
