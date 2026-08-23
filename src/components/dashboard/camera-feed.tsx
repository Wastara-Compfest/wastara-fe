"use client";

import { cn } from "@/lib/utils";

type CameraFeedProps = {
  active: boolean;
  previewUrl?: string | null;
  error?: string | null;
};

export function CameraFeed({ active, previewUrl, error }: CameraFeedProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a1a1a]">
      {active && previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Live inspection feed"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[14px] text-white/50">
          {error ?? (active ? "Waiting for stream..." : "Camera off")}
        </div>
      )}

      {active && error ? (
        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center text-[12px] text-white/90">
          {error}
        </div>
      ) : null}
    </div>
  );
}
