/* ============================================================
   ★ RITHVIKA.EXE — THE ONLY FILE YOU NEED TO EDIT ★

   Everything personal lives here. The engine (every other file)
   never needs to change.

   HOW TO READ THIS FILE
   ---------------------
   - Text between "quotes" is what the player sees. Change it freely.
   - Keep the commas, brackets and braces exactly where they are.
   - answer: 0 means the FIRST option is correct, 1 the second, and so on.
   - Anything written like [INSERT MEMORY HERE] is a placeholder that
     shows up in a yellow box in the game so you can spot it and swap it.
   - To add a photo/voice note: drop the file into rithvika/media/ and
     set   media: "media/us1.jpg"   (or .mp3 for voice notes).
   - sprite: "laptop" picks the pixel art. The list of available sprite
     names is at the top of js/pixel.js. Reuse any of them.
   ============================================================ */

const GAME_DATA = {

/* ============================================================
   1. WHO IS PLAYING, AND WHO IS THE GAME ABOUT
   ============================================================ */

player: {
  name: "MONISH",            // ← the boyfriend. Shown on the save file.
  nickname: "Moni"           // ← used in a few softer lines.
},

character: {
  name: "RITHVIKA",
  short: "Rithu",
  job: "Associate Data Analyst",
  company: "JCPenney",
  tagline: "37 unfinished ideas and counting."
},


/* ============================================================
   2. XP + LEVELS  (rewards for everything the player does)
   ============================================================ */

xp: {
  perLevel: 100,        // XP needed per level. Level caps at 99.
  object: 25,           // poking something in a room
  personality: 50,      // correct personality answer
  office: 100,          // correct office answer
  grocery: 100,         // correct grocery pick
  almondDodge: 200,     // NOT buying almonds
  puzzle: 250,          // pipeline / hard puzzle
  bossHit: 250,         // each correct automation on the boss
  basket: 500,          // finishing the grocery list
  clue: 50,             // finding a clue in the city
  cityAnswer: 100,      // correct city question
  connection: 250,      // correct mind-world connection
  relationship: 300,    // correct final-level answer
  finalComplete: 1000,  // finishing the game
  wrongPenalty: 25      // XP lost on a wrong answer (never goes below 0)
},

// Funny little banners when XP comes in. Picked by size of the gain.
xpQuips: {
  small: ["NOTED.", "HE'S PAYING ATTENTION.", "hm.", "DATA POINT ACQUIRED.", "INTERESTING."],
  medium: ["HE KNOWS HER.", "THAT WAS ALARMINGLY CORRECT.", "OKAY, SHOW-OFF.",
           "RITHVIKA IS PRETENDING NOT TO BE IMPRESSED.", "+CREDIBILITY."],
  large: ["Okay... that's suspiciously accurate.", "HOW DO YOU KNOW THAT.",
          "SHE DIDN'T EVEN TELL YOU THAT ONE.", "ARE YOU IN HER HEAD?"],
  wrong: ["...no.", "BOLD. WRONG.", "SHE HEARD THAT.", "RECALCULATING YOUR WHOLE RELATIONSHIP.",
          "That's what people who haven't met her say."]
},

// Status line next to the KNOWLEDGE bar, lowest threshold first.
knowledgeStatus: [
  { under: 30,  text: "WHO ARE YOU" },
  { under: 50,  text: "You've heard of her." },
  { under: 65,  text: "GETTING WARMER." },
  { under: 80,  text: "YOU'RE DOING SUSPICIOUSLY WELL." },
  { under: 92,  text: "This is starting to feel illegal." },
  { under: 999, text: "CERTIFIED RITHVIKA SPECIALIST." }
],


/* ============================================================
   3. MEMORY UNLOCKS
   Unlocked automatically when the player's LEVEL reaches "level".
   kind: "photo" | "voice" | "note" | "screenshot"
   media: leave null for a placeholder box, or "media/whatever.jpg"
   ============================================================ */

memories: [
  { level: 5,  kind: "photo", title: "MEMORY UNLOCKED",
    label: "[PHOTO OF US]", caption: "Remember this?", media: null },

  { level: 10, kind: "note", title: "MEMORY UNLOCKED",
    label: "[INSERT FIRST DATE MEMORY HERE]",
    caption: "File created: the day it started. Description pending — she'll fill it in.", media: null },

  { level: 20, kind: "screenshot", title: "EVIDENCE.PNG",
    label: "[INSERT SCREENSHOT OF OUR CHAT]",
    caption: "Exhibit A. She still stands by whatever she said here.", media: null },

  { level: 30, kind: "note", title: "MEMORY UNLOCKED",
    label: "[INSERT FUNNY MEMORY HERE]",
    caption: "Warning: retelling this causes uncontrollable laughing.", media: null },

  { level: 40, kind: "note", title: "INSIDE_JOKE.TXT",
    label: "[INSERT INSIDE JOKE HERE]",
    caption: "Nobody else gets this and that's the whole point.", media: null },

  { level: 50, kind: "voice", title: "VOICE NOTE FOUND",
    label: "[INSERT VOICE NOTE HERE]",
    caption: "0:47 — she re-recorded it four times.", media: null },

  { level: 60, kind: "photo", title: "MEMORY UNLOCKED",
    label: "[INSERT FAVOURITE PHOTO OF HIM]",
    caption: "She looks at this one more than she admits.", media: null },

  { level: 75, kind: "note", title: "IMPORTANT.TXT",
    label: "[INSERT IMPORTANT RELATIONSHIP MEMORY HERE]",
    caption: "The one she'd keep if she could only keep one.", media: null },

  { level: 90, kind: "note", title: "THINGS_SHE_NEVER_SAID_OUT_LOUD.TXT",
    label: "[INSERT THE THING SHE FINDS HARD TO SAY]",
    caption: "Hard to type. Typed anyway.", media: null },

  { level: 99, kind: "note", title: "FINAL MEMORY",
    label: "[INSERT FINAL MESSAGE TO HIM HERE]",
    caption: "You reached the end of the game. This part isn't a game.", media: null }
],


/* ============================================================
   4. BOOT + INTRO
   ============================================================ */

boot: {
  bios: [
    "RITHVIKA BIOS v2.0.1  (c) 2000 RITHU SYSTEMS",
    "CPU: OVERTHINKING 486DX @ 2AM",
    "MEMORY TEST ........ 37 UNFINISHED IDEAS FOUND",
    "DETECTING PERSONALITY ........ OK",
    "DETECTING SLEEP SCHEDULE ..... NOT FOUND",
    "LOADING CAFFEINE DRIVER ...... OK",
    "MOUNTING /home/rithvika ...... OK",
    "MOUNTING /work/jcpenney ...... (sigh) OK",
    "",
    "PRESS START TO CONTINUE"
  ],
  title: "RITHVIKA.EXE",
  subtitle: "THE QUEST TO UNLOCK HER HEART",
  version: "v1.0  ·  a birthday build  ·  1 player only",
  intro: [
    { who: "SYSTEM", text: "Welcome to RITHVIKA.EXE." },
    { who: "SYSTEM", text: "Player detected: {PLAYER}." },
    { who: "SYSTEM", text: "Your objective is simple." },
    { who: "SYSTEM", text: "Understand Rithvika." },
    { who: "SYSTEM", text: "Estimated difficulty: IMPOSSIBLE." },
    { who: "RITHVIKA", text: "...wait. How did you get in here?" },
    { who: "RITHVIKA", text: "Why are you here?" },
    { who: "SYSTEM", text: "He clicked something he shouldn't have." },
    { who: "RITHVIKA", text: "Of course he did." },
    { who: "RITHVIKA", text: "Fine. But I'm warning you — it's messy in here." },
    { who: "SYSTEM", text: "WARNING: 37 unfinished ideas detected." },
    { who: "SYSTEM", text: "WARNING: 47 browser tabs open. None of them are closing." },
    { who: "RITHVIKA", text: "Those are load-bearing tabs." },
    { who: "SYSTEM", text: "Loading WORLD 1: HOME.EXE" }
  ]
},

// The world-select hub, shown between worlds.
worldSelect: {
  title: "RITHVIKA.EXE — DISK CONTENTS",
  hint: "Double-click a world. They unlock in order.",
  worlds: [
    { id: "home",    name: "HOME.EXE",              sub: "Habits, chaos, comfort.",        sprite: "bed" },
    { id: "office",  name: "CORPORATE.DIMENSION",   sub: "Survive one day as Rithvika.",  sprite: "reports" },
    { id: "grocery", name: "GROCERY.EXE",           sub: "Shop for her. Carefully.",      sprite: "basket" },
    { id: "city",    name: "THE_REAL_RITHVIKA.MAP", sub: "Go looking for her.",           sprite: "b_night" },
    { id: "mind",    name: "MIND.SYS",              sub: "Read only. Mostly.",            sprite: "brain" },
    { id: "final",   name: "LEVEL99.EXE",           sub: "The person who knows her.",     sprite: "heart" }
  ]
},


/* ============================================================
   5. WORLD 1 — HOME.EXE
   Objects in her room. "lines" is a list of screens: the first
   click shows the first entry, clicking again shows the next.
   ============================================================ */

home: {
  name: "HOME.EXE",
  mission: "FIGURE OUT HOW RITHVIKA WORKS.",
  objectsNeeded: 8,   // how many objects must be poked before the door opens
  intro: [
    { who: "SYSTEM", text: "LOCATION: /home/rithvika/bedroom" },
    { who: "SYSTEM", text: "MISSION: FIGURE OUT HOW RITHVIKA WORKS." },
    { who: "SYSTEM", text: "Touch things. She's used to it." },
    { who: "RITHVIKA", text: "Don't judge the desk." }
  ],
  outro: [
    { who: "SYSTEM", text: "HOME.EXE scanned." },
    { who: "RITHVIKA", text: "Okay, you survived my room. That's usually the hard part." },
    { who: "RITHVIKA", text: "Now come see what they've done to me at work." }
  ],

  objects: [
    { id:"laptop", sprite:"laptop", label:"LAPTOP", x:196, y:118, lines:[
        [{who:"SYSTEM",text:"This machine contains approximately 37 unfinished ideas."}],
        [{who:"SYSTEM",text:"CURRENT PROJECTS DETECTED:\n> AI OS\n> Automation (everything)\n> Research paper\n> Game development\n> Startup ideas\n> Data engineering\n> Machine learning\n> Random 2 AM ideas"},
         {who:"RITHVIKA",text:"They're all going to get finished. Eventually. Simultaneously."}],
        [{who:"SYSTEM",text:"Battery: 4%. Charger: 1.5 metres away. Action taken: none."}],
        [{who:"RITHVIKA",text:"If you close any of those windows I will know."}]
      ]},

    { id:"phone", sprite:"phone", label:"PHONE", x:176, y:120, lines:[
        [{who:"SYSTEM",text:"Contains approximately 47 tabs worth of thoughts."}],
        [{who:"SYSTEM",text:"Screen time report: 3h research, 2h reels, 40m staring at the same message deciding how to reply."}],
        [{who:"RITHVIKA",text:"I typed it, deleted it, typed it again, then sent 'k'."}]
      ]},

    { id:"notebook", sprite:"notebook", label:"NOTEBOOK", x:228, y:124, lines:[
        [{who:"SYSTEM",text:"WARNING: Rithvika has another idea."}],
        [{who:"SYSTEM",text:"Page 1: system architecture.\nPage 2: grocery list.\nPage 3: system architecture for the grocery list."}],
        [{who:"RITHVIKA",text:"The notebook is the only teammate that never asks for a status update."}]
      ]},

    { id:"bed", sprite:"bed", label:"BED", x:44, y:140, lines:[
        [{who:"SYSTEM",text:"Bed detected. Primary function: a place to lie down and think about the idea instead of sleeping."}],
        [{who:"SYSTEM",text:"Last recorded sleep attempt interrupted by: 'wait, what if I automated that'."}],
        [{who:"RITHVIKA",text:"2 AM is my most productive hour and my worst decision."}]
      ]},

    { id:"mirror", sprite:"mirror", label:"MIRROR", x:104, y:62, lines:[
        [{who:"SYSTEM",text:"Mirror. Used for: outfit checks, pep talks, and one very long stare after a bad day."}],
        [{who:"RITHVIKA",text:"I'm working on being kinder to whoever is standing there."}],
        [{who:"SYSTEM",text:"Reflection shows someone who is much further along than she gives herself credit for."}]
      ]},

    { id:"books", sprite:"books", label:"BOOKS", x:250, y:32, lines:[
        [{who:"SYSTEM",text:"Books: 14. Started: 9. Finished: 3. Currently reading: all of them."}],
        [{who:"SYSTEM",text:"Topics: machine learning, systems design, and one book about being less hard on yourself (bookmarked at page 6)."}]
      ]},

    { id:"headphones", sprite:"headphones", label:"HEADPHONES", x:124, y:150, lines:[
        [{who:"SYSTEM",text:"Noise cancelling. Not for music. For building a room inside a room."}],
        [{who:"RITHVIKA",text:"Headphones on means the idea is happening. Don't take it personally."}]
      ]},

    { id:"desk", sprite:"desk", label:"DESK", x:200, y:138, lines:[
        [{who:"SYSTEM",text:"Desk state: 'organised chaos'. She knows where everything is. Do not help."}],
        [{who:"SYSTEM",text:"Items: 3 pens (1 works), sticky notes, a cable for a device she no longer owns."}]
      ]},

    { id:"snacks", sprite:"snacks", label:"SNACKS", x:288, y:128, lines:[
        [{who:"SYSTEM",text:"Snack drawer scanned: dates, roasted chana, something she'll call 'healthy' with confidence."}],
        [{who:"RITHVIKA",text:"It's balanced. There's protein in there somewhere."}],
        [{who:"SYSTEM",text:"NOTE FOR PLAYER: no almonds. Ever. Remember that. It comes up later."}]
      ]},

    { id:"clothes", sprite:"clothes", label:"CLOTHES", x:80, y:152, lines:[
        [{who:"SYSTEM",text:"The chair. Not dirty, not clean. A third category. A staging environment."}],
        [{who:"RITHVIKA",text:"That's the 'worn once, still fine' pile. It's a system."}]
      ]},

    { id:"pc", sprite:"pc", label:"COMPUTER", x:306, y:148, lines:[
        [{who:"SYSTEM",text:"Second machine. Runs the things she doesn't want to explain yet."}],
        [{who:"SYSTEM",text:"Uptime: 21 days. Reason: a script is running. Nobody remembers which one."}],
        [{who:"RITHVIKA",text:"It's fine. It's doing something useful. Probably."}]
      ]},

    { id:"usb", sprite:"usb", label:"UNLABELLED USB", x:236, y:150, lines:[
        [{who:"SYSTEM",text:"MYSTERIOUS OBJECT 1/3. Contents: 'final_v2_FINAL_actualfinal.zip'."}],
        [{who:"RITHVIKA",text:"That's either a whole project or homework from 2019. We don't open it."}]
      ]},

    { id:"stickies", sprite:"stickies", label:"STICKY NOTES", x:272, y:66, lines:[
        [{who:"SYSTEM",text:"MYSTERIOUS OBJECT 2/3. A wall of sticky notes in three colours and no legend."}],
        [{who:"SYSTEM",text:"Sampled note: 'automate this'. Sampled note: 'ASK HER LATER'. Sampled note: a drawing of a cat."}]
      ]},

    { id:"plant", sprite:"plant", label:"THE PLANT", x:16, y:158, lines:[
        [{who:"SYSTEM",text:"MYSTERIOUS OBJECT 3/3. A plant. Alive, technically."}],
        [{who:"RITHVIKA",text:"I have a watering schedule. It's in the notebook. Somewhere."}],
        [{who:"SYSTEM",text:"Suggestion: automate the watering. Estimated build time: 6 hours. Watering time: 40 seconds."}]
      ]},

    { id:"bottle", sprite:"bottle", label:"WATER BOTTLE", x:262, y:122, lines:[
        [{who:"SYSTEM",text:"1 litre bottle. Filled this morning. Still full."}],
        [{who:"RITHVIKA",text:"I'll drink it. Stop looking at me like that."}]
      ]},

    { id:"mug", sprite:"mug", label:"MUG", x:246, y:126, lines:[
        [{who:"SYSTEM",text:"Tea. Made 90 minutes ago. Temperature: room. Emotional value: still high."}],
        [{who:"RITHVIKA",text:"Cold tea is just iced tea with commitment issues."}]
      ]}
  ],

  quiz: [
    { q: "What is Rithvika most likely to do when given a boring repetitive task?",
      options: ["Do it normally","Complain about it","Automate the entire process","Forget it exists"],
      answer: 2,
      note: "She will spend six hours removing four minutes of work. And she'd do it again." },

    { q: "It is 2 AM. Rithvika is wide awake. Why?",
      options: ["Bad dream","She had an idea and the idea is winning",
                "Scrolling with no memory of starting","Early meeting anxiety"],
      answer: 1,
      note: "The idea always arrives at the worst possible hour, fully formed and very loud." },

    { q: "She starts a new project. What happens to the last one?",
      options: ["Finished first, obviously","It waits in a tab, alive, watching",
                "Deleted","Handed to someone else"],
      answer: 1,
      note: "Nothing is ever abandoned. Everything is 'paused'. There are 37 paused things." },

    { q: "You walk in while she has headphones on and three terminals open. Correct move?",
      options: ["Ask her what she's doing right now","Turn off the monitor as a joke",
                "Leave water/snack nearby and let her surface","Start explaining your day in detail"],
      answer: 2,
      note: "She'll come out of it on her own in twenty minutes and be very glad the water is there." }
  ]
},


/* ============================================================
   6. WORLD 2 — THE CORPORATE DIMENSION
   ============================================================ */

office: {
  name: "THE CORPORATE DIMENSION",
  mission: "SURVIVE ONE DAY AS RITHVIKA",
  startSanity: 100,
  intro: [
    { who: "SYSTEM", text: "LOADING: THE CORPORATE DIMENSION" },
    { who: "SYSTEM", text: "LOCATION: {COMPANY} · ROLE: {JOB}" },
    { who: "SYSTEM", text: "MISSION: SURVIVE ONE DAY AS RITHVIKA." },
    { who: "SYSTEM", text: "Sanity meter enabled. Good luck with that." },
    { who: "RITHVIKA", text: "Badge on. Face neutral. Let's go." }
  ],
  outro: [
    { who: "SYSTEM", text: "SHIFT COMPLETE. She logged off. Physically." },
    { who: "RITHVIKA", text: "Every report I automate is four minutes I get back for something that's actually mine." },
    { who: "SYSTEM", text: "Next: GROCERY.EXE. Bring the list. There is no list." }
  ],

  // Things to poke in the office
  objects: [
    { id:"odesk", sprite:"odesk", label:"HER DESK", x:64, y:124, lines:[
        [{who:"SYSTEM",text:"Desk. Two monitors, one sticky note that says 'don't reply immediately'."}]
      ]},
    { id:"databricks", sprite:"databricks", label:"DATABRICKS", x:100, y:110, lines:[
        [{who:"SYSTEM",text:"Cluster starting... cluster starting... cluster starting..."},
         {who:"RITHVIKA",text:"This is the part of my job that's basically a loading screen with a salary."}]
      ]},
    { id:"reports", sprite:"reports", label:"REPORT PILE", x:140, y:126, lines:[
        [{who:"SYSTEM",text:"Reports requested this week: 11. Reports anyone actually read: unclear."}]
      ]},
    { id:"spread", sprite:"spread", label:"SPREADSHEET", x:178, y:116, lines:[
        [{who:"SYSTEM",text:"A spreadsheet with a pivot table load-bearing to the entire department."},
         {who:"RITHVIKA",text:"One wrong click and a whole business unit forgets how it makes money."}]
      ]},
    { id:"coffee", sprite:"coffee", label:"COFFEE MACHINE", x:288, y:116, lines:[
        [{who:"SYSTEM",text:"Fuel station. Also the only place where real information is exchanged."}]
      ]},
    { id:"clock", sprite:"clock", label:"CLOCK", x:160, y:40, lines:[
        [{who:"SYSTEM",text:"11:58 AM. It has been 11:58 AM for two hours."}]
      ]},
    { id:"dashboard", sprite:"dashboard", label:"DASHBOARD", x:216, y:46, lines:[
        [{who:"SYSTEM",text:"A dashboard nobody opens, refreshed hourly, forever. She built it in a day. It'll outlive the company."}]
      ]},
    { id:"door", sprite:"door", label:"MEETING ROOM", x:298, y:86, lines:[
        [{who:"SYSTEM",text:"MEETING: 'Quick sync' · Duration: 58 minutes · Outcome: another meeting."}]
      ]}
  ],

  // NPC tasks. Each is a choice; correct = C-style automation answer.
  npcs: [
    { id:"npc_report", sprite:"npc1", label:"GUY WHO NEEDS REPORTS", name:"REPORT GUY", x:116, y:128,
      open:[{who:"REPORT GUY",text:"Hey! Quick one. Can you run this report?"},
            {who:"SYSTEM",text:"Rithvika has received another report."}],
      sanity:-12,
      q:{ q:"It's the same report he asked for last Tuesday. And the Tuesday before. What does she do?",
          options:["Run the report manually","Ask someone else to do it",
                   "Automate the report so nobody ever has to ask again","Pretend she didn't see the message"],
          answer:2, xpKey:"office", sanity:18,
          note:"Six hours of scripting to kill a fifteen-minute task forever. That's not laziness, that's a grudge with a schedule." } },

    { id:"npc_mgr", sprite:"npc2", label:"MANAGER", name:"MANAGER", x:210, y:128,
      open:[{who:"MANAGER",text:"Can you pull the numbers 'real quick'?"},
            {who:"SYSTEM",text:"'Real quick' has been measured at 3 hours 40 minutes."}],
      sanity:-10,
      q:{ q:"The 'quick' ask needs five systems that don't agree with each other. Rithvika's actual first move?",
          options:["Panic quietly and start clicking","Find out what question they're really trying to answer",
                   "Send a screenshot of raw data and log off","Escalate immediately"],
          answer:1, xpKey:"office", sanity:14,
          note:"She'd rather spend ten minutes on the real question than three hours on the wrong number." } },

    { id:"npc_new", sprite:"npc3", label:"NEW TEAMMATE", name:"NEW TEAMMATE", x:252, y:152,
      open:[{who:"NEW TEAMMATE",text:"Sorry, dumb question — how do I even get to this table?"}],
      sanity:-4,
      q:{ q:"Someone new asks her something basic for the third time. She...",
          options:["Sighs loudly so they hear it","Walks them through it, then writes a doc so nobody has to ask again",
                   "Forwards them a 40-page PDF","Tells them to Google it"],
          answer:1, xpKey:"office", sanity:10,
          note:"Her instinct is always 'fix the source of the question', not 'answer the question'." } },

    { id:"npc_sas", sprite:"npc4", label:"LEGACY SAS JOB", name:"LEGACY SYSTEM", x:28, y:120,
      open:[{who:"SYSTEM",text:"A SAS job from 2011 has opinions about your data."},
            {who:"LEGACY SYSTEM",text:"I have been running since before you were hired. Nobody knows why."}],
      sanity:-14,
      q:{ q:"Legacy job, no documentation, one person who 'kind of' knows it. Rithvika's move?",
          options:["Delete it and find out what breaks","Read it line by line and rebuild it in something modern",
                   "Never touch it, mention it in no meeting","Add a second job that fixes the first job's output"],
          answer:1, xpKey:"office", sanity:16,
          note:"She'd rather understand the ugly thing completely than be scared of it forever." } }
  ],

  // The pipeline mini-game. One stage is broken; the log hints at it.
  pipeline: {
    intro:[{who:"SYSTEM",text:"ALERT: NIGHTLY PIPELINE FAILED."},
           {who:"SYSTEM",text:"Someone has to fix it. Guess who is awake."}],
    stages:["SAS","SQL","DATABRICKS","PYSPARK","PARQUET","REPORT"],
    broken:3,   // 0-based: PYSPARK is the broken stage
    log:[
      "[02:14] SAS extract .............. OK  (rows: 4,182,904)",
      "[02:31] SQL staging load ......... OK  (rows: 4,182,904)",
      "[02:40] Databricks cluster ....... OK  (up in 9m, as usual)",
      "[02:52] PySpark transform ........ ERROR",
      "         AnalysisException: cannot resolve 'cust_id'",
      "         given input columns: [customer_id, ...]",
      "[02:52] Parquet write ............ SKIPPED (no input)",
      "[02:52] Report refresh ........... SKIPPED (no data)",
      "[06:00] 11 people ................ EMAILING HER"
    ],
    hint:"Read the log. Which stage actually threw?",
    wrong:"Not it. That stage is fine — look at what the log says failed first.",
    fixed:[{who:"SYSTEM",text:"PIPELINE RESTORED."},
           {who:"SYSTEM",text:"RITHVIKA SANITY +500."},
           {who:"RITHVIKA",text:"It was a renamed column. It's always a renamed column."}]
  },

  // BOSS: THE BORING REPORT
  boss: {
    name:"THE BORING REPORT",
    hp:10000,
    intro:[{who:"SYSTEM",text:"⚠  BOSS ENCOUNTER"},
           {who:"SYSTEM",text:"THE BORING REPORT has appeared."},
           {who:"SYSTEM",text:"It has no weakness to effort. It regenerates every week."},
           {who:"RITHVIKA",text:"Effort doesn't kill it. Automation does. Hand me the keyboard."}],
    // Each correct answer deals dmg. Wrong answers cost sanity and the boss heals a little.
    attacks:[
      { q:"THE BORING REPORT attacks: 'RUN ME MANUALLY, EVERY MONDAY, FOREVER.'\nHow does Rithvika hit back?",
        options:["Run it faster each week","Write the query once and schedule it",
                 "Do it Sunday night instead","Make a nicer-looking version of it"],
        answer:1, dmg:2200, quip:"SCHEDULED. It ran without her. It will never need her again." },

      { q:"'THE COLUMN NAMES CHANGE EVERY MONTH,' it hisses.",
        options:["Fix them by hand monthly","Validate the schema in code and fail loudly with a clear message",
                 "Ignore it and hope","Ask the source team nicely, once"],
        answer:1, dmg:2000, quip:"It broke at 2 AM and told her exactly why. Growth." },

      { q:"'ELEVEN PEOPLE WILL EMAIL YOU THE SAME QUESTION.'",
        options:["Answer all eleven individually","Publish one dashboard and send one link",
                 "Turn off notifications","Answer only the loudest one"],
        answer:1, dmg:1800, quip:"One link. Eleven fewer conversations. She's already gone." },

      { q:"'THE NUMBERS ARE SLIGHTLY WRONG AND NOBODY WILL NOTICE.'",
        options:["Ship it, it's close enough","Add automated checks that scream before humans see it",
                 "Add a disclaimer in tiny text","Recheck it manually every single run"],
        answer:1, dmg:2000, quip:"Tests. The boss hates tests." },

      { q:"'FINE. THEN I WILL BE SO BORING YOU'LL FORGET WHY YOU CARE.'",
        options:["Accept that jobs are boring","Automate the boring part and spend the saved hours on the AI OS / research / the thing that's actually hers",
                 "Quit dramatically","Do the boring part very, very well forever"],
        answer:1, dmg:2600, quip:"That's the whole trick. Automate the noise, protect the real work." }
    ],
    defeat:[{who:"SYSTEM",text:"REPORT AUTOMATED."},
            {who:"SYSTEM",text:"BORING TASK ELIMINATED."},
            {who:"SYSTEM",text:"RITHVIKA SANITY +500."},
            {who:"RITHVIKA",text:"It'll respawn next quarter with a new name. I'll be ready."}]
  }
},


/* ============================================================
   7. WORLD 3 — GROCERY.EXE
   buy:true  = she'd actually buy it
   buy:false = she wouldn't (costs a little knowledge)
   trap:true = the almond incident
   ============================================================ */

grocery: {
  name: "GROCERY.EXE",
  mission: "BUILD HER BASKET. DON'T GET IT WRONG.",
  needed: 8,   // correct items required to check out
  intro: [
    { who: "SYSTEM", text: "LOCATION: THE GOOD SHOP · aisles: 4 · trolleys: 1 wobbly" },
    { who: "SYSTEM", text: "MISSION: shop for Rithvika." },
    { who: "RITHVIKA", text: "I gave you no list. If you know me, you don't need one." },
    { who: "SYSTEM", text: "One item in this store will end you. Choose carefully." }
  ],
  outro: [
    { who: "SYSTEM", text: "BASKET COMPLETE. CHECKOUT SUCCESSFUL." },
    { who: "RITHVIKA", text: "You got the ragi. Nobody gets the ragi." },
    { who: "SYSTEM", text: "Loading: THE_REAL_RITHVIKA.MAP" }
  ],
  items: [
    { id:"eggs",    sprite:"eggs",    label:"EGGS",        buy:true,  note:"Protein. Non-negotiable." },
    { id:"milk",    sprite:"milk",    label:"MILK",        buy:true,  note:"For the tea that will go cold." },
    { id:"oats",    sprite:"oats",    label:"OATS",        buy:true,  note:"Breakfast, decided once, repeated forever. Very her." },
    { id:"ragi",    sprite:"ragi",    label:"RAGI",        buy:true,  note:"RAGI. Correct. This is the answer of someone who has been listening." },
    { id:"flax",    sprite:"flax",    label:"FLAX SEEDS",  buy:true,  note:"Sprinkled on everything with total confidence." },
    { id:"dates",   sprite:"dates",   label:"DATES",       buy:true,  note:"The sweet thing that's allowed to be sweet." },
    { id:"paneer",  sprite:"paneer",  label:"PANEER",      buy:true,  note:"Dinner solved." },
    { id:"spinach", sprite:"spinach", label:"SPINACH",     buy:true,  note:"Bought with excellent intentions. Used at 60% capacity." },
    { id:"banana",  sprite:"banana",  label:"BANANAS",     buy:true,  note:"The 'I'll eat properly later' fruit." },
    { id:"curd",    sprite:"curd",    label:"CURD",        buy:true,  note:"Always in the fridge. Always." },
    { id:"fruit",   sprite:"apple",   label:"FRUIT",       buy:true,  note:"Fruit. Fine. Safe." },
    { id:"veg",     sprite:"carrot",  label:"VEGETABLES",  buy:true,  note:"Yes. She cooks. Occasionally at 11 PM." },
    { id:"chips",   sprite:"chips",   label:"BIG BAG OF CHIPS", buy:false, note:"She'd walk past it. Then think about it. Then still walk past it." },
    { id:"soda",    sprite:"soda",    label:"FIZZY DRINKS",buy:false, note:"Not her thing. Try again." },
    { id:"instant", sprite:"noodles", label:"INSTANT NOODLES", buy:false, note:"Only in an emergency, and she'd be annoyed about it." },
    { id:"almonds", sprite:"almonds", label:"ALMONDS",     buy:false, trap:true, note:"NO. Absolutely not. Never put these in her basket." }
  ],
  trap: {
    error:"RITHVIKA CANNOT HAVE THIS.",
    detail:"ALMONDS. Of all the things in this shop. ALMONDS.",
    penalty:50,
    lines:[{who:"RITHVIKA",text:"Put. Them. Back."},
           {who:"SYSTEM",text:"BOYFRIEND KNOWLEDGE -50. Item returned to shelf. We never speak of this."}]
  },
  quiz: [
    { q:"She's in the shop, mildly hungry, and something unplanned goes in the basket. What is it?",
      options:["Chocolate bar","Dates or something she can call 'a snack with purpose'","Crisps","Ice cream tub"],
      answer:1, note:"It's still a treat. It just has to survive being justified out loud." },
    { q:"What happens to the vegetables she buys on a hopeful Sunday?",
      options:["All cooked by Tuesday","Some cooked, some quietly discovered later, zero regret",
               "Given away","Cooked all at once in one giant batch"],
      answer:1, note:"The intention was real. The fridge is just slow." }
  ]
},


/* ============================================================
   8. WORLD 4 — THE REAL RITHVIKA (city map)
   Each location: a clue to find, then one question.
   ============================================================ */

city: {
  name: "THE REAL RITHVIKA",
  mission: "EIGHT PLACES. FIND HER IN ALL OF THEM.",
  intro: [
    { who: "SYSTEM", text: "MAP LOADED. Eight locations. She's a bit of herself in each one." },
    { who: "SYSTEM", text: "Walk to a building and enter it. Find the clue. Then answer." },
    { who: "RITHVIKA", text: "This is the part where you stop guessing and start knowing." }
  ],
  outro: [
    { who: "SYSTEM", text: "MAP COMPLETE. Profile confidence: high." },
    { who: "RITHVIKA", text: "You went to every single one. Even the cafe." },
    { who: "SYSTEM", text: "There is one place left. It doesn't have an address." }
  ],
  locations: [
    { id:"c_home", sprite:"b_home", label:"HOME", x:24, y:116,
      clue:"CLUE FOUND: a to-do list where three items are done and eleven are new ideas.",
      q:{ q:"What does Rithvika do when something is boring?",
          options:["Powers through it","Finds a way to never do it again","Complains and does it anyway","Delegates it"],
          answer:1, note:"Boredom isn't a mood for her, it's a bug report." } },

    { id:"c_office", sprite:"b_office", label:"OFFICE", x:62, y:106,
      clue:"CLUE FOUND: a calendar invite titled 'blocked — do not book' at 3 PM every day.",
      q:{ q:"What does she protect hardest at work?",
          options:["Her lunch break","Uninterrupted time to actually build something","Her inbox","Meeting-free Fridays"],
          answer:1, note:"Interruptions cost her more than the task does." } },

    { id:"c_store", sprite:"b_store", label:"GROCERY STORE", x:100, y:116,
      clue:"CLUE FOUND: a receipt — ragi, flax, dates, curd. Same four items, every single time.",
      q:{ q:"What do her habits look like once she's decided something works?",
          options:["She keeps experimenting","She locks it in and repeats it without thinking about it again",
                   "She changes it weekly","She asks other people what they do"],
          answer:1, note:"Decide once, automate the rest of your life around it. Same with breakfast, same with code." } },

    { id:"c_lab", sprite:"b_lab", label:"TECH LAB", x:138, y:106,
      clue:"CLUE FOUND: a whiteboard reading 'AI OS — v0.1 — what if the computer just... understood?'",
      q:{ q:"What kind of technology does she obsess over?",
          options:["Phones and gadgets","AI, automation, systems that think for themselves",
                   "Social apps","Crypto"],
          answer:1, note:"Anything where a machine can carry the boring part so a human can do the interesting part." } },

    { id:"c_study", sprite:"b_study", label:"STUDY ROOM", x:176, y:116,
      clue:"CLUE FOUND: a research paper, printed, highlighted in three colours, annotated at 1:48 AM.",
      q:{ q:"What does she want eventually — career-wise?",
          options:["A safe, comfortable job","To build things that are hers: research, an AI OS, a product, maybe her own thing",
                   "Management","To stop working"],
          answer:1, note:"The job pays. The building is the point." } },

    { id:"c_game", sprite:"b_game", label:"GAME ROOM", x:214, y:106,
      clue:"CLUE FOUND: a half-built game. The engine works. There is no level 2 yet.",
      q:{ q:"What happens when Rithvika gets a new idea?",
          options:["She writes it down for later, calmly","Everything else pauses and she's three hours deep before dinner",
                   "She asks for permission","It fades by morning"],
          answer:1, note:"The idea doesn't wait its turn. It never has." } },

    { id:"c_cafe", sprite:"b_cafe", label:"CAFE", x:252, y:116,
      clue:"CLUE FOUND: two cups. One finished. One cold, next to a notebook full of diagrams.",
      q:{ q:"What makes her genuinely excited?",
          options:["Being praised","The moment something she built actually works",
                   "Days off","Winning an argument"],
          answer:1, note:"The first successful run. That's the drug." } },

    { id:"c_night", sprite:"b_night", label:"NIGHT CITY", x:292, y:106,
      clue:"CLUE FOUND: 2:11 AM. Lights on. A voice note to herself she'll listen to tomorrow.",
      q:{ q:"What kind of person does she want to become?",
          options:["Famous","A stronger, sharper version of herself — someone who finished the things she started",
                   "Rich and done","Someone with less on her plate"],
          answer:1, note:"Not a different person. The same person, running properly." } }
  ]
},


/* ============================================================
   9. WORLD 5 — RITHVIKA'S MIND
   Connect each concept on the left to what it really is on the right.
   ============================================================ */

mind: {
  name: "RITHVIKA'S MIND",
  mission: "RECONSTRUCT HER. CAREFULLY.",
  intro: [
    { who: "SYSTEM", text: "ENTERING: MIND.SYS" },
    { who: "SYSTEM", text: "This area is not organised. It is not supposed to be." },
    { who: "RITHVIKA", text: "You're in the part I don't show people. Be nice." },
    { who: "SYSTEM", text: "Connect each thing floating here to what it actually is." }
  ],
  groups: {
    dreams:  ["AI OS","Startup","Research","Machine Learning","Product","Data Engineering","Building things","Something of her own"],
    fears:   ["Failure","Being stuck","Not reaching her potential"],
    people:  ["Friends","Family","{PLAYER}"],
    future:  ["A stronger version of herself"]
  },
  pairs: [
    { left:"AI OS",         right:"curiosity",        note:"She doesn't want to use the future. She wants to take it apart." },
    { left:"Automation",    right:"problem solving",  note:"Every automation is her saying 'this shouldn't cost a human anything'." },
    { left:"Research",      right:"ambition",         note:"Reading the hard paper at 1 AM isn't homework. It's appetite." },
    { left:"Coding",        right:"creativity",       note:"It's the closest thing she has to drawing." },
    { left:"Relationships", right:"her emotional world", note:"The part she's quietest about and protects hardest." },
    { left:"Being stuck",   right:"her real fear",    note:"Not failing. Standing still. Those are different things." },
    { left:"2 AM ideas",    right:"who she actually is", note:"Nobody is that alive about something they don't love." }
  ],
  complete: [
    { who: "SYSTEM", text: "SYSTEM RECONSTRUCTION COMPLETE." },
    { who: "SYSTEM", text: "Compiling personality... 100%" },
    { who: "SYSTEM", text: "ERROR." },
    { who: "SYSTEM", text: "Actually..." },
    { who: "SYSTEM", text: "NO ONE CAN FULLY UNDERSTAND RITHVIKA." },
    { who: "SYSTEM", text: "BUT YOU GOT PRETTY CLOSE." },
    { who: "RITHVIKA", text: "Closer than anyone's gotten. Keep going." }
  ]
},


/* ============================================================
   10. FINAL LEVEL — LEVEL 99: THE PERSON WHO KNOWS HER
   ============================================================ */

finale: {
  name: "LEVEL 99: THE PERSON WHO KNOWS HER",
  intro: [
    { who: "SYSTEM", text: "A locked door." },
    { who: "SYSTEM", text: "LEVEL 99: THE PERSON WHO KNOWS HER" },
    { who: "SYSTEM", text: "Final test. Ten questions. No hints." },
    { who: "RITHVIKA", text: "You can get some wrong. I'd be worried if you got them all right." }
  ],
  questions: [
    { q:"When Rithvika says she's fine, what might she actually need?",
      options:["To be left completely alone","Someone to stay nearby and not make it a whole thing",
               "Advice and a plan","To be asked twelve times"],
      answer:1, note:"Not fixing. Not fuss. Just company that doesn't demand an explanation." },

    { q:"What does she do when she becomes obsessed with an idea?",
      options:["Plans it out over a week","Disappears into it — no food, no clock, twelve tabs, 2 AM",
               "Tells everyone and waits","Sleeps on it"],
      answer:1, note:"You've seen it happen. You've probably had a conversation with the back of her head." },

    { q:"What's more likely?",
      options:["Rithvika finishes one project","Rithvika starts three more because she got another idea"],
      answer:1, note:"37 unfinished ideas. It's in the boot sequence." },

    { q:"What happens when Rithvika encounters a repetitive task?",
      options:["She does it and moves on","She builds something so it never happens again",
               "She avoids it forever","She asks for help"],
      answer:1, note:"Repetition is personally offensive to her." },

    { q:"What does she ultimately want to build?",
      options:["A nice career","Something of her own — an AI OS / a product / a system people actually use",
               "A big team","A quiet life"],
      answer:1, note:"Hers. That word is doing all the work in that sentence." },

    { q:"What kind of person does she want to become?",
      options:["Someone more relaxed","A stronger version of herself who finishes what she starts",
               "Someone with a different job","Someone who needs less"],
      answer:1, note:"Same person. More follow-through. Less self-doubt at 2 AM." },

    { q:"What makes her genuinely excited?",
      options:["Attention","The first time a thing she built actually runs",
               "Free food","Weekends"],
      answer:1, note:"That one second where the output is right and nobody is watching." },

    { q:"What does she care about more than she admits?",
      options:["Being right","Being understood by the few people she lets close",
               "Winning","Her phone"],
      answer:1, note:"She'll shrug about it and then remember exactly what you said." },

    { q:"What does she do the moment she thinks something can be automated?",
      options:["Adds it to a list for later","Starts immediately, at a wildly inconvenient hour, and finishes at 3 AM",
               "Mentions it and waits for approval","Nothing, it's not worth it"],
      answer:1, note:"Estimated automation time: 6 hours. Task duration: 4 minutes. ...worth it." },

    { q:"What's something about her that most people don't get straight away?",
      options:["She's shy","The chaos is not disorganisation — it's a lot of care pointed at too many things she loves",
               "She's serious all the time","She doesn't like people"],
      answer:1, note:"People see scattered. It's actually intensity with no off switch." }
  ],
  // The closing screen never reports less than this, because he did turn up
  // and finish the whole thing. Set it to 0 for brutal honesty.
  knowledgeFloor: 88,

  // What the door says at the end, based on score out of 10.
  verdicts: [
    { under: 4,  text: "DOOR: 'Nice try. Come back when you've been paying attention.' (It opens anyway. She's soft.)" },
    { under: 7,  text: "DOOR: 'Good enough. She likes you, which is doing a lot of the work here.'" },
    { under: 10, text: "DOOR: 'That's her. You got her.'" },
    { under: 99, text: "DOOR: 'Ten out of ten. Frankly, unsettling. Come in.'" }
  ],

  // ---- FINAL CUTSCENE ----
  cutscene: [
    "You spent the entire game trying to figure me out.",
    "My work.",
    "My chaos.",
    "My stupid ideas.",
    "My dreams.",
    "My random 2 AM thoughts.",
    "My obsession with automating everything.",
    "My food.",
    "My ambitions.",
    "My life.",
    "But there was one thing you were supposed to discover."
  ],
  cutsceneSystem: [
    "QUEST COMPLETE.",
    "You weren't supposed to understand everything.",
    "You were just supposed to stay."
  ],
  finalBanner: "PLAYER 2 HAS ENTERED RITHVIKA'S WORLD.",
  continueLabel: "CONTINUE?",
  continueButtons: ["YES ❤", "YES ❤", "YES ❤"],
  end: ["GAME COMPLETE.", "BUT THE STORY CONTINUES..."],
  // The last thing on screen. Make this yours.
  signoff: "[INSERT YOUR OWN LAST LINE HERE]  —  happy birthday, {NICKNAME}."
},


/* ============================================================
   11. RANDOM EVENTS — fire while wandering any world
   ============================================================ */

randomEvents: [
  { title:"NEW IDEA DETECTED",
    text:"RITHVIKA HAS DISCOVERED A NEW PROJECT IDEA.",
    options:[
      { label:"IGNORE", result:"Idea minimised. It is still running in the background. It will return at 2 AM.", xp:0 },
      { label:"FOLLOW THE RABBIT HOLE",
        result:"3 HOURS LATER...\n\nRITHVIKA IS NOW RESEARCHING SOMETHING COMPLETELY UNRELATED.\n\nOriginal idea: untouched. Knowledge: expanded. Dinner: forgotten.", xp:50 }
    ]},

  { title:"AUTOMATION OPPORTUNITY",
    text:"RITHVIKA HAS DECIDED TO AUTOMATE SOMETHING THAT WOULD HAVE TAKEN 4 MINUTES.\n\nESTIMATED AUTOMATION TIME: 6 HOURS.",
    options:[
      { label:"TALK HER OUT OF IT", result:"You tried. She said 'but what if I need it again'. She was already typing.", xp:0 },
      { label:"LET HER COOK", result:"6 hours later: it works. It has a config file. It has a README.\n\n...worth it.", xp:75 }
    ]},

  { title:"TAB OVERFLOW",
    text:"47 TABS OPEN. BROWSER IS BEGGING.",
    options:[
      { label:"CLOSE SOME TABS", result:"You closed six tabs. Two were important. She has already reopened them.", xp:0 },
      { label:"OPEN ONE MORE", result:"Tab 48 opened. System stability: unchanged. Somehow.", xp:40 }
    ]},

  { title:"2 AM PROTOCOL",
    text:"IT IS 2:07 AM. RITHVIKA IS AWAKE AND HER BRAIN HAS AN ANNOUNCEMENT.",
    options:[
      { label:"TELL HER TO SLEEP", result:"She said 'five more minutes' in a tone that means forty.", xp:0 },
      { label:"ASK WHAT THE IDEA IS", result:"She explained it for eleven minutes without breathing.\n\nYou understood 30%. She felt completely seen.", xp:100 }
    ]},

  { title:"COLD TEA EVENT",
    text:"A CUP OF TEA HAS REACHED ROOM TEMPERATURE. AGAIN.",
    options:[
      { label:"REHEAT IT", result:"Reheated. It will go cold again in nine minutes. This is a loop.", xp:25 },
      { label:"MAKE A FRESH ONE", result:"She noticed. She didn't say anything. She noticed.", xp:60 }
    ]}
],

// Fake system errors that pop up for flavour.
fakeErrors: [
  { title:"RITHVIKA.EXE", text:"Sleep schedule not found.\n\n(Retry / Ignore / Ignore)" },
  { title:"MEMORY", text:"Cannot allocate more ideas. Existing ideas refuse to close." },
  { title:"CONFIDENCE.DLL", text:"CONFIDENCE.DLL is missing.\n\nDon't worry, she has a workaround." },
  { title:"TASK MANAGER", text:"'overthinking.exe' is not responding.\n\nEnd task? (It'll restart.)" },
  { title:"DISK", text:"Drive C: is 91% full of half-finished projects. Cleanup postponed." }
]

};

/* make it available everywhere */
window.GAME_DATA = GAME_DATA;
