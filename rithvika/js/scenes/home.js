/* ============================================================
   home.js — WORLD 1: HOME.EXE
   Poke everything in her room, then prove you were paying attention.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const S = window.RX.scenes = window.RX.scenes || {};

  S.home = {
    enter() {
      const P = st.S.progress.home;
      P.clicks = P.clicks || {};
      st.S.world = "home";
      ui.setTitle("HOME.EXE — /home/rithvika");
      ui.setWorld("HOME.EXE");
      ui.setHint("Walk around. Touch everything. E or tap to interact.");
      ui.showSanity(false);
      au.music("home");

      let busy = false;
      let quizRunning = false;

      const w = world.create({
        scene: "home",
        outfit: "home",
        spawn: { x: 160, y: 162 },
        band: { top: 146, bottom: 172 },
        spriteScale: 2,
        onStep: () => { if (!busy && !quizRunning) ui.maybeEvent(90); },
        hotspots: D.home.objects.map(o => ({
          id: o.id, x: o.x, y: o.y, sprite: o.sprite, label: o.label,
          scale: o.id === "mirror" ? 3 : 2,
          done: P.objects.indexOf(o.id) !== -1,
          onInteract: (rec) => poke(o, rec)
        }))
      });

      /* ---- mission panel ---- */
      const p = ui.clearPanel();
      const mission = ui.box("sunken", "");
      p.appendChild(mission);
      paintMission();

      function paintMission() {
        const n = P.objects.length, need = D.home.objectsNeeded;
        mission.innerHTML =
          '<div class="q-title">MISSION: ' + ui.esc(D.home.mission) + "</div>" +
          '<div class="q-sub">Objects investigated: <b>' + n + " / " + need + "</b>" +
          (n >= need ? " — enough. She's impressed and slightly worried." : "") + "</div>" +
          '<div class="pillbar">' + D.home.objects.map(o =>
            '<span class="pill' + (P.objects.indexOf(o.id) !== -1 ? " on" : "") + '">' + ui.esc(o.label) + "</span>"
          ).join("") + "</div>";
      }

      /* ---- interacting with an object ---- */
      function poke(o, rec) {
        if (busy || quizRunning) return;
        const idx = P.clicks[o.id] || 0;
        const lines = o.lines[Math.min(idx, o.lines.length - 1)];
        P.clicks[o.id] = idx + 1;

        const isNew = st.push("home", "objects", o.id);
        if (isNew) {
          st.addXp(D.xp.object);
          ui.xpToast(D.xp.object);
          w.setDone(o.id, true);
          w.sparkle(o.x, o.y - 12);
          paintMission();
        }
        st.save();

        busy = true;
        ui.dialogue(lines, () => {
          busy = false;
          if (P.objects.length >= D.home.objectsNeeded && !P.quizStarted) startQuiz();
        });
      }

      /* ---- the personality quiz ---- */
      function startQuiz() {
        P.quizStarted = true;
        st.save();
        quizRunning = true;
        ui.dialogue([
          { who: "SYSTEM", text: "SCAN COMPLETE. You've seen the room." },
          { who: "SYSTEM", text: "Now the real test: do you know how she runs?" },
          { who: "RITHVIKA", text: "Be honest. I'll know if you're guessing." }
        ], () => {
          window.RX.game.series(D.home.quiz, "personality", (score) => {
            quizRunning = false;
            finish(score);
          });
        });
      }

      function finish(score) {
        st.flagDone("home", "quiz", D.home.quiz.length);
        st.flagDone("home", "done", true);
        st.unlockWorld("office");
        au.sfx.level();
        ui.dialogue(D.home.outro.concat([
          { who: "SYSTEM", text: "HOME.EXE complete. Score: " + score + "/" + D.home.quiz.length +
              ". CORPORATE.DIMENSION unlocked." }
        ]), () => window.RX.game.go("hub"));
        paintMission();
      }

      /* already finished? let him wander and re-read everything */
      if (P.done) {
        ui.dialogue([{ who: "SYSTEM", text: "HOME.EXE already scanned. Feel free to snoop again." }], () => {});
        const row = ui.el("div", "row end");
        const b = ui.el("button", "btn", "BACK TO DISK ▶");
        b.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
        row.appendChild(b);
        p.appendChild(row);
      } else if (!st.S.seenIntro.home) {
        st.S.seenIntro.home = true; st.save();
        ui.dialogue(D.home.intro, () => {
          if (P.objects.length >= D.home.objectsNeeded && !P.quizStarted) startQuiz();
        });
      } else if (P.objects.length >= D.home.objectsNeeded && !P.quizStarted) {
        // came back with enough objects already poked: go straight to the quiz
        startQuiz();
      }
    }
  };
})();
