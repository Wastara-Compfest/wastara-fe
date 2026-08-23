import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  bordered = false,
  ...props
}: React.ComponentProps<"div"> & { bordered?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white text-foreground",
        bordered && "border border-black/[0.06]",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-1 pt-1 pb-0", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-[14px] font-medium text-heading", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-[13px] text-muted", className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("pt-4", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
