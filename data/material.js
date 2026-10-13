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
  ncertNote: "Official Hindi Physics PDFs are verified (links below). For Chemistry only the Hindi Solutions chapter was verified, and direct Hindi Maths PDFs were not; check the NCERT portal. NCERT Exemplar is useful for harder practice (Physics, Chemistry reasoning, Maths), but filter it against the 2026-27 syllabus because not every old Exemplar question is examinable.",
  sitesNote: "To add a link for a site with no URL, open the site yourself, confirm it works and is current, then paste its URL into data/material.js.",
  notRequiredNote: "Per the 2026-27 syllabus PDFs; verify on cbseacademic.nic.in"
};

/* Chapters per subject, in plan order, with their "Must master" items (each string = one checkbox) */
const CHAPTERS_MATERIAL = (function () {
  const items = {
    Physics: {
      "Electric Charges & Fields": ["Coulomb's law, vector form (derivation)", "Dipole field, axial and equatorial, and torque (derivation)", "Gauss's law applications (derivation)"],
      "Potential & Capacitance": ["Potential due to a dipole (derivation)", "Parallel-plate capacitance (derivation)", "Capacitance with a dielectric (derivation)", "Capacitor combinations (numerical set)"],
      "Current Electricity": ["Drift velocity and resistivity (derivation)", "Kirchhoff loops (numerical set)", "Resistance networks (numerical set)"],
      "Moving Charges & Magnetism": [
        "Biot-Savart: loop on axis (derivation)", "Ampere's law for a wire (derivation)",
        "Force between parallel wires (derivation)", "Torque on a loop (derivation)",
        "Galvanometer conversions and shunts (derivation and numerical set)"],
      "Magnetism & Matter": [],
      "EMI": ["Motional emf (derivation)", "Self and mutual inductance (derivation)", "Solenoid inductances (derivation)"],
      "AC": ["LCR impedance and resonance (derivation)", "Transformer (derivation)", "LCR and transformer (numerical set)"],
      "EM Waves": [],
      "Ray Optics": ["Mirror, lens maker and prism formulas (derivations)", "Lens combinations (numerical set)", "Optical instruments (numerical set)"],
      "Wave Optics": ["Huygens proofs (derivation)", "YDSE (numerical set)"],
      "Dual Nature": ["Photoelectric and de Broglie (numerical set)"],
      "Atoms": ["Bohr radius, velocity and energy (derivation)", "Bohr energy levels (numerical set)"],
      "Nuclei": ["Radioactive decay law (derivation)", "Mass defect and binding energy (numerical set)", "Half-life (numerical set)"],
      "Semiconductors": ["Rectifier working (derivation)"]
    },
    Chemistry: {
      "Solutions": [],
      "Electrochemistry": [],
      "Chemical Kinetics": [],
      "d- & f-Block": ["Read NCERT line by line, including Intext questions and the Applications table"],
      "Coordination Compounds": ["Read NCERT line by line, including Intext questions and the Applications table"],
      "Haloalkanes & Haloarenes": ["SN1 and SN2 mechanisms", "Saytzeff rule", "Finkelstein", "Swarts", "Sandmeyer (also Amines)", "Wurtz", "Fittig", "Wurtz-Fittig"],
      "Alcohols, Phenols, Ethers": ["Lucas test", "Reimer-Tiemann", "Kolbe", "Williamson"],
      "Aldehydes, Ketones, Acids": ["Rosenmund", "Stephen", "Etard", "Gattermann-Koch", "Cannizzaro", "Aldol", "Clemmensen", "Wolff-Kishner", "Tollens' and Fehling's tests", "HVZ", "Esterification"],
      "Amines": ["Gabriel", "Hoffmann bromamide", "Carbylamine", "Hinsberg", "Diazotisation and coupling"],
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
      i("Coulomb's law, vector form", "Electric Charges & Fields", "Coulomb's law, vector form (derivation)"),
      i("Dipole field and torque", "Electric Charges & Fields", "Dipole field, axial and equatorial, and torque (derivation)"),
      i("Potential due to a dipole", "Potential & Capacitance", "Potential due to a dipole (derivation)"),
      i("Capacitance with a dielectric", "Potential & Capacitance", "Capacitance with a dielectric (derivation)"),
      i("Drift velocity and resistivity", "Current Electricity", "Drift velocity and resistivity (derivation)"),
      i("Motional emf", "EMI", "Motional emf (derivation)"),
      i("Self and mutual inductance", "EMI", "Self and mutual inductance (derivation)"),
      i("Radioactive decay law", "Nuclei", "Radioactive decay law (derivation)"),
      i("Rectifier working", "Semiconductors", "Rectifier working (derivation)"),
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
      i("Mass defect and binding energy", "Nuclei", "Mass defect and binding energy (numerical set)"),
      i("Resistance networks", "Current Electricity", "Resistance networks (numerical set)"),
      i("Optical instruments", "Ray Optics", "Optical instruments (numerical set)"),
      i("YDSE", "Wave Optics", "YDSE (numerical set)"),
      i("Half-life", "Nuclei", "Half-life (numerical set)")
    ] },
    { id: "reactions", subject: "Chemistry", title: "Named reactions (Chemistry)", items: [].concat(
      rx(HAL, ["SN1 and SN2 mechanisms", "Saytzeff rule", "Finkelstein", "Swarts"]),
      [i("Sandmeyer", HAL, "Sandmeyer (also Amines)")],
      rx(HAL, ["Wurtz", "Fittig", "Wurtz-Fittig"]),
      rx(ALC, ["Lucas test", "Reimer-Tiemann", "Kolbe", "Williamson"]),
      rx(ALD, ["Rosenmund", "Stephen", "Etard", "Gattermann-Koch", "Cannizzaro", "Aldol", "Clemmensen", "Wolff-Kishner", "Tollens' and Fehling's tests", "HVZ", "Esterification"]),
      rx(AMI, ["Gabriel", "Hoffmann bromamide", "Carbylamine", "Hinsberg", "Diazotisation and coupling"])
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
  { subject: "Physics", items: ["YDSE fringe-width derivation (final expression only)", "Capacitor energy derivation (formula only)", "Quantitative solenoid derivation (treated qualitatively; verify in the PDF)", "Communication Systems (removed chapter)", "Transistors and logic gates (not in the current Semiconductors list)"] },
  { subject: "Maths", items: ["Integrals as limit of a sum", "Equation of a plane in 3D Geometry (not confirmed in the syllabus; verify in the PDF)", "Random variables, mean, variance, Bernoulli trials (in the plan research but not in the official topic list; verify in the PDF)"] },
  { subject: "Chemistry", note: "Outside the current 10 units. Do not prepare; check sub-topic exclusions in the official PDF only.",
    items: ["Solid State", "Surface Chemistry", "Isolation of Elements (Metallurgy)", "Polymers", "Chemistry in Everyday Life"] }
];

/* Resources tab */
const NCERT_LINKS = [
  { title: "Physics Part I", url: "https://ncert.nic.in/textbook/pdf/leph1ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Physics Part II", url: "https://ncert.nic.in/textbook/pdf/leph2ps.pdf", note: "Opened; the extracted text did not show a Reprint 2026-27 line, so that label is unverified." },
  { title: "Physics Part I (Hindi)", url: "https://ncert.nic.in/textbook/pdf/lhph1ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Physics Part II (Hindi)", url: "https://ncert.nic.in/textbook/pdf/lhph2ps.pdf", note: "Opened; marked Reprint 2026-27." },
  { title: "Chemistry Part I", url: "https://ncert.nic.in/textbook/pdf/lech1ps.pdf", note: "Opened; Reprint 2026-27 of the October 2022 revised edition. Units 1-5." },
  { title: "Chemistry Part II", url: "https://ncert.nic.in/textbook/pdf/lech2ps.pdf", note: "Opened; Reprint 2026-27 of the November 2022 revised edition. Units 6-10." },
  { title: "Chemistry, Solutions chapter (Hindi)", url: "https://ncert.nic.in/textbook/pdf/lhch101.pdf", note: "Opened; Reprint 2026-27. Other Hindi Chemistry chapters were not verified." },
  { title: "Mathematics Part I", url: "https://ncert.nic.in/textbook/pdf/lemh1ps.pdf", note: "Opened; Reprint 2026-27 of the October 2022 revised edition. Chapters 1-6." },
  { title: "Mathematics Part II", url: "https://ncert.nic.in/textbook/pdf/lemh2ps.pdf", note: "Opened; Reprint 2026-27 of the January 2023 revised edition. Chapters 7-13." },
  { title: "CBSE 2026-27 Physics syllabus (042)", url: "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf", note: "Official. Use it as the filter for NCERT and Exemplar; check unit marks and exclusions here." },
  { title: "CBSE 2026-27 Chemistry syllabus (043)", url: "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Chemistry_SecP2_2026-27.pdf", note: "Official." },
  { title: "CBSE 2026-27 Mathematics syllabus (041)", url: "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Maths_SecP2_2026-27.pdf", note: "Official. Standard Mathematics, not Applied." },
  { title: "NCERT Exemplar index", url: "https://ncert.nic.in/exemplar-problems.php?ln=en", note: "Official index. Filter against the syllabus; older Exemplar books include legacy chapters." },
  { title: "Class XII rationalisation booklet", url: "https://ncert.nic.in/pdf/BookletClass12.pdf", note: "Use to spot deleted topics, but this booklet is from 2022. The CBSE 2026-27 curriculum PDFs on cbseacademic.nic.in are the final word." }
];

/* status must be "Verified", "Partly verified" or "Unverified"; url null = no link button */
const SITES = [
  { name: "ExamSIDE (Physics)", offers: "Best PYQ locator found: chapter-wise questions with paper/year labels and worked answers", status: "Partly verified", detail: "pages opened; answers not audited",
    caution: "Use it to find questions, not as the final authority. Hindi not verified. Several pages show only two papers", url: "https://questions.examside.com/past-years/cbse/class-12/physics" },
  { name: "ExamSIDE (Chemistry)", offers: "Chapter-wise Chemistry PYQs with solutions", status: "Partly verified", detail: "pages opened; Alcohols and Amines pages not opened",
    caution: "Claims 2021-2025 but opened pages mostly showed 2023/2024 papers", url: "https://questions.examside.com/past-years/cbse/class-12/chemistry" },
  { name: "ExamSIDE (Maths)", offers: "Chapter-wise Maths PYQs with worked solutions (backup to ClearSteps)", status: "Partly verified", detail: "pages opened",
    caution: "Index also has an extra Complex Numbers category (not in your syllabus)", url: "https://questions.examside.com/past-years/cbse/class-12/mathematics" },
  { name: "ClearSteps (Maths PYQs)", offers: "Chapter-wise Maths questions with 2023-24 to 2025-26 session labels", status: "Partly verified", detail: "page opened",
    caution: "Some features ask for a free trial or WhatsApp verification; labels are third-party", url: "https://clearsteps.co.in/cbse-class-12-maths/chapter-wise-pyq" },
  { name: "Tiwari Academy (Physics)", offers: "NCERT solutions in English and Hindi (best backup)", status: "Partly verified", detail: "pages opened",
    caution: "Cross-check with NCERT. Its Chapter 1 page marks Additional Exercises as outside the syllabus", url: "https://hindi.tiwariacademy.com/ncert-solutions/class-12/physics/" },
  { name: "Tiwari Academy (Chemistry)", offers: "NCERT solutions in English and Hindi", status: "Partly verified", detail: "English page opened; Hindi page not opened",
    caution: "Cross-check with NCERT", url: "https://www.tiwariacademy.com/ncert-solutions/class-12/chemistry/" },
  { name: "Tiwari Academy (Maths)", offers: "NCERT solutions, MCQs and chapter resources, Hindi and English", status: "Partly verified", detail: "page opened",
    caution: "Its Integrals guide has formulas, but its claims about yearly repeats and marks are not verified", url: "https://www.tiwariacademy.com/ncert-solutions/class-12/maths/" },
  { name: "Padhify", offers: "Chemistry and Maths PYQs by chapter and year (claims 2016-2025)", status: "Partly verified", detail: "search results only",
    caution: "A free account is needed; the 2025 Chemistry page shows only 10 free questions", url: "https://www.padhify.com/pyq/class-12/mathematics" },
  { name: "Vedantu", offers: "Physics revision notes, formula page, Exemplar solutions", status: "Partly verified", detail: "pages opened",
    caution: "Some PDFs need sign-in. The formula page misses some current topics and mentions legacy ones", url: "https://www.vedantu.com/revision-notes/cbse-class-12-physics-notes" },
  { name: "StudiesToday", offers: "Notes, mind maps and practice material", status: "Partly verified", detail: "directories opened; PDFs not opened",
    caution: "Mixes current and legacy chapters. Filter by the 10 Chemistry units", url: "https://www.studiestoday.com/useful-resources/447/chemistry.html" },
  { name: "LearnCBSE", offers: "Chapter-wise PYQs, important questions and solutions for Physics, Chemistry and Maths", status: "Verified", detail: "page opened",
    caution: "Cross-check answers with NCERT and official marking schemes", url: "https://www.learncbse.in/chapterwise-previous-years-questions-pyqs-solutions/" },
  { name: "myCBSEguide", offers: "Notes, NCERT solutions, solved papers, tests and videos (best backup)", status: "Partly verified",
    caution: "Also shows older-syllabus material; check every chapter against the current syllabus", url: null },
  { name: "SelfStudys", offers: "Chapter-wise PYQs with solutions for Physics, Chemistry and Maths", status: "Partly verified", detail: "landing pages opened",
    caution: "Exact years and download gating not verified", url: "https://www.selfstudys.com/books/cbse-prev-paper/english/class-12-chapter-wise/physics/6853" },
  { name: "Collegedunia", offers: "PYQs, notes, formula sheets, handwritten notes and solutions", status: "Unverified",
    caution: "Current-syllabus and question-count claims were found through search results only", url: null },
  { name: "CBSE.page", offers: "Free year-wise and chapter-wise PYQs (advertised)", status: "Unverified",
    caution: "Found through search only; PDFs not opened", url: "https://www.cbse.page/index.html" },
  { name: "eSaral", offers: "Free NCERT solutions and study material (advertised)", status: "Unverified",
    caution: "Page not fully opened; 2026-27 status unverified", url: null },
  { name: "Chemistry “10 Pages” YouTube video", offers: "Quick Chemistry revision", status: "Partly verified",
    caution: "Found through search; the YouTube page was not opened. Search for it by name and check the date and syllabus", url: null }
];

const SITE_RULES = "No private site is completely authoritative. The CBSE 2026-27 syllabus decides what is examinable; year labels on third-party PYQ pages show only what that page lists, not that a topic repeats every year. NCERT and official CBSE material override any third-party answer. Several sites advertise 2026-27 material while still showing older chapters. Third-party claims about exact question counts, years, ads and solution quality are partly unverified.";

const MATERIAL_GAPS = "Hindi: full official Hindi Physics PDFs are verified, but for Chemistry only the Solutions chapter and for Maths no direct Hindi PDF. No complete dedicated 2026-27 mind-map or formula-sheet collection was verified for all three subjects. The safest approach is to make your own formula sheet and Chemistry reaction chart directly from the current NCERT books (use the My formula sheet box in each chapter). Individual PYQ papers and solutions were not all opened, so exact repetition years for each topic cannot be claimed.";

/* Frequent topics (research summary), keyed "Subject|Chapter". Chapters without an entry show nothing. */
const PRIORITY = (function () {
  const src = {
    Physics: {
      "Electric Charges & Fields": ["Coulomb force and field", "Dipole and torque", "Flux and Gauss law (wire, sheet, shell)"],
      "Potential & Capacitance": ["Potential and energy", "Equipotential surfaces", "Capacitor networks", "Dielectrics"],
      "Current Electricity": ["Kirchhoff laws", "Drift velocity", "Internal resistance", "Galvanometer conversions"],
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