/* ============================================================
   grocery.js — WORLD 3: GROCERY.EXE
   Fill her basket. One shelf is a trap.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const S = window.RX.scenes = window.RX.scenes || {};
  const G = () => D.grocery;

  S.grocery = {
    enter() {
      const P = st.S.progress.grocery;
      st.S.world = "grocery";
      ui.setTitle("GROCERY.EXE — aisle 3");
      ui.setWorld("GROCERY");
      ui.setHint("Pick what she'd actually buy. Then pay at the counter.");
      ui.showSanity(false);
      au.music("grocery");

      let busy = false;

      /* lay the items out along the three shelves */
      const rows = [44, 78, 112];
      const perRow = Math.ceil(G().items.length / rows.length);
      const hotspots = G().items.map((it, i) => {
        const r = Math.floor(i / perRow);
        const col = i % perRow;
        const step = (300 - 26) / Math.max(1, perRow - 1);
        return {
          id: it.id, sprite: it.sprite, label: it.label,
          x: Math.round(26 + col * step), y: rows[Math.min(r, rows.length - 1)],
          scale: 2,
          done: P.basket.indexOf(it.id) !== -1,
          onInteract: () => grab(it)
        };
      });

      hotspots.push({
        id: "checkout", sprite: "basket", label: "CHECKOUT", x: 22, y: 152, scale: 2.4, bob: true,
        onInteract: () => checkout()
      });

      const w = world.create({
        scene: "store",
        outfit: "grocery",
        spawn: { x: 170, y: 164 },
        band: { top: 138, bottom: 172 },
        spriteScale: 2,
        onStep: () => { if (!busy) ui.maybeEvent(120); },
        hotspots: hotspots
      });

      const p = ui.clearPanel();
      const mission = ui.box("sunken", "");
      p.appendChild(mission);
      paintMission();

      function paintMission() {
        mission.innerHTML =
          '<div class="q-title">MISSION: ' + ui.esc(G().mission) + "</div>" +
          '<div class="q-sub">Basket: <b>' + P.basket.length + " / " + G().needed + "</b>" +
          (P.basket.length >= G().needed ? " — go pay, you've earned it." : "") +
          (P.almondHit ? '  ·  <span style="color:#a00">almond incident: logged forever</span>' : "") + "</div>" +
          '<div class="pillbar">' +
          P.basket.map(id => '<span class="pill on">' + ui.esc(label(id)) + "</span>").join("") +
          P.rejected.map(id => '<span class="pill bad">' + ui.esc(label(id)) + " ✕</span>").join("") +
          "</div>";
      }

      function label(id) {
        const it = G().items.filter(x => x.id === id)[0];
        return it ? it.label : id;
      }

      /* ---- picking something up ---- */
      function grab(it) {
        if (busy) return;

        if (it.trap) {
          ui.flash();
          au.sfx.error();
          st.S.progress.grocery.almondHit = true;
          st.addKnow(-8);
          st.penalty(50);
          ui.hud();
          paintMission();
          busy = true;
          ui.modal({
            title: "ERROR",
            html: '<span class="errico" style="display:inline-grid;vertical-align:middle">✕</span> <b>ERROR.</b><br><br>' +
                  ui.esc(ui.txt(G().trap.error)) + "<br>" + ui.esc(ui.txt(G().trap.detail)) +
                  "<br><br>BOYFRIEND KNOWLEDGE <b>-" + G().trap.penalty + "</b>",
            buttons: [{ label: "PUT IT BACK", cls: "bad" }],
            sound: false
          });
          ui.dialogue(G().trap.lines, () => { busy = false; });
          return;
        }

        if (P.basket.indexOf(it.id) !== -1) {
          ui.toast("ALREADY IN THE BASKET", it.label);
          return;
        }

        if (it.buy) {
          st.push("grocery", "basket", it.id);
          st.answer(true);
          st.addXp(D.xp.grocery);
          ui.xpToast(D.xp.grocery);
          w.setDone(it.id, true);
          const hs = hotspots.filter(h => h.id === it.id)[0];
          if (hs) w.sparkle(hs.x, hs.y);
          au.sfx.select();
          ui.toast("IN THE BASKET: " + it.label, it.note);
          paintMission();
          ui.hud();
          if (P.basket.length >= G().needed) {
            ui.toast("BASKET READY", "The counter is by the door.", "warn");
          }
        } else {
          if (P.rejected.indexOf(it.id) === -1) {
            st.push("grocery", "rejected", it.id);
            st.answer(false);
            st.penalty();
          }
          au.sfx.wrong();
          ui.toast("SHE WOULDN'T", it.note, "err");
          paintMission();
          ui.hud();
        }
      }

      /* ---- checkout ---- */
      function checkout() {
        if (busy) return;
        if (P.done) { window.RX.game.go("hub"); return; }
        if (P.basket.length < G().needed) {
          busy = true;
          ui.dialogue([
            { who: "SYSTEM", text: "Basket contains " + P.basket.length + " item(s). Required: " + G().needed + "." },
            { who: D.character.name, text: "That's not a week of food, that's a snack." }
          ], () => { busy = false; });
          return;
        }
        busy = true;
        st.addXp(D.xp.basket);
        ui.xpToast(D.xp.basket);
        if (!P.almondHit) {
          st.addXp(D.xp.almondDodge);
          ui.xpToast(D.xp.almondDodge);
          ui.toast("ALMOND TRAP AVOIDED", "He knows. He actually knows.");
        }
        au.sfx.big();
        ui.dialogue([
          { who: "SYSTEM", text: "SCANNING BASKET..." },
          { who: "SYSTEM", text: P.basket.map(label).join(", ") + "." },
          { who: D.character.name, text: P.almondHit
              ? "Good basket. We're still talking about the almonds later."
              : "...you didn't even go near the almonds. Okay. Respect." }
        ], () => {
          window.RX.game.series(G().quiz, "grocery", () => finish());
        });
      }

      function finish() {
        st.flagDone("grocery", "done", true);
        st.unlockWorld("city");
        au.sfx.level();
        ui.dialogue(G().outro.concat([{ who: "SYSTEM", text: "THE_REAL_RITHVIKA.MAP unlocked." }]),
          () => window.RX.game.go("hub"));
        paintMission();
      }

      /* ---- entry state ---- */
      if (P.done) {
        ui.dialogue([{ who: "SYSTEM", text: "Shopping already done. The fridge is, briefly, full." }], () => {});
        const row = ui.el("div", "row end");
        const b = ui.el("button", "btn", "BACK TO DISK ▶");
        b.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
        row.appendChild(b);
        p.appendChild(row);
      } else if (!st.S.seenIntro.grocery) {
        st.S.seenIntro.grocery = true; st.save();
        ui.dialogue(G().intro, () => {});
      }
    }
  };
})();
