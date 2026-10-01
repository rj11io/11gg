# 11gg

The gaming and esports vertical of rj11.io, at gg.rj11.io. Built on the 11blog platform: the writing lives in TypeScript under `content/`, a Next.js app in `v0/www/` imports it and builds every page ahead of time. No database, no CMS. Publishing is a commit and a build.

The repository is public, under the Apache License 2.0. The platform manual it carries is a draft, shown in development and preview builds only.

## Repository layout

- `content/`: authors, publications, posts, routes, validation. Depends on nothing in `v0/www`.
- `v0/www/`: the Next.js web application. Imports `content/` through the `@content/*` path alias.

The dependency runs one way. Never import from `v0/www` inside `content/`.

`content/registry.ts` holds two publications: Monthly gaming releases, published, and Blog platform docs, a draft shown in development only.

## Run the site

```bash
cd v0/www
npm install
npm run dev
```

Open the URL it prints. Every blog address lives under `/blog`; the root redirects there until a landing page exists. Checks, all from `v0/www`:

```bash
npm run lint
npm run typecheck
npm run build
```

Run all three before committing. Only `build` runs the content validator.

## Documentation

The platform documents itself in the Blog platform docs publication under `content/publications/blog-platform-docs/`. Where a post names 11blog or blog.rj11.io, read it as the example it is. Start with Working with the platform.

Working in this repo as a person or an agent: read [AGENTS.md](./AGENTS.md) first.
