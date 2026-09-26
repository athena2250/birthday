/* Cake screen: blow out the candle with the microphone, or just tap it. */

(function () {
  "use strict";

  const { $, sfx, confetti, show } = window.APP;

  const cake     = $("cake");
  const hit      = $("cakeHit");
  const micBtn   = $("micBtn");
  const micLabel = $("micLabel");
  const toHub    = $("toHub");
  const cakeText = $("cakeText");
  const hintEl   = $("cakeHint");
  const meter    = $("meter");
  const meterFill= $("meterFill");
  const flame    = $("flame");

  let isOut = false;
  let stream = null;
  let rafId = 0;

  /* personalise the prompt with his name */
  if (DATA.name) {
    cakeText.textContent = "Make a wish, " + DATA.name + ", then blow out the candle.";
  }

  /* ---------- the payoff ---------- */

  function blowOut() {
    if (isOut) return;
    isOut = true;

    /* the mic loop writes an inline transform on the flame; clear it so the
       .is-out CSS transition can actually take over */
    flame.style.transform = "";
    cake.classList.add("is-out");
    stopMic();

    sfx.blowout();
    setTimeout(() => sfx.cheer(), 260);

    /* confetti from where the flame was */
    const box = flame.getBoundingClientRect();
    confetti(130, box.left + box.width / 2, box.top);
    setTimeout(() => confetti(70), 450);

    cakeText.textContent = DATA.cakeDone;
    hintEl.textContent = "";
    micBtn.classList.add("is-hidden");
    toHub.classList.remove("is-hidden");
    meter.classList.remove("is-live");

    /* let him linger on the cake — no auto-advance */
  }

  hit.addEventListener("click", blowOut);

  /* ---------- microphone ---------- */

  function stopMic() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }

  function micUnavailable(reason) {
    micBtn.classList.add("is-hidden");
    hintEl.textContent = reason;
  }

  async function startMic() {
    const AC = window.AudioContext || window.webkitAudioContext;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !AC) {
      micUnavailable("Your browser won't share the mic here — tap the flame instead.");
      return;
    }

    micBtn.disabled = true;
    micLabel.textContent = "Listening…";

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      });
    } catch (err) {
      /* denied, no device, or insecure context — fall back silently */
      micBtn.disabled = false;
      micUnavailable("No mic? No problem — just tap the flame.");
      return;
    }

    const ac = new AC();
    if (ac.state === "suspended") await ac.resume();

    const source = ac.createMediaStreamSource(stream);
    const analyser = ac.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.55;
    source.connect(analyser);

    const bins = new Uint8Array(analyser.frequencyBinCount);
    const binHz = ac.sampleRate / analyser.fftSize;
    /* blowing is broadband low-frequency rush: look under ~600Hz */
    const lowCount = Math.max(4, Math.min(bins.length, Math.round(600 / binHz)));

    const THRESHOLD = 52;      // 0-255 average magnitude
    const HOLD_MS = 220;       // must be sustained, so talking doesn't count
    let sustainedSince = 0;

    micLabel.textContent = "Blow now!";
    hintEl.textContent = "Blow into your mic — or tap the flame.";
    meter.classList.add("is-live");

    function tick(now) {
      if (isOut) return;
      analyser.getByteFrequencyData(bins);

      let sum = 0;
      for (let i = 0; i < lowCount; i++) sum += bins[i];
      const level = sum / lowCount;

      /* live feedback: meter + flame leaning away from the breath */
      const pct = Math.min(100, (level / (THRESHOLD * 1.6)) * 100);
      meterFill.style.width = pct + "%";
      const lean = Math.min(26, level / 3);
      flame.style.transform = "translateX(-50%) rotate(" + lean + "deg) scaleY(" +
        (1 - Math.min(0.45, level / 260)) + ")";

      if (level > THRESHOLD) {
        if (!sustainedSince) sustainedSince = now;
        if (now - sustainedSince > HOLD_MS) { blowOut(); return; }
      } else {
        sustainedSince = 0;
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  micBtn.addEventListener("click", startMic);

  /* stop listening if he wanders off the cake screen */
  window.APP.on("leave", "cake", stopMic);
})();
