# Portfolio JS

A personal portfolio website built with HTML, CSS, and JavaScript.

## What's Included

- **Hero Section**: Staggered entrance animations, role typewriter effect, achievement stats, interactive code workspace widget, CTAs, and highlight badges.
- **Modular CSS Architecture**: Organised into design tokens (`variables.css`), layout structure (`layout.css`), UI components (`components.css`), animations (`animations.css`), and media queries (`responsive.css`).
- **Theme Variables**: Supports custom accent colors (blue, purple, green, orange, pink) and light/dark modes using CSS variables.
- **Interactive JS**: Features typewriter animation, header scroll states, scroll progress bar, mobile drawer menu, scrollspy navigation, and smooth anchor links.

## Project Structure

```text
├── index.html            # Main HTML document with hero section
├── css/
│   ├── variables.css     # CSS design tokens, color themes, and typography
│   ├── layout.css        # Page layout, grid systems, hero container, and section wrappers
│   ├── components.css    # UI components (hero badge, buttons, nav links, code workspace, achievement cards)
│   ├── animations.css    # Hero reveal animations, floating card keyframes, and typing cursor effect
│   └── responsive.css    # Breakpoint media queries
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
