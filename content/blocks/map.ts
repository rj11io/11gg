/**
 * The map block: a fenced code block with the language "map" whose body is
 * JSON with a centre or a set of points, markers, an optional route line, an
 * optional area, and optional circles sized by a value.
 *
 * ~~~map
 * { "markers": [{ "lat": 38.72, "lng": -9.14, "title": "Lisbon" }] }
 * ~~~
 */
export type LatLng = [number, number]

export type MapMarker = {
  lat: number
  lng: number
  title: string
  description?: string
  /** Up to three characters drawn inside the pin, for numbered routes. */
  label?: string
}

export type MapCircle = {
  lat: number
  lng: number
  title: string
  /** Positive. Circles are sized relative to the largest value in the block. */
  value: number
}

export type MapSpec = {
  title?: string
  description?: string
  /** Omitted: the map fits every point in the block. */
  center?: LatLng
  zoom: number
  height: number
  markers: MapMarker[]
  line: LatLng[]
  area: LatLng[]
  circles: MapCircle[]
  zoomControl: boolean
}

function fail(message: string): never {
  throw new Error(message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function latLng(value: unknown, label: string): LatLng {
  if (!Array.isArray(value) || value.length !== 2) fail(`${label} must be [lat, lng]`)
  const [lat, lng] = value
  return [checkLat(lat, label), checkLng(lng, label)]
}

function checkLat(value: unknown, label: string): number {
  if (typeof value !== "number" || value < -90 || value > 90) {
    fail(`${label} lat must be a number from -90 to 90`)
  }
  return value
}

function checkLng(value: unknown, label: string): number {
  if (typeof value !== "number" || value < -180 || value > 180) {
    fail(`${label} lng must be a number from -180 to 180`)
  }
  return value
}

function requireString(input: Record<string, unknown>, key: string, label: string): string {
  const value = input[key]
  if (typeof value !== "string" || !value.trim()) fail(`${label}.${key} must be a non-empty string`)
  return value
}

function optionalString(input: Record<string, unknown>, key: string, label: string): string | undefined {
  const value = input[key]
  if (value === undefined) return undefined
  if (typeof value !== "string") fail(`${label}.${key} must be a string`)
  return value
}

function points(value: unknown, key: string, min: number): LatLng[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) fail(`${key} must be an array of [lat, lng]`)
  if (value.length < min) fail(`${key} needs at least ${min} points`)
  return value.map((entry, index) => latLng(entry, `${key}[${index}]`))
}

export function parseMapBlock(code: string): MapSpec {
  let input: unknown
  try {
    input = JSON.parse(code)
  } catch (error) {
    fail(`not valid JSON (${(error as Error).message})`)
  }
  if (!isRecord(input)) fail("must be a JSON object")

  const center = input.center === undefined ? undefined : latLng(input.center, "center")

  const zoom = input.zoom ?? 12
  if (typeof zoom !== "number" || zoom < 1 || zoom > 19) fail("zoom must be a number from 1 to 19")

  const height = input.height ?? 360
  if (typeof height !== "number" || height < 200 || height > 900) {
    fail("height must be a number between 200 and 900")
  }

  const markersInput = input.markers ?? []
  if (!Array.isArray(markersInput)) fail("markers must be an array")
  const markers: MapMarker[] = markersInput.map((entry, index) => {
    const label = `markers[${index}]`
    if (!isRecord(entry)) fail(`${label} must be an object`)
    const pin = optionalString(entry, "label", label)
    if (pin !== undefined && (pin.length === 0 || pin.length > 3)) {
      fail(`${label}.label must be one to three characters`)
    }
    return {
      lat: checkLat(entry.lat, label),
      lng: checkLng(entry.lng, label),
      title: requireString(entry, "title", label),
      description: optionalString(entry, "description", label),
      label: pin,
    }
  })

  const circlesInput = input.circles ?? []
  if (!Array.isArray(circlesInput)) fail("circles must be an array")
  const circles: MapCircle[] = circlesInput.map((entry, index) => {
    const label = `circles[${index}]`
    if (!isRecord(entry)) fail(`${label} must be an object`)
    const value = entry.value
    if (typeof value !== "number" || !(value > 0)) fail(`${label}.value must be a positive number`)
    return {
      lat: checkLat(entry.lat, label),
      lng: checkLng(entry.lng, label),
      title: requireString(entry, "title", label),
      value,
    }
  })

  const line = points(input.line, "line", 2)
  const area = points(input.area, "area", 3)

  if (!center && markers.length === 0 && circles.length === 0 && line.length === 0 && area.length === 0) {
    fail("needs a center, or at least one marker, circle, line or area to fit")
  }

  const zoomControl = input.zoomControl ?? true
  if (typeof zoomControl !== "boolean") fail("zoomControl must be true or false")

  return {
    title: optionalString(input, "title", "map"),
    description: optionalString(input, "description", "map"),
    center,
    zoom,
    height,
    markers,
    line,
    area,
    circles,
    zoomControl,
  }
}
