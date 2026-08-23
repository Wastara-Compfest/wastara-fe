"use client";

import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend as ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { loadDefectTypeBreakdown } from "@/lib/review-data";

type BreakdownItem = {
  type: string;
  label: string;
  count: number;
  fill: string;
};

type TooltipPayload = {
  payload?: {
    fill?: string;
    label?: string;
    count?: number;
  };
};

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <span
          className="size-2 rounded-full"
          style={{ background: item?.fill }}
        />
        <span>{item?.label}</span>
        <span className="font-medium text-heading">{item?.count}</span>
      </div>
    </div>
  );
}

export function DefectPieChart() {
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    void loadDefectTypeBreakdown()
      .then(setBreakdown)
      .catch(() => setBreakdown([]));
  }, []);

  const pieConfig = Object.fromEntries(
    breakdown.map((item) => [item.type, { label: item.label, color: item.fill }]),
  ) satisfies ChartConfig;

  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="h-full bg-transparent">
      <CardHeader>
        <CardTitle>Defect by type</CardTitle>
        <p className="text-[13px] text-muted">{total} defects confirmed</p>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="py-12 text-center text-[13px] text-muted">
            No confirmed defects yet
          </p>
        ) : (
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square max-h-[240px] w-full"
          >
            <PieChart>
              <Tooltip content={<PieTooltip />} />
              <Pie
                data={breakdown}
                dataKey="count"
                nameKey="type"
                innerRadius={64}
                outerRadius={96}
                paddingAngle={1}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {breakdown.map((entry) => (
                  <Cell key={entry.type} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                content={({ payload }) => (
                  <ChartLegendContent payload={payload} />
                )}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function DefectBreakdownList() {
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    void loadDefectTypeBreakdown()
      .then(setBreakdown)
      .catch(() => setBreakdown([]));
  }, []);

  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="h-full bg-transparent">
      <CardHeader>
        <CardTitle>Breakdown</CardTitle>
        <p className="text-[13px] text-muted">Share per confirmed defect type</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {total === 0 ? (
          <p className="py-8 text-center text-[13px] text-muted">
            No confirmed defects yet
          </p>
        ) : (
          breakdown.map((item) => {
            const percent = Math.round((item.count / total) * 100);

            return (
              <div key={item.type}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: item.fill }}
                    />
                    <span className="truncate text-[14px] text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px]">
                    <span className="font-medium text-heading">{item.count}</span>
                    <span className="w-10 text-right text-muted">{percent}%</span>
                  </div>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-canvas">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      background: item.fill,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
