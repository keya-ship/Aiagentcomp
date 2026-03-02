import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from "recharts";

const NEWS_API_KEY = "2a4715f381374324a9040701dfbe4dd6";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f8f7f4; --bg2: #f1efe9; --white: #ffffff; --border: #e4e1d8; --border2: #d4d0c4;
    --text: #1a1814; --text2: #4a4740; --muted: #8c897e;
    --accent: #2563eb; --accent-light: #eff4ff; --accent-border: #bfcff8;
    --green: #16a34a; --green-light: #f0fdf4; --green-border: #bbf7d0;
    --red: #dc2626; --red-light: #fef2f2; --red-border: #fecaca;
    --amber: #d97706; --amber-light: #fffbeb; --amber-border: #fde68a;
    --purple: #7c3aed; --purple-light: #f5f3ff; --purple-border: #ddd6fe;
    --teal: #0d9488; --teal-light: #f0fdfa; --teal-border: #99f6e4;
    --font: 'Instrument Sans', sans-serif; --font-serif: 'Instrument Serif', serif; --font-mono: 'JetBrains Mono', monospace;
    --radius: 10px; --radius-sm: 6px;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font); -webkit-font-smoothing: antialiased; }
  .app { min-height: 100vh; }

  .header { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 40px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .logo { display: flex; align-items: center; gap: 8px; }
  .logo-icon { width: 28px; height: 28px; background: var(--accent); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; }
  .logo-name { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
  .logo-name span { color: var(--accent); }
  .header-badge { font-size: 11px; font-weight: 500; color: var(--muted); background: var(--bg2); border: 1px solid var(--border); padding: 4px 10px; border-radius: 20px; }

  .main { max-width: 960px; margin: 0 auto; padding: 48px 24px 80px; }
  .hero { margin-bottom: 40px; }
  .hero h1 { font-family: var(--font-serif); font-size: clamp(32px, 4vw, 48px); font-weight: 400; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 10px; }
  .hero h1 em { font-style: italic; color: var(--accent); }
  .hero p { font-size: 14px; color: var(--muted); line-height: 1.6; max-width: 440px; }

  .search-box { background: var(--white); border: 1px solid var(--border); border-radius: 12px; padding: 8px 8px 8px 16px; display: flex; gap: 8px; align-items: center; box-shadow: var(--shadow); margin-bottom: 14px; transition: border-color 0.2s, box-shadow 0.2s; }
  .search-box:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light), var(--shadow); }
  .search-box input { flex: 1; border: none; outline: none; background: transparent; font-family: var(--font); font-size: 15px; font-weight: 500; color: var(--text); padding: 6px 0; }
  .search-box input::placeholder { color: var(--muted); font-weight: 400; }
  .run-btn { background: var(--accent); color: white; border: none; font-family: var(--font); font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
  .run-btn:hover:not(:disabled) { background: #1d51d4; }
  .run-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .quick-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .quick-tag { font-size: 12px; font-weight: 500; color: var(--text2); border: 1px solid var(--border); background: var(--white); padding: 5px 12px; border-radius: 20px; cursor: pointer; transition: all 0.15s; }
  .quick-tag:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }

  .loading-wrap { padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .loading-ring { width: 40px; height: 40px; border: 2.5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-steps-list { display: flex; flex-direction: column; gap: 4px; align-items: center; }
  .loading-step-item { font-size: 12px; color: var(--border2); font-family: var(--font-mono); opacity: 0; animation: fadeIn 0.3s ease forwards; }
  .loading-step-item.done { color: var(--muted); }
  .loading-step-item.active { color: var(--accent); font-weight: 500; }
  @keyframes fadeIn { to { opacity: 1; } }

  .error-box { background: var(--red-light); border: 1px solid var(--red-border); border-radius: var(--radius); padding: 16px 20px; font-size: 13px; color: var(--red); }
  .results { animation: fadeIn 0.4s ease; }
  .section-heading { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }

  .download-bar { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; margin-bottom: 20px; box-shadow: var(--shadow); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .download-bar-left { display: flex; flex-direction: column; gap: 3px; }
  .download-bar-title { font-size: 14px; font-weight: 600; }
  .download-bar-sub { font-size: 12px; color: var(--muted); }
  .download-btn { display: flex; align-items: center; gap: 7px; background: var(--text); color: white; border: none; font-family: var(--font); font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 8px; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
  .download-btn:hover { background: #333; }

  .report-head { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 28px; margin-bottom: 20px; box-shadow: var(--shadow); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .report-title { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .report-category { font-family: var(--font-serif); font-size: 28px; font-weight: 400; letter-spacing: -0.02em; }
  .report-category em { font-style: italic; color: var(--accent); }
  .report-meta { text-align: right; font-size: 11px; color: var(--muted); line-height: 2; }
  .curve-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; background: var(--accent-light); color: var(--accent); border: 1px solid var(--accent-border); }

  .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .two-col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .four-col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }

  .stat-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow); position: relative; }
  .stat-card.live-data { border-color: var(--teal-border); }
  .stat-card.live-data::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--teal); border-radius: var(--radius) var(--radius) 0 0; }
  .stat-label { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .live-badge { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; background: var(--teal-light); color: var(--teal); border: 1px solid var(--teal-border); letter-spacing: 0.04em; }
  .ai-badge { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; background: var(--purple-light); color: var(--purple); border: 1px solid var(--purple-border); letter-spacing: 0.04em; }
  .stat-value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; margin-bottom: 5px; }
  .stat-value.blue { color: var(--accent); } .stat-value.green { color: var(--green); } .stat-value.red { color: var(--red); } .stat-value.amber { color: var(--amber); } .stat-value.purple { color: var(--purple); } .stat-value.teal { color: var(--teal); }
  .stat-sub { font-size: 11px; color: var(--muted); }

  .timeline-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
  .timeline-card.future-card { border-color: var(--accent-border); background: var(--accent-light); }
  .tc-period { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .future-card .tc-period { color: var(--accent); }
  .tc-year { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 10px; }
  .tc-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; margin-bottom: 10px; }
  .tc-badge.rising { background: var(--green-light); color: var(--green); border: 1px solid var(--green-border); }
  .tc-badge.peaked { background: var(--amber-light); color: var(--amber); border: 1px solid var(--amber-border); }
  .tc-badge.declining { background: var(--red-light); color: var(--red); border: 1px solid var(--red-border); }
  .tc-badge.steady { background: var(--bg2); color: var(--text2); border: 1px solid var(--border); }
  .tc-badge.emerging { background: var(--purple-light); color: var(--purple); border: 1px solid var(--purple-border); }
  .tc-body { font-size: 12px; color: var(--text2); line-height: 1.65; }

  .section-card { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 28px; margin-bottom: 20px; box-shadow: var(--shadow); }
  .trend-bar-row { display: flex; flex-direction: column; gap: 14px; }
  .bar-item-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text2); margin-bottom: 6px; }
  .bar-item-label span:last-child { font-weight: 600; }
  .bar-track { height: 7px; background: var(--bg2); border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width 1.1s cubic-bezier(0.16,1,0.3,1); }
  .report-body { font-size: 14px; line-height: 1.75; color: var(--text2); white-space: pre-wrap; }

  .chip-group { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 20px; border: 1px solid var(--border); color: var(--text2); background: var(--bg2); }
  .chip.hot { background: var(--accent-light); color: var(--accent); border-color: var(--accent-border); }
  .chip.warm { background: var(--amber-light); color: var(--amber); border-color: var(--amber-border); }
  .chip.cold { background: var(--bg2); color: var(--muted); text-decoration: line-through; }
  .chip.sub { background: var(--purple-light); color: var(--purple); border-color: var(--purple-border); }
  .kw-group { margin-bottom: 18px; }
  .kw-group:last-child { margin-bottom: 0; }
  .kw-group-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }

  .brand-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 7px; background: var(--bg); font-size: 13px; font-weight: 500; }
  .brand-item:last-child { margin-bottom: 0; }
  .brand-item.lead { border-color: var(--accent-border); background: var(--accent-light); }
  .brand-item.rise { border-color: var(--green-border); background: var(--green-light); }
  .brand-rank { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
  .brand-rank.lead { background: var(--accent); color: white; }
  .brand-rank.rise { background: var(--green); color: white; }

  .product-item { padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); font-size: 12px; color: var(--text2); line-height: 1.4; }
  .p-status { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
  .p-status.hot { color: var(--green); } .p-status.fade { color: var(--muted); }
  .product-item.fading { opacity: 0.55; }

  .chart-tooltip { background: var(--white); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; box-shadow: var(--shadow-md); font-size: 12px; }
  .ct-label { font-size: 11px; color: var(--muted); margin-bottom: 3px; }
  .ct-val { font-weight: 700; font-size: 14px; }
  .ct-val.hist { color: var(--accent); } .ct-val.proj { color: var(--purple); }

  .chart-legend { display: flex; gap: 20px; margin-bottom: 12px; align-items: center; }
  .cl-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--muted); }

  .driver-col-label { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 10px; }
  .driver-col-label.bull { color: var(--green); } .driver-col-label.bear { color: var(--red); }
  .driver-item { font-size: 12px; color: var(--text2); line-height: 1.55; padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 6px; display: flex; align-items: flex-start; gap: 8px; }
  .driver-item.bull { background: var(--green-light); border: 1px solid var(--green-border); }
  .driver-item.bear { background: var(--red-light); border: 1px solid var(--red-border); }

  .verdict-box { margin-top: 20px; padding: 16px 20px; background: var(--purple-light); border: 1px solid var(--purple-border); border-radius: var(--radius); display: flex; gap: 14px; align-items: flex-start; }
  .verdict-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--purple); white-space: nowrap; }
  .verdict-text { font-size: 13px; color: var(--text2); line-height: 1.65; }
  .divider { height: 1px; background: var(--border); margin: 24px 0; }

  /* News articles */
  .news-articles { margin-top: 16px; }
  .news-articles-title { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--teal); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .news-article-item { padding: 10px 14px; border: 1px solid var(--teal-border); border-radius: var(--radius-sm); margin-bottom: 7px; background: var(--teal-light); display: flex; flex-direction: column; gap: 3px; }
  .news-article-item:last-child { margin-bottom: 0; }
  .news-article-title { font-size: 12px; font-weight: 600; color: var(--text); line-height: 1.4; }
  .news-article-meta { font-size: 11px; color: var(--muted); display: flex; gap: 10px; }
  .news-article-source { font-weight: 600; color: var(--teal); }

  .data-legend { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; padding: 10px 16px; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .data-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text2); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
  .legend-dot.live { background: var(--teal); }
  .legend-dot.ai { background: var(--purple); }

  .source-item { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .source-item:last-child { border-bottom: none; padding-bottom: 0; }
  .source-num { width: 22px; height: 22px; border-radius: 50%; background: var(--bg2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--muted); flex-shrink: 0; margin-top: 2px; }
  .source-name { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
  .source-type { font-size: 11px; color: var(--muted); margin-bottom: 4px; font-family: var(--font-mono); }
  .source-desc { font-size: 12px; color: var(--text2); line-height: 1.5; }
  .source-tag { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; margin-left: 8px; }
  .source-tag.live { background: var(--teal-light); color: var(--teal); border: 1px solid var(--teal-border); }
  .source-tag.ai { background: var(--purple-light); color: var(--purple); border: 1px solid var(--purple-border); }
  .disclaimer-box { background: var(--amber-light); border: 1px solid var(--amber-border); border-radius: var(--radius); padding: 14px 18px; font-size: 12px; color: var(--amber); line-height: 1.6; margin-top: 16px; }

  @media (max-width: 700px) {
    .header { padding: 0 16px; }
    .main { padding: 28px 16px 60px; }
    .three-col, .four-col { grid-template-columns: 1fr 1fr; }
    .report-head, .download-bar { flex-direction: column; align-items: flex-start; }
  }
`;

const QUICK_TAGS = ["portable tech", "stanley cups", "sneakers", "wireless earbuds", "skincare", "electric bikes", "smart home", "energy drinks"];

const LOADING_STEPS = [
  "Fetching live news coverage…",
  "Scanning community signals…",
  "Computing trend velocity…",
  "Analyzing price history…",
  "Running AI forecast model…",
  "Building your report…"
];

const DATA_SOURCES = [
  {
    name: "NewsAPI.org",
    type: "Live News Coverage Data",
    desc: "Real-time news article data pulled directly from NewsAPI.org. Article counts are fetched live at the time of each report and converted into a 0–100 coverage score based on volume in the past 30 days.",
    tag: "live"
  },
  {
    name: "Google Trends (via AI estimate)",
    type: "Search Interest Data",
    desc: "Search interest score is currently an AI estimate based on Claude's training data. A live Google Trends integration via SerpApi is planned for a future update.",
    tag: "ai"
  },
  {
    name: "Reddit Community Discussions (via AI estimate)",
    type: "Social Signal Data",
    desc: "Reddit buzz score is currently an AI estimate. A live Reddit API integration is in progress and will replace this with real post volume and engagement data.",
    tag: "ai"
  },
  {
    name: "Market Pricing Data (via AI estimate)",
    type: "Retail & E-commerce Pricing",
    desc: "Pricing figures are AI-generated estimates based on Claude's training data. Not sourced from live retail APIs. Always verify pricing with current retailer data.",
    tag: "ai"
  },
  {
    name: "Anthropic Claude AI Model",
    type: "AI Analysis & Synthesis Engine",
    desc: "All trend narratives, scores (except News Coverage), forecasts, and keyword signals are generated by Claude. These are informed estimates based on training data with a knowledge cutoff of early 2025 — not real-time measurements.",
    tag: "ai"
  },
];

// ── NEWS API ─────────────────────────────────────────────────────────────────
async function fetchNewsData(category) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const from = thirtyDaysAgo.toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&from=${from}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${NEWS_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);
  const data = await res.json();

  if (data.status !== "ok") throw new Error(data.message || "NewsAPI returned an error");

  const totalResults = data.totalResults || 0;

  // Convert article count to 0-100 score
  // 0 articles = 0, 10 = ~20, 50 = ~50, 200+ = ~90, 500+ = 100
  const score = Math.min(100, Math.round(Math.log10(totalResults + 1) * 38));

  const articles = (data.articles || [])
    .filter(a => a.title && a.title !== "[Removed]")
    .slice(0, 6)
    .map(a => ({
      title: a.title,
      source: a.source?.name || "Unknown",
      publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      url: a.url
    }));

  return { score, totalResults, articles };
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function badgeClass(b = "") {
  const u = b.toUpperCase();
  if (u.includes("RISING")) return "rising";
  if (u.includes("PEAKED") || u.includes("PLATEAU")) return "peaked";
  if (u.includes("DECLINING")) return "declining";
  if (u.includes("EMERGING")) return "emerging";
  return "steady";
}
function badgeIcon(b = "") {
  const u = b.toUpperCase();
  if (u.includes("RISING")) return "↑";
  if (u.includes("PEAKED")) return "◆";
  if (u.includes("DECLINING")) return "↓";
  if (u.includes("EMERGING")) return "✦";
  return "–";
}

function ScoreBars({ past, present, future }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 150); }, []);
  return (
    <div className="trend-bar-row">
      {[["Last Year", past, "#d4d0c4"], ["This Year", present, "#2563eb"], ["Next Year (Projected)", future, "#16a34a"]].map(([label, val, color]) => (
        <div key={label}>
          <div className="bar-item-label"><span>{label}</span><span>{val}/100</span></div>
          <div className="bar-track"><div className="bar-fill" style={{ width: mounted ? `${val}%` : "0%", background: color }} /></div>
        </div>
      ))}
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isProj = payload[0]?.payload?.projected;
  const val = payload[0]?.value;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      <div className={`ct-val ${isProj ? "proj" : "hist"}`}>${typeof val === "number" ? val.toFixed(2) : val}{isProj ? " (est.)" : ""}</div>
    </div>
  );
};

// ── SVG SPARKLINE ─────────────────────────────────────────────────────────────
function buildSparklineSVG(monthlyHistory) {
  if (!monthlyHistory?.length) return "";
  const W = 600, H = 120, pad = 10;
  const prices = monthlyHistory.map(d => d.price);
  const mn = Math.min(...prices), mx = Math.max(...prices), rng = mx - mn || 1;
  const x = i => pad + (i / (monthlyHistory.length - 1)) * (W - pad * 2);
  const y = p => H - pad - ((p - mn) / rng) * (H - pad * 2);
  const histPoints = monthlyHistory.filter(d => !d.projected);
  const projPoints = [histPoints[histPoints.length - 1], ...monthlyHistory.filter(d => d.projected)];
  const toPath = (pts) => pts.map((d, i) => { const idx = monthlyHistory.indexOf(d); return `${i === 0 ? "M" : "L"}${x(idx)},${y(d.price)}`; }).join(" ");
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <rect width="${W}" height="${H}" fill="#f8f7f4" rx="6"/>
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#e4e1d8" stroke-width="1"/>
    <path d="${toPath(histPoints)}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${toPath(projPoints)}" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="6,4" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
    <text x="${pad}" y="${H - 2}" font-size="9" fill="#8c897e">${monthlyHistory[0]?.month}</text>
    <text x="${W / 2}" y="${H - 2}" font-size="9" fill="#8c897e" text-anchor="middle">${monthlyHistory[Math.floor(monthlyHistory.length / 2)]?.month}</text>
    <text x="${W - pad}" y="${H - 2}" font-size="9" fill="#8c897e" text-anchor="end">${monthlyHistory[monthlyHistory.length - 1]?.month}</text>
  </svg>`;
}

// ── HTML REPORT BUILDER ───────────────────────────────────────────────────────
function buildReportHTML(report, newsData) {
  const currentYear = new Date().getFullYear();
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const p = report.pricing || {};
  const badgeCls = (b = "") => { const u = b.toUpperCase(); if (u.includes("RISING")) return "badge-green"; if (u.includes("PEAKED") || u.includes("PLATEAU")) return "badge-amber"; if (u.includes("DECLINING")) return "badge-red"; if (u.includes("EMERGING")) return "badge-purple"; return "badge-gray"; };
  const chip = (text, cls) => `<span class="chip ${cls}">${text}</span>`;
  const sparkSVG = buildSparklineSVG(p.monthlyHistory);
  const newsScore = newsData?.score ?? report.newsScore;
  const newsArticlesHTML = newsData?.articles?.length ? `
    <div style="margin-top:14px">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#0d9488;margin-bottom:8px">● Live News Articles (past 30 days)</div>
      ${newsData.articles.map(a => `
        <div style="padding:8px 10px;border:1px solid #99f6e4;border-radius:5px;background:#f0fdfa;margin-bottom:5px">
          <div style="font-size:11px;font-weight:600;color:#1a1814;margin-bottom:2px">${a.title}</div>
          <div style="font-size:10px;color:#8c897e"><span style="color:#0d9488;font-weight:600">${a.source}</span> · ${a.publishedAt}</div>
        </div>`).join("")}
    </div>` : "";

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>TrendPulse — ${report.category}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; color: #1a1814; background: #fff; line-height: 1.5; }
  .page { max-width: 780px; margin: 0 auto; padding: 40px 40px 60px; }
  .rpt-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 3px solid #2563eb; margin-bottom: 24px; }
  .rpt-logo { font-size: 18px; font-weight: 800; color: #2563eb; }
  .rpt-meta { text-align: right; font-size: 11px; color: #8c897e; line-height: 1.8; }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
  h1 em { color: #2563eb; font-style: italic; }
  .sub { font-size: 11px; color: #8c897e; margin-bottom: 20px; }
  .sec-title { font-size: 10px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #8c897e; margin: 22px 0 10px; padding-top: 16px; border-top: 1px solid #e4e1d8; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 4px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 4px; }
  .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  .stat { background: #f8f7f4; border: 1px solid #e4e1d8; border-radius: 7px; padding: 12px 14px; position: relative; overflow: hidden; }
  .stat.live { border-color: #99f6e4; }
  .stat.live::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: #0d9488; }
  .stat-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #8c897e; margin-bottom: 5px; }
  .stat-val { font-size: 22px; font-weight: 800; line-height: 1; margin-bottom: 3px; letter-spacing: -0.02em; }
  .stat-sub { font-size: 10px; color: #8c897e; }
  .c-blue{color:#2563eb} .c-green{color:#16a34a} .c-red{color:#dc2626} .c-purple{color:#7c3aed} .c-amber{color:#d97706} .c-teal{color:#0d9488}
  .badge-pill { display:inline-block; font-size:8px; font-weight:700; padding:1px 6px; border-radius:10px; margin-left:6px; vertical-align:middle; }
  .badge-pill.live { background:#f0fdfa; color:#0d9488; border:1px solid #99f6e4; }
  .badge-pill.ai { background:#f5f3ff; color:#7c3aed; border:1px solid #ddd6fe; }
  .bar-row { margin-bottom: 9px; }
  .bar-lbl { display: flex; justify-content: space-between; font-size: 11px; color: #4a4740; margin-bottom: 4px; }
  .bar-lbl span:last-child { font-weight: 700; }
  .bar-track { height: 7px; background: #f1efe9; border-radius: 4px; overflow:hidden; }
  .bar-fill { height: 100%; border-radius: 4px; }
  .tl-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 4px; }
  .tl-box { border: 1px solid #e4e1d8; border-radius: 7px; padding: 14px; background: #f8f7f4; }
  .tl-box.future { border-color: #bfcff8; background: #eff4ff; }
  .tl-period { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #8c897e; margin-bottom: 2px; }
  .future .tl-period { color: #2563eb; }
  .tl-year { font-size: 18px; font-weight: 800; margin-bottom: 7px; }
  .badge { display: inline-block; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-bottom: 7px; }
  .badge-green { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
  .badge-amber { background:#fffbeb; color:#d97706; border:1px solid #fde68a; }
  .badge-red { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
  .badge-purple { background:#f5f3ff; color:#7c3aed; border:1px solid #ddd6fe; }
  .badge-gray { background:#f1efe9; color:#4a4740; border:1px solid #e4e1d8; }
  .tl-body { font-size: 10.5px; color: #4a4740; line-height: 1.6; }
  .report-body { font-size: 12.5px; color: #4a4740; line-height: 1.75; white-space: pre-wrap; }
  .chip-group { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 5px; }
  .chip { font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px; border: 1px solid #e4e1d8; color: #4a4740; background: #f1efe9; }
  .chip.hot { background:#eff4ff; color:#2563eb; border-color:#bfcff8; }
  .chip.warm { background:#fffbeb; color:#d97706; border-color:#fde68a; }
  .chip.cold { background:#f1efe9; color:#8c897e; text-decoration:line-through; }
  .chip.sub { background:#f5f3ff; color:#7c3aed; border-color:#ddd6fe; }
  .kw-lbl { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8c897e; margin: 10px 0 5px; }
  .brand-row { display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid #e4e1d8; border-radius:5px; margin-bottom:5px; font-size:12px; font-weight:500; background:#f8f7f4; }
  .brand-row.lead { border-color:#bfcff8; background:#eff4ff; }
  .brand-row.rise { border-color:#bbf7d0; background:#f0fdf4; }
  .brand-num { width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:800; flex-shrink:0; }
  .brand-num.lead { background:#2563eb; color:white; }
  .brand-num.rise { background:#16a34a; color:white; }
  .prod-box { padding:9px 11px; border:1px solid #e4e1d8; border-radius:5px; background:#f8f7f4; font-size:11px; color:#4a4740; }
  .ps { font-size:8.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:3px; }
  .ps.hot { color:#16a34a; } .ps.fade { color:#8c897e; }
  .prod-box.fading { opacity:0.6; }
  .drv-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px; }
  .drv-lbl.bull { color:#16a34a; } .drv-lbl.bear { color:#dc2626; }
  .drv { display:flex; gap:6px; padding:7px 10px; border-radius:5px; margin-bottom:5px; font-size:11px; line-height:1.5; color:#4a4740; }
  .drv.bull { background:#f0fdf4; border:1px solid #bbf7d0; }
  .drv.bear { background:#fef2f2; border:1px solid #fecaca; }
  .verdict { padding:12px 16px; background:#f5f3ff; border:1px solid #ddd6fe; border-radius:7px; display:flex; gap:12px; margin-top:14px; }
  .verdict-lbl { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:#7c3aed; white-space:nowrap; }
  .verdict-txt { font-size:11.5px; color:#4a4740; line-height:1.65; }
  .src-row { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #e4e1d8; }
  .src-row:last-child { border-bottom:none; }
  .src-num { width:20px; height:20px; border-radius:50%; background:#f1efe9; border:1px solid #e4e1d8; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:800; color:#8c897e; flex-shrink:0; }
  .src-name { font-size:12px; font-weight:700; margin-bottom:1px; }
  .src-type { font-size:9.5px; color:#8c897e; margin-bottom:4px; font-family:monospace; }
  .src-desc { font-size:11px; color:#4a4740; line-height:1.5; }
  .disclaimer { background:#fffbeb; border:1px solid #fde68a; border-radius:7px; padding:12px 16px; font-size:11px; color:#92400e; line-height:1.6; margin-top:14px; }
  .footer { margin-top:32px; padding-top:12px; border-top:1px solid #e4e1d8; font-size:10px; color:#8c897e; display:flex; justify-content:space-between; }
</style></head><body><div class="page">
  <div class="rpt-header">
    <div><div class="rpt-logo">TrendPulse</div><div style="font-size:10px;color:#8c897e;margin-top:2px">Consumer Trend Intelligence</div></div>
    <div class="rpt-meta">Generated ${date}<br>Curve: ${report.trendCurveShape}<br>News data: Live via NewsAPI.org</div>
  </div>
  <h1>"${report.category}" <em>Analysis</em></h1>
  <div class="sub">Trend & Pricing Report · ${date}</div>
  <div style="display:flex;gap:12px;margin-bottom:16px;font-size:10px;color:#4a4740;align-items:center">
    <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#0d9488;display:inline-block"></span> Live data (NewsAPI)</span>
    <span style="display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:#7c3aed;display:inline-block"></span> AI estimate (Claude)</span>
  </div>

  <div class="sec-title">Signal Scores</div>
  <div class="grid-3">
    <div class="stat"><div class="stat-lbl">Google Search Interest <span class="badge-pill ai">AI</span></div><div class="stat-val ${report.googleTrendScore >= 70 ? "c-green" : "c-blue"}">${report.googleTrendScore}<span style="font-size:13px;color:#8c897e">/100</span></div><div class="stat-sub">AI estimate · live integration coming</div></div>
    <div class="stat"><div class="stat-lbl">Reddit Community Buzz <span class="badge-pill ai">AI</span></div><div class="stat-val ${report.redditScore >= 70 ? "c-green" : "c-blue"}">${report.redditScore}<span style="font-size:13px;color:#8c897e">/100</span></div><div class="stat-sub">AI estimate · live integration coming</div></div>
    <div class="stat live"><div class="stat-lbl">News Coverage <span class="badge-pill live">LIVE</span></div><div class="stat-val c-teal">${newsScore}<span style="font-size:13px;color:#8c897e">/100</span></div><div class="stat-sub">${newsData?.totalResults?.toLocaleString() || "—"} articles in past 30 days</div></div>
  </div>
  ${newsArticlesHTML}

  <div class="sec-title">Trend Velocity <span class="badge-pill ai" style="font-size:8px">AI estimate</span></div>
  ${[["Last Year", report.pastScore, "#d4d0c4"], ["This Year", report.presentScore, "#2563eb"], ["Next Year (Projected)", report.futureScore, "#16a34a"]].map(([lbl, val, col]) => `
  <div class="bar-row"><div class="bar-lbl"><span>${lbl}</span><span>${val}/100</span></div><div class="bar-track"><div class="bar-fill" style="width:${val}%;background:${col}"></div></div></div>`).join("")}

  <div class="sec-title">Timeline <span class="badge-pill ai" style="font-size:8px">AI estimate</span></div>
  <div class="tl-grid">
    ${[{ period:"Last Year", year:currentYear-1, summary:report.pastSummary, badge:report.pastTrendBadge },{ period:"This Year", year:currentYear, summary:report.presentSummary, badge:report.presentTrendBadge },{ period:"Forecast", year:currentYear+1, summary:report.futureSummary, badge:report.futureTrendBadge, future:true }].map(({period,year,summary,badge,future})=>`
    <div class="tl-box${future?" future":""}"><div class="tl-period">${period}</div><div class="tl-year">${year}</div>${badge?`<div class="badge ${badgeCls(badge)}">${badge}</div><br>`:""}
    <div class="tl-body">${summary||""}</div></div>`).join("")}
  </div>

  <div class="sec-title">Analyst Report <span class="badge-pill ai" style="font-size:8px">AI generated</span></div>
  <div class="report-body">${report.fullReport||""}</div>

  ${p.currentAvgPrice ? `
  <div class="sec-title">Price History & Forecast <span class="badge-pill ai" style="font-size:8px">AI estimate</span></div>
  <div class="grid-4">
    <div class="stat"><div class="stat-lbl">Avg Price Today</div><div class="stat-val c-blue">$${p.currentAvgPrice?.toFixed(2)}</div><div class="stat-sub">$${p.typicalPriceRangeLow}–$${p.typicalPriceRangeHigh} typical</div></div>
    <div class="stat"><div class="stat-lbl">Year-over-Year</div><div class="stat-val ${p.priceChangeYoY>=0?"c-green":"c-red"}">${p.priceChangeYoY>=0?"+":""}${p.priceChangeYoY?.toFixed(1)}%</div><div class="stat-sub">Trend: ${p.priceTrend}</div></div>
    <div class="stat"><div class="stat-lbl">12-Month Forecast</div><div class="stat-val c-purple">$${p.forecastAvgPrice12mo?.toFixed(2)}</div><div class="stat-sub">Projected avg</div></div>
    <div class="stat"><div class="stat-lbl">24-Month Forecast</div><div class="stat-val c-purple">$${p.forecastAvgPrice24mo?.toFixed(2)}</div><div class="stat-sub">Outlook: ${p.priceOutlook}</div></div>
  </div>
  ${sparkSVG}
  <div style="height:14px"></div>
  <div class="grid-2">
    <div><div class="drv-lbl bull">↑ Price-Up Factors</div>${(p.priceBullishDrivers||[]).map(d=>`<div class="drv bull"><span>↑</span>${d}</div>`).join("")}</div>
    <div><div class="drv-lbl bear">↓ Price-Down Factors</div>${(p.priceBearishDrivers||[]).map(d=>`<div class="drv bear"><span>↓</span>${d}</div>`).join("")}</div>
  </div>
  <div class="verdict"><div class="verdict-lbl">Verdict</div><div class="verdict-txt">${p.pricingVerdict||""}</div></div>` : ""}

  <div class="sec-title">Keyword Signals <span class="badge-pill ai" style="font-size:8px">AI estimate</span></div>
  <div class="kw-lbl">🔥 Rising Now</div><div class="chip-group">${(report.hotKeywords||[]).map(k=>chip(k,"hot")).join("")}</div>
  <div class="kw-lbl">📉 Fading</div><div class="chip-group">${(report.warmKeywords||[]).map(k=>chip(k,"warm")).join("")}</div>
  <div class="kw-lbl">❄️ Declining</div><div class="chip-group">${(report.coldKeywords||[]).map(k=>chip(k,"cold")).join("")}</div>
  <div class="kw-lbl">💬 Reddit</div><div class="chip-group">${(report.topSubreddits||[]).map(r=>chip("r/"+r.replace(/^r\//,""),"sub")).join("")}</div>

  <div class="sec-title">Brand Intelligence <span class="badge-pill ai" style="font-size:8px">AI estimate</span></div>
  <div class="grid-2">
    <div><div class="kw-lbl">Leading Brands</div>${(report.leadingBrands||[]).map((b,i)=>`<div class="brand-row lead"><div class="brand-num lead">${i+1}</div>${b}</div>`).join("")}</div>
    <div><div class="kw-lbl">Rising Challengers</div>${(report.risingBrands||[]).map(b=>`<div class="brand-row rise"><div class="brand-num rise">↑</div>${b}</div>`).join("")}</div>
  </div>

  <div class="sec-title">Product Signals <span class="badge-pill ai" style="font-size:8px">AI estimate</span></div>
  <div class="kw-lbl">Trending Now</div>
  <div class="grid-2" style="margin-bottom:10px">${(report.topProducts||[]).map(p=>`<div class="prod-box"><div class="ps hot">↑ Trending</div>${p}</div>`).join("")}</div>
  <div class="kw-lbl">Losing Steam</div>
  <div class="grid-2">${(report.fadingProducts||[]).map(p=>`<div class="prod-box fading"><div class="ps fade">↓ Fading</div>${p}</div>`).join("")}</div>

  <div class="sec-title">Data Sources & Methodology</div>
  ${DATA_SOURCES.map((src,i)=>`<div class="src-row"><div class="src-num">${i+1}</div><div><div class="src-name">${src.name} <span class="badge-pill ${src.tag}">${src.tag==="live"?"LIVE":"AI"}</span></div><div class="src-type">${src.type}</div><div class="src-desc">${src.desc}</div></div></div>`).join("")}
  <div class="disclaimer"><strong>⚠ Disclaimer:</strong> News coverage data is fetched live from NewsAPI.org. All other scores, prices, and forecasts are AI-generated estimates based on Claude's training data (knowledge cutoff early 2025), not real-time data. Always verify with primary sources before making decisions.</div>

  <div class="footer"><span>TrendPulse · "${report.category}" Report</span><span>${date}</span></div>
</div></body></html>`;
}

function downloadHTML(report, newsData) {
  const html = buildReportHTML(report, newsData);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TrendPulse_${report.category.replace(/\s+/g, "_")}_Report.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function TrendAgent() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [loadStep, setLoadStep] = useState(0);
  const [report, setReport] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  function startLoadingSteps() {
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setLoadStep(step);
      if (step >= LOADING_STEPS.length - 1) clearInterval(intervalRef.current);
    }, 1400);
  }

  async function runAgent(category) {
    if (!category.trim()) return;
    setStatus("loading");
    setLoadStep(0);
    setReport(null);
    setNewsData(null);
    setError("");
    startLoadingSteps();

    const currentYear = new Date().getFullYear();
    const pastYear = currentYear - 1;
    const futureYear = currentYear + 1;

    // Fetch news and AI report in parallel
    let liveNews = null;
    try {
      const [newsResult, aiResult] = await Promise.allSettled([
        fetchNewsData(category),
        fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 6000,
            messages: [{
              role: "user", content: `You are a consumer trend forecasting agent. Analyze "${category}" and return ONLY valid JSON — no markdown, no explanation.

{
  "category": "${category}",
  "googleTrendScore": <integer 0-100>,
  "redditScore": <integer 0-100>,
  "newsScore": <integer 0-100 — your estimate, will be overridden by live data>,
  "pastScore": <integer 0-100>,
  "presentScore": <integer 0-100>,
  "futureScore": <integer 0-100>,
  "pastTrendBadge": <"PEAKED"|"RISING"|"DECLINING"|"STEADY">,
  "presentTrendBadge": <"PEAKED"|"RISING"|"DECLINING"|"STEADY">,
  "futureTrendBadge": <"PEAKED"|"RISING"|"DECLINING"|"EMERGING">,
  "pastSummary": "<2-3 sentences about ${pastYear}>",
  "presentSummary": "<2-3 sentences about ${currentYear}>",
  "futureSummary": "<2-3 sentences forecasting ${futureYear}>",
  "fullReport": "<3 paragraphs: trend arc, consumer behavior, brand recommendation. Max 3 sentences each.>",
  "hotKeywords": ["<5-7 keywords>"],
  "warmKeywords": ["<4-6 keywords>"],
  "coldKeywords": ["<3-5 keywords>"],
  "topSubreddits": ["<3-4 subreddit names>"],
  "trendCurveShape": <"S-CURVE EARLY"|"S-CURVE GROWTH"|"S-CURVE PLATEAU"|"DECLINING"|"CYCLICAL"|"VOLATILE">,
  "leadingBrands": ["<4-5 brands>"],
  "risingBrands": ["<3-4 brands>"],
  "topProducts": ["<5-6 products>"],
  "fadingProducts": ["<3-4 products>"],
  "pricing": {
    "typicalPriceRangeLow": <number>,
    "typicalPriceRangeHigh": <number>,
    "currentAvgPrice": <number>,
    "priceChangeYoY": <number>,
    "priceTrend": <"RISING"|"FALLING"|"STABLE"|"VOLATILE">,
    "priceOutlook": <"BULLISH"|"BEARISH"|"NEUTRAL">,
    "forecastAvgPrice12mo": <number>,
    "forecastAvgPrice24mo": <number>,
    "monthlyHistory": [{"month":"<Mon YYYY>","price":<number>,"projected":false},...18 historical then 12 projected],
    "priceBullishDrivers": ["<3-4 factors>"],
    "priceBearishDrivers": ["<3-4 factors>"],
    "pricingVerdict": "<2-3 sentences>"
  }
}`
            }]
          })
        }).then(async r => {
          const data = await r.json();
          const raw = data.content?.map(b => b.text || "").join("").trim();
          const clean = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
          try { return JSON.parse(clean); }
          catch { const m = clean.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); throw new Error("Parse failed"); }
        })
      ]);

      if (newsResult.status === "fulfilled") liveNews = newsResult.value;
      if (aiResult.status === "rejected") throw new Error("AI report failed: " + aiResult.reason?.message);

      const parsed = aiResult.value;
      // Override news score with real data if available
      if (liveNews) parsed.newsScore = liveNews.score;

      clearInterval(intervalRef.current);
      setLoadStep(LOADING_STEPS.length - 1);
      setTimeout(() => {
        setReport(parsed);
        setNewsData(liveNews);
        setStatus("done");
      }, 400);

    } catch (err) {
      clearInterval(intervalRef.current);
      setError(err.message);
      setStatus("error");
    }
  }

  const currentYear = new Date().getFullYear();
  const signalColor = (s) => s >= 70 ? "green" : s >= 40 ? "blue" : "amber";

  const buildChartData = (hist) => {
    if (!hist) return [];
    return hist.map((d, i) => ({
      month: d.month,
      price: !d.projected ? d.price : (i === hist.findIndex(x => x.projected) ? d.price : null),
      forecast: d.projected ? d.price : (i === hist.findIndex(x => x.projected) - 1 ? d.price : null),
      projected: d.projected
    }));
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">T</div>
            <span className="logo-name">Trend<span>Pulse</span></span>
          </div>
          <div className="header-badge">Consumer Intelligence · {currentYear}</div>
        </header>

        <main className="main">
          <div className="hero">
            <h1>What's <em>trending</em> next?</h1>
            <p>AI-powered trend analysis with live news data from NewsAPI.org. Reddit and Google Trends integrations coming soon.</p>
          </div>

          <div style={{ marginBottom: 40 }}>
            <div className="search-box">
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && runAgent(query)} placeholder="e.g. wireless earbuds, skincare, electric bikes…" />
              <button className="run-btn" onClick={() => runAgent(query)} disabled={status === "loading" || !query.trim()}>Analyze →</button>
            </div>
            <div className="quick-tags">
              {QUICK_TAGS.map(t => <button key={t} className="quick-tag" onClick={() => { setQuery(t); runAgent(t); }}>{t}</button>)}
            </div>
          </div>

          {status === "loading" && (
            <div className="loading-wrap">
              <div className="loading-ring" />
              <div className="loading-steps-list">
                {LOADING_STEPS.map((s, i) => (
                  <div key={i} className={`loading-step-item ${i < loadStep ? "done" : i === loadStep ? "active" : ""}`} style={{ animationDelay: `${i * 0.08}s` }}>
                    {i < loadStep ? "✓ " : i === loadStep ? "→ " : "  "}{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "error" && <div className="error-box">⚠ {error}</div>}

          {status === "done" && report && (
            <div className="results">

              <div className="download-bar">
                <div className="download-bar-left">
                  <div className="download-bar-title">Report ready — "{report.category}"</div>
                  <div className="download-bar-sub">Downloads as HTML · open in browser and File → Print → Save as PDF</div>
                </div>
                <button className="download-btn" onClick={() => downloadHTML(report, newsData)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Report
                </button>
              </div>

              {/* Data legend */}
              <div className="data-legend">
                <div className="data-legend-item"><div className="legend-dot live"></div>Live data (NewsAPI.org)</div>
                <div className="data-legend-item"><div className="legend-dot ai"></div>AI estimate (Claude · knowledge cutoff early 2025)</div>
              </div>

              <div className="report-head">
                <div>
                  <div className="report-title">Trend Report</div>
                  <div className="report-category">"{report.category}" <em>analysis</em></div>
                </div>
                <div className="report-meta">
                  <span className="curve-pill">{report.trendCurveShape}</span>
                  <div style={{ marginTop: 6 }}>Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                </div>
              </div>

              {/* Signal scores */}
              <div className="section-heading">Signal Scores</div>
              <div className="three-col">
                <div className="stat-card">
                  <div className="stat-label">Google Search Interest <span className="ai-badge">AI</span></div>
                  <div className={`stat-value ${signalColor(report.googleTrendScore)}`}>{report.googleTrendScore}<span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>/100</span></div>
                  <div className="stat-sub">AI estimate · live integration coming</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Reddit Community Buzz <span className="ai-badge">AI</span></div>
                  <div className={`stat-value ${signalColor(report.redditScore)}`}>{report.redditScore}<span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>/100</span></div>
                  <div className="stat-sub">AI estimate · live integration coming</div>
                </div>
                <div className="stat-card live-data">
                  <div className="stat-label">News Coverage <span className="live-badge">LIVE</span></div>
                  <div className="stat-value teal">{report.newsScore}<span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>/100</span></div>
                  <div className="stat-sub">{newsData ? `${newsData.totalResults.toLocaleString()} articles in past 30 days` : "Via NewsAPI.org"}</div>
                </div>
              </div>

              {/* Live news articles */}
              {newsData?.articles?.length > 0 && (
                <div className="section-card" style={{ marginBottom: 20 }}>
                  <div className="news-articles-title">
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", display: "inline-block" }}></span>
                    Live News Articles — past 30 days ({newsData.totalResults.toLocaleString()} total found)
                  </div>
                  <div className="news-articles">
                    {newsData.articles.map((a, i) => (
                      <div key={i} className="news-article-item">
                        <div className="news-article-title">{a.title}</div>
                        <div className="news-article-meta">
                          <span className="news-article-source">{a.source}</span>
                          <span>{a.publishedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trend velocity */}
              <div className="section-card" style={{ marginBottom: 20 }}>
                <div className="section-heading">Trend Velocity <span className="ai-badge" style={{ fontSize: 9 }}>AI estimate</span></div>
                <ScoreBars past={report.pastScore} present={report.presentScore} future={report.futureScore} />
              </div>

              {/* Timeline */}
              <div className="section-heading">Timeline <span className="ai-badge" style={{ fontSize: 9 }}>AI estimate</span></div>
              <div className="three-col" style={{ marginBottom: 20 }}>
                {[
                  { period: "Last Year", year: currentYear - 1, summary: report.pastSummary, badge: report.pastTrendBadge },
                  { period: "This Year", year: currentYear, summary: report.presentSummary, badge: report.presentTrendBadge },
                  { period: "Forecast", year: currentYear + 1, summary: report.futureSummary, badge: report.futureTrendBadge, future: true }
                ].map(({ period, year, summary, badge, future }) => (
                  <div key={year} className={`timeline-card${future ? " future-card" : ""}`}>
                    <div className="tc-period">{period}</div>
                    <div className="tc-year">{year}</div>
                    {badge && <div className={`tc-badge ${badgeClass(badge)}`}><span>{badgeIcon(badge)}</span> {badge}</div>}
                    <div className="tc-body">{summary}</div>
                  </div>
                ))}
              </div>

              {/* Analyst report */}
              <div className="section-card" style={{ marginBottom: 20 }}>
                <div className="section-heading">Analyst Report <span className="ai-badge" style={{ fontSize: 9 }}>AI generated</span></div>
                <div className="report-body">{report.fullReport}</div>
              </div>

              {/* Pricing */}
              {report.pricing && (
                <>
                  <div className="section-heading">Price History &amp; Forecast <span className="ai-badge" style={{ fontSize: 9 }}>AI estimate</span></div>
                  <div className="section-card" style={{ marginBottom: 20 }}>
                    <div className="four-col" style={{ marginBottom: 24 }}>
                      <div className="stat-card"><div className="stat-label">Avg. Price Today</div><div className="stat-value blue">${report.pricing.currentAvgPrice?.toFixed(2)}</div><div className="stat-sub">${report.pricing.typicalPriceRangeLow}–${report.pricing.typicalPriceRangeHigh} typical</div></div>
                      <div className="stat-card"><div className="stat-label">Year-over-Year</div><div className={`stat-value ${report.pricing.priceChangeYoY >= 0 ? "green" : "red"}`}>{report.pricing.priceChangeYoY >= 0 ? "+" : ""}{report.pricing.priceChangeYoY?.toFixed(1)}%</div><div className="stat-sub">Trend: {report.pricing.priceTrend}</div></div>
                      <div className="stat-card"><div className="stat-label">12-Month Forecast</div><div className="stat-value purple">${report.pricing.forecastAvgPrice12mo?.toFixed(2)}</div><div className="stat-sub">Projected average</div></div>
                      <div className="stat-card"><div className="stat-label">24-Month Forecast</div><div className="stat-value purple">${report.pricing.forecastAvgPrice24mo?.toFixed(2)}</div><div className="stat-sub">Outlook: {report.pricing.priceOutlook}</div></div>
                    </div>
                    <div className="chart-legend">
                      <div className="cl-item"><div style={{ width: 18, height: 2, background: "#2563eb", borderRadius: 2 }}></div>Historical</div>
                      <div className="cl-item"><div style={{ width: 18, height: 0, borderTop: "2px dashed #7c3aed" }}></div>Projected</div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={buildChartData(report.pricing.monthlyHistory)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gHist" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.12}/><stop offset="100%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                          <linearGradient id="gProj" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity={0.1}/><stop offset="100%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f0ede6" strokeDasharray="4 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8c897e" }} axisLine={false} tickLine={false} interval={3} />
                        <YAxis tick={{ fontSize: 10, fill: "#8c897e" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={52} />
                        <Tooltip content={<ChartTooltip />} />
                        {report.pricing.monthlyHistory && (() => { const last = [...report.pricing.monthlyHistory].reverse().find(d => !d.projected); return last ? <ReferenceLine x={last.month} stroke="#d4d0c4" strokeDasharray="4 3" label={{ value: "Now", position: "insideTopRight", fill: "#8c897e", fontSize: 10 }} /> : null; })()}
                        <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} fill="url(#gHist)" dot={false} connectNulls={false} />
                        <Area type="monotone" dataKey="forecast" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 4" fill="url(#gProj)" dot={false} connectNulls={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="divider" />
                    <div className="two-col">
                      <div><div className="driver-col-label bull">↑ Price-Up Factors</div>{report.pricing.priceBullishDrivers?.map((d, i) => <div key={i} className="driver-item bull"><span>↑</span>{d}</div>)}</div>
                      <div><div className="driver-col-label bear">↓ Price-Down Factors</div>{report.pricing.priceBearishDrivers?.map((d, i) => <div key={i} className="driver-item bear"><span>↓</span>{d}</div>)}</div>
                    </div>
                    <div className="verdict-box"><div className="verdict-label">Verdict</div><div className="verdict-text">{report.pricing.pricingVerdict}</div></div>
                  </div>
                </>
              )}

              {/* Keywords */}
              <div className="section-card" style={{ marginBottom: 20 }}>
                <div className="section-heading">Keyword Signals <span className="ai-badge" style={{ fontSize: 9 }}>AI estimate</span></div>
                <div className="kw-group"><div className="kw-group-label">🔥 Rising Now</div><div className="chip-group">{report.hotKeywords?.map(k => <div key={k} className="chip hot">{k}</div>)}</div></div>
                <div className="kw-group"><div className="kw-group-label">📉 Fading</div><div className="chip-group">{report.warmKeywords?.map(k => <div key={k} className="chip warm">{k}</div>)}</div></div>
                <div className="kw-group"><div className="kw-group-label">❄️ Declining</div><div className="chip-group">{report.coldKeywords?.map(k => <div key={k} className="chip cold">{k}</div>)}</div></div>
                <div className="kw-group" style={{ marginBottom: 0 }}><div className="kw-group-label">💬 Reddit Communities</div><div className="chip-group">{report.topSubreddits?.map(r => <div key={r} className="chip sub">r/{r.replace(/^r\//, "")}</div>)}</div></div>
              </div>

              {/* Brands */}
              <div className="section-card" style={{ marginBottom: 20 }}>
                <div className="section-heading">Brand Intelligence <span className="ai-badge" style={{ fontSize: 9 }}>AI estimate</span></div>
                <div className="two-col">
                  <div><div className="kw-group-label" style={{ marginBottom: 10 }}>Leading Brands</div>{report.leadingBrands?.map((b, i) => <div key={b} className="brand-item lead"><div className="brand-rank lead">{i + 1}</div>{b}</div>)}</div>
                  <div><div className="kw-group-label" style={{ marginBottom: 10 }}>Rising Challengers</div>{report.risingBrands?.map(b => <div key={b} className="brand-item rise"><div className="brand-rank rise">↑</div>{b}</div>)}</div>
                </div>
              </div>

              {/* Products */}
              <div className="section-card" style={{ marginBottom: 20 }}>
                <div className="section-heading">Product Signals <span className="ai-badge" style={{ fontSize: 9 }}>AI estimate</span></div>
                <div className="kw-group-label" style={{ marginBottom: 10 }}>Trending Now</div>
                <div className="two-col" style={{ marginBottom: 16 }}>{report.topProducts?.map(p => <div key={p} className="product-item"><div className="p-status hot">↑ Trending</div>{p}</div>)}</div>
                <div className="kw-group-label" style={{ marginBottom: 10 }}>Losing Steam</div>
                <div className="two-col">{report.fadingProducts?.map(p => <div key={p} className="product-item fading"><div className="p-status fade">↓ Fading</div>{p}</div>)}</div>
              </div>

              {/* Sources */}
              <div className="section-heading">Data Sources &amp; Methodology</div>
              <div className="section-card">
                {DATA_SOURCES.map((src, i) => (
                  <div key={i} className="source-item">
                    <div className="source-num">{i + 1}</div>
                    <div>
                      <div className="source-name">{src.name} <span className={`source-tag ${src.tag}`}>{src.tag === "live" ? "LIVE DATA" : "AI ESTIMATE"}</span></div>
                      <div className="source-type">{src.type}</div>
                      <div className="source-desc">{src.desc}</div>
                    </div>
                  </div>
                ))}
                <div className="disclaimer-box" style={{ marginTop: 16 }}>
                  <strong>⚠ Disclaimer:</strong> News coverage is fetched live from NewsAPI.org. All other scores, prices, and forecasts are AI-generated estimates based on Claude's training data (knowledge cutoff early 2025). Always verify with primary sources before making financial, purchasing, or strategic decisions.
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </>
  );
}
