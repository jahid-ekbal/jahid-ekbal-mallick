"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/shadcnui/chart";

const dailyConfig = {
  pageviews: { label: "Pageviews", color: "var(--chart-2)" },
  visitors: { label: "Visitors", color: "var(--chart-1)" },
} satisfies ChartConfig;

const deviceColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type DailyPoint = { date: string; visitors: number; pageviews: number };
type DevicePoint = { name: string; count: number };

export function DailyTrafficChart({ data }: { data: DailyPoint[] }) {
  const sliced = data.slice(-30);
  if (sliced.length === 0) {
    return <p className="text-muted-foreground text-sm">No data yet.</p>;
  }
  return (
    <ChartContainer
      config={dailyConfig}
      className="h-[240px] w-full">
      <BarChart
        data={sliced}
        accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={32}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="pageviews"
          fill="var(--color-pageviews)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="visitors"
          fill="var(--color-visitors)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function DevicesChart({ data }: { data: DevicePoint[] }) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-sm">No data yet.</p>;
  }
  const config = Object.fromEntries(
    data.map((d, i) => [
      d.name,
      { label: d.name, color: deviceColors[i % deviceColors.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <ChartContainer
      config={config}
      className="h-[200px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={deviceColors[i % deviceColors.length]}
            />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}
