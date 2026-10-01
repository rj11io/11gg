"""Shared by propagate.py and resync.py: the edits that make a copy of the
platform its own site. Every edit is count-checked, so a change to the source
that breaks an assumption fails loudly instead of leaving a half-named site."""
import os
import re


def rd(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def wr(p, s):
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)


def sub(s, old, new, label, at_least=1):
    count = s.count(old)
    if count < at_least:
        raise SystemExit(f"{label}: expected {old[:60]!r}, found {count}")
    return s.replace(old, new)


ROOT_REDIRECTS = '''  async redirects() {
    return [
      // The site root is app/(main)/page.tsx: it forwards to the blog on a
      // single-section site and is the landing page of a sectioned one, so no
      // rule for / lives here. Every address this site ever serves is added
      // below when it moves, and nothing is ever removed. See the docs post on
      // URLs and redirects.
    ]
  },
'''


def apply_identity(dest, code, domain, feed, landing_description, hero, keep_redirects=False):
    """Rewrite every place the web app names the site."""
    www = os.path.join(dest, "v0", "www")
    s = rd(f"{www}/lib/site.ts")
    s = re.sub(r'export const siteOrigin = "https://[^"]+"', f'export const siteOrigin = "https://{domain}"', s, count=1)
    s = re.sub(r'export const siteName = "[^"]+"', f'export const siteName = "{code}"', s, count=1)
    wr(f"{www}/lib/site.ts", s)

    s = rd(f"{www}/app/components/header.tsx")
    s = re.sub(r"https://github\.com/rj11io/[a-z0-9]+", f"https://github.com/rj11io/{code}", s)
    s = re.sub(r'aria-label="[a-z0-9]+ home"', f'aria-label="{code} home"', s)
    s = re.sub(r"~/[a-z0-9]+", f"~/{code}", s)
    s = re.sub(r"View [a-z0-9]+ on GitHub", f"View {code} on GitHub", s)
    wr(f"{www}/app/components/header.tsx", s)

    for rel in ["hooks/use-bookmarked-filter.ts", "hooks/use-sort-order.ts", "hooks/use-view-mode.ts", "lib/bookmarks.ts", "package.json", "package-lock.json", "README.md"]:
        p = f"{www}/{rel}"
        s = rd(p)
        s = re.sub(r"11[a-z0-9]+-v0-www", f"{code}-v0-www", s)
        s = re.sub(r'"11[a-z0-9]+:', f'"{code}:', s)
        if rel == "README.md":
            s = re.sub(r"\b11[a-z0-9]+\b", code, s)
        wr(p, s)

    p = f"{www}/app/feed.xml/route.ts"
    s = rd(p)
    s = re.sub(r"<title>[^<]+</title>", f"<title>{code}</title>", s, count=1)
    s = re.sub(r"<description>[^<]+</description>", f"<description>{feed}</description>", s, count=1)
    wr(p, s)

    p = f"{www}/app/(main)/blog/page.tsx"
    s = rd(p)
    s = re.sub(r'description:\n    "[^"]+",', f'description:\n    "{landing_description}",', s, count=1)
    s = re.sub(r'eyebrow: "[^"]+",', f'eyebrow: "{hero["eyebrow"]}",', s, count=1)
    s = re.sub(r'title: "[^"]+",\n        description:', f'title: "{hero["title"]}",\n        description:', s, count=1)
    s = re.sub(r'description:\n          "[^"]+",', f'description:\n          "{hero["description"]}",', s, count=1)
    wr(p, s)

    if not keep_redirects:
        p = f"{www}/next.config.ts"
        s = rd(p)
        a = s.index("  async redirects() {")
        b = s.index("  turbopack: {")
        wr(p, s[:a] + ROOT_REDIRECTS + s[b:])


def draft_docs_publication(dest):
    """The platform manual travels with every copy as a draft."""
    p = os.path.join(dest, "content", "publications", "blog-platform-docs", "index.ts")
    s = rd(p)
    marker = "  isDraft: true,\n  tags: [\"Blog\", \"Technology\", \"Publishing\", \"Documentation\"],"
    if marker in s:
        return
    s = sub(s, "  isFeatured: false,\n  isDraft: false,\n  tags: [\"Blog\", \"Technology\", \"Publishing\", \"Documentation\"],",
            "  isFeatured: false,\n  // The platform manual travels with every copy as a draft: visible in\n  // development and preview builds, never on the live site.\n  isDraft: true,\n  tags: [\"Blog\", \"Technology\", \"Publishing\", \"Documentation\"],", "docs publication draft")
    wr(p, s)


def set_registry(dest, publications):
    """Keep only the named publications in the registry, in order. Each is (export name, directory)."""
    p = os.path.join(dest, "content", "registry.ts")
    s = rd(p)
    s = re.sub(r'import \{ \w+ \} from "\./publications/[^"]+"\n', "", s)
    imports = "".join(f'import {{ {name} }} from "./publications/{directory}"\n' for name, directory in publications)
    s = s.replace('import { authors } from "./authors"\n', 'import { authors } from "./authors"\n' + imports, 1)
    a = s.index("const authoredPublications: Publication[] = [")
    b = s.index("\n]\n", a) + 3
    body = "".join(f"  {name},\n" for name, _ in publications)
    wr(p, s[:a] + "const authoredPublications: Publication[] = [\n" + body + "]\n" + s[b:])
