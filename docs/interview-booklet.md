# Code-Based Interview Booklet — `Portfolio_js`

Every question here comes from code that exists in this repository. An interviewer with your `index.html`, the five CSS files, and `main.js` open on screen could ask all of them.

**How to use it:** read the question, answer out loud before reading the answer, then compare against the "3-Year Answer". The short version is what you'd actually say in the room.

---

## Section A — Core Q&A Bank (question · what's tested · beginner answer · 3-year answer · short answer · follow-up)

### A1. `.hero__wrapper` uses `minmax(0, 1fr)` instead of `1fr`. Why?

**Level:** 3 years
**What the interviewer is testing:** Whether you understand grid track sizing, or just copied a snippet.

**Beginner Answer**
"`1fr` means the column takes one share of the free space. I used `minmax(0, 1fr)` so the column is also allowed to get smaller than its content if it needs to."

**3-Year Answer**
"`1fr` is actually shorthand for `minmax(auto, 1fr)`, and that `auto` minimum is the important part — it means the track can never be smaller than the min-content size of what's inside it. That bit me in this project. My `.hero__highlights` row is deliberately `width: calc(100% + 8.5rem)` so the three cards can be wider than the text column and match the design. On desktop it was fine because the grid had two explicit columns, but at the 992px breakpoint I collapsed to `grid-template-columns: 1fr` and that oversized child pushed the single column wider than the viewport. Then `.container`'s `width: min(94%, 1520px)` resolved against a too-wide parent and the entire page shifted right on mobile. Changing it to `minmax(0, 1fr)` and resetting the highlights to `width: 100%` in that media query fixed it. It's the grid version of the flexbox `min-width: auto` problem — same root cause, different property."

**Short Interview Answer**
"`1fr` is really `minmax(auto, 1fr)`, so the track can't shrink below its content. I had an intentionally oversized child that was forcing the column wider than the viewport on mobile — `minmax(0, 1fr)` lets the track shrink and the overflow gets clipped instead."

**Possible Follow-Up:** "How did you confirm that was the cause and not something else?"
**Follow-Up Answer:** "I loaded the page inside an iframe at fixed widths — 320, 375, 414, 768, 1024, 1280 — and compared `documentElement.scrollWidth` to `clientWidth` at each, logging any element whose `getBoundingClientRect().right` exceeded the viewport. That told me exactly which element was overflowing and at which breakpoint, instead of guessing from a screenshot."

---

### A2. Why is the header's visual styling on `.header-wrapper` and not on `.site-header`, which is the sticky element?

**Level:** Intermediate → 3 years
**Testing:** Understanding of sticky positioning constraints and separation of concerns.

**Beginner Answer**
"The header is a rounded card with space around it. `.site-header` is the full-width sticky container and `.header-wrapper` is the card inside it that has the border, background blur, and rounded corners."

**3-Year Answer**
"Two reasons. First, `position: sticky` with `top: 0` needs to be on a full-width, full-flow element — if I made the rounded pill itself sticky, the padding that creates the floating gap would have to live somewhere else and the sticky offset would be wrong. Second, it separates positioning from painting: `.site-header` handles `position`, `z-index: 1000`, and `padding-block`, while `.header-wrapper` handles `background: rgba(13,17,25,.72)`, `backdrop-filter: blur(20px)`, `border-radius: 20px`, and the shadow. That also makes the scrolled state trivial — JS adds `.scrolled` to the outer element and I style `.site-header.scrolled .header-wrapper`, so I never have to touch the positioning rules to change the look."

**Short Answer**
"Outer element positions, inner element paints. Sticky needs a full-width flow element; the visible pill is the inner card."

**Follow-Up:** "What would break sticky positioning here?"
**Follow-Up Answer:** "Any ancestor with `overflow: hidden`, `auto`, or `scroll` — the header would stick to that scroll container instead of the viewport. That's exactly why I used `overflow-x: clip` on `html` rather than `hidden`: `clip` doesn't create a scroll container, so sticky still works."

---

### A3. You have `overflow-x: clip` on `html` and `overflow-x: hidden` on `body`. Isn't that redundant?

**Level:** 3 years
**Testing:** Depth on a subtle CSS distinction most people get wrong.

**Beginner Answer**
"Both stop the page scrolling sideways. I added them so nothing overflows horizontally on mobile."

**3-Year Answer**
"They're not the same thing. `overflow: hidden` clips the content *and* makes the element a scroll container — the content is still scrollable programmatically, and critically, a scroll container breaks `position: sticky` for descendants and changes what `scroll-behavior` applies to. `overflow: clip` clips without creating a scroll container, which is what I actually want on `html`, because my header is sticky. The `hidden` on `body` is a fallback for older browsers that don't support `clip`. If I were shipping this today I'd probably keep both, but the right mental model is: `clip` is 'truncate the paint', `hidden` is 'truncate the paint and become scrollable'."

**Short Answer**
"`hidden` creates a scroll container and can break sticky positioning; `clip` just clips. `clip` on `html` is the correct one here, `hidden` on `body` is the legacy fallback."

**Follow-Up:** "Why did you need either? Shouldn't you fix the overflow at the source?"
**Follow-Up Answer:** "I did fix the source — the `minmax(0,1fr)` change and moving the drawer to a transform. These are defence in depth. My hero deliberately paints things outside the container: the stat cards use negative offsets like `left: -78px` and the background glow is a 900px circle at `right: -200px`. Those are clipped by `.hero { overflow: hidden }`, but the root-level rule guarantees no future addition introduces a sideways scrollbar."

---

### A4. The mobile drawer used to be `right: -100%`. You changed it to `transform: translateX(100%)`. Why?

**Level:** 3 years
**Testing:** Layout vs paint, and whether you understand what creates scrollable overflow.

**Beginner Answer**
"`right: -100%` puts it off-screen, but that made the page scroll sideways. Using `transform` moves it visually without affecting the layout."

**3-Year Answer**
"`right: -100%` positions the element a full viewport-width past the right edge, and because it's a real layout position, it extends the document's scrollable width. You get phantom horizontal scroll on every page. `transform` is applied at paint/composite time — the element still occupies its original box as far as layout is concerned, so it contributes nothing to the scroll extents. It's also the cheaper animation: transitioning `right` invalidates layout on every frame, whereas transitioning `transform` runs on the compositor. I paired it with `visibility: hidden` and put `visibility` in the transition list so the drawer isn't keyboard-focusable while closed but the 450ms slide-out is still visible."

**Short Answer**
"`right: -100%` is a layout position, so it adds to the document's scroll width. `transform` doesn't affect layout at all, and it animates on the compositor instead of triggering reflow."

**Follow-Up:** "Explain the `visibility` part — you can't animate `visibility` smoothly."
**Follow-Up Answer:** "Right, it's a discrete property, but it *is* transitionable: when going to `hidden` the change is deferred to the end of the duration, and when going to `visible` it applies immediately. So opening is instant-visible then slides in, and closing slides out for the full 450ms and only then becomes hidden. If I left `visibility` out of the transition, the close animation would be invisible because the element would disappear on frame one."

---

### A5. Walk me through the typewriter effect. Why recursive `setTimeout` rather than `setInterval`?

**Level:** Intermediate → 3 years
**Testing:** Timers, the event loop, state management without a framework.

**Beginner Answer**
"I have an array of roles and three variables: which word, how many letters, and whether I'm deleting. Each time `typeRole` runs it adds or removes one character with `slice`, updates `textContent`, and schedules itself again with `setTimeout`. I used `setTimeout` because the delay is different for typing, deleting, and pausing."

**3-Year Answer**
"It's a small state machine driven by timers. `roleIndex`, `characterIndex`, and `isDeleting` persist between ticks; each invocation does one DOM write and schedules the next call. `setInterval` can't work here because I have four different delays — 90ms typing, 55ms deleting, a 1400ms pause at the end of a word, and 400ms before the next word. There's also a reliability argument: `setInterval` queues callbacks regardless of whether the previous one finished, so in a throttled background tab you can get a pile-up; recursive `setTimeout` can't overlap by construction. The word cycling is `(roleIndex + 1) % roles.length`. The caret isn't JS at all — it's a `::after` pseudo-element with `animation: typingCursor .8s steps(1) infinite`, so the blink is discrete rather than a fade. And the whole thing is behind a `matchMedia('(prefers-reduced-motion: reduce)')` check, with a real default word in the HTML so reduced-motion users still see 'TypeScript' instead of an empty span."

**Short Answer**
"It's a timer-driven state machine. Recursive `setTimeout` because the delay changes per phase — typing, deleting, and two different pauses — which `setInterval`'s fixed period can't express, and it can't overlap callbacks."

**Follow-Up:** "Any problem with this implementation?"
**Follow-Up Answer:** "I never store the timeout id, so there's no way to stop it. On a static page that's fine, but if this were a component that unmounts, or if `#typingText` were removed from the DOM, I'd keep writing to a detached node forever. I'd hold the id in a variable and clear it on teardown. I'd also listen for `change` on the `matchMedia` result instead of reading `.matches` once, so flipping the OS setting takes effect without a reload."

---

### A6. Why is the anchor click handler a regular `function` when everything else uses arrow functions?

**Level:** Intermediate
**Testing:** `this` binding — a classic, and here it's load-bearing.

**Beginner Answer**
"Because inside the handler I use `this.getAttribute('href')`, and `this` only refers to the clicked link if it's a normal function. An arrow function doesn't have its own `this`."

**3-Year Answer**
"Arrow functions don't bind their own `this`; they close over the `this` of the enclosing scope, which at the top level of a classic script is `undefined` in strict mode or `window` otherwise. `addEventListener` calls a normal function with `this` set to the element the listener is attached to, which is what I rely on for `this.getAttribute('href')`. I could have used an arrow function and read `event.currentTarget.getAttribute('href')` instead — that's arguably clearer and I'd probably prefer it now, because mixing function styles in one file invites someone to 'tidy it up' into an arrow and silently break it. Note `currentTarget`, not `target`: if I ever put an icon inside the link, `event.target` would be the `<svg>`, not the `<a>`."

**Short Answer**
"I use `this` to read the clicked link's `href`, and arrow functions don't bind `this`. The arrow-safe version is `event.currentTarget`."

**Follow-Up:** "Why `currentTarget` and not `target`?"
**Follow-Up Answer:** "`target` is whatever was actually clicked, which could be a child element like an SVG icon inside the link. `currentTarget` is always the element the listener is bound to. With event delegation you'd use `event.target.closest('a[href^=\"#\"]')` instead."

---

### A7. There are three separate `scroll` listeners. Is that a problem?

**Level:** 3 years
**Testing:** Performance awareness and honesty about your own code.

**Beginner Answer**
"They each do a different job — the header shadow, the progress bar, and the active nav link. It works, but running three functions on every scroll could be slow."

**3-Year Answer**
"It's the weakest part of the file and I'd change it. Three listeners is a minor cost; the real problem is `updateActiveNavigation`, which reads `section.offsetTop` and `section.offsetHeight` for every section on every scroll event. Those are layout-forcing reads — if any style was invalidated since the last layout, the browser has to synchronously recalculate before it can answer, and I'm doing that in a tight loop while also writing classes. That's layout thrashing. Four fixes, in order of value: replace the scroll-spy with an `IntersectionObserver` so the browser does the intersection maths off the main thread; merge the remaining handlers into one and gate it behind `requestAnimationFrame` with a `ticking` flag so it runs at most once per frame; add `{ passive: true }` so the browser doesn't have to wait to see if I call `preventDefault()`; and cache the section offsets, recomputing on `resize` rather than on scroll. I'd also switch the progress bar from animating `width` to `transform: scaleX()`, since width is a layout property and scale is compositor-only."

**Short Answer**
"It works but it's not optimal. The scroll-spy reads `offsetTop` every scroll event, which forces layout. I'd move it to an IntersectionObserver, merge the rest into one passive listener throttled with rAF, and drive the progress bar with `transform: scaleX()` instead of `width`."

**Follow-Up:** "Show me the rAF throttle."
**Follow-Up Answer:**
```js
let ticking = false;
window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        handleHeader();
        updateProgressBar();
        ticking = false;
    });
}, { passive: true });
```
"The flag means extra scroll events during a frame are dropped rather than queued, so the work happens at most once per painted frame."

---

### A8. Why did you store the theme on `<html>` as an attribute instead of adding a class or setting styles in JS?

**Level:** Intermediate → 3 years
**Testing:** Separation of concerns and CSS architecture.

**Beginner Answer**
"CSS has a `[data-theme="light"]` block that redefines the colour variables. JS just sets the attribute and CSS does the rest, so I never have to write colours in JavaScript."

**3-Year Answer**
"The state lives in one place — an attribute on the root element — and every visual consequence is expressed in CSS. `[data-theme='light']` redefines about a dozen custom properties, and because those are inherited from `:root`, every component re-resolves automatically. JS's entire job is three lines: read `localStorage`, flip the attribute, write it back. I chose an attribute over a class deliberately: I have two independent theming axes, `data-theme` for light/dark and `data-color` for the accent, and attributes express 'one value from a set' better than classes, which are additive and can end up with `light` and `dark` both applied. It also makes the icon swap free — `.icon--sun { display: none }` plus `[data-theme='light'] .icon--moon { display: none }` means I ship both SVGs and CSS picks. No `innerHTML` rewriting, no icon flicker."

**Short Answer**
"JS owns the state, CSS owns the appearance. One attribute on `<html>` re-resolves every custom property, and an attribute models mutually-exclusive values better than a class."

**Follow-Up:** "There's a bug in the theme code. Can you find it?"
**Follow-Up Answer:** "Flash of wrong theme. `main.js` is at the end of `<body>`, so the browser has already painted the dark default before I read `localStorage`. A returning light-mode user sees a dark flash on every load. The fix is a tiny blocking inline script in `<head>` that sets the attribute before first paint — it has to be render-blocking, which is one of the few times that's the right call. Also, `data-theme='dark'` is written to storage even though dark is the default, which is harmless but means I can't distinguish 'chose dark' from 'never chose', so I can't fall back to `prefers-color-scheme` for new users."

---

### A9. Explain the achievement card positioning — specifically `bottom: calc(100% - 8px)`.

**Level:** Intermediate → 3 years
**Testing:** Containing blocks and how percentage offsets resolve.

**Beginner Answer**
"The cards are `position: absolute` inside `.hero__stage`, which is `position: relative`. `bottom: 100%` puts the card completely above the stage, and subtracting 8px moves it down so it overlaps the top of the editor slightly."

**3-Year Answer**
"For an absolutely positioned element, `bottom` is the distance from the bottom edge of the element to the bottom edge of the containing block's padding box, and a percentage resolves against the containing block's **height**. So `bottom: 100%` means 'my bottom edge is one full container-height above the container's bottom edge' — i.e. sitting exactly on top of it. `calc(100% - 8px)` pulls it back down 8px so it overlaps the editor's title bar, which is what the reference design shows. The reason I introduced `.hero__stage` at all is that the cards have to be anchored to the editor window, not to the grid column. `.hero__visual` has `padding-right: 52px` and `justify-content: flex-end`, so positioning against it would have made every offset drift as the column resized. The stage is a tight `max-width: 700px` wrapper that matches the editor exactly, so `left: -78px` reliably means '78px past the editor's left edge' at any viewport width."

**Short Answer**
"They're absolute inside `.hero__stage`, which is relative and exactly the editor's width. `bottom: 100%` sits the card directly on top of the container, and `-8px` overlaps the title bar. The stage exists so the offsets are relative to the editor rather than the grid column."

**Follow-Up:** "What stops those negative offsets from creating horizontal scroll?"
**Follow-Up Answer:** "`.hero { overflow: hidden }` clips them at the section boundary, plus `overflow-x: clip` on `html`. That's a real consideration — `left: -78px` on the Countries card genuinely paints outside the container, and without clipping it would extend the scrollable area."

---

### A10. Why is `isolation: isolate` on `main` and `.hero`?

**Level:** 3 years
**Testing:** Stacking contexts — a genuine senior-level differentiator.

**Beginner Answer**
"The hero background uses `z-index: -1` and `-2`. `isolation: isolate` keeps those layers inside the hero so they don't end up behind other things on the page."

**3-Year Answer**
"Negative z-index children paint behind their parent's background but stay within the nearest stacking context. If the hero didn't establish one, `.hero::before` at `z-index: -2` could paint behind ancestors it shouldn't — you'd lose the grid entirely under the page background, or it would show through elements that come earlier in the tree. `isolation: isolate` creates a stacking context without the side effects of the usual tricks: I don't have to set a `z-index` on the parent (which would drag it into its siblings' ordering) or use `opacity: .999` or a dummy `transform`. It's the explicit, self-documenting way to say 'z-index inside here is a private numbering system'. Putting it on `main` as well means the hero's whole layer stack is contained relative to the header and the sticky progress bar."

**Short Answer**
"It creates a stacking context so the hero's `z-index: -1` and `-2` background layers stay trapped inside the hero, without needing a z-index or an opacity hack on the parent."

**Follow-Up:** "Name three other things that create a stacking context."
**Follow-Up Answer:** "A positioned element with a `z-index` other than `auto`; `opacity` less than 1; `transform`, `filter`, `backdrop-filter`, or `will-change` on those; plus flex/grid children with a z-index, and `contain: paint`. The one that catches people out is `transform` — it also makes the element a containing block for `position: fixed` descendants, so a fixed modal inside a transformed parent stops being fixed to the viewport."

---

### A11. The code block in `index.html` is formatted differently from the rest of the file — every line is one long unbroken line. Why?

**Level:** Intermediate → 3 years
**Testing:** Whether you understand `white-space: pre` and can tell a real debugging story.

**Beginner Answer**
"`.code__text` has `white-space: pre`, which keeps all the spaces and line breaks from the HTML source. If I pretty-print the HTML, those newlines show up as real line breaks in the rendered code, so each line has to be on a single source line."

**3-Year Answer**
"This was an actual bug. I originally wrapped the markup for readability, so a line looked like `<span class='tok-prop'>countries</span>:` then a newline and indentation before `<span class='tok-num'>15</span>,`. With `white-space: pre` those are literal characters, so the browser rendered a line break in the middle of line 4 — the value dropped to its own row and the gutter numbers stopped lining up with the content. Three lines were broken this way. The fix was to generate the block with exactly one physical source line per rendered line, which is why that section looks unformatted. It's the classic trade-off with `pre`: your source formatting becomes content. The alternative would be `white-space: pre-wrap` with `<br>` control, or building the block from a JS array — but for static decorative markup, one-line-per-line is the simplest thing that works."

**Short Answer**
"`white-space: pre` makes source newlines and indentation render literally. Pretty-printing the HTML was inserting real line breaks mid-statement and desyncing the line numbers, so each rendered line has to live on one source line."

**Follow-Up:** "How would you build that code block if the content were dynamic?"
**Follow-Up Answer:** "I'd keep the content as an array of strings in JS and render line elements from it, so the line numbers come from the index and can't drift. For real source code I'd use a syntax highlighter — Shiki or Prism — and ideally run it at build time so the browser gets pre-tokenised HTML with no runtime JS cost."

---

### A12. Every icon is inline SVG. What are the trade-offs versus an icon font or `<img>` sprites?

**Level:** Intermediate → 3 years
**Testing:** Judgement, not dogma.

**Beginner Answer**
"Inline SVG scales without blurring, I can change the colour with CSS using `currentColor`, and there are no extra network requests. Icon fonts can render as boxes if the font fails, and images can't be recoloured."

**3-Year Answer**
"Inline SVG wins on control: `stroke='currentColor'` means the icon inherits the CSS `color`, so hover states, theme changes, and the `.file-icon--react { color: #61DAFB }` accents are all one declaration. No extra requests, no FOIT, crisp at any DPI, and I can animate individual paths if I want. The costs are real though — `index.html` is now dominated by icon markup, none of it is cached separately, and the same icon repeated in the file tree is duplicated bytes. For this page, with a handful of distinct icons on a single view, inline is correct. At around 30–50 icons or across multiple pages I'd switch to an SVG sprite with `<use href='#icon-react'>` so each shape is defined once, or generate components if there were a build step. Icon fonts I'd avoid entirely now: they're a single point of failure, they inherit text-rendering quirks, and they're semantically text pretending to be images."

**Short Answer**
"Inline SVG gives me `currentColor` theming, zero extra requests, and crisp scaling. The cost is HTML bloat and no separate caching — at 30+ icons I'd move to a `<use>` sprite."

**Follow-Up:** "You define `id='mapDots'` and `id='logoGradient'` inside SVGs. Any risk?"
**Follow-Up Answer:** "Yes — ids are document-global. `fill='url(#mapDots)'` resolves to the first matching id in the document, so if that SVG were duplicated, every copy would reference the first one's pattern. It's fine here because each is used once, but in a component system you'd suffix ids per instance or use a single sprite. It's also a real problem with `<base href>` in older browsers, where relative `url(#id)` references can resolve against the base URL."

---

### A13. Explain how the hero background grid is made without an image.

**Level:** Intermediate
**Testing:** Gradients, `background-size`, masking.

**Beginner Answer**
"Two linear gradients on `.hero::before` — one draws a 1px horizontal line and the other a 1px vertical line — and `background-size: 60px 60px` repeats them into a grid."

**3-Year Answer**
"Each gradient is a hard stop: `linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px)` is a 1px band of colour then nothing, and the `90deg` version does the same horizontally. Tiling them at `60px 60px` gives a 60px grid with zero image requests and a file size of nothing. Then `mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%)` fades it out toward the edges — masks use the alpha channel of the mask image to decide what's visible, so opaque areas keep the grid and transparent areas hide it. That's what stops the grid from colliding with the page edges and competing with the text. I shipped the `-webkit-mask-image` prefix alongside for older Safari. The whole layer is `z-index: -2` with `pointer-events: none` so it can't intercept clicks."

**Short Answer**
"Two hard-stop linear gradients tiled with `background-size: 60px 60px` make the grid; a radial-gradient `mask-image` fades it out at the edges. No images, no requests."

**Follow-Up:** "How would you make the grid scroll with parallax?"
**Follow-Up Answer:** "Animate `transform: translateY()` on the pseudo-element driven by scroll position, not `background-position` — transform is compositor-only, background-position triggers repaint. Better still, use a scroll-driven animation (`animation-timeline: scroll()`) where supported so the main thread isn't involved at all, with a rAF-throttled fallback."

---

### A14. `.hero__highlights` has `width: calc(100% + 8.5rem)`. Defend that.

**Level:** 3 years
**Testing:** Whether you can justify a hack, and whether you know it's a hack.

**Beginner Answer**
"The three cards needed to be wider than the text column to match the design, so I made the row 8.5rem wider than its container."

**3-Year Answer**
"It's a deliberate overflow. In the reference design the card row extends further right than the paragraph above it — the text column is about 680px but the cards span about 810px, and they sit below the editor so there's no collision. Rather than restructure the grid, I let that one row break out of its column. I'm not going to pretend it's elegant: it's a magic number tied to the current column ratio, and it caused the mobile overflow bug until I reset it to `width: 100%` at the 992px breakpoint and switched the track to `minmax(0, 1fr)`. If I were making this maintainable I'd move the highlights out of `.hero__content` and make them a full-width row spanning both grid columns with `grid-column: 1 / -1`, which expresses the intent structurally instead of numerically. I kept it because it was a targeted change late in a pixel-matching pass, and I documented the risk."

**Short Answer**
"It's an intentional break-out so the card row matches the design's width. It's a magic number and it caused a mobile overflow until I reset it in the breakpoint — the cleaner fix is to make the row a full-width grid item with `grid-column: 1 / -1`."

**Follow-Up:** "Show me that refactor."
**Follow-Up Answer:** "Move `.hero__highlights` out of `.hero__content` into `.hero__wrapper`, change the wrapper to two columns and two rows, and give the highlights `grid-column: 1 / -1`. The width then comes from the grid, no calc needed, and the mobile reset disappears too."

---

### A15. Why do you have both `scroll-behavior: smooth` in CSS and `scrollIntoView({ behavior: 'smooth' })` in JS?

**Level:** Intermediate
**Testing:** Awareness of overlap and whether you can justify redundancy.

**Beginner Answer**
"`scroll-behavior: smooth` makes all scrolling smooth, including anchor links. The JS also scrolls smoothly and lets me check the target exists first."

**3-Year Answer**
"Honestly the CSS rule alone would produce the same animation — once `scroll-behavior: smooth` is set on `html`, even a plain anchor jump animates. The JS handler earns its place for the guards, not the smoothness: it skips `href='#'` (my logo link, which would otherwise scroll to the top unexpectedly), it bails if the target doesn't exist rather than leaving a broken jump, and it gives me a hook to add behaviour later — closing the mobile drawer, pushing a history entry, firing analytics. If I removed the CSS rule the JS would still be smooth because I pass `behavior: 'smooth'` explicitly. The piece that genuinely can't be done in JS here is `scroll-padding-top: 120px`, which stops the sticky header covering the section you land on."

**Short Answer**
"The CSS rule does the smoothing; the JS handler exists for the guards and as an extension point. The important CSS line is actually `scroll-padding-top`, which keeps the sticky header from covering the target."

**Follow-Up:** "What's missing from your smooth-scroll implementation?"
**Follow-Up Answer:** "Three things. The URL hash isn't updated, so back/forward doesn't step through sections and you can't share a link to one. Focus isn't moved to the target, so a keyboard user's next Tab continues from the nav, not the section — the accessible fix is to set `tabindex='-1'` on the target and call `.focus()`. And I don't disable smooth scrolling under `prefers-reduced-motion`, which I do handle for the other animations."

---

### A16. What does `.workspace__status-item:nth-child(n + 3) { display: none }` select, and why did you use it?

**Level:** Intermediate
**Testing:** Selector fluency.

**Beginner Answer**
"It hides the third status bar item and everything after it on mobile, so only the branch name and error count are left."

**3-Year Answer**
"`nth-child(n+3)` expands to n=0,1,2… giving positions 3, 4, 5 and onward — everything from the third child on. I used it in the ≤768px block because the status bar has seven items and on a phone there's only room for the branch and the two counters. Writing it structurally means I don't have to add a class to each item or update the rule if I add an eighth. One caveat worth naming: `nth-child` counts *all* siblings, not just those matching the class, so if I ever put a non-`.workspace__status-item` element in that group the counting would shift. `nth-of-type` wouldn't help since these are all spans — the robust version is `:nth-child(n+3 of .workspace__status-item)` where supported."

**Short Answer**
"Third child onward. It trims the status bar to branch plus counters on mobile without needing per-item classes."

**Follow-Up:** "How would you select only the *last two* instead?"
**Follow-Up Answer:** "`:nth-last-child(-n + 2)` — counting from the end, positions 1 and 2."

---

### A17. The `orbitSpin` keyframes repeat `translate(-50%, -50%)` in both `from` and `to`. Why not just rotate?

**Level:** 3 years
**Testing:** Understanding that `transform` is a single property.

**Beginner Answer**
"Because the element is centred using `transform: translate(-50%, -50%)`, and if the animation only set `rotate()` it would overwrite that and the rings would jump out of place."

**3-Year Answer**
"`transform` is one property holding a list of functions, so any keyframe that sets `transform` replaces the whole list. `.hero__orbit` is centred with `top: 50%; left: 50%; transform: translate(-50%, -50%)`, and the moment the animation starts, the animated value wins over the static one — without the translate in the keyframes, the element would snap down and right by half its own size on frame one and spin around the wrong origin. Repeating the translate keeps both. The modern alternative is the individual `translate`, `rotate`, and `scale` properties, which compose independently: I could set `translate: -50% -50%` in the rule and animate only `rotate`, and they'd never clobber each other. I'd use that today. The same trap shows up in my reduced-motion block — I reset `transform: none` for the hero content and cards, but deliberately left `.hero__orbit` out, because resetting its transform would un-centre it."

**Short Answer**
"`transform` is a single property, so the animation's value replaces the static centring translate. Repeating it in the keyframes preserves both — or use the individual `translate`/`rotate` properties, which don't overwrite each other."

**Follow-Up:** "Would `transform-origin` have solved it instead?"
**Follow-Up Answer:** "No. `transform-origin` changes the pivot point, not the translation. The element would still lose its `-50%, -50%` offset and be positioned wrong; it would just rotate around a different point while being wrong."

---

### A18. Why does `.hero__content > *` have `opacity: 0` in the base rule when the keyframe already starts at `opacity: 0`?

**Level:** 3 years
**Testing:** `animation-delay` and `animation-fill-mode`.

**Beginner Answer**
"So the elements are invisible before their animation starts. They all have different delays, and during the delay the animation hasn't applied yet."

**3-Year Answer**
"During an `animation-delay`, the element renders with its normal computed styles — the first keyframe is not applied unless you set `animation-fill-mode: backwards` or `both`. My stagger runs from 0.1s to 0.8s, so without `opacity: 0` on the element itself, all eight blocks would flash fully visible for up to 800ms and then start animating in. Two ways to fix it: declare `opacity: 0` in the rule (what I did) or use `fill-mode: both`. I use `forwards` in the shorthand to hold the end state — drop that and every element snaps back to `opacity: 0` the moment its animation completes, which is a spectacular bug because the page renders correctly and then goes blank."

**Short Answer**
"`animation-delay` doesn't apply the first keyframe — the element shows its normal styles until the animation starts. `opacity: 0` covers the delay window and `forwards` holds the end state afterwards. `fill-mode: both` would do both jobs."

**Follow-Up:** "Your stagger uses eight hand-written `animation-delay` rules. What if the number of children changed?"
**Follow-Up Answer:** "I'd drive it structurally instead — `.hero__content > *:nth-child(n) { animation-delay: calc(var(--i, 0) * 0.1s) }` with an inline `--i`, or a small loop that sets the custom property in JS. For a fixed hero the explicit rules are readable and fine, but they're a maintenance trap the moment someone inserts an element in the middle."

---

### A19. What is `color-mix(in srgb, var(--primary-color) 13%, transparent)` doing, and why not just write `rgba(59,130,246,.13)`?

**Level:** 3 years
**Testing:** Modern CSS and token discipline.

**Beginner Answer**
"It mixes 13% of the primary colour with transparent, so I get a faded version of the accent for the background glow. Writing it this way means it changes if I change the primary colour."

**3-Year Answer**
"It keeps the glow tied to the token. If I hard-coded `rgba(59,130,246,.13)` and someone switched `data-color` to purple, the accent would change everywhere except the glow — which is exactly the kind of drift that makes theming systems rot. `color-mix()` lets me derive a colour from a custom property at computed-value time, which you can't do with `rgba()` because you can't decompose a var into channels. The `in srgb` part specifies the interpolation colour space; `oklab` would give a more perceptually even mix, which matters more for midpoint blends than for mixing with transparent. The trade-off is browser support — it's widely available now, but if I needed older support I'd define the token as channel components (`--primary-rgb: 59 130 246`) and use `rgb(var(--primary-rgb) / 13%)` instead."

**Short Answer**
"It derives the glow colour from `--primary-color` so accent changes propagate. You can't do that with `rgba()` because you can't pull channels out of a custom property — the fallback is storing the channels as a token."

**Follow-Up:** "Where else would that pattern be useful in this file?"
**Follow-Up Answer:** "The hard-coded `rgba(59,130,246,.13)` on `.hero__highlight-icon` and the `rgba(59,130,246,.45)` hover border are the same idea written the old way — both should be `color-mix` with the token, and right now they'd stay blue if the accent changed."

---

### A20. `.code__text` has `flex: 0 0 auto`. What breaks without it?

**Level:** 3 years
**Testing:** Flex sizing defaults.

**Beginner Answer**
"Without it the code text shrinks and the long lines wrap instead of being cut off at the edge of the editor."

**3-Year Answer**
"Flex items default to `flex-shrink: 1`, so when a line is wider than the row, the item is compressed. Combined with `white-space: pre`, the text can't reflow, so you get overflow inside a squeezed box and the layout goes strange — in my case the long lines wrapped and the gutter numbers stopped matching. `flex: 0 0 auto` says: don't grow, don't shrink, size to content. The line then extends past the flex container and `.workspace__editor { overflow: hidden }` clips it, which produces exactly the 'word wrap off' look a real editor has. It's the same family of problem as `min-width: auto` on flex items — the default sizing rules are trying to be helpful and you have to opt out when you want overflow."

**Short Answer**
"Flex items shrink by default. Without `flex: 0 0 auto` the code line gets compressed instead of overflowing, so it wraps and the line numbers desync. With it, the line overflows and the editor's `overflow: hidden` clips it like a real editor."

**Follow-Up:** "How would you let users scroll the code horizontally instead of clipping it?"
**Follow-Up Answer:** "Change `.workspace__editor` from `overflow: hidden` to `overflow-x: auto`. I chose clipping because it's decorative and a scrollbar inside a fake editor screenshot would look wrong — but if this were real content, clipping it would be a genuine accessibility problem, since there'd be no way to read the hidden text."

---

## Section B — Browser / UI Observation Questions

*The interviewer opens the page, looks at it, and asks.*

### B1. "The header floats as a rounded pill and gets a stronger shadow once I scroll. How?"

**Testing:** Connecting a visible behaviour to sticky positioning + a JS class toggle.

**Beginner:** "`.site-header` is `position: sticky; top: 0`. The pill look comes from `.header-wrapper` — border-radius, a semi-transparent background, and `backdrop-filter: blur()`. In JS, `handleHeader()` adds a `scrolled` class when `window.scrollY > 20`, and CSS makes the background more opaque and the shadow bigger for `.site-header.scrolled .header-wrapper`."

**3-Year:** Same, plus: "The blur is `backdrop-filter`, not `filter` — it blurs what's behind the element rather than the element itself, which is why the grid background smears under it. The opacity going from `.72` to `.92` on scroll is deliberate: over the hero the header can be more transparent, but over dense content it needs more contrast for the nav text. I'd replace the scroll listener with an `IntersectionObserver` watching a 20px sentinel — same visual result, no work on the main thread per scroll event."

**Follow-Up:** "What if `backdrop-filter` isn't supported?"
**Answer:** "You still get the `rgba(13,17,25,.72)` background, so text stays readable — it just looks flat instead of frosted. That's a reasonable progressive enhancement. If I needed a guarantee I'd use `@supports (backdrop-filter: blur(1px))` and raise the background opacity in the fallback branch."

---

### B2. "The nav underline slides in on hover instead of just appearing."

**Testing:** Pseudo-elements and animating transforms vs layout properties.

**Beginner:** "`.nav-link::after` is a 2px bar the full width of the link with `transform: scaleX(0)`. On hover, and for `.active`, it becomes `scaleX(1)`, and the `transition` animates it."

**3-Year:** "Scaling rather than animating `width` matters: `width` is a layout property, so every frame would trigger layout and paint for that element and potentially its siblings; `transform` runs on the compositor. It's a 2px underline so nobody's going to notice on a desktop, but it's the same reflex that keeps a page smooth when there are fifty of them. One detail I'd change: I didn't set `transform-origin`, so it scales from the centre outward. The nav in the reference grows from the left, which is `transform-origin: left` — I actually did set that on the hero social links but not the nav, which is an inconsistency."

**Follow-Up:** "Why is `.active` styled with the same rule as `:hover`?"
**Answer:** "So the current section's link shows a permanent underline. JS adds `.active` in `updateActiveNavigation()` as you scroll, and grouping the selectors means the two states can never drift visually."

---

### B3. "There's a thin blue bar at the very top that fills as I scroll."

**Testing:** Scroll maths and the cost of the chosen implementation.

**Beginner:** "`.scroll-progress` is `position: fixed` at the top with `width: 0`. On scroll, JS calculates `scrollY / (scrollHeight - clientHeight) * 100` and sets that as the element's inline width percentage."

**3-Year:** "`scrollHeight - clientHeight` is the maximum scrollable distance, so the ratio is 0→1. There's a guard for `documentHeight <= 0` because on a page shorter than the viewport that's a divide-by-zero and you'd write `Infinity%` or `NaN%` into the style, which the browser drops silently — a bar that mysteriously never appears. It has `transition: width .1s linear`, which smooths out the steps. If I were tuning it I'd switch to `transform: scaleX()` with `transform-origin: left` — same visual, but it stays on the compositor instead of triggering layout on every scroll event. And I'd fold it into a single rAF-throttled scroll handler with the other two."

**Follow-Up:** "Could you do this with no JavaScript at all?"
**Answer:** "Yes, with a scroll-driven animation: `animation-timeline: scroll(root)` and keyframes from `scaleX(0)` to `scaleX(1)`. It's the cleanest version where supported, with the JS as a fallback."

---

### B4. "The hero text fades up in sequence when the page loads."

**Testing:** CSS animation stagger and fill modes.

**Beginner:** "`.hero__content > *` all share the `heroReveal` animation, and each child has its own `animation-delay` from 0.1s to 0.8s, so they appear one after another."

**3-Year:** "The base rule sets `opacity: 0` because `animation-delay` doesn't apply the first keyframe — otherwise everything would be visible during the delay and then jump. `forwards` holds the final state. The whole set is disabled under `prefers-reduced-motion`. The limitation is that the delays are hand-written per selector, so inserting an element in the middle breaks the rhythm; a `--i` custom property with `calc()` would scale better. Also, because these are load animations rather than scroll-triggered, anything below the fold has already finished animating by the time you scroll to it — for the sections below the hero I'd use IntersectionObserver to add an `in-view` class."

**Follow-Up:** "The editor slides in from the right at the same time. Same mechanism?"
**Answer:** "Yes — `.hero__visual` uses `heroVisualReveal`, which animates `translateX(40px) scale(.97)` to neutral over 1s with a 0.35s delay, so it lands just after the text starts. Compound transform in a single property, interpolated together."

---

### B5. "Those three stat cards are gently floating up and down, but not in sync."

**Testing:** Keyframe reuse plus delay offsets.

**Beginner:** "All three use `@keyframes floatingCard`, which moves them `translateY(-10px)` at 50% and back. Each card has a different `animation-delay` — 0s, 1s, 2s — so they're out of phase."

**3-Year:** "Six-second infinite loop with staggered delays so they never bob together, which would look mechanical. Note the delays are on the modifier classes (`--top`, `--right`, `--left`) rather than `nth-child`, which is more robust here because the cards aren't the only children of the stage — the orbit SVG is in there too, so `nth-child` numbering would be off by one. It's a `transform`-only animation, so it's compositor-friendly and running three of them forever costs essentially nothing. It is disabled under reduced motion."

**Follow-Up:** "The cards overlap the editor. What controls which is on top?"
**Answer:** "`z-index: 3` on `.achievement-card` versus `z-index: 1` on `.workspace`, both inside `.hero__stage`. They're siblings in the same stacking context so the numbers compare directly. Getting that wrong was an actual iteration — early on, the Lighthouse card was covering the editor's tab bar, and I moved it with `bottom: calc(100% - 8px)` so it sits above the window instead of on top of the tab."

---

### B6. "On a narrow window the nav becomes a hamburger and a panel slides in from the right."

**Testing:** The whole responsive nav feature end to end.

**Beginner:** "At `max-width: 992px` I hide `.desktop-nav` and show `.mobile-menu-btn`. Clicking it calls `toggleMenu()`, which adds `.active` to the drawer, the overlay, and the button. The drawer slides in with `transform: translateX(0)` and the three hamburger bars rotate into an X."

**3-Year:** Same, plus: "The button's three spans become an X purely in CSS with `nth-child` transforms — outer two rotate ±45° and translate to meet, middle one fades. JS also sets `aria-expanded` so screen readers know the state, sets `body` overflow to hidden to lock background scrolling, and binds `closeMenu` to the overlay, to Escape, and to every link inside the drawer. The drawer is `transform`-based rather than `right: -100%` specifically so it doesn't add to the document's scroll width. What's genuinely missing is focus management — focus should move into the drawer on open, be trapped while it's open, and return to the hamburger on close. I'd also mark the background `inert`."

**Follow-Up:** "You set `document.body.style.overflow = ''` to unlock. Why empty string rather than `auto`?"
**Answer:** "An empty string removes the inline property entirely, so the element falls back to whatever the stylesheet says. Setting `auto` would hard-code a value that might not match the original — here `body` has no explicit `overflow-y`, so `auto` would happen to look the same, but removing the override is the correct instinct."

---

### B7. "The right-hand panel looks like VS Code — tabs, a file tree, syntax colours, a status bar. Is that a screenshot?"

**Testing:** Whether they built it or embedded an image.

**Beginner:** "It's all HTML and CSS. The body is a three-column grid — a 46px activity bar, a 178px explorer, and the code area. The syntax colours are spans with classes like `.tok-kw` and `.tok-str`. Every icon is an inline SVG."

**3-Year:** "Deliberately not an image: it's crisp at any DPI, it's a fraction of the bytes of a screenshot at 2×, and it recolours with the theme. Layout-wise, `grid-template-columns: 46px 178px minmax(0, 1fr)` is the classic app shell — two fixed rails, one elastic pane — and at ≤768px I drop the explorer with `display: none` *and* change the track list to `38px minmax(0,1fr)`, because hiding the element alone would leave a 178px gap. The code is per-line flex rows with a `user-select: none` gutter so copying doesn't pick up line numbers. The one thing I'd flag: it's decorative content that screen readers will read as a wall of text, so `aria-hidden='true'` on the code block would be the courteous thing to add."

**Follow-Up:** "The long code lines are cut off at the right edge rather than wrapping. Deliberate?"
**Answer:** "Yes — `white-space: pre` plus `flex: 0 0 auto` on the text, clipped by `overflow: hidden` on the editor. That's what a real editor with word wrap off looks like. If it were real content I'd use `overflow-x: auto` so it's actually reachable."

---

### B8. "The '15+ Countries' card has a dotted world map. How is that drawn?"

**Testing:** SVG patterns — a genuinely distinctive implementation.

**Beginner:** "It's an SVG with a `<pattern>` that contains one small circle, and six paths shaped roughly like continents that are filled with that pattern instead of a solid colour."

**3-Year:** "`<pattern id='mapDots' width='3.2' height='3.2' patternUnits='userSpaceOnUse'>` tiles a single `<circle r='0.85'>` across the whole coordinate space, and then `<g fill='url(#mapDots)'>` applies it to six continent-ish paths. So a few hundred visible dots come from one drawing instruction — far cheaper than authoring hundreds of `<circle>` elements, and the whole thing is a few hundred bytes. `patternUnits='userSpaceOnUse'` means the tile size is in the SVG's own coordinate system rather than a fraction of the bounding box, which keeps the dot density constant across differently-sized continents. It's a stylised map, not a geographic one — for real data I'd use actual GeoJSON, but for a decorative stat card the impression is the point. On screens under 425px I hide it entirely because at that size it's just noise."

**Follow-Up:** "Any risk with that `id`?"
**Answer:** "Ids are document-global, so if the card were rendered twice both instances would reference the first pattern. Fine here, but in a component system I'd suffix the id per instance."

---

### B9. "Turning on 'Reduce motion' in my OS stops the animations. What exactly did you do?"

**Testing:** Real accessibility implementation, not just awareness.

**Beginner:** "There's a `@media (prefers-reduced-motion: reduce)` block in `animations.css` that sets `animation: none` and resets opacity and transform for the hero content, the visual, the cards, and the orbit. In JS I also check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip starting the typewriter."

**3-Year:** "Both layers matter, because CSS can't stop a JS timer and JS shouldn't be reimplementing the CSS. The subtlety is what I *didn't* reset: the block sets `transform: none` for the hero content, visual, and cards, but deliberately excludes `.hero__orbit`, because its transform is the `translate(-50%, -50%)` that centres it — resetting it would knock the rings off-centre. That's the trap with blanket reduced-motion resets. Because the typewriter never starts, the markup has a real default word in it (`TypeScript`) rather than an empty span, so those users see meaningful content. What I still owe: smooth scrolling isn't disabled under reduced motion, and I read `.matches` once instead of subscribing to `change`."

**Follow-Up:** "Should reduced motion mean *no* motion?"
**Answer:** "No — the spec is about vestibular triggers: large movement, parallax, zooming, spinning. A subtle opacity fade is usually fine and often better than content appearing instantly. A more nuanced version would keep the fades and drop the translate/scale/spin. I took the simpler route of disabling it all, which is safe but arguably heavier-handed than necessary."

---

### B10. "The moon icon becomes a sun in light mode. Are you swapping the SVG in JavaScript?"

**Testing:** Where state lives.

**Beginner:** "No — both SVGs are in the HTML. `.icon--sun` is `display: none` by default, and `[data-theme='light'] .icon--moon { display: none }` with `.icon--sun { display: block }` swaps them. JS only sets the attribute."

**3-Year:** "Keeping both in the DOM means no innerHTML rewriting, no flicker while a new node is created, and no JS knowledge of what the icons look like. It costs a few hundred bytes of markup for one always-hidden SVG, which is a trade I'll take every time. It's the same principle as the theme itself: JS owns one boolean expressed as an attribute; CSS owns every visual consequence. The one accessibility detail is that `aria-label='Toggle Theme'` is on the button and both SVGs are `aria-hidden`, so the accessible name never changes — arguably it should say 'Switch to light mode' / 'Switch to dark mode' and be updated with the state."

**Follow-Up:** "Does the theme survive a reload?"
**Answer:** "Yes, via `localStorage`, but there's a flash — the script runs at the end of `<body>`, so the dark default paints first. The fix is a small blocking inline script in the `<head>` that sets the attribute before first paint."

---

## Section C — "Show Me The Code" Questions

### C1. `index.html`, the first element inside `<body>`

```html
<a href="#main-content" class="skip-link">Skip to Main Content</a>
```
```css
.skip-link { position: absolute; left: -9999px; top: 1rem; z-index: 5000; }
.skip-link:focus { left: 1rem; }
```

**"Explain this. I can't see it on the page."**

That's the point — it's a skip link, positioned off-screen until it receives keyboard focus. A keyboard or screen-reader user landing on the page would otherwise have to Tab through the logo, six nav links, two icon buttons, and the resume link before reaching the content on every single page. Because it's the first focusable element, one Tab reveals it and Enter jumps to `#main-content`.

Why `left: -9999px` and not `display: none` or `visibility: hidden`? Those remove the element from the accessibility tree and the tab order entirely, so it could never be focused. Moving it off-screen keeps it focusable. The modern equivalent is a `.visually-hidden` clip-path utility, which avoids the horizontal-overflow risk that `-9999px` carries — though in this project `overflow-x: clip` on `html` already neutralises that.

**Would I change anything?** `z-index: 5000` is above the header (1000) so it isn't covered — good. I'd add a visible focus style since it's currently relying on the UA outline over a transparent background.

---

### C2. `layout.css` — the header layout

```css
.header-wrapper { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.desktop-nav    { margin-inline: auto; }
.header-actions { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; }
```

**"How is the nav centred? I don't see `justify-content: center`."**

`justify-content: space-between` pushes the logo left and the actions right. `margin-inline: auto` on the nav then absorbs the remaining free space equally on both sides, which optically centres it between them. Auto margins in flexbox consume free space *before* `justify-content` gets to distribute it, which is why the two rules cooperate rather than fight.

**"Is it truly centred in the header?"** No — it's centred in the space between the logo and the actions. Since the logo and the actions are different widths, the nav sits slightly off from the header's true midpoint. That matches the reference design. If I needed true centring I'd use a three-column grid with `1fr auto 1fr` so the middle column is centred regardless of the side widths.

**`flex-shrink: 0` on the actions** stops the Resume button and icon buttons from being squeezed when the nav gets long — without it, the button text would compress before the nav did.

---

### C3. `main.js` — the progress bar guard

```js
const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
if (documentHeight <= 0) { scrollProgress.style.width = "0%"; return; }
const progress = (scrollTop / documentHeight) * 100;
```

**"Why the guard? Walk me through what happens without it."**

If the page is shorter than the viewport there's nothing to scroll, so `scrollHeight === clientHeight` and `documentHeight` is 0. `scrollTop / 0` is `Infinity` (or `NaN` if `scrollTop` were also 0 — `0/0`). Assigning `"Infinity%"` or `"NaN%"` to `style.width` produces an invalid CSS value, which the browser discards silently. So the bar just never updates and you get a bug with no error in the console — the worst kind.

Right now the page is tall enough that this never fires, but it will the moment someone empties those placeholder sections, and this file is meant to be reused.

**"Would you write it differently?"** I'd probably clamp the result as well: `Math.min(100, Math.max(0, progress))`, because on iOS rubber-band scrolling `scrollY` can go negative or exceed the maximum, which briefly renders a bar wider than the screen or a negative width.

---

### C4. `components.css` — the caret

```css
.hero__typing-text::after {
    content: ""; display: inline-block; width: 2px; height: 1em;
    margin-left: .15rem; background: var(--primary-color); vertical-align: -.1em;
    animation: typingCursor .8s steps(1) infinite;
}
@keyframes typingCursor { 0%, 45% { opacity: 1 } 46%, 100% { opacity: 0 } }
```

**"Why `steps(1)` and why `height: 1em`?"**

`steps(1)` makes the timing function discrete — the value jumps at the keyframe boundary instead of interpolating, so the caret blinks hard on and off like a terminal cursor rather than pulsing. You could get the same look with the keyframe percentages alone since 45%→46% is a near-instant ramp, but `steps(1)` makes the intent explicit and guarantees no sub-pixel fade.

`height: 1em` ties the caret to the font size of the element it's attached to, so it stays proportional if the type scale changes — no magic pixel value to keep in sync. `vertical-align: -.1em` drops it slightly so it aligns with the text baseline rather than floating above it.

**"Why a pseudo-element instead of a character?"** A literal `|` would inherit the font's glyph shape and metrics and would be selectable and copyable — it would end up in the clipboard when someone copies the heading. A pseudo-element's `content: ""` isn't part of the text content.

---

### C5. `variables.css` — the top of the file

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
```

**"Any problem with this?"**

Yes, this is the slowest way to load fonts. `@import` inside a stylesheet serialises the request chain: the browser must fetch `variables.css`, parse it, discover the `@import`, fetch the Google CSS, parse *that*, then fetch the actual font files. Three round trips before any text can render in the intended face. Putting `<link rel="stylesheet">` in the HTML head lets the preload scanner start the font CSS request immediately, in parallel with the other stylesheets.

I'd change it to:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap">
```

Two more things: I'm requesting seven Inter weights and using about four, which is wasted bytes on the CSS and potentially extra font files; and `&display=swap` (which the URLs already include) means text renders immediately in the fallback and swaps when the font arrives, avoiding invisible text. Self-hosting the two files with `font-display: swap` and a `preload` would be the fastest option and removes the third-party dependency.

---

### C6. `responsive.css` — the 992px block

```css
@media (max-width: 992px) {
    .desktop-nav { display: none; }
    .mobile-menu-btn { display: inline-flex; }
    .hero__wrapper { grid-template-columns: minmax(0, 1fr); }
    .hero__highlights { width: 100%; }
    .hero__visual { justify-content: center; padding-right: 0; }
}
```

**"Why is `.hero__highlights { width: 100% }` in here?"**

Because the base rule sets `width: calc(100% + 8.5rem)` so the card row can break out of the text column on desktop. Once the grid collapses to a single column, that break-out has nothing to break out *into* — it just overflows the viewport. This line resets it, and the `minmax(0, 1fr)` on the same block makes sure the track can't be stretched by any child that still overflows.

The pair of lines is the fix for the horizontal-scroll bug on mobile. It's also the argument for the refactor: if the highlights were a full-width grid item (`grid-column: 1 / -1`) instead of an oversized child, neither line would be needed.

**"And `justify-content: center` on the visual?"** On desktop the editor is right-aligned with `padding-right: 52px` so the protruding stat card has room. Stacked on one column, right-alignment looks wrong and the padding pushes it off-centre, so both are reset.

---

## Section D — Code Modification Tasks

### D1. Add a fourth highlight card without breaking the layout

**Task:** Add "Full Stack Contributor / Comfortable across the stack" as a fourth card.

**Expected behaviour:** Four cards laid out sensibly at every breakpoint, with no horizontal overflow.

**Hint:** Look at `grid-template-columns` in `.hero__highlights` and the `calc()` width.

**Solution**
```css
/* layout.css */
.hero__highlights {
    grid-template-columns: repeat(2, minmax(0, 1fr));   /* 2×2 instead of 1×3 */
    width: calc(100% + 4rem);                            /* less break-out needed */
}
/* responsive.css — 1200 block already handles 2 columns; add: */
@media (max-width: 768px) { .hero__highlights { grid-template-columns: 1fr; } }
```
Plus the markup block copied from an existing card with a new SVG icon.

**Explanation:** Four cards in a 3-column grid leaves an orphan on row two. A 2×2 grid balances them and needs less break-out width, which reduces the overflow risk. The mobile rule already collapses to one column.

**What's being evaluated:** Do you notice the `calc()` width and the breakpoint resets, or do you only edit the HTML and leave a broken layout at 992px?

---

### D2. Make the editor's code area horizontally scrollable instead of clipped

**Task:** Let the user scroll to read the cut-off end of line 18.

**Expected behaviour:** A horizontal scrollbar (or trackpad scroll) inside the code pane only; the page must not scroll sideways.

**Hint:** One property on `.workspace__editor`.

**Solution**
```css
.workspace__editor { overflow-x: auto; overflow-y: hidden; }
.workspace__editor::-webkit-scrollbar { height: 8px; }
.workspace__editor::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 20px; }
```

**Explanation:** `hidden` clips with no way to reach the content; `auto` clips but adds a scroll container. The grid track is already `minmax(0, 1fr)`, so the pane can be narrower than its content — that's a precondition, and without it the pane would stretch the grid instead of scrolling.

**Evaluation:** Do you know `hidden` vs `auto` vs `clip`, and do you connect it back to the `minmax(0, 1fr)` track?

---

### D3. Persist and apply the accent colour picked by the palette button

**Task:** The palette button (`#themeCustomizerBtn`) currently does nothing. Wire it to cycle the five `data-color` presets and remember the choice.

**Expected behaviour:** Each click moves to the next accent; the accent survives a reload; everything using `--primary-color` updates.

**Hint:** `variables.css` already has `[data-color="blue|purple|green|orange|pink"]`.

**Solution**
```js
const themeCustomizerBtn = document.querySelector("#themeCustomizerBtn");
const accents = ["blue", "purple", "green", "orange", "pink"];

const storedAccent = localStorage.getItem("accent") || "blue";
document.documentElement.setAttribute("data-color", storedAccent);

if (themeCustomizerBtn) {
    themeCustomizerBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-color") || "blue";
        const next = accents[(accents.indexOf(current) + 1) % accents.length];
        document.documentElement.setAttribute("data-color", next);
        localStorage.setItem("accent", next);
    });
}
```

**Explanation:** Identical pattern to the theme toggle — attribute on `<html>`, CSS does the work, `localStorage` persists. The modulo wraps the cycle. Because the hero glow uses `color-mix(in srgb, var(--primary-color) 13%, transparent)`, it follows automatically; the two hard-coded `rgba(59,130,246,…)` values on `.hero__highlight-icon` will *not*, which is the interesting part of this task.

**Evaluation:** Do you reuse the established pattern rather than inventing a new one, and do you spot the hard-coded blues that break the abstraction?

---

### D4. Make the nav highlight update reliably using IntersectionObserver

**Task:** Replace `updateActiveNavigation` and its scroll listener.

**Expected behaviour:** Same visual result, no `offsetTop` reads on scroll.

**Solution**
```js
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-120px 0px -60% 0px", threshold: 0 });

sections.forEach((section) => observer.observe(section));
```

**Explanation:** The observer fires only when a section crosses the configured band, so there's no per-scroll-event work and no layout-forcing reads. `rootMargin: "-120px 0px -60% 0px"` shrinks the detection area — 120px off the top to account for the sticky header (mirroring the old `-150` offset) and 60% off the bottom so a section becomes active only when it's genuinely in the upper part of the viewport. `classList.toggle(name, condition)` collapses the remove-then-add into one call.

**Evaluation:** Do you understand `rootMargin` and threshold, and can you explain *why* it's faster (off-main-thread intersection maths, no forced synchronous layout)?

---

### D5. Fix the theme flash on load

**Task:** Stop the dark flash for users who chose light mode.

**Solution** — add to `<head>`, before the stylesheets:
```html
<script>
  (function () {
    var t = localStorage.getItem("theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
  })();
</script>
```

**Explanation:** This must be blocking and inline — an external or `defer`red script would run after first paint, which is the whole problem. It's one of the few legitimate uses of a render-blocking script, and it's tiny. The existing read in `main.js` becomes redundant and can be removed, leaving only the click handler.

**Evaluation:** Do you know that `defer`/`async` would defeat the purpose, and can you explain why blocking is acceptable here?

---

### D6. Move the status bar's magic 152px padding to something maintainable

**Task:** `.workspace__status { padding: 0 1.1rem 0 152px }` exists so "main" clears the Countries card. Make it robust.

**Solution**
```css
:root { --editor-rail: 46px; --editor-explorer: 178px; }
.workspace__body   { grid-template-columns: var(--editor-rail) var(--editor-explorer) minmax(0, 1fr); }
.workspace__status { padding-left: calc(var(--editor-rail) + var(--editor-explorer) - 72px); }
@media (max-width: 768px) { .workspace__status { padding-left: 1rem; } }
```

**Explanation:** The 152px was derived from the rails' combined width; tokenising it means changing the explorer width in one place updates both the grid and the status bar. The `- 72px` remains a tuning value but is now expressed relative to something real.

**Evaluation:** Can you recognise a magic number, trace where it came from, and express it as a relationship rather than a constant?

---

## Section E — Debugging Scenarios (all drawn from real issues in this build)

### E1. "The page scrolls sideways on mobile and everything looks shifted right."

**How to investigate**
1. Set `* { outline: 1px solid red }` temporarily, or better, script it: compare `document.documentElement.scrollWidth` with `clientWidth`, then loop every element and log any whose `getBoundingClientRect().right` exceeds the viewport width.
2. Do it at several fixed widths, not just one — the culprit may only appear below a breakpoint.
3. Check the usual suspects: an element with a fixed `width` larger than the viewport, negative margins, absolutely positioned elements with negative offsets, `100vw` inside a padded container, and long unbreakable strings.

**Likely cause here** `.hero__highlights { width: calc(100% + 8.5rem) }` inside a `grid-template-columns: 1fr` track. `1fr` is `minmax(auto, 1fr)`, so the oversized child raised the track's minimum and the column — and therefore the page — grew wider than the viewport. Everything then computed its `94%` container width against a too-wide parent.

**Solution** `minmax(0, 1fr)` on the track plus `width: 100%` on the highlights inside the mobile media query. `overflow-x: clip` on `html` as a backstop.

**How to explain it in an interview**
"Horizontal overflow is almost always one element, so I measure rather than guess — I compare scrollWidth to clientWidth and log every element whose right edge is past the viewport, at each breakpoint. In this case it was a deliberately oversized child in an `auto`-minimum grid track. The real fix was letting the track shrink with `minmax(0, 1fr)` and resetting the child at that breakpoint; the root-level `overflow-x: clip` is just insurance."

---

### E2. "The code block's line numbers don't match the code — some lines split in half."

**Investigate:** Inspect the broken line in DevTools and look at the *text node*, not the rendered output. You'll see a newline and indentation inside `.code__text`.

**Cause:** `white-space: pre` preserves source newlines. The HTML was pretty-printed, so wrapped attributes and indentation became literal line breaks in the middle of a statement.

**Solution:** One physical source line per rendered line. (In this repo the block was regenerated programmatically for exactly that reason.)

**How to explain it:** "With `white-space: pre`, source formatting *is* content. The moment my editor wrapped a long line, the browser rendered that wrap. It's the trade-off you accept when you use `pre` — either keep every line on one source line, or generate the markup from data so the formatting can't leak in."

---

### E3. "The sticky header stopped sticking after I added a wrapper."

**Investigate:** Walk up the ancestor chain checking `overflow` on each. In DevTools, `getComputedStyle(el).overflowX/Y` for each parent, or search the stylesheet for `overflow` on ancestors.

**Cause:** Any ancestor with `overflow: hidden | auto | scroll` becomes the sticky element's scroll container. The header then sticks to that box (which usually isn't scrolling), so it looks like sticky is broken.

**Solution:** Remove the overflow, or switch it to `overflow-x: clip`, which clips without creating a scroll container. That is exactly why this project uses `overflow-x: clip` on `html` instead of `hidden`.

**How to explain it:** "Sticky is scoped to the nearest scrolling ancestor. Nine times out of ten a broken sticky header is an `overflow: hidden` someone added higher up to fix a different problem. `clip` gives you the clipping without the scroll container, so both behaviours can coexist."

---

### E4. "The hero content flashes fully visible, then fades in from the start."

**Investigate:** Check whether the element has its own `opacity: 0`, and check `animation-fill-mode`.

**Cause:** `animation-delay` does not apply the first keyframe. During a 0.1–0.8s delay the element renders with its normal styles.

**Solution:** Either `opacity: 0` on the element (this project's approach) or `animation-fill-mode: backwards`. And keep `forwards` so the end state persists.

**How to explain it:** "Fill modes are about what happens outside the active period. `backwards` covers the delay, `forwards` covers after the end, `both` covers both. A flash before the animation means the delay isn't covered; content disappearing after means `forwards` is missing."

---

### E5. "The orbit rings jump off-centre the moment the page loads."

**Investigate:** Compare the static `transform` on the element with the `transform` in the keyframes.

**Cause:** `transform` is a single property. The animation's value replaces the static `translate(-50%, -50%)`, so the element loses its centring the instant the animation starts.

**Solution:** Repeat the translate in every keyframe (what this project does), or use the independent `translate` / `rotate` properties so they compose instead of overwriting.

**How to explain it:** "Any keyframe that touches `transform` owns the whole transform list for that element. If part of your positioning lives in `transform`, it has to be repeated in the keyframes — or moved to the individual `translate`/`rotate`/`scale` properties, which don't clobber each other."

---

### E6. "The theme toggle works, but there's a dark flash on every reload in light mode."

**Investigate:** Note where the script tag is. Throttle the network in DevTools to make the flash obvious.

**Cause:** `main.js` is at the end of `<body>`, so first paint happens with the default dark tokens before `localStorage` is read.

**Solution:** A blocking inline script in `<head>` that sets `data-theme` before the stylesheets paint.

**How to explain it:** "It's a critical-rendering-path problem, not a logic bug. The state is correct, it's just applied one paint too late. The standard fix is a tiny inline script in the head — one of the few places a render-blocking script is the right answer, because the alternative is a visible flash on every load."

---

### E7. "A screenshot at 414px looks broken, but the site is fine when I resize my browser."

**Investigate:** Don't trust the screenshot. Measure inside a real viewport — load the page in an iframe of a known width and read `documentElement.clientWidth` and `scrollWidth`.

**Cause (this actually happened here):** Headless Chrome's viewport screenshot at a narrow `--window-size` rendered the layout at a wider viewport than requested and cropped the image, which *looked* identical to a horizontal-overflow bug.

**Solution:** Verify with measurements rather than pixels. The iframe harness reported `client === scrollWidth` at 320/375/414/768/1024/1280, which proved the layout was correct and the tooling was lying.

**How to explain it:** "The lesson is to distinguish a rendering bug from a measurement artifact. A screenshot is evidence, not proof. I reproduced the same widths in a real viewport and compared scrollWidth to clientWidth — that's a number I can trust, and it told me the layout was fine and my capture method wasn't."

---

## Section F — Output / Execution Questions

### F1. Execution order on page load

```js
const header = document.querySelector(".site-header");           // 1
const storedTheme = localStorage.getItem("theme");                // 2
if (storedTheme) document.documentElement.setAttribute("data-theme", storedTheme);
mobileMenuBtn.addEventListener("click", toggleMenu);              // 3
if (typingText && !prefersReducedMotion) typeRole();              // 4
window.addEventListener("scroll", handleHeader);                  // 5
window.addEventListener("load", () => { handleHeader(); updateProgressBar(); updateActiveNavigation(); }); // 6
```

**Question:** In what order do things actually run, and when does `handleHeader` first execute?

**Answer:** Lines 1–5 run synchronously, top to bottom, the moment the parser reaches the `<script>` tag at the end of `<body>` — so the DOM is complete but images/fonts may still be loading. `typeRole()` runs immediately and schedules its first `setTimeout`. The listeners registered on lines 5–6 don't run yet. `handleHeader` first executes either on the first scroll event or in the `load` callback, whichever comes first — and `load` only fires after all subresources finish.

**Concept tested:** Script placement, synchronous execution, event registration vs invocation, `load` vs `DOMContentLoaded`.

**Interview explanation:** "Everything at the top level runs once, immediately, in source order. The listeners are just registrations. The `load` handler exists to sync the UI with a restored scroll position on refresh — if you reload halfway down the page, the browser restores scroll but no scroll event fires, so without that call the header would have no shadow and no nav link would be active."

---

### F2. Typewriter trace

```js
roles = ["TypeScript", "React.js", …]; roleIndex = 0; characterIndex = 0; isDeleting = false;
```

**Question:** What is `typingText.textContent` after the 3rd call to `typeRole()`, and what delay is scheduled?

**Answer:** `"Typ"`, with a 90ms delay.

**Step by step:**
- Call 1: not deleting → `characterIndex` 0→1 → `"TypeScript".slice(0,1)` = `"T"` → not full length → `setTimeout(typeRole, 90)`.
- Call 2: → 2 → `"Ty"` → `setTimeout(…, 90)`.
- Call 3: → 3 → `"Typ"` → `setTimeout(…, 90)`.

**Follow-up:** What happens on call 10?
`characterIndex` becomes 10, which equals `"TypeScript".length`, so the text is the full word, `isDeleting` flips to `true`, and the next call is scheduled after `pauseAfterTyping` = 1400ms instead of 90ms.

**Concept tested:** Reading a state machine, `slice` semantics, branch conditions.

---

### F3. What does this log?

```js
const sections = document.querySelectorAll("main section");
console.log(sections.length);
document.querySelector("main").appendChild(document.createElement("section"));
console.log(sections.length);
```

**Answer:** `6` then `6`.

**Why:** `querySelectorAll` returns a **static** NodeList — a snapshot taken at call time. Adding a section afterwards does not update it. `getElementsByTagName` returns a *live* HTMLCollection, which would show `7`.

**Why it matters here:** `sections` and `navLinks` are captured once at the top of `main.js`. That's correct for this static page, but if sections were added dynamically the scroll-spy would silently ignore them. It's exactly the kind of assumption worth stating out loud.

---

### F4. `this` in the anchor handler

```js
anchor.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");
    …
});
```

**Question:** What breaks if this becomes an arrow function?

**Answer:** `this` would no longer be the anchor. At the top level of a classic script it would be `window` (non-strict), so `this.getAttribute` is `undefined` and calling it throws `TypeError: this.getAttribute is not a function`. Every in-page link would then fall back to… actually nothing, because the error occurs *before* `preventDefault()`, so the browser's default jump still happens — the link appears to work but scrolls instantly instead of smoothly, and the console fills with errors. That "half-working" failure mode is what makes it a good question.

**Fix:** `event.currentTarget.getAttribute("href")`.

---

### F5. Scroll progress arithmetic

**Question:** Viewport height 900, document height 3600, user has scrolled 1350px. What width is written?

**Answer:**
`documentHeight = 3600 - 900 = 2700`
`progress = 1350 / 2700 * 100 = 50`
→ `scrollProgress.style.width = "50%"`.

**Edge case:** If the document were 900px tall, `documentHeight = 0`, the guard fires and writes `"0%"`. Without the guard you'd get `"Infinity%"`, an invalid value the browser drops — the bar would freeze with no console error.

---

## Section G — "Why Did You Use This?" (Decision Questions)

| Decision in the code | The question | The answer to give |
|---|---|---|
| Five separate CSS files loaded in a fixed order | "Why not one stylesheet?" | Separation by responsibility — tokens, structure, skin, motion, breakpoints — and order encodes the cascade so `responsive.css` can override without specificity hacks. The cost is five requests; with a build step I'd concatenate and minify, but the authoring split would stay. |
| BEM-ish class names, no nesting | "Why this naming?" | Every selector stays at 0-1-0 specificity, so overriding is a matter of source order, not escalation. `.hero__title-gradient` tells you where it lives and what it modifies without reading the HTML. It's the cheapest way to get predictable CSS with no tooling. |
| `data-theme` attribute rather than a `.light` class | "Why an attribute?" | Attributes model one-of-a-set; classes are additive and can end up with both `light` and `dark` applied. I also have a second axis (`data-color`) and the two compose cleanly. |
| Editor colours are hard-coded, everything else is tokenised | "Isn't that inconsistent?" | Deliberate. The editor is a depiction of VS Code's dark theme — those specific hexes *are* the content. Tokenising them would imply they should change with the site theme, which would break the illusion. I did give them their own token group (`--editor-bg`, `--editor-line`) so the shell is themeable even though the syntax colours aren't. |
| Desktop-first media queries | "Why not mobile-first?" | The source design is a desktop composition and the complex piece — the editor shell — only exists at desktop size, so describing it in the base and simplifying downward meant less code. For a content site I'd default to mobile-first. |
| Manual token spans for syntax highlighting | "Why not a highlighter library?" | It's 21 lines of decorative, never-changing code. A library would add 10–30KB of JS and a runtime tokenising pass for zero functional benefit. If the code were real or user-supplied I'd use Shiki at build time. |
| Inline SVG rather than a sprite | "Why?" | Handful of distinct icons on a single page; `currentColor` theming and zero extra requests win. At 30+ icons or multiple pages I'd switch to `<use>` with a sprite. |
| `min-height: 545px` on `.workspace__body` | "Why a fixed height?" | To control where the editor's bottom edge lands relative to the file tree, so the floating Countries card sits below `README.md` instead of covering it. It's a composition constraint. It's fragile if the code content grows — a cleaner version would set the height from the code block and position the card relative to a known anchor. |
| `padding-left: 152px` on the status bar | "Justify this." | I can't, fully — it's a magic number derived from the two rails' widths so the branch name clears the Countries card. It should be `calc()` off the same tokens the grid uses. It's on my list. |
| No build step at all | "Why no bundler?" | It's a static portfolio: five CSS files and one script, no dependencies, deployable to any static host by copying a folder. Adding a bundler would buy minification and autoprefixing at the cost of tooling to maintain. I'd add one when there's a second page or a component that needs to be reused. |

---

## Section H — Beginner vs 3-Year Answer Comparison

| Question | Beginner answer | 3-year answer adds |
|---|---|---|
| Why `box-sizing: border-box`? | "So padding doesn't make elements bigger." | Names `content-box` as the default, gives the 200+20+20+1+1 = 242px arithmetic, notes that `::before/::after` must be in the selector list because `.nav-link::after` and `.hero::before` are real layout participants, and flags that the blanket `* { margin: 0 }` kills useful prose defaults — an acceptable trade here because every gap comes from flex/grid `gap`. |
| What does `position: sticky` do? | "Sticks the header to the top when you scroll." | Explains relative-until-threshold, that `top` is required, that it's scoped to the nearest scrolling ancestor, and that an ancestor `overflow: hidden` silently breaks it — which is why this project uses `overflow-x: clip`. |
| Why custom properties? | "So I can reuse colours." | Computed-value-time resolution and inheritance are what make runtime theming possible at all; contrasts with Sass variables which are compiled out; notes the two independent theming axes and that `color-mix()` lets derived values track the token. |
| What's `z-index: 9999` for? | "To keep the progress bar on top." | Reframes it as a stacking-context question: the number only matters within a context, escalating it is usually the wrong fix, and `isolation: isolate` on `main`/`.hero` is what actually makes the layering predictable. Suggests tokenising the ladder. |
| Why `setTimeout` not `setInterval`? | "Because the delays are different." | Adds that recursive timeouts can't overlap or pile up in throttled tabs, identifies the missing timer id as a teardown leak, and notes `matchMedia` should be subscribed to rather than read once. |
| How does the mobile menu work? | Lists the class toggles. | Explains why `transform` beats `right: -100%` (scroll width + compositor), why `visibility` is in the transition list (discrete property, deferred to the end when hiding), and volunteers the missing focus trap and `inert` as the real gap. |
| Why is the code block formatted oddly? | "Because of `white-space: pre`." | Tells the story: pretty-printing inserted literal newlines that split three lines and desynced the gutter; explains the trade-off of `pre` and what they'd do if the content were dynamic. |
| Three scroll listeners — okay? | "It works but might be slow." | Identifies `offsetTop` reads as forced synchronous layout, names layout thrashing, and gives a prioritised fix list: IntersectionObserver, single rAF-throttled passive listener, cached offsets, `scaleX` instead of `width`. |

**The pattern:** the beginner answer is *correct*. The 3-year answer is correct, then explains the mechanism, then names the trade-off, then volunteers what they'd change. Volunteering the weakness before you're asked is the single biggest signal.

---

## Section I — Mock Interviews

### Mock Interview 1 — Beginner (≈10 minutes)

**Interviewer:** Let's start simple. Walk me through what's in your `<head>`.

**Candidate:** Charset and viewport meta tags, the title, and five stylesheets. The viewport one matters most — without `width=device-width` the browser would render at about 980px on a phone and shrink it, so none of my media queries would behave.

**Interviewer:** Why five stylesheets?

**Candidate:** They're split by job. `variables.css` has the reset and all the custom properties, `layout.css` is structure, `components.css` is the visual styling, `animations.css` is motion, and `responsive.css` is the media queries. The order matters because when two rules have the same specificity, the last one wins — so `responsive.css` loads last and can override the others.

**Interviewer:** Show me a custom property and how you use it.

**Candidate:** `--primary-color: #3B82F6` on `:root`, then `.btn--primary { background: var(--primary-color) }`. It's used in maybe fifteen places — the logo, buttons, the nav underline, the heading accent. Changing one line changes all of them.

**Interviewer:** The first element in your body is a link I can't see. What is it?

**Candidate:** A skip link. It's positioned at `left: -9999px` so it's off-screen, but `:focus` brings it back to `left: 1rem`. If you're navigating by keyboard, the first Tab reveals it and you can jump straight to the content instead of tabbing through the whole nav. I used off-screen positioning rather than `display: none` because that would remove it from the tab order entirely and it could never be focused.

**Interviewer:** How does the hamburger menu open?

**Candidate:** Clicking `#mobileMenuBtn` calls `toggleMenu()`. That checks whether the drawer has the `active` class — if it does, `closeMenu()`, otherwise `openMenu()`. Opening adds `active` to the drawer, the overlay, and the button, sets `aria-expanded="true"`, and sets `body` overflow to hidden so the page behind doesn't scroll.

**Interviewer:** Why set `aria-expanded`?

**Candidate:** A sighted user can see the menu slid in, but a screen-reader user can't. `aria-expanded` tells them whether the button they're on is currently open or closed. It has to be kept in sync in both functions, otherwise it lies.

**Interviewer:** Last one — what does `clamp()` do in `font-size: clamp(2.6rem, 4.4vw, 4.3rem)`?

**Candidate:** It picks a value between a minimum and a maximum. The middle value, `4.4vw`, scales with the viewport width, but it can never go below 2.6rem or above 4.3rem. So the heading is fluid but never gets unreadably small on a phone or absurdly large on a big monitor.

---

### Mock Interview 2 — Intermediate (≈20 minutes)

**Interviewer:** Your hero is a two-column grid. Take me through the track definition.

**Candidate:** `grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr)` — the right column is slightly wider because the editor needs the room. The `minmax(0, …)` part is deliberate. `1fr` on its own is `minmax(auto, 1fr)`, and that `auto` minimum means the track can never be narrower than its content.

**Interviewer:** Why does that matter to you?

**Candidate:** Because I have a child that's intentionally too wide. `.hero__highlights` is `width: calc(100% + 8.5rem)` so the card row can break out of the text column and match the design. With an `auto` minimum, that child forced the whole column wider than the viewport at the mobile breakpoint, and the page scrolled sideways.

**Interviewer:** How did you find that?

**Candidate:** I didn't trust screenshots. I loaded the page in an iframe at fixed widths and compared `documentElement.scrollWidth` to `clientWidth`, logging any element whose bounding rect extended past the viewport. That pointed straight at the highlights row and told me it only happened below 992px.

**Interviewer:** Good. Different area — the stat cards float around the editor. How are they anchored?

**Candidate:** There's a wrapper, `.hero__stage`, with `position: relative` and `max-width: 700px` — the same width as the editor. The cards are `position: absolute` inside it. Because the stage matches the editor exactly, offsets like `left: -78px` reliably mean "78px past the editor's left edge" instead of drifting with the column width.

**Interviewer:** One of them uses `bottom: calc(100% - 8px)`. Explain that.

**Candidate:** For an absolutely positioned element, a percentage `bottom` resolves against the containing block's height. `bottom: 100%` puts the card's bottom edge level with the container's top edge, so it sits entirely above the editor. Subtracting 8px pulls it down so it overlaps the title bar slightly, which is what the design shows.

**Interviewer:** Those negative offsets — don't they cause overflow?

**Candidate:** They would. `.hero { overflow: hidden }` clips them at the section boundary, and I also have `overflow-x: clip` on `html`. I used `clip` rather than `hidden` there on purpose, because `hidden` creates a scroll container and that breaks `position: sticky` on the header.

**Interviewer:** Let's talk JavaScript. What runs on scroll?

**Candidate:** Three handlers — the header shadow state, the progress bar, and the active nav link. That's the part of the file I'd change first. `updateActiveNavigation` reads `offsetTop` and `offsetHeight` for every section on every scroll event, and those are layout-forcing reads, so I'm making the browser recalculate layout in a loop.

**Interviewer:** What would you replace it with?

**Candidate:** IntersectionObserver for the scroll-spy — the browser does the intersection maths and just tells me when a section enters the band I care about. Then merge the remaining two into one listener, mark it `passive: true`, and throttle it with `requestAnimationFrame` and a `ticking` flag so it runs at most once per frame.

**Interviewer:** Why does `passive: true` help?

**Candidate:** It tells the browser I won't call `preventDefault()`, so it doesn't have to wait for my handler before continuing the scroll. Without it the compositor has to pause and check.

**Interviewer:** Last thing — your theme toggle. Is there anything wrong with it?

**Candidate:** Functionally no, but there's a flash. The script is at the end of the body, so the browser has already painted with the dark default before I read `localStorage`. A light-mode user sees a dark flash on every load. The fix is a small blocking inline script in the `<head>` that sets the attribute before first paint.

---

### Mock Interview 3 — Around 3 Years (≈30 minutes)

**Interviewer:** Pick the decision in this codebase you're least comfortable defending.

**Candidate:** `.hero__highlights { width: calc(100% + 8.5rem) }`. It's a deliberate break-out so the card row is wider than the paragraph above it, matching the design. But it's a magic number coupled to the current column ratio, and it's what caused the mobile overflow bug. The structurally honest version is to lift the highlights out of `.hero__content`, make them a grid item on a second row, and give them `grid-column: 1 / -1`. Then the width comes from the grid, the mobile reset in `responsive.css` disappears, and there's no number to keep in sync.

**Interviewer:** So why is it still there?

**Candidate:** It landed late in a pixel-matching pass and the restructure touches the animation stagger too — the reveal delays are hand-written per child of `.hero__content`, so moving one out changes the sequence. It was a scope call, not an oversight, and I know exactly what the fix costs.

**Interviewer:** Fair. Talk to me about how the layering in the hero works.

**Candidate:** Inside `.hero` there's a background grid at `z-index: -2` and a glow at `-1`, both pseudo-elements, then content at 1 and 2, the editor at 1, and the stat cards at 3. The thing that makes it safe is `isolation: isolate` on both `main` and `.hero`. Negative z-index children paint behind their parent's background and can escape to sit behind ancestors; `isolation` creates a stacking context so `-1` and `-2` are trapped inside the hero.

**Interviewer:** Why `isolation` rather than giving the hero a z-index?

**Candidate:** Setting a z-index on `.hero` would also insert it into its siblings' ordering, so I'd be solving one layering problem by creating another. `isolation: isolate` creates the context without any ordering side effect, and it's self-documenting — anyone reading it knows the intent was containment. The old hacks were `opacity: 0.999` or a null `transform`, both of which have side effects.

**Interviewer:** You've got a `filter: blur(20px)` on a 900px element that animates forever. Concerns?

**Candidate:** `filter` promotes it to its own compositing layer, which is what you want since the animation is `transform`-only — that runs on the compositor without touching layout or paint. What you must not do is animate the blur radius itself, because that's a repaint of a large surface every frame. Memory is the other consideration: a 900×900 layer at 2× DPR is a few megabytes of GPU texture. On a desktop hero that's fine. If I saw jank on low-end mobile, the first thing I'd do is drop the glow below a breakpoint — I already hide the orbit SVG at 768px for similar reasons.

**Interviewer:** Suppose this hero has to become a React component and ship in a design system. What changes?

**Candidate:** Four things. First, the icons — right now they're inline SVG duplicated in the file tree, and the gradient and pattern use hard-coded ids, which breaks the moment a component renders twice. They'd become icon components with generated ids, or a sprite. Second, the animation stagger: eight hand-written `animation-delay` rules become a `--i` custom property set from the array index, so the sequence can't drift when items change. Third, the magic numbers — `152px` on the status bar, `545px` on the editor body, `8.5rem` on the highlights — become tokens or derived values, because in a component nobody knows where they came from. Fourth, the global JS becomes scoped: the typewriter needs its timer id captured and cleared on unmount, and every listener needs teardown, otherwise you leak on every mount.

**Interviewer:** Which of those is the actual bug rather than a style issue?

**Candidate:** The duplicate ids and the timer leak. Everything else is maintainability. `url(#mapDots)` resolves to the first matching id in the document, so a second instance renders with the first one's pattern — and if the first unmounts, the second loses its fill entirely. The timer is a genuine leak: `typeRole` reschedules itself forever with no handle, so after unmount it keeps writing `textContent` to a detached node.

**Interviewer:** Let's say Lighthouse flags your Largest Contentful Paint. Where do you look first?

**Candidate:** The fonts, before anything else. `variables.css` starts with two `@import` statements to Google Fonts, which serialises the chain — fetch my CSS, parse it, discover the import, fetch their CSS, parse that, fetch the font files. Three round trips before text renders in the right face. Moving those to `<link>` tags with `preconnect` in the head lets the preload scanner start them immediately. I'm also requesting seven Inter weights and using about four. Beyond that, the LCP element is the `<h1>`, which is text, so it's font-bound rather than image-bound — there are no images on the page at all, which is one advantage of the all-SVG approach.

**Interviewer:** Anything about the SVG approach that hurts performance?

**Candidate:** It inflates the HTML — the document is dominated by icon markup and none of it caches separately from the page. For a single page with a handful of distinct icons that's the right trade, because I'm avoiding requests entirely and getting `currentColor` theming for free. The moment there's a second page, the sprite becomes the better choice because the icons cache once and the HTML shrinks.

**Interviewer:** Final question. If I gave you one day on this codebase, what would you actually do?

**Candidate:** In order: the theme-flash inline script, because it's a visible bug and a ten-minute fix. Then focus management on the drawer — trap focus, return it to the button, mark the background `inert` — because that's a real accessibility failure, not a nicety. Then the scroll handlers: IntersectionObserver for the spy, one rAF-throttled passive listener for the rest. Then the highlights refactor to `grid-column: 1 / -1`, which deletes the magic number and two lines of responsive overrides. If there were time left, tokenise the z-index ladder and the editor rail widths so the status bar padding stops being a mystery number.

---

## Section J — Quick Revision

### J1. Concept table

| Concept / Code | What It Does | Why We Used It | Important Point | Interview Reminder |
|---|---|---|---|---|
| `minmax(0, 1fr)` | Grid track that can shrink below content | Oversized highlights child forced overflow | `1fr` = `minmax(auto, 1fr)` | The mobile overflow bug |
| `overflow-x: clip` vs `hidden` | Clips without creating a scroll container | Keeps sticky header working | `hidden` breaks descendant `sticky` | Say "scroll container" |
| `position: sticky` + `top: 0` | Relative until threshold, then fixed | Floating header | Dies inside any `overflow` ancestor | Pair with `scroll-padding-top` |
| `isolation: isolate` | New stacking context, no z-index | Traps `z-index: -1/-2` bg layers | No ordering side effects | Beats `opacity: .999` |
| `transform` vs `right/left` | Paint-time vs layout | Off-canvas drawer | Transform adds no scroll width | Compositor-friendly |
| `visibility` in a transition | Discrete but transitionable | Drawer stays visible while sliding out | Deferred when hiding, immediate when showing | Subtle, memorable |
| `white-space: pre` | Preserves source whitespace | Fake code editor | Source formatting becomes content | The line-number desync bug |
| `flex: 0 0 auto` | No grow, no shrink | Code lines overflow instead of wrapping | Flex items shrink by default | Cousin of `min-width: auto` |
| `clamp()` / `min()` | Fluid values with bounds | Type scale + container | Order is min, preferred, max | Handles scale, not layout |
| `calc(100% - 8px)` on `bottom` | % of containing block height | Card above the editor | `bottom: 100%` = directly above | Containing block matters |
| Custom properties + `[data-theme]` | Runtime theming | Light/dark + 5 accents | Resolved at computed-value time | Attribute > class for one-of-set |
| `color-mix(in srgb, …)` | Derive colour from a token | Hero glow follows the accent | Can't decompose a var with `rgba()` | Token discipline |
| `mask-image: radial-gradient(...)` | Alpha-based visibility | Fades the grid at the edges | Ship the `-webkit-` prefix | No image needed |
| Two linear gradients + `background-size` | Repeating grid pattern | Hero background | Hard colour stops at 1px | Zero requests |
| `steps(1)` | Discrete timing function | Terminal-style caret blink | No interpolation | Contrast with `ease` |
| `animation-delay` + `opacity: 0` | Covers the pre-delay window | Staggered hero reveal | Delay doesn't apply keyframe 1 | Or `fill-mode: backwards` |
| `forwards` | Holds the end state | Content stays visible | Without it, it snaps back | Classic "content vanishes" bug |
| Repeating `translate` in keyframes | `transform` is one property | Orbit stays centred while spinning | Animation replaces the whole list | Or use individual `translate`/`rotate` |
| `currentColor` in SVG | Icon inherits CSS `color` | Hover + theme recolouring | Works for `fill` and `stroke` | Why inline SVG wins |
| `<pattern patternUnits="userSpaceOnUse">` | Tiles one shape | Dotted world map | Hundreds of dots, one instruction | Watch for duplicate ids |
| `nth-child(n + 3)` | 3rd element onward | Trims the status bar on mobile | Counts all siblings, not just the class | `nth-last-child(-n+2)` for the last two |
| Recursive `setTimeout` | Variable-delay loop | Typewriter | Can't overlap; store the id to cancel | vs `setInterval`'s fixed period |
| `matchMedia(...).matches` | Media query in JS | Skip the typewriter | Subscribe to `change` for live updates | Pairs with the CSS query |
| `querySelectorAll` | Static NodeList | Cached at load | Snapshot, not live | vs live `HTMLCollection` |
| `this` in a listener | The bound element | `this.getAttribute("href")` | Arrow functions break it | `event.currentTarget` is the safe form |
| `offsetTop` in a scroll handler | Forces synchronous layout | Scroll-spy | Layout thrashing | Replace with IntersectionObserver |
| `scroll-padding-top` | Offsets scroll targets | Sticky header doesn't cover sections | Pairs with `scroll-behavior` | Everyone forgets it |
| `aria-expanded` sync | Announces menu state | Drawer open/close | Must be updated in both functions | Cheap, high-value a11y |
| Skip link off-screen | Focusable but invisible | Keyboard bypass | `display: none` would kill focusability | First element in `<body>` |
| `@import` for fonts | Serialised request chain | Currently in `variables.css` | Slowest option | Move to `<link>` + `preconnect` |

### J2. Patterns worth naming in an interview

- **Attribute-driven state:** JS flips one attribute on `<html>`; CSS owns every visual consequence. Used for theme, ready for accent.
- **Positioning element vs painting element:** `.site-header` positions, `.header-wrapper` paints.
- **Tight anchor wrapper:** `.hero__stage` exists purely to give absolute children a predictable containing block.
- **Class-toggle state machine:** `openMenu`/`closeMenu`/`toggleMenu` mutate classes + ARIA; CSS animates.
- **Timer state machine:** three module-scope variables + recursive `setTimeout`.
- **CSS-only icon swap:** ship both SVGs, let a selector choose.
- **Progressive disclosure:** hide the explorer *and* change the grid track at 768px.
- **Guard clauses everywhere:** `if (!typingText) return`, `if (documentHeight <= 0)`, `if (!target) return`.

### J3. The seven mistakes this project teaches

1. `1fr` when you meant `minmax(0, 1fr)`.
2. Pretty-printing HTML inside `white-space: pre`.
3. Parking an off-canvas panel with `right: -100%` instead of a transform.
4. Forgetting that `animation-delay` doesn't apply the first keyframe.
5. Letting an animation's `transform` clobber a static centring `translate`.
6. Reading `localStorage` after first paint (theme flash).
7. Reading `offsetTop` inside a scroll handler.

### J4. Say these before you're asked

- The drawer has no focus trap and doesn't restore focus on close.
- The theme flashes on load; the fix is a blocking inline script in `<head>`.
- Three unthrottled scroll listeners, one of which forces layout.
- `padding-left: 152px` and `min-height: 545px` are magic numbers.
- The typewriter's timer can't be cancelled.
- Google Fonts loaded via `@import` is the slowest option.
- SVG ids are document-global and would collide if reused.

---

## Section K — The Full Chain (worked example)

Every important piece of this project maps onto the same chain. Here it is, end to end, for one feature.

**Actual code**
```css
.hero__wrapper { grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr); }
.hero__highlights { grid-template-columns: repeat(3, minmax(0, 1fr)); width: calc(100% + 8.5rem); }
```

↓ **Concept** — CSS Grid track sizing; `1fr` is `minmax(auto, 1fr)`.

↓ **What it does** — Defines two hero columns that are allowed to shrink below their content's intrinsic width, and a three-card row deliberately wider than its column.

↓ **Why it was used** — The reference design has the card row extending past the paragraph above it; the `minmax(0, …)` prevents that oversized child from stretching the layout.

↓ **Browser behaviour** — With `auto` minimums, the browser raises the track's base size to the child's min-content width and the grid grows. With a `0` minimum, the track stays at its `fr` share and the child overflows, to be clipped by `overflow: hidden`.

↓ **Possible changes** — Move `.hero__highlights` to `.hero__wrapper` as a second-row item with `grid-column: 1 / -1`; the width then comes from the grid and the `calc()` and its mobile reset both disappear.

↓ **Possible bugs** — Horizontal page overflow at ≤992px; every `.container` computing `94%` of a too-wide parent; content shifted right on mobile.

↓ **Interview question** — "Why `minmax(0, 1fr)` instead of `1fr`?"

↓ **Beginner answer** — "So the column can shrink smaller than its content."

↓ **3-year answer** — "`1fr` is `minmax(auto, 1fr)` and that auto minimum means the track can't go below min-content. I had a deliberately oversized child, so at the mobile breakpoint the single column grew past the viewport and the whole page overflowed sideways. `minmax(0, 1fr)` lets the track shrink and the overflow gets clipped instead. It's the grid analogue of `min-width: auto` on flex items."

↓ **Follow-up** — "How did you diagnose it?"

↓ **Follow-up answer** — "I measured rather than guessed: loaded the page in fixed-width iframes at six breakpoints and compared `scrollWidth` to `clientWidth`, logging any element whose right edge passed the viewport. That isolated the element and the breakpoint in one pass."

**Apply the same chain to:** the sticky header, the off-canvas drawer, the typewriter, the stat-card positioning, the stacking ladder, the code block's `white-space: pre`, the SVG pattern map, the reduced-motion handling, and the scroll handlers. Those nine plus this one cover essentially everything an interviewer can reach from this repository.
