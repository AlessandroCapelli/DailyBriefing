# DailyBriefing

Automated daily news briefing and financial trend analysis platform. Aggregates 20+ RSS sources, produces editorial analysis with full article deep-dives, identifies market trends, and renders everything as an interactive static site on GitHub Pages.

## Live

- **[Home](https://AlessandroCapelli.github.io/DailyBriefing/)** - Timeline of all reports
- **[Daily Briefing](https://AlessandroCapelli.github.io/DailyBriefing/daily.html)** - Today's news analysis
- **[Stock Trends](https://AlessandroCapelli.github.io/DailyBriefing/stocks.html)** - Financial trend report
- **[Dashboard](https://AlessandroCapelli.github.io/DailyBriefing/dashboard.html)** - Aggregate statistics

## How it works

```
RSS Feeds (20+)
     |
     v
 Fetch & Cache          Standalone scripts handle all network I/O
     |                  (parallel fetching, retries, encoding, link extraction)
     v
 Editorial Analysis     AI agent categorizes, summarizes, tags financial relevance,
     |                  detects tickers/entities, follows interesting source links
     v
 Daily JSON             data/daily-DD-MM-YYYY.json
     |
     v
 Trend Analysis         Reads last 7 daily briefings, identifies macro trends,
     |                  fetches real market data (Yahoo Finance, 5 time periods)
     v
 Stock JSON             data/stocks-DD-MM-YYYY.json + charts data
     |
     v
 GitHub Pages           Static HTML templates render JSON client-side
```

The system separates **data acquisition** (deterministic, retriable scripts) from **editorial intelligence** (AI analysis), making the pipeline resilient to network failures and optimized for quality.

## Features

### Content
- 20+ RSS feeds aggregated daily (configurable)
- Full article deep-dive with content extraction and link following
- Editorial summaries (15+ lines per category, based on actual article content)
- Dynamic categories - adapts to the day's news themes
- Financial impact detection and ALERT badges
- Ticker and entity recognition mapped to Yahoo Finance symbols
- Trend evolution tracking across days (new, continuing, accelerating, reversing)
- Sentiment analysis per article and per trend

### Financial Analysis
- Real market data from Yahoo Finance (price, volume, sector)
- 5 chart periods: 5 days, 1 month, 6 months, 1 year, 5 years
- Ticker comparison mode (up to 5 tickers, normalized to % change)
- Key metrics per trend with verified data points
- Cross-referencing between news events and market movements

### Interface
- Dark-mode responsive design with smooth animations
- Interactive Chart.js charts with crosshair tooltips
- Category, sentiment, and search filters with permalink support
- Cross-report navigation (Daily <-> Stocks) with keyboard shortcuts
- JSON and CSV export from any page
- Print/PDF optimized layout

### Technical
- Progressive Web App (installable, offline-capable via service worker)
- Content Security Policy headers on all pages
- XSS protection via HTML escaping on all user-generated content
- JSON-only data pipeline (no server-side rendering)
- Lazy-loaded chart data (~1MB loaded only when needed)
- Skeleton loading placeholders
- Prefetching of adjacent reports for instant navigation
- Reading progress bar
- Text-to-speech for summaries (Italian voice)

## Architecture

```
DailyBriefing/
├── index.html          Landing page with timeline and search
├── daily.html          Daily briefing template
├── stocks.html         Stock trend report template
├── dashboard.html      Aggregate stats, charts, export
├── nav.js              Global navigation bar
├── shared.js           PWA, TTS, animations, keyboard shortcuts, security
├── chart.min.js        Chart.js v4.5 (local, no CDN dependency)
├── sw.js               Service worker for offline support
├── manifest.json       PWA manifest
└── data/
    ├── reports.json    Index of available report dates
    ├── daily-*.json    Daily briefing data (one per day)
    ├── stocks-*.json   Stock trend data (main + lazy-loaded charts)
    └── cache/          Pre-fetched raw data (not committed)
```

All pages are static HTML templates that load JSON data via `fetch()` and render client-side. No backend, no database, no build step. Hosted entirely on GitHub Pages.

## Data Format

### Daily Briefing (`daily-DD-MM-YYYY.json`)
```
meta:        date, time, category/article/source counts
categories:  [{id, name, emoji, summary, evolution, articles: [{
               title, url, source, financial, sentiment, impact,
               extract: {text, dataPoints, entities, tickers}
             }]}]
```

### Stock Report (`stocks-DD-MM-YYYY.json`)
```
meta:    title, dates analyzed, trend/ticker/article counts
trends:  [{title, category, sentiment, narrative, metrics, tickers, sources}]
tickers: {SYMBOL: {name, sector, price, change_pct, avg_volume}}
```

Chart history data is split into a separate `-charts.json` file for lazy loading.

## Security

- `JSON.parse()` for all data loading (no eval/Function constructor)
- `escapeHtml()` on all externally-sourced content rendered via innerHTML
- URL validation (only `https://` allowed in href attributes)
- Content Security Policy: `script-src 'self'`, `frame-ancestors 'none'`
- Content sanitization: HTML stripping, zero-width character removal, `javascript:` URI blocking
- Prompt injection defense in AI agent pipeline

## License

MIT
