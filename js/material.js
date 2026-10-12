/* Study-material page: renders everything from data/material.js.
   Uses store from js/main.js. DAYS and CHAPTERS from data/plan.js are optional
   (plan hours, priority and planned days are hidden silently if that file is missing). */
(function () {
  'use strict';

  const SUBJECTS = [{ id: 'physics', name: 'Physics' }, { id: 'chemistry', name: 'Chemistry' }, { id: 'maths', name: 'Maths' }];
  const TABS = SUBJECTS.concat([
    { id: 'checklists', name: 'Checklists' }, { id: 'oneday', name: 'One day left' },
    { id: 'resources', name: 'Resources' }, { id: 'notrequired', name: 'Not required' }
  ]);
  const TAB_IDS = TABS.map((t) => t.id);
  const KEYS = {
    done: 'forpcm_material_done', custom: 'forpcm_material_custom', sheet: 'forpcm_material_sheet',
    notes: 'forpcm_material_notes', oneday: 'forpcm_oneday_done', tab: 'forpcm_material_tab'
  };
  const STATUS_CLASS = { 'Verified': 'verified', 'Partly verified': 'partly', 'Unverified': 'unverified' };
  const $ = (sel) => document.querySelector(sel);
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const T = MATERIAL_TEXT;

  const hasChapters = typeof CHAPTERS !== 'undefined' && Array.isArray(CHAPTERS);
  const hasDays = typeof DAYS !== 'undefined' && Array.isArray(DAYS);

  /* Small DOM builder (textContent only; null, false and undefined are skipped) */
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
  const safeUrl = (u) => typeof u === 'string' && /^https:\/\//.test(u);

  /* ===== Saved state (every access goes through store, which never throws) ===== */
  function loadObject(key) {
    try {
      const v = JSON.parse(store.get(key));
      return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  }
  const state = { done: loadObject(KEYS.done), oneday: loadObject(KEYS.oneday), custom: loadObject(KEYS.custom), sheet: loadObject(KEYS.sheet), notes: loadObject(KEYS.notes) };
  const save = (name) => store.set(KEYS[name], JSON.stringify(state[name]));

  // Drop anything in storage that has the wrong shape
  Object.keys(state.custom).forEach((k) => {
    state.custom[k] = Array.isArray(state.custom[k]) ? state.custom[k].filter((x) => x && typeof x.id === 'string' && typeof x.text === 'string') : [];
  });
  ['sheet', 'notes'].forEach((n) => Object.keys(state[n]).forEach((k) => { if (typeof state[n][k] !== 'string') delete state[n][k]; }));

  /* ===== Shared registries ===== */
  let checks = [];          // {input, name, key}: every checkbox, kept in sync by key
  const counters = [];      // functions that repaint per-chapter counts
  const resets = [];        // functions that repaint saved values after "Reset my data"
  const accs = new Map();   // accordion element -> open(isOpen) function
  const progressRows = {};
  const BY_SUBJECT = {};
  SUBJECTS.forEach((s) => { BY_SUBJECT[s.id] = CHAPTERS_MATERIAL.filter((c) => c.subject === s.name); });
  const keyOfChapter = (c) => c.subject + '|' + c.chapter;

  // Items of a chapter: listed items plus the student's own
  function stats(c) {
    const key = keyOfChapter(c);
    const keys = c.items.map((t) => key + '|' + t).concat((state.custom[key] || []).map((x) => key + '|custom:' + x.id));
    return { done: keys.filter((k) => state.done[k]).length, total: keys.length };
  }

  /* ===== Building blocks ===== */
  // Checkbox bound to state[name][key]; every checkbox with the same key stays in sync
  function checkbox(name, key, text) {
    const input = h('input', { type: 'checkbox' });
    input.checked = !!state[name][key];
    input.addEventListener('change', () => {
      if (input.checked) state[name][key] = true; else delete state[name][key];
      save(name);
      sync();
    });
    checks.push({ input, name, key });
    return h('label', { class: 'check' }, input, h('span', { text }));
  }
  const itemRow = (name, key, text) => h('li', { class: 'f-item', 'data-s': text.toLowerCase() }, checkbox(name, key, text));

  // Marks an element as a search group (its own text is "title" + "extra")
  function group(el, title, extra) {
    el.classList.add('f-group');
    el.dataset.title = (title + ' ' + (extra || '')).toLowerCase();
    return el;
  }

  function extLink(text, url, cls, context) {
    return h('a', { class: cls, href: url, target: '_blank', rel: 'noopener noreferrer' }, text,
      h('span', { class: 'sr-only', text: (context ? ' for ' + context : '') + ' (opens in a new tab)' }));
  }

  let accSeq = 0;
  function accordion(level, headKids, body) {
    const id = 'macc' + (++accSeq);
    const btn = h('button', { class: 'acc-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': id }, ...headKids);
    const panel = h('div', { class: 'acc-body', id }, body);
    panel.hidden = true;
    const set = (open) => { btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open; };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    return { el: h('div', { class: 'acc' }, h(level, { class: 'acc-h' }, btn), panel), set };
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

  /* Autosaved textarea (formula sheet or notes). Works without saving if storage is blocked. */
  function noteBlock(name, label, c, withCopy) {
    const key = keyOfChapter(c);
    const id = `${name}-${slug(key)}`;
    const ta = h('textarea', { id, rows: '6', 'aria-describedby': id + '-count' });
    const count = h('span', { class: 'small', id: id + '-count' });
    const refresh = () => { ta.value = state[name][key] || ''; count.textContent = `${ta.value.length} characters`; };
    refresh();
    resets.push(refresh);
    ta.addEventListener('input', () => {
      if (ta.value) state[name][key] = ta.value; else delete state[name][key];
      save(name);
      count.textContent = `${ta.value.length} characters`;
    });
    const row = h('div', { class: 'btn-row' }, count);
    const kids = [h('div', { class: 'field' }, h('label', { for: id, text: label }), ta), row];
    if (withCopy) {
      const msg = h('p', { class: 'small', role: 'status' });
      const copy = h('button', { class: 'btn btn-outline btn-sm', type: 'button' }, 'Copy', h('span', { class: 'sr-only', text: ': ' + label }));
      copy.addEventListener('click', () => {
        if (!ta.value) { msg.textContent = 'Nothing to copy yet.'; return; }
        copyText(ta.value).then((ok) => { msg.textContent = ok ? 'Copied.' : 'Could not copy. Select the text and copy it manually.'; });
      });
      row.append(copy);
      kids.push(msg);
    }
    return h('div', { class: 'm-block' }, ...kids);
  }

  function linkItem(l) {
    const title = safeUrl(l.url) ? extLink(l.title, l.url, 'ext') : h('span', { text: l.title });
    const meta = [l.source, l.type, l.language].filter(Boolean).join(' | ');
    return h('li', { class: 'f-item', 'data-s': (l.title + ' ' + meta).toLowerCase() }, title,
      meta ? ' ' : null, meta ? h('span', { class: 'small', text: meta }) : null,
      l.confidence ? ' ' : null, l.confidence ? h('span', { class: 'conf conf-' + l.confidence.toLowerCase(), text: 'Confidence: ' + l.confidence }) : null,
      l.verifiedHow ? ' ' : null, l.verifiedHow ? tag(l.verifiedHow) : null);
  }

  /* ===== Subject tabs: one accordion per chapter ===== */
  function buildChapter(c, sid) {
    const key = keyOfChapter(c);
    const prio = PRIORITY[key] || [];
    const plan = hasChapters ? CHAPTERS.find((x) => x.subject === sid && x.name === c.chapter) : null;
    const days = hasDays ? DAYS.filter((d) => (d[sid + 'Key'] || []).includes(key)) : [];
    const links = (c.links || []).filter((l) => !l.example); // entries flagged example never render

    const body = h('div', { class: 'm-body' });
    if (days.length) body.append(h('p', { class: 'plan-days', text: 'Planned on ' + days.map((d) => `Day ${d.day} (${d.label})`).join(', ') }));

    if (prio.length) {
      body.append(h('h4', { text: T.priorityTitle }), h('ul', {}, ...prio.map((t) => h('li', { text: t }))), h('p', { class: 'small', text: T.priorityNote }));
    }

    // Must master: listed items, then the student's own items
    const customList = h('ul', { class: 'm-items' });
    const empty = h('p', { class: 'small', text: T.noItems });
    body.append(h('h4', { text: 'Must master' }));
    if (c.items.length) body.append(h('ul', { class: 'm-items' }, ...c.items.map((t) => itemRow('done', key + '|' + t, t))));
    body.append(customList, empty);
    if (c.tip) body.append(h('p', { class: 'note', text: c.tip }));

    const addId = 'add-' + slug(key);
    const addInput = h('input', { id: addId, type: 'text', maxlength: '120', autocomplete: 'off' });
    const form = h('form', { class: 'm-add' },
      h('div', { class: 'field' }, h('label', { for: addId, text: 'Add my own item' }), addInput),
      h('button', { class: 'btn btn-outline btn-sm', type: 'submit', text: 'Add' }));
    body.append(form);

    function paintCustom() {
      const mine = state.custom[key] || [];
      empty.hidden = c.items.length > 0 || mine.length > 0;
      customList.replaceChildren(...mine.map((x) => {
        const del = h('button', { class: 'btn btn-outline btn-sm', type: 'button' }, 'Delete', h('span', { class: 'sr-only', text: ': ' + x.text }));
        del.addEventListener('click', () => {
          state.custom[key] = (state.custom[key] || []).filter((y) => y.id !== x.id);
          delete state.done[key + '|custom:' + x.id];
          save('custom'); save('done');
          paintCustom(); sync(); applyFilter();
          addInput.focus();
        });
        return h('li', { class: 'f-item custom', 'data-s': x.text.toLowerCase() }, checkbox('done', key + '|custom:' + x.id, x.text), del);
      }));
    }
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const text = addInput.value.trim();
      if (!text) { addInput.focus(); return; }
      (state.custom[key] = state.custom[key] || []).push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text });
      save('custom');
      addInput.value = '';
      paintCustom(); sync(); applyFilter();
      addInput.focus();
    });
    paintCustom();
    resets.push(paintCustom);

    body.append(noteBlock('sheet', 'My formula sheet', c, true), noteBlock('notes', 'My notes and mistakes', c, false));
    body.append(h('h4', { text: 'Trusted links' }),
      links.length ? h('ul', { class: 'm-items m-stack' }, ...links.map(linkItem)) : h('p', { class: 'small', text: T.noLinks }));

    const count = h('span', { class: 'count' });
    counters.push(() => { const s = stats(c); count.textContent = `${s.done} of ${s.total} done`; });

    const head = [h('span', { text: c.chapter }),
      plan ? h('span', { class: 'badge', text: 'Priority: ' + plan.priority }) : null,
      plan && plan.hard ? h('span', { class: 'badge hard', text: 'Hard' }) : null,
      plan ? h('span', { class: 'small', text: plan.hours + ' h first pass' }) : null,
      count];
    const acc = accordion('h3', head, body);
    group(acc.el, c.chapter, prio.join(' '));
    accs.set(acc.el, acc.set);
    return acc.el;
  }

  function buildSubject(panel, s) {
    panel.append(h('h2', { text: s.name + ' chapters' }), h('div', { class: 'acc-list' }, ...BY_SUBJECT[s.id].map((c) => buildChapter(c, s.id))));
  }

  /* ===== Checklists tab ===== */
  function printCard(card) { // print only this card, in black and white (see print CSS)
    card.classList.add('print-target');
    document.body.classList.add('print-one');
    window.print();
  }
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-one');
    document.querySelectorAll('.print-target').forEach((el) => el.classList.remove('print-target'));
  });

  function buildChecklists(panel) {
    CHECKLISTS.forEach((cl) => {
      const items = cl.items.map((it) => {
        const key = it.chapter ? `${cl.subject}|${it.chapter}|${it.item}` : `${cl.subject}|${cl.id}|${it.text}`;
        return itemRow('done', key, it.text);
      });
      const printBtn = h('button', { class: 'btn btn-outline btn-sm no-print', type: 'button' }, 'Print this checklist', h('span', { class: 'sr-only', text: ': ' + cl.title }));
      const card = h('div', { class: 'card m-card s-' + cl.subject.toLowerCase() },
        h('h2', { text: cl.title }), cl.intro ? h('p', { class: 'small', text: cl.intro }) : null,
        h('ul', { class: 'm-items' }, ...items), h('div', { class: 'btn-row' }, printBtn));
      printBtn.addEventListener('click', () => printCard(card));
      panel.append(group(card, cl.title));
    });
  }

  /* ===== One day left tab ===== */
  function buildOneDay(panel) {
    panel.append(h('p', { class: 'note', text: T.oneDayNote }));
    SUBJECTS.forEach((s) => {
      const items = (ONE_DAY[s.name] || []).map((t) => itemRow('oneday', `${s.name}|${t}`, t));
      panel.append(group(h('div', { class: 'card m-card s-' + s.id }, h('h2', { text: s.name + ': one day left' }), h('ul', { class: 'm-items' }, ...items)), s.name));
    });
  }

  /* ===== Resources tab ===== */
  function buildResources(panel) {
    const ncert = h('div', { class: 'card m-card' }, h('h2', { text: 'NCERT first' }),
      h('ul', { class: 'm-items m-stack' }, ...NCERT_LINKS.map((l) => h('li', { class: 'f-item', 'data-s': (l.title + ' ' + l.note).toLowerCase() },
        safeUrl(l.url) ? extLink(l.title, l.url, 'btn btn-outline btn-sm') : h('span', { text: l.title }),
        h('p', { class: 'small', text: l.note })))),
      h('p', { text: T.ncertNote }));

    const rows = SITES.map((s) => {
      const label = s.status + (s.detail ? ` (${s.detail})` : '');
      return h('tr', { class: 'f-item', 'data-s': [s.name, s.offers, s.status, s.caution].join(' ').toLowerCase() },
        h('th', { scope: 'row' }, s.name, safeUrl(s.url) ? h('div', { class: 'btn-row' }, extLink('Open site', s.url, 'btn btn-outline btn-sm', s.name)) : null),
        h('td', { text: s.offers }),
        h('td', {}, h('span', { class: 'st st-' + (STATUS_CLASS[s.status] || 'unverified'), text: label })),
        h('td', { text: s.caution }));
    });
    const sites = h('div', { class: 'card m-card' }, h('h2', { text: 'Free websites' }),
      h('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': 'Free websites (scrolls sideways on small screens)' },
        h('table', { class: 'm-table' }, h('caption', { class: 'sr-only', text: 'Free websites and how far each was verified' }),
          h('thead', {}, h('tr', {}, ...['Site', 'What it offers', 'Status', 'Caution'].map((t) => h('th', { scope: 'col', text: t })))),
          h('tbody', {}, ...rows))),
      h('p', { class: 'small', text: T.sitesNote }));

    const gaps = h('div', { class: 'card m-card' }, h('h2', { text: 'Study material gaps' }), h('p', { text: MATERIAL_GAPS }));
    const rules = h('div', { class: 'card m-card' }, h('h2', { text: 'Rules for using any website' }), h('p', { text: SITE_RULES }));
    panel.append(group(ncert, 'NCERT first'), group(sites, 'Free websites'),
      group(gaps, 'Study material gaps', MATERIAL_GAPS), group(rules, 'Rules for using any website', SITE_RULES));
  }

  /* ===== Not required tab ===== */
  function buildNotRequired(panel) {
    panel.append(h('p', { class: 'note', text: T.notRequiredNote }));
    NOT_REQUIRED.forEach((g) => {
      const items = g.items.map((t) => h('li', { class: 'f-item', 'data-s': t.toLowerCase(), text: t }));
      panel.append(group(h('div', { class: 'card m-card s-' + g.subject.toLowerCase() }, h('h2', { text: g.subject }),
        g.note ? h('p', { class: 'small', text: g.note }) : null, h('ul', {}, ...items)), g.subject));
    });
  }

  /* ===== Progress (checked items divided by total items) ===== */
  function buildProgress() {
    const box = $('#m-progress-rows');
    const rowFor = (label, sid) => {
      const bar = h('progress', { max: '1', value: '0', 'aria-label': label + ' progress' });
      if (sid) bar.dataset.subject = sid;
      const text = h('span', { class: 'small' });
      box.append(h('div', { class: 'prog-row' }, h('strong', { text: label }), bar, text));
      return { bar, text };
    };
    progressRows.overall = rowFor('Overall', null);
    SUBJECTS.forEach((s) => { progressRows[s.id] = rowFor(s.name, s.id); });
    $('#m-progress-note').textContent = T.progressNote;
  }

  function setRow(row, done, total) {
    row.bar.max = Math.max(total, 1);
    row.bar.value = done;
    row.text.textContent = `${done} of ${total} done` + (total ? ` (${Math.round((done / total) * 100)}%)` : '');
  }

  // Re-draws everything that depends on ticks: checkboxes, counts and progress bars
  function sync() {
    checks = checks.filter((c) => c.input.isConnected);
    checks.forEach((c) => { c.input.checked = !!state[c.name][c.key]; });
    counters.forEach((fn) => fn());
    let done = 0, total = 0;
    SUBJECTS.forEach((s) => {
      let d = 0, t = 0;
      BY_SUBJECT[s.id].forEach((c) => { const st = stats(c); d += st.done; t += st.total; });
      setRow(progressRows[s.id], d, t);
      done += d; total += t;
    });
    setRow(progressRows.overall, done, total);
  }

  /* ===== Search: filters chapters, cards and items in the active tab ===== */
  let current = TAB_IDS[0];
  function applyFilter() {
    const q = $('#m-search').value.trim().toLowerCase();
    let shown = 0, total = 0;
    $('#mpanel-' + current).querySelectorAll('.f-group').forEach((g) => {
      total++;
      const titleHit = !q || g.dataset.title.includes(q);
      let hit = titleHit;
      g.querySelectorAll('.f-item').forEach((it) => {
        const m = titleHit || it.dataset.s.includes(q);
        it.hidden = !m;
        if (m) hit = true;
      });
      g.hidden = !hit;
      if (hit) shown++;
      if (q && hit && !titleHit && accs.has(g)) accs.get(g)(true); // open chapters that match through an item
    });
    $('#m-status').textContent = !q ? '' : shown ? `${shown} of ${total} sections match.` : 'Nothing matches your search in this tab.';
  }

  /* ===== Tabs ===== */
  function buildTabs() {
    TABS.forEach((t) => {
      $('#tablist').append(h('button', { role: 'tab', type: 'button', id: 'mtab-' + t.id, 'aria-controls': 'mpanel-' + t.id, 'aria-selected': 'false', tabindex: '-1', text: t.name }));
      const isSub = SUBJECTS.some((s) => s.id === t.id);
      const panel = h('div', { role: 'tabpanel', id: 'mpanel-' + t.id, 'aria-labelledby': 'mtab-' + t.id, tabindex: '0', hidden: true, class: 'm-panel' + (isSub ? ' s-' + t.id : '') });
      if (isSub) buildSubject(panel, t);
      else if (t.id === 'checklists') buildChecklists(panel);
      else if (t.id === 'oneday') buildOneDay(panel);
      else if (t.id === 'resources') buildResources(panel);
      else buildNotRequired(panel);
      $('#panels').append(panel);
    });
  }

  function select(id, focus) {
    current = id;
    TABS.forEach((t) => {
      const on = t.id === id;
      const tab = $('#mtab-' + t.id);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      $('#mpanel-' + t.id).hidden = !on;
    });
    store.set(KEYS.tab, id);
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
    if (focus) $('#mtab-' + id).focus();
    applyFilter();
  }

  /* ===== Init ===== */
  $('#banner').append(h('p', {}, h('strong', { text: 'Read first. ' }), T.banner));
  buildProgress();
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
  $('#m-search').addEventListener('input', applyFilter);

  $('#m-reset').addEventListener('click', () => {
    if (!window.confirm('Reset my data? Ticks, your own items, formula sheets and notes will be deleted. This cannot be undone.')) return;
    ['done', 'custom', 'sheet', 'notes', 'oneday'].forEach((n) => { state[n] = {}; save(n); });
    resets.forEach((fn) => fn());
    sync();
    applyFilter();
  });

  // Priority: URL hash, then saved tab, then the first tab
  const fromHash = location.hash.slice(1);
  const savedTab = store.get(KEYS.tab);
  select(TAB_IDS.includes(fromHash) ? fromHash : TAB_IDS.includes(savedTab) ? savedTab : TAB_IDS[0], false);
})();