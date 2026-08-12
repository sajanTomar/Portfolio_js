# HTML Masterclass Interview Preparation Guide (3+ YOE Level)

> **Target Audience:** Frontend Engineers (3+ YOE) looking to transition from relying on AI tools/books to speaking with complete authority, deep conceptual clarity, and writing clean native HTML in technical interviews.

---

## Table of Contents
1. [Module 1: Absolute Ground Zero & Metadata](#module-1-absolute-ground-zero--metadata)
2. [Module 2: HTML Tags, Semantics & Elements](#module-2-html-tags-semantics--elements)
3. [Module 3: Forms, Validation & Data Handling](#module-3-forms-validation--data-handling)
4. [Module 4: Script Loading, Resource Hints & Performance](#module-4-script-loading-resource-hints--performance)
5. [Module 5: DOM, Parsing & Critical Rendering Path (CRP)](#module-5-dom-parsing--critical-rendering-path-crp)
6. [Module 6: Accessibility (A11y), WCAG & WAI-ARIA](#module-6-accessibility-a11y-wcag--wai-aria)
7. [Module 7: Advanced HTML5 Specs, Security & SEO](#module-7-advanced-html5-specs-security--seo)
8. [Module 8: Top 25+ Interview Questions & Verbal Scripts](#module-8-top-25-interview-questions--verbal-scripts)
9. [Module 9: Live Coding Interview Challenges](#module-9-live-coding-interview-challenges)

---

## Module 1: Absolute Ground Zero & Metadata

### 1.1 Document Structure & Anatomy
Every standard HTML5 document follows a fixed foundational structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Title</title>
</head>
<body>
  <!-- Visible Page Content -->
</body>
</html>
```

---

### 1.2 `<!DOCTYPE html>` Deep Dive
* **What is it?** It is a document type declaration (DTD) that instructs the browser's HTML parser which version of HTML the page is written in.
* **Is it an HTML Tag?** **NO**. It is a processing instruction. It has no closing tag, no attributes in HTML5, and is case-insensitive (e.g., `<!doctype html>`).
* **Why is it mandatory?**
  * **Standards Mode:** With `<!DOCTYPE html>`, the browser parses and renders the page according to modern W3C specifications.
  * **Quirks Mode:** If omitted, browsers enter **Quirks Mode** to maintain backward compatibility with websites written in the late 1990s (Netscape Navigator / IE5 era). In Quirks Mode:
    * Internet Explorer non-standard Box Model is used (`width` includes padding and border).
    * Inline elements respond differently to sizing.
    * Class names become case-insensitive.
  * **Almost Standards Mode:** Triggered by old transitional DOCTYPEs; behaves like Standards Mode except for cell height calculations inside tables.

---

### 1.3 Character Encoding & `<meta charset="UTF-8">`

#### What is Character Encoding?
Computers only process binary digits (`0` and `1`). When you write text like `"Hello"`, `"₹"`, or `"😊"`, the computer converts each character into a numerical byte value (a code point) according to a mapping table called a **Character Set (Charset)**.

#### ASCII vs Unicode vs UTF-8

| Encoding | Bits per Char | Total Characters Supported | Use Case |
| :--- | :--- | :--- | :--- |
| **ASCII** | 7-bit (0-127) | 128 characters (Basic English letters, digits, basic symbols) | Ancient legacy systems |
| **ISO-8859-1 (Latin-1)** | 8-bit (1 byte) | 256 characters (Western European languages) | Early web default |
| **Unicode (Standard)** | Abstract Map | Maps over 1,114,112 code points (`U+0000` to `U+10FFFF`) | The global character standard |
| **UTF-8** | 1 to 4 bytes (Variable) | Over 140,000+ characters (All human scripts, math symbols, emojis) | **The Standard for Web** |

#### Why UTF-8 is the Web Standard
* **Variable-length byte encoding:** Uses 1 byte for standard ASCII characters (efficient space usage for English text) and up to 4 bytes for complex non-Latin symbols and emojis.
* **Backward compatibility:** The first 128 characters of UTF-8 match ASCII 1:1.

#### What happens if `<meta charset="UTF-8">` is missing or misplaced?
1. **Mojibake (Garbled Text):** Characters like `©`, `—`, `’`, `€`, or Hindi/Japanese scripts render as corrupt symbols (e.g., `Ã©` or ``).
2. **Parsing Overhead:** The browser has to stop parsing, inspect the byte stream to guess the character encoding, or re-parse the DOM once it discovers an encoding tag late.
3. **Security Vulnerabilities:** Older browsers could be manipulated via UTF-7/UTF-8 cross-site scripting (XSS) payload mutations.

> **CRITICAL RULE:** `<meta charset="UTF-8">` MUST be declared inside `<head>` **within the first 1024 bytes** of the HTML document so the browser knows how to parse subsequent characters immediately.

---

### 1.4 Viewport Control: `<meta name="viewport">`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

* `width=device-width`: Overrides mobile browser default virtual canvas (~980px wide) and matches the screen width in CSS layout pixels.
* `initial-scale=1.0`: Sets initial zoom level 1:1 when loaded.
* `maximum-scale=5.0`: Allows user pinch-zoom up to 5x.
* **INTERVIEW WARNING:** Never set `user-scalable=no` or `maximum-scale=1.0` unless strictly required for specific native web views, as it violates WCAG Accessibility Guideline 1.4.4 (Resize Text).

---

## Module 2: HTML Tags, Semantics & Elements

### 2.1 Element vs Tag vs Attribute
* **Tag:** The syntax enclosed in angle brackets: `<p>` (opening tag) and `</p>` (closing tag).
* **Element:** The entire node comprising the opening tag, attributes, content, and closing tag:
  `<p class="text">Hello World</p>`
* **Attribute:** Key-value pair providing metadata or behavior to the element: `class="text"`, `id="main"`, `disabled`.

### 2.2 Void (Self-Closing) Elements
Void elements cannot contain child elements or text nodes, and do not have a closing tag:
`<img>`, `<input>`, `<meta>`, `<link>`, `<br>`, `<hr>`, `<source>`, `<track>`, `<area>`, `<base>`, `<embed>`, `<param>`.

In HTML5, trailing slashes on void tags (`<img />`) are optional and ignored by the parser.

---

### 2.3 Semantic HTML Architecture

#### Why Semantic HTML is Mandatory for Senior Frontend Engineers:
1. **Accessibility (A11y):** Screen readers (NVDA, VoiceOver, JAWS) build an **Accessibility Tree** based on semantic tags.
2. **SEO (Search Engine Optimization):** Web crawlers assign higher weights to text inside semantic headers and sections.
3. **DOM Maintenance & Code Readability:** Clear document outline for engineering teams.

```
+-------------------------------------------------------+
|                       <header>                        |
|                     <nav>...</nav>                    |
+-------------------------------------------------------+
|                       <main>                          |
|  +---------------------------------+  +------------+  |
|  |           <article>             |  |  <aside>   |  |
|  |  <h1>Title</h1>                 |  |  Sidebar   |  |
|  |  <section>...</section>         |  |  Links     |  |
|  |  <section>...</section>         |  |            |  |
|  +---------------------------------+  +------------+  |
+-------------------------------------------------------+
|                       <footer>                        |
+-------------------------------------------------------+
```

#### Detailed Breakdown of Semantic Tags

* `<main>`: Represents the dominant, unique content of the `<body>`. There must only be **one visible `<main>` element** per document.
* `<header>`: Introductory container for headings, logos, search forms, or navigation.
* `<nav>`: Block containing primary navigation links. (Do not wrap every set of links in `<nav>`, only major navigation blocks).
* `<article>`: Self-contained composition that is independently distributable or reusable (e.g., blog post, news story, product card, forum post, tweet).
* `<section>`: Standalone thematic grouping of content, typically with a heading (`<h2>`-`<h6>`).
* `<aside>`: Tangentially related content (sidebar, related articles, ad blocks, callouts).
* `<figure>` & `<figcaption>`: Encapsulates self-contained media (image, diagram, code snippet) along with its caption.
* `<time datetime="2026-08-11T20:00">`: Machine-readable date/time element for SEO crawlers and calendar parsers.
* `<details>` & `<summary>`: Native HTML accordions/collapsible content without requiring JavaScript.
* `<dialog>`: Native browser modal or popup container.

---

### 2.4 `<article>` vs `<section>` vs `<div>` (Interview Decision Matrix)

| Element | Semantic Meaning | Can exist independently outside page? | Should have a Heading tag? | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **`<article>`** | High (Self-contained unit) | ✅ YES (e.g. RSS feed, card) | ✅ YES (`<h2>`/`<h3>`) | Blog post, comment, product card |
| **`<section>`** | Medium (Thematic group) | ❌ NO (Requires page context) | ✅ YES (`<h2>`-`<h6>`) | "Features", "Pricing table", "FAQ" |
| **`<div>`** | NONE (Pure CSS container) | N/A | ❌ NO (No semantic rule) | Wrapper for flexbox/grid layouts |

---

### 2.5 Display Categories: Block vs Inline vs Inline-Block

```
Block Element:       [=================== Full Width Container ===================]
Inline Element:      [ Content 1 ] [ Content 2 ] (Ignores width, height, top/bottom margin)
Inline-Block Element: [ Content 1 (Width:150px) ] [ Content 2 (Width:200px) ]
```

#### Detailed Comparison

* **Block Elements (`<div>`, `<p>`, `<h1>`-`<h6>`, `<section>`, `<ul>`, `<li>`):**
  * Default width: 100% of parent container.
  * Always starts on a new line.
  * Fully respects `width`, `height`, `margin`, `padding` on all 4 sides.

* **Inline Elements (`<span>`, `<a>`, `<strong>`, `em`, `<code>`, `<label>`):**
  * Takes up only the width of its internal content.
  * Does NOT start on a new line (flows horizontally with text).
  * **Ignores `width` and `height` properties.**
  * **Ignores vertical margins (`margin-top` & `margin-bottom`).** Horizontal margin/padding works.

* **Inline-Block Elements (`<img>`, `<button>`, `<input>`, `<textarea>`, `<select>`):**
  * Flows horizontally inline with surrounding text.
  * **Fully respects `width`, `height`, `margin`, and `padding` on all sides.**

---

## Module 3: Forms, Validation & Data Handling

### 3.1 Form Encoding Types (`enctype`)

When submitting an HTML form via `method="POST"`, the `enctype` attribute determines how browser formats form data before transmitting over HTTP:

1. **`application/x-www-form-urlencoded` (Default):**
   * Encodes form keys and values as URL-encoded string (`name=John+Doe&email=john%40test.com`).
   * Special characters are escaped. Efficient for small text data.

2. **`multipart/form-data`:**
   * **Required when uploading files (`<input type="file">`).**
   * Data is split into multiple MIME body parts separated by a unique boundary string. Sends binary data intact without bloat.

3. **`text/plain`:**
   * Sends raw unencoded text. Used only for debugging; should never be used in production.

```html
<!-- Binary File Upload Form Example -->
<form action="/api/v1/upload" method="POST" enctype="multipart/form-data">
  <label for="user-avatar">Select Profile Picture:</label>
  <input type="file" id="user-avatar" name="avatar" accept="image/png, image/jpeg" required>
  <button type="submit">Upload File</button>
</form>
```

---

### 3.2 Native HTML5 Form Validation

HTML5 provides client-side validation out of the box without requiring JavaScript:

* `required`: Prevents form submission if empty.
* `pattern="[A-Za-z0-9]{6,12}"`: Validates against a regular expression.
* `min` / `max`: Sets numeric/date bounds (`<input type="number" min="18" max="99">`).
* `minlength` / `maxlength`: Bounds string character counts.
* `type="email"` / `type="url"` / `type="number"`: Built-in syntax checkers.

#### Customizing Validation with JS Constraint Validation API:
```html
<input type="email" id="email-field" required>

<script>
  const emailInput = document.getElementById('email-field');
  emailInput.addEventListener('input', () => {
    if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity('Please enter a valid work email address!');
    } else {
      emailInput.setCustomValidity(''); // Clear custom error to allow submit
    }
  });
</script>
```

---

## Module 4: Script Loading, Resource Hints & Performance

### 4.1 Script Execution Strategies: Normal vs `async` vs `defer` vs `type="module"`

```
Normal Script: HTML Parsing ===[Paused while downloading & executing script]===> HTML Parsing resumed
Script Async:  HTML Parsing =====[Downloads in bg]====>[Pauses HTML to execute]=> HTML Parsing resumed
Script Defer:  HTML Parsing =====[Downloads in bg]===============================> Executes after HTML done
ES Module:     HTML Parsing =====[Downloads in bg]===============================> Executes like defer (strict)
```

#### Detailed Attribute Matrix

| Script Type | HTML Parsing | Script Download | Script Execution | Order Preserved? | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `<script src="...">` | **Paused** | Immediate | Immediately upon download | Yes | Legacy scripts at bottom of `<body>` |
| `<script async src="...">` | **Not Paused** | Background | Immediately upon download (Pauses HTML parsing) | ❌ NO (First downloaded executes first) | Analytics (GA), Ads, Independent tracking tags |
| `<script defer src="...">` | **Not Paused** | Background | After DOM parsing completes (Before `DOMContentLoaded`) | ✅ YES | Main app bundle (`app.js`), DOM-dependent code |
| `<script type="module">` | **Not Paused** | Background | Defers execution automatically (Strict Mode) | ✅ YES | Modern ES module imports |

---

### 4.2 Resource Hints (`<link rel="...">`)

Resource hints instruct the browser network engine how to prioritize downloading resources for the current or future pages:

1. **`preload`**: Downloads critical assets (hero image, critical font, key CSS) needed on the **current page** immediately with high priority.
   ```html
   <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
   ```

2. **`prefetch`**: Fetches low-priority assets expected to be needed on the **next page navigation**.
   ```html
   <link rel="prefetch" href="/js/dashboard-chunk.js" as="script">
   ```

3. **`dns-prefetch`**: Performs early DNS resolution for an external domain to reduce latency later.
   ```html
   <link rel="dns-prefetch" href="https://api.stripe.com">
   ```

4. **`preconnect`**: Resolves DNS + Performs TCP handshake + TLS negotiation with an external origin.
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

---

### 4.3 Image Performance & Responsive Images

#### Lazy Loading (`loading="lazy"`)
Defers loading offscreen images until they are near the user's scroll viewport distance.

```html
<img src="product.jpg" alt="Wireless Headphones" width="400" height="400" loading="lazy" decoding="async">
```

#### Responsive Images with `<picture>` Tag
Allows serving optimal image formats (AVIF / WebP / JPEG) and responsive sizes based on device screen characteristics:

```html
<picture>
  <!-- Serve AVIF to browsers that support it on dark mode screens -->
  <source srcset="hero-dark.avif" type="image/avif" media="(prefers-color-scheme: dark)">
  <!-- Serve WebP for small mobile screens -->
  <source srcset="hero-mobile.webp 480w, hero-desktop.webp 1024w" sizes="(max-width: 600px) 480px, 1024px" type="image/webp">
  <!-- Fallback JPEG image -->
  <img src="hero-fallback.jpg" alt="Dashboard preview" width="1024" height="576" loading="eager" fetchpriority="high">
</picture>
```

---

## Module 5: DOM, Parsing & Critical Rendering Path (CRP)

### 5.1 Critical Rendering Path Pipeline

```
HTML Bytes ➔ Characters ➔ Tokens ➔ Nodes ➔ DOM Tree --+
                                                       |===> Render Tree ➔ Layout ➔ Paint ➔ Composite
CSS Bytes  ➔ Characters ➔ Tokens ➔ Nodes ➔ CSSOM Tree -+
```

1. **DOM Tree Construction:** HTML Parser transforms HTML tokens into the Document Object Model tree.
2. **CSSOM Tree Construction:** CSS rules parsed into CSS Object Model tree. **CSS is render-blocking.**
3. **Render Tree:** Combines DOM and CSSOM trees. Nodes with `display: none`, `<head>`, `<script>` are excluded.
4. **Layout / Reflow:** Browser calculates precise visual geometric positions (width, height, X/Y coordinates) for every visible Render Tree node.
5. **Paint / Repaint:** Browser fills in visual elements (pixels, colors, borders, text, shadows) onto layers.
6. **Compositing:** Browser GPU composites multiple layers onto the screen in correct visual order.

---

## Module 6: Accessibility (A11y), WCAG & WAI-ARIA

### 6.1 Fundamental Rules of Accessibility
1. **First Rule of ARIA:** Do not use ARIA roles/attributes if a native HTML element already exists that provides the semantic behavior!
   * Bad: `<div role="button" onclick="submit()">Submit</div>`
   * Good: `<button type="button" onclick="submit()">Submit</button>`

### 6.2 ARIA Attributes Key Cheat Sheet
* `role="dialog"`: Informs screen readers an element is a modal dialog.
* `aria-label="Close menu"`: Provides invisible text label when no visible text exists (e.g., icon-only buttons).
* `aria-labelledby="heading-id"`: References ID of an existing visible element to act as its accessible title.
* `aria-describedby="desc-id"`: References ID of helper text or error messages.
* `aria-hidden="true"`: Hides purely decorative elements (icons, graphics) from screen readers.
* `aria-live="polite|assertive"`: Announces dynamic DOM updates (notifications, live feeds) to screen readers.

### 6.3 Focus Management & `tabindex`
* `tabindex="0"`: Adds non-focusable element (`<div>`, `<span>`) into natural DOM keyboard tab order.
* `tabindex="-1"`: Removes element from keyboard tab order, but makes it programmatically focusable via `element.focus()`.
* `tabindex="1"` (or any positive integer): **Anti-pattern!** Overrides natural DOM order and breaks keyboard accessibility.

---

## Module 7: Advanced HTML5 Specs, Security & SEO

### 7.1 Modern HTML5 `<dialog>` Tag
Replaces custom JS modal hacks with native modal behavior, backdrop styling, and focus trapping:

```html
<button id="open-btn">Open Profile Modal</button>

<dialog id="user-modal">
  <h2>User Settings</h2>
  <p>Update your account details below.</p>
  <button id="close-btn">Close</button>
</dialog>

<script>
  const modal = document.getElementById('user-modal');
  document.getElementById('open-btn').addEventListener('click', () => modal.showModal()); // Backdrop + Focus Trap
  document.getElementById('close-btn').addEventListener('click', () => modal.close());
</script>

<style>
  /* Native Backdrop Styling */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
  }
</style>
```

---

### 7.2 HTML Security: `rel="noopener noreferrer"` & CSP

#### Tabnabbing Vulnerability
When using `<a href="https://external.com" target="_blank">`, the target page gains access to your window via `window.opener`. The external site can redirect your page to a phishing URL (`window.opener.location = "https://phishing.com"`).

#### The Fix:
```html
<a href="https://external-link.com" target="_blank" rel="noopener noreferrer">Visit Site</a>
```
* `noopener`: Sets `window.opener` to `null` in the opened tab.
* `noreferrer`: Prevents sending the HTTP `Referer` header to external domain.

---

## Module 8: Top 25+ Interview Questions & Verbal Scripts

### Q1: What is `<!DOCTYPE html>` and what happens if you omit it?
> **Verbal Answer:**
> "`<!DOCTYPE html>` is an instruction to the browser that the document is written in modern HTML5. It is not an HTML tag. If omitted, the browser triggers **Quirks Mode**, emulating legacy 1990s rendering rules where Internet Explorer box models are applied and CSS layout behavior becomes unpredictable. Declaring standard `<!DOCTYPE html>` forces **Standards Mode**."

### Q2: What is `charset="UTF-8"` and why must it be inside the first 1024 bytes of `<head>`?
> **Verbal Answer:**
> "`charset` defines character encoding—how binary bytes map to characters. UTF-8 is the standard variable-length encoding that supports over 140,000 characters (all human scripts and emojis). It must be within the first 1024 bytes so the browser can parse character tokens immediately upon receiving the initial network bytes without pausing or re-parsing the document."

### Q3: What is the difference between `async` and `defer` script attributes?
> **Verbal Answer:**
> "Both download scripts in the background without blocking HTML parsing. However, `async` executes the script immediately after it downloads, pausing HTML parsing and ignoring script insertion order. `defer` waits until HTML parsing is completely finished before executing scripts in the exact order they appear in the document."

### Q4: Explain `<article>` vs `<section>` vs `<div>`.
> **Verbal Answer:**
> "`<article>` represents an independent, self-contained unit of content that can be reused outside the page context (like a blog post or product card). `<section>` represents a thematic group of content on the page, usually with a heading (`<h2>`). `<div>` has no semantic meaning and is strictly a container for CSS styling or JavaScript layout positioning."

### Q5: How does `<meta name="viewport" content="width=device-width, initial-scale=1.0">` work?
> **Verbal Answer:**
> "Mobile browsers default to a desktop virtual viewport (around 980px) and zoom out, making content tiny. `width=device-width` sets the layout viewport width to match the physical device width in CSS pixels, and `initial-scale=1.0` sets 1:1 initial zoom."

### Q6: What is the difference between inline, block, and inline-block elements?
> **Verbal Answer:**
> "Block elements take full width, start on a new line, and respect width/height/margin/padding. Inline elements take content width only, flow horizontally, and ignore width, height, and vertical margins. Inline-block elements flow horizontally like text, but fully respect width, height, margin, and padding."

### Q7: What is the difference between `application/x-www-form-urlencoded` and `multipart/form-data`?
> **Verbal Answer:**
> "`application/x-www-form-urlencoded` is default for text form submissions, encoding data as key-value query strings. `multipart/form-data` is mandatory for file uploads (`<input type="file">`) because it splits binary data into separate MIME parts without string encoding bloat."

### Q8: What are Resource Hints (`preload`, `prefetch`, `preconnect`)?
> **Verbal Answer:**
> "`preload` downloads critical current-page assets (fonts, hero images) immediately with high priority. `prefetch` downloads assets needed for future page navigations during idle time. `preconnect` resolves DNS, TCP, and TLS connections to external origins ahead of time."

### Q9: Why is `tabindex="1"` an anti-pattern?
> **Verbal Answer:**
> "Positive `tabindex` values override the natural DOM keyboard tab order, creating confusing navigation traps for keyboard and screen reader users. `tabindex="0"` should be used to add elements to natural order, and `tabindex="-1"` to allow JavaScript focus."

### Q10: What is the Critical Rendering Path (CRP)?
> **Verbal Answer:**
> "CRP is the sequence of steps the browser takes to render HTML/CSS onto the screen: DOM Tree + CSSOM Tree $\rightarrow$ Render Tree $\rightarrow$ Layout (calculating coordinates) $\rightarrow$ Paint (filling pixels) $\rightarrow$ Compositing layers via GPU."

---

## Module 9: Live Coding Interview Challenges

### Challenge 1: Accessible Custom Signup Form
*Requirements:* Write native HTML for a user registration form containing name, email, password (with pattern regex), profile picture upload, terms checkbox, and submit button. Must use proper labels, fieldsets, accessibility attributes, and binary form encoding.

```html
<form action="/api/register" method="POST" enctype="multipart/form-data" novalidate>
  <fieldset>
    <legend>Account Information</legend>
    
    <div class="form-group">
      <label for="full-name">Full Name:</label>
      <input type="text" id="full-name" name="fullName" required minlength="2" autocomplete="name">
    </div>

    <div class="form-group">
      <label for="email">Work Email:</label>
      <input type="email" id="email" name="email" required autocomplete="email">
    </div>

    <div class="form-group">
      <label for="password">Password (Min 8 chars, 1 number, 1 uppercase):</label>
      <input 
        type="password" 
        id="password" 
        name="password" 
        required 
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        aria-describedby="password-help"
        autocomplete="new-password"
      >
      <small id="password-help">Must contain at least 8 characters, one number, and one uppercase letter.</small>
    </div>
  </fieldset>

  <fieldset>
    <legend>Profile & Terms</legend>
    
    <div class="form-group">
      <label for="avatar">Profile Picture (PNG/JPG):</label>
      <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" required>
    </div>

    <div class="form-group">
      <input type="checkbox" id="terms" name="terms" required>
      <label for="terms">I accept the Terms and Conditions</label>
    </div>
  </fieldset>

  <button type="submit">Create Account</button>
</form>
```

---

### Challenge 2: Optimized Responsive Hero Section with Font Preloading
*Requirements:* Write HTML `<head>` and hero `<picture>` markup preloading critical fonts, preconnecting to Google Fonts, deferring app scripts, and serving WebP/AVIF hero images lazily.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Product - Hero</title>

  <!-- Performance Resource Hints -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-bold.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Deferred Application Script -->
  <script defer src="/js/app.js"></script>
</head>
<body>
  <header>
    <nav aria-label="Main Navigation">
      <a href="/">Home</a>
    </nav>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading">Build Scalable Web Apps Faster</h1>
      <p>Empowering frontend engineers with modern web architectures.</p>

      <picture>
        <source srcset="/images/hero-dark.avif" type="image/avif" media="(prefers-color-scheme: dark)">
        <source srcset="/images/hero.webp" type="image/webp">
        <img src="/images/hero-fallback.jpg" alt="Interface preview of cloud analytics dashboard" width="1200" height="675" fetchpriority="high">
      </picture>
    </section>
  </main>
</body>
</html>
```

---

## Next Steps in Your Interview Preparation Roadmap

Now that you have the complete, standalone **HTML Masterclass Interview Guide**:
1. **Study Module 8 Verbal Scripts**: Practice speaking the answers aloud without reading from notes.
2. **Move to CSS Masterclass**: We will cover **Box Model, Specificity Math, Flexbox vs Grid deep dive, Stacking Context & z-index, BEM methodology, and Repaint/Reflow CSS performance triggers**.
