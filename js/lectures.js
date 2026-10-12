/* Lectures page: renders everything from LECTURES (data/lectures.js).
   Uses store and getDayNumber from js/main.js; DAYS from data/plan.js is optional. */
(function () {
  'use strict';

  const D = LECTURES;
  const YT_SEARCH = 'https://www.youtube.com/results?search_query='; // the only URL built by this page
  const TAB_KEY = 'forpcm_lect_tab';
  const DONE_KEY = 'forpcm_lect_done';
  const TAB_IDS = D.SUBJECTS.map((s) => s.id);
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

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const subjectName = (id) => D.SUBJECTS.find((s) => s.id === id).name;

  /* ===== Small building blocks ===== */
  function confBadge(level, short) {
    return h('span', { class: 'conf conf-' + level.toLowerCase(), text: (short ? '' : 'Confidence: ') + level });
  }
  function confList(levels, joiner, short) {
    const out = [];
    levels.forEach((l, i) => { if (i) out.push(joiner); out.push(confBadge(l, short)); });
    return out;
  }
  const tag = (text) => h('span', { class: 'tag', text });
  const unverified = () => tag(D.BANNER.unverified);

  // External link to a URL given in the data
  function ext(text, url, context) {
    return h('a', { class: 'ext', href: url, target: '_blank', rel: 'noopener noreferrer' }, text,
      h('span', { class: 'sr-only', text: (context ? ' for ' + context : '') + ' (opens in a new tab)' }));
  }

  // "Search on YouTube" button: builds only the YouTube results URL from a search phrase
  function searchLink(phrase, label, context) {
    return h('a', { class: 'btn btn-outline btn-sm', href: YT_SEARCH + encodeURIComponent(phrase), target: '_blank', rel: 'noopener noreferrer' },
      label || 'Search on YouTube',
      h('span', { class: 'sr-only', text: (context ? ' for ' + context : '') + ' (opens YouTube search in a new tab)' }));
  }

  // Lecture entry: text (link if it has a url), optional second link, and how it was seen
  function entryNode(e) {
    const box = h('span', {}, e.url ? ext(e.text, e.url) : e.text);
    if (e.also) box.append('; also ', ext(e.also.text, e.also.url));
    if (e.how) box.append(' ', tag(e.how));
    return box;
  }

  function table(caption, headers, rows) {
    return h('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': caption + ' (scrolls sideways on small screens)' },
      h('table', { class: 'lect-table' },
        h('caption', { class: 'sr-only', text: caption }),
        h('thead', {}, h('tr', {}, ...headers.map((t) => h('th', { scope: 'col', text: t })))),
        h('tbody', {}, ...rows.map((r) => h('tr', {}, ...r.map((c) => h('td', {}, c)))))));
  }

  /* Accordion: button with aria-expanded controlling a panel */
  let accSeq = 0;
  function accordion(level, headKids, body, open) {
    const id = 'lacc' + (++accSeq);
    const btn = h('button', { class: 'acc-btn', type: 'button', 'aria-expanded': String(!!open), 'aria-controls': id }, ...headKids);
    const panel = h('div', { class: 'acc-body', id }, body);
    panel.hidden = !open;
    const set = (isOpen) => { btn.setAttribute('aria-expanded', String(isOpen)); panel.hidden = !isOpen; };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    return { el: h('div', { class: 'acc' }, h(level, { class: 'acc-h' }, btn), panel), btn, set };
  }

  /* ===== Saved "watched" state ===== */
  let done = {};
  try {
    const saved = JSON.parse(store.get(DONE_KEY));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) done = saved;
  } catch (e) { /* ignore corrupt data */ }

  /* ===== Plan days (optional: hidden silently if data/plan.js is missing) ===== */
  const hasPlan = typeof DAYS !== 'undefined' && Array.isArray(DAYS);
  function planDays(subject, name) {
    if (!hasPlan) return [];
    const key = subjectName(subject) + '|' + name;
    return DAYS.filter((d) => (d[subject + 'Key'] || []).includes(key));
  }

  /* ===== Banner ===== */
  function renderBanner() {
    const b = D.BANNER;
    $('#banner').append(
      h('p', {}, h('strong', { text: b.lead + ' ' }), b.text),
      h('ul', { class: 'legend', 'aria-label': 'Legend: how an item was seen, and its confidence' },
        ...b.legend.map((l) => h('li', {}, tag(l.label), ' ', ...confList(l.levels, ' or ', true)))),
      h('p', { class: 'small', text: b.syllabus }));
    $('#lect-footnote').textContent = b.footer;
  }

  /* ===== Chapters ===== */
  const chapters = []; // {id, key, subject, conf, text, el, acc}
  const emptyMsgs = {};

  function buildChapter(c) {
    const key = c.subject + '|' + c.chapter;
    const id = 'ch-' + c.subject + '-' + slug(c.chapter);
    const days = planDays(c.subject, c.chapter);

    const check = h('input', { type: 'checkbox' });
    check.checked = !!done[key];
    const watchedTag = tag('Watched');
    watchedTag.hidden = !check.checked;

    const body = h('div', {});
    if (days.length) {
      body.append(h('p', { class: 'plan-days', text: 'Planned on ' + days.map((d) => `Day ${d.day} (${d.label})`).join(', ') }));
    }
    body.append(
      h('dl', { class: 'ch-dl' },
        h('dt', { text: 'Primary lecture' }), h('dd', {}, entryNode(c.primary)),
        h('dt', { text: 'Backup lecture' }), h('dd', {}, entryNode(c.backup)),
        h('dt', { text: 'Covers (expected)' }), h('dd', { text: c.covers })),
      h('div', { class: 'btn-row' },
        searchLink(c.searchPhrase, null, c.chapter),
        h('label', { class: 'check' }, check,
          h('span', {}, 'I watched this', h('span', { class: 'sr-only', text: ': ' + c.chapter })))));

    const acc = accordion('h3', [h('span', { text: c.chapter }), confBadge(c.confidence), unverified(), watchedTag], body, false);
    acc.el.id = id;

    const searchable = [c.chapter, c.primary.text, c.primary.also ? c.primary.also.text : '', c.backup.text, c.covers].join(' ').toLowerCase();
    chapters.push({ id, key, subject: c.subject, conf: c.confidence.toLowerCase(), text: searchable, el: acc.el, acc });

    check.addEventListener('change', () => {
      if (check.checked) done[key] = true; else delete done[key];
      store.set(DONE_KEY, JSON.stringify(done));
      watchedTag.hidden = !check.checked;
      applyFilters();
    });
    return acc.el;
  }

  /* ===== Subject tab blocks ===== */
  function playlistCard(id) {
    const p = D.PLAYLISTS[id];
    const titles = p.playlistVideos;
    const list = titles.length
      ? h('ol', {}, ...titles.map((v) => h('li', { text: v.length ? `${v.title} (${v.length})` : v.title })))
      : h('p', { class: 'small', text: D.BANNER.emptyPlaylist });
    return h('div', { class: 'card lect-card s-' + id },
      h('h2', { text: 'Your main playlists' }),
      h('p', {}, h('strong', {}, ext(p.title, p.url))),
      h('p', { class: 'small', text: `Owner: ${p.owner} | ${p.videos} videos` }),
      h('p', {}, tag(p.verified), ' ', confBadge(p.confidence), ' ', unverified()),
      h('p', { text: p.note }),
      accordion('h3', [h('span', { text: 'Playlist video order' })], list, false).el);
  }

  function channelsCard(id) {
    const c = D.CHANNELS[id];
    const card = h('div', { class: 'card lect-card' },
      h('h2', { text: 'Top channels' }),
      h('ol', {}, ...c.list.map((x) => h('li', {}, x.name, ...(x.confidence ? [' ', confBadge(x.confidence)] : [])))));
    if (c.note) card.append(h('p', { class: 'small', text: c.note }));
    card.append(h('p', {}, h('strong', { text: 'Why: ' }), c.reason));
    c.series.forEach((r) => card.append(h('p', {}, h('strong', { text: `Does ${r.channel} have a revision series? ` }), r.text)));
    return card;
  }

  function marathonCard(id) {
    const rows = D.MARATHONS[id].map((m) => [
      m.channel, m.title, m.year, m.fit, tag(m.how), confBadge(m.confidence, true),
      m.url ? ext('Open', m.url, m.title) : searchLink(m.channel + ' ' + m.title, 'Search on YouTube', m.title)
    ]);
    return h('div', { class: 'card lect-card' }, h('h2', { text: 'Marathons' }),
      table('Marathons', ['Channel', 'Title', 'Year', 'Fit', 'Verified how', 'Confidence', 'Link'], rows));
  }

  function integralsCard() {
    const I = D.INTEGRALS;
    return h('div', { class: 'card lect-card integrals' },
      h('h2', { text: I.title }),
      h('p', {}, h('strong', { text: 'Primary: ' }), I.primary),
      h('p', {}, h('strong', { text: 'Hindi backup: ' }), I.hindi),
      h('p', {}, h('strong', { text: 'Long backup: ' }), I.long),
      h('p', {}, 'Confidence: ', ...confList(I.confidence, ' to ', true), ` (${I.basis}) `, unverified()),
      h('div', { class: 'btn-row' }, ...I.searches.map((p) => searchLink(p, 'Search: ' + p))));
  }

  function inorganicCard() {
    const o = D.INORGANIC;
    const rows = o.rows.map((r) => [
      r.note ? `${r.title} (${r.note})` : r.title, r.length, confBadge(r.confidence, true), searchLink(r.title, 'Search on YouTube', r.title)
    ]);
    const body = h('div', {}, h('p', { class: 'small', text: o.note }), table('Inorganic leads', ['Title seen', 'Length', 'Confidence', 'Search'], rows));
    const acc = accordion('h2', [h('span', { text: o.title })], body, false);
    acc.el.classList.add('lect-card');
    return acc.el;
  }

  function chaptersBlock(s) {
    const list = h('div', { class: 'acc-list' });
    D.CHAPTERS.filter((c) => c.subject === s.id).forEach((c) => list.append(buildChapter(c)));
    emptyMsgs[s.id] = h('p', { class: 'note', text: 'No chapters match these filters.', hidden: '' });
    return h('div', {}, h('h2', { text: 'Chapters' }), list, emptyMsgs[s.id], h('p', { class: 'note', text: s.note }));
  }

  /* ===== Quick revision and Tips tabs ===== */
  function listCard(data) {
    return h('div', { class: 'card lect-card' }, h('h2', { text: data.title }), h('ul', {}, ...data.items.map((t) => h('li', { text: t }))));
  }

  function buildQuick(panel) {
    const rows = D.QUICK.map((q) => {
      let link;
      if (q.links) link = h('div', { class: 'btn-row' }, ...q.links.map((l) => ext(l.label, l.url, q.asset)));
      else if (q.url) link = ext('Open on YouTube', q.url, q.asset);
      else link = searchLink(q.asset, 'Search on YouTube', q.asset);
      return [q.subject, q.asset, tag(q.how), confBadge(q.confidence, true), link];
    });
    panel.append(
      h('div', { class: 'card lect-card' }, h('h2', { text: 'Quick revision' }),
        table('Quick revision assets', ['Subject', 'Asset', 'Verified how', 'Confidence', 'Link'], rows)),
      listCard(D.NOT_FOUND));
  }

  function buildTips(panel) {
    // Checklist boxes are not saved: they reset on reload
    const checklist = h('div', { class: 'card lect-card' }, h('h2', { text: D.CHECKLIST.title }),
      h('ul', { class: 'plain-list' }, ...D.CHECKLIST.items.map((t, i) =>
        h('li', {}, h('label', { class: 'check' }, h('input', { type: 'checkbox' }), h('span', { text: `${i + 1}. ${t}` }))))));
    panel.append(listCard(D.TIPS), checklist, listCard(D.GAPS));
  }

  /* ===== Tabs and panels ===== */
  function buildTabs() {
    D.SUBJECTS.forEach((s) => {
      $('#tablist').append(h('button', {
        role: 'tab', type: 'button', id: 'ltab-' + s.id, 'aria-controls': 'lpanel-' + s.id,
        'aria-selected': 'false', tabindex: '-1', text: s.name
      }));
      const panel = h('div', { role: 'tabpanel', id: 'lpanel-' + s.id, 'aria-labelledby': 'ltab-' + s.id, tabindex: '0', hidden: '' });
      if (s.kind === 'subject') {
        if (s.id === 'maths') panel.append(integralsCard());
        panel.append(playlistCard(s.id), channelsCard(s.id), marathonCard(s.id), chaptersBlock(s));
        if (s.id === 'chemistry') panel.append(inorganicCard());
      } else if (s.kind === 'quick') buildQuick(panel);
      else buildTips(panel);
      $('#panels').append(panel);
    });
  }

  let current = TAB_IDS[0];
  function select(id, focus) {
    current = id;
    D.SUBJECTS.forEach((s) => {
      const on = s.id === id;
      const tab = $('#ltab-' + s.id);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      $('#lpanel-' + s.id).hidden = !on;
    });
    const isSubject = D.SUBJECTS.find((s) => s.id === id).kind === 'subject';
    $('#lect-filters').hidden = !isSubject;
    $('#f-status').hidden = !isSubject;
    store.set(TAB_KEY, id);
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
    if (focus) $('#ltab-' + id).focus();
    applyFilters();
  }

  /* ===== Filters ===== */
  function applyFilters() {
    const conf = $('#f-conf').value;
    const onlyUnwatched = $('#f-unwatched').checked;
    const q = $('#f-search').value.trim().toLowerCase();
    const active = document.activeElement;
    const shown = {}, total = {};

    chapters.forEach((c) => {
      const confOk = conf === 'all' || (conf === 'low' ? c.conf === 'low' : c.conf !== 'low');
      const ok = confOk && (!onlyUnwatched || !done[c.key]) && (!q || c.text.includes(q));
      c.el.hidden = !ok;
      total[c.subject] = (total[c.subject] || 0) + 1;
      if (ok) shown[c.subject] = (shown[c.subject] || 0) + 1;
    });
    Object.keys(emptyMsgs).forEach((id) => { emptyMsgs[id].hidden = (shown[id] || 0) > 0; });

    // If the chapter being used just got hidden (e.g. ticked while filtering), keep focus in the filters
    const host = active && active.closest ? active.closest('.acc') : null;
    if (host && host.hidden) $('#f-unwatched').focus();

    $('#f-status').textContent = total[current] ? `Showing ${shown[current] || 0} of ${total[current]} chapters in ${subjectName(current)}` : '';
  }

  function resetFilters() {
    $('#f-conf').value = 'all';
    $('#f-unwatched').checked = false;
    $('#f-search').value = '';
  }

  /* ===== Open a chapter (from "Today's lectures" or a #ch-... hash) ===== */
  function openChapter(id) {
    const c = chapters.find((x) => x.id === id);
    if (!c) return;
    if (c.el.hidden) { resetFilters(); applyFilters(); }
    select(c.subject, false);
    c.acc.set(true);
    c.acc.btn.focus({ preventScroll: true });
    c.el.scrollIntoView({ block: 'start' });
  }

  /* ===== Today's lectures (only when today is inside the plan) ===== */
  function renderToday() {
    if (!hasPlan) return;
    const today = DAYS.find((d) => d.day === getDayNumber());
    if (!today) return;
    $('#today-title').textContent = `Today's lectures: Day ${today.day} (${today.label})`;
    ['physics', 'chemistry', 'maths'].forEach((s) => {
      if (!today[s]) return;
      const links = (today[s + 'Key'] || []).map((k) => {
        const name = k.split('|')[1];
        const c = D.CHAPTERS.find((x) => x.subject === s && x.chapter === name);
        return c ? h('a', { href: '#ch-' + s + '-' + slug(name), 'data-chapter': 'ch-' + s + '-' + slug(name), text: `Open ${name} lectures` }) : null;
      }).filter(Boolean);
      $('#today-list').append(h('li', { class: 'today-row s-' + s },
        h('strong', { text: subjectName(s) }), h('span', { text: today[s] }),
        ...(links.length ? [h('span', { class: 'btn-row' }, ...links)] : [])));
    });
    $('#today').hidden = false;
    $('#today-list').addEventListener('click', (e) => {
      const a = e.target.closest('a[data-chapter]');
      if (!a) return;
      e.preventDefault();
      openChapter(a.dataset.chapter);
    });
  }

  /* ===== Init ===== */
  renderBanner();
  buildTabs();
  renderToday();

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

  ['#f-conf', '#f-unwatched'].forEach((sel) => $(sel).addEventListener('change', applyFilters));
  $('#f-search').addEventListener('input', applyFilters);

  function handleHash() {
    const id = location.hash.slice(1);
    if (TAB_IDS.includes(id)) select(id, false);
    else if (id.indexOf('ch-') === 0) openChapter(id);
  }
  window.addEventListener('hashchange', handleHash);

  // Priority: URL hash, then saved tab, then the first tab
  const fromHash = location.hash.slice(1);
  const savedTab = store.get(TAB_KEY);
  select(TAB_IDS.includes(fromHash) ? fromHash : TAB_IDS.includes(savedTab) ? savedTab : TAB_IDS[0], false);
  if (fromHash.indexOf('ch-') === 0) openChapter(fromHash);
})();