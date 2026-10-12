/* All plan content. Edit here; plan.html reads it.
   Plain globals (no modules) so the site works from a dragged folder and from file://.
   Each cell "...Key" is null (second pass / papers) or an array of "Subject|Chapter name"
   (an array because a few cells cover two chapters). Paper days (phase 4) have text only
   for the two subjects being tested; the third subject is null. */

const PLAN_START = "2026-10-17"; // Day 1 (local time)

/* Phases 1-4 are bar segments; entries with chip:true are the small chips after the plan.
   to:null means open-ended. */
const PHASES = [
  { id: 1, from: 1, to: 15, name: "First pass, heavy chapters" },
  { id: 2, from: 16, to: 23, name: "First pass, remaining chapters" },
  { id: 3, from: 24, to: 27, name: "Compressed second pass" },
  { id: 4, from: 28, to: 33, name: "Full-paper phase" },
  { id: "buffer", from: 34, to: 35, label: "Buffer", chip: true },
  { id: "preboards", from: 36, to: null, label: "Pre-boards", chip: true }
];

/* Short UI texts tied to the plan */
const TEXT = {
  doNotSkip: "Integrals practice carries a lot of the Maths load; skipping it hurts most",
  paperDay: "About 3 hours per paper, then use the rest of the day to review and fix lost-mark topics.",
  paperPhase: "Do the official 2026-27 sample paper first for each subject, then previous-year board papers. That gives 4 papers per subject.",
  source: "Source: CBSE curriculum PDFs and 2026-27 sample papers at cbseacademic.nic.in. Verify there."
};

const HOURS = { perDay: 12 };

const DAYS = [
  { day: 1, date: "2026-10-17", label: "Sat 17 Oct", phase: 1,
    physics: "Ch1 (a): Coulomb, field, dipole", physicsKey: ["Physics|Electric Charges & Fields"],
    chemistry: "Electrochem (a): cells, Nernst, delta G", chemistryKey: ["Chemistry|Electrochemistry"],
    maths: "Integrals 1: basic forms, substitution", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 2, date: "2026-10-18", label: "Sun 18 Oct", phase: 1,
    physics: "Ch1 (b): Gauss + applications", physicsKey: ["Physics|Electric Charges & Fields"],
    chemistry: "Electrochem (b): conductance, Kohlrausch", chemistryKey: ["Chemistry|Electrochemistry"],
    maths: "Integrals 2: standard forms, completing square", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 3, date: "2026-10-19", label: "Mon 19 Oct", phase: 1,
    physics: "Ch2 (a): potential, equipotentials", physicsKey: ["Physics|Potential & Capacitance"],
    chemistry: "Electrochem (c): electrolysis, batteries, corrosion", chemistryKey: ["Chemistry|Electrochemistry"],
    maths: "Integrals 3: partial fractions", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 4, date: "2026-10-20", label: "Tue 20 Oct", phase: 1,
    physics: "Ch2 (b): capacitors, dielectrics", physicsKey: ["Physics|Potential & Capacitance"],
    chemistry: "Coordination (a): Werner, terms, naming", chemistryKey: ["Chemistry|Coordination Compounds"],
    maths: "Integrals 4: by parts, special forms", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 5, date: "2026-10-21", label: "Wed 21 Oct", phase: 1,
    physics: "Ch3 (a): drift, Ohm, resistivity", physicsKey: ["Physics|Current Electricity"],
    chemistry: "Coordination (b): isomerism", chemistryKey: ["Chemistry|Coordination Compounds"],
    maths: "Integrals 5: definite integrals + properties", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 6, date: "2026-10-22", label: "Thu 22 Oct", phase: 1,
    physics: "Ch3 (b): cells, Kirchhoff, Wheatstone", physicsKey: ["Physics|Current Electricity"],
    chemistry: "Coordination (c): VBT/CFT, carbonyls", chemistryKey: ["Chemistry|Coordination Compounds"],
    maths: "C&D 1: continuity, chain rule, implicit", mathsKey: ["Maths|Continuity & Differentiability"], doNotSkip: [] },
  { day: 7, date: "2026-10-23", label: "Fri 23 Oct", phase: 1,
    physics: "Ch4 (a): Biot-Savart, Ampere", physicsKey: ["Physics|Moving Charges & Magnetism"],
    chemistry: "d&f (a): configuration, trends", chemistryKey: ["Chemistry|d- & f-Block"],
    maths: "C&D 2: log-diff, parametric, second order", mathsKey: ["Maths|Continuity & Differentiability"], doNotSkip: [] },
  { day: 8, date: "2026-10-24", label: "Sat 24 Oct", phase: 1,
    physics: "Ch4 (b): force on charge/conductor, parallel wires", physicsKey: ["Physics|Moving Charges & Magnetism"],
    chemistry: "d&f (b): K2Cr2O7, KMnO4, lanthanoids", chemistryKey: ["Chemistry|d- & f-Block"],
    maths: "C&D 3 + mixed Integrals", mathsKey: ["Maths|Continuity & Differentiability", "Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 9, date: "2026-10-25", label: "Sun 25 Oct", phase: 1,
    physics: "Ch4 (c): torque, galvanometer conversions", physicsKey: ["Physics|Moving Charges & Magnetism"],
    chemistry: "d&f recall + Electro/Coord numericals", chemistryKey: ["Chemistry|d- & f-Block"],
    maths: "AOD 1: rate of change, monotonicity", mathsKey: ["Maths|Applications of Derivatives"], doNotSkip: [] },
  { day: 10, date: "2026-10-26", label: "Mon 26 Oct", phase: 1,
    physics: "Ch9 (a): mirrors, refraction, TIR", physicsKey: ["Physics|Ray Optics"],
    chemistry: "Haloalkanes (a): preparation, SN1/SN2", chemistryKey: ["Chemistry|Haloalkanes & Haloarenes"],
    maths: "AOD 2: maxima/minima", mathsKey: ["Maths|Applications of Derivatives"], doNotSkip: [] },
  { day: 11, date: "2026-10-27", label: "Tue 27 Oct", phase: 1,
    physics: "Ch9 (b): spherical surface, lens maker", physicsKey: ["Physics|Ray Optics"],
    chemistry: "Haloalkanes (b): reactions, haloarenes", chemistryKey: ["Chemistry|Haloalkanes & Haloarenes"],
    maths: "AOD 3: word problems + PYQs", mathsKey: ["Maths|Applications of Derivatives"], doNotSkip: [] },
  { day: 12, date: "2026-10-28", label: "Wed 28 Oct", phase: 1,
    physics: "Ch9 (c): prism, microscope, telescope", physicsKey: ["Physics|Ray Optics"],
    chemistry: "Alcohols (a): preparation, reactions", chemistryKey: ["Chemistry|Alcohols, Phenols, Ethers"],
    maths: "Determinants 1: evaluate, minors, area", mathsKey: ["Maths|Determinants"], doNotSkip: [] },
  { day: 13, date: "2026-10-29", label: "Thu 29 Oct", phase: 1,
    physics: "Ch7 (a): AC basics, R/L/C", physicsKey: ["Physics|AC"],
    chemistry: "Alcohols (b): phenols, ethers", chemistryKey: ["Chemistry|Alcohols, Phenols, Ethers"],
    maths: "Determinants 2: adjoint, inverse, systems", mathsKey: ["Maths|Determinants"], doNotSkip: [] },
  { day: 14, date: "2026-10-30", label: "Fri 30 Oct", phase: 1,
    physics: "Ch7 (b): LCR, resonance, power, transformer", physicsKey: ["Physics|AC"],
    chemistry: "Aldehydes (a): preparation, named reactions", chemistryKey: ["Chemistry|Aldehydes, Ketones, Acids"],
    maths: "Matrices 1: types, operations, symmetric", mathsKey: ["Maths|Matrices"], doNotSkip: [] },
  { day: 15, date: "2026-10-31", label: "Sat 31 Oct", phase: 1,
    physics: "Mixed numericals Ch1-4", physicsKey: null,
    chemistry: "Aldehydes (b): reactions", chemistryKey: ["Chemistry|Aldehydes, Ketones, Acids"],
    maths: "Matrices 2 + Integrals re-hit", mathsKey: ["Maths|Matrices", "Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 16, date: "2026-11-01", label: "Sun 1 Nov", phase: 2,
    physics: "Ch6 (a): Faraday, Lenz, motional emf", physicsKey: ["Physics|EMI"],
    chemistry: "Aldehydes (c): acids, conversions", chemistryKey: ["Chemistry|Aldehydes, Ketones, Acids"],
    maths: "Relations & Functions", mathsKey: ["Maths|Relations & Functions"], doNotSkip: [] },
  { day: 17, date: "2026-11-02", label: "Mon 2 Nov", phase: 2,
    physics: "Ch6 (b): self/mutual inductance + Ch8 EM waves", physicsKey: ["Physics|EMI", "Physics|EM Waves"],
    chemistry: "Amines (a): preparation, basicity", chemistryKey: ["Chemistry|Amines"],
    maths: "Inverse Trig", mathsKey: ["Maths|Inverse Trig"], doNotSkip: [] },
  { day: 18, date: "2026-11-03", label: "Tue 3 Nov", phase: 2,
    physics: "Ch10 (a): Huygens, proofs", physicsKey: ["Physics|Wave Optics"],
    chemistry: "Amines (b): diazonium salts", chemistryKey: ["Chemistry|Amines"],
    maths: "Diff. Equations 1: order, formation, separable", mathsKey: ["Maths|Differential Equations"], doNotSkip: [] },
  { day: 19, date: "2026-11-04", label: "Wed 4 Nov", phase: 2,
    physics: "Ch10 (b): YDSE, diffraction", physicsKey: ["Physics|Wave Optics"],
    chemistry: "Solutions (a): concentration, Raoult", chemistryKey: ["Chemistry|Solutions"],
    maths: "Diff. Equations 2: homogeneous, linear", mathsKey: ["Maths|Differential Equations"], doNotSkip: [] },
  { day: 20, date: "2026-11-05", label: "Thu 5 Nov", phase: 2,
    physics: "Ch11: Dual nature", physicsKey: ["Physics|Dual Nature"],
    chemistry: "Solutions (b): colligative, numericals", chemistryKey: ["Chemistry|Solutions"],
    maths: "Vectors 1: basics, dot product", mathsKey: ["Maths|Vectors"], doNotSkip: [] },
  { day: 21, date: "2026-11-06", label: "Fri 6 Nov", phase: 2,
    physics: "Ch12: Atoms (Bohr)", physicsKey: ["Physics|Atoms"],
    chemistry: "Kinetics (a): rate, order, rate law", chemistryKey: ["Chemistry|Chemical Kinetics"],
    maths: "Vectors 2: cross product, applications", mathsKey: ["Maths|Vectors"], doNotSkip: [] },
  { day: 22, date: "2026-11-07", label: "Sat 7 Nov", phase: 2,
    physics: "Ch13: Nuclei", physicsKey: ["Physics|Nuclei"],
    chemistry: "Kinetics (b): integrated eq, Arrhenius", chemistryKey: ["Chemistry|Chemical Kinetics"],
    maths: "3D Geometry 1: DC/DR, line equations", mathsKey: ["Maths|3D Geometry"], doNotSkip: [] },
  { day: 23, date: "2026-11-08", label: "Sun 8 Nov", phase: 2,
    physics: "Ch14 Semiconductors + Ch5 Magnetism & Matter", physicsKey: ["Physics|Semiconductors", "Physics|Magnetism & Matter"],
    chemistry: "Biomolecules (a): carbohydrates", chemistryKey: ["Chemistry|Biomolecules"],
    maths: "3D Geometry 2: angle, skew lines, shortest distance", mathsKey: ["Maths|3D Geometry"], doNotSkip: [] },
  { day: 24, date: "2026-11-09", label: "Mon 9 Nov", phase: 3,
    physics: "2nd pass: derivations Ch1-4", physicsKey: null,
    chemistry: "Biomolecules (b) + inorganic recall (d&f, Coordination)", chemistryKey: ["Chemistry|Biomolecules"],
    maths: "Applications of Integrals", mathsKey: ["Maths|Applications of Integrals"], doNotSkip: [] },
  { day: 25, date: "2026-11-10", label: "Tue 10 Nov", phase: 3,
    physics: "2nd pass: derivations Ch6-10", physicsKey: null,
    chemistry: "Named reactions + conversions", chemistryKey: null,
    maths: "LPP + Probability 1", mathsKey: ["Maths|Linear Programming", "Maths|Probability"], doNotSkip: [] },
  { day: 26, date: "2026-11-11", label: "Wed 11 Nov", phase: 3,
    physics: "2nd pass: numericals Ch2, 3, 7, 9, 11, 12", physicsKey: null,
    chemistry: "Physical numericals (Electro, Solutions, Kinetics)", chemistryKey: null,
    maths: "Probability 2 + Probability PYQs", mathsKey: ["Maths|Probability"], doNotSkip: [] },
  { day: 27, date: "2026-11-12", label: "Thu 12 Nov", phase: 3,
    physics: "Formula-sheet closure + case-based/assertion-reason", physicsKey: null,
    chemistry: "Weak chapters + reasoning questions", chemistryKey: null,
    maths: "2nd pass: mixed PYQs (Integrals, C&D, AOD, Determinants, Vectors/3D)", mathsKey: null, doNotSkip: ["maths"] },
  { day: 28, date: "2026-11-13", label: "Fri 13 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: null, chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 29, date: "2026-11-14", label: "Sat 14 Nov", phase: 4,
    physics: null, physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 30, date: "2026-11-15", label: "Sun 15 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: null, mathsKey: null, doNotSkip: [] },
  { day: 31, date: "2026-11-16", label: "Mon 16 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: null, chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 32, date: "2026-11-17", label: "Tue 17 Nov", phase: 4,
    physics: null, physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 33, date: "2026-11-18", label: "Wed 18 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: null, mathsKey: null, doNotSkip: [] }
];

/* First-pass hours and priority. Chapter name must match the "Subject|Chapter" keys in DAYS. */
const CHAPTERS = [
  { subject: "maths", name: "Integrals", hours: 24, priority: "High", hard: true },
  { subject: "maths", name: "Continuity & Differentiability", hours: 14, priority: "High" },
  { subject: "maths", name: "Applications of Derivatives", hours: 12, priority: "High" },
  { subject: "maths", name: "Determinants", hours: 9, priority: "High" },
  { subject: "maths", name: "Differential Equations", hours: 9, priority: "High" },
  { subject: "maths", name: "3D Geometry", hours: 9, priority: "High" },
  { subject: "maths", name: "Vectors", hours: 8, priority: "High" },
  { subject: "maths", name: "Probability", hours: 8, priority: "High" },
  { subject: "maths", name: "Matrices", hours: 7, priority: "Medium" },
  { subject: "maths", name: "Applications of Integrals", hours: 7, priority: "Medium" },
  { subject: "maths", name: "Relations & Functions", hours: 6, priority: "Medium" },
  { subject: "maths", name: "Inverse Trig", hours: 5, priority: "Medium" },
  { subject: "maths", name: "Linear Programming", hours: 4, priority: "Medium" },

  { subject: "physics", name: "Ray Optics", hours: 12, priority: "High", hard: true },
  { subject: "physics", name: "Moving Charges & Magnetism", hours: 10, priority: "High", hard: true },
  { subject: "physics", name: "Potential & Capacitance", hours: 8, priority: "High", hard: true },
  { subject: "physics", name: "Current Electricity", hours: 8, priority: "High" },
  { subject: "physics", name: "AC", hours: 8, priority: "High", hard: true },
  { subject: "physics", name: "Electric Charges & Fields", hours: 7, priority: "High" },
  { subject: "physics", name: "Wave Optics", hours: 7, priority: "High" },
  { subject: "physics", name: "EMI", hours: 6, priority: "High" },
  { subject: "physics", name: "Dual Nature", hours: 5, priority: "Med-High" },
  { subject: "physics", name: "Atoms", hours: 5, priority: "High" },
  { subject: "physics", name: "Semiconductors", hours: 5, priority: "Medium" },
  { subject: "physics", name: "Nuclei", hours: 4, priority: "Medium" },
  { subject: "physics", name: "Magnetism & Matter", hours: 3, priority: "Low-Med" },
  { subject: "physics", name: "EM Waves", hours: 3, priority: "Medium" },

  { subject: "chemistry", name: "Aldehydes, Ketones, Acids", hours: 11, priority: "High", hard: true },
  { subject: "chemistry", name: "Electrochemistry", hours: 9, priority: "High" },
  { subject: "chemistry", name: "d- & f-Block", hours: 9, priority: "High", hard: true },
  { subject: "chemistry", name: "Coordination Compounds", hours: 9, priority: "High", hard: true },
  { subject: "chemistry", name: "Haloalkanes & Haloarenes", hours: 8, priority: "High" },
  { subject: "chemistry", name: "Alcohols, Phenols, Ethers", hours: 8, priority: "High" },
  { subject: "chemistry", name: "Amines", hours: 8, priority: "High" },
  { subject: "chemistry", name: "Solutions", hours: 7, priority: "Medium" },
  { subject: "chemistry", name: "Chemical Kinetics", hours: 7, priority: "High" },
  { subject: "chemistry", name: "Biomolecules", hours: 7, priority: "Medium" }
];

/* Focus guides: "items" renders as a bullet list, "text" as a paragraph */
const GUIDES = [
  { title: "Maths focus, Integrals (Days 1-5)", items: [
    "Memorise the ten syllabus-listed standard forms: dx/(x^2 +- a^2), dx/sqrt(x^2 +- a^2), dx/sqrt(a^2 - x^2), dx/(ax^2+bx+c), dx/sqrt(ax^2+bx+c), (px+q)/(ax^2+bx+c), (px+q)/sqrt(ax^2+bx+c), sqrt(a^2 +- x^2), sqrt(x^2 - a^2), sqrt(ax^2+bx+c).",
    "Methods: substitution, completing the square, partial fractions (four cases; divide first if improper), by parts (ILATE), and the e^x[f + f'] form.",
    "Definite integrals: Fundamental Theorem, substitution with limit change, and the properties: reversal, splitting, a+b-x rule, 0 to 2a, even/odd.",
    "Routine: write all formulas from memory daily (10 min), then 15-20 mixed problems. Re-hit on Day 8 and Day 15, and again in the Day 27 mixed PYQ test.",
    "Not in syllabus: Integrals as limit of a sum."
  ] },
  { title: "Chemistry focus, reactions and Inorganic", items: [
    "Named reactions: Finkelstein, Swarts, Sandmeyer, Wurtz, Fittig, Wurtz-Fittig, Reimer-Tiemann, Kolbe, Williamson, Rosenmund, Stephen, Etard, Gattermann-Koch, Cannizzaro, Aldol, Clemmensen, Wolff-Kishner, HVZ, Gabriel, Hoffmann bromamide, Carbylamine, Hinsberg.",
    "Conversion chain: Halo -> Alcohol -> Aldehyde -> Acid -> Amide -> Amine -> Diazonium (practise forward and backward).",
    "Inorganic: read d & f Block and Coordination Compounds line by line, including Intext questions and the Applications table.",
    "Formative-only topics (read only if time remains): Surface Chemistry, Isolation of Elements, Polymers, Chemistry in Everyday Life."
  ] },
  { title: "Physics focus, derivations and numericals", items: [
    "Derivations to drill: dipole field and torque; Gauss applications; parallel-plate capacitance; Biot-Savart loop on axis; Ampere for a wire; force between parallel wires; torque on a loop; galvanometer conversions; solenoid inductances; LCR impedance and resonance; transformer; mirror, lens maker and prism formulas; Huygens proofs; Bohr radius, velocity and energy.",
    "Not required: YDSE fringe-width derivation (final expression only) and capacitor energy derivation (formula only), per the 2026-27 Physics PDF.",
    "Numerical sets: capacitor combinations, Kirchhoff loops, galvanometer shunts, LCR and transformer, lens combinations, photoelectric and de Broglie, Bohr energy levels, mass defect and binding energy."
  ] },
  { title: "Rule of thumb for \"everything feels hard\"",
    text: "After each sub-part, do 8-10 PYQ or NCERT questions without notes. If you score below about 60%, mark the sub-part for the second pass. That turns a general feeling of difficulty into a specific list." }
];

/* Honest notes; "sub" renders as a nested list */
const NOTES = [
  { text: "Official 2026-27 unit marks:", sub: [
    "Maths 80 theory (Relations & Functions 8, Algebra 10, Calculus 35, Vectors & 3D 14, LPP 5, Probability 8).",
    "Physics 70 theory (Ch1-3: 16, Ch4-7: 17, Ch8-10: 18, Ch11-13: 12, Ch14: 7; the last figure was derived by subtraction, verify in the official PDF).",
    "Chemistry 70 theory (Solutions 7, Electrochemistry 9, Kinetics 7, d&f 7, Coordination 7, Haloalkanes 6, Alcohols 6, Aldehydes/Ketones/Acids 8, Amines 6, Biomolecules 7)."
  ] },
  { text: "Maths and Chemistry have no official chapter-wise marks; priorities and hours here are judgement, not a verified count of 10 years of papers." },
  { text: "The Chemistry paper layout is per the official 2025-26 marking scheme; the 2026-27 Chemistry sample paper was not directly checked." },
  { text: "The hours are tight: 27 days x 12 h = 324 h, first pass 296 h, leaving about 28 h for second pass. If you lose a day, trim Physics and Chemistry second-pass time before touching Maths." },
  { text: "Check 13-18 Nov and the whole window for school holidays; none are accounted for." },
  { text: "Exercise numbers in NCERT may differ by edition; the plan uses topic names." }
];