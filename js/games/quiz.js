/* How Well Do You Know Us? — a multiple-choice quiz about the two of you. */

(function () {
  "use strict";

  const { $, sfx, confetti, messageFor } = window.APP;

  const dotsEl    = $("quizDots");
  const cardEl    = $("quizCard");
  const countEl   = $("quizCount");
  const qEl       = $("quizQ");
  const optionsEl = $("quizOptions");
  const noteEl    = $("quizNote");
  const noteText  = $("quizNoteText");
  const noteIcon  = $("noteIcon");
  const nextBtn   = $("quizNext");
  const resultEl  = $("quizResult");
  const scoreEl   = $("quizScore");

  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  let deck = [];
  let index = 0;
  let score = 0;
  let answered = false;

  function shuffle(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function buildDots() {
    dotsEl.textContent = "";
    deck.forEach(() => dotsEl.appendChild(document.createElement("i")));
    markDots();
  }

  function markDots() {
    [...dotsEl.children].forEach((dot, i) => {
      dot.classList.toggle("is-now", i === index);
    });
  }

  function start() {
    deck = shuffle(DATA.quiz);
    index = 0;
    score = 0;
    scoreEl.textContent = "0";
    resultEl.classList.add("is-hidden");
    cardEl.classList.remove("is-hidden");
    buildDots();
    renderQuestion();
  }

  function renderQuestion() {
    const item = deck[index];
    answered = false;

    countEl.textContent = "Question " + (index + 1) + " of " + deck.length;
    qEl.textContent = item.q;
    noteEl.hidden = true;
    noteText.textContent = "";
    nextBtn.classList.add("is-hidden");
    nextBtn.textContent = index === deck.length - 1 ? "See my score" : "Next";

    optionsEl.textContent = "";
    item.options.forEach((label, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.dataset.letter = LETTERS[i] || "?";
      btn.addEventListener("click", () => choose(i, btn));
      optionsEl.appendChild(btn);
    });

    markDots();
  }

  function choose(picked, btn) {
    if (answered) return;
    answered = true;

    const item = deck[index];
    const correct = picked === item.answer;
    const buttons = [...optionsEl.children];

    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add("is-right");
    });
    if (!correct) btn.classList.add("is-wrong");

    const dot = dotsEl.children[index];
    if (dot) dot.classList.add(correct ? "is-right" : "is-wrong");

    if (correct) {
      score++;
      scoreEl.textContent = score;
      sfx.good();
      const box = btn.getBoundingClientRect();
      confetti(28, box.left + box.width / 2, box.top + box.height / 2);
    } else {
      sfx.bad();
    }

    if (item.note) {
      noteText.textContent = item.note;
      noteIcon.setAttribute("href", correct ? "#ico-heart" : "#ico-heart-broken");
      noteEl.classList.toggle("is-wrong", !correct);
      noteEl.hidden = false;
    }
    nextBtn.classList.remove("is-hidden");
  }

  nextBtn.addEventListener("click", () => {
    sfx.pop();
    if (index < deck.length - 1) {
      index++;
      renderQuestion();
    } else {
      finish();
    }
  });

  function finish() {
    const total = deck.length;
    const pct = total ? (score / total) * 100 : 0;

    $("quizFinal").textContent = score;
    $("quizTotal").textContent = total;
    $("quizMsg").textContent = messageFor(DATA.quizMessages, pct);

    cardEl.classList.add("is-hidden");
    resultEl.classList.remove("is-hidden");

    markDots();
    if (pct >= 70) { sfx.cheer(); confetti(120); }
  }

  $("quizAgain").addEventListener("click", start);

  /* fresh shuffle every time he opens the quiz, unless mid-game */
  let touched = false;
  window.APP.on("enter", "quiz", () => {
    if (!touched) { touched = true; start(); }
  });
})();
