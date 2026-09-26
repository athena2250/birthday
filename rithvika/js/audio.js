/* ============================================================
   audio.js — every sound is generated in the browser.
   No files, no copyright, no 404s. Chunky little square waves.
   ============================================================ */

(function () {
  "use strict";

  let ac = null;
  let master = null;
  let on = true;
  try { on = localStorage.getItem("rx_sound") !== "0"; } catch (e) {}

  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.5;
      master.connect(ac.destination);
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  }

  /* one note */
  function note(freq, dur, type, vol, delay, slideTo) {
    if (!on) return;
    const a = ctx(); if (!a) return;
    const t = a.currentTime + (delay || 0);
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.14, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function noise(dur, vol, delay) {
    if (!on) return;
    const a = ctx(); if (!a) return;
    const t = a.currentTime + (delay || 0);
    const len = Math.max(1, Math.floor(a.sampleRate * dur));
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource(); src.buffer = buf;
    const g = a.createGain(); g.gain.value = vol || 0.08;
    src.connect(g).connect(master);
    src.start(t);
  }

  const sfx = {
    click()   { note(420, 0.05, "square", 0.10); note(620, 0.05, "square", 0.08, 0.03); },
    select()  { note(880, 0.07, "square", 0.10); note(1180, 0.09, "square", 0.08, 0.05); },
    hover()   { note(700, 0.03, "square", 0.04); },
    xp()      { [784, 988, 1175].forEach((f, i) => note(f, 0.10, "square", 0.10, i * 0.055)); },
    big()     { [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, 0.16, "square", 0.11, i * 0.07)); },
    error()   { note(180, 0.18, "sawtooth", 0.13); note(120, 0.26, "sawtooth", 0.13, 0.12); },
    wrong()   { note(300, 0.10, "square", 0.10); note(180, 0.22, "square", 0.10, 0.09); },
    hit()     { noise(0.12, 0.10); note(140, 0.14, "sawtooth", 0.10, 0, 60); },
    boss()    { note(70, 0.7, "sawtooth", 0.12, 0, 48); noise(0.3, 0.06); },
    memory()  { [659, 880, 1047, 1319].forEach((f, i) => note(f, 0.3, "triangle", 0.09, i * 0.10)); },
    level()   { [392, 523, 659, 784, 1047].forEach((f, i) => note(f, 0.22, "square", 0.10, i * 0.08)); },
    boot()    { note(220, 0.1, "square", 0.08); note(330, 0.1, "square", 0.08, 0.1); note(440, 0.2, "square", 0.09, 0.2); },
    type()    { note(1200 + Math.random() * 300, 0.012, "square", 0.025); },
    door()    { noise(0.35, 0.09); note(90, 0.5, "sine", 0.10, 0, 200); },
    step()    { noise(0.04, 0.03); },
    warm()    { [392, 494, 587, 784].forEach((f, i) => note(f, 1.1, "triangle", 0.07, i * 0.22)); },
    save()    { note(1000, 0.05, "square", 0.08); noise(0.22, 0.05, 0.05); note(760, 0.08, "square", 0.07, 0.24); }
  };

  /* ---------------- music: tiny MIDI-ish loops ---------------- */

  const SONGS = {
    // [semitone offsets from A], null = rest
    home:    { root: 220, tempo: 0.20, wave: "triangle",
               mel: [0, 4, 7, 4, 9, 7, 4, 2, 0, 4, 7, 12, 9, 7, 4, null],
               bass:[0, null, 7, null, -3, null, 5, null] },
    office:  { root: 174, tempo: 0.15, wave: "square",
               mel: [0, 0, 3, 5, 3, 0, -2, 0, 0, 0, 3, 5, 7, 5, 3, null],
               bass:[0, 0, 5, 5, 3, 3, -2, -2] },
    grocery: { root: 261, tempo: 0.16, wave: "square",
               mel: [0, 2, 4, 7, 9, 7, 4, 2, 0, 2, 4, 9, 7, 4, 2, 0],
               bass:[0, null, 4, null, 7, null, 4, null] },
    city:    { root: 196, tempo: 0.26, wave: "triangle",
               mel: [0, 3, 7, 10, 7, 3, 0, -2, 0, 3, 7, 12, 10, 7, 3, null],
               bass:[0, null, -5, null, 3, null, -2, null] },
    mind:    { root: 174, tempo: 0.34, wave: "sine",
               mel: [0, 4, 9, 11, 14, 11, 9, 4, 2, 7, 11, 14, 16, 14, 11, 7],
               bass:[0, null, null, null, 4, null, null, null] },
    finale:  { root: 261, tempo: 0.42, wave: "triangle",
               mel: [0, 4, 7, 11, 9, 7, 4, 2, 0, 4, 9, 7, 5, 4, 2, 0],
               bass:[0, null, 5, null, -3, null, 4, null] }
  };

  let timer = null, step = 0, current = null;

  function hz(root, semi) { return root * Math.pow(2, semi / 12); }

  function tick() {
    const s = SONGS[current];
    if (!s || !on) return;
    const m = s.mel[step % s.mel.length];
    const b = s.bass[step % s.bass.length];
    if (m !== null && m !== undefined) note(hz(s.root * 2, m), s.tempo * 0.9, s.wave, 0.045);
    if (b !== null && b !== undefined) note(hz(s.root / 2, b), s.tempo * 1.7, "square", 0.05);
    if (step % 4 === 0) noise(0.05, 0.022);
    step++;
  }

  function music(name) {
    if (current === name) return;
    current = SONGS[name] ? name : null;
    if (timer) { clearInterval(timer); timer = null; }
    step = 0;
    if (!current || !on) return;
    ctx();
    timer = setInterval(tick, SONGS[current].tempo * 1000);
  }

  function musicStop() { current = null; if (timer) { clearInterval(timer); timer = null; } }

  function toggle() {
    on = !on;
    try { localStorage.setItem("rx_sound", on ? "1" : "0"); } catch (e) {}
    if (!on) { if (timer) { clearInterval(timer); timer = null; } }
    else { const c = current; current = null; music(c); sfx.click(); }
    return on;
  }

  window.RX = window.RX || {};
  window.RX.audio = {
    sfx, music, musicStop, toggle,
    get enabled() { return on; },
    resume() { ctx(); }
  };
})();
