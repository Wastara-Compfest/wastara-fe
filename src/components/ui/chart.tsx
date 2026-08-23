"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-subtle [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-surface [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-none [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .filter(([, itemConfig]) => itemConfig.color)
          .map(
            ([key, itemConfig]) =>
              `[data-chart=${id}] .color-${key} { color: ${itemConfig.color}; } [data-chart=${id}] .fill-${key} { fill: ${itemConfig.color}; }`,
          )
          .join("\n"),
      }}
    />
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { fill?: string } }>;
  label?: string;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white px-3 py-2 text-xs shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      {label ? <p className="mb-1 font-medium text-foreground">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item, index) => {
          const key = item.name ?? "";
          const itemConfig = config[key];
          return (
            <div key={index} className="flex items-center gap-2 text-muted">
              <span
                className="size-2 rounded-full"
                style={{ background: item.payload?.fill }}
              />
              <span>{itemConfig?.label ?? key}</span>
              <span className="ml-auto font-medium text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({
  payload,
}: {
  payload?: ReadonlyArray<{ value?: string; color?: string }>;
}) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2">
      {payload.map((entry) => {
        const key = entry.value ?? "";
        const itemConfig = config[key];
        return (
          <div key={key} className="flex items-center gap-2 text-[13px] text-muted">
            <span
              className="size-2 rounded-full"
              style={{ background: entry.color }}
            />
            {itemConfig?.label ?? key}
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartStyle,
};
