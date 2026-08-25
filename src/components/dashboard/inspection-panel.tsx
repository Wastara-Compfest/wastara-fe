"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

import { CameraFeed } from "@/components/dashboard/camera-feed";
import { useInspectionSessionContext } from "@/components/dashboard/inspection-session-provider";
import { GradientActionButton } from "@/components/ui/gradient-button";
import { useVideoUpload } from "@/hooks/use-video-upload";
import { cn } from "@/lib/utils";

type InspectionPanelProps = {
  className?: string;
};

const uploadLabels: Record<string, string> = {
  uploading: "Uploading...",
  inspecting: "Inspecting...",
};

export function InspectionPanel({ className }: InspectionPanelProps) {
  const session = useInspectionSessionContext();
  const videoUpload = useVideoUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-3 flex items-center justify-end gap-2">
          <GradientActionButton
            variant={session.running ? "red" : "brown"}
            onClick={() => void session.toggle()}
            disabled={session.busy}
          >
            {session.busy
              ? session.running
                ? "Stopping..."
                : "Starting..."
              : session.running
                ? "Stop"
                : "Start inspection"}
          </GradientActionButton>
      </div>

      <CameraFeed
        active={session.running}
        previewUrl={session.previewUrl}
        error={session.cameraError}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void videoUpload.upload(file);
          }
          e.target.value = "";
        }}
      />
      <GradientActionButton
        variant="brown"
        className="mt-3 w-full justify-center"
        disabled={videoUpload.busy}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="size-4" />
        {uploadLabels[videoUpload.phase] ?? "Upload video"}
      </GradientActionButton>
    </section>
  );
}
