# Design system

All visuals come from `scripts/kit.js`, which reads colors, fonts, handle and logo from `brand.json`.
Never hand-copy CSS into a carousel. A carousel's `generate.js` only composes kit helpers.
Reference: `examples/demo/generate.js`.

## Canvas
- Slide 420×525 (4:5), exported ×(1080/420) = **1080×1350**.
- Safe area: 24px on the sides; the top bar sits at 22px; keep content between ~62px from the top and ~92px from the bottom.
- `export.js` depends on `.carousel-track > .slide`. Don't rename those classes.

## Helpers
| Helper | What |
|---|---|
| `slide(i, total, inner, {bg, teaser, photo})` | Wraps a slide: background, top bar (@handle + logo), swipe hint + teaser, progress bar. `bg`: `'glow'` (default) / `'warm'` (pain peak) / `'plain'` |
| `column(html, {top, bottom, justify, gap})` | Content column. Centered by default. Above an image: `{ top:60, bottom:300, justify:'flex-start' }` |
| `h1(html, size=30)` | Headline (heading font, 800). 24–34px |
| `body(html, size=15.5, align, color)` | Body text (body font). Pass `T.ink` as the color for emphasis lines |
| `gradText(t)` | Accent gradient on 1–3 words |
| `underline(t)` | Gradient underline |
| `cliff(t)` | The swipe line at the bottom of a story slide (2–3 per carousel) |
| `card(html)` + `row('01'/'check'/'minus', text, sub)` | One numbered list per carousel, at most |
| `callout(html)` | One highlighted insight |
| `commentBubble('מילה')` | The CTA bubble on the last slide |
| `scene('img/s1.jpg', {zone:'bottom', height:62})` | An image filling the lower part of the slide, fading into the background |
| `photo:{src, pos, zoom, text}` (in `slide` opts) | Single-photo mode: one real photo behind the slide |

## Slide recipes
| Role | Layout |
|---|---|
| Hook | big `h1` (30–34px), 1–3 words in `gradText`, optional short `body` line |
| Story slide | `h1` 24–28px + 1–2 `body` lines + optional `cliff` |
| Pain peak | `bg:'warm'`, a big h1, short lines |
| "Aha" | one sentence, big. Nothing else on the slide |
| Steps | `card` with 3 `row('01'…)`, only once |
| CTA | one insight line + question in `h1` + `commentBubble` + small line about what they get |

Vary layouts between consecutive slides (text only, image, card) so the swipe doesn't feel repetitive.

## RTL rules (Hebrew)
- A Hebrew prefix before a Latin word takes the Hebrew maqaf **־** (U+05BE), not a hyphen: `ב־AI`, `ל־Instagram`.
- Ranges and sizes flip in RTL ("1080×1350" shows as "1350×1080", "10–50" as "50–10"). Write them in words or wrap them: `<span dir="ltr">1080×1350</span>`.
- Don't mix a Hebrew word with a Latin file extension ("מדריך.pdf" renders backwards). Write "מדריך (PDF)".
- Wrap handles, URLs and English phrases inside Hebrew lines in `<span dir="ltr">…</span>`.
- Check line-end punctuation and single orphan words in the exported images.
