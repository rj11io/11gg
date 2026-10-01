import { Icons, Sprites } from "@pkmn/img"
import type { CSSProperties } from "react"

import type { PokemonSet, PokepasteSpec, StatKey } from "@content/blocks/pokepaste"
import { statKeys } from "@content/blocks/pokepaste"

import { CopyCodeButton } from "../copy-code-button"

/**
 * Where sprites come from. The default is the Pokémon Showdown sprite host,
 * addressed by name through @pkmn/img, which knows every form's filename.
 * Showdown asks heavy users to host their own copy; set this variable at
 * build time to a mirror with the same layout and nothing else changes. The
 * NEXT_PUBLIC prefix makes Next inline it in the browser bundle too, where
 * the team viewer tool renders these cards.
 */
const spriteDomain = process.env.NEXT_PUBLIC_POKEPASTE_SPRITE_HOST ?? "play.pokemonshowdown.com"

const statNames: Record<StatKey, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
}

/** Tera type badge colour. Tokens live in globals.css under --type-*. */
function typeColor(type: string) {
  return `var(--type-${type.toLowerCase().replace(/[^a-z]/g, "")}, var(--muted))`
}

function statLine(stats: Record<StatKey, number>, ignore: number) {
  return statKeys
    .filter((key) => stats[key] !== ignore)
    .map((key) => `${stats[key]} ${statNames[key]}`)
    .join(" / ")
}

function SetCard({ set }: { set: PokemonSet }) {
  const sprite = Sprites.getPokemon(set.species, {
    gen: "ani",
    shiny: set.shiny,
    gender: set.gender,
    domain: spriteDomain,
  })
  const item = set.item ? Icons.getItem(set.item, { domain: spriteDomain }) : undefined
  const evs = statLine(set.evs, 0)
  const ivs = statLine(set.ivs, 31)

  return (
    <li className="flex flex-col gap-3 border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-20 shrink-0 items-center justify-center bg-muted/40">
          {/* A plain image, like every content image: remote host, no optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sprite.url}
            width={sprite.w}
            height={sprite.h}
            alt={`${set.species} sprite`}
            loading="lazy"
            className={sprite.pixelated ? "[image-rendering:pixelated]" : undefined}
          />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            {set.nickname ? `${set.nickname} (${set.species})` : set.species}
            {set.gender ? <span className="ml-1 text-muted-foreground">{set.gender === "F" ? "♀" : "♂"}</span> : null}
          </p>
          {set.item ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              {item ? <span aria-hidden="true" style={item.css as CSSProperties} /> : null}
              {set.item}
            </p>
          ) : null}
          <p className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {set.teraType ? (
              <span
                className="px-1.5 py-0.5 font-medium text-black"
                style={{ backgroundColor: typeColor(set.teraType) }}
              >
                Tera {set.teraType}
              </span>
            ) : null}
            {set.level ? <span className="bg-muted px-1.5 py-0.5 text-muted-foreground">Lv. {set.level}</span> : null}
            {set.shiny ? <span className="bg-muted px-1.5 py-0.5 text-muted-foreground">Shiny</span> : null}
          </p>
        </div>
      </div>
      <dl className="grid gap-1 text-sm">
        {set.ability ? (
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-muted-foreground">Ability</dt><dd className="text-foreground">{set.ability}</dd></div>
        ) : null}
        {set.nature ? (
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-muted-foreground">Nature</dt><dd className="text-foreground">{set.nature}</dd></div>
        ) : null}
        {evs ? (
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-muted-foreground">EVs</dt><dd className="text-foreground">{evs}</dd></div>
        ) : null}
        {ivs ? (
          <div className="flex gap-2"><dt className="w-14 shrink-0 text-muted-foreground">IVs</dt><dd className="text-foreground">{ivs}</dd></div>
        ) : null}
      </dl>
      {set.moves.length ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-foreground">
          {set.moves.map((move) => (
            <li key={move} className="before:mr-1.5 before:text-primary before:content-['▸']">{move}</li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}

/**
 * Server component: the cards are plain HTML and images, nothing runs in the
 * browser except the copy button. The raw paste travels with the block so a
 * reader can copy it straight into a team builder.
 */
export function PokepasteBlock({ spec, code }: { spec: PokepasteSpec; code: string }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {spec.sets.length === 1 ? "1 set" : `${spec.sets.length} sets`}
          {spec.format ? ` · ${spec.format}` : ""}
        </p>
        <CopyCodeButton code={code} />
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {spec.sets.map((set, index) => (
          <SetCard key={`${set.species}-${index}`} set={set} />
        ))}
      </ul>
    </div>
  )
}
