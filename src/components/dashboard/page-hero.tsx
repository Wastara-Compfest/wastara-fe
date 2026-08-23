import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  badge,
  children,
  className,
}: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden px-6 pb-14 pt-8 md:px-10 md:pb-16 md:pt-10",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#352218]">
        <svg
          className="absolute bottom-0 left-0 h-[180px] w-full text-[#c99b6e]/50"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,96 C240,168 480,48 720,112 C960,176 1200,64 1440,104 L1440,180 L0,180 Z" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 h-[140px] w-full text-[#e2c4a0]/35"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,72 C320,24 640,128 960,72 C1120,48 1280,88 1440,96 L1440,140 L0,140 Z" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 h-[100px] w-full text-[#b8875e]/25"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,56 C360,16 720,84 1080,44 C1260,28 1380,52 1440,60 L1440,100 L0,100 Z" />
        </svg>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#70482e]/78 via-[#805539]/72 to-[#8f5e3c]/68"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className={cn("mb-6", children ? "mb-6" : "mb-0")}>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-white">
              {title}
            </h1>
            {badge}
          </div>
          {description ? (
            <p className="mt-1 text-[14px] leading-relaxed text-white/85">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 rounded-t-[28px] bg-white md:h-12 md:rounded-t-[32px]"
      />
    </section>
  );
}

export function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative z-10 -mt-1 bg-white px-6 pb-8 pt-2 md:px-10 md:pb-10 md:pt-4",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
