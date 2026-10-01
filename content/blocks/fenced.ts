/**
 * Finds fenced code blocks in a Markdown string. Used by the validator at
 * build time, so a block component with bad data fails the build instead of
 * rendering an error box. The renderer never calls this: react-markdown parses
 * the fence itself and hands the component the code.
 *
 * A fence is three or more backticks or tildes at the start of a line, with an
 * optional info string. The block ends at a line of the same character, at
 * least as long. The language is the first word of the info string.
 */
export type FencedBlock = {
  language: string
  code: string
  /** 1-based count of fences with this language, for error messages. */
  ordinal: number
}

const fencePattern = /^(`{3,}|~{3,})[ \t]*([^\s`]*)[^\n]*\n([\s\S]*?)\n\1[ \t]*$/gm

export function extractFencedBlocks(content: string): FencedBlock[] {
  const counts = new Map<string, number>()
  const blocks: FencedBlock[] = []

  for (const match of content.matchAll(fencePattern)) {
    const language = match[2].toLowerCase()
    const ordinal = (counts.get(language) ?? 0) + 1
    counts.set(language, ordinal)
    blocks.push({ language, code: match[3], ordinal })
  }

  return blocks
}
