# 11gg

The gaming and esports site of rj11.io, at gg.rj11.io. Built on the 11blog platform: the writing lives in TypeScript under `v0/content/`, a Next.js app in `v0/www/` imports it and builds every page ahead of time. No database, no CMS. Publishing is a commit and a build.

The repository is public, under the Apache License 2.0. The platform manual it carries is a draft, shown in development and preview builds only.

## Repository layout

- `v0/content/`: authors, publications, posts, routes, validation. Depends on nothing in `v0/www`.
- `v0/www/`: the Next.js web application. Imports `v0/content/` through the `@content/*` path alias.

The dependency runs one way. Never import from `v0/www` inside `v0/content/`.

`v0/content/registry.ts` holds six publications: 2026 monthly gaming releases under gaming, Chapter 7: Season 4 news and updates under fortnite, WoW Forever pre-release news and updates under world-of-warcraft/forever, 2026 Pokémon Champions news and updates under pokemon/champions, 2026 FNCS and majors coverage under fortnite/competitive, and Blog platform docs, a draft shown in development only.

The Fortnite Competitive hub is at `/fortnite/competitive`. Its blog includes the 2026 FNCS and majors coverage publication, with an initial event guide and seven event articles.

## Run the site

```bash
cd v0/www
npm install
npm run dev
```

Open the URL it prints. The root is the gg landing; every section lives at its own path, with its blog under `/blog`. Checks, all from `v0/www`:

```bash
npm run lint
npm run typecheck
npm run build
```

Run all three before committing. Only `build` runs the content validator.

## Documentation

The platform documents itself in the Blog platform docs publication under `v0/content/publications/blog-platform-docs/`. Where a post names 11blog or blog.rj11.io, read it as the example it is. Start with Working with the platform.

Working in this repo as a person or an agent: read [AGENTS.md](./AGENTS.md) first.
