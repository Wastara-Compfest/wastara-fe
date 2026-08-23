"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { DefectTableSection } from "@/components/dashboard/defect-table";
import { useOptionalInspectionSession } from "@/components/dashboard/inspection-session-provider";
import { SortSelect } from "@/components/ui/sort-select";
import type { DefectStatus } from "@/lib/defect-event";
import type { DefectEvent } from "@/lib/defect-event";
import { statusLabels } from "@/lib/defect-event";
import { DEFECT_TYPES, defectTypeLabel } from "@/lib/defect-types";
import { subscribeInspectionAlerts } from "@/lib/inspection/stream-hub";
import { loadAllDefects } from "@/lib/review-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

type StatusFilter = "all" | DefectStatus;
type TypeFilter = "all" | "unclassified" | (typeof DEFECT_TYPES)[number];

function parseTimestamp(value: string) {
  return new Date(value.replace(" ", "T")).getTime();
}

export function LiveDefectFeed() {
  const session = useOptionalInspectionSession();
  const [events, setEvents] = useState<DefectEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);

  const refresh = useCallback(async () => {
    try {
      const items = await loadAllDefects(200);
      setEvents(items);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    return subscribeInspectionAlerts(() => {
      void refresh();
    });
  }, [refresh]);

  useEffect(() => {
    if (!session?.running) {
      return;
    }
    const interval = setInterval(() => {
      void refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [session?.running, refresh]);

  useEffect(() => {
    if (session?.lastAlertAt) {
      void refresh();
    }
  }, [session?.lastAlertAt, refresh]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events
      .filter((event) => {
        if (statusFilter !== "all" && event.status !== statusFilter) {
          return false;
        }
        if (typeFilter === "unclassified") {
          return !event.defectType;
        }
        if (typeFilter !== "all" && event.defectType !== typeFilter) {
          return false;
        }
        if (!query) {
          return true;
        }
        return (
          event.id.toLowerCase().includes(query) ||
          event.timestamp.toLowerCase().includes(query) ||
          (event.defectType &&
            defectTypeLabel(event.defectType).toLowerCase().includes(query)) ||
          statusLabels[event.status].toLowerCase().includes(query)
        );
      })
      .sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
  }, [events, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, page]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-heading">
          All detections
        </h2>
        <p className="mt-0.5 text-[13px] text-muted">
          Semua anomaly terdeteksi · klik baris untuk detail
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, time, type, or status"
            className="w-full rounded-lg bg-canvas py-2.5 pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-subtle"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <SortSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All status" },
              { value: "PENDING_REVIEW", label: "Review" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "FALSE_POSITIVE", label: "Rejected" },
            ]}
          />
          <SortSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "All types" },
              { value: "unclassified", label: "Unclassified" },
              ...DEFECT_TYPES.map((type) => ({
                value: type,
                label: defectTypeLabel(type),
              })),
            ]}
          />
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-[13px] text-muted">Loading...</p>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-table-border bg-white px-6 py-12 text-center text-[14px] text-muted">
          {events.length === 0
            ? "Belum ada anomaly terdeteksi"
            : "No results match your filters"}
        </div>
      ) : (
        <>
          <DefectTableSection
            title=""
            events={paginatedEvents}
            detailed
            linkable
          />

          {filteredEvents.length > PAGE_SIZE ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filteredEvents.length)} of{" "}
                {filteredEvents.length}
                {session?.running ? " · auto-refreshing" : ""}
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors",
                    page <= 1
                      ? "cursor-not-allowed text-subtle"
                      : "bg-canvas text-foreground hover:bg-canvas/70",
                  )}
                >
                  <ChevronLeft className="size-3.5" />
                  Prev
                </button>
                <span className="px-2 text-[12px] tabular-nums text-muted">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors",
                    page >= totalPages
                      ? "cursor-not-allowed text-subtle"
                      : "bg-canvas text-foreground hover:bg-canvas/70",
                  )}
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-muted">
              Showing {filteredEvents.length} detection
              {filteredEvents.length === 1 ? "" : "s"}
              {session?.running ? " · auto-refreshing" : ""}
            </p>
          )}
        </>
      )}
    </section>
  );
}
