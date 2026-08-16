"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { ModelUsageSummary } from "@/types/api";

// dataviz skill's validated 8-slot categorical order (dark-surface steps —
// this app is dark-by-default and the hues stay legible on the light card
// surface too).
const CATEGORICAL = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];

export function CostChart({ data }: { data: ModelUsageSummary[] }) {
  const chartData = data.map((row, i) => ({
    name: row.model_name,
    cost: Number(row.total_cost_usd.toFixed(4)),
    color: CATEGORICAL[i % CATEGORICAL.length],
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--secondary) / 0.4)" }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value: number) => [`$${value}`, "Cost"]}
          />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]} maxBarSize={56}>
            <LabelList dataKey="cost" position="top" style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} formatter={(v: number) => `$${v}`} />
            {chartData.map((entry, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
