export const maps = `
# Maps

A map is a fenced code block with the language map and a JSON body: a centre or a set of points, markers with popups, an optional route, an optional area, and circles sized by a value. The renderer draws it with Leaflet in the browser, on OpenStreetMap tiles, in both themes. Documentation map: [Working with the platform](/blog/blog-platform-docs/working-with-the-platform).

## The shape

~~~json
{
  "markers": [
    { "lat": 38.7223, "lng": -9.1393, "title": "Lisbon" }
  ]
}
~~~

No centre, no zoom: the map fits whatever points the block holds. Give center and zoom to frame a place yourself. The build validates every map block, so a latitude of 95 fails the build. See [Content validation rules](/blog/blog-platform-docs/content-validation).

## A route with numbered stops

markers carry a label of up to three characters, drawn inside the pin. line is a list of [lat, lng] points drawn as a route.

~~~map
{
  "title": "Lisbon to Porto by train",
  "description": "Three stops, one line.",
  "markers": [
    { "lat": 38.7223, "lng": -9.1393, "title": "Lisbon", "description": "Santa Apolónia, 08:00", "label": "1" },
    { "lat": 40.2033, "lng": -8.4103, "title": "Coimbra", "description": "A coffee on the platform", "label": "2" },
    { "lat": 41.1579, "lng": -8.6291, "title": "Porto", "description": "Campanhã, 11:10", "label": "3" }
  ],
  "line": [
    [38.7223, -9.1393],
    [39.2369, -8.6855],
    [40.2033, -8.4103],
    [40.6405, -8.6538],
    [41.1579, -8.6291]
  ]
}
~~~

~~~json
{
  "title": "Lisbon to Porto by train",
  "markers": [
    { "lat": 38.7223, "lng": -9.1393, "title": "Lisbon", "description": "Santa Apolónia, 08:00", "label": "1" },
    { "lat": 41.1579, "lng": -8.6291, "title": "Porto", "description": "Campanhã, 11:10", "label": "3" }
  ],
  "line": [[38.7223, -9.1393], [40.2033, -8.4103], [41.1579, -8.6291]]
}
~~~

Under every map the same places appear as a list. It is in the HTML before any script runs, so a screen reader, a reader without JavaScript, and a search engine all get the places.

## Circles sized by a value

circles take a value; each is drawn relative to the largest one in the block. Hover for the number.

~~~map
{
  "title": "Readers by city, one month",
  "height": 400,
  "circles": [
    { "lat": 38.7223, "lng": -9.1393, "title": "Lisbon", "value": 1240 },
    { "lat": 41.1579, "lng": -8.6291, "title": "Porto", "value": 860 },
    { "lat": 40.2033, "lng": -8.4103, "title": "Coimbra", "value": 310 },
    { "lat": 41.5454, "lng": -8.4265, "title": "Braga", "value": 220 },
    { "lat": 37.0194, "lng": -7.9322, "title": "Faro", "value": 150 },
    { "lat": 38.5714, "lng": -7.9135, "title": "Évora", "value": 90 }
  ]
}
~~~

~~~json
{
  "circles": [
    { "lat": 38.7223, "lng": -9.1393, "title": "Lisbon", "value": 1240 },
    { "lat": 41.1579, "lng": -8.6291, "title": "Porto", "value": 860 }
  ]
}
~~~

## One place, framed

center and zoom frame the view. area draws a polygon. zoomControl false hides the buttons for a map that is only a picture.

~~~map
{
  "title": "Where this blog is written",
  "center": [38.7139, -9.1394],
  "zoom": 14,
  "height": 260,
  "zoomControl": false,
  "markers": [
    { "lat": 38.7139, "lng": -9.1394, "title": "Chiado, Lisbon", "description": "Most of these posts, anyway." }
  ],
  "area": [
    [38.7165, -9.1445],
    [38.7165, -9.1345],
    [38.7105, -9.1345],
    [38.7105, -9.1445]
  ]
}
~~~

~~~json
{
  "center": [38.7139, -9.1394],
  "zoom": 14,
  "height": 260,
  "zoomControl": false,
  "markers": [{ "lat": 38.7139, "lng": -9.1394, "title": "Chiado, Lisbon" }],
  "area": [[38.7165, -9.1445], [38.7165, -9.1345], [38.7105, -9.1345], [38.7105, -9.1445]]
}
~~~

## Every field

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| center | [lat, lng] | fit to points | With zoom, frames the view |
| zoom | number | 12 | 1 to 19. Without center it is the most the fit may zoom in |
| height | number | 360 | Pixels, 200 to 900 |
| markers | array | empty | lat, lng, title, optional description and label |
| line | array of [lat, lng] | empty | At least two points. One route per block |
| area | array of [lat, lng] | empty | At least three points. One polygon per block |
| circles | array | empty | lat, lng, title, value above zero |
| zoomControl | boolean | true | The plus and minus buttons |
| title, description | string | none | Caption above the map |

Latitude runs from -90 to 90, longitude from -180 to 180. A block needs a center or at least one point of any kind.

## Tiles, attribution, and dark mode

The map images, the tiles, come from OpenStreetMap's own tile servers. Their policy welcomes light use from personal sites and asks for two things the block always does: the attribution stays visible in the corner, and nothing downloads tiles in bulk. A busier site should switch provider: the tile address and its attribution are two build-time settings, NEXT_PUBLIC_MAP_TILES and NEXT_PUBLIC_MAP_ATTRIBUTION, and nothing else changes. Providers with a dark style exist; most need a registered domain or a key.

Dark mode inverts the tile layer with a filter and nothing else, so pins, routes and popups keep the site's colours. Not a real dark map, but readable, and it needs no second provider. See [Design tokens and theming](/blog/blog-platform-docs/design-tokens).

## What the reader gets

- Drag to pan, buttons to zoom, keyboard arrows and plus and minus when the map has focus. The mouse wheel scrolls the page, on purpose.
- A popup per marker, a tooltip per circle.
- No zoom or fade animation when the system asks for reduced motion. See [Accessibility contract](/blog/blog-platform-docs/accessibility-contract).
- The places list and the caption in the HTML; the map itself only in the browser, since Leaflet needs a window the moment it loads. A placeholder of the same height holds the space. See [How pages are rendered](/blog/blog-platform-docs/rendering-model).

## When the JSON is wrong

~~~text
blog-platform-docs/421: map block 1 markers[2] lat must be a number from -90 to 90
~~~

The parser is content/blocks/map.ts, the drawing is v0/www/app/(main)/blog/components/blocks/map-canvas.tsx. The block mechanism is in [Extending the renderer](/blog/blog-platform-docs/extending-the-renderer).
`
