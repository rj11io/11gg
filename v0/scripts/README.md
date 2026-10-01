# Scripts
Two scripts for copies of the platform, and the one file they share.

| script | use |
| --- | --- |
| `propagate.py` | make a new site: copy the platform, give it a name and an address, keep the manual as a draft, remove every other publication |
| `resync.py` | bring an existing copy up to this platform's code without touching its writing, sections, tools or redirects |
| `lib_identity.py` | the identity edits both scripts apply |

Both print the next command. Both are count-checked: an edit that cannot find what it expects stops with the reason instead of leaving a half-named site. The section tree is never touched by either; a sectioned site keeps its `v0/content/sections.ts`. Content moved under the version on 2026-10-01: `resync.py` moves a copy's root `content/` to `v0/content/` the first time it runs after that.
