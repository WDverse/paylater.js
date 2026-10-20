# paylater.js

A `<paylater-message>` custom element that renders a "pay in 4" messaging widget into a shadow root, isolated from the host page's CSS.

## Development

```
npm run dev
```

## Build

```
npm run build
```

Produces a single self-contained `dist/paylater.js` (IIFE, no imports/exports) suitable for a plain `<script>` tag.

## Size budget

`dist/paylater.js` is checked against a gzip size budget on every build via [size-limit](https://github.com/ai/size-limit):

| | |
|---|---|
| Budget | 8 KB (gzipped) |
| Current | ~0.6 KB (gzipped) |

The build fails if the bundle exceeds the budget. Check the current size without building with:

```
npm run size
```

The budget is configured in the `size-limit` field of `package.json`.
