# Happy Birthday 🎂

A little birthday website: blow out the candle, then play two games about the two of you.

## How to change the words

**You only ever need to edit one file: [`js/data.js`](js/data.js).**

Open it in any text editor. Everything personal is in there, marked with
`← CHANGE THIS`:

| What | Where in the file |
|---|---|
| His name / pet name | `name` |
| The big HAPPY BIRTHDAY heading | `titleLine1`, `titleLine2` |
| Your letter on the home screen | `hubMessage`, `signature` |
| The quiz questions and answers | `quiz` |
| End-of-game messages | `catchMessages`, `quizMessages` |

### Adding a quiz question

Copy one of the existing blocks and change it:

```js
{
  q: "Your question here?",
  options: ["First choice", "Second", "Third", "Fourth"],
  answer: 1,                  // 0 = first choice, 1 = second, 2 = third, 3 = fourth
  note: "The sweet memory shown after he answers."
},
```

Keep the commas between blocks. You can have as many questions as you like.

## Running it on your computer

The microphone (blowing out the candle) only works over `http`/`https`, not by
double-clicking the file. So run a tiny local server:

```bash
cd birthday
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

(Double-clicking `index.html` still works — everything runs, he just taps the
flame instead of blowing.)

## Putting it online

**GitHub Pages** (free, gives an https link so the mic works):

1. Push this folder to a GitHub repo.
2. Repo → **Settings** → **Pages**.
3. Source: *Deploy from a branch* → branch `main`, folder `/ (root)` → **Save**.
4. Wait a minute; your link appears at the top of that page.

**Netlify** is the no-GitHub option: go to <https://app.netlify.com/drop> and drag
this whole folder onto the page.

## What's inside

```
index.html          the whole page
css/style.css       all the styling
js/data.js          ★ your words
js/hub.js           screen switching, confetti, sound
js/candle.js        the cake and the microphone
js/games/catch.js   Catch My Hearts
js/games/quiz.js    How Well Do You Know Us?
```

No build step, no dependencies.
