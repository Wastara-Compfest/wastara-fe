export type InspectionPhase = "idle" | "camera" | "running";

export type InspectionConfig = {
  machineId: string;
  source: "webcam" | string;
};

export const DEFAULT_INSPECTION_CONFIG: InspectionConfig = {
  machineId: "LOOM-01",
  source: process.env.NEXT_PUBLIC_INSPECTION_SOURCE ?? "webcam",
};

export type ModelAnomalyPayload = {
  machine_id: string;
  anomaly_score: number;
  bbox: { x: number; y: number; w: number; h: number };
  frames: { start: number; end: number };
  session_id?: string;
};

export type HumanVerificationPayload = {
  defect_type: string;
  verified_by: string;
};

export type InspectionAlert = {
  type: "defect_alert";
  defect: {
    id: string;
    anomaly_score: number;
    status: "PENDING_REVIEW";
  };
};

export type InspectionCompleteMessage = {
  type: "inspection_complete";
  inspection_id: string;
  status: "done" | "failed";
  defect_count: number;
};
