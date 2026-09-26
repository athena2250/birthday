# RITHVIKA.EXE — The Quest to Unlock Her Heart

A playable late-90s-PC-game about understanding Rithvika. Six worlds, an XP
system, unlockable memories, a boss made of paperwork, and one almond-related
incident.

No build step, no dependencies, no accounts. Plain HTML + CSS + JS.

## Running it

```bash
cd birthday/rithvika
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Double-clicking `index.html` also works — everything runs offline (all sound is
generated in the browser, all art is drawn in code). A local server is just
nicer because the save file (localStorage) sticks properly.

Putting it online: drag the `rithvika` folder onto <https://app.netlify.com/drop>,
or commit it and turn on GitHub Pages.

## ★ The only file you edit: `js/gameData.js`

Everything personal is in there, in numbered sections:

| Section | What you can change |
|---|---|
| 1. Who is playing | his name, her name, job, company |
| 2. XP + levels | every reward amount, the funny XP banners, knowledge statuses |
| 3. Memory unlocks | what unlocks at which level, and the photos/voice notes |
| 4. Boot + intro | the BIOS text, the title screen, the opening dialogue |
| 5. HOME.EXE | every object in her room and what it says (clicking twice shows the next line) |
| 6. Corporate dimension | office objects, colleagues, their tasks, the pipeline puzzle, the boss |
| 7. GROCERY.EXE | the shelves, what she'd buy, and the almond trap |
| 8. The real Rithvika | the eight city locations, their clues and questions |
| 9. Her mind | the concept pairs to connect |
| 10. Level 99 | the ten final questions and the whole closing cutscene |
| 11. Random events | the pop-ups that fire while wandering |

Rules of thumb:

- `answer: 2` means the **third** option is correct (counting starts at 0).
- Anything written like `[INSERT MEMORY HERE]` shows up highlighted in yellow in
  the game, so placeholders are easy to spot and replace.
- `sprite: "laptop"` picks the pixel art. The full list of sprite names is at the
  top of `js/pixel.js` — reuse any of them.
- `x` / `y` on an object is its **centre**, on a 320 × 180 grid (the stage is
  always that size and is scaled up to fit the screen).

### Adding a memory with a real photo

1. Put `us.jpg` in `rithvika/media/`.
2. In section 3 of `gameData.js`:

```js
{ level: 20, kind: "photo", title: "MEMORY UNLOCKED",
  label: "the night at the terrace", caption: "Remember this?",
  media: "media/us.jpg" },
```

Voice notes work the same way with an `.mp3` — the pop-up gets a play button.

## How to play

- **Move**: arrow keys / WASD, the on-screen pad, or tap the floor.
- **Interact**: `E`, tap an object, or the round button.
- **Dialogue**: click the box or press space.
- **Answers**: click, or press `A` / `B` / `C` / `D`.
- It saves constantly. The floppy button saves too, because it feels better.

Worlds unlock in order: HOME → OFFICE → GROCERY → CITY MAP → MIND → LEVEL 99.
Memories unlock automatically as levels go up (archive lives in the
*Rithvika* menu).

## What's inside

```
index.html              the whole game shell (Win95 window, HUD, stage)
css/rithvika.css        all the styling: Win95 chrome, CRT, pixel stage
js/gameData.js          ★ everything personal
js/pixel.js             sprites, the Rithvika character, scene backdrops
js/audio.js             Web Audio sound effects + MIDI-ish loops per world
js/state.js             one state object, XP/levels/knowledge, save + load
js/ui.js                dialogue, questions, modals, memories, toasts, loading
js/world.js             the walk-around engine (320×180 stage, hotspots)
js/scenes/boot.js       BIOS, title, save file, intro, world select
js/scenes/home.js       World 1
js/scenes/office.js     World 2 + pipeline puzzle + THE BORING REPORT
js/scenes/grocery.js    World 3
js/scenes/city.js       World 4
js/scenes/mind.js       World 5
js/scenes/finale.js     Level 99 + the final cutscene
js/game.js              scene router, menus, save button, wiring
media/                  your photos and voice notes go here
```

Nothing in `js/` outside `gameData.js` needs to change to make the game yours.
