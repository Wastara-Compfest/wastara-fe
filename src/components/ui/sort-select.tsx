"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SortSelectOption<T extends string> = {
  value: T;
  label: string;
};

type SortSelectProps<T extends string> = {
  value: T;
  options: SortSelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  menuFullWidth?: boolean;
};

export function SortSelect<T extends string>({
  value,
  options,
  onChange,
  className,
  menuFullWidth = false,
}: SortSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full min-w-[148px] items-center justify-between gap-3 rounded-lg bg-canvas py-2.5 pl-4 pr-3 text-[13px] text-foreground transition-colors",
          open && "bg-white",
        )}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-subtle transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className={cn(
            "absolute top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-[#e8eaed] bg-white py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
            menuFullWidth ? "inset-x-0 w-full" : "right-0 min-w-full",
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-canvas",
                    isSelected ? "font-medium text-heading" : "text-foreground",
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected ? <Check className="size-4 text-accent" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
