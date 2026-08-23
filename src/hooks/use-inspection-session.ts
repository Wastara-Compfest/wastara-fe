"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  startModelSession,
  stopModelSession,
} from "@/lib/inspection/session-api";
import {
  subscribeInspectionAlerts,
  subscribeInspectionFrames,
} from "@/lib/inspection/stream-hub";
import type {
  InspectionAlert,
  InspectionConfig,
  InspectionPhase,
} from "@/lib/inspection/types";
import { DEFAULT_INSPECTION_CONFIG } from "@/lib/inspection/types";

export function useInspectionSession(config: InspectionConfig = DEFAULT_INSPECTION_CONFIG) {
  const [phase, setPhase] = useState<InspectionPhase>("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [modelConnected, setModelConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastAlertAt, setLastAlertAt] = useState(0);
  const previewUrlRef = useRef<string | null>(null);
  const runningRef = useRef(false);

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const stop = useCallback(async () => {
    if (!runningRef.current && phase === "idle") {
      return;
    }

    setBusy(true);
    runningRef.current = false;
    revokePreview();

    try {
      await stopModelSession();
    } catch {
      // model service may already be stopped
    }

    setPhase("idle");
    setModelConnected(false);
    setCameraError(null);
    setBusy(false);
  }, [phase, revokePreview]);

  const stopRef = useRef(stop);
  stopRef.current = stop;

  useEffect(() => {
    return () => {
      void stopRef.current();
    };
  }, []);

  useEffect(() => {
    return subscribeInspectionAlerts((alert: InspectionAlert) => {
      if (!runningRef.current) {
        return;
      }
      setAlertCount((n) => n + 1);
      setLastAlertAt(Date.now());
      toast.warning("Anomaly detected", {
        description: `${alert.defect.id} · score ${alert.defect.anomaly_score.toFixed(2)}`,
      });
    });
  }, []);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    return subscribeInspectionFrames((blob) => {
      const url = URL.createObjectURL(blob);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = url;
      setPreviewUrl(url);
    });
  }, [phase]);

  const start = useCallback(async () => {
    if (busy || phase !== "idle") {
      return;
    }

    setBusy(true);
    setCameraError(null);
    setAlertCount(0);

    try {
      await startModelSession(config);
      runningRef.current = true;
      setModelConnected(true);
      setPhase("running");
      toast.success("Inspection running");
    } catch (err) {
      runningRef.current = false;
      const message =
        err instanceof Error ? err.message : "Failed to start inspection";
      setCameraError(message);
      setPhase("idle");
      setModelConnected(false);
      revokePreview();
      try {
        await stopModelSession();
      } catch {
        // ignore
      }
      toast.error("Inspection unavailable", { description: message });
    } finally {
      setBusy(false);
    }
  }, [busy, phase, config, revokePreview]);

  const toggle = useCallback(async () => {
    if (busy) {
      return;
    }
    if (phase === "idle") {
      await start();
      return;
    }
    await stop();
    toast.info("Inspection stopped");
  }, [busy, phase, start, stop]);

  return {
    previewUrl,
    phase,
    running: phase === "running",
    cameraError,
    modelConnected,
    busy,
    alertCount,
    lastAlertAt,
    start,
    stop,
    toggle,
  };
}
