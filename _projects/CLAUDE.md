# CLAUDE.md — GNSSMetrics.com

## Project Overview
GNSSMetrics.com is an educational website about GNSS (Global Navigation Satellite Systems).
It hosts learning content, projects, and resources for GNSS engineering.
Built with Astro. Deployed via Cloudflare Pages.

## Critical Rules
- NEVER delete or modify existing project cards, pages, or content
- NEVER change global styles, layouts, or navigation unless explicitly asked
- NEVER modify the Astro config or build pipeline
- ONLY add new content — do not refactor existing code
- Match the existing design patterns EXACTLY
- All new files must follow the existing naming conventions

## Project Structure
src/
├── components/
│   └── Welcome.astro
├── content/
│   └── news/          # News markdown content collection (projects are NOT here)
├── data/
│   └── tools.ts
├── layouts/
│   └── Layout.astro   # Global layout + nav/footer + global design tokens
├── pages/
│   ├── index.astro
│   ├── projects/
│   │   ├── index.astro          # Project cards listing (inline `projects` array)
│   │   ├── gps-l1-engine.astro
│   │   ├── position-resolver.astro
│   │   ├── least-squares.astro
│   │   ├── rtk-engine.astro
│   │   └── sensor-fusion.astro
│   ├── tools/
│   ├── dashboards/
│   ├── learn/
│   ├── blog/
│   ├── news/
│   └── about.astro
└── assets/
    └── ...

## How to Add a New Project

When a new markdown file appears in `_projects/`, do the following:

### 1. Read the new project markdown file
Parse the frontmatter (title, tags, date, description) and body content.

### 2. Create the project content entry
This repo uses file-based pages for projects:
- Create a new `.astro` file in `src/pages/projects/` (kebab-case slug)
- Use the same pattern as existing files like:
  - `src/pages/projects/gps-l1-engine.astro`
  - `src/pages/projects/position-resolver.astro`
- Import `Layout` from `../../layouts/Layout.astro`
- Include a back-link to `/projects` and keep section/card class naming consistent

### 3. Verify the card appears on the projects listing page
- Project cards are manually defined in `src/pages/projects/index.astro`
- Add a new object to the `projects` array with:
  - `href`
  - `icon`
  - `title`
  - `lang`
  - `status`
  - `desc`
- Keep `status` aligned with the `statusColor` map values (`Complete`, `In progress`, `Planned`)

### 4. Match the existing card format
There is no standalone `ProjectCard` component; cards are inline in `src/pages/projects/index.astro`.
Replicate:
- Same card classes: `card`, `card-top`, `card-icon`, `card-meta`, `lang-badge`, `status-badge`, `card-link`
- Same structure: icon + language/status badges + title + short description + CTA line
- Same hover behavior: border highlight (`rgba(0,212,170,0.3)`) without changing global card style conventions
- Keep descriptions concise (roughly one sentence, similar length to existing entries)

## Design Patterns to Follow
### Card Format
- Project cards live in a responsive `.cards-grid` and are full clickable `<a>` blocks
- Card top row uses emoji icon on the left and two metadata badges on the right
- `lang-badge` uses mono font and blue tint background
- `status-badge` color comes from `statusColor` mapping in page frontmatter
- Title (`h3`) + concise technical description (`p`) + trailing text link (`View project →`)

### Color Scheme
- Background: `--bg: #0d0f14`, `--bg2: #13161e`, `--bg3: #1a1e28`
- Text: `--text: #e8eaf0`, `--text2: #8b91a8`
- Accent: `--accent: #00d4aa`, secondary accent `--accent2: #0099ff`
- Border: `--border: rgba(255,255,255,0.07)`
- Status tones: Complete `#00d4aa`, In progress `#f0a500`, Planned `#8b91a8`

### Typography
- Body and headings: `'Inter', sans-serif` (`--sans`)
- Technical/meta labels: `'JetBrains Mono', monospace` (`--mono`)
- Maintain existing type scale from nearby project pages and listing cards

## Content Guidelines
- Write in a professional but approachable educational tone
- Use GNSS-specific terminology correctly
- Include relevant technical details from the project summary
- Keep card descriptions under 150 characters
- Full project pages can be more detailed

## Testing
After making changes:
1. Ensure `npm run build` or `astro build` succeeds without errors
2. Check that no existing content was modified (only additions)
3. Verify the new card renders correctly in the project listing

## Existing Project Examples
Use the exact `projects` array object format from `src/pages/projects/index.astro`:

```js
{ href: '/projects/gps-l1-engine', icon: '📡', title: 'GPS L1 Only Position Engine', lang: 'C', status: 'Complete', desc: 'Single-frequency GPS positioning in portable C11 with EKF filtering, Hatch smoothing, SNR weighting, and RAIM innovation gating.' }
```

```js
{ href: '/projects/rtk-engine', icon: '📍', title: 'RTK Positioning Engine', lang: 'C++', status: 'Planned', desc: 'Carrier phase double-differencing with LAMBDA integer ambiguity resolution for centimetre-level positioning.' }
```
