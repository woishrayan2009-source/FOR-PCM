/* Plan page: renders phase bar, three views, guides and notes from data/plan.js.
   Uses store, parseLocalDate from js/main.js. */
(function () {
  'use strict';

  const SUBJECTS = ['physics', 'chemistry', 'maths'];
  const NAMES = { physics: 'Physics', chemistry: 'Chemistry', maths: 'Maths' };
  const PRIORITY_RANK = { 'High': 4, 'Med-High': 3, 'Medium': 2, 'Low-Med': 1 };
  const PAPER_PHASE = 4;
  const DONE_KEY = 'forpcm_plan_done';
  const VIEWS = ['days', 'chapters', 'hours'];
  const $ = (sel) => document.querySelector(sel);

  /* Small DOM builder (textContent only, so data is never parsed as HTML) */
  function h(tag, attrs, ...kids) {
    const node = document.createElement(tag);
    for (const key in attrs || {}) {
      if (key === 'class') node.className = attrs[key];
      else if (key === 'text') node.textContent = attrs[key];
      else node.setAttribute(key, attrs[key]);
    }
    kids.forEach((kid) => node.append(kid));
    return node;
  }

  /* ===== Dates (local time) ===== */
  const start = parseLocalDate(PLAN_START);
  const dateOf = (day) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + day - 1);
  const fmtDate = (day) => dateOf(day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  function fmtRange(from, to) {
    if (to == null) return fmtDate(from);
    const a = dateOf(from), b = dateOf(to);
    const month = (x) => x.toLocaleDateString('en-GB', { month: 'short' });
    return a.getMonth() === b.getMonth() ? `${a.getDate()}-${b.getDate()} ${month(a)}` : `${fmtDate(from)} - ${fmtDate(to)}`;
  }
  // Today as a plan day number: below 1 = before the plan, above 33 = after the papers
  const TODAY = (() => {
    const n = new Date();
    return Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - start) / 86400000) + 1;
  })();

  /* ===== Checkbox state, shared by the day view and the chapter view ===== */
  let done = {};
  try {
    const saved = JSON.parse(store.get(DONE_KEY));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) done = saved;
  } catch (e) { /* ignore corrupt data */ }

  const cellKey = (d, s) => `${d.day}-${s}`;
  const keysOf = (d, s) => d[s + 'Key'] || [];
  const trackers = []; // {keys, bar, text}: progress displays

  function check(key, text, aria) {
    const input = h('input', { class: 'chk', type: 'checkbox', 'data-key': key });
    if (aria) input.setAttribute('aria-label', aria);
    return h('label', { class: 'check' }, input, h('span', { text }));
  }

  function refresh() {
    document.querySelectorAll('.chk').forEach((c) => { c.checked = !!done[c.dataset.key]; });
    trackers.forEach((t) => {
      const n = t.keys.filter((k) => done[k]).length;
      if (t.bar) t.bar.value = n;
      t.text.textContent = `${n} of ${t.keys.length} done`;
    });
  }

  document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('chk')) return;
    if (e.target.checked) done[e.target.dataset.key] = true; else delete done[e.target.dataset.key];
    store.set(DONE_KEY, JSON.stringify(done));
    refresh();
  });

  function counter(keys) {
    const text = h('span', { class: 'count' });
    trackers.push({ keys, bar: null, text });
    return text;
  }

  /* ===== Accordion (button with aria-expanded) ===== */
  let accId = 0;
  function accordion(level, headKids, body, open) {
    const id = 'acc' + (++accId);
    const btn = h('button', { class: 'acc-btn', type: 'button', 'aria-expanded': String(!!open), 'aria-controls': id }, ...headKids);
    const panel = h('div', { class: 'acc-body', id }, body);
    panel.hidden = !open;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
    return h('div', { class: 'acc' }, h(level, { class: 'acc-h' }, btn), panel);
  }

  /* ===== Phase bar ===== */
  function renderPhases() {
    PHASES.forEach((p) => {
      const active = TODAY >= p.from && (p.to == null || TODAY <= p.to);
      if (p.chip) {
        $('#phase-chips').append(h('span', { class: 'chip' + (active ? ' current' : ''), text: `${p.label} ${fmtRange(p.from, p.to)}${active ? ' (now)' : ''}` }));
        return;
      }
      const li = h('li', { class: `seg ph${p.id}` + (active ? ' current' : '') },
        h('strong', { text: `Days ${p.from}-${p.to}` }),
        h('span', { text: fmtRange(p.from, p.to) }),
        h('span', { text: p.name }));
      if (active) {
        li.setAttribute('aria-current', 'true');
        li.append(h('span', { class: 'cur-tag', text: 'Current phase' }));
      }
      $('#phase-bar').append(li);
    });
  }

  /* ===== View 1: Day by day ===== */
  const dayRows = [];

  function subjectCell(d, s) {
    const td = h('td', { 'data-subject': s, 'data-subjects': s, 'data-label': NAMES[s], 'data-text': d[s].toLowerCase() },
      check(cellKey(d, s), d[s], `Day ${d.day}, ${NAMES[s]}: ${d[s]}`));
    if ((d.doNotSkip || []).includes(s)) {
      td.append(h('p', { class: 'dns-wrap' }, h('span', { class: 'dns', text: 'Do not skip' }), ' ', h('small', { text: TEXT.doNotSkip })));
    }
    return td;
  }

  // Full-paper days: one merged cell with a checkbox per paper
  function paperCell(d) {
    const subs = SUBJECTS.filter((s) => d[s]);
    const title = `Papers: ${subs.map((s) => NAMES[s]).join(' + ')}`;
    return h('td', { colspan: SUBJECTS.length, 'data-subjects': subs.join(' '), 'data-text': title.toLowerCase() },
      h('strong', { text: title }),
      h('div', { class: 'paper-checks' }, ...subs.map((s) => check(cellKey(d, s), NAMES[s], `Day ${d.day}, ${NAMES[s]} paper`))),
      h('p', { class: 'small', text: TEXT.paperDay }));
  }

  function dayRow(d) {
    const isToday = d.day === TODAY;
    const tr = h('tr', { class: `ph${d.phase}` + (isToday ? ' today' : ''), 'data-phase': d.phase },
      h('th', { scope: 'row', class: 'daycell' },
        h('strong', { text: `Day ${d.day}` }), h('span', { text: d.label }),
        ...(isToday ? [h('span', { class: 'today-tag', text: 'Today' })] : [])));
    if (isToday) tr.setAttribute('aria-current', 'date');
    if (d.phase === PAPER_PHASE) tr.append(paperCell(d));
    else SUBJECTS.forEach((s) => tr.append(subjectCell(d, s)));
    return tr;
  }

  function renderDays() {
    const head = h('tr', {}, h('th', { scope: 'col', text: 'Day / Date' }),
      ...SUBJECTS.map((s) => h('th', { scope: 'col', 'data-subject': s, text: NAMES[s] })));
    const body = h('tbody', {});
    DAYS.forEach((d) => { const tr = dayRow(d); dayRows.push(tr); body.append(tr); });
    $('#day-wrap').append(h('table', { class: 'plan-table' },
      h('caption', { class: 'sr-only', text: '33-day plan, one row per day' }),
      h('thead', { id: 'day-head' }, head), body));
    $('#paper-note').textContent = `Full-paper phase: ${TEXT.paperPhase}`;
  }

  // Filters: subject hides other columns, phase hides rows, search matches cell text
  function applyFilters() {
    const subject = $('#f-subject').value;
    const phase = $('#f-phase').value;
    const q = $('#f-search').value.trim().toLowerCase();
    $('#day-head').querySelectorAll('th[data-subject]').forEach((th) => { th.hidden = subject !== 'all' && th.dataset.subject !== subject; });
    let shown = 0;
    dayRows.forEach((tr) => {
      let matches = 0;
      tr.querySelectorAll('td').forEach((td) => {
        const subjectOk = subject === 'all' || td.dataset.subjects.split(' ').includes(subject);
        td.hidden = !subjectOk;
        if (subjectOk && (!q || td.dataset.text.includes(q))) matches++;
      });
      tr.hidden = !((phase === 'all' || tr.dataset.phase === phase) && matches > 0);
      if (!tr.hidden) shown++;
    });
    $('#day-count').textContent = `Showing ${shown} of ${DAYS.length} days`;
    $('#day-empty').hidden = shown > 0;
  }

  /* ===== View 2: By chapter (grouped by the "Subject|Chapter" keys in DAYS) ===== */
  function progressRow(label, keys, subject) {
    const bar = h('progress', { max: keys.length, value: 0, 'aria-label': `${label} progress` });
    if (subject) bar.dataset.subject = subject;
    const text = h('span', { class: 'small' });
    trackers.push({ keys, bar, text });
    return h('div', { class: 'prog-row' }, h('strong', { text: label }), bar, text);
  }

  function chapterAccordion(c, parts) {
    const late = parts.length > 0 && parts.every((p) => p.d.phase > 2); // first scheduled in Days 24-26
    const keys = parts.map((p) => cellKey(p.d, p.s));
    const head = [
      h('span', { text: c.name }),
      h('span', { class: 'badge', text: `Priority: ${c.priority}` }),
      ...(c.hard ? [h('span', { class: 'badge hard', text: 'Hard' })] : []),
      h('span', { class: 'small', text: `${c.hours} h first pass` }),
      ...(late ? [h('span', { class: 'small', text: 'first pass (late)' })] : []),
      counter(keys)
    ];
    const list = h('ul', { class: 'parts' }, ...parts.map((p) =>
      h('li', {}, check(cellKey(p.d, p.s), `Day ${p.d.day} (${p.d.label}): ${p.d[p.s]}`))));
    return accordion('h4', head, list, false);
  }

  function renderChapters() {
    const parts = {};
    const subjectKeys = {};
    DAYS.forEach((d) => SUBJECTS.forEach((s) => {
      const keys = keysOf(d, s);
      if (!keys.length) return;
      (subjectKeys[s] = subjectKeys[s] || []).push(cellKey(d, s));
      keys.forEach((k) => { (parts[k] = parts[k] || []).push({ d, s }); });
    }));

    const box = $('#progress');
    box.append(progressRow('Overall', SUBJECTS.flatMap((s) => subjectKeys[s] || []), null));
    SUBJECTS.forEach((s) => box.append(progressRow(NAMES[s], subjectKeys[s] || [], s)));

    SUBJECTS.forEach((s) => {
      const body = h('div', {}, ...CHAPTERS.filter((c) => c.subject === s)
        .map((c) => chapterAccordion(c, parts[`${NAMES[s]}|${c.name}`] || [])));
      $('#chapter-list').append(accordion('h3', [h('span', { text: NAMES[s] }), counter(subjectKeys[s] || [])], body, false));
    });
  }

  /* ===== View 3: Hours and priority ===== */
  function renderHours() {
    const totals = SUBJECTS
      .map((s) => ({ s, hrs: CHAPTERS.filter((c) => c.subject === s).reduce((sum, c) => sum + c.hours, 0) }))
      .sort((a, b) => b.hrs - a.hrs);
    const first = totals.reduce((sum, t) => sum + t.hrs, 0);
    const revisionDays = DAYS.filter((d) => d.phase < PAPER_PHASE).length;
    const available = revisionDays * HOURS.perDay;
    $('#hours-summary').textContent =
      `Available ${available} h (${revisionDays} days x ${HOURS.perDay} h) | First pass ${first} h (${totals.map((t) => `${NAMES[t.s]} ${t.hrs}`).join(', ')}) | Left for second pass about ${available - first} h`;

    const cols = [['subject', 'Subject'], ['chapter', 'Chapter'], ['hours', 'First-pass hrs'], ['priority', 'Priority']];
    const value = {
      subject: (c) => NAMES[c.subject], chapter: (c) => c.name.toLowerCase(),
      hours: (c) => c.hours, priority: (c) => PRIORITY_RANK[c.priority]
    };
    const sort = { key: null, dir: 'asc' };
    const tbody = h('tbody', {});

    const ths = cols.map(([key, label]) => {
      const btn = h('button', { class: 'sort-btn', type: 'button', text: label });
      btn.addEventListener('click', () => {
        sort.dir = sort.key === key ? (sort.dir === 'asc' ? 'desc' : 'asc') : (key === 'hours' || key === 'priority' ? 'desc' : 'asc');
        sort.key = key;
        paint();
      });
      return h('th', { scope: 'col', 'aria-sort': 'none' }, btn);
    });

    function paint() {
      const subject = $('#h-subject').value;
      ths.forEach((th, i) => th.setAttribute('aria-sort', cols[i][0] === sort.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'));
      let list = CHAPTERS.filter((c) => subject === 'all' || c.subject === subject);
      if (sort.key) {
        const val = value[sort.key];
        const sign = sort.dir === 'asc' ? 1 : -1;
        list = list.slice().sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sign);
      }
      tbody.replaceChildren(...list.map((c) => h('tr', {},
        h('td', { 'data-subject': c.subject, text: NAMES[c.subject] }),
        h('td', { text: c.name }),
        h('td', { text: c.hours }),
        h('td', {}, h('span', { class: 'badge', text: c.priority }), ...(c.hard ? [' ', h('span', { class: 'badge hard', text: 'Hard' })] : [])))));
    }

    $('#hours-wrap').append(h('table', { class: 'hours-table' },
      h('caption', { class: 'sr-only', text: 'First-pass hours and priority by chapter' }),
      h('thead', {}, h('tr', {}, ...ths)), tbody));
    $('#h-subject').addEventListener('change', paint);
    paint();
  }

  /* ===== Guides and notes ===== */
  function renderGuides() {
    GUIDES.forEach((g) => {
      const body = g.items ? h('ul', {}, ...g.items.map((t) => h('li', { text: t }))) : h('p', { text: g.text });
      $('#guides').append(accordion('h3', [h('span', { text: g.title })], body, false));
    });
  }

  function renderNotes() {
    NOTES.forEach((n) => {
      const li = h('li', { text: n.text });
      if (n.sub) li.append(h('ul', {}, ...n.sub.map((t) => h('li', { text: t }))));
      $('#notes-list').append(li);
    });
    $('#notes-source').textContent = TEXT.source;
  }

  /* ===== View tabs ===== */
  let currentView = VIEWS[0];
  function showView(id, focus) {
    currentView = id;
    VIEWS.forEach((v) => {
      const tab = $('#vtab-' + v);
      tab.setAttribute('aria-selected', v === id);
      tab.tabIndex = v === id ? 0 : -1;
      $('#view-' + v).hidden = v !== id;
    });
    if (focus) $('#vtab-' + id).focus();
  }

  function initTabs() {
    const list = $('#view-tabs');
    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) showView(tab.id.slice(5), false);
    });
    list.addEventListener('keydown', (e) => {
      const i = VIEWS.indexOf(currentView);
      const target = { ArrowRight: (i + 1) % VIEWS.length, ArrowLeft: (i + VIEWS.length - 1) % VIEWS.length, Home: 0, End: VIEWS.length - 1 }[e.key];
      if (target === undefined) return;
      e.preventDefault();
      showView(VIEWS[target], true);
    });
  }

  /* ===== Init ===== */
  renderPhases();
  renderDays();
  renderChapters();
  renderHours();
  renderGuides();
  renderNotes();
  initTabs();
  showView('days', false);
  refresh();
  applyFilters();

  ['#f-subject', '#f-phase'].forEach((sel) => $(sel).addEventListener('change', applyFilters));
  $('#f-search').addEventListener('input', applyFilters);

  $('#reset').addEventListener('click', () => {
    if (window.confirm('Reset all plan progress? This cannot be undone.')) {
      done = {};
      store.set(DONE_KEY, JSON.stringify(done));
      refresh();
    }
  });
  $('#print').addEventListener('click', () => { showView('days', false); window.print(); });

  // Bring today's row into view when today is inside the plan
  const todayRow = dayRows.find((tr) => tr.classList.contains('today'));
  if (todayRow) todayRow.scrollIntoView({ block: 'center' });
})();