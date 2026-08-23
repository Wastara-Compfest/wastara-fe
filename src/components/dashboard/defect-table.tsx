"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";
import { defectTypeLabel } from "@/lib/defect-types";
import {
  type DefectEvent,
  type DefectStatus,
  defectDetailPath,
  statusLabels,
} from "@/lib/defect-event";

function StatusBadge({ status }: { status: DefectStatus }) {
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

type DefectTableProps = {
  events: DefectEvent[];
  detailed?: boolean;
  linkable?: boolean;
};

export function DefectTable({
  events,
  detailed = false,
  linkable = false,
}: DefectTableProps) {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-table-border bg-white px-6 py-12 text-center text-[14px] text-muted">
        Belum ada anomaly terdeteksi
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-table-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-table-border bg-[#fafbfc] text-muted">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Waktu</th>
              <th className="px-4 py-3 font-medium">Score</th>
              {detailed ? (
                <>
                  <th className="px-4 py-3 font-medium">Frame</th>
                  <th className="px-4 py-3 font-medium">Posisi</th>
                </>
              ) : null}
              <th className="px-4 py-3 font-medium">Tipe</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => {
              const href = linkable ? defectDetailPath(event) : undefined;
              const rowClass = cn(
                "transition-colors",
                linkable && "cursor-pointer hover:bg-table-row/60",
                !linkable && "hover:bg-table-row/60",
                index < events.length - 1 && "border-b border-table-row",
              );

              return (
                <tr
                  key={event.id}
                  className={rowClass}
                  onClick={href ? () => router.push(href) : undefined}
                  onKeyDown={
                    href
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(href);
                          }
                        }
                      : undefined
                  }
                  tabIndex={href ? 0 : undefined}
                  role={href ? "link" : undefined}
                >
                  <td className="px-4 py-3.5 font-medium text-heading">{event.id}</td>
                  <td className="px-4 py-3.5 text-muted">{event.timestamp}</td>
                  <td className="px-4 py-3.5 tabular-nums text-foreground">
                    {event.anomalyScore.toFixed(2)}
                  </td>
                  {detailed ? (
                    <>
                      <td className="px-4 py-3.5 text-muted">{event.frames}</td>
                      <td className="px-4 py-3.5 text-muted">{event.position}</td>
                    </>
                  ) : null}
                  <td className="px-4 py-3.5 text-foreground">
                    {event.defectType ? (
                      defectTypeLabel(event.defectType)
                    ) : event.status === "PENDING_REVIEW" ? (
                      <span className="text-subtle">Unknown</span>
                    ) : (
                      <span className="text-subtle">Rejected</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={event.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DefectTableSection({
  title,
  description,
  events,
  limit,
  detailed = false,
  linkable = false,
  showLiveLink = false,
  headerAction,
}: {
  title: string;
  description?: string;
  events: DefectEvent[];
  limit?: number;
  detailed?: boolean;
  linkable?: boolean;
  showLiveLink?: boolean;
  headerAction?: React.ReactNode;
}) {
  const displayed = limit ? events.slice(0, limit) : events;
  const hasMore = limit ? events.length > limit : false;

  return (
    <section className="space-y-4">
      {title ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-heading">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-[13px] text-muted">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {headerAction}
            {showLiveLink && hasMore ? (
              <GradientButton href="/dashboard/live">
                Lihat semua di Live View
                <ArrowRight className="size-3.5" />
              </GradientButton>
            ) : null}
          </div>
        </div>
      ) : null}

      <DefectTable events={displayed} detailed={detailed} linkable={linkable} />
    </section>
  );
}
