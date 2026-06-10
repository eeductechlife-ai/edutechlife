# iLAB Inline Annotation System — Design Spec

## Status: Approved

## Problem
Students need to highlight key text passages while studying iLAB resources. No annotation capability exists today.

## Scope
- Text/HTML resources only (no PDF, video, or image annotations)
- Inline highlights only (no margin notes, no sidebar panel)
- Single user, private (no shared annotations)
- Local persistence via localStorage

## Approach: Content Transformation (C)

Transform resource HTML at render time by injecting `<mark>` elements where stored offsets indicate highlights.

## Architecture

### New Files

| File | Responsibility |
|------|---------------|
| `src/hooks/IALab/useAnnotations.js` | Central hook: state, localStorage persistence, highlight CRUD |
| `src/components/IALab/AnnotationLayer.jsx` | Wrapper: renders content with injected highlights, detects text selection |
| `src/components/IALab/FloatingHighlightToolbar.jsx` | Floating toolbar that appears on text selection |

### Data Flow

```
Raw HTML ──→ AnnotationLayer ──→ HTML with <mark> injected
                  │
        Text selection detected
                  │
                  ▼
     FloatingHighlightToolbar
         [Resaltar] button
                  │
                  ▼
     useAnnotations.addHighlight(startOffset, endOffset)
                  │
                  ▼
     localStorage → re-transform HTML
```

### Highlight Removal
- Click on a `<mark>` element → `useAnnotations.removeHighlight(id)`
- Re-transform HTML

## Storage Schema

```json
{
  "ialab_annotations": {
    "resource_<resourceId>": [
      {
        "id": "hl_<timestamp>",
        "startOffset": 142,
        "endOffset": 189,
        "createdAt": "2026-06-10T..."
      }
    ]
  }
}
```

Offsets reference **plain text** (not HTML), making them stable across HTML formatting changes.

## Content Transformation Algorithm

1. Input: `rawHtml` (string), `highlights` (array of `{id, startOffset, endOffset}`)
2. Sort highlights by `startOffset`
3. Walk the HTML string character by character, tracking plain-text offset
4. When offset matches a highlight range, inject `<mark data-hl-id="...">` open tag
5. Close `</mark>` at `endOffset`
6. Handle edge cases: overlapping ranges (merge), nested HTML tags, empty text nodes

## Interaction States

1. **No selection**: Nothing visible
2. **Text selected**: FloatingHighlightToolbar appears at selection, with "[Resaltar]" button
3. **Highlight active**: Yellow `<mark>` background visible; click to remove

## Key Constraints

- **Zero modifications to existing files** — all new files
- localStorage fallback degrades silently on error (quota exceeded, private browsing)
- Offsets stored as plain-text offsets for stability
- Color: `#FFEB3B` (yellow) — single color, no color picker

## Edge Cases Covered

- Overlapping highlights: merge into single `<mark>` span
- HTML with nested tags: tracker maintains tag stack while counting plain-text offsets
- Empty selections: toolbar does not appear
- Zero-length highlights: ignored
- Resource with no text: no-op
- Multiple highlights in same paragraph: supported
