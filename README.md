# DailyBriefing

Automated daily news briefing and financial trend analysis pipeline.

## Architecture

```
DailyBriefing/
├── index.html          Landing page with timeline and deep search
├── daily.html          Template for all Daily reports
├── stocks.html         Template for all Stocks reports
├── dashboard.html      Aggregate stats, top tickers, sentiment, export
├── chart.min.js        Chart.js (shared, cached by browser)
├── nav.js              Global navigation bar (responsive)
├── shared.js           PWA, animations, keyboard shortcuts, scroll-to-top
├── sw.js               Service worker (offline cache)
├── manifest.json       PWA manifest (installable as app)
├── favicon.svg         App icon
└── data/
    ├── reports.json    Manifest of available dates
    ├── daily-*.json    Daily briefing data
    └── stocks-*.json   Stock trend data
```

Dynamic single-page app: one HTML template per report type, data loaded via `fetch()` from JSON files. Runs entirely on GitHub Pages. Installable as PWA on mobile.

## Pipeline

```
20 RSS feeds ──> Daily News Agent ──> data/daily-GG-MM-AAAA.json
                                           |
                                           v
                                     Stock Trend Analyzer ──> data/stocks-GG-MM-AAAA.json
                                           |
                                           v
                                     GitHub Pages renders via daily.html / stocks.html
```

**Daily News** fetches RSS feeds, deep-dives every article (full content extraction), detects stock tickers and entities, assesses financial impact, categorizes by theme, and produces a JSON data file with editorial summaries.

**Stock Trend Analyzer** reads the Daily JSON files, reuses pre-extracted article data (zero duplicate fetching), identifies macro financial trends, retrieves real market data from Yahoo Finance (5 time periods), and produces a JSON data file with trend analysis and chart data.

## Features

- Dark-mode responsive design with page animations
- Progressive Web App (installable, offline-capable)
- Interactive Chart.js charts with time-range switching (5D, 1M, 6M, 1Y, 5Y)
- Ticker comparison mode (up to 5 tickers normalized to % change)
- Deep search across all reports (article titles, trends, tickers, narratives)
- Category, sentiment, and financial filters
- Financial impact alerting (ALERT badges)
- Trend evolution tracking (new, continuing, accelerating, reversing)
- Dashboard with aggregate stats, top tickers, top sources, sentiment breakdown
- JSON and CSV export from any page
- Cross-report navigation (Daily <-> Stocks) with date prev/next
- Keyboard shortcuts (arrows: prev/next, H: home)
- Scroll-to-top button
- Skeleton loading placeholders
- "Nuovo" badge on latest reports

## View online

- [Home](https://AlessandroCapelli.github.io/DailyBriefing/)
- [Dashboard](https://AlessandroCapelli.github.io/DailyBriefing/dashboard.html)
- [Daily Briefing](https://AlessandroCapelli.github.io/DailyBriefing/daily.html?d=21-03-2026)
- [Stock Trend Report](https://AlessandroCapelli.github.io/DailyBriefing/stocks.html?d=21-03-2026)
