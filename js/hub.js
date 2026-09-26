/* Shared app shell: section router, confetti, sound, text injection.
   Exposes window.APP for the other scripts. */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* ---------- tiny safe localStorage ---------- */

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : v; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
    }
  };

  /* ---------- sound ---------- */

  let audioCtx = null;
  let soundOn = store.get("bd_sound", "1") === "1";

  function ctx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  /* one short note; used to build blips, chimes and sad little boops */
  function tone(freq, duration, type, gainPeak, delay) {
    if (!soundOn) return;
    const ac = ctx();
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.18, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  const sfx = {
    pop()    { tone(660, 0.12, "triangle", 0.2); },
    good()   { tone(660, 0.12, "triangle", 0.2); tone(880, 0.18, "triangle", 0.18, 0.09); },
    bad()    { tone(200, 0.22, "sawtooth", 0.12); },
    cheer()  { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, "triangle", 0.16, i * 0.11)); },
    blowout(){ tone(140, 0.5, "sine", 0.1); }
  };

  const soundBtn = $("soundToggle");
  const soundIcon = $("soundIcon");
  function paintSound() {
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundIcon.setAttribute("href", soundOn ? "#ico-sound-on" : "#ico-sound-off");
  }
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    store.set("bd_sound", soundOn ? "1" : "0");
    paintSound();
    if (soundOn) sfx.pop();
  });
  paintSound();

  /* ---------- confetti ---------- */

  const cvs = $("confetti");
  const cctx = cvs.getContext("2d");
  let bits = [];
  let confettiRAF = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function sizeConfetti() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = Math.floor(window.innerWidth * dpr);
    cvs.height = Math.floor(window.innerHeight * dpr);
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeConfetti();
  window.addEventListener("resize", sizeConfetti);

  const CONFETTI_COLORS = ["#F4696D", "#A9D4DC", "#F6C244", "#B2D3CC", "#ffffff", "#FF9FB0"];

  function confetti(count, originX, originY) {
    if (reduced) return;
    const n = count || 90;
    const ox = originX == null ? window.innerWidth / 2 : originX;
    const oy = originY == null ? window.innerHeight * 0.4 : originY;

    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      bits.push({
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        heart: Math.random() < 0.35,
        life: 1
      });
    }
    if (!confettiRAF) confettiRAF = requestAnimationFrame(stepConfetti);
  }

  function stepConfetti() {
    cctx.clearRect(0, 0, cvs.width, cvs.height);

    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.vy += 0.22;          // gravity
      b.vx *= 0.995;
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.spin;
      b.life -= 0.006;

      if (b.life <= 0 || b.y > window.innerHeight + 40) { bits.splice(i, 1); continue; }

      cctx.save();
      cctx.translate(b.x, b.y);
      cctx.rotate(b.rot);
      cctx.globalAlpha = Math.max(0, Math.min(1, b.life));
      cctx.fillStyle = b.color;
      if (b.heart) {
        const s = b.size / 10;
        cctx.beginPath();
        cctx.moveTo(0, 3 * s);
        cctx.bezierCurveTo(-6 * s, -3 * s, -2 * s, -8 * s, 0, -4 * s);
        cctx.bezierCurveTo(2 * s, -8 * s, 6 * s, -3 * s, 0, 3 * s);
        cctx.fill();
      } else {
        cctx.fillRect(-b.size / 2, -b.size / 4, b.size, b.size / 2);
      }
      cctx.restore();
    }

    if (bits.length) {
      confettiRAF = requestAnimationFrame(stepConfetti);
    } else {
      cctx.clearRect(0, 0, cvs.width, cvs.height);
      confettiRAF = 0;
    }
  }

  /* ---------- section router ---------- */

  const SCREENS = ["cake", "hub", "catch", "quiz", "day"];
  let current = "cake";
  const listeners = { enter: {}, leave: {} };

  function on(event, screen, fn) {
    (listeners[event][screen] = listeners[event][screen] || []).push(fn);
  }
  function fire(event, screen) {
    (listeners[event][screen] || []).forEach((fn) => fn());
  }

  function show(name) {
    if (!SCREENS.includes(name) || name === current) return;
    fire("leave", current);

    SCREENS.forEach((s) => {
      const el = $("screen-" + s);
      const active = s === name;
      el.hidden = !active;
      el.classList.toggle("is-active", active);
    });

    /* two nav chips only: the cake, and everything else ("let's play") */
    const group = name === "cake" ? "cake" : "play";
    document.querySelectorAll(".nav__links button").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.group === group);
    });

    current = name;
    fire("enter", name);
  }

  /* any element with data-goto navigates */
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-goto]");
    if (!target) return;
    sfx.pop();
    show(target.dataset.goto);
  });

  /* ---------- pick a message by score threshold ---------- */

  function messageFor(list, value) {
    for (const entry of list) {
      if (value < entry.under) return entry.text;
    }
    return list.length ? list[list.length - 1].text : "";
  }

  /* ---------- inject the personal copy from data.js ---------- */

  function text(id, value) {
    const el = $(id);
    if (el && value != null) el.textContent = value;
  }

  text("kicker", DATA.kicker);
  text("title1", DATA.titleLine1);
  text("title2", DATA.titleLine2);
  text("cakeText", DATA.cakePrompt);
  text("hubTitle1", DATA.hubTitle1);
  text("hubTitle2", DATA.hubTitle2);
  text("hubMessage", DATA.hubMessage);
  text("signature", DATA.signature);
  text("catchTitle", DATA.catchTitle);
  text("catchBlurb", DATA.catchBlurb);
  text("catchHeading", DATA.catchTitle);
  text("quizTitle", DATA.quizTitle);
  text("quizBlurb", DATA.quizBlurb);
  text("quizHeading", DATA.quizTitle);
  text("dayTitle", DATA.dayTitle);
  text("dayBlurb", DATA.dayBlurb);
  text("dayHeading", DATA.dayTitle);
  text("dayStartTitle", DATA.dayTitle);
  text("dayStartText", DATA.dayIntro);
  text("exeTitle", DATA.exeTitle);
  text("exeBlurb", DATA.exeBlurb);

  window.APP = { $, show, on, store, sfx, confetti, messageFor, reduced };
})();
