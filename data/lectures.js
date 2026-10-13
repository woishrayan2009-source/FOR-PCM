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
      note: "Your Brahmastra playlist is already watched: use it only to repair chapters where formulas or derivations do not come back from memory. No single CBSE-specific Physics numerical marathon was verified, so build numericals from NCERT examples and exercises." },
    { id: "chemistry", name: "Chemistry", kind: "subject",
      note: "Your base is weak and you have never read NCERT line by line: for d- & f-Block and Coordination use Bharat Panchal's NCERT ka NICHOD first." },
    { id: "maths", name: "Maths", kind: "subject",
      note: "Exercise-wise NCERT solving only for Integrals, Determinants, Continuity & Differentiability and 3D Geometry. Exercise numbers differ between sources for the revised NCERT: search by topic name." },
    { id: "quick", name: "Quick revision", kind: "quick" },
    { id: "tips", name: "Tips & checklist", kind: "tips" }
  ];

  /* ---- Banner and fixed texts ---- */
  const BANNER = {
    lead: "Read first.",
    text: "Individual video pages could not be opened during research, so most video lengths and chapter-level contents are NOT verified. Your playlist screenshots confirm the first five videos of each main playlist (shown under Playlist video order). Check the title, upload date and syllabus on YouTube before relying on a lecture. Compare any 2025-26 or Boards 2026 label with the 2026-27 syllabus.",
    legend: [
      { label: "Playlist page seen", levels: ["Medium"] },
      { label: "Search snippet", levels: ["Medium", "Low"] },
      { label: "Telegram mirror or listing", levels: ["Low"] }
    ],
    syllabus: "Chapter lists match the official 2026-27 syllabus. Communication Systems (Physics) and Solid State, Surface Chemistry, Metallurgy and Chemistry in Everyday Life (Chemistry) are outside it and not listed.",
    unverified: "Not verified",
    emptyPlaylist: "Video titles not added yet. Open the playlist, copy the titles in order, and add them to data/lectures.js (playlistVideos). Only the first five were seen in your screenshots.",
    footer: "FOR PCM does not host videos. All links go to YouTube."
  };

  /* ---- Main playlists (one per subject) ---- */
  const PLAYLISTS = {
    maths: { title: "Class 12 Maths NCERT Detailed One Shot Series | 2025-26", owner: "cbseclass videos", videos: 13,
      url: LINKS.mathsPlaylist, verified: HOW.playlist, confidence: "Medium",
      note: "Channel confirmed from your screenshot; first five videos are in NCERT order, the other eight are inferred (13 videos, 13 chapters). Series label 2025-26, last updated 21 Jul 2025: check syllabus.",
      playlistVideos: [
        { title: "Relations & Functions One Shot | Class 12 Maths Chapter 1 | Full NCERT Concept + PYQs | 2026", length: "3:09:41" },
        { title: "Inverse Trigonometric Functions One Shot | Class 12 Maths Chapter 2 | Full NCERT + PYQs", length: "1:59:31" },
        { title: "Matrices One Shot | Class 12 Maths Chapter 3 | Full NCERT Concept + PYQs | 2026", length: "2:33:34" },
        { title: "Determinants One Shot | Class 12 Maths Chapter 4 | Full NCERT + PYQs | 2025-26", length: "2:22:02" },
        { title: "Continuity & Differentiability One Shot | Class 12 Maths Chapter 5 | Full NCERT + PYQs", length: "2:58:53" }
      ] },
    physics: { title: "BRAMHASTRA: Class 12 Physics Boards 2026 (Complete One Shots + PYQs)", owner: "Arvind Academy", videos: 28,
      url: LINKS.physicsPlaylist, verified: HOW.playlist, confidence: "Medium",
      note: "Screenshot confirms one-shot, then a 10-year PYQ video, for each chapter (first five videos seen). The other 23 are inferred: 14 one-shots + 14 PYQ videos. Boards 2026 label; you have already watched this playlist.",
      playlistVideos: [
        { title: "Electric Charges & Fields Class 12 One Shot | Boards 2026 | Full Chapter + PYQs", length: "2:57:21" },
        { title: "Electric Charges and Fields Class 12 PYQ | Last 10 Years Questions | Physics Boards 2026", length: "2:10:02" },
        { title: "Potential & capacitance Class 12 One Shot | Boards 2026 | Full Chapter + PYQs", length: "2:50:23" },
        { title: "Potential and Capacitance Class 12 PYQ | Last 10 Years Questions | Physics Boards 2026", length: "1:44:38" },
        { title: "Current Electricity Class 12 One Shot | Boards 2026 | Full Chapter + PYQs", length: "3:14:00" }
      ] },
    chemistry: { title: "Class 12 Chemistry Boards 2026 | One Shot", owner: "Bharat Panchal, Chemistry Guruji 2.0", videos: 11,
      url: LINKS.chemistryPlaylist, verified: HOW.playlist, confidence: "Medium",
      note: "Channel confirmed from your screenshot (Prachand series, last updated 20 Feb 2026). First five videos are in NCERT order; 11 videos for 10 chapters, so one is unidentified. Boards 2026 label.",
      playlistVideos: [
        { title: "Chapter 1 Class 12 Chemistry | Solutions in One Shot | Boards 2025-26 | Prachand Series" },
        { title: "Class 12 Chemistry | Chapter 02 Electrochemistry in One Shot | Prachand Batch | Boards 2026", length: "3:21:07" },
        { title: "Chemical Kinetics in One Shot | Class 12 Chemistry Boards 2026", length: "2:32:39" },
        { title: "d and f Block Elements One Shot | Class 12 Chemistry | Bharat Panchal Sir", length: "2:33:21" },
        { title: "Coordination Compound in One Shot | Class 12 Chemistry Boards 2026 | Bharat Panchal Sir", length: "2:56:56" }
      ] }
  };

  /* ---- Top channels ---- */
  const CHANNELS = {
    physics: {
      list: [{ name: "Arvind Academy" }, { name: "NCERT Wallah / Rakshak Sir" }, { name: "Next Toppers" }, { name: "Shailendra Sir (NCERT Wallah)" }, { name: "Akshay Tyagi (earlier lead, unverified)", confidence: "Low" }],
      reason: "Arvind (your BRAMHASTRA playlist) stays the base, used only for targeted repair. For a formula sweep use NCERT Wallah / Rakshak Sir's all-chapter formulas one-shot; for derivations use Next Toppers' all-important-derivations video and Shailendra Sir's Book 1 derivations revision. Avoid RBSE-oriented formula videos as a main resource.",
      series: [{ channel: "Arvind Academy", text: "Yes. Search snippets show a Boards 2027 'One Shot | All Derivations + PYQs' title for Potential and Capacitance and an announcement of a 'Full Chapter 1 Shot'. Other playlists seen: NCERT Solutions (15 videos), Chapterwise One Shot (14 videos, 'Term I' in the title, so check syllabus), and BRAMHASTRA (28). A single full-syllabus Physics marathon from Arvind was not verified." }]
    },
    chemistry: {
      list: [{ name: "Bharat Panchal (Chemistry Guruji 2.0)" }],
      note: "A second channel could not be verified.",
      reason: "Playlist formats that match your needs: Chapterwise 15 and 30 Minutes Revision, Detailed One Shot, NCERT ka NICHOD, Organic Chemistry Conceptwise, Marks Booster PYQ, NCERT Diamond Questions, Chapterwise Most Important Topics.",
      series: [{ channel: "Bharat Panchal", text: "Yes. A Telegram mirror shows 'Half Yearly Marathon Day 01 | Solution in One Shot | Boards 2027'. A Playboard listing shows 'Full Chemistry in 3 Hours | Rapid Revision' and 'Full Chemistry in 2 Hours', both undated, so check syllabus." }]
    },
    maths: {
      list: [{ name: "cbseclass videos (your playlist)" }, { name: "Jain Tutor (Integrals)" }, { name: "VidyaWise / Rohit Solanki" }, { name: "PW Deepak Sir (earlier lead)", confidence: "Medium" }, { name: "Neha Agrawal", confidence: "Low" }],
      reason: "Your playlist is the theory and one-shot base. Jain Tutor is the deep resource for Integrals; VidyaWise / Rohit Solanki gives a chapter-wise backup. One-shots alone will not lift 40/80: solve NCERT.",
      series: [{ channel: "cbseclass videos", text: "Your playlist is a 13-video one-shot set (Detailed One Shot Series 2025-26). CBSE Class Videos is also the NCERT exercise-wise backup for Determinants, Continuity & Differentiability and 3D Geometry." }]
    }
  };

  /* ---- Marathons: channel, title, year, fit, how, confidence, url (no url = Search button) ---- */
  const MARATHONS = {
    physics: [
      { channel: "Arvind Academy", title: "BRAMHASTRA playlist (28 videos)", year: "2026", fit: "Already attended: targeted repair only, not a fresh full pass", how: HOW.playlist, confidence: "Medium", url: LINKS.physicsPlaylist },
      { channel: "NCERT Wallah / Rakshak Sir", title: "Class 12 Physics All Chapter-Wise Formulas in One Shot", year: "Not seen", fit: "Fast formula sweep, all 14 chapters; last-day recall", how: HOW.snippet, confidence: "Medium" },
      { channel: "Next Toppers", title: "All Most Important Derivations of Physics Class 12th", year: "Not seen", fit: "Derivation practice: attempt each derivation yourself first", how: HOW.snippet, confidence: "Medium" },
      { channel: "Akshay Tyagi", title: "Class 12 Physics Complete One Shot Revision, Full Board Exam Prep 2026", year: "2026", fit: "Single-video first pass; check syllabus", how: HOW.snippet, confidence: "Low", url: LINKS.tyagiFullPhysics },
      { channel: "NCERT Wallah (Akshay Tyagi)", title: "One-shot playlist, 13 videos", year: "2026", fit: "Chapter-by-chapter; 13 videos for 14 chapters, so one may be missing", how: HOW.playlist, confidence: "Medium", url: LINKS.ncertWallahPlaylist }
    ],
    chemistry: [
      { channel: "Bharat Panchal", title: "Class 12 Chemistry Boards 2026 One Shot playlist (11 videos)", year: "2026", fit: "Chapterwise first pass; check syllabus", how: HOW.playlist, confidence: "Medium", url: LINKS.chemistryPlaylist },
      { channel: "Bharat Panchal", title: "Detailed One Shot / One Playlist", year: "Not seen", fit: "Full-syllabus first pass", how: HOW.snippet, confidence: "Medium" },
      { channel: "Bharat Panchal", title: "Chapterwise 30 Minutes Revision", year: "Not seen", fit: "Faster second pass", how: HOW.snippet, confidence: "Medium" },
      { channel: "Bharat Panchal", title: "Half Yearly Marathon series, Boards 2027 (Day 01 = Solutions)", year: "2026-27", fit: "Later days not verified", how: "Telegram mirror", confidence: "Low" },
      { channel: "Bharat Panchal", title: "Full Chemistry in 3 Hours, Rapid Revision", year: "Unknown", fit: "Fast pass; check syllabus", how: HOW.playboard, confidence: "Low" }
    ],
    maths: [
      { channel: "cbseclass videos", title: "Class 12 Maths NCERT Detailed One Shot Series 2025-26 (13 videos)", year: "2025-26", fit: "Chapter set; check syllabus", how: HOW.playlist, confidence: "Medium", url: LINKS.mathsPlaylist },
      { channel: "VidyaWise / Rohit Solanki", title: "Class 12 Maths One Shot Playlist (chapter-wise)", year: "Not seen", fit: "Quick chapter-wise revision", how: HOW.snippet, confidence: "Medium" },
      { channel: "Jain Tutor", title: "Integration Full Chapter Playlist", year: "Not seen", fit: "Deep Integrals resource, exercise-wise and example-wise", how: HOW.snippet, confidence: "Medium" },
      { channel: "PW, Deepak Sir", title: "Class 12 Maths Half Yearly Marathon 2026-27, Complete Syllabus Revision", year: "2026", fit: "Current syllabus label", how: HOW.snippet, confidence: "Medium", url: LINKS.deepakHalfYearly },
      { channel: "PW, Deepak Sir", title: "Class 12 Maths Backlog Marathon 2026-27", year: "2026", fit: "Backup marathon", how: HOW.snippet, confidence: "Medium", url: LINKS.deepakBacklog }
    ]
  };

  /* ---- Chapters. Names must match the plan keys in data/plan.js ("Subject|Chapter") ---- */
  const PHYSICS_PLAYLIST = entry("Your BRAMHASTRA playlist (repair only: recall formulas and derivations first)", HOW.playlist);
  const physics = [
    chapter("physics", "Electric Charges & Fields", entry("Your BRAMHASTRA playlist / Arvind Boards 2027 one-shot", HOW.playlist), entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Concept, derivations, PYQs", "Low", "Electric Charges and Fields Class 12 One Shot Arvind Academy Boards 2027"),
    chapter("physics", "Potential & Capacitance", entry("Arvind “One Shot, All Derivations + PYQs, Boards 2027”", HOW.title), entry("“Electric Potential & Capacitance all Derivations” (step-by-step derivations video)", HOW.snippet), "Derivations, PYQs", "Medium", "Potential and Capacitance Class 12 One Shot All Derivations Arvind Academy"),
    chapter("physics", "Current Electricity", PHYSICS_PLAYLIST, entry("Arvind chapterwise one-shot"), "Concept, numericals", "Low", "Current Electricity Class 12 One Shot Boards 2027"),
    chapter("physics", "Moving Charges & Magnetism", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Derivations", "Low", "Moving Charges and Magnetism Class 12 One Shot Arvind Academy"),
    chapter("physics", "Magnetism & Matter", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Concept", "Low", "Magnetism and Matter Class 12 One Shot Boards 2027"),
    chapter("physics", "EMI", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Concept, numericals", "Low", "EMI Class 12 One Shot Arvind Academy Boards 2027"),
    chapter("physics", "AC", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Derivations, numericals", "Low", "Alternating Current Class 12 One Shot Boards 2027"),
    chapter("physics", "EM Waves", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Concept", "Low", "Electromagnetic Waves Class 12 One Shot Boards 2027"),
    chapter("physics", "Ray Optics", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Derivations, numericals", "Low", "Ray Optics Class 12 One Shot Arvind Academy Boards 2027"),
    chapter("physics", "Wave Optics", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Derivations", "Low", "Wave Optics Class 12 One Shot Boards 2027"),
    chapter("physics", "Dual Nature", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Numericals", "Low", "Dual Nature Class 12 One Shot Boards 2027"),
    chapter("physics", "Atoms", entry("Arvind “Atoms: Numericals in 20 Minutes” (Boards 2026 label)", HOW.telegram, LINKS.atomsNumericals), PHYSICS_PLAYLIST, "Numericals", "Medium", "Atoms Class 12 One Shot Arvind Academy"),
    chapter("physics", "Nuclei", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Concept, numericals", "Low", "Nuclei Class 12 One Shot Boards 2027"),
    chapter("physics", "Semiconductors", PHYSICS_PLAYLIST, entry("Next Toppers chapter one-shot (only where Arvind was unclear)"), "Concept", "Low", "Semiconductor Electronics Class 12 One Shot Boards 2027")
  ];

  const CH30 = entry("Bharat “Chapterwise 30 Minutes Revision”", HOW.snippet);
  const NICHOD = entry("Bharat “NCERT ka NICHOD” (chapterwise)", HOW.snippet);
  const CONCEPT = entry("Bharat “Organic Chemistry Conceptwise” first (reaction families, named reactions, conversions, mechanisms)", HOW.snippet);
  const ORG_BACK = entry("Then Bharat “Chapterwise 30 Minutes Revision”, then “NCERT ka NICHOD” for reasoning questions and exceptions", HOW.snippet);
  const DETAILED = entry("Bharat “Detailed One Shot” (or your Prachand one-shot video for this chapter)", HOW.snippet);
  const chemistry = [
    chapter("chemistry", "Solutions", CH30, DETAILED, "Theory, numericals, NCERT recap", "Medium", "Solutions Class 12 Chemistry Chapterwise 30 Minutes Revision Bharat Panchal"),
    chapter("chemistry", "Electrochemistry", CH30, DETAILED, "Numericals", "Medium", "Electrochemistry Class 12 Chapterwise 30 Minutes Revision Bharat Panchal"),
    chapter("chemistry", "Chemical Kinetics", CH30, DETAILED, "Formulae, numericals, graphs", "Medium", "Chemical Kinetics Class 12 Chapterwise 30 Minutes Revision Bharat Panchal"),
    chapter("chemistry", "d- & f-Block", NICHOD, CH30, "NCERT line by line, reactions, K2Cr2O7, KMnO4", "Medium", "d and f Block NCERT ka NICHOD Bharat Panchal"),
    chapter("chemistry", "Coordination Compounds", NICHOD, CH30, "Naming, isomerism, bonding", "Medium", "Coordination Compounds NCERT ka NICHOD Bharat Panchal"),
    chapter("chemistry", "Haloalkanes & Haloarenes", CONCEPT, ORG_BACK, "Mechanisms, reactions", "Medium", "Haloalkanes Haloarenes Organic Chemistry Conceptwise Bharat Panchal"),
    chapter("chemistry", "Alcohols, Phenols, Ethers", CONCEPT, ORG_BACK, "Mechanisms, reactions", "Medium", "Alcohols Phenols Ethers Organic Chemistry Conceptwise Bharat Panchal"),
    chapter("chemistry", "Aldehydes, Ketones, Acids", CONCEPT, ORG_BACK, "Named reactions, conversions", "Medium", "Aldehydes Ketones Carboxylic Acids Organic Chemistry Conceptwise Bharat Panchal"),
    chapter("chemistry", "Amines", CONCEPT, ORG_BACK, "Reactions, diazonium", "Medium", "Amines Organic Chemistry Conceptwise Bharat Panchal"),
    chapter("chemistry", "Biomolecules", CH30, DETAILED, "Concept, NCERT facts", "Medium", "Biomolecules Class 12 Chapterwise 30 Minutes Revision Bharat Panchal")
  ];


  /* Maths: every chapter except Integrals shares the same lecture text. [plan name, full name for search] */
  const MATHS_DEFAULT = {
    primary: entry("Your cbseclass videos one-shot playlist (first five chapters seen in NCERT order)", HOW.playlist),
    backup: entry("CBSE Class Videos exercise-wise NCERT (Determinants, Continuity & Differentiability, 3D Geometry); VidyaWise / Rohit Solanki chapter one-shot for the rest", HOW.snippet),
    covers: "Chapter one-shot; NCERT examples and selected exercises"
  };
  const mathsChapter = ([name, fullName]) =>
    chapter("maths", name, MATHS_DEFAULT.primary, MATHS_DEFAULT.backup, MATHS_DEFAULT.covers, "Low", "CBSE Class Videos " + fullName + " Exercise");
  const maths = [
    ...[["Relations & Functions", "Relations and Functions"], ["Inverse Trig", "Inverse Trigonometric Functions"], ["Matrices", "Matrices"],
        ["Determinants", "Determinants"], ["Continuity & Differentiability", "Continuity and Differentiability"],
        ["Applications of Derivatives", "Applications of Derivatives"]].map(mathsChapter),
    chapter("maths", "Integrals", entry("Jain Tutor “Integration Full Chapter Playlist” (exercise-wise and example-wise); “All Formulas of Integration” before every session", HOW.snippet), entry("VidyaWise / Rohit Solanki “Ch 7 Integrals One Shot” after Jain Tutor", HOW.snippet), "Standard forms, methods, definite integrals", "Medium", "Jain Tutor Integration Full Chapter Playlist Class 12"),
    ...[["Applications of Integrals", "Applications of Integrals"], ["Differential Equations", "Differential Equations"], ["Vectors", "Vector Algebra"],
        ["3D Geometry", "Three Dimensional Geometry"], ["Linear Programming", "Linear Programming"], ["Probability", "Probability"]].map(mathsChapter)
  ];

  const CHAPTERS = [...physics, ...chemistry, ...maths];

  /* ---- Quick revision: link = url, several = links, none = Search button ---- */
  const QUICK = [
    { subject: "Physics", asset: "NCERT Wallah / Rakshak Sir “All Chapter-Wise Formulas in One Shot”", how: HOW.snippet, confidence: "Medium" },
    { subject: "Physics", asset: "Next Toppers “All Most Important Derivations of Physics Class 12th”", how: HOW.snippet, confidence: "Medium" },
    { subject: "Physics", asset: "Shailendra Sir “All Important Derivations Book 1 Revision”", how: HOW.snippet, confidence: "Medium" },
    { subject: "Physics", asset: "“Top 20 Most Important Derivations” (final-day priority list only, not a full resource)", how: HOW.snippet, confidence: "Low" },
    { subject: "Chemistry", asset: "Bharat “Chapterwise 15 Minutes Revision” (final 2-3 days)", how: HOW.snippet, confidence: "Medium" },
    { subject: "Chemistry", asset: "Bharat “Chapterwise Most Important Topics” (final 2-3 days)", how: HOW.snippet, confidence: "Medium" },
    { subject: "Chemistry", asset: "Bharat “Marks Booster PYQ” and “NCERT Diamond Questions” (later PYQ phase)", how: HOW.snippet, confidence: "Medium" },
    { subject: "Maths", asset: "Jain Tutor “All Formulas of Integration”", how: HOW.snippet, confidence: "Medium" },
    { subject: "Chemistry", asset: "Bharat “All Name Reaction in One Shot”", how: HOW.telegram, confidence: "Low", url: LINKS.nameReactions },
    { subject: "Chemistry", asset: "Bharat “All Reactions of d and f Block”", how: HOW.telegram, confidence: "Low", url: LINKS.dfReactions },
    { subject: "Chemistry", asset: "Bharat “Most Important Question Series”", how: HOW.telegram, confidence: "Low", url: LINKS.importantQuestions },
    { subject: "Physics", asset: "Arvind “Atoms Numericals in 20 Minutes”", how: HOW.telegram, confidence: "Low", url: LINKS.atomsNumericals },
    { subject: "Maths", asset: "Deepak Sir marathons (earlier lead; see Marathons)", how: HOW.snippet, confidence: "Medium",
      links: [{ label: "Half Yearly Marathon 2026-27", url: LINKS.deepakHalfYearly }, { label: "Backlog Marathon 2026-27", url: LINKS.deepakBacklog }] }
  ];

  const NOT_FOUND = {
    title: "Not found",
    items: ["Mind-map videos for any subject", "A CBSE-specific Physics numerical-practice marathon", "Exact runtimes of the marathon videos (do not plan the timetable on them until opened)"]
  };

  /* ---- Integrals deep set (Maths tab) ---- */
  const INTEGRALS = {
    title: "Integrals deep set",
    primary: "Jain Tutor, “Integration Full Chapter Playlist”: exercise-wise and example-wise videos covering standard forms, substitution, by parts (ILATE), partial fractions, definite integrals and board-style NCERT questions. Use “All Formulas of Integration” before every practice session. Solve NCERT examples first, then Ex 7.1 to 7.11 selectively, then the Miscellaneous Exercise.",
    hindi: "VidyaWise / Rohit Solanki, “Ch 7 Integrals One Shot” (NCERT concepts, examples, exercises, important questions), after the Jain Tutor playlist.",
    long: "CBSE Class Videos has an exercise-wise Integrals set (from an earlier Class Central listing; undated, numbering matches the older book, so match by topic).",
    confidence: ["Medium"],
    basis: "search results; playlists not opened",
    searches: [
      "Jain Tutor Integration Full Chapter Playlist",
      "Jain Tutor All Formulas of Integration",
      "Integration by substitution Class 12",
      "Integration by parts ILATE Class 12",
      "Partial fractions Class 12 NCERT",
      "Definite integrals properties Class 12"
    ]
  };


  /* ---- Inorganic leads (Chemistry tab, optional) ---- */
  const INORGANIC = {
    title: "Optional extra leads (NEET-oriented, may go deeper than boards need; Bharat's NCERT ka NICHOD comes first)",
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
      "Titles like “100% common questions”, “guaranteed paper”, “leaked paper” or “sure shot”: they give false confidence.",
      "Physics and Chemistry videos older than the 2023-24 rationalisation, unless you check that removed topics are not taught.",
      "UP Board or Bihar Board “VVI” videos as a main CBSE resource (fine only for extra derivation practice).",
      "English-only lectures that are too fast for you; Hindi or Hinglish revises faster for you.",
      "Five-to-eight-hour marathons as your main method; use them only for a first map.",
      "Channels with long intros, promotions or generic strategy talk before teaching."
    ]
  };
  const CHECKLIST = {
    title: "First 2 minutes checklist",
    items: [
      "The title names the chapter, a revision or one-shot format, and CBSE 2025-26 or 2026-27.",
      "Real syllabus content starts within 2 to 3 minutes.",
      "Language and pace suit Hindi or Hinglish, ideally playable at 1.25x.",
      "It uses NCERT terminology, diagrams, reactions or exercise references, not only shortcuts.",
      "It includes board-pattern questions, PYQs or numericals.",
      "It provides a formula sheet, mind map, notes or other structured revision material."
    ]
  };
  const GAPS = {
    title: "Gaps",
    items: [
      "Titles, order and lengths for the rest of your three playlists (only the first five of each were seen).",
      "Exact runtimes of several marathon videos.",
      "Channel and chapter-level pages for most Maths chapters (confidence medium).",
      "A CBSE-specific Physics numerical-practice marathon.",
      "Links for the Next Toppers, NCERT Wallah, Shailendra Sir and Bharat Panchal revision playlists: only titles were seen, so they open as YouTube searches."
    ]
  };
  return { SUBJECTS, PLAYLISTS, CHANNELS, MARATHONS, CHAPTERS, QUICK, NOT_FOUND, INTEGRALS, INORGANIC, TIPS, CHECKLIST, GAPS, BANNER };
})();