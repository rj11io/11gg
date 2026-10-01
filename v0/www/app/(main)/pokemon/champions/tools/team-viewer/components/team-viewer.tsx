"use client"

import { useMemo, useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { parsePokepasteBlock } from "@content/blocks/pokepaste"

import { PokepasteBlock } from "@/app/(main)/blog/components/blocks/pokepaste-block"

const sample = `Flutter Mane @ Booster Energy
Ability: Protosynthesis
Level: 50
Tera Type: Fairy
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
IVs: 0 Atk
- Moonblast
- Shadow Ball
- Icy Wind
- Protect

Incineroar @ Safety Goggles
Ability: Intimidate
Level: 50
Tera Type: Ghost
EVs: 252 HP / 4 Atk / 252 Def
Impish Nature
- Fake Out
- Knock Off
- Flare Blitz
- Parting Shot`

/**
 * Paste a team in the Showdown export format, see it as cards. The parser and
 * the cards are the ones the pokepaste block uses in posts, so what a reader
 * sees here is exactly what a post would show. Everything runs in the browser;
 * nothing is sent anywhere.
 */
export function TeamViewer() {
  const [text, setText] = useState(sample)
  const result = useMemo(() => {
    try {
      return { spec: parsePokepasteBlock(text), error: null }
    } catch (error) {
      return { spec: null, error: (error as Error).message }
    }
  }, [text])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <label htmlFor="team" className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Showdown export
        </label>
        <Textarea
          id="team"
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck={false}
          className="mt-2 min-h-96 font-mono text-sm"
        />
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          {result.error ? `Cannot read this yet: ${result.error}` : `${result.spec?.sets.length ?? 0} ${result.spec?.sets.length === 1 ? "set" : "sets"} read.`}
        </p>
      </div>
      <div>
        {result.spec ? <PokepasteBlock spec={result.spec} code={text} /> : null}
      </div>
    </div>
  )
}
