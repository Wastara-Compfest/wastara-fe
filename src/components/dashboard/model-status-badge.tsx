import { cn } from "@/lib/utils";

export function ModelStatusBadge({ running }: { running: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[12px] font-medium",
        running
          ? "bg-white/20 text-white ring-1 ring-white/25"
          : "bg-white/10 text-white/70 ring-1 ring-white/15",
      )}
    >
      {running ? (
        <>
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-white" />
          </span>
          Model running
        </>
      ) : (
        <>
          <span className="size-1.5 rounded-full bg-white/50" />
          Model stopped
        </>
      )}
    </span>
  );
}
