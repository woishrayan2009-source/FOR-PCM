/* All plan content. Edit here; plan.html reads it.
   Plain globals (no modules) so the site works from a dragged folder and from file://.
   Each cell "...Key" is null (second pass / papers) or an array of "Subject|Chapter name"
   (an array because a few cells cover two chapters). Paper days (phase 4) have text only
   for the two subjects being tested; the third subject is null. */

const PLAN_START = "2026-10-17"; // Day 1 (local time)

/* Phases 1-4 are bar segments; entries with chip:true are the small chips after the plan.
   to:null means open-ended. Day 23 is the last day of the 276 h first-pass window (Days 1-23). */
const PHASES = [
  { id: 1, from: 1, to: 17, name: "Chapter revision, first pass" },
  { id: 2, from: 18, to: 23, name: "Formulas, derivations, numericals, PYQs, repair" },
  { id: 3, from: 24, to: 27, name: "Compressed second pass" },
  { id: 4, from: 28, to: 33, name: "Full-paper phase" },
  { id: "buffer", from: 34, to: 35, label: "Buffer", chip: true },
  { id: "preboards", from: 36, to: null, label: "Pre-boards", chip: true }
];

/* Short UI texts tied to the plan */
const TEXT = {
  doNotSkip: "Protected chapter: never trim it if you lose a day",
  paperDay: "Per paper: 3 hours timed, then 2 to 2.5 hours of strict correction (redo every wrong question from scratch; label each mistake concept, formula, calculation or time-pressure). Night: 1 to 1.5 hours of formula, named-reaction, derivation and error-log revision. Never trim correction.",
  paperPhase: "Two papers per day, rotated so each subject gets both a fresh-morning and a tired-afternoon attempt. Use the official 2026-27 sample paper first, then previous-year papers arranged as full 70- or 80-mark papers. That gives 4 papers per subject.",
  source: "Source: CBSE curriculum PDFs and 2026-27 sample papers at cbseacademic.nic.in. Verify there."
};

const HOURS = { perDay: 12 };

const DAYS = [
  { day: 1, date: "2026-10-17", label: "Sat 17 Oct", phase: 1,
    physics: "Ch1 Electric Charges & Fields: Coulomb + superposition, dipole, flux + Gauss", physicsKey: ["Physics|Electric Charges & Fields"],
    chemistry: "Solutions: concentration, Raoult + colligative, abnormal molar mass", chemistryKey: ["Chemistry|Solutions"],
    maths: "Relations & Functions: relation types, one-one/onto, composition + inverse", mathsKey: ["Maths|Relations & Functions"], doNotSkip: [] },
  { day: 2, date: "2026-10-18", label: "Sun 18 Oct", phase: 1,
    physics: "Ch2 Potential & Capacitance: potential, capacitors, dielectrics", physicsKey: ["Physics|Potential & Capacitance"],
    chemistry: "Electrochemistry (1/2): galvanic cells + EMF, Nernst", chemistryKey: ["Chemistry|Electrochemistry"],
    maths: "Inverse Trig: domains/ranges, principal values, properties", mathsKey: ["Maths|Inverse Trig"], doNotSkip: ["chemistry"] },
  { day: 3, date: "2026-10-19", label: "Mon 19 Oct", phase: 1,
    physics: "Ch3 Current Electricity: Ohm + resistivity, Kirchhoff + Wheatstone + potentiometer, cells", physicsKey: ["Physics|Current Electricity"],
    chemistry: "Electrochemistry (2/2): conductance, Kohlrausch, electrolysis, batteries, corrosion", chemistryKey: ["Chemistry|Electrochemistry"],
    maths: "Matrices: operations, symmetric/skew, elementary operations", mathsKey: ["Maths|Matrices"], doNotSkip: ["chemistry"] },
  { day: 4, date: "2026-10-20", label: "Tue 20 Oct", phase: 1,
    physics: "Ch4 Moving Charges & Magnetism (1/2): Biot-Savart, circular loop, Ampere, solenoid", physicsKey: ["Physics|Moving Charges & Magnetism"],
    chemistry: "Chemical Kinetics: rate/order/molecularity, integrated laws, Arrhenius", chemistryKey: ["Chemistry|Chemical Kinetics"],
    maths: "Determinants (1/2): properties, adjoint, inverse", mathsKey: ["Maths|Determinants"], doNotSkip: [] },
  { day: 5, date: "2026-10-21", label: "Wed 21 Oct", phase: 1,
    physics: "Ch4 Moving Charges & Magnetism (2/2): force on charge/conductor, parallel currents, torque, galvanometer", physicsKey: ["Physics|Moving Charges & Magnetism"],
    chemistry: "d- & f-Block: transition trends, KMnO4 + K2Cr2O7, lanthanoids/actinoids", chemistryKey: ["Chemistry|d- & f-Block"],
    maths: "Determinants (2/2): systems of equations + PYQs", mathsKey: ["Maths|Determinants"], doNotSkip: [] },
  { day: 6, date: "2026-10-22", label: "Thu 22 Oct", phase: 1,
    physics: "Ch5 Magnetism & Matter: bar magnet, Earth's magnetism, magnetic materials", physicsKey: ["Physics|Magnetism & Matter"],
    chemistry: "Coordination (1/2): nomenclature, VBT", chemistryKey: ["Chemistry|Coordination Compounds"],
    maths: "C&D (1/2): continuity, differentiability, chain rule", mathsKey: ["Maths|Continuity & Differentiability"], doNotSkip: ["chemistry"] },
  { day: 7, date: "2026-10-23", label: "Fri 23 Oct", phase: 1,
    physics: "Ch6 EMI: Faraday, Lenz, motional emf, inductance, AC generator", physicsKey: ["Physics|EMI"],
    chemistry: "Coordination (2/2): CFT, isomerism, applications", chemistryKey: ["Chemistry|Coordination Compounds"],
    maths: "C&D (2/2): implicit, logarithmic, inverse-trig derivatives", mathsKey: ["Maths|Continuity & Differentiability"], doNotSkip: ["chemistry"] },
  { day: 8, date: "2026-10-24", label: "Sat 24 Oct", phase: 1,
    physics: "Ch7 AC: RMS + phasors, series LCR + resonance, transformer", physicsKey: ["Physics|AC"],
    chemistry: "Haloalkanes & Haloarenes (1/2): preparation, SN1/SN2", chemistryKey: ["Chemistry|Haloalkanes & Haloarenes"],
    maths: "AOD (1/2): rate of change, increasing/decreasing", mathsKey: ["Maths|Applications of Derivatives"], doNotSkip: [] },
  { day: 9, date: "2026-10-25", label: "Sun 25 Oct", phase: 1,
    physics: "Ch8 EM Waves: displacement current, spectrum and uses", physicsKey: ["Physics|EM Waves"],
    chemistry: "Haloalkanes & Haloarenes (2/2): haloarene reactions, named reactions", chemistryKey: ["Chemistry|Haloalkanes & Haloarenes"],
    maths: "AOD (2/2): maxima-minima, tangents + normals", mathsKey: ["Maths|Applications of Derivatives"], doNotSkip: [] },
  { day: 10, date: "2026-10-26", label: "Mon 26 Oct", phase: 1,
    physics: "Ch9 Ray Optics (1/2): mirrors, refraction, TIR, lenses", physicsKey: ["Physics|Ray Optics"],
    chemistry: "Alcohols, Phenols, Ethers (1/2): preparation, reactions of alcohols", chemistryKey: ["Chemistry|Alcohols, Phenols, Ethers"],
    maths: "Integrals (1/4): standard forms, solve NCERT examples first", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 11, date: "2026-10-27", label: "Tue 27 Oct", phase: 1,
    physics: "Ch9 Ray Optics (2/2): prism, microscope, telescope", physicsKey: ["Physics|Ray Optics"],
    chemistry: "Alcohols, Phenols, Ethers (2/2): phenols, ethers", chemistryKey: ["Chemistry|Alcohols, Phenols, Ethers"],
    maths: "Integrals (2/4): substitution, trig substitution", mathsKey: ["Maths|Integrals"], doNotSkip: ["maths"] },
  { day: 12, date: "2026-10-28", label: "Wed 28 Oct", phase: 1,
    physics: "Ch10 Wave Optics (1/2): Huygens, interference, YDSE", physicsKey: ["Physics|Wave Optics"],
    chemistry: "Aldehydes, Ketones, Acids (1/2): preparation, aldehyde + ketone reactions", chemistryKey: ["Chemistry|Aldehydes, Ketones, Acids"],
    maths: "Integrals (3/4): partial fractions, by parts", mathsKey: ["Maths|Integrals"], doNotSkip: ["chemistry", "maths"] },
  { day: 13, date: "2026-10-29", label: "Thu 29 Oct", phase: 1,
    physics: "Ch10 Wave Optics (2/2): diffraction, polarisation", physicsKey: ["Physics|Wave Optics"],
    chemistry: "Aldehydes, Ketones, Acids (2/2): carboxylic acids, named conversions", chemistryKey: ["Chemistry|Aldehydes, Ketones, Acids"],
    maths: "Integrals (4/4): special integrals, definite-integral properties + PYQs", mathsKey: ["Maths|Integrals"], doNotSkip: ["chemistry", "maths"] },
  { day: 14, date: "2026-10-30", label: "Fri 30 Oct", phase: 1,
    physics: "Ch11 Dual Nature: photoelectric effect, de Broglie", physicsKey: ["Physics|Dual Nature"],
    chemistry: "Amines (1/2): preparation, basicity", chemistryKey: ["Chemistry|Amines"],
    maths: "Applications of Integrals: area under and between curves", mathsKey: ["Maths|Applications of Integrals"], doNotSkip: [] },
  { day: 15, date: "2026-10-31", label: "Sat 31 Oct", phase: 1,
    physics: "Ch12 Atoms: Bohr model, hydrogen spectra", physicsKey: ["Physics|Atoms"],
    chemistry: "Amines (2/2): reactions, diazonium salts", chemistryKey: ["Chemistry|Amines"],
    maths: "Differential Equations: order/degree, separable, homogeneous, linear", mathsKey: ["Maths|Differential Equations"], doNotSkip: [] },
  { day: 16, date: "2026-11-01", label: "Sun 1 Nov", phase: 1,
    physics: "Ch13 Nuclei: size + mass-energy, radioactivity, binding energy", physicsKey: ["Physics|Nuclei"],
    chemistry: "Biomolecules (1/2): carbohydrates, proteins", chemistryKey: ["Chemistry|Biomolecules"],
    maths: "Vectors (1/2): vector algebra, dot product", mathsKey: ["Maths|Vectors"], doNotSkip: [] },
  { day: 17, date: "2026-11-02", label: "Mon 2 Nov", phase: 1,
    physics: "Ch14 Semiconductors: bands, p-n junction + diode, rectifier", physicsKey: ["Physics|Semiconductors"],
    chemistry: "Biomolecules (2/2): vitamins, nucleic acids", chemistryKey: ["Chemistry|Biomolecules"],
    maths: "Vectors (2/2): cross product, projection, area", mathsKey: ["Maths|Vectors"], doNotSkip: [] },
  { day: 18, date: "2026-11-03", label: "Tue 3 Nov", phase: 2,
    physics: "Formula sheet and numericals", physicsKey: null,
    chemistry: "Reaction maps", chemistryKey: null,
    maths: "3D Geometry (1/2): direction cosines, equations of a line", mathsKey: ["Maths|3D Geometry"], doNotSkip: ["maths"] },
  { day: 19, date: "2026-11-04", label: "Wed 4 Nov", phase: 2,
    physics: "Derivations", physicsKey: null,
    chemistry: "Inorganic facts and exceptions", chemistryKey: null,
    maths: "3D Geometry (2/2): angles, shortest distance", mathsKey: ["Maths|3D Geometry"], doNotSkip: ["maths"] },
  { day: 20, date: "2026-11-05", label: "Thu 5 Nov", phase: 2,
    physics: "Numericals", physicsKey: null,
    chemistry: "Physical Chemistry numericals", chemistryKey: null,
    maths: "Probability (1/2): conditional probability, Bayes' theorem", mathsKey: ["Maths|Probability"], doNotSkip: [] },
  { day: 21, date: "2026-11-06", label: "Fri 6 Nov", phase: 2,
    physics: "PYQs", physicsKey: null,
    chemistry: "Organic conversions", chemistryKey: null,
    maths: "Probability (2/2) + PYQs", mathsKey: ["Maths|Probability"], doNotSkip: [] },
  { day: 22, date: "2026-11-07", label: "Sat 7 Nov", phase: 2,
    physics: "PYQs", physicsKey: null,
    chemistry: "Inorganic PYQs", chemistryKey: null,
    maths: "Linear Programming (graphical method) + PYQs", mathsKey: ["Maths|Linear Programming"], doNotSkip: [] },
  { day: 23, date: "2026-11-08", label: "Sun 8 Nov", phase: 2,
    physics: "Weak-topic repair", physicsKey: null,
    chemistry: "Weak-topic repair", chemistryKey: null,
    maths: "Weak-topic repair, special focus Integrals", mathsKey: null, doNotSkip: ["maths"] },
  { day: 24, date: "2026-11-09", label: "Mon 9 Nov", phase: 3,
    physics: "Full derivation sweep", physicsKey: null,
    chemistry: "Named-reactions sweep", chemistryKey: null,
    maths: "Formula and theorem sweep", mathsKey: null, doNotSkip: [] },
  { day: 25, date: "2026-11-10", label: "Tue 10 Nov", phase: 3,
    physics: "Numerical drill", physicsKey: null,
    chemistry: "Reaction and conversion drill", chemistryKey: null,
    maths: "Mixed PYQ drill", mathsKey: null, doNotSkip: [] },
  { day: 26, date: "2026-11-11", label: "Wed 11 Nov", phase: 3,
    physics: "Mixed PYQ set", physicsKey: null,
    chemistry: "Mixed PYQ set", chemistryKey: null,
    maths: "Mixed PYQ set", mathsKey: null, doNotSkip: [] },
  { day: 27, date: "2026-11-12", label: "Thu 12 Nov", phase: 3,
    physics: "Final weak-area repair", physicsKey: null,
    chemistry: "Final weak-area repair", chemistryKey: null,
    maths: "Final weak-area repair", mathsKey: null, doNotSkip: [] },
  { day: 28, date: "2026-11-13", label: "Fri 13 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: null, chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 29, date: "2026-11-14", label: "Sat 14 Nov", phase: 4,
    physics: null, physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 30, date: "2026-11-15", label: "Sun 15 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: null, mathsKey: null, doNotSkip: [] },
  { day: 31, date: "2026-11-16", label: "Mon 16 Nov", phase: 4,
    physics: null, physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 32, date: "2026-11-17", label: "Tue 17 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: null, chemistryKey: null, maths: "Full paper", mathsKey: null, doNotSkip: [] },
  { day: 33, date: "2026-11-18", label: "Wed 18 Nov", phase: 4,
    physics: "Full paper", physicsKey: null, chemistry: "Full paper", chemistryKey: null, maths: null, mathsKey: null, doNotSkip: [] }
];

/* First-pass hours and priority (chapter estimates from the plan research). Chapter name must match the "Subject|Chapter" keys in DAYS.
   hard = "hard for you" in the research. Linear Programming is not in the research calendar: 4 h and Medium are this site's own estimate. */
const CHAPTERS = [
  { subject: "maths", name: "Integrals", hours: 12, priority: "Very High", hard: true },
  { subject: "maths", name: "Continuity & Differentiability", hours: 8, priority: "Very High", hard: true },
  { subject: "maths", name: "Applications of Derivatives", hours: 8, priority: "Very High", hard: true },
  { subject: "maths", name: "Determinants", hours: 7, priority: "Very High" },
  { subject: "maths", name: "3D Geometry", hours: 7, priority: "Very High" },
  { subject: "maths", name: "Differential Equations", hours: 6, priority: "High" },
  { subject: "maths", name: "Probability", hours: 6, priority: "High" },
  { subject: "maths", name: "Matrices", hours: 5, priority: "High" },
  { subject: "maths", name: "Applications of Integrals", hours: 5, priority: "High" },
  { subject: "maths", name: "Vectors", hours: 5, priority: "High" },
  { subject: "maths", name: "Relations & Functions", hours: 4, priority: "Medium" },
  { subject: "maths", name: "Inverse Trig", hours: 4, priority: "Medium" },
  { subject: "maths", name: "Linear Programming", hours: 4, priority: "Medium" },

  { subject: "physics", name: "Moving Charges & Magnetism", hours: 8, priority: "High", hard: true },
  { subject: "physics", name: "Ray Optics", hours: 8, priority: "High" },
  { subject: "physics", name: "Potential & Capacitance", hours: 7, priority: "High" },
  { subject: "physics", name: "Current Electricity", hours: 7, priority: "High" },
  { subject: "physics", name: "Electric Charges & Fields", hours: 6, priority: "High" },
  { subject: "physics", name: "EMI", hours: 6, priority: "High" },
  { subject: "physics", name: "AC", hours: 6, priority: "High" },
  { subject: "physics", name: "Wave Optics", hours: 6, priority: "High" },
  { subject: "physics", name: "Nuclei", hours: 5, priority: "High" },
  { subject: "physics", name: "Dual Nature", hours: 4, priority: "High" },
  { subject: "physics", name: "Atoms", hours: 4, priority: "High" },
  { subject: "physics", name: "Magnetism & Matter", hours: 4, priority: "Medium" },
  { subject: "physics", name: "Semiconductors", hours: 4, priority: "Medium" },
  { subject: "physics", name: "EM Waves", hours: 3, priority: "Medium" },

  { subject: "chemistry", name: "Electrochemistry", hours: 8, priority: "Very High", hard: true },
  { subject: "chemistry", name: "Aldehydes, Ketones, Acids", hours: 8, priority: "Very High", hard: true },
  { subject: "chemistry", name: "d- & f-Block", hours: 7, priority: "High", hard: true },
  { subject: "chemistry", name: "Coordination Compounds", hours: 7, priority: "Very High", hard: true },
  { subject: "chemistry", name: "Solutions", hours: 6, priority: "High" },
  { subject: "chemistry", name: "Chemical Kinetics", hours: 6, priority: "High" },
  { subject: "chemistry", name: "Haloalkanes & Haloarenes", hours: 6, priority: "Very High", hard: true },
  { subject: "chemistry", name: "Alcohols, Phenols, Ethers", hours: 6, priority: "Very High", hard: true },
  { subject: "chemistry", name: "Amines", hours: 6, priority: "High", hard: true },
  { subject: "chemistry", name: "Biomolecules", hours: 5, priority: "Medium" }
];

/* Focus guides: "items" renders as a bullet list, "text" as a paragraph */
const GUIDES = [
  { title: "Maths focus, Integrals (Days 10-13, then Day 23)", items: [
    "Solve-first revision (you have only read the theory): every NCERT solved example first, then Exercises 7.1 to 7.11 selectively, then the Miscellaneous Exercise. About 12 to 14 hours in total; do not let it grow beyond that.",
    "Standard forms to master: powers, 1/x, exponentials, trigonometric functions, 1/(a^2 + x^2), 1/sqrt(a^2 - x^2), 1/(x^2 - a^2), 1/sqrt(x^2 +- a^2), and square-root linear and quadratic forms.",
    "Techniques: substitution, trigonometric substitution, partial fractions, integration by parts, special integrals.",
    "Definite integrals: limit reversal, even and odd functions, periodicity and the standard change-of-limit properties.",
    "Typical patterns: rational functions by partial fractions, products by parts, trigonometric products, roots of quadratics, symmetric definite integrals.",
    "If time is short, prioritise NCERT examples and repeated PYQ patterns.",
    "Not in syllabus: Integrals as limit of a sum (verify in the 2026-27 Maths PDF)."
  ] },
  { title: "Maths: exercises and Probability scope", items: [
    "NCERT practice loop: example, exercise, PYQ, error log. For Maths, solve all solved examples first, then the Miscellaneous Exercise where available, then selected main exercises.",
    "Full exercise-wise solving is limited to Integrals, Determinants, Continuity and Differentiability, and 3D Geometry. Other chapters: selected examples and exercises plus board-pattern questions.",
    "3D Geometry: the plan research lists planes, but the official-syllabus research says to avoid planes unless the current syllabus confirms them. Check the Maths PDF before studying planes.",
    "Probability: the plan research lists random variables, mean, variance and Bernoulli trials. The official-syllabus topic list shows conditional probability, multiplication theorem, independence, total probability and Bayes. Check the PDF before studying the distribution topics."
  ] },
  { title: "Chemistry focus, reactions and Inorganic", items: [
    "Organic: revise through reaction maps (preparation, named reaction, conversion, test) for Haloalkanes, Alcohols, Aldehydes and Amines.",
    "Named reactions and tests: SN1/SN2, Saytzeff rule, Wurtz, Fittig, Sandmeyer, Lucas test, Kolbe, Reimer-Tiemann, Williamson, Aldol, Cannizzaro, Clemmensen, Wolff-Kishner, Tollens' and Fehling's tests, HVZ, esterification, Gabriel, Hoffmann bromamide, Carbylamine, Hinsberg, diazotisation, coupling. Also in NCERT: Finkelstein, Swarts, Rosenmund, Stephen, Etard, Gattermann-Koch.",
    "Inorganic (d- & f-Block, Coordination): read NCERT line by line. Focus on trends, exceptions, colours, magnetic behaviour, preparation equations, structures, variable oxidation states, d-d colour, lanthanoid contraction, KMnO4 and K2Cr2O7 reactions, coordination nomenclature, VBT/CFT predictions and isomerism.",
    "Physical: formulae, NCERT solved examples and exercise numericals for Solutions, Electrochemistry and Kinetics.",
    "Conversion chain: Halo -> Alcohol -> Aldehyde -> Acid -> Amide -> Amine -> Diazonium (practise forward and backward).",
    "Outside the current syllabus (do not prepare): Solid State, Surface Chemistry, Metallurgy / Isolation of Elements, Chemistry in Everyday Life. Check exact sub-topic exclusions in the official PDF only."
  ] },
  { title: "Physics focus, derivations and numericals", items: [
    "Derivations to master: Coulomb's law in vector form; axial and equatorial dipole field; potential due to a dipole; capacitance with dielectric; drift velocity and resistivity; Biot-Savart field on a circular loop; force between parallel wires; torque on a current loop; motional emf; self and mutual inductance; transformer; LCR impedance and resonance; mirror and lens formulae; prism formula; Bohr model; radioactive decay law; rectifier working.",
    "Check in the 2026-27 Physics PDF before drilling: the plan research also lists solenoid field and YDSE fringe width, but the official-syllabus research says fringe width is final expression only, solenoid treatment is qualitative, and capacitor energy has no derivation.",
    "Method: write every formula and derivation from memory first, then watch only the repair portion of a lecture, then solve NCERT examples and exercises.",
    "Numerical types: capacitor and dielectric problems, resistance networks, magnetic force and torque, AC resonance, optical instruments, YDSE, photoelectric effect, Bohr energy levels, half-life and binding energy."
  ] },
  { title: "Rule of thumb for \"everything feels hard\"",
    text: "After each sub-part, do 8-10 PYQ or NCERT questions without notes. If you score below about 60%, mark the sub-part for the second pass. That turns a general feeling of difficulty into a specific list." }
];

/* Honest notes; "sub" renders as a nested list */
const NOTES = [
  { text: "Official 2026-27 marks:", sub: [
    "Maths 80 theory, unit level only (Relations & Functions 8, Algebra 10, Calculus 35, Vectors & 3D 14, LPP 5, Probability 8). CBSE states there is no chapter-wise weightage.",
    "Physics 70 theory. Confirmed: Electrostatics (Ch1-2) 16, Electromagnetic Waves/Optics block (Ch8-10) 18, Dual Nature 12, Semiconductors 7. The marks for Current Electricity, Magnetism, EMI and AC could not be read reliably, so none are shown. Verify in the official Physics PDF.",
    "Chemistry 70 theory (Solutions 7, Electrochemistry 9, Kinetics 7, d&f 7, Coordination 7, Haloalkanes 6, Alcohols 6, Aldehydes/Ketones/Acids 8, Amines 6, Biomolecules 7)."
  ] },
  { text: "Your marks (Maths 40/80, Physics 46/70, Chemistry 61/70) are school-test marks, not full CBSE-pattern papers. Use them to decide the daily time share (Maths largest, Physics next, Chemistry smaller but never neglected), then check progress with timed NCERT and PYQ sets." },
  { text: "Chapter priorities and hours are the plan research's estimates, not a verified count of 10 years of papers. Linear Programming (5 marks, official) is missing from the research calendar; this site adds it on Day 22 with a 4 h estimate. Change it if you disagree." },
  { text: "The hours are tight: 27 days x 12 h = 324 h. Chapter estimates add up to 224 h (the research quotes about 82 h for Physics, but its chapter figures sum to 78 h), and with NCERT exercise solving and PYQs a realistic first pass is 250 to 270 h. Days 1-23 give 276 h, so it fits only if sessions stay focused and Integrals stays near 12 to 14 h. Days 24-27 give 48 h for the compressed second pass." },
  { text: "If you lose a day, trim first: extra Biomolecules reading, Magnetism & Matter detail, repeated easy Physics numericals, repeating Maths questions you already get right, and extra Chemistry reading in chapters where your accuracy is already strong. Never trim Integrals, Electrochemistry, Coordination Compounds, Aldehydes/Ketones/Acids, 3D Geometry or full-paper correction." },
  { text: "Check 13-18 Nov and the whole window for school holidays; none are accounted for." },
  { text: "Exercise numbers in NCERT may differ by edition; the plan uses topic names." },
  { text: "Secondary goal: the IISER Aptitude Test. Do not add separate IAT work in these 33 days; board revision builds the base." }
];