import type { DefectType } from "./defect-types";

export type DefectStatus = "PENDING_REVIEW" | "CONFIRMED" | "FALSE_POSITIVE";

export type DefectEvent = {
  id: string;
  timestamp: string;
  anomalyScore: number;
  status: DefectStatus;
  defectType: DefectType | null;
  frames: string;
  position: string;
  evidenceUrl?: string | null;
  machineId?: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectReason?: string | null;
};

export const statusLabels: Record<DefectStatus, string> = {
  PENDING_REVIEW: "Review",
  CONFIRMED: "Confirmed",
  FALSE_POSITIVE: "Rejected",
};

export function defectDetailPath(event: Pick<DefectEvent, "id" | "status">) {
  if (event.status === "PENDING_REVIEW") {
    return `/dashboard/review/${encodeURIComponent(event.id)}`;
  }
  return `/dashboard/defects/${encodeURIComponent(event.id)}`;
}

export type DashboardSummary = {
  totalDetected: number;
  pendingReview: number;
  confirmed: number;
  falsePositive: number;
  defectRatePercent: number;
};

export type DefectTypeCount = {
  type: DefectType;
  label: string;
  count: number;
};
