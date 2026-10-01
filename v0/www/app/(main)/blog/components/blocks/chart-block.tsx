"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartRow, ChartSpec } from "@content/blocks/chart"

import { useReducedMotion } from "./use-reduced-motion"

/**
 * Draws one parsed chart spec with recharts through the shadcn chart wrapper,
 * so colours, tooltips and legends match the rest of the interface. Runs in
 * the browser: recharts measures its container. Animation follows the
 * reader's reduced-motion setting.
 */
export function ChartBlock({ spec }: { spec: ChartSpec }) {
  const reducedMotion = useReducedMotion()
  const animate = !reducedMotion
  const formatValue = (value: unknown) =>
    typeof value === "number" ? `${value.toLocaleString()}${spec.unit}` : String(value)

  if (spec.type === "pie" || spec.type === "radial") {
    return <PolarSingleSeries spec={spec} animate={animate} formatValue={formatValue} />
  }

  const config = Object.fromEntries(
    spec.series.map((series) => [series.key, { label: series.label, color: series.color }])
  ) satisfies ChartConfig

  const tooltip = (
    <ChartTooltip
      cursor={spec.type !== "radar"}
      content={
        <ChartTooltipContent
          indicator={spec.type === "line" ? "line" : "dot"}
          formatter={(value, name) => (
            <span className="flex w-full justify-between gap-4">
              <span className="text-muted-foreground">{config[String(name)]?.label ?? name}</span>
              <span className="font-mono font-medium text-foreground tabular-nums">{formatValue(value)}</span>
            </span>
          )}
        />
      }
    />
  )
  const legend = spec.legend ? <ChartLegend content={<ChartLegendContent />} /> : null

  if (spec.type === "radar") {
    return (
      <ChartContainer config={config} className="mx-auto aspect-square max-h-80">
        <RadarChart data={spec.data} accessibilityLayer>
          <PolarGrid />
          <PolarAngleAxis dataKey={spec.x} />
          {tooltip}
          {spec.series.map((series) => (
            <Radar
              key={series.key}
              dataKey={series.key}
              fill={`var(--color-${series.key})`}
              fillOpacity={0.35}
              stroke={`var(--color-${series.key})`}
              isAnimationActive={animate}
            />
          ))}
          {legend}
        </RadarChart>
      </ChartContainer>
    )
  }

  const axes = spec.horizontal ? (
    <>
      <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis dataKey={spec.x} type="category" tickLine={false} axisLine={false} tickMargin={8} width={80} />
    </>
  ) : (
    <>
      <XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
    </>
  )
  const grid = spec.grid ? <CartesianGrid vertical={false} strokeDasharray="3 3" /> : null
  const stackId = spec.stacked ? "stack" : undefined

  if (spec.type === "bar") {
    return (
      <ChartContainer config={config}>
        <BarChart data={spec.data} layout={spec.horizontal ? "vertical" : "horizontal"} accessibilityLayer>
          {grid}
          {axes}
          {tooltip}
          {legend}
          {spec.series.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              fill={`var(--color-${series.key})`}
              stackId={stackId}
              radius={2}
              isAnimationActive={animate}
            />
          ))}
        </BarChart>
      </ChartContainer>
    )
  }

  if (spec.type === "area") {
    return (
      <ChartContainer config={config}>
        <AreaChart data={spec.data} accessibilityLayer>
          {grid}
          {axes}
          {tooltip}
          {legend}
          {spec.series.map((series) => (
            <Area
              key={series.key}
              dataKey={series.key}
              type={spec.curve}
              fill={`var(--color-${series.key})`}
              fillOpacity={0.3}
              stroke={`var(--color-${series.key})`}
              stackId={stackId}
              isAnimationActive={animate}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer config={config}>
      <LineChart data={spec.data} accessibilityLayer>
        {grid}
        {axes}
        {tooltip}
        {legend}
        {spec.series.map((series) => (
          <Line
            key={series.key}
            dataKey={series.key}
            type={spec.curve}
            stroke={`var(--color-${series.key})`}
            strokeWidth={2}
            dot={false}
            isAnimationActive={animate}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

/**
 * Pie and radial charts show one series split by category, so every row gets
 * its own colour and the legend lists categories, not series.
 */
function PolarSingleSeries({
  spec,
  animate,
  formatValue,
}: {
  spec: ChartSpec
  animate: boolean
  formatValue: (value: unknown) => string
}) {
  const [series] = spec.series
  const palette = spec.series.length > 1
    ? spec.series.map((entry) => entry.color)
    : [1, 2, 3, 4, 5].map((n) => `var(--chart-${n})`)
  const rows: Array<ChartRow & { fill: string }> = spec.data.map((row, index) => ({
    ...row,
    fill: palette[index % palette.length],
  }))
  const config = Object.fromEntries(
    rows.map((row) => [
      String(row[spec.x]),
      { label: String(row[spec.x]), color: row.fill },
    ])
  ) satisfies ChartConfig

  const tooltip = (
    <ChartTooltip
      content={
        <ChartTooltipContent
          nameKey={spec.x}
          hideLabel
          formatter={(value, name) => (
            <span className="flex w-full justify-between gap-4">
              <span className="text-muted-foreground">{String(name)}</span>
              <span className="font-mono font-medium text-foreground tabular-nums">{formatValue(value)}</span>
            </span>
          )}
        />
      }
    />
  )
  const legend = spec.legend ? (
    <ChartLegend content={<ChartLegendContent nameKey={spec.x} />} />
  ) : null

  if (spec.type === "radial") {
    return (
      <ChartContainer config={config} className="mx-auto aspect-square max-h-80">
        <RadialBarChart data={rows} innerRadius={30} outerRadius={120} accessibilityLayer>
          {tooltip}
          <RadialBar dataKey={series.key} background cornerRadius={4} isAnimationActive={animate} />
          {legend}
        </RadialBarChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-80">
      <PieChart accessibilityLayer>
        {tooltip}
        <Pie
          data={rows}
          dataKey={series.key}
          nameKey={spec.x}
          innerRadius={spec.donut ? 60 : 0}
          strokeWidth={2}
          isAnimationActive={animate}
        />
        {legend}
      </PieChart>
    </ChartContainer>
  )
}
