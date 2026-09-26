/* ============================================================
   office.js — WORLD 2: THE CORPORATE DIMENSION
   Office tasks → the broken pipeline → THE BORING REPORT (boss).
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const S = window.RX.scenes = window.RX.scenes || {};
  const O = () => D.office;

  S.office = {
    enter() {
      const P = st.S.progress.office;
      P.clicks = P.clicks || {};
      st.S.world = "office";
      ui.setTitle("CORPORATE.DIMENSION — " + D.character.company);
      ui.setWorld("OFFICE");
      ui.setHint("Talk to people (they will find you). E or tap to interact.");
      ui.showSanity(true);
      au.music("office");
      if (!P.done) st.S.sanity = Math.max(st.S.sanity, 40);
      ui.hud();

      let busy = false, stageLocked = false;

      const hotspots = [];
      O().objects.forEach(o => hotspots.push({
        id: o.id, x: o.x, y: o.y, sprite: o.sprite, label: o.label,
        scale: o.id === "clock" ? 2 : 2,
        done: P.objects.indexOf(o.id) !== -1,
        onInteract: () => pokeObject(o)
      }));
      O().npcs.forEach(n => hotspots.push({
        id: n.id, x: n.x, y: n.y, sprite: n.sprite, label: n.label, scale: 2, bob: true,
        done: P.npcs.indexOf(n.id) !== -1,
        onInteract: () => talkTo(n)
      }));

      const w = world.create({
        scene: "office",
        outfit: "office",
        spawn: { x: 160, y: 166 },
        band: { top: 140, bottom: 172 },
        spriteScale: 2,
        onStep: () => { if (!busy && !stageLocked) ui.maybeEvent(110); },
        hotspots: hotspots
      });

      const p = ui.clearPanel();
      const mission = ui.box("sunken", "");
      p.appendChild(mission);
      paintMission();

      function paintMission() {
        mission.innerHTML =
          '<div class="q-title">MISSION: ' + ui.esc(O().mission) + "</div>" +
          '<div class="q-sub">Tasks handled: <b>' + P.npcs.length + " / " + O().npcs.length +
          "</b>  ·  Pipeline: <b>" + (P.pipeline ? "RESTORED" : "BROKEN") +
          "</b>  ·  Boss: <b>" + (P.boss ? "AUTOMATED" : "ALIVE") + "</b></div>" +
          '<div class="pillbar">' + O().npcs.map(n =>
            '<span class="pill' + (P.npcs.indexOf(n.id) !== -1 ? " on" : "") + '">' + ui.esc(n.name) + "</span>"
          ).join("") + "</div>";
      }

      function sanityCheck() {
        ui.hud();
        if (st.S.sanity <= 0) {
          st.S.sanity = 30;
          ui.hud();
          ui.modal({
            title: "SANITY.SYS",
            html: "<b>SANITY DEPLETED.</b><br>Rithvika has walked to the coffee machine and stared at a wall for nine minutes.<br><br>Sanity partially restored. She's fine. She's <i>fine</i>.",
            buttons: [{ label: "BACK TO WORK" }]
          });
          au.sfx.error();
        }
      }

      /* ---- flavour objects ---- */
      function pokeObject(o) {
        if (busy || stageLocked) return;
        const idx = P.clicks[o.id] || 0;
        P.clicks[o.id] = idx + 1;
        if (st.push("office", "objects", o.id)) {
          st.addXp(D.xp.object); ui.xpToast(D.xp.object);
          w.setDone(o.id, true); w.sparkle(o.x, o.y - 10);
        }
        busy = true;
        ui.dialogue(o.lines[Math.min(idx, o.lines.length - 1)], () => { busy = false; });
      }

      /* ---- NPC tasks ---- */
      function talkTo(n) {
        if (busy || stageLocked) return;
        if (P.npcs.indexOf(n.id) !== -1) {
          busy = true;
          ui.dialogue([{ who: n.name, text: "Thanks again for sorting that. I'll definitely ask you again next week." }],
            () => { busy = false; });
          return;
        }
        busy = true;
        st.setSanity(n.sanity || -8);
        sanityCheck();
        ui.dialogue(n.open, () => {
          ui.ask(n.q, {
            title: "WHAT DOES RITHVIKA ACTUALLY DO?",
            xpKey: n.q.xpKey || "office",
            onDone: (ok) => {
              if (ok) {
                st.setSanity(n.q.sanity || 12);
                ui.toast("SANITY +" + (n.q.sanity || 12));
              } else {
                st.setSanity(-6);
              }
              sanityCheck();
              st.push("office", "npcs", n.id);
              w.setDone(n.id, true);
              paintMission();
              busy = false;
              if (P.npcs.length >= O().npcs.length && !P.pipeline) startPipeline();
            }
          });
        });
      }

      /* ---- pipeline mini-game ---- */
      function startPipeline() {
        stageLocked = true;
        const pipe = O().pipeline;
        ui.dialogue(pipe.intro, () => {
          const wrap = ui.box("", "");
          wrap.innerHTML = '<div class="q-title">NIGHTLY PIPELINE · FIND THE BROKEN STAGE</div>';
          const log = ui.box("screen", '<div class="term">' +
            pipe.log.map(l => ui.esc(l)
              .replace(/ERROR/g, '<span class="err">ERROR</span>')
              .replace(/OK/g, "<b>OK</b>")
              .replace(/SKIPPED/g, '<span class="warn">SKIPPED</span>')
              .replace(/EMAILING HER/g, '<span class="err">EMAILING HER</span>')).join("\n") + "</div>");
          wrap.appendChild(log);
          wrap.appendChild(ui.el("div", "q-sub", ui.esc(pipe.hint)));

          const row = ui.el("div", "opts");
          const btns = [];
          pipe.stages.forEach((s, i) => {
            const b = ui.el("button", "opt");
            b.innerHTML = '<span class="k">' + (i + 1) + ".</span><span>" + ui.esc(s) +
                          (i < pipe.stages.length - 1 ? "  ↓" : "") + "</span>";
            b.addEventListener("click", () => guess(i, b));
            row.appendChild(b);
            btns.push(b);
          });
          wrap.appendChild(row);
          ui.panel.appendChild(wrap);
          wrap.scrollIntoView({ block: "nearest" });

          let tries = 0;
          function guess(i, b) {
            if (i === pipe.broken) {
              btns.forEach(x => x.disabled = true);
              b.classList.add("ok");
              au.sfx.big();
              const gain = Math.max(50, D.xp.puzzle - tries * 50);
              st.addXp(gain); ui.xpToast(gain);
              st.setSanity(30); sanityCheck();
              st.flagDone("office", "pipeline", true);
              paintMission();
              ui.dialogue(pipe.fixed, () => { wrap.remove(); startBoss(); });
            } else {
              tries++;
              b.classList.add("no"); b.disabled = true;
              au.sfx.wrong();
              st.setSanity(-5); sanityCheck();
              ui.toast("NOT IT", pipe.wrong, "warn");
            }
          }
        });
      }

      /* ---- BOSS: THE BORING REPORT ---- */
      function startBoss() {
        stageLocked = true;
        const B = O().boss;
        if (P.bossHp == null) P.bossHp = B.hp;
        ui.dialogue(B.intro, () => {
          const wrap = ui.box("", "");
          wrap.innerHTML =
            '<div class="q-title">BOSS: ' + ui.esc(B.name) + "</div>" +
            '<div class="row"><span class="hud-lab">HP</span><div class="bar hp" style="flex:1">' +
            '<div class="bar-fill" id="bossFill"></div><span class="bar-text" id="bossTxt"></span></div></div>' +
            '<div class="q-sub" id="bossQuip">It is humming. It hums when it is confident.</div>';
          ui.panel.appendChild(wrap);
          const fill = wrap.querySelector("#bossFill");
          const txt = wrap.querySelector("#bossTxt");
          const quip = wrap.querySelector("#bossQuip");
          const slot = ui.el("div", "");
          wrap.appendChild(slot);

          paintHp();
          function paintHp() {
            const pct = Math.max(0, (P.bossHp / B.hp) * 100);
            fill.style.width = pct + "%";
            txt.textContent = Math.max(0, P.bossHp).toLocaleString() + " / " + B.hp.toLocaleString();
          }

          let n = 0;
          nextAttack();

          function nextAttack() {
            if (P.bossHp <= 0 || n >= B.attacks.length) return win();
            const a = B.attacks[n];
            slot.innerHTML = "";
            const holder = ui.el("div", "");
            slot.appendChild(holder);
            const q = ui.ask(a, {
              title: "AUTOMATION MOVE " + (n + 1) + " / " + B.attacks.length,
              xpKey: "bossHit",
              onDone: (ok) => {
                if (ok) {
                  P.bossHp -= a.dmg;
                  au.sfx.hit();
                  wrap.classList.add("shake");
                  setTimeout(() => wrap.classList.remove("shake"), 600);
                  quip.textContent = ui.txt(a.quip);
                } else {
                  P.bossHp = Math.min(B.hp, P.bossHp + 400);
                  au.sfx.boss();
                  st.setSanity(-8); sanityCheck();
                  quip.textContent = "THE BORING REPORT GREW SLIGHTLY MORE BORING. (+400 HP)";
                }
                if (P.bossHp < 0) P.bossHp = 0;
                paintHp();
                st.save();
                n++;
                setTimeout(nextAttack, 220);
              }
            });
            // move the question inside the boss box so the HP bar stays visible
            slot.appendChild(q.node);
          }

          function win() {
            P.bossHp = 0; paintHp();
            st.flagDone("office", "boss", true);
            st.setSanity(100); ui.hud();
            au.sfx.big();
            st.flagDone("office", "done", true);
            st.unlockWorld("grocery");
            paintMission();
            ui.dialogue(B.defeat.concat(O().outro).concat([
              { who: "SYSTEM", text: "GROCERY.EXE unlocked." }
            ]), () => { wrap.remove(); window.RX.game.go("hub"); });
          }
        });
      }

      /* ---- entry state ---- */
      if (P.done) {
        ui.dialogue([{ who: "SYSTEM", text: "You already survived this day. Nobody survives it twice for XP." }], () => {});
        const row = ui.el("div", "row end");
        const b = ui.el("button", "btn", "CLOCK OUT ▶");
        b.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
        row.appendChild(b);
        p.appendChild(row);
      } else if (!st.S.seenIntro.office) {
        st.S.seenIntro.office = true; st.save();
        ui.dialogue(O().intro, () => {});
      } else if (P.npcs.length >= O().npcs.length && !P.pipeline) {
        startPipeline();
      } else if (P.pipeline && !P.boss) {
        startBoss();
      }
    }
  };
})();
