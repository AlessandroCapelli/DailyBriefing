/**
 * DailyBriefing — Global navigation bar
 * Reads dates from data/reports.json. URLs: daily.html?d=GG-MM-AAAA / stocks.html?d=GG-MM-AAAA
 */
(function () {
	"use strict";

	var loc = location.pathname.split("/").pop() || "index.html";
	var isIndex = loc === "index.html" || loc === "" || loc === "/";
	var isDashboard = loc === "dashboard.html";

	// Detect page type from filename
	var pageType = null,
		pageDate = null,
		pageTicker = null;
	if (loc === "daily.html") pageType = "daily";
	else if (loc === "stocks.html") pageType = "stocks";
	else if (loc === "deep.html") pageType = "deep";
	// Also support old format Daily-XX-XX-XXXX.html
	var oldMatch = loc.match(/^(Daily|Stocks)-(\d{2}-\d{2}-\d{4})\.html$/i);
	if (oldMatch) {
		pageType = oldMatch[1].toLowerCase();
		pageDate = oldMatch[2];
	}

	// Read date / ticker from query param
	if (pageType) {
		var params = new URLSearchParams(location.search);
		if (!pageDate) pageDate = params.get("d");
		if (pageType === "deep") pageTicker = (params.get("t") || "").toUpperCase();
	}

	function parseDMY(d) {
		var p = d.split("-").map(Number);
		return new Date(p[2], p[1] - 1, p[0]);
	}
	function sortDates(arr) {
		return arr.slice().sort(function (a, b) {
			return parseDMY(a) - parseDMY(b);
		});
	}

	function getReports(cb) {
		// Try global REPORTS first
		if (typeof REPORTS !== "undefined") {
			cb(REPORTS);
			return;
		}
		// Fetch manifest
		fetch("data/reports.json")
			.then(function (r) {
				return r.json();
			})
			.then(cb)
			.catch(function () {
				cb({ daily: [], stocks: [], deep: [] });
			});
	}

	function buildBar(reports) {
		var css = document.createElement("style");
		css.textContent = [
			"#db-nav{position:fixed;top:0;left:0;right:0;z-index:9999;background:#0d0f15;border-bottom:1px solid #2d3148;font-family:system-ui,-apple-system,sans-serif}",
			"#db-nav .db-i{display:flex;align-items:center;gap:.6rem;padding:.5rem .9rem;max-width:1280px;margin:0 auto;min-height:40px}",
			"#db-nav a,#db-nav .db-btn{color:#94a3b8;text-decoration:none;font-size:.78rem;font-weight:500;transition:color .12s,background .12s;white-space:nowrap}",
			"#db-nav a:hover{color:#7c9ef8}",
			"#db-nav .db-a{color:#e2e8f0;font-weight:700}",
			"#db-nav .db-s{color:#2d3148;font-size:.65rem;user-select:none}",
			"#db-nav .db-sp{flex:1}",
			"#db-nav .db-dg{display:flex;align-items:center;gap:.15rem}",
			"#db-nav .db-dt{color:#e2e8f0;font-weight:700;font-size:.82rem;padding:0 .45rem}",
			"#db-nav .db-ar{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px;font-size:.9rem;color:#94a3b8;border:1px solid #2d3148;background:transparent;cursor:pointer;text-decoration:none;transition:all .12s}",
			"#db-nav .db-ar:hover{border-color:#7c9ef8;color:#7c9ef8;background:rgba(124,158,248,.06)}",
			"#db-nav .db-ar.off{opacity:.25;pointer-events:none}",
			"#db-nav .db-x{display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .7rem;border-radius:6px;background:rgba(124,158,248,.1);color:#7c9ef8;font-weight:600;font-size:.75rem;border:1px solid rgba(124,158,248,.2);transition:all .12s}",
			"#db-nav .db-x:hover{background:rgba(124,158,248,.2);border-color:#7c9ef8}",
			"@media(max-width:480px){",
			"  #db-nav .db-i{padding:.4rem .6rem;gap:.4rem;min-height:44px}",
			"  #db-nav .db-lbl{display:none}",
			"  #db-nav .db-ar{width:38px;height:38px;font-size:1.1rem;border-radius:8px}",
			"  #db-nav .db-dt{font-size:1rem;padding:0 .4rem}",
			"  #db-nav .db-x{padding:.4rem .65rem;font-size:.85rem;border-radius:8px}",
			"  #db-nav a,#db-nav .db-btn{font-size:.85rem}",
			"}",
		].join("\n");
		document.head.appendChild(css);

		var bar = document.createElement("div");
		bar.id = "db-nav";
		var inner = document.createElement("div");
		inner.className = "db-i";
		bar.appendChild(inner);
		document.body.style.paddingTop = "44px";

		function addEl(tag, cls, html, href) {
			var el = document.createElement(href ? "a" : tag);
			if (href) el.href = href;
			if (cls) el.className = cls;
			if (html) el.innerHTML = html;
			inner.appendChild(el);
			return el;
		}

		function makeUrl(type, date) {
			return type + ".html?d=" + date;
		}

		// Home
		addEl("a", isIndex ? "db-a" : "", "Home", "index.html");
		addEl("span", "db-s", "/");
		addEl("a", isDashboard ? "db-a" : "", "Dashboard", "dashboard.html");

		// Deep mode: breadcrumb Home / Deep / <TICKER> with prev/next between tickers
		if (pageType === "deep") {
			addEl("span", "db-s", "/");
			addEl("span", "db-a", "Deep");

			var deepList = reports.deep || [];
			if (deepList.length > 0 && pageTicker) {
				// Unique tickers, latest date per ticker, sorted alphabetically
				var latestByTicker = {};
				deepList.forEach(function (e) {
					if (
						!latestByTicker[e.ticker] ||
						parseDMY(e.date) > parseDMY(latestByTicker[e.ticker].date)
					) {
						latestByTicker[e.ticker] = e;
					}
				});
				var uniqueTickers = Object.keys(latestByTicker).sort();
				var idxT = uniqueTickers.indexOf(pageTicker);

				addEl("span", "db-s", "/");
				addEl("span", "db-a", pageTicker);
				addEl("span", "db-sp");

				// Ticker navigation arrows
				var dgT = document.createElement("div");
				dgT.className = "db-dg";

				var prevTicker = idxT > 0 ? uniqueTickers[idxT - 1] : null;
				var prevElT = document.createElement(prevTicker ? "a" : "span");
				prevElT.className = "db-ar" + (prevTicker ? "" : " off");
				prevElT.innerHTML = "\u2190";
				if (prevTicker)
					prevElT.href =
						"deep.html?t=" +
						prevTicker +
						"&d=" +
						latestByTicker[prevTicker].date;
				dgT.appendChild(prevElT);

				var curT = document.createElement("span");
				curT.className = "db-dt";
				curT.textContent = pageTicker;
				dgT.appendChild(curT);

				var nextTicker =
					idxT >= 0 && idxT < uniqueTickers.length - 1
						? uniqueTickers[idxT + 1]
						: null;
				var nextElT = document.createElement(nextTicker ? "a" : "span");
				nextElT.className = "db-ar" + (nextTicker ? "" : " off");
				nextElT.innerHTML = "\u2192";
				if (nextTicker)
					nextElT.href =
						"deep.html?t=" +
						nextTicker +
						"&d=" +
						latestByTicker[nextTicker].date;
				dgT.appendChild(nextElT);

				inner.appendChild(dgT);
			}

			document.body.insertBefore(bar, document.body.firstChild);
			return;
		}

		if (pageType && pageDate) {
			var dates = sortDates(reports[pageType] || []);
			var idx = dates.indexOf(pageDate);
			var shortType = pageType === "daily" ? "Daily" : "Stocks";

			addEl("span", "db-s", "/");
			addEl("span", "db-a", shortType);

			// Cross-type link
			var crossType = pageType === "daily" ? "stocks" : "daily";
			var crossDates = reports[crossType] || [];
			if (crossDates.indexOf(pageDate) >= 0) {
				addEl("span", "db-s", "/");
				if (pageType === "daily") {
					addEl(
						"a",
						"db-x",
						"\u{1F4C8} <span class='db-lbl'>Analisi</span>",
						makeUrl("stocks", pageDate),
					);
				} else {
					addEl(
						"a",
						"db-x",
						"\u{1F4F0} <span class='db-lbl'>Briefing</span>",
						makeUrl("daily", pageDate),
					);
				}
			}

			addEl("span", "db-sp");

			// Date navigation
			var dg = document.createElement("div");
			dg.className = "db-dg";

			var prevDate = idx > 0 ? dates[idx - 1] : null;
			var prevEl = document.createElement(prevDate ? "a" : "span");
			prevEl.className = "db-ar" + (prevDate ? "" : " off");
			prevEl.innerHTML = "\u2190";
			if (prevDate) prevEl.href = makeUrl(pageType, prevDate);
			dg.appendChild(prevEl);

			var cur = document.createElement("span");
			cur.className = "db-dt";
			cur.textContent = pageDate.split("-").slice(0, 2).join("/");
			dg.appendChild(cur);

			var nextDate =
				idx >= 0 && idx < dates.length - 1 ? dates[idx + 1] : null;
			var nextEl = document.createElement(nextDate ? "a" : "span");
			nextEl.className = "db-ar" + (nextDate ? "" : " off");
			nextEl.innerHTML = "\u2192";
			if (nextDate) nextEl.href = makeUrl(pageType, nextDate);
			dg.appendChild(nextEl);

			inner.appendChild(dg);
		}

		document.body.insertBefore(bar, document.body.firstChild);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			getReports(buildBar);
		});
	} else {
		getReports(buildBar);
	}
})();
