/* Shared shell: theme, header/footer, nav, day counter. Used by every page. */
'use strict';

const START_DATE = '2026-10-17'; // Day 1 (local time)
const TOTAL_DAYS = 33;
const NAV = [ // [href, label, optional Hindi label]
  ['index.html', 'Home'],
  ['routines.html', 'Routines', 'दिनचर्या'],
  ['plan.html', 'Chapter Plan'],
  ['lectures.html', 'Lectures'],
  ['papers.html', 'Papers'],
  ['material.html', 'Study Material']
];

/* localStorage wrapper: never throws (private mode, blocked storage) */
const store = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } }
};

/* Parse "YYYY-MM-DD" as a local-time date */
function parseLocalDate(text) {
  const [y, m, d] = text.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/* Day number relative to START_DATE: 1 = Day 1, 0 or less = before start */
function getDayNumber(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - parseLocalDate(START_DATE)) / 86400000) + 1;
}

function dayStatus(n) {
  if (n < 1) { const left = 1 - n; return `Starts in ${left} day${left === 1 ? '' : 's'}`; }
  if (n <= 15) return `Day ${n} of ${TOTAL_DAYS} | First pass (heavy chapters)`;
  if (n <= 23) return `Day ${n} of ${TOTAL_DAYS} | First pass (remaining chapters)`;
  if (n <= 27) return `Day ${n} of ${TOTAL_DAYS} | Compressed second pass`;
  if (n <= 33) return `Day ${n} of ${TOTAL_DAYS} | Full-paper phase`;
  if (n <= 35) return 'Buffer days';
  return 'Pre-boards started';
}

/* ----- Theme: saved choice, else system preference. Applied immediately to avoid a flash ----- */
const root = document.documentElement;
const savedTheme = store.get('pcm.theme');
root.dataset.theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function syncThemeButton(btn) {
  const dark = root.dataset.theme === 'dark';
  btn.textContent = dark ? '☀️' : '🌙';
  btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}

/* ----- Shell ----- */
document.addEventListener('DOMContentLoaded', () => {
  // Works with or without ".html" (Netlify pretty URLs)
  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
  const links = NAV.map(([href, label, hindi]) => {
    const current = href.replace(/\.html$/, '') === page ? ' aria-current="page"' : '';
    const hi = hindi ? ` <span class="hi" lang="hi">${hindi}</span>` : '';
    return `<li><a href="${href}"${current}>${label}${hi}</a></li>`;
  }).join('');

  // FIX: was class="bar", which clashed with the progress-bar ".bar" rule in style.css
  document.getElementById('site-header').innerHTML = `
    <div class="site-bar container">
      <a class="logo" href="index.html" aria-label="FOR PCM, home">FOR PCM</a>
      <button class="icon-btn" id="theme-toggle" type="button"></button>
      <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">☰</button>
      <nav class="site-nav" id="site-nav" aria-label="Main"><ul>${links}</ul></nav>
    </div>`;

  document.getElementById('site-footer').innerHTML = `
    <div class="container">
      <p><strong>FOR PCM | CBSE Class 12 | Boards 2027</strong></p>
      <p>Links point to official CBSE/NCERT and YouTube. We do not host copyrighted content.</p>
    </div>`;

  const themeBtn = document.getElementById('theme-toggle');
  syncThemeButton(themeBtn);
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('pcm.theme', root.dataset.theme);
    syncThemeButton(themeBtn);
  });

  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('site-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  // Day counter (home page only)
  const status = document.getElementById('day-status');
  if (status) status.textContent = dayStatus(getDayNumber());
});