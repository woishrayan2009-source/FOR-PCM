/* All lecture content. Edit here; lectures.html reads it.
   Everything is declared inside one function and exposed as the single global LECTURES
   (SUBJECTS, PLAYLISTS, CHANNELS, MARATHONS, CHAPTERS, QUICK, NOT_FOUND, INTEGRALS, INORGANIC,
   TIPS, CHECKLIST, GAPS, BANNER). This avoids a clash with CHAPTERS in data/plan.js,
   which the lectures page also loads to show plan days.

   Rules: never add a YouTube URL that is not listed here. An entry without "url" shows plain
   text plus a "Search on YouTube" button. Confidence is "High", "Medium" or "Low" (none are High).
   To add playlist titles, fill PLAYLISTS.<subject>.playlistVideos with { title, length? } in order. */
const LECTURES = (function () {
  'use strict';

  /* ---- URLs (only these are used) ---- */
  const LINKS = {
    mathsPlaylist: "https://www.youtube.com/playlist?list=PLr6TOxpiWwuFdbGXi3KtVdVSrs8ljU1N3",
    physicsPlaylist: "https://www.youtube.com/playlist?list=PLF7C-DWw7CnPZrgNMEbhuBzaM8IT4je2k",
    chemistryPlaylist: "https://www.youtube.com/playlist?list=PLVSwGhkgl7tzfFY-IGJQ2KqFAVxwcbbxG",
    ncertWallahPlaylist: "https://www.youtube.com/playlist?list=PL2xF3HCNxGM8JscWKWvoxY4EGf8C5ur_4",
    tyagiFullPhysics: "https://www.youtube.com/watch?v=GtN6qRR78A8",
    deepakHalfYearly: "https://www.youtube.com/watch?v=J5w5FvuQ4Uk",
    deepakBacklog: "https://www.youtube.com/watch?v=sDTz_HPy3Xw",
    solutionOneShot: "https://www.youtube.com/watch?v=jVDvGDnmUXw",
    atomsNumericals: "https://youtu.be/9pKYG7siADo",
    dfReactions: "https://youtu.be/IZMyZ1n6pow",
    nameReactions: "https://youtu.be/P0nsu9Qpi14",
    importantQuestions: "https://youtu.be/4Fr97Kzwvm8"
  };

  /* "Verified how" labels */
  const HOW = {
    playlist: "Playlist page seen",
    snippet: "Search snippet",
    telegram: "Telegram mirror",
    playboard: "Playboard listing",
    title: "Title seen"
  };

  /* Lecture entry: text, how it was seen, optional url, optional second link ("also") */
  const entry = (text, how, url, also) => {
    const e = { text };
    if (how) e.how = how;
    if (url) e.url = url;
    if (also) e.also = also;
    return e;
  };
  const chapter = (subject, name, primary, backup, covers, confidence, searchPhrase) =>
    ({ subject, chapter: name, primary, backup, covers, confidence, searchPhrase });

  /* ---- Tabs ---- */
  const SUBJECTS = [
    { id: "physics", name: "Physics", kind: "subject",
      note: "Formula-revision, derivation-revision and numerical-practice videos for Physics: not verified (only the Atoms numerical video was seen)." },
    { id: "chemistry", name: "Chemistry", kind: "subject",
      note: "NCERT line-by-line lectures for d- and f-block and Coordination Compounds: see the Inorganic leads card." },
    { id: "maths", name: "Maths", kind: "subject",
      note: "Exercise numbers differ between sources for the revised NCERT. Search by topic name, not by number." },
    { id: "quick", name: "Quick revision", kind: "quick" },
    { id: "tips", name: "Tips & checklist", kind: "tips" }
  ];

  /* ---- Banner and fixed texts ---- */
  const BANNER = {
    lead: "Read first.",
    text: "Individual video pages could not be opened during research, so video lengths and chapter-level contents are NOT verified. Playlist pages were seen for only some items. Check the title, upload date and syllabus on YouTube before relying on a lecture. Compare any 2025-26 or Boards 2026 label with the 2026-27 syllabus.",
    legend: [
      { label: "Playlist page seen", levels: ["Medium"] },
      { label: "Search snippet", levels: ["Medium", "Low"] },
      { label: "Telegram mirror or listing", levels: ["Low"] }
    ],
    syllabus: "Chapter lists match the official 2026-27 syllabus. Surface Chemistry, Polymers, Isolation of Elements and Chemistry in Everyday Life are formative-only and not listed.",
    unverified: "Not verified",
    emptyPlaylist: "Video titles not added yet. Open the playlist, copy the titles in order, and add them to data/lectures.js (playlistVideos).",
    footer: "FOR PCM does not host videos. All links go to YouTube."
  };

  /* ---- Main playlists (one per subject) ---- */
  const PLAYLISTS = {
    maths: { title: "Class 12 Maths NCERT Detailed One Shot Series | 2025-26", owner: "cbseclass videos", videos: 13,
      url: LINKS.mathsPlaylist, verified: HOW.playlist, confidence: "Medium",
      note: "13 videos for 13 chapters (inference). 2025-26 label: check syllabus.", playlistVideos: [] },
    physics: { title: "BRAMHASTRA: Class 12 Physics Boards 2026 (Complete One Shots + PYQs)", owner: "Arvind Academy", videos: 28,
      url: LINKS.physicsPlaylist, verified: HOW.playlist, confidence: "Medium",
      note: "Could be 14 one-shots + 14 PYQ videos (inference). Boards 2026 label.", playlistVideos: [] },
    chemistry: { title: "Class 12 Chemistry Boards 2026 | One Shot", owner: "Bharat Panchal, Chemistry Guruji 2.0", videos: 11,
      url: LINKS.chemistryPlaylist, verified: HOW.playlist, confidence: "Medium",
      note: "11 videos for 10 chapters; the extra one is unidentified. Boards 2026 label.", playlistVideos: [] }
  };

  /* ---- Top channels ---- */
  const CHANNELS = {
    physics: {
      list: [{ name: "Arvind Academy" }, { name: "Akshay Tyagi (NCERT Wallah channel)" }, { name: "Ashu Sir", confidence: "Low" }],
      reason: "Arvind has the BRAMHASTRA one-shot playlist, a Boards 2027 chapter one-shot series, and NCERT-solutions and chapterwise playlists. Akshay Tyagi has a one-shot playlist and a full one-shot video, labelled Boards 2026.",
      series: [{ channel: "Arvind Academy", text: "Yes. Search snippets show a Boards 2027 'One Shot | All Derivations + PYQs' title for Potential and Capacitance and an announcement of a 'Full Chapter 1 Shot'. Other playlists seen: NCERT Solutions (15 videos), Chapterwise One Shot (14 videos, 'Term I' in the title, so check syllabus), and BRAMHASTRA (28). A single full-syllabus Physics marathon from Arvind was not verified." }]
    },
    chemistry: {
      list: [{ name: "Bharat Panchal" }],
      note: "A second channel could not be verified.",
      reason: "Chapterwise one-shots, a Half-Yearly Marathon labelled Boards 2027, name-reaction and d&f reaction videos.",
      series: [{ channel: "Bharat Panchal", text: "Yes. A Telegram mirror shows 'Half Yearly Marathon Day 01 | Solution in One Shot | Boards 2027'. A Playboard listing shows 'Full Chemistry in 3 Hours | Rapid Revision' and 'Full Chemistry in 2 Hours', both undated, so check syllabus." }]
    },
    maths: {
      list: [{ name: "cbseclass videos (your playlist)" }, { name: "PW Deepak Sir" }, { name: "Neha Agrawal", confidence: "Low" }],
      reason: "Your playlist is a 13-video chapter set. Deepak Sir has marathons labelled 2026-27.",
      series: [{ channel: "cbseclass videos", text: "Your playlist is a 13-video one-shot set. An exercise-wise Integrals set also exists." }]
    }
  };

  /* ---- Marathons: channel, title, year, fit, how, confidence, url (no url = Search button) ---- */
  const MARATHONS = {
    physics: [
      { channel: "Arvind Academy", title: "BRAMHASTRA playlist (28 videos)", year: "2026", fit: "Complete one-shots + PYQs; check syllabus", how: HOW.playlist, confidence: "Medium", url: LINKS.physicsPlaylist },
      { channel: "Akshay Tyagi", title: "Class 12 Physics Complete One Shot Revision, Full Board Exam Prep 2026", year: "2026", fit: "Single-video first pass; check syllabus", how: HOW.snippet, confidence: "Low", url: LINKS.tyagiFullPhysics },
      { channel: "NCERT Wallah (Akshay Tyagi)", title: "One-shot playlist, 13 videos", year: "2026", fit: "Chapter-by-chapter; 13 videos for 14 chapters, so one may be missing", how: HOW.playlist, confidence: "Medium", url: LINKS.ncertWallahPlaylist }
    ],
    chemistry: [
      { channel: "Bharat Panchal", title: "Class 12 Chemistry Boards 2026 One Shot playlist (11 videos)", year: "2026", fit: "Chapterwise first pass; check syllabus", how: HOW.playlist, confidence: "Medium", url: LINKS.chemistryPlaylist },
      { channel: "Bharat Panchal", title: "Half Yearly Marathon series, Boards 2027 (Day 01 = Solutions)", year: "2026-27", fit: "Later days not verified", how: "Telegram mirror", confidence: "Low" },
      { channel: "Bharat Panchal", title: "Full Chemistry in 3 Hours, Rapid Revision", year: "Unknown", fit: "Fast pass; check syllabus", how: HOW.playboard, confidence: "Low" }
    ],
    maths: [
      { channel: "cbseclass videos", title: "Class 12 Maths NCERT Detailed One Shot Series 2025-26 (13 videos)", year: "2025-26", fit: "Chapter set; check syllabus", how: HOW.playlist, confidence: "Medium", url: LINKS.mathsPlaylist },
      { channel: "PW, Deepak Sir", title: "Class 12 Maths Half Yearly Marathon 2026-27, Complete Syllabus Revision", year: "2026", fit: "Current syllabus label", how: HOW.snippet, confidence: "Medium", url: LINKS.deepakHalfYearly },
      { channel: "PW, Deepak Sir", title: "Class 12 Maths Backlog Marathon 2026-27", year: "2026", fit: "Backup marathon", how: HOW.snippet, confidence: "Medium", url: LINKS.deepakBacklog }
    ]
  };

  /* ---- Chapters. Names must match the plan keys in data/plan.js ("Subject|Chapter") ---- */
  const PHYSICS_PLAYLIST = entry("Your BRAMHASTRA playlist", HOW.playlist);
  const physics = [
    chapter("physics", "Electric Charges & Fields", entry("Your BRAMHASTRA playlist / Arvind Boards 2027 one-shot", HOW.playlist), entry("Akshay Tyagi one-shot"), "Concept, derivations, PYQs", "Low", "Electric Charges and Fields Class 12 One Shot Arvind Academy Boards 2027"),
    chapter("physics", "Potential & Capacitance", entry("Arvind “One Shot, All Derivations + PYQs, Boards 2027”", HOW.title), entry("Akshay Tyagi one-shot"), "Derivations, PYQs", "Medium", "Potential and Capacitance Class 12 One Shot All Derivations Arvind Academy"),
    chapter("physics", "Current Electricity", PHYSICS_PLAYLIST, entry("Arvind chapterwise one-shot"), "Concept, numericals", "Low", "Current Electricity Class 12 One Shot Boards 2027"),
    chapter("physics", "Moving Charges & Magnetism", PHYSICS_PLAYLIST, entry("Akshay Tyagi one-shot"), "Derivations", "Low", "Moving Charges and Magnetism Class 12 One Shot Arvind Academy"),
    chapter("physics", "Magnetism & Matter", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Concept", "Low", "Magnetism and Matter Class 12 One Shot Boards 2027"),
    chapter("physics", "EMI", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Concept, numericals", "Low", "EMI Class 12 One Shot Arvind Academy Boards 2027"),
    chapter("physics", "AC", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Derivations, numericals", "Low", "Alternating Current Class 12 One Shot Boards 2027"),
    chapter("physics", "EM Waves", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Concept", "Low", "Electromagnetic Waves Class 12 One Shot Boards 2027"),
    chapter("physics", "Ray Optics", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Derivations, numericals", "Low", "Ray Optics Class 12 One Shot Arvind Academy Boards 2027"),
    chapter("physics", "Wave Optics", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Derivations", "Low", "Wave Optics Class 12 One Shot Boards 2027"),
    chapter("physics", "Dual Nature", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Numericals", "Low", "Dual Nature Class 12 One Shot Boards 2027"),
    chapter("physics", "Atoms", entry("Arvind “Atoms: Numericals in 20 Minutes” (Boards 2026 label)", HOW.telegram, LINKS.atomsNumericals), PHYSICS_PLAYLIST, "Numericals", "Medium", "Atoms Class 12 One Shot Arvind Academy"),
    chapter("physics", "Nuclei", PHYSICS_PLAYLIST, entry("Akshay Tyagi"), "Concept, numericals", "Low", "Nuclei Class 12 One Shot Boards 2027"),
    chapter("physics", "Semiconductors", PHYSICS_PLAYLIST, entry("Akshay Tyagi (may be the missing chapter)"), "Concept", "Low", "Semiconductor Electronics Class 12 One Shot Boards 2027")
  ];

  const CHEM_PLAYLIST = entry("Your Bharat Panchal playlist", HOW.playlist);
  const NONE = entry("None verified");
  const chemistry = [
    chapter("chemistry", "Solutions", entry("Your Bharat Panchal playlist", HOW.playlist, null, { text: "“Solution in One Shot”", url: LINKS.solutionOneShot }), entry("Bharat “NCERT ka Nichod of Solutions”", HOW.title), "Theory, numericals, NCERT recap", "Medium", "Solutions Class 12 Chemistry One Shot Bharat Panchal Boards 2027"),
    chapter("chemistry", "Electrochemistry", CHEM_PLAYLIST, entry("Bharat Rapid Revision"), "Numericals", "Low", "Electrochemistry Class 12 One Shot Bharat Panchal"),
    chapter("chemistry", "Chemical Kinetics", CHEM_PLAYLIST, NONE, "Derivations, numericals", "Low", "Chemical Kinetics Class 12 One Shot Bharat Panchal"),
    chapter("chemistry", "d- & f-Block", entry("Bharat “All Reactions of d and f Block Elements”", HOW.telegram, LINKS.dfReactions), entry("See the Inorganic leads card"), "Reactions, K2Cr2O7, KMnO4", "Low", "d and f Block Class 12 One Shot Bharat Panchal NCERT line by line"),
    chapter("chemistry", "Coordination Compounds", CHEM_PLAYLIST, NONE, "Naming, isomerism, bonding", "Low", "Coordination Compounds Class 12 One Shot Bharat Panchal"),
    chapter("chemistry", "Haloalkanes & Haloarenes", entry("Bharat “Full Chapter in One Shot”", HOW.playboard), NONE, "Mechanisms, reactions", "Low", "Haloalkanes and Haloarenes Class 12 One Shot Bharat Panchal"),
    chapter("chemistry", "Alcohols, Phenols, Ethers", entry("Bharat “Important Organic Mechanism, One Shot”", HOW.title), NONE, "Mechanisms", "Low", "Alcohols Phenols Ethers Class 12 One Shot Bharat Panchal"),
    chapter("chemistry", "Aldehydes, Ketones, Acids", CHEM_PLAYLIST, entry("Bharat “All Name Reaction in One Shot”", HOW.telegram, LINKS.nameReactions), "Named reactions, conversions", "Low", "Aldehydes Ketones Carboxylic Acids Class 12 One Shot Bharat Panchal"),
    chapter("chemistry", "Amines", entry("Bharat “Amines in One Shot, Boards 2024-25” (check syllabus)", HOW.title), NONE, "Reactions", "Low", "Amines Class 12 One Shot Bharat Panchal Boards 2027"),
    chapter("chemistry", "Biomolecules", CHEM_PLAYLIST, NONE, "Concept", "Low", "Biomolecules Class 12 One Shot Bharat Panchal Boards 2027")
  ];

  /* Maths: every chapter except Integrals shares the same lecture text. [plan name, full name for search] */
  const MATHS_DEFAULT = {
    primary: entry("Your cbseclass videos one-shot playlist (13 videos; order not seen)", HOW.playlist),
    backup: entry("PW Deepak Sir marathon (2026-27)", HOW.snippet),
    covers: "Chapter one-shot and exercise solutions"
  };
  const mathsChapter = ([name, fullName]) =>
    chapter("maths", name, MATHS_DEFAULT.primary, MATHS_DEFAULT.backup, MATHS_DEFAULT.covers, "Low", "CBSE Class Videos " + fullName + " Exercise");
  const maths = [
    ...[["Relations & Functions", "Relations and Functions"], ["Inverse Trig", "Inverse Trigonometric Functions"], ["Matrices", "Matrices"],
        ["Determinants", "Determinants"], ["Continuity & Differentiability", "Continuity and Differentiability"],
        ["Applications of Derivatives", "Applications of Derivatives"]].map(mathsChapter),
    chapter("maths", "Integrals", entry("Your cbseclass videos one-shot playlist, plus the exercise-wise Integrals set (see the Integrals card)"), entry("LearnoHub Hindi one-shot; Ushank Sir 6h05m one-shot (2024-25, check syllabus)"), "Standard forms, methods, definite integrals", "Medium", "CBSE Class Videos Integrals Exercise 7"),
    ...[["Applications of Integrals", "Applications of Integrals"], ["Differential Equations", "Differential Equations"], ["Vectors", "Vector Algebra"],
        ["3D Geometry", "Three Dimensional Geometry"], ["Linear Programming", "Linear Programming"], ["Probability", "Probability"]].map(mathsChapter)
  ];

  const CHAPTERS = [...physics, ...chemistry, ...maths];

  /* ---- Quick revision: link = url, several = links, none = Search button ---- */
  const QUICK = [
    { subject: "Chemistry", asset: "Bharat “All Name Reaction in One Shot”", how: HOW.telegram, confidence: "Low", url: LINKS.nameReactions },
    { subject: "Chemistry", asset: "Bharat “All Reactions of d and f Block”", how: HOW.telegram, confidence: "Low", url: LINKS.dfReactions },
    { subject: "Chemistry", asset: "Bharat “Most Important Question Series”", how: HOW.telegram, confidence: "Low", url: LINKS.importantQuestions },
    { subject: "Physics", asset: "Arvind “Atoms Numericals in 20 Minutes”", how: HOW.telegram, confidence: "Low", url: LINKS.atomsNumericals },
    { subject: "Maths", asset: "Deepak Sir marathons (see Marathons)", how: HOW.snippet, confidence: "Medium",
      links: [{ label: "Half Yearly Marathon 2026-27", url: LINKS.deepakHalfYearly }, { label: "Backlog Marathon 2026-27", url: LINKS.deepakBacklog }] }
  ];

  const NOT_FOUND = {
    title: "Not found",
    items: ["“formula in 10 minutes”", "“mind map”", "“all derivations in one video” for 2026-27", "A Maths “all integration formulas” video"]
  };

  /* ---- Integrals deep set (Maths tab) ---- */
  const INTEGRALS = {
    title: "Integrals deep set",
    primary: "cbseclass videos has an exercise-wise Integrals set. A Class Central listing shows an intro plus a hints-and-solutions video for each exercise from Ex 7.1 to 7.11, plus the Miscellaneous Exercise. The listing is undated and the numbering matches the older book, so match by topic against your revised NCERT.",
    hindi: "LearnoHub, “Integration Class 12 | Integrals NCERT Chapter 7 One Shot”.",
    long: "Ushank Sir, “Integration One Shot Maths 2024-25 Zero to Hero” (6h05m). Labelled 2024-25, so check syllabus.",
    confidence: ["Low", "Medium"],
    basis: "Class Central listing and snippets",
    searches: [
      "Integration by substitution Class 12",
      "Integration by parts ILATE Class 12",
      "Partial fractions Class 12 NCERT",
      "Definite integrals properties King property",
      "Definite integral PYQ pattern Class 12 Boards"
    ]
  };

  /* ---- Inorganic leads (Chemistry tab, optional) ---- */
  const INORGANIC = {
    title: "Optional (NEET-oriented, may go deeper than boards need)",
    note: "Titles seen; channels unverified.",
    rows: [
      { title: "Buniyaad NCERT Line by D and F Block Elements | Boards | NEET", length: "3h33m", confidence: "Low" },
      { title: "d and f block | NCERT Line by Line | NCERT Chemistry | NEET 2025", length: "2h30m", confidence: "Low" },
      { title: "d and f Block Elements Class 12 Chemistry Chapter 4 One Shot | New NCERT | CBSE NEET | Full chapter", length: "3h08m", confidence: "Low" },
      { title: "Coordination compounds NCERT line by line", note: "channel and length unknown", length: "Unknown", confidence: "Low" }
    ]
  };

  /* ---- Tips tab ---- */
  const TIPS = {
    title: "Negative filter: avoid",
    items: [
      "Videos from before the 2023-24 rationalisation or with “Term I/II” in the title.",
      "Clickbait titles such as “Sirf ye 5 chapters = 55 marks pakke” (you need full coverage).",
      "Videos with very long intros or ads.",
      "English-only, fast lectures unless you follow them easily.",
      "Videos without a visible upload date."
    ]
  };
  const CHECKLIST = {
    title: "First 2 minutes checklist",
    items: [
      "The title or description mentions 2026-27 or Boards 2027.",
      "The first 2 minutes teach rather than sell a batch.",
      "The speaker opens NCERT or writes derivations step by step.",
      "The video states which syllabus it follows.",
      "The pace is one you can follow in Hindi or Hinglish.",
      "The chapter outline matches your list (no Surface Chemistry or p-block in a boards video)."
    ]
  };
  const GAPS = {
    title: "Gaps",
    items: [
      "Video-level titles, order and lengths for your three playlists.",
      "Physics formula-sheet and all-derivations videos made for 2026-27.",
      "A second verified Chemistry channel.",
      "A verified NCERT line-by-line Coordination Compounds lecture.",
      "A single full-syllabus Physics marathon from Arvind."
    ]
  };

  return { SUBJECTS, PLAYLISTS, CHANNELS, MARATHONS, CHAPTERS, QUICK, NOT_FOUND, INTEGRALS, INORGANIC, TIPS, CHECKLIST, GAPS, BANNER };
})();