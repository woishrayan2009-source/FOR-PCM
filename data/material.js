/* All study-material content. Edit here; material.html reads it.
   Plain globals (no modules), like data/plan.js. This file holds topic NAMES only:
   no formulas, no derivation steps, no reaction equations, and no links except those listed.

   ADDING TRUSTED LINKS: every chapter has links: []. To add links, put them in the "links" map inside
   CHAPTERS_MATERIAL below, keyed by "Subject|Chapter name". Shape of one entry:
     { title: "...", source: "...", type: "...", language: "...",
       url: "https://...", confidence: "Medium", verifiedHow: "..." }
   Example (an entry with example: true never renders; delete it after you understand the shape):
     "Physics|Atoms": [ { example: true, title: "Example, delete me", source: "Site name", type: "Video",
       language: "English", url: "https://example.com", confidence: "Low", verifiedHow: "Opened by me" } ]

   Checklist keys are "Subject|Chapter|item text". The Checklists tab points at the same keys
   ({ chapter, item }), so ticks stay in sync between the Checklists tab and the chapters. */

/* Short UI texts */
const MATERIAL_TEXT = {
  banner: "This page lists WHAT to master, using the topic names from the FOR PCM plan. Write formulas and reactions yourself from NCERT. Add trusted links in data/material.js. FOR PCM does not host notes or books.",
  progressNote: "Counts the “Must master” items in the chapters plus the items you add yourself.",
  priorityTitle: "Frequent topics (research summary)",
  priorityNote: "Research summary. Repetition years not verified. Always check against the current NCERT and CBSE syllabus.",
  noItems: "No items listed yet. Add your own below.",
  noLinks: "No links added yet. Paste verified links into data/material.js.",
  oneDayNote: "These come from a research summary. Years of repetition are not verified.",
  ncertNote: "Hindi-medium PDFs are on the NCERT textbook portal. NCERT Exemplar is useful for harder practice (Physics, Chemistry reasoning, Maths), but filter it against the 2026-27 syllabus because not every old Exemplar question is examinable.",
  sitesNote: "To add a link for a site with no URL, open the site yourself, confirm it works and is current, then paste its URL into data/material.js.",
  notRequiredNote: "Per the 2026-27 syllabus PDFs; verify on cbseacademic.nic.in"
};

/* Chapters per subject, in plan order, with their "Must master" items (each string = one checkbox) */
const CHAPTERS_MATERIAL = (function () {
  const items = {
    Physics: {
      "Electric Charges & Fields": ["Dipole field and torque (derivation)", "Gauss's law applications (derivation)"],
      "Potential & Capacitance": ["Parallel-plate capacitance (derivation)", "Capacitor combinations (numerical set)"],
      "Current Electricity": ["Kirchhoff loops (numerical set)"],
      "Moving Charges & Magnetism": [
        "Biot-Savart: loop on axis (derivation)", "Ampere's law for a wire (derivation)",
        "Force between parallel wires (derivation)", "Torque on a loop (derivation)",
        "Galvanometer conversions and shunts (derivation and numerical set)"],
      "Magnetism & Matter": [],
      "EMI": ["Solenoid inductances (derivation)"],
      "AC": ["LCR impedance and resonance (derivation)", "Transformer (derivation)", "LCR and transformer (numerical set)"],
      "EM Waves": [],
      "Ray Optics": ["Mirror, lens maker and prism formulas (derivations)", "Lens combinations (numerical set)"],
      "Wave Optics": ["Huygens proofs (derivation)"],
      "Dual Nature": ["Photoelectric and de Broglie (numerical set)"],
      "Atoms": ["Bohr radius, velocity and energy (derivation)", "Bohr energy levels (numerical set)"],
      "Nuclei": ["Mass defect and binding energy (numerical set)"],
      "Semiconductors": []
    },
    Chemistry: {
      "Solutions": [],
      "Electrochemistry": [],
      "Chemical Kinetics": [],
      "d- & f-Block": ["Read NCERT line by line, including Intext questions and the Applications table"],
      "Coordination Compounds": ["Read NCERT line by line, including Intext questions and the Applications table"],
      "Haloalkanes & Haloarenes": ["Finkelstein", "Swarts", "Sandmeyer (also Amines)", "Wurtz", "Fittig", "Wurtz-Fittig"],
      "Alcohols, Phenols, Ethers": ["Reimer-Tiemann", "Kolbe", "Williamson"],
      "Aldehydes, Ketones, Acids": ["Rosenmund", "Stephen", "Etard", "Gattermann-Koch", "Cannizzaro", "Aldol", "Clemmensen", "Wolff-Kishner", "HVZ"],
      "Amines": ["Gabriel", "Hoffmann bromamide", "Carbylamine", "Hinsberg"],
      "Biomolecules": []
    },
    Maths: {
      "Relations & Functions": [],
      "Inverse Trig": [],
      "Matrices": [],
      "Determinants": [],
      "Continuity & Differentiability": [],
      "Applications of Derivatives": [],
      "Integrals": [
        "Write the ten standard forms from memory daily (10 min)", "Substitution", "Completing the square",
        "Partial fractions (four cases; divide first if improper)", "By parts (ILATE)", "The e^x[f + f'] form",
        "Definite integrals: Fundamental Theorem and substitution with limit change",
        "Properties: reversal, splitting, a+b-x rule, 0 to 2a, even/odd", "15-20 mixed problems daily"],
      "Applications of Integrals": [],
      "Differential Equations": [],
      "Vectors": [],
      "3D Geometry": [],
      "Linear Programming": [],
      "Probability": []
    }
  };

  /* Tips shown under a chapter's Must master list */
  const tips = {
    "Maths|Integrals": "Because Maths is 40/80 and Integrals is difficult: complete the current NCERT examples before the miscellaneous exercises, then practise standard Integrals daily."
  };

  /* Trusted links per chapter (none yet). See the shape in the comment at the top of this file. */
  const links = {};

  const out = [];
  Object.keys(items).forEach(function (subject) {
    Object.keys(items[subject]).forEach(function (chapter) {
      const key = subject + "|" + chapter;
      const entry = { subject: subject, chapter: chapter, items: items[subject][chapter], links: links[key] || [] };
      if (tips[key]) entry.tip = tips[key];
      out.push(entry);
    });
  });
  return out;
})();

/* Checklists tab. Item { text, chapter, item } shares the tick with that chapter item;
   an item without chapter/item is stored on its own under "Subject|id|text". */
const CHECKLISTS = (function () {
  const i = function (text, chapter, item) { return { text: text, chapter: chapter, item: item || text }; };
  const rx = function (chapter, names) { return names.map(function (n) { return i(n, chapter); }); };
  const plain = function (text) { return { text: text }; };
  const HAL = "Haloalkanes & Haloarenes", ALC = "Alcohols, Phenols, Ethers", ALD = "Aldehydes, Ketones, Acids", AMI = "Amines";

  return [
    { id: "derivations", subject: "Physics", title: "Derivations to drill (Physics)", items: [
      i("Dipole field and torque", "Electric Charges & Fields", "Dipole field and torque (derivation)"),
      i("Gauss applications", "Electric Charges & Fields", "Gauss's law applications (derivation)"),
      i("Parallel-plate capacitance", "Potential & Capacitance", "Parallel-plate capacitance (derivation)"),
      i("Biot-Savart loop on axis", "Moving Charges & Magnetism", "Biot-Savart: loop on axis (derivation)"),
      i("Ampere for a wire", "Moving Charges & Magnetism", "Ampere's law for a wire (derivation)"),
      i("Force between parallel wires", "Moving Charges & Magnetism", "Force between parallel wires (derivation)"),
      i("Torque on a loop", "Moving Charges & Magnetism", "Torque on a loop (derivation)"),
      i("Galvanometer conversions", "Moving Charges & Magnetism", "Galvanometer conversions and shunts (derivation and numerical set)"),
      i("Solenoid inductances", "EMI", "Solenoid inductances (derivation)"),
      i("LCR impedance and resonance", "AC", "LCR impedance and resonance (derivation)"),
      i("Transformer", "AC", "Transformer (derivation)"),
      i("Mirror, lens maker and prism formulas", "Ray Optics", "Mirror, lens maker and prism formulas (derivations)"),
      i("Huygens proofs", "Wave Optics", "Huygens proofs (derivation)"),
      i("Bohr radius, velocity and energy", "Atoms", "Bohr radius, velocity and energy (derivation)")
    ] },
    { id: "numericals", subject: "Physics", title: "Numerical sets (Physics)", items: [
      i("Capacitor combinations", "Potential & Capacitance", "Capacitor combinations (numerical set)"),
      i("Kirchhoff loops", "Current Electricity", "Kirchhoff loops (numerical set)"),
      i("Galvanometer shunts", "Moving Charges & Magnetism", "Galvanometer conversions and shunts (derivation and numerical set)"),
      i("LCR and transformer", "AC", "LCR and transformer (numerical set)"),
      i("Lens combinations", "Ray Optics", "Lens combinations (numerical set)"),
      i("Photoelectric and de Broglie", "Dual Nature", "Photoelectric and de Broglie (numerical set)"),
      i("Bohr energy levels", "Atoms", "Bohr energy levels (numerical set)"),
      i("Mass defect and binding energy", "Nuclei", "Mass defect and binding energy (numerical set)")
    ] },
    { id: "reactions", subject: "Chemistry", title: "Named reactions (Chemistry)", items: [].concat(
      rx(HAL, ["Finkelstein", "Swarts"]),
      [i("Sandmeyer", HAL, "Sandmeyer (also Amines)")],
      rx(HAL, ["Wurtz", "Fittig", "Wurtz-Fittig"]),
      rx(ALC, ["Reimer-Tiemann", "Kolbe", "Williamson"]),
      rx(ALD, ["Rosenmund", "Stephen", "Etard", "Gattermann-Koch", "Cannizzaro", "Aldol", "Clemmensen", "Wolff-Kishner", "HVZ"]),
      rx(AMI, ["Gabriel", "Hoffmann bromamide", "Carbylamine", "Hinsberg"])
    ) },
    { id: "chain", subject: "Chemistry", title: "Conversion chain (Chemistry)",
      intro: "Halo -> Alcohol -> Aldehyde -> Acid -> Amide -> Amine -> Diazonium",
      items: [plain("Practise the chain forward"), plain("Practise the chain backward")] },
    { id: "forms", subject: "Maths", title: "Integrals standard forms (Maths)", items: [
      "dx/(x^2 +- a^2)", "dx/sqrt(x^2 +- a^2)", "dx/sqrt(a^2 - x^2)", "dx/(ax^2+bx+c)", "dx/sqrt(ax^2+bx+c)",
      "(px+q)/(ax^2+bx+c)", "(px+q)/sqrt(ax^2+bx+c)", "sqrt(a^2 +- x^2)", "sqrt(x^2 - a^2)", "sqrt(ax^2+bx+c)"
    ].map(plain) },
    { id: "methods", subject: "Maths", title: "Integrals methods (Maths)", items: [
      i("Substitution", "Integrals"),
      i("Completing the square", "Integrals"),
      i("Partial fractions", "Integrals", "Partial fractions (four cases; divide first if improper)"),
      i("By parts (ILATE)", "Integrals"),
      i("e^x[f + f']", "Integrals", "The e^x[f + f'] form"),
      i("Definite integral properties", "Integrals", "Properties: reversal, splitting, a+b-x rule, 0 to 2a, even/odd")
    ] }
  ];
})();

/* One day left: one checklist per subject */
const ONE_DAY = {
  Physics: [
    "Revise the complete formula sheet", "Practise Gauss law", "Practise capacitors", "Practise Kirchhoff circuits",
    "Practise magnetic force and galvanometer", "Practise induction and generators", "Practise LCR and transformers",
    "Practise lens and Young's experiment", "Practise photoelectric, Bohr and nuclear numericals", "Revise semiconductor diagrams"
  ],
  Chemistry: [
    "Solve one numerical set each from Solutions, Electrochemistry and Chemical Kinetics",
    "Revise all d- and f-block trends and coordination compounds", "Create reaction maps for all Organic chapters",
    "Practise carbonyl tests and named reactions", "Revise amine and diazonium conversions", "Read Biomolecules completely from NCERT"
  ],
  Maths: [
    "Revise inverse-trigonometric rules", "Matrix inverse", "Determinant equations", "Continuity parameters", "Maxima and minima",
    "Standard integration methods", "Definite-integral properties", "One area problem", "One differential equation",
    "One LPP problem", "Vector and 3-D formulas", "Bayes and conditional probability"
  ]
};

/* Not required tab */
const NOT_REQUIRED = [
  { subject: "Physics", items: ["YDSE fringe-width derivation (final expression only)", "Capacitor energy derivation (formula only)"] },
  { subject: "Maths", items: ["Integrals as limit of a sum"] },
  { subject: "Chemistry", note: "Formative-only, read only if time remains.",
    items: ["Surface Chemistry", "Isolation of Elements", "Polymers", "Chemistry in Everyday Life"] }
];

/* Resources tab */
const NCERT_LINKS = [
  { title: "Physics Part I", url: "https://ncert.nic.in/textbook/pdf/leph1ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Physics Part II", url: "https://ncert.nic.in", note: "Not opened in research. Open the NCERT website, go to Textbooks, choose Class XII, then Physics. English and Hindi options are on the portal." },
  { title: "Chemistry Part I", url: "https://ncert.nic.in/textbook/pdf/lech1ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Chemistry Part II", url: "https://ncert.nic.in/textbook/pdf/lech2ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Mathematics Part I", url: "https://ncert.nic.in/textbook/pdf/lemh1ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Mathematics Part II", url: "https://ncert.nic.in/textbook/pdf/lemh2ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Class XII rationalisation booklet", url: "https://ncert.nic.in/pdf/BookletClass12.pdf", note: "Use to spot deleted topics, but this booklet is from 2022. The CBSE 2026-27 curriculum PDFs on cbseacademic.nic.in are the final word." }
];

/* status must be "Verified", "Partly verified" or "Unverified"; url null = no link button */
const SITES = [
  { name: "LearnCBSE", offers: "Chapter-wise PYQs, important questions and solutions for Physics, Chemistry and Maths", status: "Verified", detail: "page opened",
    caution: "Cross-check answers with NCERT and official marking schemes", url: "https://www.learncbse.in/chapterwise-previous-years-questions-pyqs-solutions/" },
  { name: "myCBSEguide", offers: "Notes, NCERT solutions, solved papers, tests and videos (best backup)", status: "Partly verified",
    caution: "Also shows older-syllabus material; check every chapter against the current syllabus", url: null },
  { name: "SelfStudys", offers: "Chapter-wise PYQs with solutions, especially Physics", status: "Partly verified",
    caution: "Exact year coverage not verified", url: null },
  { name: "Collegedunia", offers: "PYQs, notes, formula sheets, handwritten notes and solutions", status: "Unverified",
    caution: "Current-syllabus and question-count claims were found through search results only", url: null },
  { name: "CBSE.page", offers: "Free year-wise and chapter-wise PYQs (advertised)", status: "Unverified",
    caution: "Found through search only", url: null },
  { name: "eSaral", offers: "Free NCERT solutions and study material (advertised)", status: "Unverified",
    caution: "Page not fully opened; 2026-27 status unverified", url: null },
  { name: "Chemistry “10 Pages” YouTube video", offers: "Quick Chemistry revision", status: "Partly verified",
    caution: "Found through search; the YouTube page was not opened. Search for it by name and check the date and syllabus", url: null }
];

const SITE_RULES = "No private site is completely authoritative. NCERT and official CBSE material override any third-party answer. Several sites advertise 2026-27 material while still showing older chapters. Third-party claims about exact question counts, years, ads and solution quality are partly unverified.";

const MATERIAL_GAPS = "No complete dedicated 2026-27 mind-map or formula-sheet collection was verified for all three subjects. The safest approach is to make your own formula sheet and Chemistry reaction chart directly from the current NCERT books (use the My formula sheet box in each chapter). Individual PYQ papers and solutions were not all opened, so exact repetition years for each topic cannot be claimed.";

/* Frequent topics (research summary), keyed "Subject|Chapter". Chapters without an entry show nothing. */
const PRIORITY = (function () {
  const src = {
    Physics: {
      "Electric Charges & Fields": ["Gauss law and electric-field numericals"],
      "Potential & Capacitance": ["Capacitors, dielectric and energy"],
      "Current Electricity": ["Kirchhoff laws", "Drift velocity", "Internal resistance"],
      "Moving Charges & Magnetism": ["Lorentz force", "Biot-Savart law", "Ampere law", "Galvanometer"],
      "EMI": ["Faraday law", "Lenz law", "Motional emf", "Generators"],
      "AC": ["AC circuits", "Resonance", "Transformers", "Power factor"],
      "EM Waves": ["Electromagnetic-spectrum applications"],
      "Ray Optics": ["Lens formula", "Prism", "Total internal reflection", "Optical instruments"],
      "Wave Optics": ["Young's experiment", "Interference", "Diffraction"],
      "Dual Nature": ["Photoelectric effect", "De Broglie wavelength"],
      "Atoms": ["Bohr-model transitions"],
      "Nuclei": ["Binding energy", "Radioactivity", "Fission and fusion"],
      "Semiconductors": ["Semiconductor diagrams", "Diode characteristics"]
    },
    Chemistry: {
      "Solutions": ["Concentration terms", "Raoult's law", "Colligative properties", "Van't Hoff factor"],
      "Electrochemistry": ["Nernst equation", "Conductance", "Kohlrausch law", "Electrolysis", "Corrosion"],
      "Chemical Kinetics": ["Rate law", "Order", "Half-life", "Arrhenius equation"],
      "d- & f-Block": ["Oxidation states", "Magnetic behaviour", "Colour", "Lanthanoid contraction", "Important permanganate and dichromate reactions"],
      "Coordination Compounds": ["Nomenclature", "Isomerism", "Bonding", "Magnetic properties", "Stability"],
      "Haloalkanes & Haloarenes": ["SN1 and SN2", "Elimination", "Haloalkane conversions"],
      "Alcohols, Phenols, Ethers": ["Acidity", "Dehydration", "Williamson synthesis", "Reactions of alcohols, phenols and ethers"],
      "Aldehydes, Ketones, Acids": ["Nucleophilic addition", "Oxidation and reduction", "Aldol", "Cannizzaro", "Identification tests"],
      "Amines": ["Basicity", "Preparation", "Diazotisation", "Coupling"],
      "Biomolecules": ["Carbohydrates", "Proteins", "Enzymes", "Vitamins", "Nucleic acids", "Hormones"]
    },
    Maths: {
      "Relations & Functions": ["One-one and onto functions", "Composition", "Inverse functions"],
      "Inverse Trig": ["Principal values", "Identities"],
      "Matrices": ["Inverse", "Linear equations"],
      "Determinants": ["Properties", "Area", "Consistency"],
      "Continuity & Differentiability": ["Continuity and differentiability of piecewise functions", "Derivatives using chain, logarithmic and parametric methods"],
      "Applications of Derivatives": ["Increasing and decreasing functions", "Maxima and minima", "Optimisation"],
      "Integrals": ["Substitution", "By parts", "Partial fractions", "Properties of definite integrals"],
      "Applications of Integrals": ["Area under curves"],
      "Differential Equations": ["Separable and linear equations"],
      "Vectors": ["Vector products", "Projections", "Angles", "Areas"],
      "3D Geometry": ["Lines", "Angles", "Shortest distance"],
      "Linear Programming": ["Graphical solutions"],
      "Probability": ["Conditional probability", "Bayes theorem", "Independence"]
    }
  };
  const out = {};
  Object.keys(src).forEach(function (s) {
    Object.keys(src[s]).forEach(function (c) { out[s + "|" + c] = src[s][c]; });
  });
  return out;
})();