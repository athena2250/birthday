/* ============================================================
   world.js — the walk-around engine used by HOME, OFFICE,
   GROCERY and the CITY MAP.

   Everything on the stage lives on a fixed 320 x 180 pixel grid
   and the whole grid is scaled up to fit the window, so the art
   stays crisp and the coordinates in gameData.js never change.

   RX.world.create({
     scene:'home', outfit:'home', spawn:{x,y}, band:{top,bottom},
     hotspots:[{id,x,y,sprite,label,scale,done,onInteract}]
   })
   ============================================================ */

(function () {
  "use strict";

  const px = window.RX.px;
  const au = window.RX.audio;
  const ui = window.RX.ui;

  const stage = document.getElementById("stage");
  const stagewrap = document.getElementById("stagewrap");
  const actors = document.getElementById("actors");
  const bg = document.getElementById("bg");
  const bgc = bg.getContext("2d");
  const dpad = document.getElementById("dpad");

  const W = 320, H = 180;
  let scale = 1;
  let active = null;   // the live world

  /* ---------------- scaling ---------------- */

  function layout() {
    const availW = stagewrap.parentElement.clientWidth - 4;
    const availH = Math.max(150, window.innerHeight * (window.innerWidth < 760 ? 0.42 : 0.46));
    let s = Math.min(availW / W, availH / H);
    s = Math.max(0.6, Math.round(s * 4) / 4);   // quarter steps keep pixels tidy
    scale = s;
    stage.style.transform = "scale(" + s + ")";
    stagewrap.style.height = Math.round(H * s) + "px";
  }
  window.addEventListener("resize", layout);

  /* ---------------- sprite elements ---------------- */

  function spriteEl(name, scl) {
    const d = px.dims(name);
    const n = ui.el("div", "spr");
    n.style.width = (d.w * scl) + "px";
    n.style.height = (d.h * scl) + "px";
    n.style.backgroundImage = "url(" + px.url(name) + ")";
    return n;
  }

  function place(node, cx, cy) {
    node.style.left = Math.round(cx - parseFloat(node.style.width) / 2) + "px";
    node.style.top = Math.round(cy - parseFloat(node.style.height) / 2) + "px";
    node.style.zIndex = String(Math.round(cy));
  }

  /* ---------------- the world ---------------- */

  function create(cfg) {
    destroy();
    layout();

    document.body.classList.toggle("dreamy", cfg.scene === "mind");
    (px.scenes[cfg.scene] || px.scenes.blank)(bgc);
    actors.innerHTML = "";
    stagewrap.classList.remove("hidden");

    const band = cfg.band || { top: 142, bottom: 172 };
    const xMin = cfg.xMin != null ? cfg.xMin : 14;
    const xMax = cfg.xMax != null ? cfg.xMax : W - 14;
    const pscale = cfg.playerScale || 2;
    const outfit = cfg.outfit || "home";

    /* ---- hotspots ---- */
    const spots = [];
    (cfg.hotspots || []).forEach(h => {
      const scl = h.scale || cfg.spriteScale || 2;
      const node = spriteEl(h.sprite, scl);
      node.classList.add("hot");
      if (h.bob) node.classList.add("bob");
      if (h.done) node.classList.add("done");
      const tag = ui.el("div", "tag", ui.esc(ui.txt(h.label || "")));
      node.appendChild(tag);
      place(node, h.x, h.y);
      node.addEventListener("click", (e) => {
        e.stopPropagation();
        interact(rec);
      });
      actors.appendChild(node);
      const rec = { def: h, node: node, tag: tag };
      spots.push(rec);
    });

    /* ---- player ---- */
    const p = { x: (cfg.spawn && cfg.spawn.x) || 160, y: (cfg.spawn && cfg.spawn.y) || band.bottom,
                frame: 0, facing: 1, moving: false, target: null };
    const pd = px.dims ? { w: 16, h: 26 } : { w: 16, h: 26 };
    const pl = ui.el("div", "spr player");
    pl.style.width = (pd.w * pscale) + "px";
    pl.style.height = (pd.h * pscale) + "px";
    actors.appendChild(pl);

    let animT = 0, walkFrame = 0, stepSfx = 0;

    function paintPlayer() {
      pl.style.backgroundImage = "url(" + px.rithvika(outfit, p.moving ? walkFrame : 0, cfg.hold ? { hold: cfg.hold } : {}) + ")";
      pl.style.left = Math.round(p.x - (pd.w * pscale) / 2) + "px";
      pl.style.top = Math.round(p.y - pd.h * pscale) + "px";
      pl.style.zIndex = String(Math.round(p.y) + 1);
      pl.classList.toggle("flip", p.facing < 0);
      pl.classList.toggle("bob", !p.moving);
    }

    /* ---- input ---- */
    const keys = {};
    function kd(e) {
      const k = e.key.toLowerCase();
      if (["arrowup", "w"].includes(k)) keys.up = 1;
      else if (["arrowdown", "s"].includes(k)) keys.down = 1;
      else if (["arrowleft", "a"].includes(k)) keys.left = 1;
      else if (["arrowright", "d"].includes(k)) keys.right = 1;
      else if (k === "e") { e.preventDefault(); interactNearest(); }
      else return;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) e.preventDefault();
      p.target = null;
    }
    function ku(e) {
      const k = e.key.toLowerCase();
      if (["arrowup", "w"].includes(k)) keys.up = 0;
      if (["arrowdown", "s"].includes(k)) keys.down = 0;
      if (["arrowleft", "a"].includes(k)) keys.left = 0;
      if (["arrowright", "d"].includes(k)) keys.right = 0;
    }
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);

    // on-screen pad
    const padHandlers = [];
    dpad.querySelectorAll(".dp[data-dir]").forEach(b => {
      const dir = b.dataset.dir;
      const down = (e) => { e.preventDefault(); keys[dir] = 1; p.target = null; };
      const up = (e) => { e.preventDefault(); keys[dir] = 0; };
      b.addEventListener("pointerdown", down);
      b.addEventListener("pointerup", up);
      b.addEventListener("pointerleave", up);
      b.addEventListener("pointercancel", up);
      padHandlers.push([b, down, up]);
    });
    const actBtn = document.getElementById("actBtn");
    const actFn = (e) => { e.preventDefault(); interactNearest(); };
    actBtn.addEventListener("click", actFn);

    // tap the floor to walk there
    function stageClick(e) {
      const r = stage.getBoundingClientRect();
      const lx = (e.clientX - r.left) / scale;
      const ly = (e.clientY - r.top) / scale;
      p.target = { x: Math.max(xMin, Math.min(xMax, lx)), y: Math.max(band.top, Math.min(band.bottom, ly)) };
    }
    stage.addEventListener("click", stageClick);

    /* ---- interaction ---- */
    let nearest = null;

    function dist(rec) {
      const d = rec.def;
      const dx = Math.abs(d.x - p.x);
      const dy = Math.abs(Math.min(band.bottom, Math.max(band.top, d.y)) - p.y);
      return dx + dy * 0.7;
    }

    function updateNear() {
      let best = null, bestD = 1e9;
      spots.forEach(rec => {
        const dd = dist(rec);
        if (dd < bestD) { bestD = dd; best = rec; }
      });
      const within = best && bestD < (cfg.reach || 52);
      spots.forEach(rec => rec.node.classList.toggle("near", within && rec === best));
      nearest = within ? best : null;
    }

    function interact(rec) {
      if (!rec) return;
      au.sfx.click();
      if (rec.def.onInteract) rec.def.onInteract(rec, api);
    }
    function interactNearest() { interact(nearest); }

    /* ---- loop ---- */
    let raf = null, last = performance.now();
    function frame(now) {
      const dt = Math.min(48, now - last); last = now;
      let vx = 0, vy = 0;
      if (keys.left) vx -= 1;
      if (keys.right) vx += 1;
      if (keys.up) vy -= 1;
      if (keys.down) vy += 1;

      if (!vx && !vy && p.target) {
        const dx = p.target.x - p.x, dy = p.target.y - p.y;
        if (Math.abs(dx) + Math.abs(dy) < 2) p.target = null;
        else { vx = Math.abs(dx) > 1 ? Math.sign(dx) : 0; vy = Math.abs(dy) > 1 ? Math.sign(dy) : 0; }
      }

      const speed = (cfg.speed || 0.075) * dt;
      if (vx || vy) {
        const len = Math.hypot(vx, vy) || 1;
        p.x = Math.max(xMin, Math.min(xMax, p.x + (vx / len) * speed * 1.4));
        p.y = Math.max(band.top, Math.min(band.bottom, p.y + (vy / len) * speed));
        if (vx) p.facing = vx > 0 ? 1 : -1;
        p.moving = true;
        animT += dt;
        if (animT > 120) { animT = 0; walkFrame = (walkFrame + 1) % 4; }
        stepSfx += dt;
        if (stepSfx > 300) { stepSfx = 0; au.sfx.step(); if (cfg.onStep) cfg.onStep(); }
      } else {
        p.moving = false;
      }

      paintPlayer();
      updateNear();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    paintPlayer();
    updateNear();

    /* ---- public handle ---- */
    const api = {
      spots: spots,
      player: p,
      setDone(id, done) {
        const rec = spots.filter(r => r.def.id === id)[0];
        if (rec) rec.node.classList.toggle("done", done !== false);
      },
      remove(id) {
        const rec = spots.filter(r => r.def.id === id)[0];
        if (rec) { rec.node.remove(); spots.splice(spots.indexOf(rec), 1); }
      },
      add(h) {
        const scl = h.scale || cfg.spriteScale || 2;
        const node = spriteEl(h.sprite, scl);
        node.classList.add("hot");
        const tag = ui.el("div", "tag", ui.esc(ui.txt(h.label || "")));
        node.appendChild(tag);
        place(node, h.x, h.y);
        const rec = { def: h, node: node, tag: tag };
        node.addEventListener("click", (e) => { e.stopPropagation(); interact(rec); });
        actors.appendChild(node);
        spots.push(rec);
        return rec;
      },
      sparkle(x, y) {
        for (let i = 0; i < 5; i++) {
          const s = ui.el("div", "sparkle");
          s.style.left = (x + (Math.random() * 14 - 7)) + "px";
          s.style.top = (y + (Math.random() * 10 - 5)) + "px";
          s.style.animationDelay = (i * 60) + "ms";
          actors.appendChild(s);
          setTimeout(() => s.remove(), 1200);
        }
      },
      hide() { stagewrap.classList.add("hidden"); },
      show() { stagewrap.classList.remove("hidden"); layout(); },
      destroy: cleanup
    };

    function cleanup() {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("keydown", kd);
      document.removeEventListener("keyup", ku);
      stage.removeEventListener("click", stageClick);
      actBtn.removeEventListener("click", actFn);
      padHandlers.forEach(([b, down, up]) => {
        b.removeEventListener("pointerdown", down);
        b.removeEventListener("pointerup", up);
        b.removeEventListener("pointerleave", up);
        b.removeEventListener("pointercancel", up);
      });
      actors.innerHTML = "";
      active = null;
    }

    active = api;
    return api;
  }

  function destroy() { if (active) active.destroy(); }

  /* a still backdrop with no player (menus, mind world, finale) */
  function backdrop(sceneName) {
    destroy();
    layout();
    document.body.classList.toggle("dreamy", sceneName === "mind");
    (px.scenes[sceneName] || px.scenes.blank)(bgc);
    actors.innerHTML = "";
    stagewrap.classList.remove("hidden");
  }

  function hideStage() { destroy(); stagewrap.classList.add("hidden"); }

  window.RX.world = { create, destroy, backdrop, hideStage, layout,
                      get scale() { return scale; }, stage, actors };
})();
