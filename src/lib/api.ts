import type { DefectType } from "./defect-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type DefectStatus = "PENDING_REVIEW" | "CONFIRMED" | "FALSE_POSITIVE";

export type ApiDefectEvent = {
  id: string;
  created_at: string;
  machine_id: string;
  anomaly_score: number;
  bbox: { x: number; y: number; w: number; h: number };
  frames: { start: number; end: number };
  evidence_url: string | null;
  status: DefectStatus;
  defect_type: DefectType | null;
  reject_reason: string | null;
  verified_at: string | null;
  verified_by: string | null;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchDefects(params?: {
  status?: DefectStatus;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) {
    query.set("status", params.status);
  }
  if (params?.limit) {
    query.set("limit", String(params.limit));
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  return apiFetch<{ items: ApiDefectEvent[] }>(`/defects${suffix}`);
}

export async function fetchAnalyticsSummary() {
  return apiFetch<{
    potential_defects: number;
    confirmed: number;
    false_positives: number;
    pending_review: number;
    defect_rate_percent: number;
  }>("/analytics/summary");
}

export async function fetchDefectById(id: string) {
  return apiFetch<ApiDefectEvent>(`/defects/${encodeURIComponent(id)}`);
}

export async function confirmDefect(
  id: string,
  defectType: DefectType,
  verifiedBy = "operator",
) {
  return apiFetch<{ id: string; status: DefectStatus; defect_type: DefectType }>(
    `/verification/${id}/confirm`,
    {
      method: "POST",
      body: JSON.stringify({ defect_type: defectType, verified_by: verifiedBy }),
    },
  );
}

export async function rejectDefect(
  id: string,
  reason = "false positive",
  verifiedBy = "operator",
) {
  return apiFetch<{ id: string; status: DefectStatus }>(
    `/verification/${id}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ reason, verified_by: verifiedBy }),
    },
  );
}

export async function startCameraInspection(body: {
  source: string;
  machine_id: string;
}) {
  return apiFetch<{ status?: string }>("/camera/start", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function stopCameraInspection() {
  return apiFetch<{ status?: string }>("/camera/stop", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export type VideoInspectionStatus = "queued" | "processing" | "done" | "failed";

export type ApiVideoInspection = {
  id: string;
  status: VideoInspectionStatus;
  filename: string;
  machine_id: string;
  created_at: string;
  completed_at: string | null;
  defect_count: number;
  error_message: string | null;
};

export async function uploadVideoInspection(file: File, machineId = "LOOM-01") {
  const form = new FormData();
  form.append("file", file);
  form.append("machine_id", machineId);
  const res = await fetch(`${API_BASE}/video-inspections`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error ${res.status}`);
  }
  return res.json() as Promise<{ id: string; status: VideoInspectionStatus }>;
}

export async function fetchVideoInspection(id: string) {
  return apiFetch<ApiVideoInspection>(`/video-inspections/${encodeURIComponent(id)}`);
}

const jakartaTimestampFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatJakartaTimestamp(isoUtc: string): string {
  return jakartaTimestampFormatter.format(new Date(isoUtc));
}

export function evidenceImageUrl(evidenceUrl: string | null) {
  if (!evidenceUrl) {
    return null;
  }
  if (evidenceUrl.startsWith("http")) {
    return evidenceUrl;
  }
  return `${API_BASE}${evidenceUrl}`;
}

export function formatApiDefect(event: ApiDefectEvent) {
  return {
    id: event.id,
    timestamp: formatJakartaTimestamp(event.created_at),
    anomalyScore: event.anomaly_score,
    status: event.status,
    defectType: event.defect_type,
    frames: `${event.frames.start}-${event.frames.end}`,
    position: `${event.bbox.x + Math.round(event.bbox.w / 2)}, ${event.bbox.y + Math.round(event.bbox.h / 2)}`,
    evidenceUrl: evidenceImageUrl(event.evidence_url),
    machineId: event.machine_id,
    verifiedAt: event.verified_at
      ? formatJakartaTimestamp(event.verified_at)
      : null,
    verifiedBy: event.verified_by,
    rejectReason: event.reject_reason,
  };
}

export type ReviewDefectEvent = ReturnType<typeof formatApiDefect>;
