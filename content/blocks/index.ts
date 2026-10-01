import { extractFencedBlocks } from "./fenced"
import { parseChartBlock } from "./chart"
import { parseFlowBlock } from "./flow"
import { parsePokepasteBlock } from "./pokepaste"
import { parseMapBlock } from "./map"

/**
 * Fenced code blocks whose language names a component instead of a syntax.
 * The renderer routes them to a component; the validator parses every one at
 * build time with the same parser. Adding a block: a parser file beside this
 * one, an entry here, a component in v0/www/app/blog/components/blocks.
 */
export const blockParsers = {
  chart: parseChartBlock,
  flow: parseFlowBlock,
  pokepaste: parsePokepasteBlock,
  map: parseMapBlock,
} as const

export type BlockLanguage = keyof typeof blockParsers

export const blockLanguages = Object.keys(blockParsers) as BlockLanguage[]

export function isBlockLanguage(value: string): value is BlockLanguage {
  return value in blockParsers
}

/**
 * Throws on the first block that does not parse. The message names the post,
 * the language, and which block of that language it was, so a post with three
 * charts points at the broken one.
 */
export function validateContentBlocks(content: string, label: string) {
  for (const block of extractFencedBlocks(content)) {
    if (!isBlockLanguage(block.language)) continue
    try {
      blockParsers[block.language](block.code)
    } catch (error) {
      throw new Error(
        `${label}: ${block.language} block ${block.ordinal} ${(error as Error).message}`
      )
    }
  }
}
