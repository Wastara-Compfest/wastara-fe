"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { uploadVideoInspection } from "@/lib/api";
import { subscribeInspectionComplete } from "@/lib/inspection/stream-hub";

export type VideoUploadPhase = "idle" | "uploading" | "inspecting" | "done" | "error";

export function useVideoUpload() {
  const [phase, setPhase] = useState<VideoUploadPhase>("idle");
  const jobIdRef = useRef<string | null>(null);

  useEffect(() => {
    return subscribeInspectionComplete((message) => {
      if (message.inspection_id !== jobIdRef.current) {
        return;
      }
      jobIdRef.current = null;
      if (message.status === "done") {
        setPhase("done");
        toast.success("Inspeksi video selesai", {
          description: `${message.defect_count} anomaly ditemukan`,
        });
      } else {
        setPhase("error");
        toast.error("Inspeksi video gagal");
      }
    });
  }, []);

  const upload = useCallback(async (file: File, machineId = "LOOM-01") => {
    setPhase("uploading");
    try {
      const { id } = await uploadVideoInspection(file, machineId);
      jobIdRef.current = id;
      setPhase("inspecting");
    } catch (err) {
      setPhase("error");
      const message = err instanceof Error ? err.message : "Upload gagal";
      toast.error("Upload gagal", { description: message });
    }
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
  }, []);

  return {
    phase,
    busy: phase === "uploading" || phase === "inspecting",
    upload,
    reset,
  };
}
