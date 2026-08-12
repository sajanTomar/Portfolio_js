# Frontend Notes Book — Built From This Project's Actual Code

**Project:** `Portfolio_js` — a hand-written HTML/CSS/JS portfolio hero section (no framework, no build step).
**Files analysed:** `index.html`, `css/variables.css`, `css/layout.css`, `css/components.css`, `css/animations.css`, `css/responsive.css`, `js/main.js`.

Nothing in this book is a generic topic list. Every entry below exists because it appears in the code we wrote, or because it is the immediate follow-up an interviewer reaches for after seeing that code.

---

## Part 1 — Complete Code Analysis (Concept Inventory)

### 1.1 `index.html` — document setup and semantics

| Code / Feature | Concept | Where / How Used | Why Used | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| `<!DOCTYPE html>` | Standards mode trigger | First line | Avoids quirks mode | Tells the browser to use the modern box model + CSS rules | "What happens without it?" → quirks mode, `width` includes padding |
| `<html lang="en">` | Language declaration | Root element | Screen readers, translation, hyphenation | Sets document language | Common a11y question |
| `<meta charset="UTF-8">` | Character encoding | `<head>`, first meta | Renders `•`, `→`, `&` correctly | Declares byte→character mapping | "Why must it be in the first 1024 bytes?" |
| `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | Responsive viewport | `<head>` | Without it, mobile renders at ~980px and scales down | Maps CSS pixels to device width | Every media query in `responsive.css` depends on this |
| 5 `<link rel="stylesheet">` in order: variables → layout → components → animations → responsive | Cascade ordering | `<head>` | Later files must be able to override earlier ones at equal specificity | Load order = cascade order | "Why is `responsive.css` last?" |
| `.skip-link` → `#main-content` | Keyboard accessibility | First element in `<body>` | Lets keyboard users bypass the nav | Off-screen (`left:-9999px`) until `:focus` | Classic a11y question |
| `<header> <nav> <aside> <main> <footer> <section>` | Semantic landmarks | Whole page | Machine-readable structure | Gives AT users landmark navigation | "Why not all `<div>`?" |
| `aria-label`, `aria-hidden="true"`, `aria-expanded`, `aria-controls` | ARIA state & labelling | Icon buttons, decorative SVGs, hamburger | Icon-only buttons have no text; decorative SVG must be ignored | Exposes/hides semantics to AT | `aria-expanded` is toggled in JS — very likely question |
| `href="#home"` … `#contact` | Fragment links | Desktop + mobile nav | In-page navigation | Scrolls to element with that `id` | Ties into `scrollIntoView` + `scroll-padding-top` |
| `download` on `<a>` | Download attribute | Resume buttons | Force save instead of navigate | Browser downloads the target | "Does it work cross-origin?" (no) |
| `target="_blank" rel="noopener"` | Tab-nabbing protection | GitHub / LinkedIn links | Prevents `window.opener` access | Opens new tab safely | Security question |
| `mailto:` | Protocol link | Email icon | Opens mail client | Non-HTTP scheme | Minor but asked |
| BEM-style names: `hero__title`, `hero__title-gradient`, `achievement-card--top`, `file-tree__item--active` | CSS naming methodology | Everywhere | Flat specificity, no nesting wars | Block / element / modifier | "Why BEM here?" |
| Inline `<svg>` for **every** icon | Inline SVG | Logo, moon/sun, palette, arrows, social, editor chrome, charts, map | Requirement: no icon fonts/emoji. Also themeable + no extra requests | Vector markup rendered by the browser | Huge surface area for questions |
| `viewBox`, `fill="none"`, `stroke="currentColor"`, `stroke-width`, `stroke-linecap/linejoin` | SVG coordinate + painting model | All stroke icons | Scales cleanly, inherits CSS color | Defines user space + how strokes render | "Why `currentColor`?" |
| `<defs><linearGradient id="logoGradient" gradientUnits="userSpaceOnUse">` | SVG gradient | Logo "S" | Purple→blue gradient glyph | Paint server referenced by `fill="url(#logoGradient)"` | Duplicate-ID danger |
| `<pattern id="mapDots" patternUnits="userSpaceOnUse">` + `fill="url(#mapDots)"` | SVG pattern fill | "15+ Countries" dotted world map | Draws hundreds of dots without hundreds of elements | Tiles a circle across continent paths | Excellent "how did you build that?" question |
| `<ellipse transform="rotate(60 12 12)">` ×3 | SVG transform | React atom icon | Three rotated orbits = React logo | Rotates around a point in user space | Shows SVG transform syntax differs from CSS |
| `&lt;` `&gt;` `&amp;` inside the fake code block | HTML entities | `<section className=...>` lines | Raw `<` would be parsed as a tag | Escapes reserved characters | Guaranteed question when they see JSX-in-HTML |
| One source line per `.code__line` | Whitespace significance | Editor code block | `white-space: pre` renders literal newlines | Prevents accidental line breaks | **We hit this bug** — great debugging story |
| `<button>` for actions, `<a>` for navigation | Element semantics | Theme toggle vs Resume link | Correct default behaviour + keyboard support | Buttons fire on Space/Enter; links navigate | Very common question |

### 1.2 `css/variables.css` — tokens, reset, theming

| Code | Concept | Where / How | Why | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| `@import url('…Inter…')` + `@import url('…JetBrains Mono…')` | CSS `@import` of webfonts | Top of file | Two families: UI + code | Fetches font CSS | "Why is `@import` slower than `<link>`?" |
| `*, *::before, *::after { box-sizing: border-box }` | Box model reset | Global | Padding/border stop inflating widths | Width includes padding+border | Fundamental |
| `* { margin: 0; padding: 0 }` | Reset | Global | Predictable spacing from layout, not defaults | Removes UA margins | "Reset vs normalize?" |
| `:root { --primary-color: #3B82F6; … }` (~40 tokens) | CSS custom properties | Colors, radii, spacing, fonts, transitions | Single source of truth; enables theming | Inheritable variables | Core question |
| `[data-theme="light"] { --bg-color: … }` | Attribute-selector theming | Overrides tokens | Theme swap without touching components | Redefines the same variable names | Pairs with the JS toggle |
| `[data-color="purple"] { --primary-color: … }` | Accent presets | 5 palettes | Ready for the palette button | Same pattern, different axis | "Two independent theming axes" |
| `--editor-bg`, `--editor-line`, `--editor-text` | Scoped token group | Editor UI only | Editor stays dark in both themes | Namespaced tokens | Design-decision question |
| `-webkit-font-smoothing: antialiased` | Font rendering | `body` | Thinner text on dark backgrounds (macOS) | Changes rasterisation | Nice detail question |
| `::selection { background: var(--primary-color) }` | Pseudo-element | Global | Branded text selection | Styles highlighted text | Small but noticeable in browser |

### 1.3 `css/layout.css` — structure

| Code | Concept | Where / How | Why | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| `html { scroll-behavior: smooth; scroll-padding-top: 120px; overflow-x: clip }` | Scroll module + overflow | Root | Smooth anchors, offset for sticky header, kill sideways scroll | `scroll-padding-top` stops the header covering targets | `clip` vs `hidden` is a strong question |
| `body { overflow-x: hidden }` | Overflow fallback | Body | Safety net for browsers without `clip` | Clips + creates scroll container | "Why both?" |
| `.container { width: min(94%, 1520px); margin-inline: auto }` | `min()` + logical properties | Every section | Fluid until a max, then centred | One line replaces width+max-width+margin | Modern-CSS question |
| `padding-block`, `padding-inline`, `inset-inline`, `margin-inline` | Logical properties | Throughout | Writing-mode aware | Maps to physical sides per direction | "Why not `padding-top/bottom`?" |
| `section { padding-block: clamp(5rem, 8vw, 8rem) }` | Fluid spacing | All sections | Rhythm scales with viewport | min/preferred/max | `clamp()` question |
| `.site-header { position: sticky; top: 0; z-index: 1000 }` | Sticky positioning | Header | Stays visible while scrolling | Relative until threshold, then fixed | "sticky vs fixed" — near-certain question |
| `.header-wrapper { display:flex; justify-content: space-between }` + `.desktop-nav { margin-inline: auto }` | Flexbox centring trick | Header | Nav optically centred between logo and actions | Auto margins absorb free space | Great "how did you centre it?" question |
| `.hero__wrapper { display:grid; grid-template-columns: minmax(0,1fr) minmax(0,1.08fr) }` | CSS Grid + `minmax(0,…)` | Hero two-column | `1fr` = `minmax(auto,1fr)` and would let content force overflow | Columns that can actually shrink | **We hit this bug** — top-tier question |
| `.hero__highlights { grid-template-columns: repeat(3, minmax(0,1fr)); width: calc(100% + 8.5rem) }` | Deliberate overflow | Highlight card row | Row must be wider than the text column to match the design | Grows past its grid column | "Isn't that a hack?" — trade-off discussion |
| `.hero__stage { position: relative }` | Containing block | Wraps editor + floating cards | Gives `position:absolute` children a reference box | Anchors cards to the editor, not the column | Positioning fundamentals |
| `.achievement-card--top { left: 48%; bottom: calc(100% - 8px) }` | `calc()` + percentage offsets | Lighthouse card | Sits above the window with 8px overlap | `bottom:100%` = "just above the box" | Clever, very askable |
| `.workspace__body { grid-template-columns: 46px 178px minmax(0,1fr); min-height: 545px }` | Mixed fixed/flexible grid | Editor shell | Activity bar + explorer fixed, code flexible | Three-column app layout | Real-world layout question |
| `.workspace__status { padding: 0 1.1rem 0 152px }` | Magic-number padding | Status bar | Keeps `main`/errors clear of the Countries card | Shifts the left group right | "Would you ship a magic number?" |
| `.workspace__activity-icon--bottom { margin-top: auto }` | Auto-margin push | Account icon | Pins it to the bottom of the flex column | Absorbs remaining space | Flexbox idiom |
| `.code__line { display:flex; flex-wrap: nowrap }` + `.code__num { width:48px; user-select:none }` | Gutter pattern | Code block | Line numbers that can't be selected/copied | Fixed gutter + flexible text | Mirrors real editors |
| `.workspace { overflow: hidden }` / `.workspace__editor { overflow: hidden }` | Clipping | Editor | Long code lines cut off like a real editor | Hides overflow, no scrollbar | Ties to `white-space: pre` |
| `main { isolation: isolate }` | Stacking context | Main | Contains the hero's negative z-index layers | Creates a context without z-index | Advanced, high-value |
| z-index ladder: `-2, -1, 1, 2, 3, 1000, 1100, 1200, 5000, 9999` | Stacking order | Hero bg → header → overlay → drawer → skip link → progress | Predictable layering | Paint order within a stacking context | "Why 9999?" |
| `.mobile-navigation { position: fixed; transform: translateX(100%); visibility: hidden }` | Off-canvas pattern | Drawer | Off-screen without creating scroll width | Transform doesn't affect layout | **We refactored this** from `right:-100%` |

### 1.4 `css/components.css` — visual design

| Code | Concept | Where / How | Why | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| `backdrop-filter: blur(var(--glass-blur))` + `-webkit-` prefix | Glassmorphism | Header, badge, highlights, cards | Frosted glass over the grid background | Blurs what's *behind* the element | "backdrop-filter vs filter" |
| `background: rgba(13,17,25,.72)` | Alpha layering | Header, cards | Lets the blur show through | Semi-transparent surface | Pairs with backdrop-filter |
| `box-shadow: 0 40px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(59,130,246,.04)` | Multi-shadow | Editor window | Depth + hairline ring | Comma-separated shadow list | "Second shadow as a border?" |
| `.nav-link::after { transform: scaleX(0) } :hover::after { scaleX(1) }` | Pseudo-element + transform animation | Nav underline | Animates transform, not width | GPU-friendly underline sweep | "Why not animate `width`?" — layout vs composite |
| `.hero__typing-text::after` with `animation: typingCursor .8s steps(1) infinite` | `steps()` timing function | Caret | Hard on/off blink, no fade | Discrete jumps instead of interpolation | Great animation question |
| `.icon--sun { display:none }` + `[data-theme="light"] .icon--moon { display:none }` | CSS-driven icon swap | Theme button | JS only flips an attribute; CSS decides visuals | Two SVGs, one visible | "Why not swap innerHTML in JS?" |
| `.tok-kw`, `.tok-str`, `.tok-num`, `.tok-fn`, `.tok-tag`, `.tok-attr`, `.tok-punct` | Manual syntax highlighting | Code block | Looks like VS Code with zero JS | Class-per-token colouring | "How would you do it for real?" (Prism/Shiki) |
| `.file-tree__name { white-space:nowrap; overflow:hidden; text-overflow: ellipsis }` | Truncation trio | Explorer filenames | Long names degrade gracefully | Ellipsis instead of wrap | All three declarations are required |
| `.hero::before` — two `linear-gradient`s + `background-size: 60px 60px` | Gradient grid pattern | Hero background | Grid without an image | Repeating 1px lines | "How do you make a grid with CSS only?" |
| `mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%)` + `-webkit-` | CSS masking | Hero grid fade | Grid fades out at the edges | Alpha of the mask = visibility | Advanced, memorable |
| `.hero::after` — `radial-gradient` + `color-mix(in srgb, var(--primary-color) 13%, transparent)` + `filter: blur(20px)` | `color-mix()` + filter | Ambient glow | Tint derived from the accent token, not hard-coded | Mixes colors in CSS | Modern CSS; shows token discipline |
| `.hero__orbit { top:50%; left:50%; transform: translate(-50%,-50%); aspect-ratio: 1 }` | Absolute centring + `aspect-ratio` | Orbit rings | Perfect square, perfectly centred | Classic centring recipe | "Other ways to centre?" |
| `::-webkit-scrollbar` / `-thumb` | Vendor pseudo-elements | Global | Slim dark scrollbar | Non-standard but widely used | "What about Firefox?" (`scrollbar-width`) |
| `.btn`, `.btn--primary`, `.btn--secondary` | Component + modifier | CTAs | Shared base, variant skins | Reusable button system | Design-system question |
| `transition: transform .45s ease, visibility .45s ease` | Multi-property transition | Drawer | Visibility must be delayed so the slide is visible | Transitions the discrete `visibility` step | Subtle and very askable |

### 1.5 `css/animations.css` — motion

| Code | Concept | Where / How | Why | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| `.hero__content > * { opacity: 0; animation: heroReveal .8s ease forwards }` | Universal-child animation + `forwards` | Entrance | One rule animates every hero block | `forwards` keeps the end state | "What if you drop `forwards`?" → snaps back to `opacity:0` |
| `.hero__badge { animation-delay: .1s }` … `.hero__highlights { .8s }` | Staggering | Entrance | Sequential reveal | Offsets each start | "How would you stagger N unknown items?" |
| `@keyframes heroVisualReveal { translateX(40px) scale(.97) → 0 }` | Compound transform | Editor entrance | Slide + scale together | Interpolates the transform list | Transform order matters |
| `@keyframes floatingCard { 50% { translateY(-10px) } }` + per-card `animation-delay` | Looping ambient motion | 3 stat cards | Cards drift out of sync | `infinite` alternate-style bob | "Why offset the delays?" |
| `@keyframes orbitSpin` with `translate(-50%,-50%) rotate(…)` | Transform + centring conflict | Orbit rings | Keyframes must repeat the centring translate | Otherwise the element jumps | **Real trap** — excellent question |
| `.hero::after { animation: heroGlow 10s ease-in-out infinite alternate }` | `alternate` direction | Glow | Ping-pong without a return keyframe | Plays forwards then backwards | Animation shorthand knowledge |
| `@media (prefers-reduced-motion: reduce) { animation: none }` | Motion accessibility | All animations | Respects OS-level preference | Disables motion | Strong a11y signal |

### 1.6 `css/responsive.css` — breakpoints

| Code | Concept | Where / How | Why | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| Breakpoints 1440 / 1200 / 992 / 768 / 576 / 425 / 360 | Desktop-first media queries | Whole file | Base CSS targets desktop; each query narrows | `max-width` cascade | "Mobile-first vs desktop-first?" |
| `@media (max-width: 992px)` → `.desktop-nav { display:none }`, `.mobile-menu-btn { display:inline-flex }` | Navigation swap | Tablet | One nav for pointer, one for touch | Hides/shows the two nav systems | Ties directly to the JS drawer |
| `.hero__wrapper { grid-template-columns: minmax(0,1fr) }` at ≤992 | Grid collapse | Tablet | Single column stack | Reflows the hero | The `minmax(0,…)` detail is the bug fix |
| `.workspace__explorer { display:none }`, `.workspace__body { grid-template-columns: 38px minmax(0,1fr) }` at ≤768 | Progressive disclosure | Mobile editor | Explorer is noise on a phone | Drops a whole grid column | "How do you decide what to hide?" |
| `.workspace__status-item:nth-child(n + 3) { display:none }` | Structural pseudo-class | Mobile status bar | Keeps only branch + errors | Hides the 3rd item onward | `nth-child(n+3)` is worth explaining |
| `.achievement-card__chart--map { display:none }` at ≤425 | Content triage | Very small screens | Map becomes unreadable | Removes the SVG | Design judgement |
| `@media (max-height: 500px) and (orientation: landscape)` | Compound media query | Landscape phones | Drawer needs less top padding | Height + orientation together | Shows real device awareness |

### 1.7 `js/main.js` — behaviour

| Code | Concept | Where / How | Why | What It Does | Interview Relevance |
|---|---|---|---|---|---|
| `document.querySelector` / `querySelectorAll` cached in `const`s at the top | DOM querying + caching | Lines 1–10 | Avoid repeated lookups in handlers | Returns Element / static NodeList | "NodeList vs HTMLCollection" (static vs live) |
| `localStorage.getItem/setItem("theme")` | Web Storage | Theme toggle | Persist across reloads | Synchronous string storage | "What about FOUC?" — script is at body end |
| `document.documentElement.setAttribute("data-theme", …)` | Attribute-driven state | Theme toggle | CSS reacts, JS stays dumb | Flips the `<html>` attribute | Best-practice pattern |
| `classList.add / remove / contains` | Class manipulation | Menu, header, nav | Declarative state in CSS | Mutates the class list | Fundamental |
| `setAttribute("aria-expanded", "true"/"false")` | ARIA state sync | `openMenu` / `closeMenu` | Visual state must match AT state | Announces open/closed | High-value a11y question |
| `document.body.style.overflow = "hidden"` / `""` | Scroll lock | Drawer open/close | Stops background scrolling | Inline style on/off | "Why `""` and not `auto`?" |
| `event.key === "Escape"` on `document` keydown | Keyboard handling | Global listener | Standard dismiss affordance | Closes the drawer | "Why `key` and not `keyCode`?" |
| `window.scrollY > 20 → classList.toggle('scrolled')` | Scroll state | `handleHeader` | Header gains shadow after scroll | Reads scroll offset | "How would you do this without scroll events?" → IntersectionObserver |
| `scrollHeight - clientHeight`, `scrollY / total * 100` | Scroll progress math | `updateProgressBar` | Progress bar width | Percentage of scrollable distance | Guard for `documentHeight <= 0` is notable |
| `section.offsetTop`, `section.offsetHeight` | Layout reads | `updateActiveNavigation` | Scroll-spy | Forces layout on every scroll event | **Performance question** — layout thrashing |
| `element.style.width = \`${progress}%\`` | Template literal + inline style | Progress bar | Direct visual update | Sets an inline style | "Inline style vs CSS variable?" |
| `document.querySelectorAll('a[href^="#"]')` | Attribute *starts-with* selector | Smooth scroll | Only in-page anchors | Selects by attribute prefix | Selector knowledge |
| `function (event) { this.getAttribute("href") }` | Regular function + `this` | Anchor handler | `this` = the clicked element | Arrow function would break `this` | **Very likely question** |
| `event.preventDefault()` then `scrollIntoView({behavior:"smooth", block:"start"})` | Default behaviour override | Anchor clicks | Programmatic scrolling | Stops the instant jump | "You already have `scroll-behavior: smooth` — why both?" |
| Recursive `setTimeout(typeRole, …)` with `isDeleting` flag | Timer-driven state machine | Typewriter | Variable delays per phase | Types, pauses, deletes, advances | "Why not `setInterval`?" |
| `currentRole.slice(0, characterIndex)` | String slicing | Typewriter | Progressive substring | Rebuilds the visible text | Simple but asked |
| `(roleIndex + 1) % roles.length` | Modulo cycling | Typewriter | Wrap to the first role | Infinite loop over an array | Classic |
| `window.matchMedia("(prefers-reduced-motion: reduce)").matches` | Media query in JS | Typewriter guard | Don't animate for users who opted out | Boolean match | Pairs with the CSS media query |
| Three separate `window.addEventListener("scroll", …)` | Event registration | Bottom of file | Three independent features | Three handlers per scroll tick | "How would you optimise?" → one handler + rAF |
| `window.addEventListener("load", …)` | Load event | Initial state | Sync UI with the restored scroll position | Fires after all resources | "`load` vs `DOMContentLoaded`" |
| Guard clauses (`if (!typingText) return`) | Defensive coding | Several places | Script runs on pages missing elements | Early return | Shows production thinking |

---

## Part 2 — Notes Book

Each topic follows the same shape: *What → Why → How → Syntax → Our code → Browser behaviour → Common mistakes → Deeper understanding → Related*.

---

### Topic 1 — CSS Custom Properties and Attribute-Based Theming

**What is it?**
Variables you declare in CSS with a `--` prefix and read back with `var()`. We declared about forty of them on `:root` and then redefined a handful under `[data-theme="light"]`.

**Why is it used?**
So a colour, radius, or spacing value has exactly one home. The accent blue appears in the logo, buttons, nav underline, code tokens, card values, and the background glow — changing `--primary-color` changes all of them.

**How does it work?**
Custom properties **inherit**. Declaring them on `:root` (the `<html>` element) makes them visible to every descendant. When JS sets `data-theme="light"` on `<html>`, the `[data-theme="light"]` rule wins (higher specificity: attribute selector 0-1-0 beats `:root`'s 0-1-0 but comes later in the file, so source order decides), redefining the same names. Everything that used `var(--bg-color)` re-resolves automatically.

**Syntax**

```css
:root {
    --primary-color: #3B82F6;
    --bg-color: #05070D;
    --text-light: #B4BDCC;
}

[data-theme="light"] {
    --bg-color: #F7F9FC;
    --text-light: #475467;
}

body {
    background: var(--bg-color);
    color: var(--text-color);
}
```

**Our project example**

```css
/* variables.css */
[data-color="purple"] { --primary-color: #7C4DFF; }

/* components.css — consumers never know which theme is active */
.btn--primary { background: var(--primary-color); }
.hero__title-gradient { color: var(--primary-color); }
```

```js
// main.js
document.documentElement.setAttribute("data-theme", nextTheme);
```

**Browser behaviour**
Changing a custom property on `<html>` invalidates style for every element that consumes it and triggers a restyle + repaint — but **not** a full re-parse of the CSS. It is fast, which is why theme switching feels instant.

**Common mistakes**
- Writing `var(--space-4)` where the property was never defined and forgetting the fallback: `var(--x, 1rem)`.
- Defining tokens on `body` instead of `:root`, then wondering why an element outside `<body>` can't see them.
- Using custom properties in a media query condition — `@media (min-width: var(--bp))` does **not** work.

**Deeper understanding**
Custom properties are resolved at *computed-value* time, so they're inherited and dynamic, unlike Sass variables which are compiled away. That's exactly why runtime theming works. Also note we deliberately created two independent axes: `data-theme` (light/dark) and `data-color` (accent). They compose — you could have `data-theme="light" data-color="green"` without writing a combined rule. Finally, the editor has its own token group (`--editor-bg`, `--editor-line`) that is *not* redefined in light mode, because a VS Code window should stay dark; that's a deliberate design decision, not an oversight.

**Related concepts:** cascade and specificity, `color-mix()` (we derive the hero glow from `--primary-color`), attribute selectors, `data-*` attributes, FOUC on first paint.

---

### Topic 2 — The Box Model Reset and Why `border-box` Matters Here

**What is it?**
`box-sizing: border-box` makes `width` include padding and border.

**Why is it used?**
Our layout is full of elements that have both a percentage/flex width *and* padding: `.header-wrapper` (padding-inline 1.5rem), `.hero__highlight` (padding 1rem), `.achievement-card` (padding 1.1rem 1.25rem). Without `border-box`, each of those would be wider than the space allocated to it and the grid maths would drift.

**Syntax**

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
```

**Browser behaviour**
The default is `content-box`. A `width: 200px; padding: 20px; border: 1px` element occupies **242px** under `content-box` and exactly **200px** under `border-box`.

**Common mistakes**
- Forgetting `::before` / `::after` in the selector list — our `.nav-link::after` underline and `.hero::before` grid are pseudo-elements and would otherwise keep `content-box`.
- Assuming the reset also removes list bullets or link underlines. It doesn't — we removed those separately in `components.css` (`ul { list-style: none }`, `a { text-decoration: none }`).

**Deeper understanding**
The blanket `* { margin: 0; padding: 0 }` is a heavy reset. It kills useful defaults (paragraph spacing, heading margins, list indentation), which is fine here because every gap in this layout comes from `gap` or an explicit `margin-top`. On a content-heavy site you'd prefer a normalize-style baseline so prose still reads correctly. Know the trade-off and be able to state it.

**Related:** margin collapsing (which we avoid entirely by using flex/grid `gap`), reset vs normalize, universal selector performance (a non-issue in modern engines).

---

### Topic 3 — `min()`, `clamp()`, and Fluid Sizing

**What is it?**
CSS maths functions that pick a value from several candidates at layout time.

**Why is it used?**
We wanted one container rule and one type scale that work from 320px to 1536px without a media query for every step.

**Syntax + our code**

```css
.container      { width: min(94%, 1520px); margin-inline: auto; }
section         { padding-block: clamp(5rem, 8vw, 8rem); }
.hero__title    { font-size: clamp(2.6rem, 4.4vw, 4.3rem); }
.nav-list       { gap: clamp(1rem, 2.2vw, 2.4rem); }
.logo-text      { font-size: clamp(1.2rem, 2vw, 1.5rem); }
```

**How does it work?**
`min(94%, 1520px)` = "whichever is smaller right now". Below ~1617px the 94% wins (fluid); above it the pixel value caps the width. `clamp(min, preferred, max)` is shorthand for `max(min, min(preferred, max))` — the `vw`-based preferred value scales with the viewport, and the two bounds stop it becoming unreadable.

**Browser behaviour**
These are resolved continuously as the viewport resizes — no breakpoint jumps. Resize the window slowly and the hero heading grows smoothly, then freezes at 4.3rem.

**Common mistakes**
- Using only a `vw` font size with no `clamp()` — text becomes microscopic on phones.
- Putting the values in the wrong order in `clamp()`. If `min > max`, the min wins and the max is ignored.
- Forgetting that `clamp()` with only `vw` ignores user font-size preferences; mixing a `rem` into the preferred value (e.g. `clamp(1rem, 0.5rem + 2vw, 2rem)`) is more accessible.

**Deeper understanding**
We still kept media queries in `responsive.css` even though we use `clamp()`. That's intentional: `clamp()` handles *scale*, media queries handle *layout changes* (grid collapse, hiding the explorer, swapping navs). Knowing which tool solves which problem is the actual skill.

**Related:** `aspect-ratio` on `.hero__orbit`, `calc()` in `.hero__highlights` and `.achievement-card--top`, viewport units.

---

### Topic 4 — Flexbox As Used In This Project

**What is it?**
One-dimensional layout: items along a main axis with alignment and distribution.

**Where we use it**

```css
.header-wrapper { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.desktop-nav    { margin-inline: auto; }               /* optical centring */
.header-actions { display: flex; gap: .5rem; flex-shrink: 0; }
.hero__actions  { display: flex; gap: 1rem; flex-wrap: wrap; }
.code__line     { display: flex; align-items: flex-start; flex-wrap: nowrap; }
.code__text     { flex: 0 0 auto; white-space: pre; }
.workspace__activity-icon--bottom { margin-top: auto; }
```

**Three techniques worth naming in an interview**

1. **Auto margins absorb free space.** `justify-content: space-between` puts the logo left and actions right; `margin-inline: auto` on the nav then centres it in what's left. No absolute positioning, no fixed widths.
2. **`margin-top: auto` pushes a flex item to the end.** That's how the account icon sits at the bottom of the activity bar, exactly like VS Code.
3. **`flex-shrink: 0` / `flex: 0 0 auto` protect content.** Flex items have `min-width: auto` by default, so text can shrink and wrap unexpectedly. `.code__text { flex: 0 0 auto }` was required — without it the code lines wrapped instead of being clipped by the editor's `overflow: hidden`.

**Browser behaviour**
`gap` in flexbox is supported everywhere modern; it replaces the old `margin-right + :last-child` dance and never leaks a trailing margin.

**Common mistakes**
- Expecting `flex: 1` to let an item shrink below its content width — it won't unless you add `min-width: 0`.
- Using `justify-content` on the cross axis (that's `align-items`).
- Adding `gap` and margins to the same group, producing doubled spacing.

**Deeper understanding**
The `min-width: auto` rule on flex items is the number-one cause of "why is my flex child overflowing?" — and its grid equivalent (`minmax(auto, 1fr)`) is the exact bug we hit in the hero. Being able to link those two is a strong signal of real experience.

**Related:** CSS Grid, `minmax(0, 1fr)`, `white-space: pre`, overflow.

---

### Topic 5 — CSS Grid, and Why `minmax(0, 1fr)` Instead of `1fr`

**What is it?**
Two-dimensional layout. We use it three times: the hero split, the highlight card row, and the editor's three-pane body.

**Our code**

```css
.hero__wrapper   { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr); gap: clamp(1.5rem, 2.2vw, 2rem); align-items: center; }
.hero__highlights{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; width: calc(100% + 8.5rem); }
.workspace__body { display: grid; grid-template-columns: 46px 178px minmax(0, 1fr); min-height: 545px; }
```

**The key insight**
`1fr` is shorthand for `minmax(auto, 1fr)`. The `auto` minimum means **a grid column will never shrink below its content's min-content size**. Our `.hero__highlights` is deliberately `calc(100% + 8.5rem)` wide, so at ≤992px, when the wrapper became a single `1fr` column, that oversized child forced the column — and therefore the page — wider than the viewport. Every element then computed its 94% container width against a too-wide parent and the whole page overflowed sideways.

The fix was one character-level change:

```css
/* responsive.css, @media (max-width: 992px) */
.hero__wrapper { grid-template-columns: minmax(0, 1fr); }
.hero__highlights { width: 100%; }
```

**Browser behaviour**
With `minmax(0, 1fr)` the column is allowed to be narrower than its content, so overflowing children are clipped or scroll instead of stretching the layout.

**Common mistakes**
- Using `1fr` and then being unable to explain a horizontal scrollbar.
- Believing `overflow: hidden` on an ancestor prevents the overflow from affecting layout — it clips the *paint*, but the child still influenced the track sizing that caused it.

**Deeper understanding**
`46px 178px minmax(0, 1fr)` in the editor is the classic app-shell: two fixed rails and one elastic content area. At ≤768px we drop to `38px minmax(0, 1fr)` and `display: none` the explorer — note that hiding the element is not enough on its own; the track definition has to change too, otherwise you leave a 178px hole.

**Related:** `minmax()`, `fr` unit, `repeat()`, flexbox `min-width: auto`, `overflow-x: clip`.

---

### Topic 6 — Positioning, Containing Blocks, and the Floating Stat Cards

**What is it?**
`position: absolute` removes an element from flow and positions it against its nearest positioned ancestor (the *containing block*).

**Why it matters here**
The three stat cards must hug the **editor window**, not the grid column. So we introduced a wrapper:

```css
.hero__stage { position: relative; width: 100%; max-width: 700px; }

.achievement-card        { position: absolute; z-index: 3; }
.achievement-card--top   { left: 48%; bottom: calc(100% - 8px); }
.achievement-card--left  { left: -78px; bottom: 12px; }
.achievement-card--right { right: -68px; top: 23%; }
```

**How `bottom: calc(100% - 8px)` works**
For an absolutely positioned element, `bottom: 100%` means "my bottom edge sits at the top edge of the containing block" — i.e. entirely above it. Subtracting 8px pulls it down so it overlaps the editor's title bar by 8px, matching the reference design. Percentages here resolve against the *containing block's height*, not the element's own.

**Negative offsets**
`left: -78px` deliberately pushes the Countries card outside the stage so it breaks the editor's edge. That overflow is safe because `.hero { overflow: hidden }` clips anything that would escape the section.

**Browser behaviour**
Absolutely positioned elements don't reserve space, so the stage's height is driven purely by the editor. Resize the window and the cards follow the editor because their offsets are relative to it.

**Common mistakes**
- Forgetting `position: relative` on the parent — the cards would then anchor to the viewport-level initial containing block and fly off.
- Using `top`/`bottom` percentages and assuming they refer to the element's own size (that's `transform: translateY(%)`).
- Positioning against `.hero__visual` (which has padding and flex alignment) instead of a tight wrapper — the offsets would drift at every breakpoint.

**Deeper understanding**
`transform`, `filter`, `backdrop-filter`, `will-change`, and `contain` also create containing blocks for fixed/absolute descendants. That bites people when a `transform` on a parent makes `position: fixed` behave like `absolute`. Worth mentioning — our `.hero__orbit` uses a transform and sits inside the same stage.

**Related:** stacking contexts, `overflow: hidden`, `z-index`, sticky positioning.

---

### Topic 7 — Stacking Contexts and the z-index Ladder

**What is it?**
z-index only orders elements **within the same stacking context**. New contexts are created by, among others, a positioned element with a z-index, `opacity < 1`, `transform`, `filter`, `isolation: isolate`.

**Our ladder**

| Layer | z-index | File |
|---|---|---|
| `.hero::before` (grid) | `-2` | components.css |
| `.hero::after` (glow) | `-1` | components.css |
| `.workspace` | `1` | layout.css |
| `.hero__content`, `.hero__visual` | `1` / `2` | components.css / layout.css |
| `.achievement-card` | `3` | layout.css |
| `.site-header` | `1000` | layout.css |
| `.mobile-overlay` | `1100` | layout.css |
| `.mobile-navigation` | `1200` | layout.css |
| `.skip-link` | `5000` | components.css |
| `.scroll-progress` | `9999` | components.css |

**The `isolation: isolate` trick**

```css
main { position: relative; isolation: isolate; }
.hero { position: relative; overflow: hidden; isolation: isolate; }
```

Negative z-index children normally paint *behind their parent's background*, and can escape to sit behind unrelated ancestors. `isolation: isolate` creates a stacking context without setting a z-index, which traps `-1` and `-2` inside the hero. That's why the grid and glow sit behind the hero's content but never behind the page background or the header.

**Browser behaviour**
Within one context, paint order is: background → negative z-index → in-flow blocks → floats → inline content → z-index 0/auto positioned → positive z-index.

**Common mistakes**
- Escalating to `z-index: 9999` to fix a layering bug that is actually a stacking-context problem — the child of a low-z-index parent can never beat its parent's sibling.
- Setting `z-index` on a `position: static` element (no effect, unless it's a flex/grid item).

**Deeper understanding**
The drawer/overlay pair (1100/1200) and the header (1000) are the only values that genuinely need to be large, and even those are arbitrary. In a bigger codebase you'd tokenise them (`--z-header: 100`) so the ladder is documented in one place. That's a good "how would you improve this?" answer.

**Related:** `position`, `opacity`, `transform`, `overflow`, `backdrop-filter`.

---

### Topic 8 — Sticky Header and Scroll-Driven Classes

**What is it?**
`position: sticky` behaves like `relative` until the element hits a scroll threshold, then like `fixed` inside its scrolling ancestor.

**Our code**

```css
.site-header { position: sticky; top: 0; inset-inline: 0; z-index: 1000; padding-block: 1.25rem .5rem; }
.site-header .header-wrapper { background: rgba(13,17,25,.72); backdrop-filter: blur(20px); border-radius: 20px; transition: .35s; }
.site-header.scrolled .header-wrapper { background: rgba(13,17,25,.92); box-shadow: 0 14px 46px rgba(0,0,0,.5); }
```

```js
function handleHeader() {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
}
window.addEventListener("scroll", handleHeader);
```

**Why the visual styling is on `.header-wrapper`, not `.site-header`**
The design is a floating pill with a gap around it. The sticky element must span the full width (so `top: 0` works and nothing shows through beside it), while the *visible card* is the inner wrapper with the border-radius and blur. Separating "positioning element" from "painted element" is a pattern worth naming.

**Browser behaviour**
Sticky fails silently if an ancestor has `overflow: hidden/auto/scroll` — the element sticks to that scroll container instead of the viewport. We set `overflow-x: clip` on `html` specifically because `clip` does **not** create a scroll container, so sticky still works. `overflow-x: hidden` on `body` is a legacy fallback.

**Common mistakes**
- Forgetting `top` — sticky does nothing without an inset.
- `overflow: hidden` on a wrapper silently killing stickiness (very common).
- Doing heavy work in the scroll handler.

**Deeper understanding**
`handleHeader` runs on every scroll event and touches `classList` unconditionally. `classList.add` on an element that already has the class is cheap and doesn't invalidate style, so this is fine — but a cleaner version reads the current state first, or uses an `IntersectionObserver` on a 20px sentinel element so no scroll listener is needed at all.

**Related:** `scroll-behavior`, `scroll-padding-top`, `backdrop-filter`, IntersectionObserver.

---

### Topic 9 — Smooth Scrolling: CSS and JS Working Together

**Three pieces**

```css
html { scroll-behavior: smooth; scroll-padding-top: 120px; }
```

```js
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});
```

**What each part does**
- `scroll-behavior: smooth` animates *any* scroll, including native anchor jumps and `scrollIntoView()` without options.
- `scroll-padding-top: 120px` reserves space so the sticky header never covers the section you jumped to. This is the piece people forget.
- The JS handler intercepts the click, prevents the default instant jump, and scrolls programmatically. It also guards against `href="#"` (our logo link) and missing targets.

**Why `function` and not an arrow function**
Inside a regular function used as an event listener, `this` is the element the listener is attached to. An arrow function inherits `this` from the enclosing scope (here, the module/global scope), so `this.getAttribute` would throw. The alternative is `event.currentTarget.getAttribute("href")`, which works with arrows.

**Browser behaviour**
Because both CSS and JS smoothing are active, the CSS rule is doing most of the work; `scrollIntoView` would be smooth anyway. The JS version buys you the guards and a place to add analytics or close the mobile drawer.

**Common mistakes**
- `querySelector(targetId)` breaks if an id starts with a digit or contains special characters — `document.getElementById(targetId.slice(1))` is safer.
- Calling `preventDefault()` before checking the target exists, leaving links dead.
- Forgetting that `scroll-behavior: smooth` also affects `window.scrollTo` and can make tests flaky.

**Deeper understanding**
The URL hash is *not* updated by this implementation, so the browser back button won't step through sections and the section isn't shareable by URL. Fixing that with `history.pushState` is a great improvement to mention. Also, `prefers-reduced-motion` should ideally disable smooth scrolling too — we handle the typewriter and CSS animations, but not this.

**Related:** fragment identifiers, `scrollIntoView` options, `history` API, reduced motion.

---

### Topic 10 — The Off-Canvas Mobile Drawer

**Markup + CSS + JS working as one feature**

```html
<button class="mobile-menu-btn" id="mobileMenuBtn" aria-expanded="false" aria-controls="mobileNavigation" aria-label="Open Menu">
    <span></span><span></span><span></span>
</button>
<aside class="mobile-navigation" id="mobileNavigation"> … </aside>
<div class="mobile-overlay"></div>
```

```css
.mobile-navigation { position: fixed; top: 0; right: 0; transform: translateX(100%); visibility: hidden;
                     width: min(340px, 90vw); height: 100vh; z-index: 1200; }
.mobile-navigation { transition: transform .45s ease, visibility .45s ease; }
.mobile-navigation.active { transform: translateX(0); visibility: visible; }

.mobile-overlay { position: fixed; inset: 0; opacity: 0; visibility: hidden; z-index: 1100; }
.mobile-overlay.active { opacity: 1; visibility: visible; }

.mobile-menu-btn.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.mobile-menu-btn.active span:nth-child(2) { opacity: 0; }
.mobile-menu-btn.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
```

```js
function openMenu() {
    mobileNavigation.classList.add("active");
    mobileOverlay.classList.add("active");
    mobileMenuBtn.classList.add("active");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
}
```

**Why `transform` instead of `right: -100%`**
The original version parked the drawer at `right: -100%`. That places a 340px element one viewport-width to the right of the screen, which **adds to the document's scrollable width**. The page then had phantom horizontal scroll. Switching to `transform: translateX(100%)` fixes it because transforms are a paint-time operation — they never affect layout or scroll extents. We also added `overflow-x: clip` on `html` as a belt-and-braces measure.

**Why `visibility` is in the transition list**
`visibility` is not a continuously interpolatable property, but it *is* transitionable: it flips at the end of the duration when going to `hidden`, and immediately when going to `visible`. That means the drawer stays visible for the whole 450ms slide-out and only then becomes untabbable. Without it in the transition, `visibility: hidden` would apply instantly and the closing animation would be invisible.

**Why `visibility: hidden` at all?**
An off-screen element is still focusable by keyboard. `visibility: hidden` removes it from the tab order.

**The three-span hamburger**
Three plain `<span>`s become an X via `nth-child` transforms: the outer two rotate ±45° and translate toward the centre, the middle one fades out. The whole thing is CSS; JS only toggles `.active`.

**Common mistakes**
- Animating `right` or `left` (triggers layout on every frame) instead of `transform`.
- Locking scroll with `overflow: hidden` on `body` and forgetting that iOS Safari needs extra handling (position: fixed + saved scroll offset).
- Not syncing `aria-expanded`, leaving screen-reader users unaware the menu opened.
- Forgetting to close the drawer on link click — we bind `closeMenu` to every `.mobile-navigation a`.

**Deeper understanding**
The one thing missing is **focus management**: when the drawer opens, focus should move into it and be trapped until it closes, then return to the button. That's the honest answer to "what would you improve?" — along with `inert` on the background content.

**Related:** ARIA state, keyboard events, scroll locking, CSS transitions on discrete properties.

---

### Topic 11 — The Typewriter: Recursive `setTimeout` as a State Machine

**Our code (condensed)**

```js
const roles = ["TypeScript", "React.js", "Next.js", "Node.js", "Web Performance"];
let roleIndex = 0, characterIndex = 0, isDeleting = false;
const typingSpeed = 90, deletingSpeed = 55, pauseAfterTyping = 1400, pauseAfterDeleting = 400;

function typeRole() {
    if (!typingText) return;
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        characterIndex++;
        typingText.textContent = currentRole.slice(0, characterIndex);
        if (characterIndex === currentRole.length) { isDeleting = true; setTimeout(typeRole, pauseAfterTyping); return; }
        setTimeout(typeRole, typingSpeed);
        return;
    }

    characterIndex--;
    typingText.textContent = currentRole.slice(0, characterIndex);
    if (characterIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeRole, pauseAfterDeleting); return; }
    setTimeout(typeRole, deletingSpeed);
}
```

**Why recursive `setTimeout` and not `setInterval`?**
The delay changes depending on the phase: 90ms while typing, 55ms while deleting, 1400ms pause at the end of a word, 400ms before the next word. `setInterval` has one fixed period. Recursive `setTimeout` also guarantees the previous run finished before the next is scheduled, so callbacks can never pile up in a background tab.

**The state machine**
Three module-scope variables hold state between ticks: which word (`roleIndex`), how many characters (`characterIndex`), and which direction (`isDeleting`). Each call reads state, mutates the DOM once, updates state, and schedules the next call. The word cycle wraps with `(roleIndex + 1) % roles.length`.

**The caret is pure CSS**

```css
.hero__typing-text::after {
    content: ""; display: inline-block; width: 2px; height: 1em;
    background: var(--primary-color);
    animation: typingCursor .8s steps(1) infinite;
}
@keyframes typingCursor { 0%, 45% { opacity: 1 } 46%, 100% { opacity: 0 } }
```

`steps(1)` makes the timing function discrete, so opacity snaps between 1 and 0 instead of fading — exactly how a terminal cursor behaves.

**Reduced-motion guard**

```js
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (typingText && !prefersReducedMotion) typeRole();
```

If the user opted out, the animation never starts and the HTML fallback text (`TypeScript`) stays on screen — which is why we hard-coded a sensible default in the markup rather than leaving it empty.

**Browser behaviour**
`textContent` writes are cheap and don't parse HTML (unlike `innerHTML`). Timers are throttled to ≥1s in background tabs, so the animation slows down when hidden — harmless here.

**Common mistakes**
- Using `innerHTML` for user-ish strings (XSS surface, slower).
- Reading `.matches` once and never listening for changes — `matchMedia(...).addEventListener('change', …)` reacts if the user flips the OS setting live.
- Forgetting the guard clause and throwing on pages where `#typingText` doesn't exist.

**Deeper understanding**
No timer id is stored, so the loop can never be stopped. For a single-page app, or if the element is removed from the DOM, you'd leak a timer that keeps writing to a detached node. Keeping `const timer = setTimeout(...)` and clearing it on teardown is the production answer. Also worth mentioning: this is a text change, so it triggers layout for that inline box on every keystroke — negligible at this size, but the reason you wouldn't do it for a large block of text.

**Related:** event loop and timers, `textContent` vs `innerHTML`, `prefers-reduced-motion`, CSS `steps()`.

---

### Topic 12 — Scroll Progress Bar and Scroll-Spy

```js
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (documentHeight <= 0) { scrollProgress.style.width = "0%"; return; }
    const progress = (scrollTop / documentHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
}

function updateActiveNavigation() {
    let currentSection = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.offsetHeight) {
            currentSection = section.id;
        }
    });
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) link.classList.add("active");
    });
}
```

**The maths**
`scrollHeight` is the full document height; `clientHeight` is the visible viewport height. Their difference is the maximum scrollable distance. Dividing current scroll by that gives 0→1, ×100 for a percentage width. The `documentHeight <= 0` guard prevents a division by zero on pages shorter than the viewport (which would produce `Infinity%` or `NaN%`).

**The `-150` offset in scroll-spy**
A section is considered active 150px before it reaches the top, roughly compensating for the sticky header height so the highlight changes when the section *looks* like it's in view.

**Performance: this is the weak spot of the file**

```js
window.addEventListener("scroll", handleHeader);
window.addEventListener("scroll", updateProgressBar);
window.addEventListener("scroll", updateActiveNavigation);
```

Three separate listeners, none throttled. `updateActiveNavigation` reads `offsetTop` and `offsetHeight` for every section on every scroll event — those are **layout-forcing reads**. Combined with the class writes in the same loop, this is textbook layout thrashing.

**How you'd fix it (the answer they want)**
1. Combine into one listener.
2. Wrap the work in `requestAnimationFrame` with a `ticking` flag so it runs at most once per frame.
3. Add `{ passive: true }` so the browser knows you won't `preventDefault()` and can keep scrolling on the compositor.
4. Replace scroll-spy entirely with an `IntersectionObserver` — the browser does the intersection maths off the main thread.
5. Cache section offsets and recompute on `resize` instead of on every scroll.

**Browser behaviour**
Writing `style.width` sets an inline style, which beats the stylesheet's `width: 0`. The `.scroll-progress` element has `transition: width .1s linear`, so the bar interpolates rather than jumping — a nice touch, though animating `width` is a layout property; `transform: scaleX()` would be cheaper.

**Related:** IntersectionObserver, `requestAnimationFrame`, passive listeners, reflow/repaint, `transform` vs layout properties.

---

### Topic 13 — Inline SVG: `currentColor`, `viewBox`, Gradients, and Patterns

**Why inline SVG at all?**
The requirement was no icon fonts and no emoji. Inline SVG gives us: no extra HTTP requests, full CSS control (colour, size, hover), crisp rendering at any DPI, and accessibility control via `aria-hidden`.

**`viewBox` + no width/height in CSS terms**

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
```

`viewBox="0 0 24 24"` defines an internal coordinate system. The `width`/`height` attributes give a default size that CSS can override. Because all our icon paths are drawn on a 24×24 grid, they stay visually consistent even at different rendered sizes.

**`currentColor` is the whole trick**

```css
.icon--moon    { color: #FACC15; }
.icon--palette { color: #A78BFA; }
.file-icon--react { color: #61DAFB; }
.workspace__activity-icon { color: #5B6577; }
.workspace__activity-icon:hover { color: #C7D2E0; }
```

Every icon uses `stroke="currentColor"` or `fill="currentColor"`, so setting the CSS `color` property on the SVG (or any ancestor) recolours it — including on `:hover` and per theme. This is why the hero social icons turn blue on hover with a single `color` declaration.

**Gradient (the logo)**

```html
<defs>
  <linearGradient id="logoGradient" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
    <stop stop-color="#A855F7"/><stop offset="0.55" stop-color="#6366F1"/><stop offset="1" stop-color="#3B82F6"/>
  </linearGradient>
</defs>
<path d="M23.4 8.1C…" fill="url(#logoGradient)"/>
```

`gradientUnits="userSpaceOnUse"` means the x1/y1/x2/y2 coordinates are in the SVG's own coordinate system (0–32 here), not the 0–1 bounding-box fractions used by the default `objectBoundingBox`.

**Pattern (the dotted world map)**

```html
<defs>
  <pattern id="mapDots" width="3.2" height="3.2" patternUnits="userSpaceOnUse">
    <circle cx="1.1" cy="1.1" r="0.85" fill="#3B82F6"/>
  </pattern>
</defs>
<g fill="url(#mapDots)">
  <path d="M6 12c4-5 12-7 18-6s8 5 7 9…"/>   <!-- North America -->
  …
</g>
```

One circle, tiled every 3.2 units, clipped to six continent-shaped paths. That's a few hundred visible dots from **one** drawing instruction — far cheaper than authoring hundreds of `<circle>` elements.

**Charts as SVG**
The Lighthouse sparkline is a single `<path>` with `stroke-linecap="round"`; the users chart is six `<rect>`s with `rx="2"` and a light-to-dark blue ramp. Both are static markup — no charting library, no canvas.

**Accessibility**
Decorative icons carry `aria-hidden="true"`; interactive controls carry `aria-label` on the *button*, not the SVG. That's the correct split: the accessible name belongs to the control.

**Common mistakes**
- **Duplicate `id`s.** We define `logoGradient` and `mapDots` once each. If the same icon markup were pasted twice, `url(#id)` would resolve to the first match and the second instance could render wrong. In a component system you'd suffix ids per instance.
- Setting `fill` on an SVG whose paths use `stroke` (nothing changes) or vice-versa.
- Forgetting `fill="none"` on stroke icons, which fills the outline shape with black.
- Sizing an SVG with only CSS `width` and no `viewBox` — it won't scale proportionally.

**Deeper understanding**
Inline SVG bloats the HTML — our `index.html` is now dominated by icon markup. The trade-offs to mention: an SVG sprite (`<use href="#icon">`) removes duplication; a build step or component framework would let you author icons once. For a 3-icon page, inline is right; for 50 icons, a sprite is right.

**Related:** `currentColor`, CSS `color` inheritance, `aria-hidden`, HTTP request cost, SVG coordinate systems.

---

### Topic 14 — Faking VS Code: `white-space: pre`, a Gutter, and Manual Tokens

**Structure**

```html
<div class="code">
  <div class="code__line"><span class="code__num">1</span><span class="code__text"><span class="tok-kw">const</span> <span class="tok-var">engineer</span> <span class="tok-op">=</span> {</span></div>
  …
</div>
```

```css
.code       { font-family: var(--font-mono); font-size: .8rem; line-height: 1.75; }
.code__line { display: flex; align-items: flex-start; flex-wrap: nowrap; }
.code__num  { flex-shrink: 0; width: 48px; padding-right: 1rem; text-align: right; color: var(--editor-line); user-select: none; }
.code__text { flex: 0 0 auto; white-space: pre; padding-right: 1.25rem; }
.tok-kw { color: #C586C0 } .tok-str { color: #CE9178 } .tok-num { color: #B5CEA8 }
.tok-fn { color: #DCDCAA } .tok-tag { color: #4EC9B0 } .tok-punct { color: #808080 }
```

**Why not `<pre><code>`?**
We need a per-line gutter with non-selectable line numbers. `<pre>` gives you whitespace preservation but no structure to hang line numbers on. Per-line flex rows give both, and `user-select: none` on the gutter means copying the code doesn't drag the numbers along — the same behaviour as a real editor.

**The bug we hit — and it's the best debugging story in this project**
`white-space: pre` preserves **every** newline and space in the HTML source. The original markup was pretty-printed like this:

```html
<span class="code__text">  <span class="tok-prop">countries</span>:
    <span class="tok-num">15</span>,</span>
```

The newline and indentation between `countries:` and `15` are real characters, so the browser rendered a line break in the middle of line 4. Three code lines silently split in half and the numbers stopped matching the content. The fix was to force **one physical source line per rendered line**, which is why the code block in `index.html` looks unformatted compared to the rest of the file.

**Why the long lines don't wrap**
`white-space: pre` prevents wrapping, `flex: 0 0 auto` stops the flex item from being squeezed (remember `min-width: auto`), and `.workspace__editor { overflow: hidden }` clips the overflow. Result: line 18 runs past the right edge and is cut off — exactly like a real editor with word-wrap disabled.

**Escaping**
Because the fake code contains JSX, every angle bracket is written as `&lt;` / `&gt;` and the ampersand in the highlight card as `&amp;`. Writing raw `<section>` would create an actual (unknown) element in the DOM.

**Common mistakes**
- Using `white-space: pre-wrap` and then wondering why the editor illusion breaks.
- Forgetting `user-select: none`, so copied code includes line numbers.
- Assuming `overflow: hidden` on the parent gives you scrolling — it doesn't; `auto` does.

**Deeper understanding**
Manual token spans don't scale: this is decorative code, so hand-colouring 21 lines is fine and costs 0 KB of JS. For real code you'd use Prism/Shiki/highlight.js, ideally at build time so the browser ships pre-tokenised HTML with no runtime cost. Be able to say when each is appropriate.

**Related:** `white-space` values, flexbox `min-width: auto`, `overflow`, HTML entities, `user-select`.

---

### Topic 15 — Backgrounds Without Images: Gradient Grid, Mask, and Glow

```css
.hero::before {
    content: ""; position: absolute; inset: -20% 0 0; z-index: -2; pointer-events: none;
    background-image:
        linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%);
}

.hero::after {
    content: ""; position: absolute; top: -260px; right: -200px; width: 900px; height: 900px;
    z-index: -1; border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, color-mix(in srgb, var(--primary-color) 13%, transparent), transparent 65%);
    filter: blur(20px); opacity: .85;
    animation: heroGlow 10s ease-in-out infinite alternate;
}
```

**The grid**
Two linear gradients — one horizontal line, one vertical (`90deg`) — each 1px of colour then transparent. `background-size: 60px 60px` tiles them into a 60px grid. Zero images, zero requests, and it recolours with a single rgba change.

**The mask**
`mask-image` uses the *alpha* of the mask to decide visibility: opaque black areas keep the grid, transparent areas hide it. A radial gradient therefore fades the grid out toward the edges so it never collides with the page edges or the text. The `-webkit-` prefix is still worth shipping for older Safari.

**The glow**
A 900px circle of the accent colour at 13% opacity, blurred and animated. `color-mix(in srgb, var(--primary-color) 13%, transparent)` derives the tint from the token — switch `--primary-color` to purple via `data-color` and the glow follows automatically. That's the payoff for using tokens instead of hard-coded hex.

**`pointer-events: none`**
Both layers sit over a large area. Without this they'd still be behind (`z-index: -2/-1`), but the declaration documents intent and protects against later stacking changes.

**Browser behaviour**
`filter: blur()` promotes the element to its own compositing layer — cheap to animate with `transform` (which `heroGlow` does), expensive if you animate the blur radius itself.

**Common mistakes**
- Animating `filter: blur()` values or `background-position` instead of `transform`.
- Forgetting `-webkit-mask-image`.
- Using huge blurred elements without `pointer-events: none`, blocking clicks.

**Related:** stacking contexts, `color-mix()`, compositing layers, `will-change`.

---

### Topic 16 — Animation Architecture: Stagger, `forwards`, and the `orbitSpin` Trap

```css
.hero__content > * { opacity: 0; animation: heroReveal .8s ease forwards; }
.hero__badge { animation-delay: .1s }
.hero__eyebrow { animation-delay: .2s }
.hero__title { animation-delay: .3s }
/* … through .hero__highlights { animation-delay: .8s } */

@keyframes heroReveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

**Why `opacity: 0` in the base rule *and* in the keyframe**
`animation-delay` does not apply the first keyframe during the delay unless you also set `animation-fill-mode: backwards`. Setting `opacity: 0` directly on the element covers the pre-delay window; `forwards` holds the final state after it finishes. Without `forwards`, every hero block would snap back to invisible at the end.

**The `orbitSpin` trap — worth memorising**

```css
.hero__orbit { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.hero__orbit { animation: orbitSpin 90s linear infinite; }

@keyframes orbitSpin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
}
```

`transform` is a single property. The moment the animation runs, its `transform` value **replaces** the static `translate(-50%, -50%)`. If the keyframes only said `rotate(0deg) → rotate(360deg)`, the element would jump down-right by half its size the instant the animation started. Repeating the translate inside the keyframes is mandatory. (The modern alternative is the independent `translate` / `rotate` / `scale` properties, which don't clobber each other.)

**Reduced motion**

```css
@media (prefers-reduced-motion: reduce) {
    .hero__content > *, .hero__visual, .achievement-card, .hero__orbit, .hero::after {
        animation: none; opacity: 1;
    }
    .hero__content > *, .hero__visual, .achievement-card { transform: none; }
}
```

Note that `.hero__orbit` is deliberately excluded from the `transform: none` list — resetting its transform would undo the centring translate and knock the rings off-centre. Small detail, big signal in an interview.

**Common mistakes**
- Animating `top`/`left`/`width` instead of `transform`/`opacity` (layout on every frame vs compositor-only).
- Blanket `* { animation: none }` in the reduced-motion block, breaking layout that depends on transforms.
- Staggering with per-element delays when the list is dynamic — use `nth-child` or a CSS variable index instead.

**Related:** compositing, `animation-fill-mode`, `steps()`, `prefers-reduced-motion`, the individual transform properties.

---

### Topic 17 — Responsive Strategy: Desktop-First With Seven Breakpoints

**The ladder:** 1440 → 1200 → 992 → 768 → 576 → 425 → 360, plus one `(max-height: 500px) and (orientation: landscape)`.

**What changes at each level (from the actual file)**
- **1440** — container narrows, editor `max-width: 660px`, cards pull in.
- **1200** — nav gap and font shrink, editor body becomes `42px 158px minmax(0,1fr)`, code drops to `.74rem`, highlights go 3→2 columns.
- **992** — the big one: desktop nav hidden, hamburger shown, hero grid collapses to one column, highlights reset to `width: 100%`, `.hero__visual` padding removed.
- **768** — Resume button hidden, explorer hidden and the grid becomes `38px minmax(0,1fr)`, orbit hidden, status bar items 3+ hidden, cards repositioned.
- **576** — buttons stack full-width, code drops to `.6rem`, cards shrink further.
- **425** — the dotted map is dropped entirely.
- **360** — smallest safe sizes for icon buttons and title.

**Why desktop-first here**
The design we were matching is a desktop composition; base CSS describes it, and each query simplifies. Mobile-first (`min-width`) is usually preferable for content sites because the smallest, cheapest layout is the default. Be ready to say which you'd choose and why — the honest answer is "desktop-first matched the source design and the complex piece is the desktop editor, so overriding downward meant less code."

**Two techniques worth calling out**

```css
.workspace__status-item:nth-child(n + 3) { display: none; }   /* keep only branch + errors */
```
`nth-child(n+3)` selects the 3rd element onward — an elegant way to trim a variable list.

```css
@media (max-height: 500px) and (orientation: landscape) { .mobile-navigation { padding-top: 5rem } }
```
Compound conditions handle the case where a phone in landscape has plenty of width but almost no height.

**Common mistakes**
- Hiding an element with `display: none` but leaving its grid track defined (leaves a gap).
- Choosing breakpoints from device names instead of where the layout actually breaks.
- Forgetting the viewport meta tag, which makes every query behave as if the screen were ~980px.

**Related:** `minmax(0, 1fr)`, `clamp()`, progressive disclosure, the viewport meta tag.

---

### Topic 18 — Accessibility Decisions Actually Present in the Code

| Feature | Code | Why |
|---|---|---|
| Skip link | `.skip-link { left: -9999px } .skip-link:focus { left: 1rem }` | Keyboard users bypass the nav; visible only when focused |
| Landmarks | `<header> <nav> <main> <aside> <footer>` | Screen-reader landmark navigation |
| Icon-button names | `aria-label="Toggle Theme"`, `"Open Theme Customizer"`, `"Open Menu"` | Buttons contain only SVG — no text node to announce |
| Decorative icons | `aria-hidden="true"` on every non-interactive SVG | Stops AT reading "graphic, graphic, graphic" |
| Menu state | `aria-expanded` toggled in `openMenu`/`closeMenu`, `aria-controls="mobileNavigation"` | Announces open/closed and the relationship |
| Keyboard dismiss | `if (event.key === "Escape") closeMenu()` | Expected behaviour for any overlay |
| Motion preference | CSS `@media (prefers-reduced-motion: reduce)` + JS `matchMedia(...).matches` guard | Honours the OS setting in both layers |
| External links | `rel="noopener"` with `target="_blank"` | Prevents `window.opener` access |
| Nav semantics | `<ul><li><a>` inside `<nav aria-label="Primary Navigation">` | Count and role announced correctly |

**Honest gaps (say these before the interviewer finds them)**
1. No focus trap in the drawer; focus can escape to background content.
2. Focus is not returned to the hamburger when the drawer closes.
3. No visible custom `:focus-visible` style — we rely on the UA default outline.
4. The fake code block is read out by screen readers as a wall of text; `aria-hidden="true"` on `.code` (it's decorative) would be kinder.
5. `.hero__typing-text` changes constantly; `aria-live` is absent, which is *correct* here (announcing it would be noise), but the reasoning should be explicit.

**Related:** WCAG focus order, `inert`, `:focus-visible`, ARIA live regions.

---

### Topic 19 — Loading, Ordering, and the FOUC Question

**Stylesheet order in `index.html`**

```html
<link rel="stylesheet" href="css/variables.css">   <!-- tokens + reset first -->
<link rel="stylesheet" href="css/layout.css">      <!-- structure -->
<link rel="stylesheet" href="css/components.css">  <!-- skin -->
<link rel="stylesheet" href="css/animations.css">  <!-- motion -->
<link rel="stylesheet" href="css/responsive.css">  <!-- overrides last -->
```

Same specificity means **source order decides**, so `responsive.css` must load last for its media queries to win over `components.css`. Note that a media query adds no specificity — `@media (max-width: 768px) .btn { … }` and `.btn { … }` are both 0-1-0.

**Script placement**

```html
    <script src="js/main.js"></script>
</body>
```

At the end of `<body>`, so the DOM exists when the script runs — that's why `document.querySelector` at the top of the file works without a `DOMContentLoaded` wrapper. The modern equivalent is `<script defer src="…">` in the `<head>`, which starts the download earlier and still executes after parsing.

**The theme FOUC**
`localStorage` is read *after* the CSS has painted the dark default. If a user has chosen light mode, they see a dark flash on every page load. The standard fix is a tiny blocking inline script in `<head>`:

```html
<script>
  const t = localStorage.getItem("theme");
  if (t) document.documentElement.setAttribute("data-theme", t);
</script>
```

Being able to identify this unprompted is a strong signal.

**`load` vs `DOMContentLoaded`**

```js
window.addEventListener("load", () => { handleHeader(); updateProgressBar(); updateActiveNavigation(); });
```

`load` fires after images/fonts finish, so `scrollHeight` and section offsets are final — which matters because the browser may restore a scroll position on refresh. `DOMContentLoaded` would fire earlier with potentially wrong measurements. The trade-off is a slightly later first sync.

**`@import` for fonts**
`variables.css` starts with two `@import url('https://fonts.googleapis.com/…')` statements. This is the slowest way to load fonts: the browser must download `variables.css`, parse it, *then* discover and fetch the font CSS, then the font files — a serialised chain. `<link rel="preconnect">` + `<link rel="stylesheet">` in the HTML head parallelises it. Also worth mentioning: `font-display: swap` (Google's URLs include `&display=swap`, which we kept) prevents invisible text while fonts load.

**Related:** critical rendering path, render-blocking resources, `defer`/`async`, FOUC/FOIT, preconnect.

---
