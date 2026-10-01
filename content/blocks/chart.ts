/**
 * The chart block: a fenced code block with the language "chart" whose body is
 * JSON. Parsed here, in the content layer, so the validator and the renderer
 * agree on one definition and the build fails on bad data.
 *
 * ~~~chart
 * { "type": "bar", "data": [{ "month": "Jan", "visits": 120 }] }
 * ~~~
 */
export const chartTypes = [
  "bar",
  "line",
  "area",
  "pie",
  "radar",
  "radial",
] as const

export type ChartType = (typeof chartTypes)[number]

export const chartCurves = ["monotone", "linear", "natural", "step"] as const

export type ChartCurve = (typeof chartCurves)[number]

export type ChartSeries = {
  key: string
  label: string
  color: string
}

export type ChartRow = Record<string, string | number>

export type ChartSpec = {
  type: ChartType
  title?: string
  description?: string
  /** Key of the category field, present as a string in every row. */
  x: string
  /** Numeric fields to draw, in order. Pie and radial charts use the first. */
  series: ChartSeries[]
  data: ChartRow[]
  stacked: boolean
  curve: ChartCurve
  legend: boolean
  grid: boolean
  /** Bars drawn left to right instead of bottom to top. */
  horizontal: boolean
  /** Pie drawn as a ring. */
  donut: boolean
  /** Suffix shown after values in tooltips, for example "%" or " ms". */
  unit: string
}

/** The five chart tokens from the design system, cycled across series. */
const defaultColors = [1, 2, 3, 4, 5].map((n) => `var(--chart-${n})`)

const keyPattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/

function fail(message: string): never {
  throw new Error(message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function optionalString(
  input: Record<string, unknown>,
  key: string
): string | undefined {
  const value = input[key]
  if (value === undefined) return undefined
  if (typeof value !== "string") fail(`${key} must be a string`)
  return value
}

function optionalBoolean(
  input: Record<string, unknown>,
  key: string,
  fallback: boolean
): boolean {
  const value = input[key]
  if (value === undefined) return fallback
  if (typeof value !== "boolean") fail(`${key} must be true or false`)
  return value
}

export function parseChartBlock(code: string): ChartSpec {
  let input: unknown
  try {
    input = JSON.parse(code)
  } catch (error) {
    fail(`not valid JSON (${(error as Error).message})`)
  }
  if (!isRecord(input)) fail("must be a JSON object")

  const type = input.type
  if (typeof type !== "string" || !chartTypes.includes(type as ChartType)) {
    fail(`type must be one of ${chartTypes.join(", ")}`)
  }

  const data = input.data
  if (!Array.isArray(data) || data.length === 0) {
    fail("data must be a non-empty array")
  }
  const rows = data.map((row, index) => {
    if (!isRecord(row)) fail(`data[${index}] must be an object`)
    for (const [key, value] of Object.entries(row)) {
      if (!keyPattern.test(key)) {
        fail(`data[${index}] has key "${key}", keys are letters, digits, _ and -`)
      }
      if (typeof value !== "string" && typeof value !== "number") {
        fail(`data[${index}].${key} must be a string or a number`)
      }
      if (typeof value === "number" && !Number.isFinite(value)) {
        fail(`data[${index}].${key} must be a finite number`)
      }
    }
    return row as ChartRow
  })

  const firstRow = rows[0]
  let x = optionalString(input, "x")
  if (x === undefined) {
    x = Object.keys(firstRow).find((key) => typeof firstRow[key] === "string")
    if (!x) fail("no string field found for x, add one or set x")
  }
  for (const [index, row] of rows.entries()) {
    if (typeof row[x] !== "string") {
      fail(`data[${index}].${x} must be a string, it is the category field`)
    }
  }

  const numericKeys = Object.keys(firstRow).filter(
    (key) => key !== x && typeof firstRow[key] === "number"
  )
  let seriesInput: unknown = input.series
  if (seriesInput === undefined) {
    if (numericKeys.length === 0) fail("no numeric field found for series")
    seriesInput = numericKeys.map((key) => ({ key }))
  }
  if (!Array.isArray(seriesInput) || seriesInput.length === 0) {
    fail("series must be a non-empty array")
  }
  const series: ChartSeries[] = seriesInput.map((entry, index) => {
    if (!isRecord(entry) || typeof entry.key !== "string") {
      fail(`series[${index}] needs a key`)
    }
    const key = entry.key
    if (key === x) fail(`series[${index}] uses the category field ${x}`)
    for (const [rowIndex, row] of rows.entries()) {
      if (typeof row[key] !== "number") {
        fail(`data[${rowIndex}].${key} must be a number, it is a series`)
      }
    }
    const label = optionalString(entry, "label") ?? key
    const color =
      optionalString(entry, "color") ?? defaultColors[index % defaultColors.length]
    return { key, label, color }
  })
  const seen = new Set<string>()
  for (const entry of series) {
    if (seen.has(entry.key)) fail(`series key ${entry.key} appears twice`)
    seen.add(entry.key)
  }

  const curve = optionalString(input, "curve") ?? "monotone"
  if (!chartCurves.includes(curve as ChartCurve)) {
    fail(`curve must be one of ${chartCurves.join(", ")}`)
  }

  return {
    type: type as ChartType,
    title: optionalString(input, "title"),
    description: optionalString(input, "description"),
    x,
    series,
    data: rows,
    stacked: optionalBoolean(input, "stacked", false),
    curve: curve as ChartCurve,
    legend: optionalBoolean(input, "legend", series.length > 1),
    grid: optionalBoolean(input, "grid", true),
    horizontal: optionalBoolean(input, "horizontal", false),
    donut: optionalBoolean(input, "donut", false),
    unit: optionalString(input, "unit") ?? "",
  }
}
