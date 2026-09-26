/* ============================================================
   mind.js — WORLD 5: RITHVIKA'S MIND
   No walking here. Just floating concepts you have to connect.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const px = window.RX.px;
  const S = window.RX.scenes = window.RX.scenes || {};
  const M = () => D.mind;

  S.mind = {
    enter() {
      const P = st.S.progress.mind;
      st.S.world = "mind";
      ui.setTitle("MIND.SYS — read only (mostly)");
      ui.setWorld("MIND.SYS");
      ui.setHint("Connect a thought on the left to what it really is on the right.");
      ui.showSanity(false);
      au.music("mind");

      world.backdrop("mind");
      floatConcepts();

      const p = ui.clearPanel();
      const wrap = ui.el("div", "mindwrap");
      const head = ui.box("sunken", "");
      wrap.appendChild(head);
      const board = ui.el("div", "mindboard");
      wrap.appendChild(board);
      p.appendChild(wrap);

      const pairs = M().pairs;
      // right-hand side is shuffled once per session, stably per pair index
      const rights = pairs.map((x, i) => i);
      for (let i = rights.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = rights[i]; rights[i] = rights[j]; rights[j] = t;
      }

      const leftCol = ui.el("div", "mindcol", "<h4>SHE DOES THIS</h4>");
      const rightCol = ui.el("div", "mindcol", "<h4>BECAUSE IT IS THIS</h4>");
      board.appendChild(leftCol); board.appendChild(rightCol);

      let selected = null, busy = false;
      const leftNodes = {}, rightNodes = {};

      pairs.forEach((pr, i) => {
        const b = ui.el("button", "node floaty", ui.esc(ui.txt(pr.left)));
        b.style.animationDelay = (i * 0.25) + "s";
        b.addEventListener("click", () => selectLeft(i, b));
        leftCol.appendChild(b);
        leftNodes[i] = b;
      });
      rights.forEach((idx, slot) => {
        const pr = pairs[idx];
        const b = ui.el("button", "node floaty", ui.esc(ui.txt(pr.right)));
        b.style.animationDelay = (slot * 0.3 + 0.1) + "s";
        b.addEventListener("click", () => selectRight(idx, b));
        rightCol.appendChild(b);
        rightNodes[idx] = b;
      });

      // restore anything already linked
      P.linked.forEach(i => lock(i, true));
      paintHead();

      function paintHead() {
        head.innerHTML =
          '<div class="q-title">MISSION: ' + ui.esc(M().mission) + "</div>" +
          '<div class="q-sub">Connections made: <b>' + P.linked.length + " / " + pairs.length + "</b></div>";
      }

      function lock(i, silent) {
        if (leftNodes[i]) { leftNodes[i].classList.add("linked"); leftNodes[i].classList.remove("sel", "floaty"); leftNodes[i].disabled = true; }
        if (rightNodes[i]) { rightNodes[i].classList.add("linked"); rightNodes[i].classList.remove("floaty"); rightNodes[i].disabled = true; }
      }

      function selectLeft(i, b) {
        if (busy) return;
        au.sfx.hover();
        Object.keys(leftNodes).forEach(k => leftNodes[k].classList.remove("sel"));
        b.classList.add("sel");
        selected = i;
      }

      function selectRight(idx, b) {
        if (busy) return;
        if (selected === null) { ui.toast("PICK A THOUGHT FIRST", "Left column, then right.", "warn"); au.sfx.wrong(); return; }
        const pr = M().pairs[selected];
        if (selected === idx) {
          const i = selected;
          selected = null;
          lock(i);
          st.push("mind", "linked", i);
          st.answer(true);
          st.addXp(D.xp.connection);
          ui.xpToast(D.xp.connection);
          au.sfx.select();
          paintHead();
          ui.toast("CONNECTED", pr.left + " → " + pr.right);
          busy = true;
          ui.dialogue([{ who: D.character.name, text: ui.txt(pr.note) }], () => {
            busy = false;
            if (P.linked.length >= M().pairs.length) finish();
          });
        } else {
          au.sfx.wrong();
          st.answer(false);
          st.penalty();
          ui.hud();
          b.classList.add("sel");
          setTimeout(() => b.classList.remove("sel"), 220);
          ui.toast("THAT'S NOT WHY", "Those two aren't the same thing. Try again.", "err");
        }
      }

      function finish() {
        st.flagDone("mind", "done", true);
        st.unlockWorld("final");
        au.sfx.big();
        ui.dialogue(M().complete, () => {
          ui.fakeError({ title: "PERSONALITY.SYS", text: "Reconstruction succeeded with 1 unresolvable remainder.\n\nRemainder: her." });
          const row = ui.el("div", "row end");
          const b = ui.el("button", "btn big", "LEVEL 99 ▶");
          b.addEventListener("click", () => { au.sfx.select(); window.RX.game.go("final"); });
          row.appendChild(b);
          ui.panel.appendChild(row);
          b.scrollIntoView({ block: "nearest" });
        });
        paintHead();
      }

      /* decorative floating words on the stage */
      function floatConcepts() {
        const a = world.actors;
        a.innerHTML = "";
        const groups = M().groups;
        const cloud = [];
        Object.keys(groups).forEach(g => groups[g].forEach(t => cloud.push({ g, t })));
        cloud.forEach((c, i) => {
          const n = ui.el("div", "", ui.esc(ui.txt(c.t)));
          n.style.position = "absolute";
          n.style.fontFamily = "var(--term)";
          n.style.fontSize = "9px";
          n.style.whiteSpace = "nowrap";
          n.style.textShadow = "0 0 6px #000";
          n.style.color = c.g === "fears" ? "#ff9db5" : c.g === "people" ? "#b9f3ff" : c.g === "future" ? "#fff3b0" : "#e7d6ff";
          n.style.left = (12 + ((i * 63) % 250)) + "px";
          n.style.top = (14 + ((i * 41) % 150)) + "px";
          n.className = "floaty";
          n.style.animationDelay = (i * 0.2) + "s";
          a.appendChild(n);
        });
        const her = ui.el("div", "spr bob");
        her.style.width = "48px"; her.style.height = "78px";
        her.style.left = "136px"; her.style.top = "84px";
        her.style.backgroundImage = "url(" + px.rithvika("dream", 0, {}) + ")";
        a.appendChild(her);
      }

      if (!st.S.seenIntro.mind) {
        st.S.seenIntro.mind = true; st.save();
        ui.dialogue(M().intro, () => {});
      } else if (P.done) {
        ui.dialogue([{ who: "SYSTEM", text: "MIND.SYS already mapped. It has changed slightly since. It always does." }], () => {});
        const row = ui.el("div", "row end");
        const b = ui.el("button", "btn", "BACK TO DISK ▶");
        b.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("hub"); });
        row.appendChild(b);
        p.appendChild(row);
      }
    }
  };
})();
