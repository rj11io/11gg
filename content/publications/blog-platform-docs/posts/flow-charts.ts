export const flowCharts = `
# Flow charts

A flow chart is a fenced code block with the language flow and a JSON body of nodes and edges. The renderer draws it with React Flow, lays it out on its own when the nodes carry no positions, and keeps it read-only: the reader can pan and zoom through the controls, nothing moves or connects. Documentation map: [Working with the platform](/blog/blog-platform-docs/working-with-the-platform).

## The shape

~~~json
{
  "nodes": [
    { "id": "write", "label": "Write the post" },
    { "id": "build", "label": "Build" }
  ],
  "edges": [{ "from": "write", "to": "build" }]
}
~~~

- **nodes**: id and label. kind can be input (no incoming handle), output (no outgoing handle), or default.
- **edges**: from and to name node ids. label, animated and dashed are optional.
- **direction**: LR for left to right, the default, or TB for top to bottom.

No positions needed. The build validates every flow block, so an edge that names a missing node fails the build. See [Content validation rules](/blog/blog-platform-docs/content-validation).

## A pipeline, left to right

~~~flow
{
  "title": "How a post reaches the reader",
  "description": "The platform's own publishing path.",
  "nodes": [
    { "id": "write", "label": "Write", "description": "a TypeScript file", "kind": "input" },
    { "id": "validate", "label": "Validate", "description": "the registry loads" },
    { "id": "build", "label": "Build", "description": "every page ahead of time" },
    { "id": "deploy", "label": "Deploy", "description": "a commit, a release" },
    { "id": "read", "label": "Read", "kind": "output" }
  ],
  "edges": [
    { "from": "write", "to": "validate" },
    { "from": "validate", "to": "build", "label": "passes" },
    { "from": "validate", "to": "write", "label": "fails", "dashed": true },
    { "from": "build", "to": "deploy" },
    { "from": "deploy", "to": "read", "animated": true }
  ]
}
~~~

~~~json
{
  "title": "How a post reaches the reader",
  "nodes": [
    { "id": "write", "label": "Write", "description": "a TypeScript file", "kind": "input" },
    { "id": "validate", "label": "Validate" },
    { "id": "read", "label": "Read", "kind": "output" }
  ],
  "edges": [
    { "from": "write", "to": "validate" },
    { "from": "validate", "to": "write", "label": "fails", "dashed": true },
    { "from": "validate", "to": "read", "animated": true }
  ]
}
~~~

A dashed edge reads as "sometimes" or "back". An animated edge reads as "in motion". Both are off unless asked for, and animation stops when the reader asked the system for less motion.

## A tree, top to bottom

direction TB stacks the ranks. Good for hierarchies and decisions.

~~~flow
{
  "title": "Where a request lands",
  "direction": "TB",
  "height": 420,
  "nodes": [
    { "id": "request", "label": "Request", "kind": "input" },
    { "id": "redirect", "label": "Matches a redirect?" },
    { "id": "moved", "label": "308 to the new address", "kind": "output" },
    { "id": "page", "label": "Known address?" },
    { "id": "html", "label": "Prebuilt page", "kind": "output" },
    { "id": "missing", "label": "The 404 page", "kind": "output" }
  ],
  "edges": [
    { "from": "request", "to": "redirect" },
    { "from": "redirect", "to": "moved", "label": "yes" },
    { "from": "redirect", "to": "page", "label": "no" },
    { "from": "page", "to": "html", "label": "yes" },
    { "from": "page", "to": "missing", "label": "no", "dashed": true }
  ]
}
~~~

~~~json
{
  "direction": "TB",
  "height": 420,
  "nodes": [
    { "id": "request", "label": "Request", "kind": "input" },
    { "id": "redirect", "label": "Matches a redirect?" },
    { "id": "moved", "label": "308 to the new address", "kind": "output" }
  ],
  "edges": [
    { "from": "request", "to": "redirect" },
    { "from": "redirect", "to": "moved", "label": "yes" }
  ]
}
~~~

## Fixed positions

When the automatic layout is not what you mean, give every node x and y in pixels. All or none: the build refuses a mix.

~~~flow
{
  "title": "Content and the website",
  "description": "Two directories, one direction of dependency.",
  "height": 240,
  "minimap": true,
  "nodes": [
    { "id": "content", "label": "content/", "description": "the writing", "x": 0, "y": 80 },
    { "id": "www", "label": "v0/www/", "description": "the website", "x": 320, "y": 80 },
    { "id": "reader", "label": "Reader", "kind": "output", "x": 640, "y": 80 }
  ],
  "edges": [
    { "from": "www", "to": "content", "label": "imports" },
    { "from": "www", "to": "reader", "label": "serves", "animated": true }
  ]
}
~~~

~~~json
{
  "height": 240,
  "minimap": true,
  "nodes": [
    { "id": "content", "label": "content/", "x": 0, "y": 80 },
    { "id": "www", "label": "v0/www/", "x": 320, "y": 80 }
  ],
  "edges": [{ "from": "www", "to": "content", "label": "imports" }]
}
~~~

## Every field

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| nodes | array | required | Objects with id, label, optional description, kind, x, y |
| nodes[].id | string | required | Letters, digits, underscore, hyphen. Unique in the block |
| nodes[].kind | string | default | input has no incoming handle, output has no outgoing one |
| edges | array | empty | Objects with from, to, optional label, animated, dashed |
| direction | string | LR | LR or TB. Ignored when every node has x and y |
| height | number | 360 | Pixels, 200 to 900. The canvas needs a fixed height |
| title, description | string | none | Caption above the chart |
| controls | boolean | true | The zoom and fit buttons |
| minimap | boolean | false | A small overview in the corner. Useful above twenty nodes |

## What the reader gets

- The whole graph fitted into the frame on load, with a little padding.
- Pan by dragging, zoom through the buttons. The mouse wheel scrolls the page, on purpose: a chart that captures the wheel traps the reader.
- Nodes and edges in the site's colours, in both themes, through the tokens in [Design tokens and theming](/blog/blog-platform-docs/design-tokens).
- The React Flow attribution in the corner. The library is free under the MIT licence and its maintainers ask that free use keeps the credit visible. It stays.
- The caption in the HTML before any script runs. The canvas itself loads in the browser only; a placeholder of the same height holds the space so the page does not jump. See [How pages are rendered](/blog/blog-platform-docs/rendering-model).

## When the JSON is wrong

~~~text
blog-platform-docs/419: flow block 2 edges[1].to must name a node id
~~~

Same policy as every block: the build stops and names the post and the block, the dev server shows the message in a red box, a published page shows neither.

## Under the hood

The parser is content/blocks/flow.ts. The drawing is v0/www/app/(main)/blog/components/blocks/flow-canvas.tsx, loaded through flow-block.tsx so it never runs on the server. Layout without positions comes from dagre, a small graph layout library; it places nodes by rank and the component centres them. The block mechanism itself is in [Extending the renderer](/blog/blog-platform-docs/extending-the-renderer).
`
