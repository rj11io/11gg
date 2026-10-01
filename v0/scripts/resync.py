#!/usr/bin/env python3
"""Bring an existing copy up to this platform without touching its writing.

    python3 v0/scripts/resync.py --dest ../11gg --code 11gg --domain gg.rj11.io \\
        --feed "..." --landing "..." --eyebrow "..." --title "..." --hero "..."

Moves a copy's root content/ under v0/ the first time, then replaces v0/www
and the content core (blocks, types, validation, routes, section-tree,
markdown.d.ts, drafts, scripts) with this platform's, refreshes
the platform manual as a draft, then re-applies the site's identity. Keeps
the copy's publications, sections, resources, authors, redirects, tools
registry, every tool folder and its public/static/og folder. The fallback
preview image is none unless --og names the copy's own. Run npm ci, typecheck, lint and build after.
"""
import argparse
import os
import shutil
import subprocess

from lib_identity import apply_identity, draft_docs_publication

SRC = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXCLUDES = ["node_modules", ".next", "tsconfig.tsbuildinfo", ".DS_Store", ".env*", "public/static/og"]
KEEP_IN_WWW = ["lib/tools.ts", "next.config.ts"]
CORE = ["types.ts", "validation.ts", "routes.ts", "section-tree.ts", "markdown.d.ts", "drafts.ts"]

parser = argparse.ArgumentParser()
for name in ["dest", "code", "domain", "feed", "landing", "eyebrow", "title", "hero"]:
    parser.add_argument(f"--{name}", required=True)
parser.add_argument("--og", help="root-relative path of the copy's own fallback preview image, 1200 by 630. Omitted: none.")
args = parser.parse_args()
dest = os.path.abspath(args.dest)
www = os.path.join(dest, "v0", "www")
content = os.path.join(dest, "v0", "content")

# Content moved under the version on 2026-10-01. A copy made before that still
# has it at the root; move it once, before anything below reads the new path.
old_content = os.path.join(dest, "content")
if os.path.isdir(old_content) and not os.path.exists(content):
    shutil.move(old_content, content)
    print(f"moved {old_content} to {content}")

kept = {}
for rel in KEEP_IN_WWW:
    p = os.path.join(www, rel)
    if os.path.exists(p):
        kept[rel] = open(p, encoding="utf-8").read()
tool_dirs = []
main = os.path.join(www, "app", "(main)")
if os.path.isdir(main):
    for root, dirs, _ in os.walk(main):
        if os.path.basename(root) == "tools" and root != os.path.join(main, "tools"):
            for d in dirs:
                tool_dirs.append(os.path.join(root, d))
backup = os.path.join(dest, ".resync-tools")
shutil.rmtree(backup, ignore_errors=True)
for d in tool_dirs:
    shutil.copytree(d, os.path.join(backup, os.path.relpath(d, main)))

ex = [a for e in EXCLUDES for a in ("--exclude", e)]
subprocess.run(["rsync", "-a", "--delete", *ex, os.path.join(SRC, "v0", "www") + "/", www + "/"], check=True)
subprocess.run(["rsync", "-a", "--delete", os.path.join(SRC, "v0", "content", "blocks") + "/", os.path.join(content, "blocks") + "/"], check=True)
for f in CORE:
    shutil.copy(os.path.join(SRC, "v0", "content", f), os.path.join(content, f))
subprocess.run(["rsync", "-a", "--delete", os.path.join(SRC, "v0", "content", "publications", "blog-platform-docs") + "/", os.path.join(content, "publications", "blog-platform-docs") + "/"], check=True)
subprocess.run(["rsync", "-a", "--delete", os.path.join(SRC, "v0", "scripts") + "/", os.path.join(dest, "v0", "scripts") + "/"], check=True)
shutil.copy(os.path.join(SRC, "AGENTS.md"), os.path.join(dest, "AGENTS.md"))

for rel, content in kept.items():
    open(os.path.join(www, rel), "w", encoding="utf-8").write(content)
for d in tool_dirs:
    shutil.copytree(os.path.join(backup, os.path.relpath(d, main)), d, dirs_exist_ok=True)
shutil.rmtree(backup, ignore_errors=True)

apply_identity(dest, args.code, args.domain, args.feed, args.landing, {"eyebrow": args.eyebrow, "title": args.title, "description": args.hero}, keep_redirects=True, og=args.og)
draft_docs_publication(dest)
p = os.path.join(dest, "AGENTS.md")
s = open(p, encoding="utf-8").read()
line = [l for l in s.splitlines() if l.startswith("11blog is a personal blog.")]
if line:
    s = s.replace(line[0], f"{args.code} is built on the 11blog platform. The writing lives in TypeScript under `v0/content/`." + line[0].split("under `v0/content/`.", 1)[1], 1)
open(p, "w", encoding="utf-8").write(s)
print(f"{args.code} resynced at {dest}. Next: cd v0/www && npm ci && npm run typecheck && npm run lint && npm run build")
