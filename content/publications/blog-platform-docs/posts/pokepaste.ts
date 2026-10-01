export const pokepaste = `
# Pokepaste

A pokepaste block shows a Pokémon team the way pokepast.es does: one card per set, with the sprite, item, ability, Tera type, nature, EVs, IVs and moves. The body is the Pokémon Showdown export format, the text every team builder exports and imports, pasted as is into a fenced code block with the language pokepaste. Documentation map: [Working with the platform](/blog/blog-platform-docs/working-with-the-platform).

## A team

~~~pokepaste
=== [gen9vgc2025] Sample doubles core ===

Flutter Mane @ Booster Energy
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
- Parting Shot

Urshifu-Rapid-Strike @ Choice Scarf
Ability: Unseen Fist
Level: 50
Tera Type: Water
EVs: 252 Atk / 4 Def / 252 Spe
Jolly Nature
- Surging Strikes
- Close Combat
- Aqua Jet
- U-turn

Rillaboom @ Assault Vest
Ability: Grassy Surge
Level: 50
Tera Type: Fire
EVs: 252 HP / 252 Atk / 4 SpD
Adamant Nature
- Fake Out
- Grassy Glide
- Wood Hammer
- U-turn

Raging Bolt @ Life Orb
Ability: Protosynthesis
Level: 50
Tera Type: Electric
EVs: 252 HP / 252 SpA / 4 SpD
Modest Nature
IVs: 20 Atk
- Thunderclap
- Draco Meteor
- Volt Switch
- Protect

Landorus-Therian (M) @ Rocky Helmet
Ability: Intimidate
Level: 50
Tera Type: Water
EVs: 252 HP / 4 Atk / 252 Def
Impish Nature
- Stomping Tantrum
- Rock Slide
- U-turn
- Protect
~~~

The first line in the source is the Showdown team header, === [format] Team name ===. Optional. When present the name becomes the caption and the format the small label. The copy button hands back the raw text, so a reader can paste the team straight into a team builder.

## One set, every line

~~~pokepaste
Smogonbirb (Talonflame) (F) @ Sharp Beak
Ability: Gale Wings
Level: 50
Shiny: Yes
Tera Type: Flying
EVs: 252 Atk / 4 Def / 252 Spe
IVs: 0 SpA
Jolly Nature
- Brave Bird
- Flare Blitz
- Tailwind
- Protect
~~~

~~~text
Smogonbirb (Talonflame) (F) @ Sharp Beak
Ability: Gale Wings
Level: 50
Shiny: Yes
Tera Type: Flying
EVs: 252 Atk / 4 Def / 252 Spe
IVs: 0 SpA
Jolly Nature
- Brave Bird
- Flare Blitz
- Tailwind
- Protect
~~~

## The format

One set is a block of lines, sets are separated by a blank line, at most six to a team.

| Line | Shape | Notes |
| --- | --- | --- |
| First | Nickname (Species) (F) @ Item | Only the species is required. Gender is (M) or (F). "@ No Item" means none |
| Ability | Ability: Name | Trait: is accepted as the old spelling |
| Level | Level: 50 | 1 to 100. Shown as a badge |
| Shiny | Shiny: Yes | Only Yes counts |
| Tera type | Tera Type: Fairy | Shown as a coloured badge |
| EVs | EVs: 252 HP / 4 Def / 252 Spe | Stats not named are 0. Each at most 252. Zeros are not shown |
| IVs | IVs: 0 Atk | Stats not named are 31. Each at most 31. Thirty-ones are not shown |
| Nature | Jolly Nature | One word, then Nature |
| Moves | - Brave Bird | Up to four. A tilde works too |
| Ignored | Happiness, Pokeball, Hidden Power, Dynamax Level, Gigantamax | Valid export lines the cards do not show |

Any other line fails the build. The parser is content/blocks/pokepaste.ts; the rules above are the whole of it.

## Where the pictures come from

Three options were on the table.

- **PokeAPI.** The obvious source, with a clear fair use policy: cache what you request, keep request counts low, no formal rate limit since it moved to static hosting. Its sprites live in a GitHub repository addressed by national dex number, so showing a form such as Landorus-Therian means a name to number lookup first, and the newest items are missing. A runtime call per page would also go against the caching rule.
- **pokepast.es itself.** Its images are renders scraped from a service that no longer exists, with no licence. Not reused.
- **Pokémon Showdown's sprite host, addressed by name.** The animated sprites every battle simulator shows, with the newest forms, no number lookup, and a small library, @pkmn/img, that knows the filename rules. This is what the block uses. The ecosystem asks heavy users to host their own copy of the sprites to spare the volunteer-run host; a docs page with one team is light use, and the host is a single build-time setting, NEXT_PUBLIC_POKEPASTE_SPRITE_HOST, so a mirror with the same layout is a one-line change.

Zero runtime calls to any API: every image address is computed at build time from the species name, and the browser fetches images the way it fetches any image.

## What the reader gets

- Plain HTML cards: no JavaScript runs for the block except the copy button. See [How pages are rendered](/blog/blog-platform-docs/rendering-model).
- Sprites as ordinary images with alt text, lazy loaded.
- Tera type badges coloured by the classic type palette, kept as tokens in the stylesheet, see [Design tokens and theming](/blog/blog-platform-docs/design-tokens).
- The raw paste one click away.

## When the text is wrong

~~~text
blog-platform-docs/420: pokepaste block 1 set 3 EVs Spe is 300, the most is 252
~~~

The build stops with the post, the block, the set and the line. See [Content validation rules](/blog/blog-platform-docs/content-validation). The block mechanism is described in [Extending the renderer](/blog/blog-platform-docs/extending-the-renderer).
`
