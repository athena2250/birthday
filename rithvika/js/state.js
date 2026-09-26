/* ============================================================
   state.js — the single source of truth.

   Everything the player has done lives in one object (S) which is
   serialised straight into localStorage. Scenes never talk to
   localStorage themselves; they call RX.state.*
   ============================================================ */

(function () {
  "use strict";

  const D = window.GAME_DATA;
  const KEY = "rithvika_exe_save_v1";
  const MAXLVL = 99;

  function fresh() {
    return {
      player: D.player.name,
      xp: 0,
      correct: 0,
      wrong: 0,
      know: 50,             // knowledge points, 0-96
      sanity: D.office.startSanity,
      world: "boot",        // current world id
      unlockedWorlds: ["home"],
      unlockedMemories: [], // memory levels already shown
      seenIntro: {},        // world id -> true
      progress: {
        home:    { objects: [], quiz: 0, done: false },
        office:  { objects: [], npcs: [], pipeline: false, bossHp: D.office.boss.hp, boss: false, done: false },
        grocery: { basket: [], rejected: [], quiz: 0, almondHit: false, done: false },
        city:    { clues: [], answered: [], done: false },
        mind:    { linked: [], done: false },
        final:   { answered: [], score: 0, done: false }
      },
      events: [],           // random events already fired
      startedAt: Date.now(),
      playMs: 0
    };
  }

  let S = fresh();
  const subs = {};

  function on(evt, fn) { (subs[evt] = subs[evt] || []).push(fn); }
  function emit(evt, payload) { (subs[evt] || []).forEach(fn => fn(payload)); }

  /* ---------- derived numbers ---------- */

  const level = () => Math.max(1, Math.min(MAXLVL, Math.floor(S.xp / D.xp.perLevel) + 1));
  const xpIntoLevel = () => S.xp % D.xp.perLevel;
  const knowledge = () => Math.max(0, Math.min(96, Math.round(S.know)));

  function knowledgeStatus() {
    const k = knowledge();
    for (const row of D.knowledgeStatus) if (k < row.under) return row.text;
    return "";
  }

  /* how far through the game, 0-100 */
  function progressPct() {
    const p = S.progress;
    const parts = [
      p.home.objects.length / D.home.objectsNeeded,
      p.home.quiz / D.home.quiz.length,
      p.office.npcs.length / D.office.npcs.length,
      p.office.pipeline ? 1 : 0,
      p.office.boss ? 1 : 0,
      p.grocery.basket.length / D.grocery.needed,
      p.city.answered.length / D.city.locations.length,
      p.mind.linked.length / D.mind.pairs.length,
      p.final.answered.length / D.finale.questions.length,
      p.final.done ? 1 : 0
    ];
    const sum = parts.reduce((a, b) => a + Math.min(1, b || 0), 0);
    return Math.round((sum / parts.length) * 100);
  }

  /* ---------- mutations ---------- */

  function addXp(amount, quipSize) {
    if (!amount) return;
    const before = level();
    S.xp = Math.max(0, S.xp + amount);
    const after = level();
    emit("xp", { amount, total: S.xp });
    if (after > before) emit("level", { level: after, from: before });
    checkMemories();
    save();
  }

  /* n = key from GAME_DATA.xp, e.g. reward("office") */
  function reward(key, quipSize) {
    addXp(D.xp[key] || 0, quipSize);
    return D.xp[key] || 0;
  }

  function penalty(n) {
    S.xp = Math.max(0, S.xp - (n === undefined ? D.xp.wrongPenalty : n));
    emit("xp", { amount: 0, total: S.xp });
    save();
  }

  function addKnow(delta) {
    S.know = Math.max(0, Math.min(96, S.know + delta));
    emit("know", knowledge());
    save();
  }

  /* record an answer. ok = true/false */
  function answer(ok) {
    if (ok) { S.correct++; addKnow(3); }
    else { S.wrong++; addKnow(-4); }
    emit("answer", ok);
    save();
  }

  function setSanity(delta) {
    S.sanity = Math.max(0, Math.min(100, S.sanity + delta));
    emit("sanity", S.sanity);
    save();
    return S.sanity;
  }

  function flagDone(world, key, value) {
    S.progress[world][key] = value === undefined ? true : value;
    save();
  }

  /* add id to a list inside progress if it isn't already there.
     returns true if it was new. */
  function push(world, list, id) {
    const arr = S.progress[world][list];
    if (arr.indexOf(id) !== -1) return false;
    arr.push(id);
    save();
    return true;
  }

  function has(world, list, id) {
    return S.progress[world][list].indexOf(id) !== -1;
  }

  function unlockWorld(id) {
    if (S.unlockedWorlds.indexOf(id) === -1) { S.unlockedWorlds.push(id); save(); }
  }
  const worldUnlocked = (id) => S.unlockedWorlds.indexOf(id) !== -1;

  /* ---------- memories ---------- */

  function checkMemories() {
    const lv = level();
    const due = D.memories.filter(m => m.level <= lv && S.unlockedMemories.indexOf(m.level) === -1);
    due.forEach(m => {
      S.unlockedMemories.push(m.level);
      emit("memory", m);
    });
    if (due.length) save();
  }

  /* force-unlock one memory (used by the finale) */
  function forceMemory(lv) {
    const m = D.memories.filter(x => x.level === lv)[0];
    if (!m) return;
    if (S.unlockedMemories.indexOf(lv) === -1) S.unlockedMemories.push(lv);
    emit("memory", m);
    save();
  }

  const unlockedMemories = () => D.memories.filter(m => S.unlockedMemories.indexOf(m.level) !== -1);

  /* ---------- save / load ---------- */

  let lastSave = Date.now();

  function save() {
    S.playMs += Date.now() - lastSave;
    lastSave = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: play on */ }
    emit("save", S);
  }

  function hasSave() {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const base = fresh();
      // shallow-merge so a save from an older build still boots
      S = Object.assign(base, parsed);
      S.progress = Object.assign(base.progress, parsed.progress || {});
      for (const k in base.progress) {
        S.progress[k] = Object.assign(fresh().progress[k], S.progress[k] || {});
      }
      lastSave = Date.now();
      emit("load", S);
      return true;
    } catch (e) { return false; }
  }

  function reset() {
    S = fresh();
    lastSave = Date.now();
    try { localStorage.removeItem(KEY); } catch (e) {}
    emit("load", S);
  }

  function summary() {
    return {
      file: "RITHVIKA.EXE",
      player: S.player,
      progress: progressPct(),
      xp: S.xp,
      level: level(),
      world: S.world,
      knowledge: knowledge()
    };
  }

  window.RX = window.RX || {};
  window.RX.state = {
    get S() { return S; },
    on, emit,
    level, xpIntoLevel, knowledge, knowledgeStatus, progressPct,
    addXp, reward, penalty, addKnow, answer, setSanity,
    flagDone, push, has, unlockWorld, worldUnlocked,
    checkMemories, forceMemory, unlockedMemories,
    save, load, hasSave, reset, summary,
    MAXLVL
  };
})();
