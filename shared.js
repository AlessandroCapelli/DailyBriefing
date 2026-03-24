/**
 * DailyBriefing — Shared utilities v1.0
 * Include after nav.js on every page.
 */
var DB_VERSION = "1.0";
(function () {
	"use strict";

	// ── PWA Registration ──
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("sw.js").catch(function () {});
	}

	// ── Text-to-Speech (Italian) ──
	(function () {
		if (!("speechSynthesis" in window)) return;

		var style = document.createElement("style");
		style.textContent = [
			".tts-btn{display:inline-flex;align-items:center;gap:.3rem;padding:.25rem .6rem;border-radius:6px;border:1px solid #2d3148;background:transparent;color:#94a3b8;font-size:.68rem;font-weight:600;cursor:pointer;transition:all .15s;margin-left:.5rem;vertical-align:middle}",
			".tts-btn:hover{border-color:#7c9ef8;color:#7c9ef8}",
			".tts-btn.playing{border-color:#4ade80;color:#4ade80}",
			".tts-btn.playing:hover{border-color:#f87171;color:#f87171}",
		].join("\n");
		document.head.appendChild(style);

		var currentBtn = null;
		var italianVoice = null;

		// Voices load async — wait for them
		var voicesReady = false;
		function findItalianVoice() {
			var voices = speechSynthesis.getVoices();
			if (!voices.length) return;
			voicesReady = true;
			// Prefer: Google italiano > Microsoft italiano > any it-IT > any it
			italianVoice =
				voices.find(function (v) {
					return v.lang === "it-IT" && v.name.indexOf("Google") >= 0;
				}) ||
				voices.find(function (v) {
					return v.lang === "it-IT" && v.name.indexOf("Microsoft") >= 0;
				}) ||
				voices.find(function (v) {
					return v.lang === "it-IT";
				}) ||
				voices.find(function (v) {
					return v.lang.startsWith("it");
				}) ||
				null;
			if (italianVoice) {
				// Show any hidden buttons
				document.querySelectorAll(".tts-btn").forEach(function (b) {
					b.style.display = "";
				});
			} else {
				document.querySelectorAll(".tts-btn").forEach(function (b) {
					b.style.display = "none";
				});
			}
		}
		findItalianVoice();
		if (speechSynthesis.onvoiceschanged !== undefined) {
			speechSynthesis.onvoiceschanged = function () {
				findItalianVoice();
				addButtons();
			};
		}
		// Force voice load on some browsers
		setTimeout(findItalianVoice, 500);
		setTimeout(findItalianVoice, 2000);

		var stopRequested = false;

		function toggleTTS(btn, text) {
			// Stop if currently playing
			if (speechSynthesis.speaking || currentBtn) {
				stopRequested = true;
				speechSynthesis.cancel();
				if (currentBtn) {
					currentBtn.classList.remove("playing");
					currentBtn.innerHTML = "&#x1F50A; Ascolta";
				}
				var wasSame = currentBtn === btn;
				currentBtn = null;
				if (wasSame) return; // Toggle off
			}

			if (!italianVoice) findItalianVoice();
			if (!italianVoice) return;

			stopRequested = false;
			var sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
			var idx = 0;
			btn.classList.add("playing");
			btn.innerHTML = "&#x23F9; Stop";
			currentBtn = btn;

			function speakNext() {
				if (stopRequested || idx >= sentences.length) {
					btn.classList.remove("playing");
					btn.innerHTML = "&#x1F50A; Ascolta";
					currentBtn = null;
					stopRequested = false;
					return;
				}
				var u = new SpeechSynthesisUtterance(sentences[idx].trim());
				u.lang = "it-IT";
				u.rate = 0.95;
				u.pitch = 1.0;
				if (italianVoice) u.voice = italianVoice;
				u.onend = function () {
					idx++;
					if (!stopRequested) speakNext();
				};
				u.onerror = function () {
					idx++;
					if (!stopRequested) speakNext();
				};
				speechSynthesis.speak(u);
			}
			speakNext();
		}

		// Add TTS buttons to summaries and narratives
		function addButtons() {
			if (!italianVoice && voicesReady) return; // No Italian voice available
			var targets = document.querySelectorAll(".summary:not([data-tts]), .narr:not([data-tts])");
			targets.forEach(function (el) {
				el.setAttribute("data-tts", "1");
				var text = el.textContent.trim();
				if (text.length < 30) return;
				var btn = document.createElement("button");
				btn.className = "tts-btn";
				if (!italianVoice) btn.style.display = "none"; // Hide until voice loads
				btn.innerHTML = "&#x1F50A; Ascolta";
				btn.addEventListener("click", function (e) {
					e.stopPropagation();
					toggleTTS(btn, text);
				});
				el.appendChild(btn);
			});
		}

		var obs = new MutationObserver(addButtons);
		obs.observe(document.body, { childList: true, subtree: true });
		setTimeout(addButtons, 1500);
	})();

	// ── Expand/Collapse cards ──
	(function () {
		function addCollapseButtons() {
			document.querySelectorAll(".card:not([data-collapse])").forEach(function (card) {
				var content = card.querySelector(".collapsible");
				if (!content) return;
				card.setAttribute("data-collapse", "1");
				var hdr = card.querySelector(".card-hdr, .ch");
				if (!hdr) return;
				var btn = document.createElement("button");
				btn.className = "collapse-btn";
				btn.innerHTML = "&#9650;";
				btn.title = "Comprimi";
				btn.addEventListener("click", function (e) {
					e.stopPropagation();
					var collapsed = content.classList.toggle("collapsed");
					btn.innerHTML = collapsed ? "&#9660;" : "&#9650;";
					btn.title = collapsed ? "Espandi" : "Comprimi";
				});
				hdr.appendChild(btn);
				// Set max-height for animation
				content.style.maxHeight = content.scrollHeight + "px";
			});
		}
		var obs = new MutationObserver(addCollapseButtons);
		obs.observe(document.body, { childList: true, subtree: true });
		setTimeout(addCollapseButtons, 2000);
	})();

	// ── Focus search with / key ──
	document.addEventListener("keydown", function (e) {
		if (e.key === "/" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
			e.preventDefault();
			var input = document.getElementById("q") || document.getElementById("idx-q");
			if (input) input.focus();
		}
	});

	// ── Open Graph meta tags (dynamic) ──
	(function () {
		var params = new URLSearchParams(location.search);
		var date = params.get("d");
		var loc = location.pathname.split("/").pop() || "";
		var title = "DailyBriefing";
		var desc = "Briefing quotidiani e analisi finanziarie";
		if (loc === "daily.html" && date) {
			title = "Daily Briefing " + date;
			desc = "Briefing quotidiano del " + date + " — notizie, finanza, tech, geopolitica";
		} else if (loc === "stocks.html" && date) {
			title = "Stock Trend Report " + date;
			desc = "Analisi trend finanziari del " + date + " — ticker, grafici, dati di mercato";
		} else if (loc === "dashboard.html") {
			title = "Dashboard | DailyBriefing";
			desc = "Statistiche aggregate, top ticker, sentiment, fonti";
		}
		var metas = [
			["og:title", title],
			["og:description", desc],
			["og:type", "website"],
			["og:url", location.href],
			["og:site_name", "DailyBriefing"],
			["twitter:card", "summary"],
			["twitter:title", title],
			["twitter:description", desc],
		];
		metas.forEach(function (m) {
			var el = document.createElement("meta");
			el.setAttribute("property", m[0]);
			el.setAttribute("content", m[1]);
			document.head.appendChild(el);
		});
	})();

	// ── Canonical URL ──
	(function () {
		var link = document.createElement("link");
		link.rel = "canonical";
		link.href = location.href.split("?")[0] + (location.search || "");
		document.head.appendChild(link);
	})();

	// ── Unified footer (GitHub + version) ──
	(function () {
		var footer = document.querySelector("footer");
		if (!footer) {
			footer = document.createElement("footer");
			footer.style.cssText =
				"margin-top:3rem;padding:1.5rem 1rem;border-top:1px solid #2d3148;text-align:center;font-size:.7rem;color:#2d3148";
			var wrap = document.querySelector(".wrap") || document.querySelector(".content") || document.body;
			wrap.appendChild(footer);
		}
		footer.style.cssText =
			"position:fixed;bottom:0;left:0;right:0;text-align:center;padding:.5rem 1rem;font-size:.7rem;background:#0f1117;z-index:50;border-top:1px solid #2d3148";
		document.body.style.paddingBottom = "2.5rem";
		footer.innerHTML =
			'<a href="https://github.com/AlessandroCapelli/DailyBriefing" target="_blank" rel="noopener noreferrer" style="color:#94a3b8;text-decoration:none;font-size:.7rem">GitHub</a> <span style="color:#2d3148;font-size:.55rem;margin-left:.5rem">v' +
			DB_VERSION +
			"</span>";
	})();

	// ── Filter reset button ──
	(function () {
		var style = document.createElement("style");
		style.textContent =
			".filter-reset{padding:.2rem .5rem;border-radius:5px;border:1px solid #f87171;background:transparent;color:#f87171;font-size:.65rem;font-weight:600;cursor:pointer;transition:all .12s;margin-left:.4rem}.filter-reset:hover{background:rgba(248,113,113,.1)}";
		document.head.appendChild(style);

		function checkFilters() {
			var active = 0;
			document
				.querySelectorAll("#cat-filters .fb.on, #sent-filters .fb.on, #date-filters .fb.on")
				.forEach(function (b) {
					if (b.dataset.v !== "all") active++;
				});
			var finCb = document.getElementById("fin-only");
			var hiCb = document.getElementById("hi-only");
			if (finCb && finCb.checked) active++;
			if (hiCb && hiCb.checked) active++;
			var qInput = document.getElementById("q");
			if (qInput && qInput.value.trim()) active++;

			var existing = document.querySelector(".filter-reset");
			if (active > 0 && !existing) {
				var counter = document.getElementById("counter");
				if (counter) {
					var btn = document.createElement("button");
					btn.className = "filter-reset";
					btn.textContent = "Reset";
					btn.addEventListener("click", function () {
						// Reset all filters
						document.querySelectorAll("#cat-filters .fb, #sent-filters .fb, #date-filters .fb").forEach(function (b) {
							b.classList.toggle("on", b.dataset.v === "all");
						});
						if (finCb) finCb.checked = false;
						if (hiCb) hiCb.checked = false;
						if (qInput) qInput.value = "";
						// Also reset index search
						var idxQ = document.getElementById("idx-q");
						if (idxQ) idxQ.value = "";
						if (typeof window.applyFilters === "function") window.applyFilters();
						// Update permalink
						history.replaceState(
							null,
							"",
							location.pathname +
								(new URLSearchParams(location.search).get("d")
									? "?d=" + new URLSearchParams(location.search).get("d")
									: ""),
						);
						btn.remove();
					});
					counter.parentElement.appendChild(btn);
				}
			} else if (active === 0 && existing) {
				existing.remove();
			}
		}

		// Monitor filter changes
		var obs = new MutationObserver(checkFilters);
		setTimeout(function () {
			var ctrl = document.querySelector(".ctrl-inner");
			if (ctrl) {
				obs.observe(ctrl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
			}
			document.querySelectorAll("#fin-only,#hi-only,#q,#idx-q").forEach(function (el) {
				el.addEventListener("input", function () {
					setTimeout(checkFilters, 100);
				});
				el.addEventListener("change", function () {
					setTimeout(checkFilters, 100);
				});
			});
			// Also listen for clicks on filter button groups
			document.querySelectorAll("#cat-filters,#sent-filters,#date-filters").forEach(function (el) {
				el.addEventListener("click", function () {
					setTimeout(checkFilters, 100);
				});
			});
		}, 2000);
	})();

	// ── Last update in index hero ──
	(function () {
		var loc = location.pathname.split("/").pop() || "";
		if (loc !== "index.html" && loc !== "" && loc !== "/") return;
		fetch("data/reports.json")
			.then(function (r) {
				return r.json();
			})
			.then(function (rp) {
				var allDates = (rp.daily || []).concat(rp.stocks || []);
				if (!allDates.length) return;
				allDates.sort(function (a, b) {
					var pa = a.split("-").map(Number),
						pb = b.split("-").map(Number);
					return new Date(pb[2], pb[1] - 1, pb[0]) - new Date(pa[2], pa[1] - 1, pa[0]);
				});
				var latest = allDates[0];
				var heroSub = document.querySelector(".hero-sub");
				if (heroSub) {
					var badge = document.createElement("div");
					badge.style.cssText = "font-size:.72rem;color:#4a5268;margin-top:.5rem";
					badge.textContent = "Ultimo aggiornamento: " + latest;
					heroSub.after(badge);
				}
			})
			.catch(function () {});
	})();

	// ── Copy link button ──
	(function () {
		var btn = document.getElementById("copy-link");
		if (!btn) return;
		btn.addEventListener("click", function () {
			navigator.clipboard.writeText(location.href).then(function () {
				btn.textContent = "Copiato!";
				btn.style.borderColor = "#4ade80";
				btn.style.color = "#4ade80";
				setTimeout(function () {
					btn.textContent = "Copia link";
					btn.style.borderColor = "#2d3148";
					btn.style.color = "#94a3b8";
				}, 2000);
			});
		});
	})();

	// ── Hide filters until data loads ──
	(function () {
		var ctrl = document.querySelector(".ctrl");
		if (ctrl) {
			ctrl.style.opacity = "0";
			ctrl.style.transition = "opacity .3s";
			var obs = new MutationObserver(function () {
				var cards = document.querySelector("#cards-root .card, #trends-root .card, .tl-item");
				if (cards) {
					ctrl.style.opacity = "1";
					obs.disconnect();
				}
			});
			obs.observe(document.body, { childList: true, subtree: true });
			// Fallback: show after 5s regardless
			setTimeout(function () {
				ctrl.style.opacity = "1";
			}, 5000);
		}
	})();

	// ── Breadcrumb Tab Title ──
	(function () {
		var params = new URLSearchParams(location.search);
		var date = params.get("d");
		var loc = location.pathname.split("/").pop() || "";
		if (loc === "daily.html" && date) {
			document.title = "Daily " + date.substring(0, 5) + " | DailyBriefing";
		} else if (loc === "stocks.html" && date) {
			document.title = "Stocks " + date.substring(0, 5) + " | DailyBriefing";
		} else if (loc === "index.html" || loc === "" || loc === "/") {
			document.title = "DailyBriefing";
		}
	})();

	// ── Keyboard Shortcuts ──
	document.addEventListener("keydown", function (e) {
		// Ignore if typing in input
		if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

		var nav = document.getElementById("db-nav");
		if (!nav) return;

		if (e.key === "ArrowLeft") {
			// Find prev arrow link
			var prev = nav.querySelector(".db-ar[href]:not(.off)");
			if (prev) {
				e.preventDefault();
				location.href = prev.href;
			}
		} else if (e.key === "ArrowRight") {
			// Find next arrow link (second one)
			var arrows = nav.querySelectorAll(".db-ar[href]:not(.off)");
			if (arrows.length > 1) {
				e.preventDefault();
				location.href = arrows[1].href;
			} else if (arrows.length === 1) {
				// Check if it's the next (not prev) by position
				var all = nav.querySelectorAll(".db-ar");
				if (all.length >= 2 && all[1].href) {
					e.preventDefault();
					location.href = all[1].href;
				}
			}
		} else if (e.key === "h" || e.key === "H") {
			// Home
			e.preventDefault();
			location.href = "index.html";
		}
	});

	// ── Scroll to Top Button ──
	(function () {
		var btn = document.createElement("button");
		btn.id = "scroll-top";
		btn.innerHTML = "\u2191";
		btn.setAttribute("aria-label", "Torna su");

		var style = document.createElement("style");
		style.textContent = [
			"#scroll-top{position:fixed;bottom:1.5rem;right:1.5rem;width:40px;height:40px;border-radius:10px;background:#1a1d27;border:1px solid #2d3148;color:#94a3b8;font-size:1.1rem;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s,background .15s;z-index:500;display:flex;align-items:center;justify-content:center}",
			"#scroll-top.show{opacity:1;pointer-events:auto}",
			"#scroll-top:hover{background:#7c9ef8;color:#0f1117;border-color:#7c9ef8}",
			"@media(max-width:480px){#scroll-top{width:44px;height:44px;bottom:1rem;right:1rem;border-radius:12px;font-size:1.2rem}}",
		].join("\n");
		document.head.appendChild(style);
		document.body.appendChild(btn);

		btn.addEventListener("click", function () {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});

		var ticking = false;
		window.addEventListener("scroll", function () {
			if (!ticking) {
				requestAnimationFrame(function () {
					btn.classList.toggle("show", window.scrollY > 400);
					ticking = false;
				});
				ticking = true;
			}
		});
	})();

	// ── Skeleton Loading ──
	// Inject CSS for skeleton animation used by templates
	(function () {
		var style = document.createElement("style");
		style.textContent = [
			"@keyframes sk-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}",
			".sk{background:linear-gradient(90deg,#1a1d27 0%,#252838 30%,#2d3148 50%,#252838 70%,#1a1d27 100%);background-size:200% 100%;animation:sk-shimmer 1.8s ease-in-out infinite;border-radius:8px}",
			".sk-card{height:200px;margin-bottom:1.5rem;border-radius:12px}",
			".sk-line{height:14px;margin-bottom:.5rem;width:80%}",
			".sk-line.short{width:50%}",
			".sk-wrap{padding:2rem 1.5rem;max-width:1280px;margin:0 auto}",
		].join("\n");
		document.head.appendChild(style);
	})();

	// ── Page Animations ──
	(function () {
		var style = document.createElement("style");
		style.textContent = [
			// Fade-in on page load
			"@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
			"body>.wrap,body>.hero,body>.content,.idx-search{animation:fadeIn .3s ease-out}",
			// Card stagger entrance
			"@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}",
			".card,.tl-item,.stat-card,.top-item,.sent-item{animation:cardIn .35s ease-out backwards}",
			// Stagger: each card delays slightly more
			".card:nth-child(1),.tl-item:nth-child(1){animation-delay:.05s}",
			".card:nth-child(2),.tl-item:nth-child(2){animation-delay:.1s}",
			".card:nth-child(3),.tl-item:nth-child(3){animation-delay:.15s}",
			".card:nth-child(4),.tl-item:nth-child(4){animation-delay:.2s}",
			".card:nth-child(5),.tl-item:nth-child(5){animation-delay:.25s}",
			".card:nth-child(n+6),.tl-item:nth-child(n+6){animation-delay:.3s}",
			// Smooth filter transitions
			".card,.tl-item{transition:opacity .2s ease,transform .2s ease}",
			".card.hide{opacity:0;transform:translateY(-4px)}",
			// Button hover micro-interaction
			".fb,.tab,.export-btn,.hero-link{transition:all .15s ease}",
			".fb:active,.tab:active{transform:scale(.96)}",
		].join("\n");
		document.head.appendChild(style);
	})();

	// ── Prefetch adjacent reports ──
	(function () {
		var loc = location.pathname.split("/").pop() || "";
		var pageType = null;
		if (loc === "daily.html") pageType = "daily";
		else if (loc === "stocks.html") pageType = "stocks";
		if (!pageType) return;

		var params = new URLSearchParams(location.search);
		var date = params.get("d");
		if (!date) return;

		function prefetchUrl(url) {
			var link = document.createElement("link");
			link.rel = "prefetch";
			link.href = url;
			link.as = "fetch";
			link.crossOrigin = "anonymous";
			document.head.appendChild(link);
		}

		// Load reports.json to find prev/next dates
		fetch("data/reports.json")
			.then(function (r) {
				return r.json();
			})
			.then(function (reports) {
				var dates = (reports[pageType] || []).slice().sort(function (a, b) {
					var pa = a.split("-").map(Number),
						pb = b.split("-").map(Number);
					return new Date(pa[2], pa[1] - 1, pa[0]) - new Date(pb[2], pb[1] - 1, pb[0]);
				});
				var idx = dates.indexOf(date);
				if (idx < 0) return;

				var prefix = "data/" + pageType + "-";
				// Prefetch prev
				if (idx > 0) {
					prefetchUrl(prefix + dates[idx - 1] + ".json");
					if (pageType === "stocks") prefetchUrl(prefix + dates[idx - 1] + "-charts.json");
				}
				// Prefetch next
				if (idx < dates.length - 1) {
					prefetchUrl(prefix + dates[idx + 1] + ".json");
					if (pageType === "stocks") prefetchUrl(prefix + dates[idx + 1] + "-charts.json");
				}
				// Prefetch cross-type for same date
				var crossType = pageType === "daily" ? "stocks" : "daily";
				var crossDates = reports[crossType] || [];
				if (crossDates.indexOf(date) >= 0) {
					prefetchUrl("data/" + crossType + "-" + date + ".json");
				}
			})
			.catch(function () {});
	})();

	// ── Reading Progress Bar ──
	(function () {
		var loc = location.pathname.split("/").pop() || "";
		if (loc === "index.html" || loc === "" || loc === "/" || loc === "dashboard.html") return;
		var bar = document.createElement("div");
		bar.id = "reading-progress";
		var style = document.createElement("style");
		style.textContent =
			"#reading-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#7c9ef8,#a5b9ff);z-index:10000;transition:width .1s linear;width:0}";
		document.head.appendChild(style);
		document.body.appendChild(bar);
		var ticking2 = false;
		window.addEventListener("scroll", function () {
			if (!ticking2) {
				requestAnimationFrame(function () {
					var h = document.documentElement.scrollHeight - window.innerHeight;
					bar.style.width = h > 0 ? Math.min(100, (window.scrollY / h) * 100) + "%" : "0";
					ticking2 = false;
				});
				ticking2 = true;
			}
		});
	})();

	// ── Permalink: read/write all filter state to URL ──
	(function () {
		var params = new URLSearchParams(location.search);
		var urlQ = params.get("q");
		var urlFin = params.get("fin");
		var urlHi = params.get("hi");
		var urlCat = params.get("cat");
		var urlSent = params.get("sent");
		var urlTab = params.get("tab");
		var applied = false;

		function applyFromUrl() {
			if (applied) return;
			var input = document.getElementById("q") || document.getElementById("idx-q");
			if (!input) return;
			applied = true;
			if (observer) observer.disconnect();

			// Search
			if (urlQ) {
				input.value = urlQ;
				input.dispatchEvent(new Event("input"));
			}
			// Financial toggle
			if (urlFin === "1") {
				var finCb = document.getElementById("fin-only");
				if (finCb) {
					finCb.checked = true;
					finCb.dispatchEvent(new Event("change"));
				}
			}
			// Alert toggle
			if (urlHi === "1") {
				var hiCb = document.getElementById("hi-only");
				if (hiCb) {
					hiCb.checked = true;
					hiCb.dispatchEvent(new Event("change"));
				}
			}
			// Category filter
			if (urlCat) {
				var catContainer = document.getElementById("cat-filters");
				if (catContainer) {
					var cats = urlCat.split(",");
					catContainer.querySelectorAll(".fb").forEach(function (b) {
						if (b.dataset.v === "all") {
							b.classList.remove("on");
						} else if (cats.indexOf(b.dataset.v) >= 0) {
							b.classList.add("on");
						} else {
							b.classList.remove("on");
						}
					});
				}
			}
			// Sentiment filter
			if (urlSent) {
				var sentContainer = document.getElementById("sent-filters");
				if (sentContainer) {
					var sents = urlSent.split(",");
					sentContainer.querySelectorAll(".fb").forEach(function (b) {
						if (b.dataset.v === "all") {
							b.classList.remove("on");
						} else if (sents.indexOf(b.dataset.v) >= 0) {
							b.classList.add("on");
						} else {
							b.classList.remove("on");
						}
					});
				}
			}
			// Tab (index page)
			if (urlTab) {
				var tabs = document.querySelectorAll(".tab");
				tabs.forEach(function (t) {
					t.classList.toggle("on", t.dataset.tab === urlTab);
				});
				// Trigger click on the tab
				var targetTab = document.querySelector('.tab[data-tab="' + urlTab + '"]');
				if (targetTab) targetTab.click();
			}
			// Trigger applyFilters if it exists
			if (typeof window.applyFilters === "function") window.applyFilters();

			// Attach permalink updater to all controls
			input.addEventListener("input", updatePermalink);
			var finCb2 = document.getElementById("fin-only");
			if (finCb2) finCb2.addEventListener("change", updatePermalink);
			var hiCb2 = document.getElementById("hi-only");
			if (hiCb2) hiCb2.addEventListener("change", updatePermalink);
			// Category buttons
			var catC = document.getElementById("cat-filters");
			if (catC)
				catC.addEventListener("click", function () {
					setTimeout(updatePermalink, 50);
				});
			// Sentiment buttons
			var sentC = document.getElementById("sent-filters");
			if (sentC)
				sentC.addEventListener("click", function () {
					setTimeout(updatePermalink, 50);
				});
			// Tabs
			document.querySelectorAll(".tab").forEach(function (t) {
				t.addEventListener("click", function () {
					setTimeout(updatePermalink, 50);
				});
			});
		}

		function updatePermalink() {
			var p = new URLSearchParams();
			// Preserve d= param
			var origD = new URLSearchParams(location.search).get("d");
			if (origD) p.set("d", origD);
			// Search
			var input = document.getElementById("q") || document.getElementById("idx-q");
			if (input && input.value.trim()) p.set("q", input.value.trim());
			// Financial
			var finCb = document.getElementById("fin-only");
			if (finCb && finCb.checked) p.set("fin", "1");
			// Alert
			var hiCb = document.getElementById("hi-only");
			if (hiCb && hiCb.checked) p.set("hi", "1");
			// Categories
			var catC = document.getElementById("cat-filters");
			if (catC) {
				var activeCats = [];
				catC.querySelectorAll(".fb.on").forEach(function (b) {
					if (b.dataset.v !== "all") activeCats.push(b.dataset.v);
				});
				if (activeCats.length > 0) p.set("cat", activeCats.join(","));
			}
			// Sentiment
			var sentC = document.getElementById("sent-filters");
			if (sentC) {
				var activeSents = [];
				sentC.querySelectorAll(".fb.on").forEach(function (b) {
					if (b.dataset.v !== "all") activeSents.push(b.dataset.v);
				});
				if (activeSents.length > 0) p.set("sent", activeSents.join(","));
			}
			// Tab
			var activeTab = document.querySelector(".tab.on");
			if (activeTab && activeTab.dataset.tab !== "all") p.set("tab", activeTab.dataset.tab);

			var newUrl = location.pathname + (p.toString() ? "?" + p.toString() : "");
			history.replaceState(null, "", newUrl);
		}

		var observer = new MutationObserver(function () {
			applyFromUrl();
		});
		observer.observe(document.body, { childList: true, subtree: true });
		applyFromUrl();
	})();

	// ── Print / PDF styles ──
	(function () {
		var style = document.createElement("style");
		style.textContent = [
			"@media print{",
			"  #db-nav,#scroll-top,#reading-progress,.export-btn,.copy-link-btn,#cmp-panel,.cmpbtn,.trng,.tts-btn,.hero-link{display:none!important}",
			"  body{padding:0!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}",
			"  .wrap{max-width:100%!important;padding:1rem!important}",
			"  .card,.stat-card,.top-item,.tl-item,.sent-item,.km,.tc{break-inside:avoid}",
			"  .card.hide{display:none!important}",
			"  .links li.dim{opacity:1!important}",
			"  .cc{height:180px!important}",
			"  .tg{grid-template-columns:1fr 1fr!important}",
			"  @page{margin:1cm;size:A4}",
			"}",
		].join("\n");
		document.head.appendChild(style);
	})();
})();
