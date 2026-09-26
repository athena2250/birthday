/* ============================================================
   ui.js — every reusable piece of interface.

   RX.ui.dialogue([...])  typewriter dialogue boxes
   RX.ui.ask(question)    multiple-choice question with feedback
   RX.ui.modal({...})     Windows-95 pop-up window
   RX.ui.memory(mem)      MEMORY UNLOCKED window
   RX.ui.toast(...)       corner banners (XP, warnings)
   RX.ui.loading(...)     old-school loading screen
   RX.ui.fakeError()      a system error that means nothing
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const st = window.RX.state;
  const px = window.RX.px;
  const au = window.RX.audio;

  const $ = (id) => document.getElementById(id);
  const panel = $("panel");
  const modals = $("modals");
  const toasts = $("toasts");

  /* ---------------- text ---------------- */

  function txt(s) {
    if (s == null) return "";
    return String(s)
      .replace(/\{PLAYER\}/g, D.player.name)
      .replace(/\{NICKNAME\}/g, D.player.nickname)
      .replace(/\{RITHVIKA\}/g, D.character.name)
      .replace(/\{SHORT\}/g, D.character.short)
      .replace(/\{COMPANY\}/g, D.character.company)
      .replace(/\{JOB\}/g, D.character.job);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* [PLACEHOLDER] bits get a yellow highlight so they're easy to find */
  function marked(s) {
    return esc(txt(s)).replace(/\[([^\]]+)\]/g, '<span class="ph">[$1]</span>');
  }

  /* ---------------- tiny DOM helper ---------------- */

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function clearPanel() {
    panel.innerHTML = "";
    activeDialogue = null;
    return panel;
  }

  function box(cls, html) { return el("div", "box " + (cls || ""), html); }

  /* ---------------- HUD ---------------- */

  function hud() {
    const lv = st.level();
    $("hudLevel").textContent = lv;
    $("xpFill").style.width = Math.round((st.xpIntoLevel() / D.xp.perLevel) * 100) + "%";
    $("xpText").textContent = st.S.xp.toLocaleString() + " XP";
    const k = st.knowledge();
    $("kFill").style.width = k + "%";
    $("kText").textContent = k + "%";
    $("hudSanity").textContent = st.S.sanity + "%";
  }

  function setWorld(label) { $("stWorld").textContent = label; }
  function setHint(text) { $("stHint").textContent = text; }
  function setTitle(text) { $("tbText").textContent = text; }

  function showSanity(show) {
    document.body.classList.toggle("show-sanity", !!show);
  }

  /* ---------------- toasts ---------------- */

  function toast(text, sub, kind) {
    const t = el("div", "toast " + (kind || ""));
    t.innerHTML = esc(txt(text)) + (sub ? '<span class="t2">' + esc(txt(sub)) + "</span>" : "");
    toasts.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity .4s";
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 420);
    }, kind === "err" ? 3200 : 2600);
  }

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  /* XP gain banner, with a quip sized to the gain */
  function xpToast(amount) {
    if (amount <= 0) return;
    const q = amount >= 300 ? pick(D.xpQuips.large)
            : amount >= 100 ? pick(D.xpQuips.medium)
            : pick(D.xpQuips.small);
    toast("+" + amount + " XP", q);
    au.sfx.xp();
  }

  function flash() {
    const f = $("flash");
    f.classList.add("on");
    setTimeout(() => f.classList.remove("on"), 130);
    setTimeout(() => { f.classList.add("on"); setTimeout(() => f.classList.remove("on"), 130); }, 190);
  }

  /* ---------------- modals (queued, one at a time) ---------------- */

  const mQueue = [];
  let mOpen = false;

  function modal(cfg) {
    mQueue.push(cfg);
    if (!mOpen) nextModal();
  }

  function nextModal() {
    const cfg = mQueue.shift();
    if (!cfg) { mOpen = false; modals.classList.remove("on"); modals.innerHTML = ""; return; }
    mOpen = true;
    modals.innerHTML = "";
    modals.classList.add("on");

    const win = el("div", "modal");
    const tb = el("div", "titlebar");
    tb.innerHTML = '<span class="tb-icon"></span><span class="tb-text">' + esc(txt(cfg.title || "RITHVIKA.EXE")) +
                   '</span><span class="tb-btns"><b class="x">✕</b></span>';
    win.appendChild(tb);

    const inner = el("div", "inner");
    if (cfg.html) inner.appendChild(el("div", "mtxt", cfg.html));
    if (cfg.node) inner.appendChild(cfg.node);

    const row = el("div", "row end");
    const buttons = cfg.buttons && cfg.buttons.length ? cfg.buttons : [{ label: "OK" }];
    buttons.forEach(b => {
      const btn = el("button", "btn " + (b.cls || ""), esc(txt(b.label)));
      btn.addEventListener("click", () => {
        au.sfx.click();
        close();
        if (b.fn) b.fn();
      });
      row.appendChild(btn);
    });
    inner.appendChild(row);
    win.appendChild(inner);
    modals.appendChild(win);

    function close() {
      modals.classList.remove("on");
      modals.innerHTML = "";
      mOpen = false;
      setTimeout(nextModal, 60);
    }
    tb.querySelector(".x").addEventListener("click", () => {
      au.sfx.click(); close();
      const d = buttons[buttons.length - 1];
      if (cfg.closeRuns && d && d.fn) d.fn();
    });
    if (cfg.sound !== false) au.sfx.select();
    const first = win.querySelector(".btn");
    if (first) first.focus();
  }

  /* ---------------- memory unlock ---------------- */

  function memory(m) {
    const node = el("div", "memphoto");
    if (m.media && /\.(mp3|m4a|ogg|wav)$/i.test(m.media)) {
      node.innerHTML = '<div class="ph-label">' + esc(txt(m.label)) + "</div>";
      const a = document.createElement("audio");
      a.controls = true; a.src = m.media; a.style.width = "100%";
      node.appendChild(a);
    } else if (m.media) {
      const img = document.createElement("img");
      img.src = m.media; img.alt = txt(m.label);
      node.appendChild(img);
    } else {
      node.innerHTML =
        '<div class="ph-label">' + marked(m.label) + "</div>" +
        '<div class="ph-hint">' + (m.kind === "voice" ? "▶ voice note goes here"
          : m.kind === "photo" ? "photo goes here — drop a file in rithvika/media/"
          : m.kind === "screenshot" ? "screenshot goes here"
          : "she'll write this part herself") + "</div>";
    }
    modal({
      title: txt(m.title) + "  ·  LVL " + m.level,
      html: '<div style="font-family:var(--px);font-size:9px;margin-bottom:6px;color:#16204a">MEMORY UNLOCKED</div>',
      node: node,
      buttons: [{ label: "SAVE TO HEART", cls: "pink" }],
      sound: false
    });
    au.sfx.memory();
    toast("MEMORY UNLOCKED", txt(m.caption));
  }

  /* ---------------- fake system error ---------------- */

  function fakeError(e) {
    const err = e || pick(D.fakeErrors);
    const node = el("div", "row");
    node.innerHTML = '<span class="errico">✕</span><span class="mtxt" style="flex:1;min-width:0">' +
                     marked(err.text).replace(/\n/g, "<br>") + "</span>";
    modal({ title: txt(err.title), node: node, buttons: [{ label: "IGNORE" }], sound: false });
    au.sfx.error();
  }

  /* ---------------- dialogue ---------------- */

  let activeDialogue = null;

  /* lines: [{who, text}]  ·  done: callback when the last line is dismissed */
  function dialogue(lines, done) {
    const list = (lines || []).filter(Boolean);
    if (!list.length) { if (done) done(); return null; }

    const wrap = box("", "");
    const dlg = el("div", "dlg");
    const faceEl = el("div", "face");
    const body = el("div", "body");
    const who = el("div", "who");
    const line = el("div", "line");
    const next = el("div", "next", "CLICK / SPACE ▼");
    body.appendChild(who); body.appendChild(line); body.appendChild(next);
    dlg.appendChild(faceEl); dlg.appendChild(body);
    wrap.appendChild(dlg);

    // keep it at the top of the panel, above whatever else is there
    if (panel.firstChild) panel.insertBefore(wrap, panel.firstChild);
    else panel.appendChild(wrap);

    let i = -1, typing = false, full = "", ch = 0, timer = null;

    function render() {
      const L = list[i];
      const w = txt(L.who || "SYSTEM");
      who.textContent = w;
      who.className = "who" + (w === "SYSTEM" ? " sys" : w === D.character.name ? " rith" : "");
      faceEl.style.backgroundImage = "url(" + px.face(w === D.character.name ? "RITHVIKA" : w) + ")";
      full = txt(L.text);
      ch = 0; line.textContent = "";
      typing = true;
      next.classList.remove("blink");
      clearInterval(timer);
      timer = setInterval(() => {
        ch += 2;
        line.textContent = full.slice(0, ch);
        if (ch % 6 === 0) au.sfx.type();
        if (ch >= full.length) finishLine();
      }, 16);
    }

    function finishLine() {
      clearInterval(timer);
      typing = false;
      line.textContent = full;
      next.classList.add("blink");
      next.textContent = (i >= list.length - 1) ? "CLICK / SPACE TO CONTINUE ▼" : "CLICK / SPACE ▼";
    }

    function advance() {
      if (typing) { finishLine(); return; }
      if (i >= list.length - 1) { end(); return; }
      i++; au.sfx.click(); render();
    }

    function end() {
      clearInterval(timer);
      wrap.remove();
      if (activeDialogue === api) activeDialogue = null;
      if (done) done();
    }

    const api = { advance, end, skip: () => { clearInterval(timer); end(); } };
    wrap.addEventListener("click", advance);
    wrap.style.cursor = "pointer";
    activeDialogue = api;
    i = 0; render();
    return api;
  }

  /* ---------------- question ---------------- */

  /* q: { q, options, answer, note }
     opts: { xpKey, xp, title, onDone(ok), keepOpen } */
  function ask(q, opts) {
    opts = opts || {};
    const wrap = box("", "");
    if (opts.title) wrap.appendChild(el("p", "q-title", esc(txt(opts.title))));
    wrap.appendChild(el("p", "q-sub", esc(txt(q.q)).replace(/\n/g, "<br>")));
    const opt = el("div", "opts");
    const keys = ["A", "B", "C", "D", "E", "F"];
    const btns = [];
    q.options.forEach((o, idx) => {
      const b = el("button", "opt");
      b.innerHTML = '<span class="k">' + keys[idx] + '.</span><span>' + esc(txt(o)) + "</span>";
      b.addEventListener("click", () => choose(idx));
      opt.appendChild(b);
      btns.push(b);
    });
    wrap.appendChild(opt);
    panel.appendChild(wrap);
    wrap.scrollIntoView({ block: "nearest" });

    let answered = false;

    function choose(idx) {
      if (answered) return;
      answered = true;
      const ok = idx === q.answer;
      btns.forEach((b, j) => {
        b.disabled = true;
        if (j === q.answer) b.classList.add("ok");
        else if (j === idx) b.classList.add("no");
      });
      st.answer(ok);

      let gained = 0;
      if (ok) {
        gained = opts.xp != null ? opts.xp : (D.xp[opts.xpKey] || D.xp.personality);
        st.addXp(gained);
        xpToast(gained);
        au.sfx.select();
      } else {
        st.penalty();
        au.sfx.wrong();
        toast("-" + D.xp.wrongPenalty + " XP", pick(D.xpQuips.wrong), "err");
      }

      const fb = el("div", "feedback " + (ok ? "ok" : "no"));
      fb.innerHTML = "<b>" + (ok ? "CORRECT." : "NOT QUITE.") + "</b> " + marked(q.note || "");
      wrap.appendChild(fb);

      const row = el("div", "row end");
      const cont = el("button", "btn", "CONTINUE ▶");
      cont.addEventListener("click", () => {
        au.sfx.click();
        if (!opts.keepOpen) wrap.remove();
        if (opts.onDone) opts.onDone(ok);
      });
      row.appendChild(cont);
      wrap.appendChild(row);
      cont.focus();
      hud();
    }

    return { remove: () => wrap.remove(), node: wrap };
  }

  /* ---------------- loading screen ---------------- */

  function loading(title, steps, done) {
    clearPanel();
    const wrap = el("div", "loadwrap");
    wrap.innerHTML =
      '<div class="lt">' + esc(txt(title)) + "</div>" +
      '<div class="ls"></div>' +
      '<div class="loadbar"></div>' +
      '<div class="ls" style="font-size:16px;color:#555">please wait · do not turn off the computer</div>';
    panel.appendChild(wrap);
    const bar = wrap.querySelector(".loadbar");
    const label = wrap.querySelector(".ls");
    const N = 28;
    for (let i = 0; i < N; i++) bar.appendChild(el("i"));
    const cells = bar.querySelectorAll("i");
    const list = steps && steps.length ? steps : ["loading..."];
    let n = 0;
    au.sfx.boot();
    const t = setInterval(() => {
      cells[n].classList.add("on");
      label.textContent = txt(list[Math.min(list.length - 1, Math.floor((n / N) * list.length))]);
      if (n % 5 === 0) au.sfx.type();
      n++;
      if (n >= N) {
        clearInterval(t);
        setTimeout(() => { if (done) done(); }, 260);
      }
    }, 46 + Math.random() * 26);
  }

  /* ---------------- random events ---------------- */

  function randomEvent(force) {
    const pool = D.randomEvents.filter(e => st.S.events.indexOf(e.title) === -1);
    const src = pool.length ? pool : D.randomEvents;
    const ev = pick(src);
    if (st.S.events.indexOf(ev.title) === -1) { st.S.events.push(ev.title); st.save(); }
    modal({
      title: txt(ev.title),
      html: "<b>SYSTEM:</b><br>" + marked(ev.text).replace(/\n/g, "<br>"),
      buttons: ev.options.map(o => ({
        label: o.label,
        cls: o.xp > 0 ? "good" : "",
        fn: () => {
          if (o.xp) { st.addXp(o.xp); xpToast(o.xp); }
          modal({ title: txt(ev.title), html: marked(o.result).replace(/\n/g, "<br>"), buttons: [{ label: "OK" }] });
        }
      }))
    });
  }

  /* fires an event roughly 1 in `odds` calls */
  function maybeEvent(odds) {
    if (Math.random() < 1 / (odds || 9)) { randomEvent(); return true; }
    return false;
  }

  /* ---------------- keyboard ---------------- */

  document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      if (mOpen) {
        const b = modals.querySelector(".btn");
        if (b) { e.preventDefault(); b.click(); }
        return;
      }
      if (activeDialogue) { e.preventDefault(); activeDialogue.advance(); return; }
    }
    // A-D answer the visible question
    const k = "abcdef".indexOf((e.key || "").toLowerCase());
    if (k >= 0 && !mOpen) {
      const opts = panel.querySelectorAll(".opts");
      if (opts.length) {
        const last = opts[opts.length - 1].querySelectorAll(".opt");
        if (last[k] && !last[k].disabled) last[k].click();
      }
    }
  });

  window.RX.ui = {
    txt, esc, marked, el, box, panel, clearPanel,
    hud, setWorld, setHint, setTitle, showSanity,
    toast, xpToast, flash, pick,
    modal, memory, fakeError,
    dialogue, ask, loading,
    randomEvent, maybeEvent
  };
})();
