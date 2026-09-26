/* Catch My Hearts — arcade game on a canvas. */

(function () {
  "use strict";

  const { $, store, sfx, confetti, messageFor } = window.APP;

  const canvas   = $("catchCanvas");
  const ctx      = canvas.getContext("2d");
  const startBox = $("catchStart");
  const overBox  = $("catchOver");
  const scoreEl  = $("catchScore");
  const bestEl   = $("catchBest");
  const livesEl  = $("catchLives");

  const W = 600, H = 800;            // logical resolution; canvas scales to fit
  const BASKET_W = 96, BASKET_H = 56;
  const MAX_FALL = 330;              // ceiling on how fast anything can drop

  let best = parseInt(store.get("bd_catch_best", "0"), 10) || 0;
  bestEl.textContent = best;

  const state = {
    running: false,
    score: 0,
    lives: 3,
    elapsed: 0,
    spawnTimer: 0,
    basketX: W / 2,
    targetX: W / 2,
    doomTimer: 0,
    items: [],
    pops: []
  };

  /* ---------- canvas sizing (letterboxed, DPR aware) ---------- */

  let view = { scale: 1, offX: 0, offY: 0 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const scale = Math.min(rect.width / W, rect.height / H);
    view = {
      scale: scale * dpr,
      offX: ((rect.width - W * scale) / 2) * dpr,
      offY: ((rect.height - H * scale) / 2) * dpr
    };
  }
  window.addEventListener("resize", resize);

  /* ---------- item kinds ---------- */

  const KINDS = [
    { id: "heart", weight: 62, points: 10,  r: 26, color: "#F4696D" },
    { id: "gold",  weight: 10, points: 50,  r: 24, color: "#F6C244" },
    { id: "gift",  weight: 8,  points: 0,   r: 26, color: "#A9D4DC" },
    { id: "bomb",  weight: 20, points: 0,   r: 25, color: "#6B5B74" }
  ];
  const TOTAL_WEIGHT = KINDS.reduce((sum, k) => sum + k.weight, 0);

  /* The overthinking cloud. Not in the weighted pool — it comes back on its own
     timer, one at a time, and catching it ends the run then and there. */
  const DOOM = { id: "doom", points: 0, r: 30, color: "#8E86A6" };
  const DOOM_FIRST = 6;              // seconds before the first one shows up
  const DOOM_GAP_MAX = 8.5;          // gap between clouds early on
  const DOOM_GAP_MIN = 4;            // ...and once he's been playing a while

  function pickKind() {
    let roll = Math.random() * TOTAL_WEIGHT;
    for (const k of KINDS) {
      roll -= k.weight;
      if (roll <= 0) return k;
    }
    return KINDS[0];
  }

  function spawn() {
    const kind = pickKind();
    state.items.push({
      kind,
      x: kind.r + 14 + Math.random() * (W - 2 * (kind.r + 14)),
      y: -kind.r,
      /* gentle ramp, and never faster than MAX_FALL so late rounds stay playable */
      vy: Math.min(MAX_FALL, 120 + Math.random() * 45 + state.elapsed * 4.5),
      wobble: Math.random() * Math.PI * 2,
      rot: (Math.random() - 0.5) * 1.6
    });
  }

  function spawnDoom() {
    state.items.push({
      kind: DOOM,
      x: DOOM.r + 20 + Math.random() * (W - 2 * (DOOM.r + 20)),
      y: -DOOM.r,
      /* slower than the hearts, and it drifts — it should always be dodgeable */
      vy: Math.min(MAX_FALL * 0.62, 105 + state.elapsed * 2),
      vx: (Math.random() < 0.5 ? -1 : 1) * (26 + Math.random() * 34),
      wobble: Math.random() * Math.PI * 2,
      rot: 0
    });
  }

  function hasDoom() {
    return state.items.some((it) => it.kind.id === "doom");
  }

  function resetDoomTimer(first) {
    const ramp = Math.min(1, state.elapsed / 70);
    state.doomTimer = first
      ? DOOM_FIRST
      : DOOM_GAP_MAX - (DOOM_GAP_MAX - DOOM_GAP_MIN) * ramp;
  }

  /* ---------- drawing ---------- */

  function heartPath(c, size) {
    c.beginPath();
    c.moveTo(0, size * 0.75);
    c.bezierCurveTo(-size * 1.5, -size * 0.45, -size * 0.5, -size * 1.5, 0, -size * 0.6);
    c.bezierCurveTo(size * 0.5, -size * 1.5, size * 1.5, -size * 0.45, 0, size * 0.75);
    c.closePath();
  }

  function drawItem(item) {
    const { kind } = item;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(Math.sin(item.wobble) * 0.25);

    if (kind.id === "heart" || kind.id === "gold") {
      ctx.fillStyle = kind.color;
      ctx.shadowColor = "rgba(0,0,0,.14)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      heartPath(ctx, kind.r);
      ctx.fill();
      ctx.shadowColor = "transparent";
      /* shine */
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.beginPath();
      ctx.ellipse(-kind.r * 0.42, -kind.r * 0.45, kind.r * 0.2, kind.r * 0.3, -0.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (kind.id === "doom") {
      const s = kind.r;
      /* a small rain cloud: three puffs, a flat base, a few drops */
      ctx.shadowColor = "rgba(0,0,0,.16)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = kind.color;
      ctx.beginPath();
      ctx.arc(-s * 0.52, 0, s * 0.48, 0, Math.PI * 2);
      ctx.arc(0, -s * 0.28, s * 0.62, 0, Math.PI * 2);
      ctx.arc(s * 0.58, 0, s * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-s, -s * 0.05, s * 2, s * 0.5);
      ctx.shadowColor = "transparent";

      ctx.fillStyle = "rgba(255,255,255,.4)";
      ctx.beginPath();
      ctx.ellipse(-s * 0.3, -s * 0.5, s * 0.26, s * 0.14, -0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(110,100,135,.75)";
      for (let d = -1; d <= 1; d++) {
        const drop = ((item.wobble * 22) % 16) + 8;
        ctx.beginPath();
        ctx.ellipse(d * s * 0.5, s * 0.45 + drop * 0.5, s * 0.08, s * 0.17, 0, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (kind.id === "gift") {
      const s = kind.r;
      ctx.fillStyle = kind.color;
      ctx.fillRect(-s, -s * 0.8, s * 2, s * 1.6);
      ctx.fillStyle = "#F4696D";
      ctx.fillRect(-s * 0.18, -s * 0.8, s * 0.36, s * 1.6);
      ctx.fillRect(-s, -s * 0.18, s * 2, s * 0.36);

    } else {
      /* broken heart: two halves pulled apart */
      ctx.fillStyle = kind.color;
      ctx.save(); ctx.translate(-4, 0); ctx.rotate(-0.22);
      ctx.beginPath();
      ctx.moveTo(0, kind.r * 0.75);
      ctx.bezierCurveTo(-kind.r * 1.5, -kind.r * 0.45, -kind.r * 0.5, -kind.r * 1.5, 0, -kind.r * 0.6);
      ctx.lineTo(0, kind.r * 0.75);
      ctx.fill();
      ctx.restore();
      ctx.save(); ctx.translate(4, 0); ctx.rotate(0.22);
      ctx.beginPath();
      ctx.moveTo(0, kind.r * 0.75);
      ctx.bezierCurveTo(kind.r * 1.5, -kind.r * 0.45, kind.r * 0.5, -kind.r * 1.5, 0, -kind.r * 0.6);
      ctx.lineTo(0, kind.r * 0.75);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawBasket() {
    const x = state.basketX, y = H - BASKET_H - 16;
    ctx.save();
    ctx.translate(x, y);

    /* woven basket */
    ctx.fillStyle = "#E0A971";
    ctx.beginPath();
    ctx.moveTo(-BASKET_W / 2, 0);
    ctx.lineTo(BASKET_W / 2, 0);
    ctx.lineTo(BASKET_W / 2 - 12, BASKET_H);
    ctx.lineTo(-BASKET_W / 2 + 12, BASKET_H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      const t = i / 4;
      const halfW = BASKET_W / 2 - 12 * t;
      ctx.beginPath();
      ctx.moveTo(-halfW, BASKET_H * t);
      ctx.lineTo(halfW, BASKET_H * t);
      ctx.stroke();
    }

    /* rim */
    ctx.fillStyle = "#C98E5B";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-BASKET_W / 2 - 5, -12, BASKET_W + 10, 16, 8);
    } else {
      ctx.rect(-BASKET_W / 2 - 5, -12, BASKET_W + 10, 16);
    }
    ctx.fill();
    ctx.restore();
  }

  function drawPops() {
    for (const p of state.pops) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.font = "700 30px Quicksand, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    }
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.offX, view.offY);

    state.items.forEach(drawItem);
    drawBasket();
    drawPops();
  }

  /* ---------- game loop ---------- */

  let last = 0, loopId = 0;

  function loop(now) {
    if (!state.running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    state.elapsed += dt;

    /* basket easing toward pointer */
    state.basketX += (state.targetX - state.basketX) * Math.min(1, dt * 20);
    state.basketX = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, state.basketX));

    /* spawning speeds up over time */
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawn();
      state.spawnTimer = Math.max(0.46, 1.1 - state.elapsed * 0.011);
    }

    /* the cloud keeps coming back, but only ever one at a time */
    state.doomTimer -= dt;
    if (state.doomTimer <= 0 && !hasDoom()) {
      spawnDoom();
      resetDoomTimer(false);
    }

    const catchY = H - BASKET_H - 16;

    for (let i = state.items.length - 1; i >= 0; i--) {
      const it = state.items[i];
      it.y += it.vy * dt;
      it.wobble += dt * 3;

      /* only the cloud drifts sideways; it bounces off the walls */
      if (it.vx) {
        it.x += it.vx * dt;
        const edge = it.kind.r + 10;
        if (it.x < edge)         { it.x = edge;     it.vx = Math.abs(it.vx); }
        else if (it.x > W - edge) { it.x = W - edge; it.vx = -Math.abs(it.vx); }
      }

      const caught =
        it.y + it.kind.r * 0.5 >= catchY &&
        it.y - it.kind.r * 0.5 <= catchY + BASKET_H &&
        Math.abs(it.x - state.basketX) < BASKET_W / 2 + it.kind.r * 0.45;

      if (caught) {
        state.items.splice(i, 1);
        collect(it);
      } else if (it.y - it.kind.r > H) {
        state.items.splice(i, 1);
      }
    }

    for (let i = state.pops.length - 1; i >= 0; i--) {
      const p = state.pops[i];
      p.y -= dt * 60;
      p.life -= dt * 1.4;
      if (p.life <= 0) state.pops.splice(i, 1);
    }

    render();
    loopId = requestAnimationFrame(loop);
  }

  function pop(text, x, y, color) {
    state.pops.push({ text, x, y, color, life: 1 });
  }

  function collect(item) {
    const id = item.kind.id;

    if (id === "doom") {
      pop("oh no", item.x, item.y, "#6E6487");
      render();
      return gameOver(true);
    }

    if (id === "bomb") {
      state.lives--;
      sfx.bad();
      pop("-1", item.x, item.y, "#8B7B95");
      paintLives();
      if (state.lives <= 0) return gameOver();
      return;
    }

    if (id === "gift") {
      state.lives = Math.min(MAX_LIVES, state.lives + 1);
      sfx.good();
      pop("+1 life", item.x, item.y, "#4FA97A");
      paintLives();
      return;
    }

    state.score += item.kind.points;
    scoreEl.textContent = state.score;
    sfx.pop();
    pop("+" + item.kind.points, item.x, item.y, id === "gold" ? "#D9A21B" : "#F4696D");
    if (id === "gold") confetti(18);
  }

  const MAX_LIVES = 5;

  function paintLives() {
    livesEl.textContent = "";
    for (let i = 0; i < MAX_LIVES; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "ico" + (i < state.lives ? "" : " is-lost"));
      svg.setAttribute("aria-hidden", "true");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#ico-heart");
      svg.appendChild(use);
      livesEl.appendChild(svg);
    }
  }

  /* ---------- start / end ---------- */

  function start() {
    resize();
    state.running = true;
    state.score = 0;
    state.lives = 3;
    state.elapsed = 0;
    state.spawnTimer = 0.4;
    state.items = [];
    state.pops = [];
    state.basketX = state.targetX = W / 2;
    resetDoomTimer(true);

    scoreEl.textContent = "0";
    paintLives();
    startBox.classList.remove("is-active");
    overBox.classList.remove("is-active");

    last = performance.now();
    cancelAnimationFrame(loopId);
    loopId = requestAnimationFrame(loop);
  }

  function gameOver(caughtCloud) {
    state.running = false;
    cancelAnimationFrame(loopId);
    sfx.bad();

    if (state.score > best) {
      best = state.score;
      bestEl.textContent = best;
      store.set("bd_catch_best", String(best));
      confetti(80);
    }

    $("catchFinal").textContent = state.score;
    $("catchMsg").textContent = caughtCloud
      ? DATA.catchCloudMessage
      : messageFor(DATA.catchMessages, state.score);
    $("catchOverTitle").textContent = caughtCloud ? "You caught the cloud" : "Game over";
    overBox.classList.add("is-active");
  }

  function stop() {
    state.running = false;
    cancelAnimationFrame(loopId);
  }

  /* ---------- input ---------- */

  function pointerX(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / W, rect.height / H);
    const offX = (rect.width - W * scale) / 2;
    return (clientX - rect.left - offX) / scale;
  }

  canvas.addEventListener("pointermove", (e) => {
    if (!state.running) return;
    state.targetX = pointerX(e.clientX);
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (!state.running) return;
    canvas.setPointerCapture(e.pointerId);
    state.targetX = pointerX(e.clientX);
  });

  document.addEventListener("keydown", (e) => {
    if (!state.running) return;
    if (e.key === "ArrowLeft")  { state.targetX -= 55; e.preventDefault(); }
    if (e.key === "ArrowRight") { state.targetX += 55; e.preventDefault(); }
    state.targetX = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, state.targetX));
  });

  paintLives();
  $("catchPlay").addEventListener("click", start);
  $("catchAgain").addEventListener("click", start);

  window.APP.on("enter", "catch", () => {
    resize();
    render();
    /* don't stack the start card on top of a game-over card he walked away from */
    if (!state.running && !overBox.classList.contains("is-active")) {
      startBox.classList.add("is-active");
    }
  });
  window.APP.on("leave", "catch", stop);
})();
