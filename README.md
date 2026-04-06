# GNSSMetrics.com

A vendor-neutral GNSS educational and monitoring platform built with [Astro](https://astro.build) and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

**Live site:** [gnssmetrics.com](https://gnssmetrics.com)

---

## What is GNSSMetrics?

GNSSMetrics is a free resource for GNSS engineers, researchers and university students. It combines real-time monitoring dashboards, structured educational content, and a daily AI-curated news digest — all in one place, with no ads and no paywalls.

---

## Features

### 📡 Live Dashboards
Real-time GNSS environment monitoring using public data sources:

- **GNSS Environment Watch** — Kp index, X-ray flux and ionospheric scintillation conditions (NOAA SWPC)
- **GNSS Interference** — Global RFI/jamming map (GPSJam) and maritime interference (GPSwise)
- **Space Weather** — Solar activity, geomagnetic storm levels, NOAA G/S/R scale reference
- **Constellation Status** — Coverage maps and health data via galmon.eu

### 📚 Learn Section
Structured educational content written for university students and early-career engineers. Vendor-neutral. Includes worked examples, derivations, SVG diagrams and primary source references.

| Subsection       | Articles | Topics                                                                                                |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| **Fundamentals** | 5        | How GNSS works, signals & frequencies, error sources, coordinate systems, DOP                         |
| **Positioning**  | 5        | Standalone GNSS, DGNSS/SBAS, RTK, PPP, PPP-RTK                                                        |
| **Protocols**    | 5        | NMEA 0183, RINEX, RTCM, NTRIP, binary protocols (UBX, SBF, BINEX)                                     |
| **Mathematics**  | 5        | Least squares, Kalman filter, integer ambiguity resolution, ionospheric models, coordinate transforms |
| **Timing**       | 5        | GNSS as timing source, time scales, timing applications, clock error, PPS output                      |
| **Glossary**     | 1        | 100+ GNSS terms                                                                                       |

### 🛠️ Tools
- **GNSS Analyzer v3.0** — Browser-based signal analysis tool

### 📰 AI News Pipeline
Daily GNSS industry news digest powered by Claude AI:
- Curates the top 5 stories from 17 RSS feeds every day at 06:00 UTC
- Publishes to the site automatically via GitHub Actions
- Weekly newsletter digest sent every Sunday via Buttondown

---

## Tech Stack

| Layer      | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| Framework  | [Astro](https://astro.build) v6                              |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) (free tier) |
| Domain     | GoDaddy → Cloudflare DNS                                     |
| Newsletter | [Buttondown](https://buttondown.com/gnssmetrics)             |
| AI         | [Anthropic Claude](https://anthropic.com) (news curation)    |
| CI/CD      | GitHub Actions                                               |

---

## Project Structure

```
gnssmetrics-website/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # Site-wide layout
│   ├── content.config.ts          # Content collection config (Astro v5)
│   ├── pages/
│   │   ├── index.astro            # Home page
│   │   ├── about.astro
│   │   ├── tools/
│   │   │   ├── index.astro
│   │   │   └── gnss-analyzer.astro
│   │   ├── dashboards/
│   │   │   ├── index.astro
│   │   │   ├── environment.astro
│   │   │   ├── interference.astro
│   │   │   ├── space-weather.astro
│   │   │   └── constellation.astro
│   │   ├── learn/
│   │   │   ├── index.astro
│   │   │   ├── fundamentals/      # 5 articles
│   │   │   ├── positioning/       # 5 articles
│   │   │   ├── protocols/         # 5 articles
│   │   │   ├── mathematics/       # 5 articles
│   │   │   ├── timing/            # 5 articles
│   │   │   └── glossary/          # 1 page
│   │   ├── news/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   ├── projects/
│   │   └── blog/
│   └── content/
│       └── news/                  # AI-generated .md files
├── scripts/
│   ├── curate-news.mjs            # Daily AI news pipeline
│   └── send-weekly-newsletter.mjs # Weekly newsletter automation
├── public/
│   └── gnss-analyzer.html         # GNSS Analyzer v3.0
├── .github/
│   └── workflows/
│       ├── news-curation.yml      # Runs daily at 06:00 UTC
│       └── weekly-newsletter.yml  # Runs Sundays at 08:00 UTC
└── news-cache.json                # Prevents duplicate news runs
```

---

## Local Development

**Requirements:** Node.js v22+

```bash
# Clone
git clone https://github.com/adedolapoadegboye/gnssmetrics-website.git
cd gnssmetrics-website

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:4321
```

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Automated Workflows

### Daily news curation
Runs at **06:00 UTC** every day via GitHub Actions.

Requires the following repository secret:
- `ANTHROPIC_API_KEY` — Claude API key for news summarisation

### Weekly newsletter
Runs at **08:00 UTC** every Sunday via GitHub Actions.

Requires:
- `ANTHROPIC_API_KEY` — Claude API key for digest generation
- `BUTTONDOWN_API_KEY` — Buttondown API key for sending

Both workflows can also be triggered manually from the GitHub Actions tab.

---

## Deployment

The site deploys automatically to Cloudflare Pages on every push to `main`.

Branch workflow:
```bash
git checkout -b feat/my-feature
# make changes
git push origin feat/my-feature
# merge to main → auto-deploys
```

If the news bot has committed while you were working locally:
```bash
git pull --rebase
git push
```

---

## Data Sources

| Dashboard              | Source                                 | Notes                                 |
| ---------------------- | -------------------------------------- | ------------------------------------- |
| Kp index               | [NOAA SWPC](https://www.swpc.noaa.gov) | `noaa-planetary-k-index.json`         |
| X-ray flux             | [NOAA SWPC](https://www.swpc.noaa.gov) | `xrays-7-day.json`                    |
| Interference map       | [GPSJam](https://gpsjam.org)           | Embedded iframe                       |
| Maritime interference  | [GPSwise](https://gpsjam.org)          | Embedded iframe                       |
| Constellation coverage | [galmon.eu](https://galmon.eu)         | Embedded iframe (GPL-3.0, attributed) |

---

## Newsletter

Subscribe at [gnssmetrics.com](https://gnssmetrics.com) or directly at [buttondown.com/gnssmetrics](https://buttondown.com/gnssmetrics).

Weekly digest of the top GNSS news, curated by AI and sent every Sunday.

---

## Contributing

This is a personal project but issues and suggestions are welcome. Open an issue if you spot a technical error in the educational content — accuracy matters here.

---

## Licence

Site content and code: MIT
galmon.eu embeds: [GPL-3.0](https://github.com/berthubert/galmon/blob/master/LICENSE) (linking/embedding with attribution permitted)

---

*Built by [@adedolapoadegboye](https://github.com/adedolapoadegboye)*