import Link from "next/link";

import { cn } from "@/lib/utils";

type GradientVariant = "brown" | "green" | "red";

const variantStyles: Record<GradientVariant, string> = {
  brown: cn(
    "bg-gradient-to-b from-[#a07048] to-[#70482e]",
    "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(112,72,46,0.22),inset_0_1px_0_rgba(255,255,255,0.28)]",
    "hover:from-[#a97850] hover:to-[#805539]",
    "hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(112,72,46,0.32),inset_0_1px_0_rgba(255,255,255,0.35)]",
    "active:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_6px_rgba(112,72,46,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]",
  ),
  green: cn(
    "bg-gradient-to-b from-[#52b888] to-[#358962]",
    "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(53,137,98,0.22),inset_0_1px_0_rgba(255,255,255,0.28)]",
    "hover:from-[#58c090] hover:to-[#3a9668]",
    "hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(53,137,98,0.32),inset_0_1px_0_rgba(255,255,255,0.35)]",
    "active:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_6px_rgba(53,137,98,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]",
  ),
  red: cn(
    "bg-gradient-to-b from-[#ef6b6b] to-[#c93a3a]",
    "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_8px_rgba(201,58,58,0.22),inset_0_1px_0_rgba(255,255,255,0.28)]",
    "hover:from-[#f27878] hover:to-[#d44242]",
    "hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(201,58,58,0.32),inset_0_1px_0_rgba(255,255,255,0.35)]",
    "active:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_6px_rgba(201,58,58,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]",
  ),
};

const baseButtonClassName = cn(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 text-[13px] font-medium text-white cursor-pointer",
  "transition-all duration-200 ease-out",
  "hover:-translate-y-0.5 active:translate-y-0",
);

export function getGradientButtonClassName(variant: GradientVariant = "brown") {
  return cn(baseButtonClassName, variantStyles[variant]);
}

export const gradientButtonClassName = getGradientButtonClassName("brown");

function GradientButtonInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-80"
      />
      <span className="relative z-[1] inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );
}

export function GradientButton({
  href,
  children,
  className,
  variant = "brown",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: GradientVariant;
}) {
  return (
    <Link
      href={href}
      className={cn(getGradientButtonClassName(variant), className)}
    >
      <GradientButtonInner>{children}</GradientButtonInner>
    </Link>
  );
}

export function GradientActionButton({
  children,
  className,
  variant = "brown",
  ...props
}: React.ComponentProps<"button"> & { variant?: GradientVariant }) {
  return (
    <button
      type="button"
      className={cn(getGradientButtonClassName(variant), className)}
      {...props}
    >
      <GradientButtonInner>{children}</GradientButtonInner>
    </button>
  );
}
