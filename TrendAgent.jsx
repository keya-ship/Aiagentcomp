import { useState, useEffect, useRef } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: #2a2a2a;
    --accent: #e8ff47;
    --accent2: #ff6b35;
    --accent3: #4ecdc4;
    --text: #f0f0f0;
    --muted: #666;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

  .app {
    min-height: 100vh;
    padding: 0;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 0%, rgba(232,255,71,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 100%, rgba(78,205,196,0.05) 0%, transparent 60%);
  }

  .header {
    border-bottom: 1px solid var(--border);
    padding: 28px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .logo-mark {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    background: rgba(232,255,71,0.1);
    border: 1px solid rgba(232,255,71,0.3);
    padding: 3px 8px;
    border-radius: 3px;
    letter-spacing: 0.08em;
  }

  .logo-name {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .badge {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 64px 48px;
  }

  .hero {
    margin-bottom: 64px;
  }

  .hero h1 {
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.04em;
    margin-bottom: 20px;
  }

  .hero h1 span {
    color: var(--accent);
  }

  .hero p {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .search-section {
    margin-bottom: 56px;
  }

  .search-row {
    display: flex;
    gap: 12px;
    align-items: stretch;
    margin-bottom: 20px;
  }

  .input-wrap {
    flex: 1;
    position: relative;
  }

  .input-wrap input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 600;
    padding: 18px 24px;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: -0.01em;
  }

  .input-wrap input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(232,255,71,0.1);
  }

  .input-wrap input::placeholder { color: var(--muted); font-weight: 400; }

  .run-btn {
    background: var(--accent);
    color: #0a0a0a;
    border: none;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 18px 36px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    white-space: nowrap;
  }

  .run-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(232,255,71,0.3);
  }

  .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .quick-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .quick-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    border: 1px solid var(--border);
    background: transparent;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.04em;
  }

  .quick-tag:hover {
    color: var(--accent);
    border-color: rgba(232,255,71,0.4);
    background: rgba(232,255,71,0.05);
  }

  /* Loading */
  .loading-section {
    padding: 80px 0;
    text-align: center;
  }

  .loading-orb {
    width: 80px;
    height: 80px;
    margin: 0 auto 32px;
    border-radius: 50%;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    animation: spin 1s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .loading-step {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 0.06em;
    opacity: 0;
    animation: fadeUp 0.4s ease forwards;
  }

  .loading-step.active { color: var(--accent); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Results */
  .results {
    animation: fadeUp 0.5s ease forwards;
  }

  .results-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .results-title {
    font-size: 13px;
    font-family: var(--font-mono);
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .results-category {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-top: 4px;
  }

  .results-category span { color: var(--accent); }

  .results-meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    text-align: right;
    line-height: 1.8;
  }

  /* Signal bars */
  .signals-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }

  .signal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .signal-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }

  .signal-card.google::before { background: var(--accent); }
  .signal-card.reddit::before { background: var(--accent2); }
  .signal-card.news::before { background: var(--accent3); }

  .signal-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }

  .signal-score {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 8px;
  }

  .signal-card.google .signal-score { color: var(--accent); }
  .signal-card.reddit .signal-score { color: var(--accent2); }
  .signal-card.news .signal-score { color: var(--accent3); }

  .signal-desc {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    line-height: 1.6;
  }

  /* Timeline cards */
  .timeline {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 40px;
  }

  .timeline-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 28px;
  }

  .timeline-card.future {
    border-color: rgba(232,255,71,0.3);
    background: rgba(232,255,71,0.03);
  }

  .timeline-period {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .timeline-card.future .timeline-period { color: var(--accent); }

  .timeline-year {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }

  .timeline-body {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    line-height: 1.8;
  }

  .trend-badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: 3px;
    margin-bottom: 12px;
  }

  .trend-badge.up { background: rgba(232,255,71,0.15); color: var(--accent); }
  .trend-badge.peak { background: rgba(255,107,53,0.15); color: var(--accent2); }
  .trend-badge.emerging { background: rgba(78,205,196,0.15); color: var(--accent3); }

  /* Main report */
  .report-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 40px;
    margin-bottom: 32px;
  }

  .section-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 20px;
  }

  .report-text {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.9;
    color: #ccc;
    white-space: pre-wrap;
  }

  /* keywords */
  .keywords-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .keyword-chip {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 6px 14px;
    border-radius: 4px;
    border: 1px solid var(--border);
    color: var(--muted);
    letter-spacing: 0.04em;
  }

  .keyword-chip.hot {
    border-color: rgba(232,255,71,0.4);
    color: var(--accent);
    background: rgba(232,255,71,0.05);
  }

  .keyword-chip.warm {
    border-color: rgba(255,107,53,0.3);
    color: var(--accent2);
    background: rgba(255,107,53,0.05);
  }

  /* Trend meter */
  .meter-wrap { margin-bottom: 40px; }
  .meter-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }

  .meter-track {
    height: 6px;
    background: var(--surface2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
  }

  .meter-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1s cubic-bezier(0.16,1,0.3,1);
  }

  .meter-fill.past { background: var(--muted); }
  .meter-fill.present { background: var(--accent2); }
  .meter-fill.future { background: var(--accent); }

  .error-box {
    background: rgba(255,107,53,0.08);
    border: 1px solid rgba(255,107,53,0.3);
    border-radius: 8px;
    padding: 28px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent2);
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 0;
  }

  .brand-col-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .brand-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 10px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    color: var(--text);
    margin-bottom: 8px;
    letter-spacing: 0.02em;
  }

  .brand-chip.leading {
    border-color: rgba(232,255,71,0.3);
    background: rgba(232,255,71,0.04);
  }

  .brand-chip.rising {
    border-color: rgba(78,205,196,0.3);
    background: rgba(78,205,196,0.04);
  }

  .brand-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .brand-dot.leading { background: var(--accent); }
  .brand-dot.rising { background: var(--accent3); }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .product-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px 16px;
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1.5;
    color: #ccc;
    letter-spacing: 0.02em;
  }

  .product-card.fading {
    opacity: 0.5;
    text-decoration: line-through;
    color: var(--muted);
  }

  .product-card-label {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .product-card-label.hot { color: var(--accent); }
  .product-card-label.fading { color: var(--muted); text-decoration: none; }

  @media (max-width: 768px) {
    .header { padding: 20px 24px; }
    .main { padding: 40px 24px; }
    .signals-row, .timeline { grid-template-columns: 1fr; }
    .search-row { flex-direction: column; }
  }
`;

const QUICK_TAGS = [
  "portable tech", "stanley cups", "sneakers", "wireless earbuds",
  "skincare", "electric bikes", "smart home", "energy drinks"
];

function ScoreBar({ label, past, present, future }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);
  return (
    <div className="meter-wrap">
      <div className="meter-label"><span>{label}</span></div>
      {[["LAST YEAR", past, "past"], ["THIS YEAR", present, "present"], ["NEXT YEAR (PROJECTED)", future, "future"]].map(([l, v, cls]) => (
        <div key={l}>
          <div className="meter-label"><span>{l}</span><span>{v}/100</span></div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: mounted ? `${v}%` : "0%", background: cls === "past" ? "#444" : cls === "present" ? "#ff6b35" : "#e8ff47" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const LOADING_STEPS = [
  "→ pulling google trends data...",
  "→ scanning reddit communities...",
  "→ indexing news headlines...",
  "→ computing trend velocity...",
  "→ running forecast model...",
  "→ generating report..."
];

export default function TrendAgent() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [loadStep, setLoadStep] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  function startLoadingSteps() {
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      setLoadStep(step);
      if (step >= LOADING_STEPS.length - 1) clearInterval(intervalRef.current);
    }, 1800);
  }

  async function runAgent(category) {
    if (!category.trim()) return;
    setStatus("loading");
    setLoadStep(0);
    setReport(null);
    setError("");
    startLoadingSteps();

    const currentYear = new Date().getFullYear();
    const pastYear = currentYear - 1;
    const futureYear = currentYear + 1;

    const prompt = `You are a consumer trend forecasting agent. Your job is to analyze the product category "${category}" and generate a detailed trend report.

Using your knowledge of market trends, social media patterns, search behavior, Reddit community discussions, and news coverage, produce the following JSON object. Return ONLY the JSON, no markdown, no explanation.

{
  "category": "${category}",
  "googleTrendScore": <integer 0-100 representing current search interest>,
  "redditScore": <integer 0-100 representing reddit community buzz>,
  "newsScore": <integer 0-100 representing mainstream news coverage>,
  "pastScore": <integer 0-100 overall trend strength in ${pastYear}>,
  "presentScore": <integer 0-100 overall trend strength in ${currentYear}>,
  "futureScore": <integer 0-100 projected trend strength in ${futureYear}>,
  "pastTrendBadge": <"PEAKED" | "RISING" | "DECLINING" | "STEADY">,
  "presentTrendBadge": <"PEAKED" | "RISING" | "DECLINING" | "STEADY">,
  "futureTrendBadge": <"PEAKED" | "RISING" | "DECLINING" | "EMERGING">,
  "pastSummary": "<2-3 sentences about this category's trend story in ${pastYear}. What was driving interest? What happened?>",
  "presentSummary": "<2-3 sentences about where this category stands right now in ${currentYear}. Who is buying? What's the current narrative?>",
  "futureSummary": "<2-3 sentences forecasting ${futureYear}. What signals suggest what comes next? What should brands watch?>",
  "fullReport": "<Write 3 concise paragraphs: first covering the trend arc from ${pastYear} to ${futureYear} naming specific brands/products leading the space, second on consumer behavior signals, third with the top brand recommendation. Keep each paragraph to 3 sentences max.>",
  "hotKeywords": ["<5-7 trending keywords or search terms associated with this category right now>"],
  "warmKeywords": ["<4-6 keywords that were big last year but cooling>"],
  "coldKeywords": ["<3-5 keywords that have peaked and are declining>"],
  "topSubreddits": ["<3-4 subreddit names relevant to this category>"],
  "trendCurveShape": <"S-CURVE EARLY" | "S-CURVE GROWTH" | "S-CURVE PLATEAU" | "DECLINING" | "CYCLICAL" | "VOLATILE">,
  "leadingBrands": ["<4-5 brands currently dominating this category>"],
  "risingBrands": ["<3-4 up-and-coming or challenger brands to watch>"],
  "topProducts": ["<5-6 specific trending products in this category right now, be specific e.g. brand + product name>"],
  "fadingProducts": ["<3-4 specific products that peaked and are losing relevance>"]
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("").trim();
      // Strip markdown code fences if present
      const clean = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch (jsonErr) {
        // Try to extract JSON object from response
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error("Could not parse JSON from response. Raw: " + clean.slice(0, 200));
        }
      }
      clearInterval(intervalRef.current);
      setLoadStep(LOADING_STEPS.length - 1);
      setTimeout(() => { setReport(parsed); setStatus("done"); }, 600);
    } catch (err) {
      clearInterval(intervalRef.current);
      setError("Failed to generate report: " + err.message);
      setStatus("error");
    }
  }

  const badgeClass = (b) => {
    if (!b) return "";
    if (["RISING", "EMERGING", "S-CURVE GROWTH", "S-CURVE EARLY"].some(x => b.includes(x))) return "up";
    if (["PEAKED", "PLATEAU"].some(x => b.includes(x))) return "peak";
    return "emerging";
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-mark">AGENT</span>
            <span className="logo-name">TrendPulse</span>
          </div>
          <span className="badge">Consumer Trend Intelligence · {currentYear}</span>
        </header>

        <main className="main">
          <div className="hero">
            <h1>What's <span>trending</span><br />next?</h1>
            <p>Enter any product category and get an AI-powered trend report — past performance, present signals, and a data-driven forecast for what's coming.</p>
          </div>

          <div className="search-section">
            <div className="search-row">
              <div className="input-wrap">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && runAgent(query)}
                  placeholder="e.g. portable tech, stanley cups, sneakers..."
                />
              </div>
              <button className="run-btn" onClick={() => runAgent(query)} disabled={status === "loading" || !query.trim()}>
                Run Agent →
              </button>
            </div>
            <div className="quick-tags">
              {QUICK_TAGS.map(t => (
                <button key={t} className="quick-tag" onClick={() => { setQuery(t); runAgent(t); }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {status === "loading" && (
            <div className="loading-section">
              <div className="loading-orb" />
              <div className="loading-steps">
                {LOADING_STEPS.map((s, i) => (
                  <div key={i} className={`loading-step ${i <= loadStep ? "active" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    {i <= loadStep ? s : s.replace("→", "·")}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="error-box">⚠ {error}</div>
          )}

          {status === "done" && report && (
            <div className="results">
              <div className="results-header">
                <div>
                  <div className="results-title">Trend Report</div>
                  <div className="results-category">"{report.category}" <span>→</span></div>
                </div>
                <div className="results-meta">
                  <div>Curve shape: {report.trendCurveShape}</div>
                  <div>Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                  <div>Powered by TrendPulse Agent v1</div>
                </div>
              </div>

              {/* Signal scores */}
              <div className="signals-row">
                <div className="signal-card google">
                  <div className="signal-label">↑ Google Trends Signal</div>
                  <div className="signal-score">{report.googleTrendScore}</div>
                  <div className="signal-desc">Search interest index out of 100. High scores = high consumer intent.</div>
                </div>
                <div className="signal-card reddit">
                  <div className="signal-label">↑ Reddit Community Buzz</div>
                  <div className="signal-score">{report.redditScore}</div>
                  <div className="signal-desc">Organic community discussion intensity. Leading indicator of mainstream adoption.</div>
                </div>
                <div className="signal-card news">
                  <div className="signal-label">↑ News Coverage Index</div>
                  <div className="signal-score">{report.newsScore}</div>
                  <div className="signal-desc">Mainstream press attention. High scores can signal peak or acceleration.</div>
                </div>
              </div>

              {/* Trend meter */}
              <div className="report-section">
                <div className="section-label">// Trend Velocity Scores</div>
                <ScoreBar label={report.category} past={report.pastScore} present={report.presentScore} future={report.futureScore} />
              </div>

              {/* Timeline */}
              <div className="timeline">
                {[
                  { period: "Last Year", year: currentYear - 1, summary: report.pastSummary, badge: report.pastTrendBadge },
                  { period: "This Year", year: currentYear, summary: report.presentSummary, badge: report.presentTrendBadge },
                  { period: "Next Year — Forecast", year: currentYear + 1, summary: report.futureSummary, badge: report.futureTrendBadge, future: true }
                ].map(({ period, year, summary, badge, future }) => (
                  <div key={year} className={`timeline-card${future ? " future" : ""}`}>
                    <div className="timeline-period">{period}</div>
                    <div className="timeline-year">{year}</div>
                    {badge && <div className={`trend-badge ${badgeClass(badge)}`}>{badge}</div>}
                    <div className="timeline-body">{summary}</div>
                  </div>
                ))}
              </div>

              {/* Full report */}
              <div className="report-section">
                <div className="section-label">// Analyst Report</div>
                <div className="report-text">{report.fullReport}</div>
              </div>

              {/* Keywords */}
              <div className="report-section">
                <div className="section-label">// Keyword Signal Map</div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>Hot — Rising Now</div>
                  <div className="keywords-grid">
                    {report.hotKeywords?.map(k => <div key={k} className="keyword-chip hot">{k}</div>)}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>Warm — Fading from Peak</div>
                  <div className="keywords-grid">
                    {report.warmKeywords?.map(k => <div key={k} className="keyword-chip warm">{k}</div>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>Cold — Declining Interest</div>
                  <div className="keywords-grid">
                    {report.coldKeywords?.map(k => <div key={k} className="keyword-chip">{k}</div>)}
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="report-section">
                <div className="section-label">// Brand Intelligence</div>
                <div className="brands-grid">
                  <div>
                    <div className="brand-col-label">⬤ Leading Brands</div>
                    {report.leadingBrands?.map(b => (
                      <div key={b} className="brand-chip leading">
                        <span className="brand-dot leading" />
                        {b}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="brand-col-label">⬤ Rising Challengers</div>
                    {report.risingBrands?.map(b => (
                      <div key={b} className="brand-chip rising">
                        <span className="brand-dot rising" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="report-section">
                <div className="section-label">// Product Signal Map</div>
                <div style={{marginBottom: 16}}>
                  <div className="brand-col-label" style={{marginBottom: 12}}>Trending Now</div>
                  <div className="products-grid">
                    {report.topProducts?.map(p => (
                      <div key={p} className="product-card">
                        <div className="product-card-label hot">↑ hot</div>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="brand-col-label" style={{marginBottom: 12}}>Losing Steam</div>
                  <div className="products-grid">
                    {report.fadingProducts?.map(p => (
                      <div key={p} className="product-card fading">
                        <div className="product-card-label fading">↓ fading</div>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subreddits */}
              <div className="report-section">
                <div className="section-label">// Reddit Signal Sources</div>
                <div className="keywords-grid">
                  {report.topSubreddits?.map(r => (
                    <div key={r} className="keyword-chip warm">r/{r.replace(/^r\//, "")}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
