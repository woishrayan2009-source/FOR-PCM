/* Papers page: renders everything from data/papers.js.
   Uses store, parseLocalDate, getDayNumber and START_DATE from js/main.js. */
(function () {
  'use strict';

  const SUBS = [{ id: 'physics', name: 'Physics' }, { id: 'chemistry', name: 'Chemistry' }, { id: 'maths', name: 'Maths' }];
  const NAMES = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Maths' };
  const TABS = SUBS.concat([{ id: 'links', name: 'Official links' }, { id: 'method', name: 'How to solve' }]);
  const TAB_IDS = TABS.map((t) => t.id);
  const STATES = TEXT.status.map((o) => o.v);
  const STATUS_KEY = 'forpcm_papers_status';
  const ERR_KEY = 'forpcm_papers_errors';
  const TAB_KEY = 'forpcm_papers_tab';
  const $ = (sel) => document.querySelector(sel);
  const BANK_BY_N = {};
  BANK.forEach((r) => { BANK_BY_N[r.n] = r; });

  /* Small DOM builder (textContent only; null, false and undefined children/attributes are skipped) */
  function h(tag, attrs, ...kids) {
    const node = document.createElement(tag);
    for (const key in attrs || {}) {
      const v = attrs[key];
      if (v === false || v == null) continue;
      if (key === 'class') node.className = v;
      else if (key === 'text') node.textContent = v;
      else node.setAttribute(key, v === true ? '' : v);
    }
    kids.forEach((k) => { if (k != null && k !== false) node.append(k); });
    return node;
  }
  const tag = (text) => h('span', { class: 'tag', text });

  /* ===== Dates (local time) ===== */
  const pad = (n) => String(n).padStart(2, '0');
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const start = parseLocalDate(START_DATE);
  const dateOfDay = (day) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + day - 1);
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const shortDate = (d) => `${WD[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`;
  const longDate = (d) => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const TODAY = getDayNumber(); // plan day number; outside 1-35 simply matches nothing

  /* ===== Saved state ===== */
  function load(key) { try { return JSON.parse(store.get(key)); } catch (e) { return null; } }
  function persist(key, value) { store.set(key, JSON.stringify(value)); }

  let status = {}; // { "physics-11": { s, d, m } }
  const savedStatus = load(STATUS_KEY);
  if (savedStatus && typeof savedStatus === 'object' && !Array.isArray(savedStatus)) status = savedStatus;

  let errors = []; // [{ id, subject, paper, chapter, type, note }]
  const savedErrors = load(ERR_KEY);
  if (Array.isArray(savedErrors)) {
    errors = savedErrors.filter((e) => e && NAMES[e.subject] && BANK_BY_N[e.paper] &&
      typeof e.id === 'string' && typeof e.chapter === 'string' && typeof e.type === 'string');
  }

  // Safe read: ignores anything in storage that is not valid
  function read(sub, n) {
    const r = status[sub + '-' + n] || {};
    return {
      s: STATES.includes(r.s) ? r.s : 'none',
      d: typeof r.d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.d) ? r.d : '',
      m: typeof r.m === 'number' && isFinite(r.m) && r.m >= 0 && r.m <= MAXMARKS[sub] ? r.m : null
    };
  }
  function update(sub, n, patch) {
    const k = sub + '-' + n;
    status[k] = Object.assign({}, status[k], patch);
    persist(STATUS_KEY, status);
    sync();
  }
  // Marking a paper Solved or Reviewed fills today's date if there is none yet
  function setState(sub, n, s) {
    const patch = { s };
    if (s !== 'none' && !read(sub, n).d) patch.d = isoDate(new Date());
    update(sub, n, patch);
  }
  const keyOf = (k, sub) => (k && typeof k === 'object' ? k[sub] : k);
  const paperLabel = (r) => `#${r.n} ${r.year}`;

  /* Registries refreshed by sync() */
  const checks = [], controls = [], painters = [];

  /* ===== Building blocks ===== */
  // Link button; hidden (null) when the key is not in LINKS
  function linkBtn(key, label, context) {
    const l = LINKS[key];
    if (!l) return null;
    return h('span', { class: 'link-cell' },
      h('a', { class: 'btn btn-outline btn-sm', href: l.url, target: '_blank', rel: 'noopener noreferrer' }, label,
        h('span', { class: 'sr-only', text: ` for ${context} (opens in a new tab)` })),
      l.unverified ? tag('Not verified') : null);
  }

  // "Done" checkbox: ticked while the paper's status is Solved or Reviewed
  function doneBox(sub, n, context) {
    const input = h('input', { type: 'checkbox', 'aria-label': `Done: ${context}` });
    input.addEventListener('change', () => setState(sub, n, input.checked ? 'solved' : 'none'));
    checks.push({ input, sub, n });
    return h('label', { class: 'check' }, input, h('span', { text: 'Done' }));
  }

  const wrapTable = (caption, tableClass, headers, body) => h('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': caption + ' (scrolls sideways on small screens)' },
    h('table', { class: 'p-table ' + tableClass },
      h('caption', { class: 'sr-only', text: caption }),
      h('thead', {}, h('tr', {}, ...headers)),
      h('tbody', {}, ...body)));
  const th = (text, cls) => h('th', { scope: 'col', class: cls, text });

  /* ===== Subject tab blocks ===== */
  function paperCells(sub, n, withDone) {
    const r = BANK_BY_N[n];
    const ctx = `${NAMES[sub]}, ${paperLabel(r)}`;
    return [
      h('td', { 'data-label': 'Paper to solve' }, h('strong', { text: paperLabel(r) }), h('br'), h('span', { class: 'small', text: r.type })),
      h('td', { class: 'no-print', 'data-label': 'Source' }, linkBtn(keyOf(r.sourceKey, sub), 'Source', ctx)),
      h('td', { class: 'no-print', 'data-label': 'Marking scheme' }, linkBtn(keyOf(r.msKey, sub), 'Marking scheme', ctx)),
      h('td', { 'data-label': 'Done' }, withDone ? doneBox(sub, n, ctx) : null)
    ];
  }

  function dayCell(day) {
    const today = day === TODAY;
    return h('th', { scope: 'row', class: 'daycell', 'data-label': 'Day / Date' },
      h('strong', { text: `Day ${day}` }), h('span', { text: shortDate(dateOfDay(day)) }),
      today ? h('span', { class: 'today-tag', text: 'Today' }) : null);
  }

  function fourCard(sub) {
    const rows = PHASE_PAPERS[sub].map((p) => {
      const tr = h('tr', { class: p.day === TODAY ? 'today' : null }, dayCell(p.day), ...paperCells(sub, p.bank, true));
      if (p.day === TODAY) tr.setAttribute('aria-current', 'date');
      return tr;
    });
    return h('div', { class: 'card p-card p4' },
      h('p', { class: 'print-only p-subject', text: NAMES[sub] }),
      h('h2', { text: TEXT.fourTitle }),
      wrapTable(`${NAMES[sub]}: papers for Days 28-33`, 'paper-table',
        [th('Day / Date'), th('Paper to solve'), th('Source', 'no-print'), th('Marking scheme', 'no-print'), th('Done')], rows),
      h('p', { text: TEXT.sitting }),
      h('p', { class: 'small', text: TEXT.orderNote }));
  }

  function bufferCard(sub) {
    const items = BUFFER.map((b) => {
      const r = BANK_BY_N[b.bank];
      const ctx = `${NAMES[sub]}, ${paperLabel(r)}`;
      return h('li', { class: 'buffer-item' + (b.day === TODAY ? ' today' : '') },
        h('strong', { text: shortDate(dateOfDay(b.day)) }), h('span', { text: paperLabel(r) }),
        h('span', { class: 'btn-row' },
          linkBtn(keyOf(r.sourceKey, sub), 'Source', ctx), linkBtn(keyOf(r.msKey, sub), 'Marking scheme', ctx), doneBox(sub, b.bank, ctx)));
    });
    return h('div', { class: 'card p-card' }, h('h2', { text: TEXT.bufferTitle }),
      h('p', { class: 'small', text: TEXT.bufferNote }), h('ul', { class: 'buffer-list' }, ...items));
  }

  function bankCard(sub) {
    const max = MAXMARKS[sub];
    const rows = BANK.map((r) => {
      const ctx = `${NAMES[sub]} paper ${r.n}, ${r.year}`;
      const sel = h('select', { 'aria-label': `Status: ${ctx}` }, ...TEXT.status.map((o) => h('option', { value: o.v, text: o.label })));
      const date = h('input', { type: 'date', 'aria-label': `Date solved: ${ctx}` });
      const errId = `err-${sub}-${r.n}`;
      const err = h('span', { class: 'field-err', id: errId, role: 'alert' });
      const score = h('input', { type: 'number', min: 0, max, step: '0.5', inputmode: 'decimal', 'aria-label': `Score out of ${max}: ${ctx}`, 'aria-describedby': errId });

      sel.addEventListener('change', () => setState(sub, r.n, sel.value));
      date.addEventListener('change', () => update(sub, r.n, { d: date.value }));
      score.addEventListener('change', () => {
        const raw = score.value.trim();
        if (raw === '' && !(score.validity && score.validity.badInput)) { update(sub, r.n, { m: null }); return; }
        const v = Number(raw);
        if (!isFinite(v) || raw === '' || v < 0 || v > max) { // invalid: keep what was typed, show the message
          score.setAttribute('aria-invalid', 'true');
          err.textContent = `Enter a score from 0 to ${max}.`;
          return;
        }
        update(sub, r.n, { m: v });
      });
      controls.push({ sub, n: r.n, sel, date, score, err });

      return h('tr', {},
        h('th', { scope: 'row', 'data-label': '#', text: r.n }),
        h('td', { 'data-label': 'Group', text: r.group }),
        h('td', { 'data-label': 'Year / Paper' }, r.year, r.flag ? ' ' : null, r.flag ? tag(r.flag) : null),
        h('td', { 'data-label': 'Type', text: r.type }),
        h('td', { 'data-label': 'How to use', text: r.use }),
        h('td', { 'data-label': 'Source' }, linkBtn(keyOf(r.sourceKey, sub), 'Source', ctx)),
        h('td', { 'data-label': 'Marking scheme' }, linkBtn(keyOf(r.msKey, sub), 'Marking scheme', ctx)),
        h('td', { 'data-label': 'Status' }, sel),
        h('td', { 'data-label': 'Date solved' }, date),
        h('td', { 'data-label': `Score (max ${max})` }, score, err));
    });
    return h('div', { class: 'card p-card' }, h('h2', { text: `Paper bank (${BANK.length})` }),
      wrapTable(`${NAMES[sub]} paper bank`, 'bank-table',
        [th('#'), th('Group'), th('Year / Paper'), th('Type'), th('How to use'), th('Source'), th('Marking scheme'), th('Status'), th('Date solved'), th(`Score (max ${max})`)], rows),
      ...TEXT.bankNotes.map((t) => h('p', { class: 'small', text: t })));
  }

  function trackerCard(sub) {
    const max = MAXMARKS[sub];
    const list = h('ul', { class: 'bars' });
    const stats = h('p', { class: 'stats' });
    painters.push(() => {
      const scored = BANK.map((r) => ({ r, m: read(sub, r.n).m, d: read(sub, r.n).d })).filter((x) => x.m != null);
      list.replaceChildren(...scored.map((x) => {
        const pct = Math.round((x.m / max) * 100);
        const fill = h('span', { class: 'bar-fill' });
        fill.style.width = pct + '%';
        return h('li', {}, h('span', { text: paperLabel(x.r) }), h('span', { class: 'bar', 'aria-hidden': 'true' }, fill), h('span', { text: `${x.m}/${max} (${pct}%)` }));
      }));
      if (!scored.length) { stats.textContent = 'No scores yet. Add a score in the paper bank above.'; return; }
      const avg = Math.round((scored.reduce((sum, x) => sum + (x.m / max) * 100, 0) / scored.length) * 10) / 10;
      // Latest = latest date solved; without dates, the highest paper number
      const latest = scored.reduce((a, b) => ((b.d + String(1000 + b.r.n)) > (a.d + String(1000 + a.r.n)) ? b : a));
      stats.textContent = `Average: ${avg}% | Latest: ${latest.m}/${max} (${Math.round((latest.m / max) * 100)}%), ${paperLabel(latest.r)}`;
    });
    return h('div', { class: 'card p-card' }, h('h2', { text: 'Score tracker' }), list, stats);
  }

  /* ----- Error log ----- */
  function dueText(sub, e) {
    const d = read(sub, e.paper).d;
    return d ? `Re-solve due: ${longDate(addDays(parseLocalDate(d), 3))}` : 'Add a date solved';
  }

  function copyText(text) {
    const fallback = () => {
      const prev = document.activeElement;
      const ta = h('textarea', { class: 'sr-only', 'aria-hidden': 'true' });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { /* ignore */ }
      ta.remove();
      if (prev && prev.focus) prev.focus();
      return ok;
    };
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, fallback);
    return Promise.resolve(fallback());
  }

  function errorCard(sub) {
    const id = (x) => `e-${sub}-${x}`;
    const field = (label, control, cls) => h('div', { class: 'field' + (cls ? ' ' + cls : '') }, h('label', { for: control.id, text: label }), control);
    const paperSel = h('select', { id: id('paper'), required: true }, ...BANK.map((r) => h('option', { value: r.n, text: paperLabel(r) })));
    const chapter = h('input', { id: id('chapter'), type: 'text', required: true, maxlength: 100, autocomplete: 'off' });
    const typeSel = h('select', { id: id('type') }, ...TEXT.mistakes.map((t) => h('option', { value: t, text: t })));
    const note = h('textarea', { id: id('note'), rows: 3, maxlength: 300 });
    const msg = h('p', { class: 'small', role: 'status' });
    const title = h('h2', { text: 'Error log', tabindex: '-1' });
    const list = h('ul', { class: 'err-list' });
    const empty = h('p', { class: 'small', text: 'No entries yet.' });
    const mine = () => errors.filter((e) => e.subject === sub);

    const form = h('form', { class: 'err-form' },
      field('Paper', paperSel), field('Chapter', chapter), field('Mistake type', typeSel), field('Note', note, 'wide'),
      h('div', { class: 'wide' }, h('button', { class: 'btn', type: 'submit', text: 'Add entry' })));
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const ch = chapter.value.trim();
      if (!ch) { msg.textContent = 'Enter the chapter.'; chapter.focus(); return; }
      errors.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), subject: sub, paper: Number(paperSel.value), chapter: ch, type: typeSel.value, note: note.value.trim() });
      persist(ERR_KEY, errors);
      chapter.value = ''; note.value = '';
      msg.textContent = 'Entry added.';
      sync();
    });

    const copy = h('button', { class: 'btn btn-outline', type: 'button', text: 'Copy log as text' });
    copy.addEventListener('click', () => {
      const entries = mine();
      if (!entries.length) { msg.textContent = 'Nothing to copy yet.'; return; }
      const lines = [`FOR PCM error log: ${NAMES[sub]}`].concat(entries.map((e, i) =>
        `${i + 1}. ${paperLabel(BANK_BY_N[e.paper])} | ${e.chapter} | ${e.type}` + (e.note ? ` | ${e.note}` : '') + ` | ${dueText(sub, e)}`));
      copyText(lines.join('\n')).then((ok) => { msg.textContent = ok ? 'Log copied.' : 'Could not copy. Select the entries and copy them manually.'; });
    });

    painters.push(() => {
      const entries = mine();
      empty.hidden = entries.length > 0;
      list.replaceChildren(...entries.map((e) => {
        const r = BANK_BY_N[e.paper];
        const del = h('button', { class: 'btn btn-outline btn-sm', type: 'button' }, 'Delete', h('span', { class: 'sr-only', text: `: ${paperLabel(r)}, ${e.chapter}` }));
        del.addEventListener('click', () => {
          errors = errors.filter((x) => x.id !== e.id);
          persist(ERR_KEY, errors);
          msg.textContent = 'Entry deleted.';
          sync();
          title.focus();
        });
        return h('li', { class: 'err-item' },
          h('p', { class: 'err-head' }, h('strong', { text: paperLabel(r) }), ' ', e.chapter, ' ', tag(e.type)),
          e.note ? h('p', { text: e.note }) : null,
          h('p', { class: 'small', text: dueText(sub, e) }), del);
      }));
    });

    return h('div', { class: 'card p-card' }, title, form, h('div', { class: 'btn-row' }, copy), msg, list, empty);
  }

  /* ----- 3-hour timer (state is not saved) ----- */
  function timerCard() {
    const TOTAL = 3 * 60 * 60 * 1000;
    let remaining = TOTAL, endAt = 0, tick = null;
    const time = h('p', { class: 'timer-time', role: 'timer', 'aria-label': 'Time left' });
    const upMsg = h('p', { class: 'timer-up', text: 'Time is up', hidden: true });
    const live = h('p', { class: 'sr-only', role: 'status' });
    const startBtn = h('button', { class: 'btn', type: 'button', text: 'Start' });
    const pauseBtn = h('button', { class: 'btn btn-outline', type: 'button', text: 'Pause' });
    const resetBtn = h('button', { class: 'btn btn-outline', type: 'button', text: 'Reset' });
    const card = h('div', { class: 'card p-card timer' }, h('h2', { text: '3-hour paper timer' }), time, upMsg, live,
      h('div', { class: 'btn-row' }, startBtn, pauseBtn, resetBtn));

    const fmt = (ms) => { const s = Math.ceil(ms / 1000); return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad).join(':'); };
    function paint() {
      const running = tick !== null, up = remaining === 0;
      time.textContent = fmt(remaining);
      card.classList.toggle('up', up);
      upMsg.hidden = !up;
      startBtn.disabled = running || up;
      pauseBtn.disabled = !running;
    }
    function stop() { clearInterval(tick); tick = null; }
    function step() {
      remaining = Math.max(0, endAt - Date.now()); // based on the clock, so it stays right if the tab is throttled
      if (remaining === 0) {
        stop();
        live.textContent = 'Time is up';
        if (document.activeElement === pauseBtn) resetBtn.focus();
      }
      paint();
    }
    startBtn.addEventListener('click', () => { endAt = Date.now() + remaining; tick = setInterval(step, 250); paint(); pauseBtn.focus(); });
    pauseBtn.addEventListener('click', () => { remaining = Math.max(0, endAt - Date.now()); stop(); paint(); startBtn.focus(); });
    resetBtn.addEventListener('click', () => { stop(); remaining = TOTAL; live.textContent = ''; paint(); });
    paint();
    return card;
  }

  /* ===== Official links and method tabs ===== */
  function linkCard(l) {
    return h('div', { class: 'card p-card' }, h('h3', { text: l.title }), h('p', { text: l.note }),
      h('a', { class: 'btn btn-outline btn-sm', href: l.url, target: '_blank', rel: 'noopener noreferrer' }, 'Open link',
        h('span', { class: 'sr-only', text: `: ${l.title} (opens in a new tab)` })),
      l.unverified ? ' ' : null, l.unverified ? tag('Not verified') : null);
  }

  function buildLinks(panel) {
    const all = Object.keys(LINKS).map((k) => LINKS[k]);
    const official = all.filter((l) => l.group !== 'secondary');
    const secondary = all.filter((l) => l.group === 'secondary');
    panel.append(h('h2', { text: 'Official links' }), h('p', { class: 'note', text: TEXT.olderYears }),
      h('div', { class: 'grid' }, ...official.map(linkCard)));
    if (secondary.length) {
      panel.append(h('h2', { class: 'p-gap', text: 'Secondary (third-party)' }), h('div', { class: 'grid' }, ...secondary.map(linkCard)));
    }
  }

  function buildMethod(panel) {
    const M = METHOD;
    const section = (title, ...kids) => h('div', { class: 'card p-card' }, h('h2', { text: title }), ...kids);
    const bySubject = (items) => h('ul', {}, ...items.map((i) => h('li', {}, h('strong', { text: i.subject + ': ' }), i.text)));
    panel.append(
      section(M.solving.title, h('ol', {}, ...M.solving.steps.map((t) => h('li', { text: t })))),
      section(M.verify.title, h('ol', {}, ...M.verify.steps.map((t) => h('li', { text: t }))), h('p', { text: M.verify.note })),
      section(M.marking.title, bySubject(M.marking.items)),
      section(M.pattern.title, bySubject(M.pattern.items)),
      section(M.when.title, h('ul', {}, ...M.when.items.map((t) => h('li', { text: t })))));
  }

  /* ===== Tabs and panels ===== */
  function buildTabs() {
    TABS.forEach((t) => {
      $('#tablist').append(h('button', { role: 'tab', type: 'button', id: 'ptab-' + t.id, 'aria-controls': 'ppanel-' + t.id, 'aria-selected': 'false', tabindex: '-1', text: t.name }));
      const isSub = !!NAMES[t.id];
      const panel = h('div', { role: 'tabpanel', id: 'ppanel-' + t.id, 'aria-labelledby': 'ptab-' + t.id, tabindex: '0', hidden: true,
        class: isSub ? 'sub-panel s-' + t.id : 'no-print' });
      if (isSub) {
        // Only the "Your 4 papers" card is printed; every other block is marked no-print
        [fourCard(t.id), bufferCard(t.id), bankCard(t.id), trackerCard(t.id), errorCard(t.id), timerCard()]
          .forEach((block, i) => { if (i) block.classList.add('no-print'); panel.append(block); });
      } else if (t.id === 'links') buildLinks(panel);
      else buildMethod(panel);
      $('#panels').append(panel);
    });
  }

  let current = TAB_IDS[0];
  function select(id, focus) {
    current = id;
    TABS.forEach((t) => {
      const on = t.id === id;
      const tab = $('#ptab-' + t.id);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      $('#ppanel-' + t.id).hidden = !on;
    });
    store.set(TAB_KEY, id);
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
    if (focus) $('#ptab-' + id).focus();
  }

  /* ===== Progress header, banner, sync ===== */
  function paintProgress() {
    const counts = SUBS.map((s) => ({ s, n: BANK.filter((r) => read(s.id, r.n).s !== 'none').length }));
    const total = counts.reduce((sum, c) => sum + c.n, 0);
    $('#p-total').innerHTML = '';
    $('#p-total').append(h('strong', { text: `Papers solved: ${total} of ${BANK.length * SUBS.length}` }));
    $('#p-subs').replaceChildren(...counts.map((c) => h('li', { class: 's-' + c.s.id, text: `${c.s.name}: ${c.n} of ${BANK.length}` })));
  }

  // Re-draws every value that depends on saved data (inputs are updated in place, never rebuilt)
  function sync() {
    checks.forEach((c) => { c.input.checked = read(c.sub, c.n).s !== 'none'; });
    controls.forEach((c) => {
      const r = read(c.sub, c.n);
      c.sel.value = r.s;
      c.date.value = r.d;
      c.score.value = r.m == null ? '' : String(r.m);
      c.score.removeAttribute('aria-invalid');
      c.err.textContent = '';
    });
    painters.forEach((p) => p());
    paintProgress();
  }

  function renderBanner() {
    const B = BANNER;
    $('#banner').append(h('p', {}, h('strong', { text: 'Verified: ' }), B.verified, ' ', h('strong', { text: 'Not verified: ' }), B.notVerified, ' ', B.advice, ' ', B.pattern));
    $('#p-note').textContent = TEXT.progressNote;
  }

  /* ===== Init ===== */
  renderBanner();
  buildTabs();
  sync();

  const list = $('#tablist');
  list.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab.id.slice(5), false);
  });
  list.addEventListener('keydown', (e) => {
    const i = TAB_IDS.indexOf(current);
    const target = { ArrowRight: (i + 1) % TAB_IDS.length, ArrowLeft: (i + TAB_IDS.length - 1) % TAB_IDS.length, Home: 0, End: TAB_IDS.length - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(TAB_IDS[target], true);
  });
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (TAB_IDS.includes(id)) select(id, false);
  });

  $('#print').addEventListener('click', () => window.print());
  $('#reset-all').addEventListener('click', () => {
    if (window.confirm('Reset all paper data? Statuses, dates, scores and error logs will be deleted. This cannot be undone.')) {
      status = {};
      errors = [];
      persist(STATUS_KEY, status);
      persist(ERR_KEY, errors);
      sync();
    }
  });

  // Priority: URL hash, then saved tab, then the first tab
  const fromHash = location.hash.slice(1);
  const savedTab = store.get(TAB_KEY);
  select(TAB_IDS.includes(fromHash) ? fromHash : TAB_IDS.includes(savedTab) ? savedTab : TAB_IDS[0], false);
})();