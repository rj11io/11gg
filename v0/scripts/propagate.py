#!/usr/bin/env python3
"""Make a new site from this platform.

    python3 v0/scripts/propagate.py --dest ../11gg --code 11gg --domain gg.rj11.io \\
        --about "The gaming and esports vertical of rj11.io." \\
        --feed "Gaming and esports. Editorial content lives in TypeScript." \\
        --landing "Release calendars and a section per game." \\
        --eyebrow "Gaming and esports" --title "The gaming side of rj11.io." \\
        --hero "Release calendars every month, and a section for each game we follow."

Copies the platform without node_modules, builds and env files, then makes it
the named site: addresses, names, feed, landing copy, an empty redirect list,
the platform manual kept as a draft and every other publication removed, no
fallback preview image. The section tree stays the root alone; edit content/sections.ts afterwards. Run
npm ci, typecheck, lint and build in v0/www when it is done.
"""
import argparse
import os
import re
import shutil
import subprocess

from lib_identity import apply_identity, draft_docs_publication, set_registry

SRC = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXCLUDES = ["node_modules", ".next", "tsconfig.tsbuildinfo", ".DS_Store", ".env*"]

parser = argparse.ArgumentParser()
for name in ["dest", "code", "domain", "about", "feed", "landing", "eyebrow", "title", "hero"]:
    parser.add_argument(f"--{name}", required=True)
args = parser.parse_args()
dest = os.path.abspath(args.dest)
os.makedirs(os.path.join(dest, "v0"), exist_ok=True)

ex = [a for e in EXCLUDES for a in ("--exclude", e)]
subprocess.run(["rsync", "-a", *ex, *[os.path.join(SRC, p) for p in [".github", ".gitignore", ".releaserc.js", "LICENSE", "package.json", "AGENTS.md", ".claude", "content"]], dest + "/"], check=True)
subprocess.run(["rsync", "-a", *ex, os.path.join(SRC, "v0", "www"), os.path.join(dest, "v0") + "/"], check=True)
subprocess.run(["rsync", "-a", os.path.join(SRC, "v0", "scripts"), os.path.join(dest, "v0") + "/"], check=True)

apply_identity(dest, args.code, args.domain, args.feed, args.landing, {"eyebrow": args.eyebrow, "title": args.title, "description": args.hero})
shutil.rmtree(os.path.join(dest, "v0", "www", "public", "static", "og"), ignore_errors=True)

p = os.path.join(dest, "package.json")
s = open(p, encoding="utf-8").read().replace('"name": "@rj11io/11blog"', f'"name": "@rj11io/{args.code}"')
s = re.sub(r'"version": "[^"]+"', '"version": "0.0.0"', s, count=1)
open(p, "w", encoding="utf-8").write(s)
open(os.path.join(dest, "CHANGELOG.md"), "w", encoding="utf-8").write("# Changelog\n\nWritten by the release workflow from commit messages. Nothing released yet.\n")
open(os.path.join(dest, "README.md"), "w", encoding="utf-8").write(f"""# {args.code}

{args.about} Built on the 11blog platform: the writing lives in TypeScript under `content/`, a Next.js app in `v0/www/` imports it and builds every page ahead of time. No database, no CMS. Publishing is a commit and a build.

The platform manual it carries is a draft, shown in development and preview builds only.

## Run the site

```bash
cd v0/www
npm install
npm run dev
```

Checks, all from `v0/www`: `npm run lint`, `npm run typecheck`, `npm run build`. Only `build` runs the content validator.

Working in this repo as a person or an agent: read [AGENTS.md](./AGENTS.md) first.
""")
p = os.path.join(dest, "AGENTS.md")
s = open(p, encoding="utf-8").read().replace("11blog is a personal blog. The writing lives in TypeScript under `content/`.", f"{args.code} is {args.about[0].lower() + args.about[1:]} Built on the 11blog platform. The writing lives in TypeScript under `content/`.", 1)
open(p, "w", encoding="utf-8").write(s)

pubs = os.path.join(dest, "content", "publications")
for d in os.listdir(pubs):
    if d != "blog-platform-docs" and os.path.isdir(os.path.join(pubs, d)):
        shutil.rmtree(os.path.join(pubs, d))
set_registry(dest, [("blogPlatformDocs", "blog-platform-docs")])
draft_docs_publication(dest)
print(f"{args.code} propagated to {dest}. Next: cd v0/www && npm ci && npm run typecheck && npm run lint && npm run build")
