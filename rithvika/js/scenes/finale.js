/* ============================================================
   finale.js — LEVEL 99: THE PERSON WHO KNOWS HER
   Ten questions, a locked door, and then the game stops joking.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const px = window.RX.px;
  const S = window.RX.scenes = window.RX.scenes || {};
  const F = () => D.finale;

  S.final = {
    enter() {
      const P = st.S.progress.final;
      st.S.world = "final";
      ui.setTitle("LEVEL99.EXE");
      ui.setWorld("LEVEL 99");
      ui.setHint("Ten questions. No hints. No pressure. (There is pressure.)");
      ui.showSanity(false);
      au.music("finale");

      world.backdrop("mind");
      doorScene();

      const p = ui.clearPanel();
      const head = ui.box("sunken", "");
      p.appendChild(head);
      paintHead();

      function paintHead() {
        head.innerHTML =
          '<div class="q-title">' + ui.esc(F().name) + "</div>" +
          '<div class="q-sub">Answered: <b>' + P.answered.length + " / " + F().questions.length +
          "</b>  ·  Correct: <b>" + P.score + "</b></div>";
      }

      if (P.done) {
        ui.dialogue([{ who: "SYSTEM", text: "You already finished this. The door stays open for you." }], () => {
          const row = ui.el("div", "row");
          const a = ui.el("button", "btn big", "WATCH THE ENDING AGAIN ▶");
          a.addEventListener("click", () => { au.sfx.click(); cutscene(); });
          const b = ui.el("button", "btn", "BACK TO DISK");
          b.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
          row.appendChild(a); row.appendChild(b);
          ui.panel.appendChild(row);
        });
        return;
      }

      if (!st.S.seenIntro.final) {
        st.S.seenIntro.final = true; st.save();
        ui.dialogue(F().intro, () => run());
      } else {
        run();
      }

      /* ---- the ten questions ---- */
      function run() {
        const qs = F().questions;
        let i = P.answered.length;
        step();

        function step() {
          if (i >= qs.length) return verdict();
          ui.ask(qs[i], {
            title: "QUESTION " + (i + 1) + " OF " + qs.length,
            xpKey: "relationship",
            onDone: (ok) => {
              if (ok) P.score++;
              P.answered.push(i);
              st.save();
              i++;
              paintHead();
              if (i === 5) {
                ui.dialogue([{ who: D.character.name, text: "Halfway. You're doing better than you think." }], step);
              } else step();
            }
          });
        }
      }

      function verdict() {
        const sc = P.score;
        let line = "";
        for (const v of F().verdicts) { if (sc < v.under) { line = v.text; break; } }
        au.sfx.door();
        ui.dialogue([
          { who: "SYSTEM", text: "SCORE: " + sc + " / " + F().questions.length },
          { who: "SYSTEM", text: ui.txt(line) },
          { who: "SYSTEM", text: "DOOR UNLOCKED." }
        ], () => cutscene());
      }

      /* ---- door art ---- */
      function doorScene() {
        const a = world.actors;
        a.innerHTML = "";
        const door = ui.el("div", "spr");
        door.style.width = "60px"; door.style.height = "60px";
        door.style.left = "130px"; door.style.top = "70px";
        door.style.backgroundImage = "url(" + px.url("door") + ")";
        a.appendChild(door);
        const her = ui.el("div", "spr bob");
        her.style.width = "32px"; her.style.height = "52px";
        her.style.left = "80px"; her.style.top = "78px";
        her.style.backgroundImage = "url(" + px.rithvika("dream", 0, {}) + ")";
        a.appendChild(her);
        const heart = ui.el("div", "spr floaty");
        heart.style.width = "24px"; heart.style.height = "21px";
        heart.style.left = "200px"; heart.style.top = "84px";
        heart.style.backgroundImage = "url(" + px.url("heart") + ")";
        a.appendChild(heart);
      }
    }
  };

  /* ============================================================
     THE FINAL CUTSCENE
     ============================================================ */

  function cutscene() {
    const P = st.S.progress.final;
    ui.setTitle("RITHVIKA.EXE");
    ui.setWorld("FINAL");
    ui.setHint("");
    au.music("finale");
    world.backdrop("mind");

    // she walks toward the player
    const a = world.actors;
    a.innerHTML = "";
    const her = ui.el("div", "spr");
    her.style.width = "24px"; her.style.height = "39px";
    her.style.left = "148px"; her.style.top = "70px";
    her.style.backgroundImage = "url(" + px.rithvika("dream", 0, {}) + ")";
    her.style.transition = "all 7s steps(20)";
    a.appendChild(her);
    setTimeout(() => {
      her.style.width = "72px"; her.style.height = "117px";
      her.style.left = "124px"; her.style.top = "56px";
    }, 300);

    const p = ui.clearPanel();
    const cine = ui.el("div", "cine");
    const line = ui.el("div", "cl");
    cine.appendChild(line);
    p.appendChild(cine);

    const lines = D.finale.cutscene.map(t => ui.txt(t));
    let i = 0;

    typeLine();

    function typeLine() {
      if (i >= lines.length) return systemPart();
      const full = lines[i];
      let ch = 0;
      line.className = "cl fadein";
      line.textContent = "";
      const t = setInterval(() => {
        ch += 1;
        line.textContent = full.slice(0, ch);
        if (ch % 4 === 0) au.sfx.type();
        if (ch >= full.length) {
          clearInterval(t);
          i++;
          setTimeout(typeLine, full.length > 30 ? 1500 : 1000);
        }
      }, 42);
    }

    function systemPart() {
      au.music("finale");
      cine.style.background = "#000";
      line.textContent = "";
      const sys = D.finale.cutsceneSystem.map(t => ui.txt(t));
      let j = 0;
      au.sfx.warm();
      const t = setInterval(() => {
        if (j >= sys.length) { clearInterval(t); banner(); return; }
        const n = ui.el("div", "big fadein", ui.esc(sys[j]));
        cine.appendChild(n);
        au.sfx.select();
        j++;
      }, 1900);
    }

    function banner() {
      const b = ui.el("div", "big fadein", ui.esc(ui.txt(D.finale.finalBanner)));
      b.style.color = "#ff8fb0";
      b.style.marginTop = "6px";
      cine.appendChild(b);
      au.sfx.big();

      const lab = ui.el("div", "cl fadein", ui.esc(D.finale.continueLabel));
      cine.appendChild(lab);

      const hearts = ui.el("div", "hearts");
      D.finale.continueButtons.forEach(labelText => {
        const btn = ui.el("button", "btn big wide pink", ui.esc(labelText));
        btn.addEventListener("click", finish);
        hearts.appendChild(btn);
      });
      cine.appendChild(hearts);
      cine.scrollIntoView({ block: "nearest" });
    }

    let finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      au.sfx.big();

      if (!P.done) {
        P.done = true;
        st.addXp(D.xp.finalComplete);
        ui.xpToast(D.xp.finalComplete);
        // level 99 is guaranteed once the story is finished
        if (st.level() < st.MAXLVL) st.addXp((st.MAXLVL - st.level()) * D.xp.perLevel);
        st.save();
      }
      // he finished it — the closing number is allowed to be kind
      const floor = D.finale.knowledgeFloor || 0;
      if (st.knowledge() < floor) {
        st.addKnow(floor - st.knowledge());
        ui.toast("KNOWLEDGE ADJUSTED", "You stayed to the end. That counts for something.");
      }
      st.forceMemory(99);
      ui.hud();

      const p2 = ui.clearPanel();
      const cine2 = ui.el("div", "cine");
      D.finale.end.forEach((t, k) => {
        const n = ui.el("div", "big fadein", ui.esc(ui.txt(t)));
        n.style.animationDelay = (k * 0.6) + "s";
        cine2.appendChild(n);
      });
      const sign = ui.el("div", "cl fadein");
      sign.innerHTML = ui.marked(D.finale.signoff);
      sign.style.animationDelay = "1.4s";
      cine2.appendChild(sign);

      const stats = ui.el("div", "cl", "");
      stats.style.fontSize = "19px";
      stats.style.color = "#9fb6e0";
      stats.innerHTML = "Knowledge of Rithvika: <b>" + st.knowledge() + "%</b><br>" +
        "Remaining " + (100 - st.knowledge()) + "% consists of things even Rithvika doesn't understand.<br>" +
        "FINAL LEVEL " + st.level() + "  ·  " + st.S.xp.toLocaleString() + " XP  ·  " +
        st.unlockedMemories().length + "/" + D.memories.length + " memories";
      cine2.appendChild(stats);

      const row = ui.el("div", "row");
      const m = ui.el("button", "btn", "MEMORY ARCHIVE");
      m.addEventListener("click", () => { au.sfx.click(); window.RX.game.archive(); });
      const h = ui.el("button", "btn", "BACK TO DISK");
      h.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
      row.appendChild(m); row.appendChild(h);
      cine2.appendChild(row);
      p2.appendChild(cine2);

      // she stays on screen, right at the front
      const her2 = world.actors.querySelector(".spr");
      if (her2) her2.classList.add("bob");
    }
  }

  S.final.cutscene = cutscene;
})();
