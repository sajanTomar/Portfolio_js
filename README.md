# Portfolio JS

A personal portfolio website built with HTML, CSS, and JavaScript.

## What's Included

- **Hero Section**: Complete introductory hero layout featuring a VS Code workspace simulation (file explorer sidebar, tabs, syntax-highlighted TSX code, status bar), SVG orbit graphics, achievement cards (Lighthouse score, active users, country reach), role typewriter effect, CTAs, and highlight badges.
- **Impact Section**: Performance & engineering metrics (FCP/LCP optimization stats, Lighthouse score, 50K+ active users, global reach) and core engineering principles.
- **Modular CSS Architecture**: Organised into design tokens (`variables.css`), layout structure (`layout.css`), UI components (`components.css`), animations (`animations.css`), and media queries (`responsive.css`).
- **Theme Variables & Icons**: SVG icon system with dark/light theme toggle, color picker controls, and CSS custom property color themes.
- **Interactive JS**: Features role typewriter animation, header scroll state, scroll progress bar, mobile drawer menu, scrollspy navigation, and smooth anchor links.

## Project Structure

```text
├── index.html            # Main HTML document with hero & engineering impact sections
├── css/
│   ├── variables.css     # CSS design tokens, color themes, and typography
│   ├── layout.css        # Page layout, grid systems, hero container, and section wrappers
│   ├── components.css    # UI components (VS Code IDE widget, impact cards, syntax tokens, buttons)
│   ├── animations.css    # Hero reveal animations, floating cards, background glow motion, and typing cursor
│   └── responsive.css    # Breakpoint media queries for desktop, tablet, and mobile views
├── js/
│   └── main.js           # Typewriter effect, header scroll, mobile drawer toggle, scroll progress, and scrollspy logic
└── assets/               # Static images, icons, and resume PDF
```

## Running Locally

No build tools or external dependencies needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/sajanTomar/Portfolio_js.git
   ```
2. Open `index.html` in any modern web browser or run it with VS Code Live Server.
