# Unlock Her Tech

<div align="center">
  <img src="public/logo.png" alt="Unlock Her Tech Logo" width="120" />
  <p><strong>Conversations That Inspire. Skills That Empower.</strong></p>
  <p>An inclusive platform, tech community, and podcast empowering women, non-binary people, and allies in technology.</p>
</div>

---

## Table of Contents

- [Overview & Key Features](#overview--key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Content Management & Sanity Studio](#content-management--sanity-studio)
- [Job Board Curation & ATS Sync](#job-board-curation--ats-sync)
- [Environment Variables & Feature Flags](#environment-variables--feature-flags)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Project Structure](#project-structure)
- [Privacy & Security](#privacy--security)
- [License](#license)

---

## Overview & Key Features

Unlock Her Tech is a production-grade web application offering:

1. **Podcast Hub & Interactive Audio Player**:
   - Live RSS feed integration (Anchor.fm / Spotify).
   - Global persistent audio player context with custom waveform visualizer and background playback.
2. **She Leads Tech Practice Sessions**:
   - Fortnightly live algorithmic problem-solving and LeetCode workshops.
   - Real-time countdown timer, curriculum topics spotlight, and 1-click Google Calendar integration.
3. **Inclusive Tech Job Board**:
   - Vetted listings with mandatory salary transparency and verified workplace flexibility.
   - Automated ATS ingestion (Greenhouse, Ashby), UTM link attribution, and bookmarking.
4. **Career Readiness Assessment & Action Plan**:
   - Interactive 16-factor self-assessment measuring Mindset, Transferable Skills, Technical Literacy, and Networking Strategy.
   - Dynamic 2-page personalized PDF Action Plan generator powered by `jspdf`.
   - Automated ecosystem resource matching tailored to individual growth areas.
5. **Downloadable Career Playbooks**:
   - Free curated PDF frameworks for career switchers with lead-magnet capture forms.
6. **Embedded Sanity Studio**:
   - Direct in-app content management for blog posts, episodes, events, and job requisitions at `/admin`.
7. **Social Bio & Linktree Hub**:
   - Custom branded link-in-bio page with video spotlight and social links (`/links`, `/bio`, `/linktree`).
8. **Trust & Privacy Suite**:
   - Fully compliant with GDPR and UK Data Protection Act 2018.
   - Granular cookie consent management and detailed privacy policies.

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Project References)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Bundler & Tooling:** [Vite](https://vite.dev/) (`@vitejs/plugin-react`, `@tailwindcss/vite`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & `@tailwindcss/typography`
- **Headless CMS:** [Sanity Studio](https://www.sanity.io/) (`sanity`, `@sanity/client`, `@portabletext/react`)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (Heroicons 2, Simple Icons, Font Awesome 6)
- **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
- **Linting & Formatting:** [ESLint](https://eslint.org/) & [typescript-eslint](https://typescript-eslint.io/)
- **Deployment & Hosting:** [Netlify](https://www.netlify.com/)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `22.13.1` or higher recommended)
- npm (bundled with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/unlockhertech/unlockhertech-fe.git
   cd unlockhertech-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run typecheck` | Runs project-wide TypeScript compilation check (`tsc -b`). |
| `npm run lint` | Runs ESLint to check for code quality and style standards. |
| `npm test` | Runs the test suite via Vitest (`vitest run`). |
| `npm run test:watch` | Runs Vitest in interactive watch mode. |
| `npm run build` | Compiles the production bundle and automatically generates `sitemap.xml`. |
| `npm run sitemap` | Fetches live routes and generates canonical `sitemap.xml` in `public/` and `dist/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run jobs:curate` | Runs a dry-run evaluation of job listings against inclusivity standards. |
| `npm run jobs:export` | Vets and exports active job listings to `data/vetted-jobs.json`. |
| `npm run sync:jobs` | Synchronizes live public ATS requisitions (Greenhouse / Ashby). |
| `npm run check:jobs` | Validates health, HTTP status, and expiration of job board listings. |

---

## Content Management & Sanity Studio

Sanity Studio is embedded directly within the application:

- **Local Admin Access**: Navigate to `http://localhost:5173/admin`
- **Production Admin Access**: Navigate to `https://unlockhertech.com/admin`

You can authenticate with your Sanity credentials to manage:
- **Blog Posts**: Markdown and PortableText editorial articles.
- **Events**: Luma / Eventbrite community sessions and panels.
- **Resources**: Playbooks, PDF guides, and metadata.
- **Jobs**: Inclusive job board postings with salary bands and culture badges.

---

## Job Board Curation & ATS Sync

Unlock Her Tech enforces 4 mandatory rules for all listed roles:
1. **Mandatory Salary Transparency** (Explicit minimum & maximum bands required).
2. **Workplace Model Clarity** (Explicit Remote Global, Regional, or Hybrid).
3. **Gender-Neutral Language** (Zero tolerance for exclusionary buzzwords like "ninja" or "rockstar").
4. **Inclusive Culture Signals** (Parental leave, flexible hours, learning stipends).

To sync or curate jobs:
```bash
# Evaluate and export vetted jobs
npm run jobs:export

# Sync live Greenhouse & Ashby endpoints
npm run sync:jobs
```

---

## Environment Variables & Feature Flags

Create a `.env` file from `.env.example`:

```ini
# Sanity CMS Configuration
VITE_SANITY_PROJECT_ID=pikesbla
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-03-01

# Feature Toggles (true/false)
VITE_ENABLE_BLOG=true
VITE_ENABLE_EVENTS=true
VITE_ENABLE_RESOURCES=true
VITE_ENABLE_ASSESSMENT=true
VITE_ENABLE_GET_INVOLVED=true
VITE_ENABLE_JOBS=true
```

---

## Testing & Quality Assurance

The codebase maintains strict quality gates across TypeScript, ESLint, and Vitest:

- **Run all unit & component tests:**
  ```bash
  npm test
  ```
- **Run tests in UI mode:**
  ```bash
  npx vitest --ui
  ```
- **Typecheck & Lint:**
  ```bash
  npm run typecheck
  npm run lint
  ```

---

## Project Structure

```text
unlockhertech-fe/
├── data/                    # Curated data fixtures (vetted-jobs.json)
├── public/                  # Static assets, logos, sitemap.xml, robots.txt
├── sanity/                  # Sanity Studio schemas and configuration
│   └── schemas/             # Document schemas (job, post, event, resource)
├── scripts/                 # Automation scripts (sitemap, ATS sync, job curation)
├── src/
│   ├── app/
│   │   ├── components/      # Shared UI components (Layout, MiniPlayer, Modals)
│   │   ├── context/         # React Contexts (AudioPlayerContext)
│   │   ├── hooks/           # Custom React hooks (useAudioPlayer, useMetaData, useRssFeed)
│   │   ├── pages/           # Modular page features
│   │   │   ├── about/       # About page sections & team spotlight
│   │   │   ├── assessment/  # Assessment wizard, scoring & PDF action plan
│   │   │   ├── blog/        # Blog index, filters & search
│   │   │   ├── blogPost/    # Blog post reader & PortableText renderer
│   │   │   ├── cookie/      # Cookie policy tables & consent info
│   │   │   ├── episodes/    # Podcast episode listings & filtering
│   │   │   ├── events/      # Community event cards & Luma checkout
│   │   │   ├── getInvolved/ # Mentor / speaker / collaborator application forms
│   │   │   ├── guidelines/  # Community guidelines & code of conduct
│   │   │   ├── home/        # Homepage hero, pillars, banner & waveform player
│   │   │   ├── jobs/        # Job board filter controls, detail modal & cards
│   │   │   ├── links/       # Linktree bio profile & video spotlight
│   │   │   ├── practices/   # She Leads Tech practice countdown & curriculum
│   │   │   ├── resources/   # Playbook downloads & modal triggers
│   │   │   └── team/        # Core team members & mission details
│   │   ├── routes.ts        # Declarative React Router v7 routes
│   │   ├── types.ts         # Global TypeScript interfaces & unions
│   │   └── utils/           # Analytics, Sanity client, ATS synchronization
│   ├── assets/              # Local image assets & fallbacks
│   ├── styles/              # Tailwind CSS, font imports & brand themes
│   ├── test/                # Unit, integration & component test suites
│   ├── main.tsx             # Application bootstrap & DOM mount
│   └── App.tsx              # Root component & RouterProvider
├── eslint.config.js         # ESLint configuration
├── index.html               # Vite HTML template with SEO & Structured Data
├── netlify.toml             # Netlify deployment & redirects configuration
├── package.json             # Project scripts & dependencies
├── tsconfig.json            # Composite TypeScript root configuration
└── vite.config.ts           # Vite bundler, plugins & Vitest setup
```

---

## Privacy & Security

- **GDPR & UK GDPR Compliant**: User data minimization, consent management, and zero third-party advertising tracking.
- **Sensitive Variables**: Never commit `.env` or Terraform state files to source control. Ensure secrets and tokens are injected via CI/CD environment secrets.

---

## License

&copy; 2026 Unlock Her Tech. All rights reserved.
