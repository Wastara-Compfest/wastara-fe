"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PageContent } from "@/components/dashboard/page-hero";
import { GradientActionButton } from "@/components/ui/gradient-button";
import { SortSelect } from "@/components/ui/sort-select";
import { confirmDefect, rejectDefect } from "@/lib/api";
import {
  type DefectType,
  defectTypeLabel,
  defectTypeOptions,
} from "@/lib/defect-types";
import type { DefectEvent } from "@/lib/defect-event";
import { getDefectById } from "@/lib/review-data";

export function ReviewDetail({ defectId }: { defectId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<DefectEvent | null>(null);
  const [selectedType, setSelectedType] = useState<DefectType>("unknown");
  const [busy, setBusy] = useState(false);
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

  async function handleConfirm() {
    if (!event) {
      return;
    }
    setBusy(true);
    try {
      await confirmDefect(event.id, selectedType);
      toast.success("Confirmed", {
        description: defectTypeLabel(selectedType),
      });
      router.push("/dashboard/review");
    } catch (err) {
      toast.error("Confirm failed", {
        description: err instanceof Error ? err.message : "Error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleReject() {
    if (!event) {
      return;
    }
    setBusy(true);
    try {
      await rejectDefect(event.id);
      toast.info("Rejected");
      router.push("/dashboard/review");
    } catch (err) {
      toast.error("Reject failed", {
        description: err instanceof Error ? err.message : "Error",
      });
    } finally {
      setBusy(false);
    }
  }

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
          href="/dashboard/review"
          className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-heading"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <p className="mt-6 text-[15px] font-medium text-heading">Not found</p>
      </PageContent>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageContent>
        <Link
          href="/dashboard/review"
          className="inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-heading"
        >
          <ArrowLeft className="size-4" />
          Review
        </Link>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-heading">
            {event.id}
          </h1>
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
        </dl>

        <div className="mt-8 w-full">
          <p className="mb-2 text-[13px] text-muted">Defect type</p>
          <SortSelect
            value={selectedType}
            options={defectTypeOptions()}
            onChange={setSelectedType}
            className="w-full"
            menuFullWidth
          />
        </div>

        <div className="mt-4 flex w-full gap-3 pb-8">
          <GradientActionButton
            variant="red"
            className="flex-1"
            onClick={() => void handleReject()}
            disabled={busy}
          >
            Reject
          </GradientActionButton>
          <GradientActionButton
            variant="green"
            className="flex-1"
            onClick={() => void handleConfirm()}
            disabled={busy}
          >
            Confirm
          </GradientActionButton>
        </div>
      </PageContent>
    </div>
  );
}
