/* ============================================================
   ★ THIS IS THE ONLY FILE YOU NEED TO EDIT ★

   Everything personal lives here: his name, your messages, and
   the quiz questions. Change the text between the quotes.
   Don't remove the quotes, commas or brackets.
   ============================================================ */

const DATA = {

  /* ---- 1. WHO IS THIS FOR ------------------------------- */

  name: "Monish",

  // Small line above the big heading.
  kicker: "Happy Birthday",

  // The two lines of the big heading on the cake screen.
  titleLine1: "HAPPY BIRTHDAY",
  titleLine2: "MONISH",

  // Instruction under the heading, before he blows the candle.
  cakePrompt: "Make a wish, Monish, then blow out the candle.",

  // Shown right after the candle goes out.
  cakeDone: "Wish made. Now come play with me.",


  /* ---- 2. YOUR MESSAGE ON THE HOME SCREEN --------------- */

  hubTitle1: "IT'S YOUR",
  hubTitle2: "DAY, MONISH",

  // The letter in the white card. Write whatever you want here.
  hubMessage:
    "I didn't want to just send you photos, so I built you a whole little world instead — " +
    "you already know I can't help myself. Two games, both about us, and you can come back " +
    "and play them any time you miss me. Happy birthday, Moni. 25th suits us.",

  signature: "— your Rithu, always",


  /* ---- 3. GAME CARD LABELS ------------------------------- */

  catchTitle: "Catch My Hearts",
  catchBlurb: "I'm throwing my heart at you. Try not to drop it.",

  quizTitle: "How Well Do You Know Us?",
  quizBlurb: "Twelve questions, Moni. No pressure. (There is pressure.)",


  /* ---- 4. END-OF-GAME MESSAGES: CATCH THE HEARTS ---------
     Shown based on his score, lowest first.
     "under" = show this message if his score is below that number. */

  catchMessages: [
    { under: 100,      text: "Butterfingers. Good thing I'm not going anywhere." },
    { under: 300,      text: "Not bad! You caught a decent amount of my love." },
    { under: 600,      text: "Okay show-off. You're really good at catching hearts — you caught mine." },
    { under: Infinity, text: "Absolute legend. My heart is officially safe with you." }
  ],

  /* Shown instead of the messages above if he catches the overthinking cloud —
     the one thing that ends the game instantly, no matter how well he's doing. */
  catchCloudMessage:
    "You caught the overthinking again, Moni. Put it down, breathe, and play again. " +
    "I'm right here.",


  /* ---- 5. THE QUIZ ---------------------------------------
     For each question:
       q       = the question
       options = the four choices he picks from
       answer  = which one is right (0 = first, 1 = second, 2 = third, 3 = fourth)
       note    = the sweet little memory shown after he answers
     ------------------------------------------------------- */

  quiz: [
    {
      q: "How did we actually start talking?",
      options: [
        "That awkward class where we had to sit together",
        "The group project — online, obviously",
        "You messaged me first out of nowhere",
        "Someone in the group introduced us"
      ],
      answer: 1,
      note: "We sat next to each other in class way before that and said almost nothing. Look at us now."
    },
    {
      q: "What do our birthdays have in common?",
      options: [
        "Same month",
        "Both on the 25th",
        "Exactly six months apart",
        "Nothing, it's a coincidence"
      ],
      answer: 1,
      note: "25th September and 25th October. Someone planned this before we did."
    },
    {
      q: "What was the order of our first date?",
      options: [
        "Ramen, then the beach, then the game cafe",
        "Game cafe, then ramen, then the beach",
        "Beach, then game cafe, then ramen",
        "We just walked around all day"
      ],
      answer: 1,
      note: "Games, then food, then the sea. I'd repeat that exact day any time."
    },
    {
      q: "What was the first movie we watched together?",
      options: [
        "Django Unchained",
        "Something neither of us finished",
        "A horror one you picked",
        "Interstellar"
      ],
      answer: 0,
      note: "Django Unchained. Of all the movies in the world, that's the one that's ours now."
    },
    {
      q: "What's our song?",
      options: [
        "The one from the car",
        "We don't have one — our tastes are nothing alike",
        "The one you always send me",
        "The one I hate and you love"
      ],
      answer: 1,
      note: "Zero overlap in music taste and somehow still this much overlap in everything else."
    },
    {
      q: "What's your most annoying habit?",
      options: [
        "Tickling me until I can't breathe",
        "Annoying me on purpose just to see my reaction",
        "Both. Always both.",
        "Overthinking everything"
      ],
      answer: 2,
      note: "Poor me. Genuinely, poor me."
    },
    {
      q: "What do you always order in the college cafeteria?",
      options: [
        "Chicken sandwich",
        "Whatever I'm having",
        "Something spicy",
        "Coffee and nothing else"
      ],
      answer: 0,
      note: "Because it's the only edible thing in that entire cafeteria and we both know it."
    },
    {
      q: "What do you do when I've had a bad day?",
      options: [
        "Just listen to me, for as long as I need",
        "Try to fix it immediately",
        "Send me memes until I laugh",
        "Change the subject"
      ],
      answer: 0,
      note: "You just let me talk. You have no idea how much that fixes."
    },
    {
      q: "What happened when you came all the way to Bangalore for me?",
      options: [
        "We just went shopping",
        "You proposed to me",
        "You met my friends",
        "We stayed in the whole time"
      ],
      answer: 1,
      note: "You took me out and you proposed. Still the sweetest thing anyone has ever done for me."
    },
    {
      q: "Which hand gesture have we both completely overused?",
      options: [
        "\"Poor you\"",
        "A thumbs up",
        "The fake salute",
        "We don't have one"
      ],
      answer: 0,
      note: "Oversaturated. Ruined. Still doing it."
    },
    {
      q: "What can I talk about for hours without stopping?",
      options: [
        "Food",
        "Building products and new ideas to make life easier for people",
        "My friends",
        "College drama"
      ],
      answer: 1,
      note: "You never once told me to stop. You just ask more questions."
    },
    {
      q: "What do I love most about you?",
      options: [
        "How patiently you listen to me",
        "That you actually open up about your feelings now",
        "Your face",
        "The first two. Both of them."
      ],
      answer: 3,
      note: "You've become so cute lately, the way you act. Now if you could overthink a little less, Moni."
    }
  ],


  /* ---- 6. END-OF-GAME MESSAGES: QUIZ ---------------------
     "under" = show if his percentage is below that number. */

  quizMessages: [
    { under: 40,       text: "Moni. We need to talk. Lovingly. Over ramen." },
    { under: 70,       text: "You got the important ones right, so I'll let it slide." },
    { under: 100,      text: "So close! You really do pay attention to me." },
    { under: Infinity, text: "Perfect score. You know me better than anyone. I knew it, Moni." }
  ],


  /* ---- 7. A DAY WITH ME ----------------------------------
     Three little scenes. In each one I'm looking for four things,
     and he taps them for me. Everything else in the room is a decoy
     — tapping one just costs a few seconds and gets a line out of me.

     For every object:
       id    = which drawing to use (the list of drawings lives in
               index.html, look for "scene item sprites")
       label = how it shows up on my checklist
       x, y  = where it sits in the room, as a percentage across
               and down. 50/50 is dead centre.
       line  = what I say when he taps it
     ------------------------------------------------------- */

  // The fourth card: it opens the whole other game in rithvika/
  exeTitle: "RITHVIKA.EXE",
  exeBlurb: "A whole 90s computer game about me. Warning: 37 unfinished ideas.",

  dayTitle: "A Day With Me",
  dayBlurb: "Help me get through my day and I'll dance for you at the end.",

  // Shown on the start card, before the first scene.
  dayIntro:
    "This is just a normal day for me. Find the things I'm looking for before " +
    "the clock runs out — and stay till the end, I made you something.",

  dayScenes: [
    {
      id: "home",
      name: "7:40 am — my room",
      intro: "I'm already late and I can't find anything. Help?",
      seconds: 45,
      tasks: [
        { id: "mug",     label: "my chai mug",      x: 75, y: 57, line: "Found it. Don't you dare count how many I own." },
        { id: "charger", label: "my phone charger", x: 30, y: 84, line: "Of course it was behind the bed. It's always behind the bed." },
        { id: "clip",    label: "my hair clip",     x: 70, y: 32, line: "My hair has been a whole situation this morning. Thank you." },
        { id: "plant",   label: "water my plant",   x: 88, y: 32, line: "She's called Basil and she missed you too." }
      ],
      decoys: [
        { id: "lamp",    x: 85, y: 55, line: "That's my lamp, Moni. Focus." },
        { id: "book",    x: 17, y: 65, line: "I'm three pages into that. Three. For a year." },
        { id: "pillow",  x: 26, y: 64, line: "Tempting. But if I lie down again I'm not leaving." },
        { id: "slipper", x: 11, y: 88, line: "One slipper. The other one is a mystery I've accepted." }
      ]
    },
    {
      id: "market",
      name: "12:15 pm — the corner store",
      intro: "Lunch run. I know exactly what I want, I just can't see it.",
      seconds: 45,
      tasks: [
        { id: "noodles", label: "instant noodles",       x: 16, y: 17, line: "The spicy ones. Obviously the spicy ones." },
        { id: "milk",    label: "banana milk",           x: 78, y: 30, line: "You laughed at me for this once. You were wrong." },
        { id: "icecream",label: "an ice cream",          x: 90, y: 55, line: "It's for after lunch. It's basically a food group." },
        { id: "chips",   label: "a snack for Monish",    x: 45, y: 37, line: "These are yours. I always get you a packet. Every time." }
      ],
      decoys: [
        { id: "soda",    x: 78, y: 55, line: "Too fizzy. I'd regret it in the meeting." },
        { id: "onion",   x: 30, y: 57, line: "I am not cooking today, Moni. Not today." },
        { id: "broom",   x: 64, y: 84, line: "That's the shop's broom. Put it back." },
        { id: "cat",     x: 14, y: 86, line: "That's the shop cat and she does NOT want to be picked up." }
      ]
    },
    {
      id: "office",
      name: "2:30 pm — my desk",
      intro: "Meeting in ten minutes and my desk is in its usual state.",
      seconds: 45,
      tasks: [
        { id: "laptop",  label: "my laptop",        x: 35, y: 59, line: "Forty tabs open. All of them important. Allegedly." },
        { id: "badge",   label: "my office badge",  x: 20, y: 61, line: "The photo on this is criminal and you know it." },
        { id: "coffee",  label: "a coffee, please", x: 62, y: 59, line: "Third one. Don't start with me." },
        { id: "note",    label: "my sticky note",   x: 72, y: 27, line: "It just says 'call Moni'. That was the whole list." }
      ],
      decoys: [
        { id: "printer", x: 8, y: 58, line: "That printer has never once worked on the first try." },
        { id: "stapler", x: 88, y: 60, line: "Not the stapler. Though I do love a good stapler." },
        { id: "deskplant", x: 14, y: 85, line: "That one's plastic. I killed the real one in a week." },
        { id: "phone",   x: 76, y: 60, line: "If I pick that up I'll get pulled into another call." }
      ]
    }
  ],

  // What I say when he taps something that isn't on my list.
  dayWrongLines: [
    "Not that one, Moni.",
    "Close! But no.",
    "You're not even looking, are you.",
    "That's not it, but I appreciate the confidence.",
    "Moni. Read the list."
  ],

  // Shown when a scene is finished.
  dayScenePass: [
    "Okay, I can actually leave the house now. Come on.",
    "Lunch sorted. You're good at this.",
    "Meeting survived. One more thing before you go —"
  ],

  /* His score is out of 100 — how much of each scene he found, plus a
     bonus for the time he had left. "under" = show if he's below that. */
  dayMessages: [
    { under: 45,       text: "You took your time, but you stayed. That's the part I actually care about." },
    { under: 70,       text: "You got me through the day, Moni. Slightly chaotic, very us." },
    { under: 95,       text: "Okay, you're good at this. You really do know where all my things are." },
    { under: Infinity, text: "Perfect. You know my whole day by heart. I don't know why I'm surprised." }
  ],

  // The line over the dance at the very end.
  dayFinale: "You stayed till the end. So — this one's just for you, Moni."
};
