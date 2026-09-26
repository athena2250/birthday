/* ============================================================
   boot.js — BIOS, title screen, save file, intro, world select.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio;
  const world = window.RX.world, px = window.RX.px;
  const S = window.RX.scenes = window.RX.scenes || {};

  /* ---------------- BIOS ---------------- */

  S.boot = {
    enter() {
      ui.setTitle("RITHVIKA.EXE");
      ui.setWorld("BOOT");
      ui.setHint("Press any key.");
      world.hideStage();
      const p = ui.clearPanel();
      const scr = ui.box("screen", '<div class="term" id="bios"></div>');
      p.appendChild(scr);
      const out = scr.querySelector("#bios");
      const lines = D.boot.bios;
      let i = 0;
      const t = setInterval(() => {
        if (i >= lines.length) { clearInterval(t); ready(); return; }
        const l = document.createElement("div");
        l.innerHTML = ui.esc(ui.txt(lines[i])).replace(/NOT FOUND/g, '<span class="err">NOT FOUND</span>')
          .replace(/OK/g, "<b>OK</b>").replace(/(37 UNFINISHED IDEAS FOUND)/, '<span class="warn">$1</span>');
        out.appendChild(l);
        au.sfx.type();
        i++;
      }, 190);

      function ready() {
        const row = ui.el("div", "row end");
        const b = ui.el("button", "btn big", "▶ START");
        b.addEventListener("click", start);
        row.appendChild(b);
        p.appendChild(row);
        b.focus();
        au.sfx.boot();
        const once = (e) => { if (e.key === " " || e.key === "Enter") { document.removeEventListener("keydown", once); start(); } };
        document.addEventListener("keydown", once);
      }

      function start() { au.resume(); au.sfx.select(); window.RX.game.go("title"); }
    }
  };

  /* ---------------- TITLE ---------------- */

  S.title = {
    enter() {
      ui.setTitle("RITHVIKA.EXE — MAIN MENU");
      ui.setWorld("MENU");
      ui.setHint("Choose an option. There are no wrong ones yet.");
      world.backdrop("city");
      showTitleActor();
      au.music("city");

      const p = ui.clearPanel();
      const wrap = ui.el("div", "menu-screen");
      wrap.innerHTML =
        "<h1>" + ui.esc(D.boot.title) + "</h1>" +
        "<h2>" + ui.esc(D.boot.subtitle) + "</h2>" +
        '<div class="term" style="color:#333;font-size:18px">' + ui.esc(ui.txt(D.boot.version)) + "</div>";
      const list = ui.el("div", "list");

      if (st.hasSave()) {
        const cont = ui.el("button", "btn big wide", "▶ CONTINUE");
        cont.addEventListener("click", () => {
          au.sfx.select();
          st.load();
          ui.hud();
          saveFileScreen(() => window.RX.game.go("hub"));
        });
        list.appendChild(cont);
      }

      const nw = ui.el("button", "btn big wide", st.hasSave() ? "NEW GAME (erases save)" : "▶ NEW GAME");
      nw.addEventListener("click", () => {
        au.sfx.select();
        if (st.hasSave()) {
          ui.modal({
            title: "CONFIRM", html: "Start again from zero?<br>Your current save will be overwritten.",
            buttons: [{ label: "CANCEL" }, { label: "YES, RESTART", cls: "bad", fn: begin }]
          });
        } else begin();
      });
      list.appendChild(nw);

      const mem = ui.el("button", "btn wide", "MEMORY ARCHIVE");
      mem.addEventListener("click", () => { au.sfx.click(); window.RX.game.archive(); });
      list.appendChild(mem);

      const about = ui.el("button", "btn wide", "ABOUT THIS DISK");
      about.addEventListener("click", () => {
        au.sfx.click();
        ui.modal({
          title: "ABOUT",
          html: "<b>RITHVIKA.EXE</b><br>" + ui.esc(D.character.name) + " · " + ui.esc(D.character.job) +
                " at " + ui.esc(D.character.company) + "<br>" + ui.esc(D.character.tagline) +
                "<br><br>Player: <b>" + ui.esc(D.player.name) + "</b><br><br>" +
                "Objective: understand her.<br>Estimated difficulty: <b>impossible</b>.<br><br>" +
                '<span style="font-size:17px">Move with arrow keys or WASD, interact with E (or just tap things).</span>'
        });
      });
      list.appendChild(about);

      wrap.appendChild(list);
      p.appendChild(wrap);

      function begin() {
        st.reset();
        ui.hud();
        window.RX.game.go("intro");
      }
    }
  };

  /* little Rithvika standing on the title screen */
  function showTitleActor() {
    const a = world.actors;
    a.innerHTML = "";
    const n = ui.el("div", "spr player bob");
    n.style.width = "48px"; n.style.height = "78px";
    n.style.left = "136px"; n.style.top = "96px";
    n.style.backgroundImage = "url(" + px.rithvika("city", 0, {}) + ")";
    a.appendChild(n);
  }

  /* ---------------- SAVE FILE SCREEN ---------------- */

  function saveFileScreen(done) {
    const s = st.summary();
    const p = ui.clearPanel();
    const scr = ui.box("screen", "");
    const worldName = window.RX.game.worldLabel(s.world);
    scr.innerHTML =
      '<div class="term">' +
      "SAVE FILE   : <b>RITHVIKA.EXE</b>\n" +
      "PLAYER      : <b>" + ui.esc(s.player) + "</b>\n" +
      "PROGRESS    : <b>" + s.progress + "%</b>\n" +
      "RITHVIKA XP : <b>" + s.xp.toLocaleString() + "</b>   (LVL " + s.level + ")\n" +
      "KNOWLEDGE   : <b>" + s.knowledge + "%</b>  " + ui.esc(st.knowledgeStatus()) + "\n" +
      "WORLD       : <b>" + ui.esc(worldName) + "</b>\n" +
      "MEMORIES    : <b>" + st.unlockedMemories().length + " / " + D.memories.length + "</b>\n" +
      "</div>";
    p.appendChild(scr);
    const row = ui.el("div", "row end");
    const b = ui.el("button", "btn big", "LOAD ▶");
    b.addEventListener("click", () => { au.sfx.save(); done(); });
    row.appendChild(b);
    p.appendChild(row);
    b.focus();
  }
  S.saveFile = { enter: () => saveFileScreen(() => window.RX.game.go("hub")) };

  /* ---------------- INTRO ---------------- */

  S.intro = {
    enter() {
      ui.setTitle("RITHVIKA.EXE — INITIALISING");
      ui.setWorld("INTRO");
      ui.setHint("Click the dialogue box to continue.");
      world.backdrop("mind");
      au.music("mind");
      const a = world.actors;
      a.innerHTML = "";
      const n = ui.el("div", "spr player bob");
      n.style.width = "48px"; n.style.height = "78px";
      n.style.left = "-60px"; n.style.top = "90px";
      n.style.backgroundImage = "url(" + px.rithvika("dream", 0, {}) + ")";
      n.style.transition = "left 2.6s steps(14)";
      a.appendChild(n);
      setTimeout(() => { n.style.left = "136px"; }, 400);

      ui.clearPanel();
      ui.dialogue(D.boot.intro, () => {
        ui.loading("LOADING HOME.EXE", [
          "mounting /home/rithvika",
          "counting unfinished ideas",
          "ignoring 47 open tabs",
          "warming the kettle",
          "ready"
        ], () => window.RX.game.go("home"));
      });
    }
  };

  /* ---------------- WORLD SELECT ---------------- */

  S.hub = {
    enter() {
      ui.setTitle("RITHVIKA.EXE — DISK CONTENTS");
      ui.setWorld("DISK");
      ui.setHint("Open a world. Locked ones open as you finish the one before.");
      world.backdrop("mind");
      au.music("home");
      ui.showSanity(false);

      const p = ui.clearPanel();
      const head = ui.box("", '<div class="q-title">' + ui.esc(D.worldSelect.title) + "</div>" +
        '<div class="q-sub">' + ui.esc(D.worldSelect.hint) + "</div>");
      p.appendChild(head);

      const grid = ui.el("div", "grid-cards");
      D.worldSelect.worlds.forEach(w => {
        const unlocked = st.worldUnlocked(w.id);
        const done = (st.S.progress[w.id === "final" ? "final" : w.id] || {}).done;
        const c = ui.el("button", "card" + (done ? " done" : ""));
        c.innerHTML =
          '<span class="ic" style="background-image:url(' + px.url(w.sprite) + ')"></span>' +
          "<span><b>" + ui.esc(w.name) + "</b>" +
          '<span class="sub">' + (unlocked ? ui.esc(w.sub) : "🔒 LOCKED") +
          (done ? ' <span class="tick">✔ DONE</span>' : "") + "</span></span>";
        if (!unlocked) {
          c.disabled = true;
          c.style.opacity = ".55";
        } else {
          c.addEventListener("click", () => { au.sfx.select(); window.RX.game.go(w.id); });
        }
        grid.appendChild(c);
      });
      p.appendChild(grid);

      const s = st.summary();
      const stats = ui.box("sunken",
        '<div class="term" style="color:#111;font-size:19px">' +
        "PROGRESS " + s.progress + "%  ·  LVL " + s.level + "  ·  " + s.xp.toLocaleString() + " XP  ·  KNOWLEDGE " +
        s.knowledge + "% — " + ui.esc(st.knowledgeStatus()) + "</div>");
      p.appendChild(stats);

      const row = ui.el("div", "row");
      const mem = ui.el("button", "btn", "MEMORY ARCHIVE (" + st.unlockedMemories().length + ")");
      mem.addEventListener("click", () => { au.sfx.click(); window.RX.game.archive(); });
      row.appendChild(mem);
      const menu = ui.el("button", "btn", "MAIN MENU");
      menu.addEventListener("click", () => { au.sfx.click(); window.RX.game.go("title"); });
      row.appendChild(menu);
      p.appendChild(row);
    }
  };
})();
