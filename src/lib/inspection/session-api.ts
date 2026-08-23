import { startCameraInspection, stopCameraInspection } from "@/lib/api";
import type { InspectionAlert, InspectionConfig } from "@/lib/inspection/types";
import { DEFAULT_INSPECTION_CONFIG } from "@/lib/inspection/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function inspectionWsUrl() {
  return `${API_BASE.replace(/^http/, "ws")}/ws/live`;
}

export async function startModelSession(config: InspectionConfig = DEFAULT_INSPECTION_CONFIG) {
  return startCameraInspection({
    source: config.source,
    machine_id: config.machineId,
  });
}

export async function stopModelSession() {
  return stopCameraInspection();
}

export function subscribeInspectionStream(
  onFrame: (blob: Blob) => void,
  onAlert: (alert: InspectionAlert) => void,
  onError?: (error: Event) => void,
) {
  const ws = new WebSocket(inspectionWsUrl());
  ws.binaryType = "blob";

  ws.onmessage = (event) => {
    if (event.data instanceof Blob) {
      onFrame(event.data);
      return;
    }
    try {
      const data = JSON.parse(String(event.data)) as InspectionAlert;
      if (data.type === "defect_alert") {
        onAlert(data);
      }
    } catch {
      // ignore non-json messages
    }
  };

  ws.onerror = (error) => {
    onError?.(error);
  };

  return () => {
    ws.close();
  };
}
