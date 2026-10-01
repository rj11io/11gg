import type { ReactNode } from "react"

import { parseChartBlock } from "@content/blocks/chart"
import { parseFlowBlock } from "@content/blocks/flow"
import { parseMapBlock } from "@content/blocks/map"
import { parsePokepasteBlock } from "@content/blocks/pokepaste"
import type { BlockLanguage } from "@content/blocks"

import { BlockError, BlockFrame } from "./block-frame"
import { ChartBlock } from "./chart-block"
import { FlowBlock } from "./flow-block"
import { MapBlock } from "./map-block"
import { PokepasteBlock } from "./pokepaste-block"

/**
 * One renderer per block language. Each parses with the same parser the
 * build validator ran, then draws. A published post never reaches the error
 * branch; it exists for the dev server, where content is not validated until
 * the registry loads.
 */
const renderers: Record<BlockLanguage, (code: string) => ReactNode> = {
  chart: (code) => {
    const spec = parseChartBlock(code)
    return (
      <BlockFrame title={spec.title} description={spec.description} label={`${spec.type} chart`}>
        <ChartBlock spec={spec} />
      </BlockFrame>
    )
  },
  flow: (code) => {
    const spec = parseFlowBlock(code)
    return (
      <BlockFrame title={spec.title} description={spec.description} label="flow chart">
        <FlowBlock spec={spec} />
      </BlockFrame>
    )
  },
  pokepaste: (code) => {
    const spec = parsePokepasteBlock(code)
    return (
      <BlockFrame title={spec.title} label="Pokémon team">
        <PokepasteBlock spec={spec} code={code} />
      </BlockFrame>
    )
  },
  map: (code) => {
    const spec = parseMapBlock(code)
    const places = [
      ...spec.markers.map((marker) => ({ title: marker.title, description: marker.description, label: marker.label })),
      ...spec.circles.map((circle) => ({ title: circle.title, description: circle.value.toLocaleString(), label: undefined })),
    ]
    return (
      <BlockFrame title={spec.title} description={spec.description} label="Map">
        <MapBlock spec={spec} />
        {places.length ? (
          // The same places as text, in the HTML before any script: for screen
          // readers, for readers without JavaScript, and for search engines.
          <ol className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {places.map((place, index) => (
              <li key={`${place.title}-${index}`} className="text-muted-foreground">
                <span className="font-medium text-foreground">{place.label ? `${place.label}. ` : ""}{place.title}</span>
                {place.description ? `, ${place.description}` : ""}
              </li>
            ))}
          </ol>
        ) : null}
      </BlockFrame>
    )
  },
}

export function FencedBlock({
  language,
  code,
}: {
  language: BlockLanguage
  code: string
}) {
  try {
    return renderers[language](code)
  } catch (error) {
    return <BlockError language={language} message={(error as Error).message} />
  }
}
