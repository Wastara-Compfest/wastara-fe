import {
  fetchAnalyticsSummary,
  fetchDefectById,
  fetchDefects,
  formatApiDefect,
} from "./api";
import type { DefectEvent } from "./defect-event";
import type { DefectType } from "./defect-types";
import { DEFECT_TYPE_LABELS } from "./defect-types";

export async function loadPendingDefects(): Promise<DefectEvent[]> {
  const data = await fetchDefects({ status: "PENDING_REVIEW", limit: 100 });
  return data.items.map((item) => formatApiDefect(item) as DefectEvent);
}

export async function loadRecentDefects(limit = 20): Promise<DefectEvent[]> {
  const data = await fetchDefects({ limit });
  return data.items.map((item) => formatApiDefect(item) as DefectEvent);
}

export async function loadAllDefects(limit = 200): Promise<DefectEvent[]> {
  const data = await fetchDefects({ limit });
  return data.items.map((item) => formatApiDefect(item) as DefectEvent);
}

export async function getDefectById(id: string): Promise<DefectEvent | null> {
  try {
    const item = await fetchDefectById(id);
    return formatApiDefect(item) as DefectEvent;
  } catch {
    return null;
  }
}

export async function loadDashboardSummary() {
  return fetchAnalyticsSummary();
}

export async function loadDefectTypeBreakdown(): Promise<
  { type: DefectType; label: string; count: number; fill: string }[]
> {
  const data = await fetchDefects({ status: "CONFIRMED", limit: 200 });
  const counts = new Map<DefectType, number>();
  for (const item of data.items) {
    if (!item.defect_type) {
      continue;
    }
    const key = item.defect_type as DefectType;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const palette: Record<DefectType, string> = {
    broken_yarn: "#3d2818",
    hole: "#8b4513",
    pattern_anomaly: "#c4783a",
    texture_anomaly: "#e8c39e",
    unknown: "#cbd2d9",
  };

  return Object.entries(DEFECT_TYPE_LABELS).map(([type, label]) => ({
    type: type as DefectType,
    label,
    count: counts.get(type as DefectType) ?? 0,
    fill: palette[type as DefectType],
  }));
}
