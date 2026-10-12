/* All routine content. Edit here; routines.html reads it.
   Row "type" must be one of: physics, chemistry, maths, mixed, break, exercise, meal, rest, sleep.
   Quiz: option index 0 -> A, 1 -> B, 2 -> C, 3 -> D (keep this order). */
const ROUTINES = {
  routines: {
    A: {
      name: "Early Bird", sleep: "10:00 pm", wake: "4:00 am", study: "about 12 h", difficulty: "Hard",
      bestFor: "maximum quiet morning hours", mainRisk: "sleep debt and an afternoon dip", freeTime: "about 45 min",
      rows: [
        { time: "4:00-4:20", activity: "Wake, Alarmy mission, water, wash face", type: "sleep" },
        { time: "4:20-5:50", activity: "Block 1: Maths, hardest topic first", type: "maths" },
        { time: "5:50-6:05", activity: "Break", type: "break" },
        { time: "6:05-7:35", activity: "Block 2: Maths practice", type: "maths" },
        { time: "7:35-8:30", activity: "Exercise 30 min, bath, breakfast", type: "exercise" },
        { time: "8:30-10:00", activity: "Block 3: Physics formulae and derivations", type: "physics" },
        { time: "10:00-10:15", activity: "Break", type: "break" },
        { time: "10:15-11:45", activity: "Block 4: Chemistry, NCERT line by line", type: "chemistry" },
        { time: "11:45-1:00", activity: "Lunch and 15-minute walk", type: "meal" },
        { time: "1:00-2:30", activity: "Block 5: Chemistry reactions and Inorganic", type: "chemistry" },
        { time: "2:30-2:45", activity: "Break", type: "break" },
        { time: "2:45-4:15", activity: "Block 6: Physics numericals", type: "physics" },
        { time: "4:15-4:30", activity: "Break and snack", type: "break" },
        { time: "4:30-6:00", activity: "Block 7: Maths PYQs", type: "maths" },
        { time: "6:00-6:15", activity: "Break", type: "break" },
        { time: "6:15-7:45", activity: "Block 8: Mixed, error log and formula recap", type: "mixed" },
        { time: "7:45-8:45", activity: "Dinner", type: "meal" },
        { time: "8:45-9:30", activity: "Free time or family", type: "rest" },
        { time: "9:30-10:00", activity: "Screens off, plan tomorrow, sleep", type: "sleep" }
      ]
    },
    B: {
      name: "Balanced", sleep: "11:00 pm", wake: "5:00 am", study: "about 12 h", difficulty: "Medium",
      bestFor: "a steady daily rhythm", mainRisk: "a long day with little free time", freeTime: "about 45 min",
      rows: [
        { time: "5:00-5:20", activity: "Wake, Alarmy mission, water", type: "sleep" },
        { time: "5:20-6:50", activity: "Block 1: Maths, hardest topic first", type: "maths" },
        { time: "6:50-7:05", activity: "Break", type: "break" },
        { time: "7:05-8:35", activity: "Block 2: Physics formulae and derivations", type: "physics" },
        { time: "8:35-9:30", activity: "Exercise 30 min, bath, breakfast", type: "exercise" },
        { time: "9:30-11:00", activity: "Block 3: Chemistry, NCERT line by line", type: "chemistry" },
        { time: "11:00-11:15", activity: "Break", type: "break" },
        { time: "11:15-12:45", activity: "Block 4: Maths practice", type: "maths" },
        { time: "12:45-2:00", activity: "Lunch and 15-minute walk", type: "meal" },
        { time: "2:00-3:30", activity: "Block 5: Physics numericals", type: "physics" },
        { time: "3:30-3:45", activity: "Break", type: "break" },
        { time: "3:45-5:15", activity: "Block 6: Chemistry reactions and Inorganic", type: "chemistry" },
        { time: "5:15-5:30", activity: "Break and snack", type: "break" },
        { time: "5:30-7:00", activity: "Block 7: Maths PYQs", type: "maths" },
        { time: "7:00-7:15", activity: "Break", type: "break" },
        { time: "7:15-8:45", activity: "Block 8: Mixed, error log and formula recap", type: "mixed" },
        { time: "8:45-9:45", activity: "Dinner", type: "meal" },
        { time: "9:45-10:30", activity: "Free time or family", type: "rest" },
        { time: "10:30-11:00", activity: "Screens off, plan tomorrow, sleep", type: "sleep" }
      ]
    },
    C: {
      name: "Late-Start Hybrid", sleep: "12:00 am", wake: "6:00 am", study: "about 12 h", difficulty: "Easy",
      bestFor: "keeping your current wake-up time with a night peak", mainRisk: "late sleep can push the wake-up later", freeTime: "about 60 min",
      rows: [
        { time: "6:00-6:20", activity: "Wake, Alarmy mission, water", type: "sleep" },
        { time: "6:20-7:50", activity: "Block 1: Maths, hardest topic first", type: "maths" },
        { time: "7:50-8:05", activity: "Break", type: "break" },
        { time: "8:05-9:35", activity: "Block 2: Physics theory and derivations", type: "physics" },
        { time: "9:35-10:30", activity: "Exercise 30 min, bath, breakfast", type: "exercise" },
        { time: "10:30-12:00", activity: "Block 3: Chemistry, NCERT line by line", type: "chemistry" },
        { time: "12:00-12:15", activity: "Break", type: "break" },
        { time: "12:15-1:45", activity: "Block 4: Maths practice", type: "maths" },
        { time: "1:45-3:00", activity: "Lunch and 15-minute walk", type: "meal" },
        { time: "3:00-4:30", activity: "Block 5: Physics numericals", type: "physics" },
        { time: "4:30-4:45", activity: "Break", type: "break" },
        { time: "4:45-6:15", activity: "Block 6: Chemistry reactions and Inorganic", type: "chemistry" },
        { time: "6:15-6:30", activity: "Break and snack", type: "break" },
        { time: "6:30-8:00", activity: "Block 7: Mixed, PYQs", type: "mixed" },
        { time: "8:00-9:00", activity: "Dinner", type: "meal" },
        { time: "9:00-10:30", activity: "Block 8: Hardest Maths topic, night peak", type: "maths" },
        { time: "10:30-11:00", activity: "Error log and plan tomorrow", type: "mixed" },
        { time: "11:00-11:30", activity: "Free time", type: "rest" },
        { time: "11:30-12:00", activity: "Screens off, sleep", type: "sleep" }
      ]
    },
    D: {
      name: "Night Owl", sleep: "1:00 am", wake: "7:00 am", study: "about 12 h", difficulty: "Easiest",
      bestFor: "night-focused students", mainRisk: "wake-up may drift later", freeTime: "about 45 min",
      rows: [
        { time: "7:00-7:20", activity: "Wake, Alarmy mission, water", type: "sleep" },
        { time: "7:20-8:15", activity: "Exercise 30 min, bath, breakfast", type: "exercise" },
        { time: "8:15-9:45", activity: "Block 1: Chemistry, NCERT line by line", type: "chemistry" },
        { time: "9:45-10:00", activity: "Break", type: "break" },
        { time: "10:00-11:30", activity: "Block 2: Physics formulae and derivations", type: "physics" },
        { time: "11:30-11:45", activity: "Break", type: "break" },
        { time: "11:45-1:15", activity: "Block 3: Maths, hardest topic first", type: "maths" },
        { time: "1:15-2:30", activity: "Lunch and 15-minute walk", type: "meal" },
        { time: "2:30-4:00", activity: "Block 4: Physics numericals", type: "physics" },
        { time: "4:00-4:15", activity: "Break and snack", type: "break" },
        { time: "4:15-5:45", activity: "Block 5: Chemistry reactions and Inorganic", type: "chemistry" },
        { time: "5:45-6:00", activity: "Break", type: "break" },
        { time: "6:00-7:30", activity: "Block 6: Maths practice", type: "maths" },
        { time: "7:30-8:30", activity: "Dinner", type: "meal" },
        { time: "8:30-10:00", activity: "Block 7: Hardest Maths, Integrals", type: "maths" },
        { time: "10:00-10:15", activity: "Break", type: "break" },
        { time: "10:15-11:45", activity: "Block 8: Mixed, PYQs, error log", type: "mixed" },
        { time: "11:45-12:30", activity: "Plan tomorrow and free time", type: "rest" },
        { time: "12:30-1:00", activity: "Wind down, sleep", type: "sleep" }
      ]
    }
  },

  quiz: [
    { question: "When do you focus best?", options: ["Early morning (4-8 am)", "Morning to afternoon", "Evening", "Late at night"] },
    { question: "How is waking up for you?", options: ["I wake up easily", "I need an alarm", "I often fall asleep again", "Very hard"] },
    { question: "When do you usually sleep?", options: ["Around 10 pm", "Around 11 pm", "Around midnight", "Around 1 am"] }
  ],

  tips: [
    "Set an Alarmy photo mission with the target in the bathroom.",
    "Keep the phone across the room, plus a backup alarm 10 minutes later.",
    "Drink water and wash your face before sitting down.",
    "Fix the first task the night before.",
    "Shift gradually: 15 minutes earlier every 2 days.",
    "Screens off at 9:30 pm.",
    "Plan tomorrow's blocks before sleeping."
  ]
};