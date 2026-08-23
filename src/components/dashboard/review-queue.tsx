"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { InspectionStatusBanner } from "@/components/dashboard/inspection-status-banner";
import { useOptionalInspectionSession } from "@/components/dashboard/inspection-session-provider";
import { PageContent, PageHero } from "@/components/dashboard/page-hero";
import { SortSelect } from "@/components/ui/sort-select";
import type { DefectEvent } from "@/lib/defect-event";
import { subscribeInspectionAlerts } from "@/lib/inspection/stream-hub";
import { loadPendingDefects } from "@/lib/review-data";

type SortOrder = "newest" | "oldest";

function parseTimestamp(value: string) {
  return new Date(value.replace(" ", "T")).getTime();
}

function ReviewCard({ event }: { event: DefectEvent }) {
  return (
    <Link
      href={`/dashboard/review/${encodeURIComponent(event.id)}`}
      className="group block w-full overflow-hidden rounded-xl bg-canvas transition-colors hover:bg-canvas/40 hover:shadow-sm"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#eef0f3]">
        {event.evidenceUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.evidenceUrl}
            alt={`Evidence ${event.id}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[12px] text-subtle">Evidence</span>
        )}
      </div>
      <div className="space-y-1 px-3 py-3">
        <p className="text-[13px] font-medium text-heading">{event.id}</p>
        <div className="flex items-center justify-between gap-2 text-[12px] text-muted">
          <span>{event.timestamp.split(" ")[1]}</span>
          <span className="tabular-nums font-medium text-foreground">
            {event.anomalyScore.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ReviewQueue() {
  const session = useOptionalInspectionSession();
  const [events, setEvents] = useState<DefectEvent[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const pending = await loadPendingDefects();
      setEvents(pending);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
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

    const filtered = events.filter((event) => {
      if (!query) {
        return true;
      }
      return (
        event.id.toLowerCase().includes(query) ||
        event.timestamp.toLowerCase().includes(query)
      );
    });

    return filtered.sort((a, b) => {
      const diff = parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
      return sortOrder === "newest" ? diff : -diff;
    });
  }, [events, search, sortOrder]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PageHero
        title="Review"
        description="Pending anomalies"
        badge={
          <span className="inline-flex items-center rounded-sm bg-white/20 px-2.5 py-1 text-[12px] font-medium text-white ring-1 ring-white/25">
            {events.length} pending
          </span>
        }
      />

      <PageContent>
        <div className="space-y-5">
          <InspectionStatusBanner showLiveLink />

          <div className="flex items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID or time"
                className="w-full rounded-lg bg-canvas py-2.5 pl-9 pr-3 text-[13px] text-foreground outline-none transition-colors placeholder:text-subtle"
              />
            </div>

            <SortSelect
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
              ]}
            />
          </div>

          {loading ? (
            <p className="py-12 text-center text-[13px] text-muted">Loading...</p>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-xl px-6 py-16 text-center">
              <p className="text-[15px] font-medium text-heading">
                {events.length === 0 ? "No pending items" : "No results"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <ReviewCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </PageContent>
    </div>
  );
}
