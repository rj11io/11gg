import { sectionTree } from "@content/registry"
import { toolsHrefFor } from "@content/routes"

/**
 * Every tool on the site, one line each. A tool is code: a route folder at
 * {section path}/tools/{id} with its own components and scripts, exactly like
 * any other module in the app. This list is what the section landing, the
 * tools index and the sitemap read; the folder is what the reader opens.
 *
 * Checked when the module loads, so a build fails on an entry whose section
 * does not exist or whose address is not under that section's tools path.
 */
export type Tool = {
  id: string
  sectionId: string
  title: string
  description: string
  /** Root-relative address of the tool's page. */
  href: string
}

export const tools: Tool[] = [
  {
    id: "team-viewer",
    sectionId: "pokemon-champions",
    title: "Team viewer",
    description: "Paste a Showdown export, see the team as cards.",
    href: "/pokemon/champions/tools/team-viewer",
  },
]

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ids = new Set<string>()
for (const tool of tools) {
  if (!idPattern.test(tool.id)) throw new Error(`${tool.id}: tool id must be a URL-safe slug`)
  if (ids.has(tool.id)) throw new Error(`Duplicate tool id: ${tool.id}`)
  ids.add(tool.id)
  if (!sectionTree.has(tool.sectionId)) {
    throw new Error(`${tool.id}: sectionId ${tool.sectionId} is not a section`)
  }
  const base = toolsHrefFor(sectionTree.path(tool.sectionId))
  if (tool.href !== `${base}/${tool.id}`) {
    throw new Error(`${tool.id}: href must be ${base}/${tool.id}`)
  }
  if (!tool.title.trim() || !tool.description.trim()) {
    throw new Error(`${tool.id}: title and description must not be empty`)
  }
}

export function getSectionTools(sectionId: string) {
  return tools.filter((tool) => tool.sectionId === sectionId)
}
