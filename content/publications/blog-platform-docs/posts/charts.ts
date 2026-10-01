export const charts = `
# Charts

A chart is a fenced code block with the language chart and a JSON body. The renderer draws it with recharts through the shadcn chart wrapper, so it takes the site's colours, works in both themes, and animates unless the reader asked the system for less motion. This post shows every chart type live, with the JSON that drew it. Documentation map: [Working with the platform](/blog/blog-platform-docs/working-with-the-platform).

## The shape

~~~json
{
  "type": "bar",
  "title": "Visits per month",
  "data": [
    { "month": "Jan", "visits": 120 },
    { "month": "Feb", "visits": 180 }
  ]
}
~~~

Three fields do most of the work:

- **type**: bar, line, area, pie, radar, or radial.
- **data**: an array of rows. One string field is the category, every numeric field is a series.
- **title** and **description**: optional, drawn above the chart as its caption.

Everything else has a default. The build validates every chart block, so a typo in the JSON fails the build with a message that names the post and the block. See [Content validation rules](/blog/blog-platform-docs/content-validation).

## Bar

Two numeric fields become two bars per category. The legend appears on its own when there is more than one series.

~~~chart
{
  "type": "bar",
  "title": "Posts written and published per month",
  "description": "Two series, grouped bars, legend on by default.",
  "data": [
    { "month": "Jan", "written": 6, "published": 4 },
    { "month": "Feb", "written": 8, "published": 6 },
    { "month": "Mar", "written": 7, "published": 5 },
    { "month": "Apr", "written": 10, "published": 8 },
    { "month": "May", "written": 9, "published": 7 },
    { "month": "Jun", "written": 12, "published": 9 }
  ]
}
~~~

~~~json
{
  "type": "bar",
  "title": "Posts written and published per month",
  "description": "Two series, grouped bars, legend on by default.",
  "data": [
    { "month": "Jan", "written": 6, "published": 4 },
    { "month": "Feb", "written": 8, "published": 6 }
  ]
}
~~~

### Stacked and horizontal

stacked piles the series, horizontal turns the bars sideways. Long category names read better sideways.

~~~chart
{
  "type": "bar",
  "title": "Time spent per publication",
  "stacked": true,
  "horizontal": true,
  "unit": " h",
  "series": [
    { "key": "writing", "label": "Writing" },
    { "key": "editing", "label": "Editing" },
    { "key": "assets", "label": "Covers and images" }
  ],
  "data": [
    { "publication": "Platform docs", "writing": 40, "editing": 18, "assets": 6 },
    { "publication": "Online presence", "writing": 12, "editing": 5, "assets": 3 },
    { "publication": "Personal notes", "writing": 8, "editing": 2, "assets": 1 }
  ]
}
~~~

~~~json
{
  "type": "bar",
  "stacked": true,
  "horizontal": true,
  "unit": " h",
  "series": [
    { "key": "writing", "label": "Writing" },
    { "key": "editing", "label": "Editing" }
  ],
  "data": [
    { "publication": "Platform docs", "writing": 40, "editing": 18 }
  ]
}
~~~

The series field names the fields to draw, in order, with a label for the legend and tooltip. Without it every numeric field is drawn and its key is its label.

## Line

curve sets the line shape: monotone (default), linear, natural, or step.

~~~chart
{
  "type": "line",
  "title": "Build time",
  "description": "Seconds per production build, one point per release.",
  "unit": " s",
  "curve": "monotone",
  "data": [
    { "release": "1.10", "build": 48 },
    { "release": "1.11", "build": 51 },
    { "release": "1.12", "build": 44 },
    { "release": "1.13", "build": 39 },
    { "release": "1.14", "build": 41 },
    { "release": "1.15", "build": 36 }
  ]
}
~~~

~~~json
{
  "type": "line",
  "unit": " s",
  "curve": "monotone",
  "data": [
    { "release": "1.10", "build": 48 },
    { "release": "1.11", "build": 51 }
  ]
}
~~~

## Area

Same fields as line, filled. stacked works here too.

~~~chart
{
  "type": "area",
  "title": "Readers by source",
  "stacked": true,
  "series": [
    { "key": "search", "label": "Search" },
    { "key": "direct", "label": "Direct" },
    { "key": "social", "label": "Social" }
  ],
  "data": [
    { "week": "W1", "search": 80, "direct": 40, "social": 20 },
    { "week": "W2", "search": 95, "direct": 42, "social": 35 },
    { "week": "W3", "search": 110, "direct": 38, "social": 28 },
    { "week": "W4", "search": 130, "direct": 45, "social": 50 },
    { "week": "W5", "search": 125, "direct": 50, "social": 44 },
    { "week": "W6", "search": 150, "direct": 48, "social": 60 }
  ]
}
~~~

~~~json
{
  "type": "area",
  "stacked": true,
  "data": [
    { "week": "W1", "search": 80, "direct": 40, "social": 20 }
  ]
}
~~~

## Pie

One series split by category. Every row gets its own colour, and the legend lists the categories. donut draws a ring.

~~~chart
{
  "type": "pie",
  "title": "Posts by publication",
  "donut": true,
  "legend": true,
  "data": [
    { "publication": "Platform docs", "posts": 18 },
    { "publication": "Online presence", "posts": 5 },
    { "publication": "Personal notes", "posts": 4 },
    { "publication": "Tech tutorials", "posts": 3 },
    { "publication": "R&D", "posts": 2 }
  ]
}
~~~

~~~json
{
  "type": "pie",
  "donut": true,
  "legend": true,
  "data": [
    { "publication": "Platform docs", "posts": 18 },
    { "publication": "Online presence", "posts": 5 }
  ]
}
~~~

## Radar

Several series compared across the same categories. Good for profiles and scores.

~~~chart
{
  "type": "radar",
  "title": "Two drafts, five criteria",
  "series": [
    { "key": "draftA", "label": "Draft A" },
    { "key": "draftB", "label": "Draft B" }
  ],
  "data": [
    { "criterion": "Clarity", "draftA": 8, "draftB": 6 },
    { "criterion": "Depth", "draftA": 6, "draftB": 9 },
    { "criterion": "Length", "draftA": 7, "draftB": 5 },
    { "criterion": "Examples", "draftA": 9, "draftB": 7 },
    { "criterion": "Sources", "draftA": 5, "draftB": 8 }
  ]
}
~~~

~~~json
{
  "type": "radar",
  "data": [
    { "criterion": "Clarity", "draftA": 8, "draftB": 6 },
    { "criterion": "Depth", "draftA": 6, "draftB": 9 }
  ]
}
~~~

## Radial

Like a pie, but each category is its own arc. Works best with a handful of rows.

~~~chart
{
  "type": "radial",
  "title": "Checks passing",
  "unit": "%",
  "legend": true,
  "data": [
    { "check": "Typecheck", "passing": 100 },
    { "check": "Lint", "passing": 100 },
    { "check": "Build", "passing": 96 },
    { "check": "Links", "passing": 88 }
  ]
}
~~~

~~~json
{
  "type": "radial",
  "unit": "%",
  "legend": true,
  "data": [
    { "check": "Typecheck", "passing": 100 },
    { "check": "Links", "passing": 88 }
  ]
}
~~~

## Every field

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| type | string | required | bar, line, area, pie, radar, radial |
| data | array of objects | required | Values are strings or numbers. Keys: letters, digits, underscore, hyphen |
| x | string | first string field | The category field. Must be a string in every row |
| series | array | every numeric field | Objects with key, optional label and color |
| title | string | none | Caption line above the chart |
| description | string | none | Second caption line |
| unit | string | empty | Suffix after values in tooltips, for example "%" or " ms" |
| stacked | boolean | false | Bar and area only |
| horizontal | boolean | false | Bar only |
| curve | string | monotone | Line and area: monotone, linear, natural, step |
| donut | boolean | false | Pie only |
| legend | boolean | true when more than one series | Pie and radial list categories instead |
| grid | boolean | true | Bar, line, area |

Colours cycle through the five chart tokens from [Design tokens and theming](/blog/blog-platform-docs/design-tokens). A series can set color to any CSS colour, but a token keeps the chart readable in both themes.

## What the reader gets

- A tooltip on hover or focus, with the series label and the value plus unit.
- A legend that names what is drawn.
- Animation on first paint, off when the system asks for reduced motion. See [Accessibility contract](/blog/blog-platform-docs/accessibility-contract).
- The caption in the HTML before any script runs. The drawing itself needs JavaScript: recharts measures its container in the browser. See [How pages are rendered](/blog/blog-platform-docs/rendering-model).

## When the JSON is wrong

The build stops with the post, the block number, and the problem:

~~~text
blog-platform-docs/418: chart block 3 type must be one of bar, line, area, pie, radar, radial
~~~

In the dev server the same message shows as a red box in place of the chart. A published page never shows either: the build refused it.

## Adding another chart type

The parser lives in content/blocks/chart.ts, the drawing in v0/www/app/blog/components/blocks/chart-block.tsx. A new type is a new entry in chartTypes, a branch in the component, and an example on this page. The mechanism for blocks in general is in [Extending the renderer](/blog/blog-platform-docs/extending-the-renderer).
`
