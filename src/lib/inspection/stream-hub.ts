import type {
  InspectionAlert,
  InspectionCompleteMessage,
} from "@/lib/inspection/types";

import { inspectionWsUrl } from "./session-api";

type FrameHandler = (blob: Blob) => void;
type AlertHandler = (alert: InspectionAlert) => void;
type CompleteHandler = (message: InspectionCompleteMessage) => void;

class InspectionStreamHub {
  private ws: WebSocket | null = null;
  private frameHandlers = new Set<FrameHandler>();
  private alertHandlers = new Set<AlertHandler>();
  private completeHandlers = new Set<CompleteHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private ensureConnected() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }
    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const ws = new WebSocket(inspectionWsUrl());
    ws.binaryType = "blob";
    this.ws = ws;

    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        for (const handler of this.frameHandlers) {
          handler(event.data);
        }
        return;
      }

      try {
        const data = JSON.parse(String(event.data)) as
          | InspectionAlert
          | InspectionCompleteMessage;
        if (data.type === "defect_alert") {
          for (const handler of this.alertHandlers) {
            handler(data);
          }
        } else if (data.type === "inspection_complete") {
          for (const handler of this.completeHandlers) {
            handler(data);
          }
        }
      } catch {
        // ignore non-json messages
      }
    };

    ws.onclose = () => {
      this.ws = null;
      if (
        this.frameHandlers.size > 0 ||
        this.alertHandlers.size > 0 ||
        this.completeHandlers.size > 0
      ) {
        this.scheduleReconnect();
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return;
    }
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.ensureConnected();
    }, 1500);
  }

  subscribeFrames(handler: FrameHandler) {
    this.frameHandlers.add(handler);
    this.ensureConnected();
    return () => {
      this.frameHandlers.delete(handler);
    };
  }

  subscribeAlerts(handler: AlertHandler) {
    this.alertHandlers.add(handler);
    this.ensureConnected();
    return () => {
      this.alertHandlers.delete(handler);
    };
  }

  subscribeComplete(handler: CompleteHandler) {
    this.completeHandlers.add(handler);
    this.ensureConnected();
    return () => {
      this.completeHandlers.delete(handler);
    };
  }
}

export const inspectionStreamHub = new InspectionStreamHub();

export function subscribeInspectionAlerts(handler: AlertHandler) {
  return inspectionStreamHub.subscribeAlerts(handler);
}

export function subscribeInspectionFrames(handler: FrameHandler) {
  return inspectionStreamHub.subscribeFrames(handler);
}

export function subscribeInspectionComplete(handler: CompleteHandler) {
  return inspectionStreamHub.subscribeComplete(handler);
}
