/* ============================================================
   city.js — WORLD 4: THE REAL RITHVIKA
   Eight places. A clue in each. Then a question you can't guess.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const S = window.RX.scenes = window.RX.scenes || {};
  const C = () => D.city;

  S.city = {
    enter() {
      const P = st.S.progress.city;
      st.S.world = "city";
      ui.setTitle("THE_REAL_RITHVIKA.MAP");
      ui.setWorld("CITY MAP");
      ui.setHint("Walk to a building and press E (or tap it) to go in.");
      ui.showSanity(false);
      au.music("city");

      let busy = false;

      const w = world.create({
        scene: "city",
        outfit: "city",
        spawn: { x: 160, y: 158 },
        band: { top: 134, bottom: 172 },
        spriteScale: 2.4,
        reach: 60,
        onStep: () => { if (!busy) ui.maybeEvent(130); },
        hotspots: C().locations.map(L => ({
          id: L.id, x: L.x, y: L.y, sprite: L.sprite, label: L.label, scale: 2.4,
          done: P.answered.indexOf(L.id) !== -1,
          onInteract: () => visit(L)
        }))
      });

      const p = ui.clearPanel();
      const mission = ui.box("sunken", "");
      p.appendChild(mission);
      paintMission();

      function paintMission() {
        mission.innerHTML =
          '<div class="q-title">MISSION: ' + ui.esc(C().mission) + "</div>" +
          '<div class="q-sub">Locations understood: <b>' + P.answered.length + " / " + C().locations.length + "</b></div>" +
          '<div class="pillbar">' + C().locations.map(L =>
            '<span class="pill' + (P.answered.indexOf(L.id) !== -1 ? " on" : "") + '">' + ui.esc(L.label) + "</span>"
          ).join("") + "</div>";
      }

      function visit(L) {
        if (busy) return;
        if (P.answered.indexOf(L.id) !== -1) {
          busy = true;
          ui.dialogue([{ who: "SYSTEM", text: ui.txt(L.clue) }], () => { busy = false; });
          return;
        }
        busy = true;
        const firstClue = st.push("city", "clues", L.id);
        if (firstClue) { st.addXp(D.xp.clue); ui.xpToast(D.xp.clue); w.sparkle(L.x, L.y); }
        ui.dialogue([
          { who: "SYSTEM", text: "ENTERING: " + ui.txt(L.label) },
          { who: "SYSTEM", text: ui.txt(L.clue) }
        ], () => {
          ui.ask(L.q, {
            title: ui.txt(L.label),
            xpKey: "cityAnswer",
            onDone: () => {
              st.push("city", "answered", L.id);
              w.setDone(L.id, true);
              paintMission();
              busy = false;
              if (P.answered.length >= C().locations.length) finish();
            }
          });
        });
      }

      function finish() {
        st.flagDone("city", "done", true);
        st.unlockWorld("mind");
        au.sfx.level();
        ui.dialogue(C().outro.concat([{ who: "SYSTEM", text: "MIND.SYS unlocked. Tread carefully." }]),
          () => window.RX.game.go("hub"));
        paintMission();
      }

      if (P.done) {
        ui.dialogue([{ who: "SYSTEM", text: "Map fully explored. You can still wander — she likes the company." }], () => {});
        const row = ui.el("div", "row end");
        const b = ui.el("button", "btn", "BACK TO DISK ▶");
        b.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
        row.appendChild(b);
        p.appendChild(row);
      } else if (!st.S.seenIntro.city) {
        st.S.seenIntro.city = true; st.save();
        ui.dialogue(C().intro, () => {});
      }
    }
  };
})();
