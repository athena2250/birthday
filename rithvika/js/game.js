/* ============================================================
   game.js — wiring. Scene router, menus, save button, memory
   unlock listener. Nothing personal lives here.
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const ui = window.RX.ui, st = window.RX.state, au = window.RX.audio, world = window.RX.world;
  const px = window.RX.px;
  const scenes = window.RX.scenes;
  const $ = (id) => document.getElementById(id);

  const LABELS = {
    boot: "BOOT", title: "MAIN MENU", intro: "INTRO", hub: "DISK CONTENTS",
    home: "HOME.EXE", office: "CORPORATE DIMENSION", grocery: "GROCERY.EXE",
    city: "THE REAL RITHVIKA", mind: "RITHVIKA'S MIND", final: "LEVEL 99"
  };
  const worldLabel = (id) => LABELS[id] || String(id || "").toUpperCase();

  /* ---------------- router ---------------- */

  let current = null;

  function go(id, opts) {
    const sc = scenes[id];
    if (!sc) { console.warn("no scene", id); return; }
    if (["office", "grocery", "city", "mind", "final"].indexOf(id) !== -1 && !st.worldUnlocked(id)) {
      ui.fakeError({ title: "ACCESS DENIED", text: "That world is still locked.\nFinish the one before it first." });
      return;
    }
    world.destroy();
    document.body.classList.remove("dreamy");
    current = id;
    if (["home", "office", "grocery", "city", "mind", "final"].indexOf(id) !== -1) {
      st.S.world = id;
      st.save();
    }
    // a short loading screen between worlds keeps the 90s feeling
    if (opts && opts.instant) { sc.enter(); ui.hud(); return; }
    if (["home", "office", "grocery", "city", "mind", "final"].indexOf(id) !== -1) {
      world.hideStage();
      ui.loading("LOADING " + worldLabel(id), loadingSteps(id), () => { sc.enter(); ui.hud(); });
    } else {
      sc.enter();
      ui.hud();
    }
  }

  function loadingSteps(id) {
    const common = ["allocating memory", "decompressing pixels"];
    const per = {
      home: ["counting unfinished ideas", "stacking snacks", "hiding the laundry chair"],
      office: ["starting Databricks cluster", "still starting cluster", "booking a 'quick sync'", "brewing coffee"],
      grocery: ["restocking shelves", "hiding the almonds", "wobbling one trolley wheel"],
      city: ["lighting the night city", "placing eight versions of her"],
      mind: ["loading dreams", "loading fears", "handling with care"],
      final: ["locking the door", "turning the comedy down", "opening the last file"]
    };
    return common.concat(per[id] || ["loading"]).concat(["ready"]);
  }

  /* ---------------- ask a list of questions in order ---------------- */

  function series(questions, xpKey, done) {
    let i = 0, score = 0;
    step();
    function step() {
      if (i >= questions.length) { if (done) done(score); return; }
      const idx = i;
      ui.ask(questions[idx], {
        title: "QUESTION " + (idx + 1) + " OF " + questions.length,
        xpKey: xpKey,
        onDone: (ok) => { if (ok) score++; i++; step(); }
      });
    }
  }

  /* ---------------- memory archive ---------------- */

  function archive() {
    const got = st.unlockedMemories();
    const node = ui.el("div", "");
    if (!got.length) {
      node.innerHTML = '<div class="mtxt">No memories unlocked yet.<br><br>Earn XP. They open by themselves.<br><br>' +
        '<span style="font-size:17px">Next one at LEVEL ' + D.memories[0].level + ".</span></div>";
    } else {
      got.forEach(m => {
        const b = ui.el("button", "card");
        b.innerHTML = '<span class="ic" style="background-image:url(' + px.url(m.kind === "voice" ? "headphones" : "floppy") + ')"></span>' +
          "<span><b>LVL " + m.level + " · " + ui.esc(ui.txt(m.title)) + "</b>" +
          '<span class="sub">' + ui.marked(m.label) + "</span></span>";
        b.addEventListener("click", () => { au.sfx.click(); ui.memory(m); });
        node.appendChild(b);
      });
      const next = D.memories.filter(m => st.S.unlockedMemories.indexOf(m.level) === -1)[0];
      if (next) node.appendChild(ui.el("div", "mtxt", '<span style="font-size:17px">Next unlock: LEVEL ' + next.level +
        " (you're level " + st.level() + ").</span>"));
    }
    ui.modal({
      title: "MEMORY ARCHIVE  ·  " + got.length + "/" + D.memories.length,
      node: node, buttons: [{ label: "CLOSE" }]
    });
  }

  /* ---------------- menus ---------------- */

  let openMenu = null;

  function dropdown(anchor, items) {
    closeMenu();
    const dd = ui.el("div", "dropdown");
    items.forEach(it => {
      if (it === "-") { dd.appendChild(ui.el("hr")); return; }
      const b = ui.el("button", "", ui.esc(it.label));
      b.addEventListener("click", () => { closeMenu(); au.sfx.click(); it.fn(); });
      dd.appendChild(b);
    });
    const bar = $("menubar");
    dd.style.left = (anchor.offsetLeft) + "px";
    bar.appendChild(dd);
    openMenu = dd;
    setTimeout(() => document.addEventListener("click", onDocClick), 0);
  }
  function onDocClick() { closeMenu(); }
  function closeMenu() {
    if (openMenu) { openMenu.remove(); openMenu = null; document.removeEventListener("click", onDocClick); }
  }

  function saveNow(quiet) {
    st.save();
    au.sfx.save();
    if (!quiet) ui.toast("GAME SAVED", "RITHVIKA.EXE · " + st.progressPct() + "% · LVL " + st.level());
  }

  function saveInfo() {
    const s = st.summary();
    ui.modal({
      title: "SAVE FILE",
      html: '<div class="term" style="color:#111">' +
        "SAVE FILE   : <b>RITHVIKA.EXE</b><br>" +
        "PLAYER      : <b>" + ui.esc(s.player) + "</b><br>" +
        "PROGRESS    : <b>" + s.progress + "%</b><br>" +
        "RITHVIKA XP : <b>" + s.xp.toLocaleString() + "</b> (LVL " + s.level + ")<br>" +
        "KNOWLEDGE   : <b>" + s.knowledge + "%</b> — " + ui.esc(st.knowledgeStatus()) + "<br>" +
        "WORLD       : <b>" + ui.esc(worldLabel(s.world)) + "</b><br>" +
        "MEMORIES    : <b>" + st.unlockedMemories().length + "/" + D.memories.length + "</b></div>",
      buttons: [{ label: "SAVE NOW", cls: "good", fn: () => saveNow() }, { label: "CLOSE" }]
    });
  }

  function wireMenus() {
    $("menubar").querySelectorAll(".mi[data-menu]").forEach(mi => {
      mi.addEventListener("click", (e) => {
        e.stopPropagation();
        if (openMenu) { closeMenu(); return; }
        au.sfx.hover();
        const which = mi.dataset.menu;
        if (which === "file") dropdown(mi, [
          { label: "Save game", fn: () => saveNow() },
          { label: "Save file info…", fn: saveInfo },
          "-",
          { label: "Load last save", fn: () => {
              if (!st.hasSave()) { ui.fakeError({ title: "LOAD", text: "No save file found." }); return; }
              st.load(); ui.hud(); ui.toast("SAVE LOADED"); go(st.S.world === "boot" ? "hub" : st.S.world, { instant: true });
            } },
          { label: "Back to disk contents", fn: () => go("hub") },
          { label: "Back to the birthday site", fn: () => { st.save(); window.location.href = "../"; } },
          "-",
          { label: "Erase save and restart", fn: () => ui.modal({
              title: "CONFIRM", html: "Erase everything and start over?",
              buttons: [{ label: "CANCEL" }, { label: "ERASE", cls: "bad", fn: () => { st.reset(); ui.hud(); go("title"); } }]
            }) }
        ]);
        else if (which === "rith") dropdown(mi, [
          { label: "Memory archive…", fn: archive },
          { label: "Stats…", fn: () => ui.modal({
              title: "RITHVIKA STATS",
              html: '<div class="term" style="color:#111">' +
                "LEVEL        : <b>" + st.level() + " / 99</b><br>" +
                "XP           : <b>" + st.S.xp.toLocaleString() + "</b><br>" +
                "KNOWLEDGE    : <b>" + st.knowledge() + "%</b> — " + ui.esc(st.knowledgeStatus()) + "<br>" +
                "CORRECT      : <b>" + st.S.correct + "</b><br>" +
                "WRONG        : <b>" + st.S.wrong + "</b><br>" +
                "SANITY       : <b>" + st.S.sanity + "%</b><br>" +
                "PROGRESS     : <b>" + st.progressPct() + "%</b></div>"
            }) },
          { label: "Unfinished ideas…", fn: () => ui.fakeError({
              title: "IDEAS.DB", text: "37 unfinished ideas.\n\nCannot close: all of them are 'nearly done'." }) }
        ]);
        else dropdown(mi, [
          { label: "Controls…", fn: () => ui.modal({
              title: "HOW TO PLAY",
              html: '<div class="mtxt">Move: <b>arrow keys / WASD</b>, or the on-screen pad.<br>' +
                "Interact: <b>E</b>, tap an object, or press the round button.<br>" +
                "Dialogue: <b>click the box</b> or press <b>space</b>.<br>" +
                "Answers: click, or press <b>A / B / C / D</b>.<br>" +
                "Walk somewhere: <b>tap the floor</b>.<br><br>" +
                "The game saves itself constantly. The floppy button saves too, because it feels better.</div>"
            }) },
          { label: "Toggle touch controls", fn: () => {
              document.body.classList.toggle("touch");
              ui.toast("TOUCH PAD " + (document.body.classList.contains("touch") ? "ON" : "OFF"));
            } },
          { label: "Toggle CRT scanlines", fn: () => {
              document.body.classList.toggle("noscan");
              ui.toast("SCANLINES " + (document.body.classList.contains("noscan") ? "OFF" : "ON"));
            } },
          "-",
          { label: "Produce a system error", fn: () => ui.fakeError() },
          { label: "About…", fn: () => ui.modal({
              title: "ABOUT",
              html: '<div class="mtxt"><b>RITHVIKA.EXE</b> — the quest to unlock her heart.<br><br>' +
                "Built for <b>" + ui.esc(D.player.name) + "</b>.<br>" +
                "Everything in it is editable in <b>js/gameData.js</b>.</div>"
            }) }
        ]);
      });
    });

    $("soundBtn").addEventListener("click", () => {
      const on = au.toggle();
      $("soundBtn").textContent = on ? "♪ ON" : "♪ OFF";
      ui.toast("SOUND " + (on ? "ON" : "OFF"));
    });
    $("soundBtn").textContent = au.enabled ? "♪ ON" : "♪ OFF";

    $("saveBtn").addEventListener("click", () => saveNow());

    $("titlebar").querySelector(".x").addEventListener("click", () => {
      ui.fakeError({ title: "RITHVIKA.EXE", text: "You can't close her.\n\nOperation not permitted." });
    });
  }

  /* ---------------- state listeners ---------------- */

  st.on("xp", ui.hud);
  st.on("know", ui.hud);
  st.on("sanity", ui.hud);
  st.on("load", ui.hud);
  st.on("memory", (m) => ui.memory(m));
  st.on("level", (e) => {
    au.sfx.level();
    ui.toast("LEVEL " + e.level, e.level >= 99 ? "MAXIMUM RITHVIKA." : "RITHVIKA XP increasing.");
    ui.hud();
  });

  /* ---------------- boot ---------------- */

  function init() {
    if (("ontouchstart" in window) || navigator.maxTouchPoints > 0) document.body.classList.add("touch");
    wireMenus();
    world.layout();
    ui.hud();
    window.addEventListener("beforeunload", () => st.save());
    document.addEventListener("visibilitychange", () => { if (document.hidden) st.save(); });
    // first click anywhere unlocks browser audio
    const once = () => { au.resume(); document.removeEventListener("pointerdown", once); };
    document.addEventListener("pointerdown", once);
    go("boot");
  }

  window.RX.game = { go, series, archive, worldLabel, saveNow, init };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
