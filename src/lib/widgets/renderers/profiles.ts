import { baseCss, badgeHtml, esc, ok } from "../base";
import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import { PLATFORM_CSS, SOFT, brandSvg, jsEsc, lines, platformCard } from "./kit";

type R = (c: WidgetConfig, items: TestimonialData[]) => RenderResult;

const BTN = `
.plk-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--w-accent); color: #fff;
  text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 16px; border: 0; cursor: pointer;
  border-radius: 999px; font-family: inherit; transition: transform 160ms cubic-bezier(0.23,1,0.32,1), filter 160ms ease; }
.plk-btn:hover { filter: brightness(1.06); }
.plk-btn:active { transform: scale(0.97); }
`;

const CARD = `
.plk-scard { max-width: 400px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 20px 22px; display: flex; flex-direction: column; gap: 10px; ${SOFT} }
.plk-scard strong { font-size: 15.5px; font-weight: 600; }
.plk-scard span { font-size: 13px; color: var(--w-muted); }
.plk-scard .plk-stat { display: flex; gap: 18px; }
.plk-scard .plk-stat div { display: flex; flex-direction: column; gap: 1px; }
.plk-scard .plk-stat b { font-size: 18px; font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.plk-scard .plk-stat span { font-size: 11.5px; }
`;

/* ---- GitHub repo card (live API) ---- */
export const githubRepoCard: R = (c) => {
  const repo = String(c.link || "vercel/next.js").replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const html =
    '<div class="plk-wrap"><div class="plk-scard">' +
    '<strong style="display:flex;align-items:center;gap:8px">' + brandSvg("github", 18) + '<span id="plk-ghname">' + esc(repo) + "</span></strong>" +
    '<div class="plk-stat"><div><b id="plk-ghs">—</b><span>stars</span></div>' +
    '<div><b id="plk-ghf">—</b><span>forks</span></div><div><b id="plk-ghl">—</b><span>lang</span></div></div>' +
    '<a class="plk-btn" href="https://github.com/' + esc(repo) + '" target="_blank" rel="noopener">View on GitHub ↗</a>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + CARD + `
.plk-scard .plk-btn { justify-content: center; }
`);
  const js =
    "fetch('https://api.github.com/repos/" + jsEsc(repo) + "').then(function(r){return r.json()}).then(function(d){" +
    "shadow.getElementById('plk-ghname').textContent=d.full_name||'" + jsEsc(repo) + "';" +
    "shadow.getElementById('plk-ghs').textContent=(d.stargazers_count>=1000?(d.stargazers_count/1000).toFixed(1)+'k':d.stargazers_count)||'—';" +
    "shadow.getElementById('plk-ghf').textContent=(d.forks_count>=1000?(d.forks_count/1000).toFixed(1)+'k':d.forks_count)||'—';" +
    "shadow.getElementById('plk-ghl').textContent=d.language||'—'})" +
    ".catch(function(){});";
  return ok({ html, css, js });
};

/* ---- GitHub contributions graph (keyless chart image) ---- */
export const githubContributionsGraph: R = (c) => {
  const user = String(c.link || "").replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const html =
    '<div class="plk-wrap"><div class="plk-ghchart">' +
    '<strong>' + esc(user) + "'s year</strong>" +
    '<img src="https://ghchart.rsshub.app/' + esc(user) + '" alt="GitHub contributions" loading="lazy">' +
    '<a href="https://github.com/' + esc(user) + '" target="_blank" rel="noopener">github.com/' + esc(user) + " ↗</a>" +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-ghchart { max-width: 720px; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 20px 22px; display: flex; flex-direction: column; gap: 12px; ${SOFT} }
.plk-ghchart strong { font-size: 14.5px; font-weight: 600; }
.plk-ghchart img { width: 100%; height: auto; display: block; border-radius: 8px; }
.plk-ghchart a { font-size: 12.5px; color: var(--w-accent); text-decoration: none; }
.plk-ghchart a:hover { text-decoration: underline; }
`);
  return ok({ html, css });
};

/* ---- Product Hunt / Chrome store / Steam / Strava link cards ---- */
function linkCard(brand: string, cta: string): R {
  return (c) => {
    const html =
      '<div class="plk-wrap"><div class="plk-pcards">' +
      platformCard(brand, String(c.link || "#"), String(c.text || cta), cta) +
      "</div>" + badgeHtml(c.showBadge) + "</div>";
    const css = baseCss(c, `
.plk-wrap { padding: var(--w-pad); }
` + PLATFORM_CSS + `
.plk-pcards { max-width: 400px; margin-inline: auto; }
.plk-pm { color: var(--w-accent); }
`);
    return ok({ html, css });
  };
}
export const productHuntCard = linkCard("producthunt", "View on Product Hunt");
export const chromeExtensionReviewsCard = linkCard("chrome", "View on the Chrome Web Store");
export const steamProfile = linkCard("steam", "View on Steam");
export const stravaActivity = linkCard("strava", "View on Strava");

/* ---- App Store rating card (live iTunes lookup) ---- */
export const appStoreRatingCard: R = (c) => {
  const raw = String(c.link || "");
  const idm = /id(\d+)/.exec(raw);
  const appId = idm ? idm[1] : raw.replace(/\D/g, "");
  const html =
    '<div class="plk-wrap"><div class="plk-scard">' +
    '<strong style="display:flex;align-items:center;gap:8px">' + brandSvg("apple", 18) + '<span id="plk-asname">' + esc(c.text || "App") + "</span></strong>" +
    '<div class="plk-stat"><div><b id="plk-asr">—</b><span>rating</span></div>' +
    '<div><b id="plk-asc">—</b><span>ratings</span></div><div><b id="plk-asp">—</b><span>price</span></div></div>' +
    '<a class="plk-btn" href="' + esc(raw || "#") + '" target="_blank" rel="noopener">View on the App Store ↗</a>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + CARD);
  const js =
    "fetch('/api/fetch?url=' + encodeURIComponent('https://itunes.apple.com/lookup?id=" + jsEsc(appId) + "'))" +
    ".then(function(r){return r.json()}).then(function(d){var a=d.results&&d.results[0];if(!a)throw 0;" +
    "shadow.getElementById('plk-asname').textContent=a.trackName||'" + jsEsc(c.text || "") + "';" +
    "shadow.getElementById('plk-asr').textContent=a.averageUserRating?a.averageUserRating.toFixed(1):'—';" +
    "shadow.getElementById('plk-asc').textContent=a.userRatingCount?a.userRatingCount.toLocaleString():'—';" +
    "shadow.getElementById('plk-asp').textContent=a.formattedPrice||'—'})" +
    ".catch(function(){});";
  return ok({ html, css, js });
};

/* ---- Goodreads shelf ---- */
export const goodreadsShelf: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [author, stars] = (r.right || "").split("|").map((s) => s.trim());
    return { title: r.left, author: author || "", stars: stars || "" };
  });
  const html =
    '<div class="plk-wrap"><div class="plk-scard" style="max-width:440px"><strong>Currently reading</strong>' +
    '<div class="plk-shelf">' +
    rows.map((r) => '<div class="plk-shelfrow"><span class="plk-shelft"><strong>' + esc(r.title) + "</strong><span>" + esc(r.author) + '</span></span><span class="plk-shelfs">' + esc(r.stars) + "</span></div>").join("") +
    "</div></div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-shelf { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.plk-shelfrow { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  border-bottom: 1px solid var(--w-line); padding-bottom: 10px; }
.plk-shelfrow:last-child { border-bottom: 0; padding-bottom: 0; }
.plk-shelft { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.plk-shelft strong { font-size: 14px; font-weight: 600; }
.plk-shelft span { font-size: 12.5px; color: var(--w-muted); }
.plk-shelfs { font-size: 13px; color: var(--w-accent); flex-shrink: 0; letter-spacing: 2px; }
`);
  return ok({ html, css });
};

/* ---- Letterboxd films ---- */
export const letterboxdFilms: R = (c) => {
  const rows = lines(c.items).map((r) => {
    const [year, stars] = (r.right || "").split("|").map((s) => s.trim());
    return { title: r.left, year: year || "", stars: stars || "" };
  });
  const hues = rows.map((_, i) => (200 + i * 47) % 360);
  const html =
    '<div class="plk-wrap"><div class="plk-films">' +
    rows
      .map(
        (r, i) =>
          '<div class="plk-film"><span class="plk-filmposter" style="background:oklch(0.4 0.08 ' + hues[i] + ')" aria-hidden="true"></span>' +
          "<strong>" + esc(r.title) + "</strong><span>" + esc(r.year) + "</span><em>" + esc(r.stars) + "</em></div>"
      )
      .join("") +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-films { display: flex; gap: var(--w-gap); justify-content: center; flex-wrap: wrap; padding: var(--w-pad); }
.plk-film { width: 130px; background: var(--w-card); border: 1px solid var(--w-line); border-radius: var(--w-radius);
  padding: 12px; display: flex; flex-direction: column; gap: 2px; ${SOFT} }
.plk-filmposter { width: 100%; aspect-ratio: 2 / 3; border-radius: 8px; display: block; margin-bottom: 8px; }
.plk-film strong { font-size: 13px; font-weight: 600; line-height: 1.25; }
.plk-film span { font-size: 11.5px; color: var(--w-muted); }
.plk-film em { font-style: normal; font-size: 11.5px; color: var(--w-accent); letter-spacing: 1px; }
`);
  return ok({ html, css });
};

/* ---- Chess.com stats (live via proxy) ---- */
export const chessStats: R = (c) => {
  const user = String(c.link || "").replace(/^https?:\/\/(www\.)?chess\.com\/member\//, "").trim();
  const html =
    '<div class="plk-wrap"><div class="plk-scard">' +
    '<strong>' + esc(user) + " · Chess.com</strong>" +
    '<div class="plk-stat"><div><b id="plk-chb">—</b><span>blitz</span></div>' +
    '<div><b id="plk-chr">—</b><span>rapid</span></div><div><b id="plk-cht">—</b><span>tactics</span></div></div>' +
    '<a class="plk-btn" href="https://www.chess.com/member/' + esc(user) + '" target="_blank" rel="noopener">View profile ↗</a>' +
    "</div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, BTN + CARD + `
.plk-scard .plk-btn { justify-content: center; }
`);
  const js =
    "var u='" + jsEsc(user) + "';" +
    "Promise.all([" +
    "fetch('/api/fetch?url='+encodeURIComponent('https://api.chess.com/pub/player/'+u+'/stats')).then(function(r){return r.json()})," +
    "]).then(function(s){var d=s[0];" +
    "shadow.getElementById('plk-chb').textContent=(d.chess_blitz&&d.chess_blitz.last&&d.chess_blitz.last.rating)||'—';" +
    "shadow.getElementById('plk-chr').textContent=(d.chess_rapid&&d.chess_rapid.last&&d.chess_rapid.last.rating)||'—';" +
    "shadow.getElementById('plk-cht').textContent=(d.tactics&&d.tactics.last&&d.tactics.last.rating)||'—'})" +
    ".catch(function(){});";
  return ok({ html, css, js });
};

/* ---- Duolingo streak ---- */
export const duolingoStreak: R = (c) => {
  const days = Math.max(1, Number(lines(c.items)[0]?.left) || 1);
  const dots = Array.from({ length: Math.min(days, 35) });
  const html =
    '<div class="plk-wrap"><div class="plk-duo">' +
    "<strong>" + esc(c.text || days + "-day streak") + "</strong>" +
    '<div class="plk-duodots">' + dots.map(() => '<span class="plk-duodot"></span>').join("") + "</div>" +
    "<span>" + days + " days and counting</span></div>" + badgeHtml(c.showBadge) + "</div>";
  const css = baseCss(c, `
.plk-duo { width: fit-content; margin-inline: auto; background: var(--w-card); border: 1px solid var(--w-line);
  border-radius: var(--w-radius); padding: 22px 26px; display: flex; flex-direction: column; gap: 10px;
  align-items: center; text-align: center; ${SOFT} }
.plk-duo strong { font-size: 15px; font-weight: 600; }
.plk-duodots { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; max-width: 160px; }
.plk-duodot { width: 13px; height: 13px; border-radius: 999px;
  background: color-mix(in oklab, var(--w-accent) 65%, var(--w-card));
  opacity: 0; transform: scale(0.4);
  transition: opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 300ms cubic-bezier(0.23,1,0.32,1); }
.plk-duodot.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .plk-duodot { opacity: 1; transform: none; transition: none; } }
.plk-duo > span { font-size: 12.5px; color: var(--w-muted); }
`);
  const js =
    "var dots=shadow.querySelectorAll('.plk-duodot');" +
    "if(matchMedia('(prefers-reduced-motion: reduce)').matches){dots.forEach(function(d){d.classList.add('in')});return}" +
    "new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();" +
    "dots.forEach(function(d,i){setTimeout(function(){d.classList.add('in')},i*45)})},{threshold:0.4}).observe(shadow.querySelector('.plk-duo'));";
  return ok({ html, css, js });
};
