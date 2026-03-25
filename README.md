<p align="center">
  <h1 align="center"><b>FOMONO</b></h1>
  <p align="center"><i>Never miss what matters.</i></p>
  <p align="center">
    Real-time streaming dashboard for tech, AI, economics, and politics — powered by SSE, RSS, and the GitHub API.
  </p>
</p>

<p align="center">
  <a href="https://fomono.vercel.app"><strong>Live Demo</strong></a> · <a href="#getting-started">Get Started</a> · <a href="#architecture">Architecture</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/deploy-Vercel-black?style=flat-square&logo=vercel" />
</p>

<p align="center">
  <img src="./assets/demo.gif" alt="FOMONO Demo" width="800" />
</p>

---

## What is FOMONO?

FOMONO is a live-streaming news aggregator that pulls from **30+ sources** across three pillars:

| Feed | Sources | Update Interval |
|------|---------|----------------|
| **GitHub Trending** | Top repos by stars, AI/ML-specific trending, new projects | 5 min |
| **Social — Key Figures** | Sam Altman, Elon Musk, Jensen Huang, Dario Amodei, Geoffrey Hinton, Andrew Ng, Marc Andreessen, and 15+ more | 2 min |
| **Breaking News** | TechCrunch, Ars Technica, The Verge, Hacker News, Wired, CNBC, Reuters, BBC, AP News, and more | 60 sec |

Every card includes an **auto-translated Chinese snippet** for bilingual readers.

---

## Features

- **Real-time SSE streaming** — Three independent Server-Sent Event connections. No polling. No refresh. Content flows in live.
- **Unified tab navigation** — `All · GitHub · Social · Tech · AI · Economics · Politics` — one row, zero confusion.
- **23 influential figures tracked** — AI lab leaders, tech CEOs, researchers, investors, and political figures via Google News RSS.
- **Auto Chinese translation** — Every card gets a bilingual snippet powered by a server-side translation proxy with in-memory cache.
- **Dark-themed UI** — Purpose-built for focus. Slide-in animations, glow effects, color-coded categories.
- **Mobile-first responsive** — Single column on mobile, 2-col tablet, 3-col desktop. Scrollable tabs. Instant.
- **Zero dependencies beyond Next.js** — No UI library. No state management library. Just React 19 + Tailwind CSS v4.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│                                                         │
│  Dashboard.tsx ── 3x EventSource ──────────────────┐    │
│  ├─ GitHubCard.tsx                                  │    │
│  ├─ SocialCard.tsx     ┌──────────────────────┐    │    │
│  ├─ NewsCard.tsx       │  TranslatedSnippet   │    │    │
│  └─ CategoryTabs.tsx   │  (lazy fetch + cache) │    │    │
│                        └──────────┬───────────┘    │    │
└───────────────────────────────────┼────────────────┘    │
                                    │                      │
                    ┌───────────────▼───────────────┐      │
                    │        Next.js API Routes      │      │
                    │                                │      │
                    │  /api/github ──► GitHub API     │◄─ SSE
                    │  /api/social ──► Google News    │◄─ SSE
                    │  /api/news   ──► RSS Feeds      │◄─ SSE
                    │  /api/translate ► Google Trans.  │◄─ POST
                    └────────────────────────────────┘
```

Each API route runs an **independent SSE stream** with:
- Initial batch load (all items at once)
- Periodic polling for new items
- Heartbeat keep-alive (15s)
- Auto-reconnect on failure (5s backoff)

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Install & Run

```bash
git clone https://github.com/alibaba-flyai/fomono.git
cd fomono
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (Optional)

Create a `.env.local` file:

```env
# Optional: GitHub token for higher API rate limits (5000/hr vs 60/hr)
GITHUB_TOKEN=ghp_your_token_here
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or click the button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alibaba-flyai/fomono)

---

## Key Figures Tracked

<table>
<tr><td><b>AI Lab Leaders</b></td><td>Sam Altman · Dario Amodei · Demis Hassabis · Yann LeCun · Ilya Sutskever · Andrej Karpathy · Arthur Mensch</td></tr>
<tr><td><b>Tech CEOs</b></td><td>Elon Musk · Jensen Huang · Satya Nadella · Sundar Pichai · Mark Zuckerberg · Tim Cook · Andy Jassy · Lisa Su</td></tr>
<tr><td><b>Researchers</b></td><td>Geoffrey Hinton · Fei-Fei Li · Andrew Ng · Emad Mostaque</td></tr>
<tr><td><b>Investors</b></td><td>Marc Andreessen · Vinod Khosla</td></tr>
<tr><td><b>Politics</b></td><td>Donald Trump</td></tr>
<tr><td><b>Company Blogs</b></td><td>OpenAI · Anthropic · NVIDIA · Google AI · Microsoft AI · Meta AI</td></tr>
</table>

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Framework | Next.js 16 (App Router) | SSR + API routes + SSE in one package |
| Language | TypeScript 5 | Type safety across client and server |
| UI | React 19 + Tailwind CSS v4 | Zero-config styling, no component library overhead |
| Data | RSS via `rss-parser` + GitHub REST API | Free, no API keys required for basic usage |
| Streaming | Server-Sent Events (SSE) | Native browser support, lighter than WebSocket |
| Translation | Google Translate (free tier) | Server-side proxy with in-memory cache |
| Hosting | Vercel | Zero-config Next.js deployment |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, dark theme, fonts
│   ├── page.tsx                # Entry point, dynamic import
│   ├── globals.css             # CSS variables, animations
│   └── api/
│       ├── github/route.ts     # SSE: GitHub trending repos
│       ├── social/route.ts     # SSE: Key figures via Google News RSS
│       ├── news/route.ts       # SSE: Breaking news via RSS
│       └── translate/route.ts  # POST: Chinese translation proxy
└── components/
    ├── Dashboard.tsx           # Main client component, 3x SSE
    ├── CategoryTabs.tsx        # Unified tab navigation
    ├── GitHubCard.tsx          # Trending repo card
    ├── SocialCard.tsx          # Social/key figure card
    ├── NewsCard.tsx            # News article card
    ├── TranslatedSnippet.tsx   # Lazy Chinese translation
    └── utils.ts                # timeAgo helper
```

---

## Contributing

PRs welcome. Some ideas:

- [ ] Add more influential figures
- [ ] Dark/light theme toggle
- [ ] Push notifications for breaking news
- [ ] Sentiment analysis on news items
- [ ] Custom watchlist (pick your own figures/topics)
- [ ] Historical trending data visualization

---

## License

MIT

---

<p align="center">
  <sub>Built with caffeine and SSE. Ship fast, stay informed.</sub>
</p>
