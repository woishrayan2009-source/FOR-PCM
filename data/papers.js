/* All paper content. Edit here; papers.html reads it.
   Plain globals (no modules), like data/plan.js. Only the URLs in LINKS are ever used.
   BANK rows: sourceKey / msKey are keys of LINKS; an object means "one key per subject".
   If a key is missing from LINKS, that button is hidden.
   PHASE_PAPERS: day = plan day number (Day 1 = 17 Oct 2026), bank = BANK number. */

const MAXMARKS = { physics: 70, chemistry: 70, maths: 80 };

const SQP_PAGE = "https://cbseacademic.nic.in/SQP_CLASSXII_2026-27.html";

const LINKS = {
  sqp2627: { title: "Class XII sample papers and marking schemes 2026-27", url: SQP_PAGE,
    note: "Official page for all three subjects, SQP and marking scheme (MS)." },
  phys2627: { title: "Physics 2026-27 SQP (PDF)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2026_27/Physics-SQP.pdf",
    note: "Opened and verified in research." },
  chem2627: { title: "Chemistry 2026-27 SQP (PDF)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2026_27/Chemistry-SQP.pdf",
    note: "Opened and verified in research." },
  math2627: { title: "Maths 2026-27 SQP (PDF)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2026_27/Maths-SQP.pdf",
    note: "Opened and verified in research: 80 marks, 3 hours, 38 questions." },
  physMS2627: { title: "Physics 2026-27 marking scheme (PDF)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2026_27/Physics-MS.pdf",
    note: "Opened and verified in research." },
  chemMS2627: { title: "Chemistry 2026-27 marking scheme (PDF)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2026_27/Chemistry-MS.pdf",
    note: "Found in search results; not opened in the last verification pass." },
  mathMS2627: { title: "Maths 2026-27 marking scheme (PDF)", url: "https://cbseacademic.nic.in/web_material/SQP/ClassXII_2026_27/Maths-MS.pdf",
    note: "Found in search results; not opened in the last verification pass." },
  sqp2324: { title: "2023-24 SQP and MS", url: "https://cbseacademic.nic.in/SQP_CLASSXII_2023-24.html", note: "Official page." },
  sqp2526: { title: "2025-26 SQP and MS", url: "https://cbseacademic.nic.in/SQP_CLASSXII_2025-26.html", note: "Official page." },
  sqp2425: { title: "2024-25 SQP and MS", url: "https://cbseacademic.nic.in/SQP_CLASSXII_2024-25.html", note: "Official page." },
  sqparch: { title: "SQP archive (earlier sessions)", url: "https://cbseacademic.nic.in/sqp_archive.html",
    note: "SQPs and marking schemes from earlier sessions through 2025-26." },
  board: { title: "Board question papers", url: "https://www.cbse.gov.in/cbsenew/question-paper.html",
    note: "Recent Class XII papers including 2025 and compartment papers. Older-year availability not verified." },
  ms: { title: "Official marking schemes", url: "https://www.cbse.gov.in/cbsenew/marking-scheme.html", note: "Official marking schemes for board papers." },
  model: { title: "Candidate model answers", url: "https://www.cbse.gov.in/cbsenew/model-answer.html", note: "Official candidate model answers." },
  learncbse: { group: "secondary", title: "LearnCBSE: chapter-wise previous year questions with solutions",
    url: "https://www.learncbse.in/chapterwise-previous-years-questions-pyqs-solutions/",
    note: "Third-party. Page says solutions follow the CBSE marking scheme. Cross-check with NCERT and the official marking schemes." }
};

/* ---- Paper bank: the same 15 rows for every subject ---- */
const G1 = "1-5 Topic practice", G2 = "6-10 Mixed practice", G3 = "11-15 Full simulation";
const USE_TOPIC = "Topic-wise only (derivations, numericals, reactions, standard problems). Do not use for timing.";
const USE_TERM = "Topic practice; not a normal 3-hour simulation.";
const USE_MIXED = "Mixed practice and timing.";
const USE_FULL = "Full 3-hour simulation.";
const row = (n, group, year, type, use, sourceKey, msKey, flag) => ({ n, group, year, type, use, sourceKey, msKey, flag });

const BANK = [
  row(1, G1, "2016 board", "Board paper", USE_TOPIC, "board", "ms"),
  row(2, G1, "2017 board", "Board paper", USE_TOPIC, "board", "ms"),
  row(3, G1, "2018 board", "Board paper", USE_TOPIC, "board", "ms"),
  row(4, G1, "2019 board", "Board paper", USE_TOPIC, "board", "ms"),
  row(5, G1, "2020 board", "Board paper", USE_TOPIC, "board", "ms"),
  row(6, G2, "2021-22 Term I", "Board paper (MCQ-heavy term format)", USE_TERM, "board", "ms"),
  row(7, G2, "2021-22 Term II (the 2022 board paper)", "Board paper (term format)", USE_TERM, "board", "ms"),
  row(8, G2, "2023 board", "Board paper", USE_MIXED, "board", "ms"),
  row(9, G2, "2023-24 SQP", "Official sample paper", USE_MIXED, "sqp2324", "sqp2324"),
  row(10, G2, "Your pick (suggested: 2022-23 SQP from the archive)", "Official sample paper", "Suggestion only; not part of the research.", "sqparch", "sqparch", "Not in research"),
  row(11, G3, "2024 board", "Board paper", USE_FULL, "board", "ms"),
  row(12, G3, "2024-25 SQP", "Official sample paper", USE_FULL, "sqp2425", "sqp2425"),
  row(13, G3, "2025 board", "Board paper", USE_FULL, "board", "ms"),
  row(14, G3, "2025-26 SQP", "Official sample paper", USE_FULL, "sqp2526", "sqp2526"),
  row(15, G3, "2026-27 SQP", "Official sample paper", USE_FULL, { physics: "phys2627", chemistry: "chem2627", maths: "math2627" }, { physics: "physMS2627", chemistry: "chemMS2627", maths: "mathMS2627" })
];

/* ---- Which paper on which plan day ---- */
const PHASE_PAPERS = {
  physics: [{ day: 28, bank: 15 }, { day: 30, bank: 13 }, { day: 31, bank: 11 }, { day: 33, bank: 8 }],
  chemistry: [{ day: 29, bank: 15 }, { day: 30, bank: 13 }, { day: 32, bank: 11 }, { day: 33, bank: 8 }],
  maths: [{ day: 28, bank: 15 }, { day: 29, bank: 13 }, { day: 31, bank: 11 }, { day: 32, bank: 8 }]
};

/* Buffer days 19-20 Nov (Day 34 and 35): optional, one paper per day per subject as time allows */
const BUFFER = [{ day: 34, bank: 14 }, { day: 35, bank: 12 }];

const BANNER = {
  verified: "the 2026-27 Physics, Chemistry and Maths sample papers (opened) and the Physics marking scheme (opened) on the official CBSE Academic page. The Chemistry and Maths marking-scheme PDFs were found in search but not opened.",
  notVerified: "every set/series and matching marking scheme for older years, and Hindi/bilingual solutions for every paper.",
  advice: "Download older papers from the official CBSE pages below, not from third-party links.",
  pattern: "Pattern unchanged for 2026-27 (per CBSE notification)."
};

const METHOD = {
  solving: { title: "Solving method", steps: [
    "Solve each paper in one uninterrupted 3-hour sitting with a timer.",
    "Check with the official marking scheme the same day.",
    "Write an error log entry for every lost mark.",
    "Re-solve the lost-mark questions after 3 days."
  ] },
  verify: { title: "Verify every solution in 3 steps", steps: [
    "Compare the final answer with the official marking scheme.",
    "Check the method against NCERT.",
    "Recompute numericals yourself or cross-check with one more trusted free source."
  ], note: "Free third-party explanation pages can be used only as a secondary source; download papers from official CBSE pages, not third-party links." },
  marking: { title: "Step-marking tips", items: [
    { subject: "Physics", text: "Write the formula, the substitution, the intermediate working, units and sign conventions." },
    { subject: "Chemistry", text: "Write reagents, balanced equations and the named reaction." },
    { subject: "Maths", text: "Write the rule or theorem, the substitution and the final simplification." }
  ] },
  pattern: { title: "Pattern notes", items: [
    { subject: "Maths", text: "38 questions, Section A 18 MCQ + 2 assertion-reason (1 mark), B 5 x 2, C 6 x 3, D 4 x 5, E 3 case studies x 4, no overall choice." },
    { subject: "Physics", text: "33 questions, A 12 MCQ + 4 assertion-reason (1 mark), B 5 x 2, C 7 x 3, D 2 case studies x 4, E 3 x 5, internal choice in B (2), C (1), E (all 3)." },
    { subject: "Chemistry", text: "33 questions, 70 marks, 3 hours (2026-27 Chemistry SQP opened and verified). CBSE states no change in design or pattern for 2026-27." }
  ] },
  when: { title: "When to use which paper", items: [
    "Prefer papers from 2023 onward, especially official sample papers, for timing practice; use older papers for topic-wise questions.",
    "Papers 1-5 (2016-2020 boards): topic-wise only (derivations, numericals, reactions, standard problems). Do not use for timing.",
    "Papers 6-7 (2021-22 term format): topic practice; not a normal 3-hour simulation.",
    "Papers 8-10: mixed practice and timing.",
    "Papers 11-15: full 3-hour simulation."
  ] }
};

/* Short UI texts and option lists */
const TEXT = {
  fourTitle: "Your 4 papers for Days 28-33",
  sitting: "Solve in one uninterrupted 3-hour sitting, then spend the rest of the day on review and repair.",
  orderNote: "This order follows your plan: official 2026-27 sample paper first, then previous board papers. Change it in data/papers.js if you want.",
  bufferTitle: "Buffer days (19-20 Nov)",
  bufferNote: "Optional: one paper per day as time allows.",
  bankNotes: [
    "Removed from the research list: a “2020-21 Term I” board paper. CBSE cancelled the 2021 Class 12 boards as far as we know, so it probably does not exist. The “2022 board paper” appears to be the 2021-22 Term II paper, so it is listed once. Verify on the CBSE pages.",
    "15 papers is a bank, not a target for the 33-day plan. The plan has room for 4 full papers per subject on Days 28-33. Continue with the rest before and after the pre-boards (21 Nov)."
  ],
  olderYears: "Older years (2016-2022): download from the official CBSE pages; year-wise availability was not verified.",
  progressNote: "Counts papers marked Solved or Reviewed.",
  status: [{ v: "none", label: "Not started" }, { v: "solved", label: "Solved" }, { v: "reviewed", label: "Reviewed" }],
  mistakes: ["Concept", "Formula", "Calculation", "Time", "Presentation"]
};