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
  ]
};
