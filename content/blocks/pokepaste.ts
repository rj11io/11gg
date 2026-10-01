/**
 * The pokepaste block: a fenced code block with the language pokepaste whose
 * body is a team in the Pokémon Showdown export format, the text pokepast.es
 * and the Showdown team builder exchange. Parsed here so the validator and
 * the renderer agree, and so a typo in a stat line fails the build.
 *
 * ~~~pokepaste
 * Flutter Mane @ Booster Energy
 * Ability: Protosynthesis
 * Tera Type: Fairy
 * EVs: 4 HP / 252 SpA / 252 Spe
 * Timid Nature
 * - Moonblast
 * - Shadow Ball
 * ~~~
 */
export const statKeys = ["hp", "atk", "def", "spa", "spd", "spe"] as const

export type StatKey = (typeof statKeys)[number]

export type Stats = Record<StatKey, number>

export type PokemonSet = {
  species: string
  nickname?: string
  gender?: "M" | "F"
  item?: string
  ability?: string
  level?: number
  shiny: boolean
  teraType?: string
  nature?: string
  evs: Stats
  ivs: Stats
  moves: string[]
}

export type PokepasteSpec = {
  title?: string
  format?: string
  sets: PokemonSet[]
}

const statLabels: Record<string, StatKey> = {
  hp: "hp",
  atk: "atk",
  def: "def",
  spa: "spa",
  spd: "spd",
  spe: "spe",
}

function fail(message: string): never {
  throw new Error(message)
}

function emptyStats(fill: number): Stats {
  return { hp: fill, atk: fill, def: fill, spa: fill, spd: fill, spe: fill }
}

function parseStats(value: string, kind: "EVs" | "IVs", setLabel: string): Stats {
  const max = kind === "EVs" ? 252 : 31
  const stats = emptyStats(kind === "EVs" ? 0 : 31)
  for (const part of value.split("/")) {
    const match = part.trim().match(/^(\d+)\s+([A-Za-z]+)$/)
    if (!match) fail(`${setLabel} ${kind} line has an unreadable part "${part.trim()}"`)
    const amount = Number(match[1])
    const key = statLabels[match[2].toLowerCase()]
    if (!key) fail(`${setLabel} ${kind} line names an unknown stat "${match[2]}"`)
    if (amount > max) fail(`${setLabel} ${kind} ${match[2]} is ${amount}, the most is ${max}`)
    stats[key] = amount
  }
  return stats
}

/** First line of a set: "Nickname (Species) (F) @ Item", every part optional but the species. */
function parseHeader(line: string, setLabel: string): Pick<PokemonSet, "species" | "nickname" | "gender" | "item"> {
  let rest = line
  let item: string | undefined
  const at = rest.indexOf(" @ ")
  if (at >= 0) {
    item = rest.slice(at + 3).trim()
    rest = rest.slice(0, at).trim()
    if (!item || item === "No Item") item = undefined
  }
  let gender: "M" | "F" | undefined
  const genderMatch = rest.match(/\s\((M|F)\)$/)
  if (genderMatch) {
    gender = genderMatch[1] as "M" | "F"
    rest = rest.slice(0, -genderMatch[0].length).trim()
  }
  let species = rest
  let nickname: string | undefined
  const nicknameMatch = rest.match(/^(.+?)\s\(([^()]+)\)$/)
  if (nicknameMatch) {
    nickname = nicknameMatch[1].trim()
    species = nicknameMatch[2].trim()
  }
  if (!species) fail(`${setLabel} has no species on its first line`)
  return { species, nickname, gender, item }
}

export function parsePokepasteBlock(code: string): PokepasteSpec {
  const lines = code.replace(/\r\n/g, "\n").split("\n").map((line) => line.trimEnd())
  let title: string | undefined
  let format: string | undefined
  const chunks: string[][] = []
  let current: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    const header = line.match(/^===\s*(?:\[([^\]]+)\]\s*)?(.*?)\s*===$/)
    if (header && chunks.length === 0 && current.length === 0) {
      format = header[1] || undefined
      title = header[2] || undefined
      continue
    }
    if (!line) {
      if (current.length) chunks.push(current)
      current = []
      continue
    }
    current.push(line)
  }
  if (current.length) chunks.push(current)
  if (chunks.length === 0) fail("has no sets, a set starts with the species name")
  if (chunks.length > 6) fail(`has ${chunks.length} sets, a team holds at most six`)

  const sets: PokemonSet[] = chunks.map((chunk, index) => {
    const setLabel = `set ${index + 1}`
    const head = parseHeader(chunk[0], setLabel)
    const set: PokemonSet = {
      ...head,
      shiny: false,
      evs: emptyStats(0),
      ivs: emptyStats(31),
      moves: [],
    }
    for (const line of chunk.slice(1)) {
      const move = line.match(/^[-~]\s*(.+)$/)
      if (move) {
        set.moves.push(move[1].trim())
        continue
      }
      const field = line.match(/^([A-Za-z ]+):\s*(.*)$/)
      if (field) {
        const key = field[1].trim().toLowerCase()
        const value = field[2].trim()
        if (key === "ability" || key === "trait") set.ability = value
        else if (key === "level") {
          const level = Number(value)
          if (!Number.isInteger(level) || level < 1 || level > 100) {
            fail(`${setLabel} level must be a whole number from 1 to 100`)
          }
          set.level = level
        } else if (key === "shiny") set.shiny = value.toLowerCase() === "yes"
        else if (key === "tera type") set.teraType = value
        else if (key === "evs") set.evs = parseStats(value, "EVs", setLabel)
        else if (key === "ivs") set.ivs = parseStats(value, "IVs", setLabel)
        else if (
          key === "happiness" ||
          key === "pokeball" ||
          key === "hidden power" ||
          key === "dynamax level" ||
          key === "gigantamax"
        ) {
          // Accepted and ignored: valid export lines the cards do not show.
        } else fail(`${setLabel} has an unknown line "${line}"`)
        continue
      }
      const nature = line.match(/^([A-Za-z]+)\s+Nature$/i)
      if (nature) {
        set.nature = nature[1]
        continue
      }
      fail(`${setLabel} has an unreadable line "${line}"`)
    }
    if (set.moves.length > 4) fail(`${setLabel} has ${set.moves.length} moves, the most is four`)
    return set
  })

  return { title, format, sets }
}
