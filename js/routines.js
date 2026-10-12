/* Routines page: renders tabs, comparison table, quiz, tips and streak tracker from ROUTINES. */
(function () {
  'use strict';

  const R = ROUTINES.routines;
  const IDS = Object.keys(R); // ["A","B","C","D"], index matches quiz answer index
  const TAB_KEY = 'pcm.routine';
  const STREAK_KEY = 'pcm.streak';
  const $ = (sel) => document.querySelector(sel);

  /* Small DOM builder (uses textContent, so data is never parsed as HTML) */
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

  /* ===== Tabs ===== */
  let current = IDS[0];

  function pair(label, value) {
    return h('div', {}, h('dt', { text: label }), h('dd', {}, value));
  }

  function buildPanel(id, r) {
    const printBtn = h('button', { class: 'btn btn-outline', type: 'button', text: 'Print this routine' });
    printBtn.addEventListener('click', () => window.print());

    const info = h('div', { class: 'no-print' },
      h('h2', { text: `Routine ${id}: ${r.name}` }),
      h('dl', { class: 'meta' },
        pair('Sleep', r.sleep), pair('Wake', r.wake), pair('Study', r.study), pair('Free time', r.freeTime),
        pair('Difficulty', h('span', { class: 'badge', text: r.difficulty })),
        pair('Best for', r.bestFor), pair('Main risk', r.mainRisk)),
      printBtn);

    // Row colour comes from the "type" field via the .t-<type> CSS class
    const rows = r.rows.map((row) =>
      h('tr', { class: 't-' + row.type }, h('td', { class: 'time', text: row.time }), h('td', { text: row.activity })));

    const table = h('table', { class: 'timetable' },
      h('caption', { text: `Routine ${id} (${r.name}) timetable` }),
      h('thead', {}, h('tr', {}, h('th', { scope: 'col', text: 'Time' }), h('th', { scope: 'col', text: 'Activity' }))),
      h('tbody', {}, ...rows));

    return h('div', { class: 'card', role: 'tabpanel', id: 'panel-' + id, 'aria-labelledby': 'tab-' + id, tabindex: '0', hidden: '' },
      info, h('div', { class: 'table-wrap' }, table));
  }

  function select(id, focus) {
    current = id;
    IDS.forEach((k) => {
      const selected = k === id;
      const tab = $('#tab-' + k);
      tab.setAttribute('aria-selected', selected);
      tab.tabIndex = selected ? 0 : -1;
      $('#panel-' + k).hidden = !selected;
    });
    store.set(TAB_KEY, id);
    history.replaceState(null, '', '#' + id);
    if (focus) $('#tab-' + id).focus();
  }

  function initTabs() {
    const list = $('#tablist');
    const panels = $('#panels');
    IDS.forEach((id) => {
      list.append(h('button', {
        role: 'tab', type: 'button', id: 'tab-' + id, 'aria-controls': 'panel-' + id,
        'aria-selected': 'false', tabindex: '-1', text: 'Routine ' + id
      }));
      panels.append(buildPanel(id, R[id]));
    });

    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tab.id.slice(4), false);
    });
    list.addEventListener('keydown', (e) => {
      const i = IDS.indexOf(current);
      const target = { ArrowRight: (i + 1) % IDS.length, ArrowLeft: (i + IDS.length - 1) % IDS.length, Home: 0, End: IDS.length - 1 }[e.key];
      if (target === undefined) return;
      e.preventDefault();
      select(IDS[target], true);
    });
    window.addEventListener('hashchange', () => {
      const id = location.hash.slice(1);
      if (IDS.includes(id)) select(id, false);
    });

    // Priority: URL hash, then saved tab, then the first routine
    const fromHash = location.hash.slice(1);
    const saved = store.get(TAB_KEY);
    select(IDS.includes(fromHash) ? fromHash : IDS.includes(saved) ? saved : IDS[0], false);
  }

  /* ===== Comparison table (derived from the routine data) ===== */
  function initComparison() {
    const fields = [
      ['Sleep to wake', (r) => `${r.sleep} to ${r.wake}`],
      ['Study hours', (r) => r.study],
      ['Free time', (r) => r.freeTime],
      ['Wake-up difficulty', (r) => r.difficulty],
      ['Best for', (r) => r.bestFor]
    ];
    const head = h('tr', {}, h('th', { scope: 'col', text: 'Routine' }),
      ...IDS.map((id) => h('th', { scope: 'col', text: `${id}: ${R[id].name}` })));
    const body = fields.map(([label, get]) =>
      h('tr', {}, h('th', { scope: 'row', text: label }), ...IDS.map((id) => h('td', { text: get(R[id]) }))));

    $('#compare-wrap').append(h('table', { class: 'compare' },
      h('caption', { class: 'sr-only', text: 'Comparison of Routines A to D' }),
      h('thead', {}, head), h('tbody', {}, ...body)));
  }

  /* ===== Quiz: answer index maps to routine (0->A ... 3->D); ties go to B ===== */
  function initQuiz() {
    const box = $('#quiz');
    const questions = ROUTINES.quiz;
    let step = 0;
    let answers = [];

    function render(moveFocus) {
      box.replaceChildren();
      const heading = step < questions.length ? renderQuestion() : renderResult();
      if (moveFocus) heading.focus();
    }

    function renderQuestion() {
      const q = questions[step];
      const heading = h('h3', { text: q.question, tabindex: '-1' });
      box.append(
        h('p', { text: `Question ${step + 1} of ${questions.length}` }),
        h('progress', { max: questions.length, value: step + 1, 'aria-label': 'Quiz progress' }),
        heading);
      q.options.forEach((text, index) => {
        const btn = h('button', { class: 'option', type: 'button', text });
        btn.addEventListener('click', () => { answers.push(index); step++; render(true); });
        box.append(btn);
      });
      return heading;
    }

    function renderResult() {
      const counts = IDS.map(() => 0);
      answers.forEach((i) => counts[i]++);
      const best = Math.max(...counts);
      const leaders = counts.flatMap((c, i) => (c === best ? [i] : []));
      const tie = leaders.length > 1;
      const id = tie ? 'B' : IDS[leaders[0]];
      const r = R[id];

      const heading = h('h3', { text: `Your routine: ${id} (${r.name})`, tabindex: '-1' });
      const reason = tie
        ? `Your answers pointed to different routines, so Routine B is the balanced choice. It is best for ${r.bestFor}.`
        : `Most of your answers point here. It is best for ${r.bestFor}.`;

      const openBtn = h('button', { class: 'btn', type: 'button', text: `Open Routine ${id}` });
      openBtn.addEventListener('click', () => {
        select(id, true);
        $('#routine-tabs').scrollIntoView();
      });
      const retake = h('button', { class: 'btn btn-outline', type: 'button', text: 'Retake' });
      retake.addEventListener('click', () => { step = 0; answers = []; render(true); });

      box.append(heading, h('p', { text: reason }), h('div', { class: 'quiz-actions' }, openBtn, retake));
      return heading;
    }

    render(false);
  }

  /* ===== Tips ===== */
  function initTips() {
    ROUTINES.tips.forEach((tip) => $('#tips-list').append(h('li', { text: tip })));
  }

  /* ===== Wake-up streak ===== */
  function initStreak() {
    const grid = $('#streak-grid');
    const stats = $('#streak-stats');
    const start = parseLocalDate(START_DATE);
    let marked = new Set(load());

    function load() {
      try {
        const list = JSON.parse(store.get(STREAK_KEY));
        return Array.isArray(list) ? list : [];
      } catch (e) { return []; }
    }
    function save() { store.set(STREAK_KEY, JSON.stringify([...marked])); }

    // Consecutive marked days up to today (or yesterday if today is not marked yet)
    function currentStreak() {
      const today = Math.min(Math.max(getDayNumber(), 0), TOTAL_DAYS);
      let day = marked.has(today) ? today : today - 1;
      let count = 0;
      while (day >= 1 && marked.has(day)) { count++; day--; }
      return count;
    }

    function paint() {
      grid.querySelectorAll('.cell').forEach((cell) =>
        cell.setAttribute('aria-pressed', marked.has(Number(cell.dataset.day))));
      const streak = currentStreak();
      stats.textContent = `Current streak: ${streak} day${streak === 1 ? '' : 's'} | Woke on time: ${marked.size} of ${TOTAL_DAYS}`;
    }

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + day - 1)
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      grid.append(h('button', {
        class: 'cell', type: 'button', 'data-day': day, 'aria-pressed': 'false',
        'aria-label': `Woke on time: Day ${day}, ${date}`
      }, h('strong', { text: 'Day ' + day }), h('small', { text: date })));
    }

    grid.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const day = Number(cell.dataset.day);
      if (marked.has(day)) marked.delete(day); else marked.add(day);
      save();
      paint();
    });

    $('#streak-reset').addEventListener('click', () => {
      if (window.confirm('Reset your wake-up streak? This cannot be undone.')) {
        marked = new Set();
        save();
        paint();
      }
    });

    paint();
  }

  initTabs();
  initComparison();
  initQuiz();
  initTips();
  initStreak();
})();