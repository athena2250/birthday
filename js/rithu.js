/* ============================================================
   The character.

   Rithu is drawn once, here, as a rig of named <g> groups. Nothing
   in this file animates or knows about the game — css/style.css moves
   the parts, and js/games/day.js only ever sets data-pose on the root.

   Poses: idle | walk | hold | think | dance
   Facing: .is-flipped on the wrapping <svg> mirrors her.

   Tuning her: every colour is a CSS custom property (--hair, --skin,
   --top-grey ... see :root in style.css), and the shapes below are all
   plain SVG paths on a 120x190 grid with her feet at y=180.
   ============================================================ */

(function () {
  "use strict";

  const SVG = `
  <g class="rithu" data-pose="idle">

    <ellipse class="r-shadow" cx="60" cy="181" rx="29" ry="6"/>

    <!-- the wavy shoulder-length mass; the head and top cover its middle -->
    <g class="r-hair-back">
      <path class="hair" d="M60 10C36 10 21 26 20 47 19 61 18 72 17 83c-1 9 1 14 6 14s8-4 8-9c1 7 4 11 9 11s7-5 8-11c1 7 4 11 9 11s7-5 8-11c1 7 4 11 9 11s7-5 8-11c1 5 3 9 8 9s11-5 13-14c-1-11-2-22-3-36C99 26 84 10 60 10z"/>
      <path class="hair-lite" d="M26 56c-1.5 12-2.5 21-3 30"/>
      <path class="hair-lite" d="M94 56c1.5 12 2.5 21 3 30"/>
    </g>

    <!-- legs -->
    <g class="r-legs">
      <g class="r-leg-r">
        <path class="jeans" d="M45 124h13l-2 50H46z"/>
        <path class="shoe" d="M44 171h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H44a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/>
      </g>
      <g class="r-leg-l">
        <path class="jeans" d="M62 124h13l1 50H64z"/>
        <path class="shoe" d="M63 171h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H63a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/>
      </g>
    </g>

    <!-- the arm behind the body -->
    <g class="r-arm-r">
      <path class="top" d="M46 85L34 87l-1 17 11 1z"/>
      <path class="skin" d="M44 103l-11-1-1 21h9z"/>
      <circle class="skin" cx="36.5" cy="127" r="5.6"/>
    </g>

    <!-- grey boat-neck top -->
    <g class="r-body">
      <path class="neck" d="M53 74h14v16H53z"/>
      <path class="top" d="M60 82c-11 0-19 3-19 9l-3 29c0 6 6 9 22 9s22-3 22-9l-3-29c0-6-8-9-19-9z"/>
      <!-- the wide, shallow neckline -->
      <path class="skin" d="M47 85c4-2 8-3 13-3s9 1 13 3c-4 4-8 6-13 6s-9-2-13-6z"/>
    </g>

    <!-- head -->
    <g class="r-head">
      <path class="skin" d="M60 19c-16 0-27 12-27 29 0 12 3 21 8 27 5 6 12 9 19 9s14-3 19-9c5-6 8-15 8-27 0-17-11-29-27-29z"/>

      <g class="r-brows">
        <path class="brow" d="M43 46c3-2.5 8-2.5 11-.5"/>
        <path class="brow" d="M66 45.5c3-2 8-2 11 .5"/>
      </g>

      <g class="r-eyes">
        <g class="eye">
          <ellipse class="iris" cx="48" cy="55" rx="4.6" ry="5.6"/>
          <circle class="glint" cx="46.4" cy="53" r="1.6"/>
        </g>
        <g class="eye">
          <ellipse class="iris" cx="72" cy="55" rx="4.6" ry="5.6"/>
          <circle class="glint" cx="70.4" cy="53" r="1.6"/>
        </g>
      </g>

      <path class="nose" d="M60 61v3c0 1-1 2-2 2"/>

      <g class="r-cheeks">
        <ellipse class="cheek" cx="42" cy="65" rx="5.4" ry="3.6"/>
        <ellipse class="cheek" cx="78" cy="65" rx="5.4" ry="3.6"/>
      </g>

      <g class="r-mouth">
        <path class="m-smile" d="M54 70c3 4 9 4 12 0"/>
        <path class="m-grin" d="M53 68h14c0 5-3 8-7 8s-7-3-7-8z"/>
        <path class="m-oh" d="M60 67c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5z"/>
      </g>

      <!-- the parted fringe, over the face; inside the head so it
           moves with every tilt and bob -->
      <g class="r-hair-front">
        <path class="hair" d="M60 17c-17 0-28 12-28 30 0 3 0 6 1 9 2-10 6-17 13-22 9 4 21 5 31 3 6-2 10 1 12 7 1-3 1-5 1-8 0-17-12-19-30-19z"/>
        <path class="hair-lite" d="M46 27c5-3 11-4 17-3"/>
      </g>

      <g class="r-earrings">
        <circle class="gold" cx="34" cy="64" r="2.3"/>
        <circle class="gold" cx="86" cy="64" r="2.3"/>
      </g>
    </g>

    <!-- the arm in front; this is the one that goes up in the "hold" pose -->
    <g class="r-arm-l">
      <path class="top" d="M74 85l12 2 1 17-11 1z"/>
      <path class="skin" d="M76 103l11-1 1 21h-9z"/>
      <circle class="skin" cx="83.5" cy="127" r="5.6"/>
    </g>

    <!-- hearts, only visible while she dances -->
    <g class="r-hearts" aria-hidden="true">
      <path class="heart" d="M18 60c-5-4-8-7-8-11 0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 4-3 7-10 11z"/>
      <path class="heart" d="M102 60c-5-4-8-7-8-11 0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 4-3 7-10 11z"/>
      <path class="heart" d="M60 34c-5-4-8-7-8-11 0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 4-3 7-10 11z"/>
    </g>

  </g>`;

  /* The rig is addressed by class, never id, so the same character can be
     mounted more than once on a page (the scene and the finale dancer). */
  function markup() {
    return SVG;
  }

  /* Drops her into a host element, wrapped in a correctly-sized <svg>. */
  function mount(host) {
    if (!host) return null;
    host.innerHTML =
      '<svg class="rithu-svg" viewBox="0 0 120 190" aria-hidden="true" ' +
      'xmlns="http://www.w3.org/2000/svg">' + markup() + "</svg>";
    return host.querySelector(".rithu");
  }

  window.RITHU = { markup, mount };
})();
