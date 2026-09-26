/* ============================================================
   A Day With Me

   Three rooms, four things to find in each. Tap the right thing and
   Rithu walks over, picks it up and says something. Tap the wrong one
   and it costs three seconds and a look.

   There is deliberately no way to lose: when the clock runs out the
   scene just ends and the day moves on, so the dance at the end is
   always reachable. Every word he reads comes from js/data.js.
   ============================================================ */

(function () {
  "use strict";

  const { $, store, sfx, confetti, messageFor, reduced } = window.APP;

  const stage      = $("dayStage");
  const bgUse      = $("dayBgUse");
  const objLayer   = $("dayObjs");
  const rithuHost  = $("dayRithu");
  const bubble     = $("dayBubble");
  const bubbleText = $("dayBubbleText");
  const list       = $("dayList");
  const sceneName  = $("daySceneName");

  const startBox = $("dayStart");
  const cardBox  = $("dayCard");
  const endBox   = $("dayEnd");

  const WRONG_PENALTY = 3;      // seconds
  const HOLD_MS       = 1400;   // how long she shows off what she found

  let rig = null;               // the .rithu <g> in the scene
  let danceRig = null;          // the bigger one on the finale card

  const state = {
    scene: 0,
    found: 0,          // in the current scene
    totalFound: 0,
    timeLeft: 0,
    timeBanked: 0,     // seconds left across finished scenes
    totalTime: 0,      // seconds available across finished scenes
    rithuX: 50,
    running: false
  };

  let tickId = 0;
  let actionId = 0;   // the walk -> pick-up chain
  let poseId = 0;     // the little "hmm" after a wrong tap
  let bubbleId = 0;
  let busy = false;   // true while she is walking to something
  let pending = null; // an item she is on her way to collect

  /* ---------- helpers ---------- */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pose(name) {
    if (rig) rig.setAttribute("data-pose", name);
  }

  function say(text, ms) {
    bubbleText.textContent = text;
    bubble.hidden = false;
    bubble.style.animation = "none";
    void bubble.offsetWidth;            // replay the pop-in
    bubble.style.animation = "";
    bubble.style.left = state.rithuX + "%";
    clearTimeout(bubbleId);
    bubbleId = setTimeout(() => { bubble.hidden = true; }, ms || 1800);
  }

  /* Walks her to a percentage across the room, then calls back. */
  function walkTo(x, done) {
    const dist = Math.abs(x - state.rithuX);
    const ms = reduced ? 0 : Math.min(1100, Math.max(260, dist * 17));

    rithuHost.querySelector(".rithu-svg")
      .classList.toggle("is-flipped", x < state.rithuX);

    state.rithuX = x;
    rithuHost.style.transitionDuration = ms + "ms";
    rithuHost.style.left = x + "%";
    if (ms > 0) pose("walk");

    clearTimeout(actionId);
    actionId = setTimeout(done, ms);
  }

  /* ---------- building a scene ---------- */

  function paintList(scene) {
    list.innerHTML = "";
    scene.tasks.forEach((t) => {
      const li = document.createElement("li");
      li.className = "day-list__item";
      li.id = "daytask-" + t.id;
      li.innerHTML =
        '<svg class="ico" aria-hidden="true"><use href="#ico-heart"></use></svg>' +
        "<span></span>";
      li.querySelector("span").textContent = t.label;
      list.appendChild(li);
    });
  }

  function paintObjects(scene) {
    objLayer.innerHTML = "";
    const all = shuffle(
      scene.tasks.map((t) => ({ ...t, isTask: true }))
        .concat(scene.decoys.map((d) => ({ ...d, isTask: false })))
    );

    all.forEach((o) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-obj";
      btn.style.left = o.x + "%";
      btn.style.top = o.y + "%";
      btn.dataset.id = o.id;
      btn.setAttribute("aria-label", o.isTask ? o.label : "something on the shelf");
      btn.innerHTML =
        '<svg class="day-obj__art" viewBox="0 0 40 40" aria-hidden="true">' +
        '<use href="#it-' + o.id + '"></use></svg>';
      btn.addEventListener("click", () => tap(o, btn));
      objLayer.appendChild(btn);
    });
  }

  function loadScene(i) {
    const scene = DATA.dayScenes[i];
    state.scene = i;
    state.found = 0;
    state.timeLeft = scene.seconds;

    bgUse.setAttribute("href", "#scene-" + scene.id);
    sceneName.textContent = scene.name;
    paintList(scene);
    paintObjects(scene);

    state.rithuX = 50;
    rithuHost.style.transitionDuration = "0ms";
    rithuHost.style.left = "50%";
    rithuHost.querySelector(".rithu-svg").classList.remove("is-flipped");
    pose("idle");

    $("dayScene").textContent = String(i + 1);
    $("dayFound").textContent = String(state.totalFound);
    paintTime();

    state.running = true;
    clearInterval(tickId);
    tickId = setInterval(tick, 1000);

    say(scene.intro, 2600);
  }

  function paintTime() {
    $("dayTime").textContent = String(Math.max(0, state.timeLeft));
    $("dayTimeStat").classList.toggle("is-low", state.timeLeft <= 10);
  }

  /* ---------- playing ---------- */

  function tick() {
    if (!state.running) return;
    state.timeLeft--;
    paintTime();
    if (state.timeLeft <= 0) endScene();
  }

  function tap(o, btn) {
    if (!state.running) return;

    if (!o.isTask) {
      btn.classList.remove("is-wrong");
      void btn.offsetWidth;                 // restart the shake
      btn.classList.add("is-wrong");
      state.timeLeft = Math.max(0, state.timeLeft - WRONG_PENALTY);
      paintTime();
      sfx.bad();
      say(o.line || DATA.dayWrongLines[(Math.random() * DATA.dayWrongLines.length) | 0]);
      if (!busy) {
        pose("think");
        clearTimeout(poseId);
        poseId = setTimeout(() => { if (!busy) pose("idle"); }, 900);
      }
      if (state.timeLeft <= 0) endScene();
      return;
    }

    /* correct — she goes and gets it */
    collect();                 // finish whatever she was already fetching
    btn.disabled = true;
    state.found++;
    state.totalFound++;
    $("dayFound").textContent = String(state.totalFound);

    const item = $("daytask-" + o.id);
    if (item) item.classList.add("is-done");

    pending = { btn: btn, line: o.line };
    busy = true;

    walkTo(o.x, () => {
      busy = false;
      collect();
      pose("hold");
      actionId = setTimeout(() => {
        pose("idle");
        if (state.found >= DATA.dayScenes[state.scene].tasks.length) endScene();
      }, HOLD_MS);
    });
  }

  /* Takes the item she was walking towards: pops it off the shelf,
     throws a little confetti and lets her say her line. */
  function collect() {
    if (!pending) return;
    const btn = pending.btn;
    const r = btn.getBoundingClientRect();
    confetti(16, r.left + r.width / 2, r.top + r.height / 2);
    btn.classList.add("is-taken");
    sfx.good();
    say(pending.line, HOLD_MS + 300);
    pending = null;
  }

  function endScene() {
    if (!state.running) return;
    state.running = false;
    clearInterval(tickId);
    clearTimeout(actionId);

    const scene = DATA.dayScenes[state.scene];
    state.timeBanked += Math.max(0, state.timeLeft);
    state.totalTime += scene.seconds;
    busy = false;
    pending = null;
    clearTimeout(poseId);
    pose("idle");

    if (state.scene >= DATA.dayScenes.length - 1) {
      finale();
      return;
    }

    $("dayCardTitle").textContent = scene.name;
    $("dayCardText").textContent = DATA.dayScenePass[state.scene] || "On to the next one.";
    cardBox.classList.add("is-active");
  }

  /* ---------- the dance ---------- */

  function score() {
    const totalTasks = DATA.dayScenes.reduce((n, s) => n + s.tasks.length, 0);
    const foundPart = (state.totalFound / totalTasks) * 78;
    const timePart = state.totalTime ? (state.timeBanked / state.totalTime) * 22 : 0;
    return Math.round(foundPart + timePart);
  }

  function finale() {
    const pts = score();
    const best = parseInt(store.get("bd_day_best", "0"), 10) || 0;
    if (pts > best) store.set("bd_day_best", String(pts));

    $("dayFinal").textContent = String(pts);
    $("dayMsg").textContent = messageFor(DATA.dayMessages, pts);
    $("dayFinaleText").textContent = DATA.dayFinale;

    danceRig = window.RITHU.mount($("dayDance"));
    if (danceRig) danceRig.setAttribute("data-pose", "dance");

    endBox.classList.add("is-active");
    sfx.cheer();
    confetti(140);
  }

  /* ---------- lifecycle ---------- */

  function reset() {
    state.scene = 0;
    state.found = 0;
    state.totalFound = 0;
    state.timeBanked = 0;
    state.totalTime = 0;
    state.timeLeft = 0;
    state.rithuX = 50;
    state.running = false;

    clearInterval(tickId);
    clearTimeout(actionId);
    clearTimeout(poseId);
    clearTimeout(bubbleId);
    busy = false;
    pending = null;

    cardBox.classList.remove("is-active");
    endBox.classList.remove("is-active");
    startBox.classList.add("is-active");
    bubble.hidden = true;

    objLayer.innerHTML = "";
    list.innerHTML = "";
    sceneName.textContent = "";
    $("dayScene").textContent = "1";
    $("dayFound").textContent = "0";
    $("dayTime").textContent = String(DATA.dayScenes[0].seconds);
    $("dayTimeStat").classList.remove("is-low");

    rig = window.RITHU.mount(rithuHost);
    rithuHost.style.transitionDuration = "0ms";
    rithuHost.style.left = "50%";
    pose("idle");
  }

  function stop() {
    state.running = false;
    clearInterval(tickId);
    clearTimeout(actionId);
    clearTimeout(poseId);
    clearTimeout(bubbleId);
    busy = false;
    pending = null;
    bubble.hidden = true;
  }

  function begin() {
    startBox.classList.remove("is-active");
    state.totalFound = 0;
    state.timeBanked = 0;
    state.totalTime = 0;
    loadScene(0);
  }

  $("dayPlay").addEventListener("click", begin);
  $("dayAgain").addEventListener("click", () => { reset(); begin(); });
  $("dayNext").addEventListener("click", () => {
    cardBox.classList.remove("is-active");
    loadScene(state.scene + 1);
  });

  window.APP.on("enter", "day", reset);
  window.APP.on("leave", "day", stop);
})();
