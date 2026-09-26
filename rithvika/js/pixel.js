/* ============================================================
   pixel.js — all the art.

   Sprites are written as little character grids. One letter = one
   pixel, '.' = transparent. The shared palette is PAL below, so
   'k' is always the outline colour, 'r' is always pink, etc.

   SPRITE NAMES you can use in gameData.js:
     laptop phone notebook bed mirror books headphones desk snacks
     clothes pc usb stickies plant bottle mug
     odesk databricks reports spread coffee clock dashboard door
     npc1 npc2 npc3 npc4
     eggs milk oats ragi flax dates paneer spinach banana curd
     apple carrot chips soda noodles almonds basket
     b_home b_office b_store b_lab b_study b_game b_cafe b_night
     brain heart floppy star
   ============================================================ */

(function () {
  "use strict";

  const PAL = {
    k:"#191a22", d:"#3a3f4a", g:"#8b9095", w:"#ffffff", e:"#e9ecef",
    r:"#ff5f8f", R:"#c2325c", o:"#ff9d3d", y:"#ffd23d", b:"#4a7bd4",
    B:"#1f3d8f", c:"#6fe3d2", n:"#00c46a", N:"#087a45", m:"#8b5a2b",
    M:"#5a3617", s:"#f2c9a0", h:"#2b1e17", p:"#a56cf0", t:"#d8452b",
    u:"#f6e7c8", v:"#b0e07a", x:"#cfd6e0", z:"#1b2030", q:"#7a4a1e"
  };

  /* ---------------- sprite grids ---------------- */

  const SPR = {

    laptop: ["..kkkkkkkkkk..",
             "..kzzzzzzzzk..",
             "..kzccczzzck..",
             "..kzzzzcczzk..",
             "..kzcczzzzzk..",
             "..kzzzzzzzzk..",
             ".kxxxxxxxxxxk.",
             "kxxkkkkkkkkxxk",
             ".kkkkkkkkkkkk."],

    phone: [".kkkkk.",
            "kzzzzzk",
            "kzccczk",
            "kzzzzzk",
            "kzcczzk",
            "kzzzzzk",
            "kzzcczk",
            "kzzzzzk",
            "kzczzck",
            "kzzzzzk",
            "kkkkkkk"],

    notebook: [".kkkkkkkk.",
               ".kRRRRRRk.",
               "kwRwwwwRk.",
               ".kRwkkwRk.",
               "kwRwwwwRk.",
               ".kRwkkwRk.",
               "kwRwwwwRk.",
               ".kRRRRRRk.",
               ".kkkkkkkk."],

    bed: ["kkkkkkkkkkkkkkkkkkkkkkkk",
          "kuuuuuukrrrrrrrrrrrrrrrk",
          "kuwwwwukrrwrrrwrrrwrrrrk",
          "kuwwwwukrrrrrrrrrrrrrrrk",
          "kuuuuuukrrwrrrwrrrwrrrrk",
          "kkkkkkkkrrrrrrrrrrrrrrrk",
          "kmmmmmmmmmmmmmmmmmmmmmmk",
          "kMMMMMMMMMMMMMMMMMMMMMMk",
          "kkkkkkkkkkkkkkkkkkkkkkkk",
          "km....................mk",
          "km....................mk",
          "kk....................kk"],

    mirror: [".kkkkkk.",
             "kxccccxk",
             "kcwccccx",
             "kccccwcx",
             "kcwcccck",
             "kccccwck",
             "kcwcccck",
             "kxccccxk",
             ".kmmmmk.",
             "..kkkk.."],

    books: ["..........",
            ".kkk.kkkk.",
            ".ktk.kbbk.",
            ".ktk.kbbk.",
            ".ktk.kbbk.",
            "kkkkkkkkkk",
            "knnnnyyyyk",
            "kwnnnwyyyk",
            "kkkkkkkkkk"],

    headphones: ["..kkkkkk..",
                 ".kwwwwwwk.",
                 "kwkkkkkkwk",
                 "kwk....kwk",
                 "kkkk..kkkk",
                 "kdzzk.kzzk",
                 "kdzzk.kzzk",
                 "kkkkk.kkkk"],

    desk: ["kkkkkkkkkkkkkkkkkk",
           "kmmmmmmmmmmmmmmmmk",
           "kMMMMMMMMMMMMMMMMk",
           "kkkkkkkkkkkkkkkkkk",
           "km..............mk",
           "km..kkkkkkkk....mk",
           "km..kMMMMMMk....mk",
           "km..kkkkkkkk....mk",
           "km..............mk",
           "kk..............kk"],

    snacks: ["..kkkkkk..",
             ".kyyoyyyk.",
             ".kyoyyoyk.",
             ".kyyyoyyk.",
             "kkkkkkkkkk",
             "kmMmMmMmMk",
             "kmMmMmMmMk",
             "kkkkkkkkkk"],

    clothes: ["..........",
              "...kkkk...",
              "..kbbbbk..",
              ".kbbbbbbk.",
              "kbrrbbrrbk",
              "kkrrkkrrkk",
              ".kkkkkkkk.",
              "..kmmmmk..",
              "..kkkkkk.."],

    pc: ["kkkkkkkkkk",
         "kzzzzzzzzk",
         "kzcnnnnczk",
         "kzzzzzzzzk",
         "kzcczzcczk",
         "kkkkkkkkkk",
         "kddddddddk",
         "kdkkkkkkdk",
         "kdknnnnkdk",
         "kdkkkkkkdk",
         "kddddddddk",
         "kkkkkkkkkk"],

    usb: ["........",
          ".kkkkkk.",
          "kxxxxxxk",
          "kxkkkkxk",
          "kxxxxxxk",
          ".kkkkkk.",
          "..kggk..",
          "..kkkk.."],

    stickies: ["kkkkkkkkkkkk",
               "kyyykccckvvk",
               "kyyykccckvvk",
               "kkkkkkkkkkkk",
               "kccckvvvkyyk",
               "kccckvvvkyyk",
               "kkkkkkkkkkkk"],

    plant: ["...nn...",
            "..nnvn..",
            ".nvnnnvn",
            "nnvnnvnn",
            "..nnnn..",
            "...nn...",
            ".kkkkkk.",
            "kqqqqqqk",
            "kqqqqqqk",
            ".kkkkkk."],

    bottle: ["..kkk..",
             "..kbk..",
             ".kkkkk.",
             ".kccck.",
             ".kcwck.",
             ".kccck.",
             ".kcwck.",
             ".kccck.",
             ".kccck.",
             ".kkkkk."],

    mug: [".........",
          "kkkkkk...",
          "kwwwwkkk.",
          "kwmmwk.kk",
          "kwmmwk.kk",
          "kwwwwkkk.",
          "kkkkkk..."],

    /* ---- office ---- */

    odesk: ["kkkkkkkkkkkkkkkk",
            "kggggggggggggggk",
            "kddddddddddddddk",
            "kkkkkkkkkkkkkkkk",
            "kd...kkkkkk...dk",
            "kd...kzzczk...dk",
            "kd...kkkkkk...dk",
            "kd............dk",
            "kk............kk"],

    databricks: ["kkkkkkkkkkkk",
                 "kzzzzzzzzzzk",
                 "kzottttozzzk",
                 "kzottotozzzk",
                 "kzzzzzzzzzzk",
                 "kzcccczzzzzk",
                 "kzzzzzzzzzzk",
                 "kzcczzzzcczk",
                 "kkkkkkkkkkkk",
                 "..kkddkk...."],

    reports: ["............",
              "..kkkkkkk...",
              "..kwwwwwk...",
              ".kkkkkkkkk..",
              ".kwwwwwwwk..",
              "kkkkkkkkkkk.",
              "kwkkkwwwwwk.",
              "kwwwwwkkkwk.",
              "kwkkkwwwwwk.",
              "kwwwwwwwwwk.",
              "kkkkkkkkkkk."],

    spread: ["kkkkkkkkkkkk",
             "kwwkwwkwwkwk",
             "kkkkkkkkkkkk",
             "kwwkvvkwwkwk",
             "kkkkkkkkkkkk",
             "kwwkwwkttkwk",
             "kkkkkkkkkkkk",
             "kvvkwwkwwkwk",
             "kkkkkkkkkkkk"],

    coffee: ["kkkkkkkkkk",
             "kzzzzzzzzk",
             "kzkkkkkkzk",
             "kzkqqqqkzk",
             "kzkkkkkkzk",
             "kzzzzzzzzk",
             "kz.kwwk.zk",
             "kz.kqqk.zk",
             "kzzkkkkzzk",
             "kkkkkkkkkk"],

    clock: ["..kkkk..",
            ".kwwwwk.",
            "kwwkwwwk",
            "kwwkwwwk",
            "kwwkkwwk",
            "kwwwwwwk",
            ".kwwwwk.",
            "..kkkk.."],

    dashboard: ["kkkkkkkkkkkkkkkk",
                "kzzzzzzzzzzzzzzk",
                "kznnzzzzzzttzzzk",
                "kznnzznnzzttzzzk",
                "kznnzznnzzttzzzk",
                "kznnzznnzznnzzzk",
                "kzzzzzzzzzzzzzzk",
                "kzcccccccccczzzk",
                "kkkkkkkkkkkkkkkk"],

    door: ["kkkkkkkkkk",
           "kqqqqqqqqk",
           "kqkkkkkkqk",
           "kqkccccqqk",
           "kqkccccqqk",
           "kqkkkkkkqk",
           "kqqqqqqyqk",
           "kqqqqqqqqk",
           "kqqqqqqqqk",
           "kkkkkkkkkk"],

    /* ---- npcs (little office people) ---- */

    npc1: ["..kkkk..",
           ".khhhhk.",
           ".kssssk.",
           ".kskskk.",
           ".ksssdk.",
           "kkbbbbkk",
           "kbbbbbbk",
           "kbbbbbbk",
           ".kdkkdk.",
           ".kk..kk."],

    npc2: ["..kkkk..",
           ".kddddk.",
           ".kssssk.",
           ".kskskk.",
           ".ksssdk.",
           "kkzzzzkk",
           "kzzzzzzk",
           "kzzzzzzk",
           ".kdkkdk.",
           ".kk..kk."],

    npc3: ["..kkkk..",
           ".kqqqqk.",
           ".kssssk.",
           ".kskskk.",
           ".ksssdk.",
           "kknnnnkk",
           "knnnnnnk",
           "knnnnnnk",
           ".kdkkdk.",
           ".kk..kk."],

    npc4: ["kkkkkkkk",
           "kzzzzzzk",
           "kztttzzk",
           "kzzzzzzk",
           "kzggggzk",
           "kzzzzzzk",
           "kkkkkkkk",
           ".kddddk.",
           ".kkkkkk."],

    /* ---- grocery ---- */

    eggs: ["..........",
           ".kkkkkkkk.",
           "kwuuwuuwuk",
           "kwuuwuuwuk",
           "kkkkkkkkkk",
           "kuuuuuuuuk",
           "kkkkkkkkkk"],

    milk: ["..kkkk..",
           ".kwwwwk.",
           "kwwwwwwk",
           "kwwbbwwk",
           "kwbbbbwk",
           "kwwbbwwk",
           "kwwwwwwk",
           "kwwwwwwk",
           ".kkkkkk."],

    oats: [".kkkkkkk.",
           "kuuuuuuuk",
           "kuqqqqquk",
           "kuqwwwquk",
           "kuqwuwquk",
           "kuqqqqquk",
           "kuuuuuuuk",
           ".kkkkkkk."],

    ragi: ["..kkkk..",
           ".kmmmmk.",
           "kmqqqqmk",
           "kmqwwqmk",
           "kmqwwqmk",
           "kmqqqqmk",
           "kmmmmmmk",
           ".kkkkkk."],

    flax: ["..kkkk..",
           ".kqqqqk.",
           "kqMMMMqk",
           "kqMwwMqk",
           "kqMMMMqk",
           "kqqqqqqk",
           ".kkkkkk."],

    dates: ["..........",
            ".kkkkkkkk.",
            "kqMqMqMqMk",
            "kMqMqMqMqk",
            "kqMqMqMqMk",
            ".kkkkkkkk."],

    paneer: [".kkkkkkk.",
             "kwwwwwwwk",
             "kwuuuuuwk",
             "kwuwwwuwk",
             "kwuuuuuwk",
             "kwwwwwwwk",
             ".kkkkkkk."],

    spinach: ["...nn...",
              "..nvnn..",
              ".nvnnvn.",
              "nvnnvnnn",
              ".nnvnnn.",
              "..nnnn..",
              "...NN..."],

    banana: ["......kk",
             ".....kyk",
             "....kykk",
             "..kkyyk.",
             ".kyyykk.",
             "kyyykk..",
             "kykkk...",
             "kkk....."],

    curd: [".kkkkkk.",
           "kwwwwwwk",
           "kwbbbbwk",
           "kwwwwwwk",
           "kwuuuuwk",
           "kwuuuuwk",
           ".kkkkkk."],

    apple: ["...kk...",
            "..knn...",
            ".kttttk.",
            "kttwtttk",
            "kttttttk",
            "kttttttk",
            ".ktttttk",
            "..kkkk.."],

    carrot: ["..nn.nn.",
             "..nvnvn.",
             "...koo..",
             "...kook.",
             "...koo..",
             "....ko..",
             "....ko..",
             ".....k.."],

    chips: [".kkkkkk.",
            "kyyttyyk",
            "kytttyyk",
            "kyttttyk",
            "kyyttyyk",
            "kyttttyk",
            ".kkkkkk."],

    soda: ["..kkk...",
           ".kbbbk..",
           "kbwwwbk.",
           "kbwtwbk.",
           "kbwwwbk.",
           "kbbbbbk.",
           "kbwwwbk.",
           ".kkkkk.."],

    noodles: ["..kkkk..",
              ".kyyyyk.",
              "kyttttyk",
              "kytwwtyk",
              "kyttttyk",
              "kyyyyyyk",
              ".kkkkkk."],

    almonds: ["........",
              "..kkkk..",
              ".kqqqqk.",
              "kqqMqqqk",
              "kqqqqMqk",
              ".kqqqqk.",
              "..kkkk..",
              "........"],

    basket: ["kkkkkkkkkkkk",
             "kqqqqqqqqqqk",
             "kqkqkqkqkqqk",
             "kqqqqqqqqqqk",
             "kqkqkqkqkqqk",
             "kqqqqqqqqqqk",
             ".kkkkkkkkkk."],

    /* ---- city buildings ---- */

    b_home: ["....kk....",
             "...krrk...",
             "..krrrrk..",
             ".krrrrrrk.",
             "kkkkkkkkkk",
             "kuuykyuuuk",
             "kuuykyuuuk",
             "kuukkkuuuk",
             "kuukcckuuk",
             "kkkkkkkkkk"],

    b_office: ["kkkkkkkkkkkk",
               "kggggggggggk",
               "kgckgckgckgk",
               "kgckgckgckgk",
               "kggggggggggk",
               "kgckgckgckgk",
               "kgckgckgckgk",
               "kggggggggggk",
               "kgckgckgckgk",
               "kgggkkkgggkk",
               "kgggkcckgggk",
               "kkkkkkkkkkkk"],

    b_store: ["kkkkkkkkkkkk",
              "kttwwttwwttk",
              "kkkkkkkkkkkk",
              "kyyyyyyyyyyk",
              "kyykwwwkyyyk",
              "kyykwwwkyyyk",
              "kyykkkkkyyyk",
              "kyyyyyyyyyyk",
              "kyykcckyyyyk",
              "kkkkkkkkkkkk"],

    b_lab: ["...kkk....",
            "..kcpck...",
            "..kppck...",
            "kkkkkkkkk.",
            "kzczczczck",
            "kzzzzzzzzk",
            "kzcpczpczk",
            "kzzzzzzzzk",
            "kzzkcckzzk",
            "kkkkkkkkkk"],

    b_study: ["kkkkkkkkkk",
              "kmmmmmmmmk",
              "kmkkkkkkmk",
              "kmkuuuukmk",
              "kmkubbukmk",
              "kmkuuuukmk",
              "kmkkkkkkmk",
              "kmmmmmmmmk",
              "kmmkyykmmk",
              "kkkkkkkkkk"],

    b_game: ["kkkkkkkkkk",
             "kppppppppk",
             "kpkzzzzkpk",
             "kpkzccckpk",
             "kpkzzzzkpk",
             "kpkkkkkkpk",
             "kpkyykrrkp",
             "kppppppppk",
             "kppkcckppk",
             "kkkkkkkkkk"],

    b_cafe: ["..kkkkkk..",
             ".kwwwwwwk.",
             "kkkkkkkkkk",
             "ktwtwtwtwk",
             "kkkkkkkkkk",
             "kqqqqqqqqk",
             "kqkuuuukqk",
             "kqkuuuukqk",
             "kqqkcckqqk",
             "kkkkkkkkkk"],

    b_night: ["....kk....",
              "...kppk...",
              "kkkkkkkkkk",
              "kBBBBBBBBk",
              "kByBkkByBk",
              "kBkBByBkBk",
              "kByBkkBkBk",
              "kBkByBByBk",
              "kBBkcckBBk",
              "kkkkkkkkkk"],

    /* ---- symbols ---- */

    brain: ["..kkkkkk..",
            ".kprprprk.",
            "kprprprprk",
            "kpprpprprk",
            "kprprprprk",
            "kpprppprpk",
            ".kprprprk.",
            "..kkkkkk.."],

    heart: [".kk..kk.",
            "krrkkrrk",
            "krrrrrrk",
            "krrrrrrk",
            ".krrrrk.",
            "..krrk..",
            "...kk..."],

    floppy: ["kkkkkkkkkk",
             "kddwwwwddk",
             "kddwkkwddk",
             "kddwkkwddk",
             "kddddddddk",
             "kdwwwwwwdk",
             "kdwkkkkwdk",
             "kdwwwwwwdk",
             "kkkkkkkkkk"],

    star: ["...y...",
           "...y...",
           ".y.y.y.",
           "..yyy..",
           "yyyyyyy",
           "..yyy..",
           ".y.y.y.",
           "...y..."]
  };

  /* ---------------- renderer ---------------- */

  const cache = {};

  function gridToCanvas(grid, scale) {
    const h = grid.length;
    let w = 0;
    for (const row of grid) w = Math.max(w, row.length);
    const c = document.createElement("canvas");
    c.width = w * scale; c.height = h * scale;
    const ctx = c.getContext("2d");
    for (let y = 0; y < h; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === "." || ch === " ") continue;
        ctx.fillStyle = PAL[ch] || "#f0f";
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
    return c;
  }

  function dims(name) {
    const g = SPR[name];
    if (!g) return { w: 8, h: 8 };
    let w = 0;
    for (const row of g) w = Math.max(w, row.length);
    return { w: w, h: g.length };
  }

  /* data URL for a named sprite (cached) */
  function url(name) {
    if (cache[name]) return cache[name];
    const g = SPR[name] || SPR.star;
    cache[name] = gridToCanvas(g, 4).toDataURL();
    return cache[name];
  }

  /* ---------------- Rithvika ---------------- */
  /* Drawn in code so outfits, accessories and walk frames are cheap.
     Logical size 16 x 26, feet at y = 25. */

  const OUTFITS = {
    home:    { top:"#ff7fa8", top2:"#e2497f", legs:"#6f86c9", acc:"laptop" },
    office:  { top:"#3a4a6b", top2:"#27324a", legs:"#2b3242", acc:"badge" },
    grocery: { top:"#ffd27f", top2:"#e0a94f", legs:"#4a5d8a", acc:"basket" },
    dream:   { top:"#bda8ff", top2:"#8f74e0", legs:"#6a52b5", acc:"glow" },
    city:    { top:"#7fe0cf", top2:"#3fae9c", legs:"#33415e", acc:"phone" }
  };

  const rithCache = {};

  function rithvika(outfitName, frame, opts) {
    outfitName = OUTFITS[outfitName] ? outfitName : "home";
    frame = frame | 0;
    opts = opts || {};
    const key = outfitName + "|" + frame + "|" + (opts.hold || "") + "|" + (opts.sad ? 1 : 0);
    if (rithCache[key]) return rithCache[key];

    const O = OUTFITS[outfitName];
    const S = 4, W = 16, H = 26;
    const c = document.createElement("canvas");
    c.width = W * S; c.height = H * S;
    const ctx = c.getContext("2d");
    const P = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x * S, y * S, w * S, h * S); };

    const HAIR = "#241a15", HAIR2 = "#3a2a20", SKIN = "#f2c9a0", SKIN2 = "#d9a87c", OUT = "#191a22";

    // long hair mass behind everything
    P(3, 3, 10, 16, HAIR);
    P(2, 6, 2, 12, HAIR);
    P(12, 6, 2, 12, HAIR);
    P(3, 18, 3, 2, HAIR2);
    P(10, 18, 3, 2, HAIR2);

    // head
    P(4, 4, 8, 7, SKIN);
    P(4, 10, 8, 1, SKIN2);
    // fringe
    P(4, 3, 8, 2, HAIR);
    P(4, 5, 2, 1, HAIR);
    P(11, 5, 1, 1, HAIR);
    // eyes + smile
    if (opts.sad) {
      P(6, 7, 1, 1, OUT); P(9, 7, 1, 1, OUT);
      P(7, 9, 2, 1, "#b5745f");
    } else {
      P(6, 7, 1, 2, OUT); P(9, 7, 1, 2, OUT);
      P(6, 6, 1, 1, HAIR); P(9, 6, 1, 1, HAIR);
      P(7, 9, 2, 1, "#c4675a");
    }
    P(11, 8, 1, 1, "#ff9db5"); P(4, 8, 1, 1, "#ff9db5"); // blush

    // neck + top
    P(7, 11, 2, 1, SKIN2);
    P(4, 12, 8, 7, O.top);
    P(4, 17, 8, 2, O.top2);
    P(4, 12, 8, 1, "#ffffff44");

    // arms (frame changes the swing)
    const sw = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    P(3, 13, 1, 5 + sw, SKIN);
    P(12, 13, 1, 5 - sw, SKIN);

    // legs
    const step = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    P(5, 19, 2, 5 + step, O.legs);
    P(9, 19, 2, 5 - step, O.legs);
    P(5, 24 + step, 2, 1, OUT);
    P(9, 24 - step, 2, 1, OUT);

    // accessory
    const acc = opts.hold || O.acc;
    if (acc === "laptop") {
      P(3, 15, 10, 1, "#cfd6e0");
      P(4, 12, 8, 3, "#1b2030");
      P(5, 13, 6, 1, "#6fe3d2");
      P(3, 14, 10, 1, OUT);
    } else if (acc === "phone") {
      P(11, 14, 2, 4, OUT);
      P(11, 15, 2, 2, "#6fe3d2");
    } else if (acc === "basket") {
      P(11, 16, 5, 5, "#8b5a2b");
      P(12, 17, 3, 1, "#b0e07a");
      P(11, 15, 5, 1, OUT);
    } else if (acc === "badge") {
      P(9, 14, 2, 3, "#e9ecef");
      P(9, 15, 2, 1, "#4a7bd4");
      P(8, 13, 1, 1, "#8b9095");
    } else if (acc === "glow") {
      ctx.fillStyle = "rgba(189,168,255,.35)";
      ctx.fillRect(0, 0, c.width, c.height);
    }

    rithCache[key] = c.toDataURL();
    return rithCache[key];
  }

  /* ---------------- dialogue portraits (32x32) ---------------- */

  const faceCache = {};
  function face(who) {
    if (faceCache[who]) return faceCache[who];
    const S = 4, N = 16;
    const c = document.createElement("canvas");
    c.width = N * S; c.height = N * S;
    const ctx = c.getContext("2d");
    const P = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x * S, y * S, w * S, h * S); };

    if (who === "RITHVIKA") {
      P(0, 0, 16, 16, "#2a1636");
      P(2, 1, 12, 15, "#241a15");            // hair
      P(4, 3, 8, 9, "#f2c9a0");              // face
      P(4, 2, 8, 2, "#241a15");              // fringe
      P(6, 6, 1, 2, "#191a22"); P(9, 6, 1, 2, "#191a22");
      P(6, 5, 1, 1, "#241a15"); P(9, 5, 1, 1, "#241a15");
      P(7, 9, 2, 1, "#c4675a");
      P(4, 8, 1, 1, "#ff9db5"); P(11, 8, 1, 1, "#ff9db5");
      P(3, 12, 10, 4, "#ff7fa8");
    } else if (who === "SYSTEM") {
      P(0, 0, 16, 16, "#0c1120");
      P(1, 2, 14, 10, "#8b9095");
      P(2, 3, 12, 8, "#0b1a14");
      P(3, 4, 5, 1, "#00c46a"); P(3, 6, 8, 1, "#00c46a");
      P(3, 8, 4, 1, "#00c46a"); P(8, 8, 3, 1, "#ffd23d");
      P(6, 12, 4, 2, "#8b9095"); P(4, 14, 8, 1, "#3a3f4a");
    } else {
      // generic NPC portrait, hue derived from the name
      let n = 0;
      for (let i = 0; i < who.length; i++) n = (n * 31 + who.charCodeAt(i)) % 360;
      const shirt = "hsl(" + n + ",45%,45%)";
      const hair = "hsl(" + ((n + 180) % 360) + ",25%,20%)";
      P(0, 0, 16, 16, "#1d2430");
      P(3, 1, 10, 6, hair);
      P(4, 3, 8, 9, "#f2c9a0");
      P(6, 6, 1, 2, "#191a22"); P(9, 6, 1, 2, "#191a22");
      P(7, 9, 2, 1, "#8b5a4a");
      P(2, 12, 12, 4, shirt);
    }
    faceCache[who] = c.toDataURL();
    return faceCache[who];
  }

  /* ---------------- scene backdrops (320 x 180) ---------------- */

  function mk(ctx) {
    return function (x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
  }

  const scenes = {

    home(ctx) {
      const R = mk(ctx);
      R(0, 0, 320, 140, "#c7b7e8");                                     // wall
      for (let x = 0; x < 320; x += 12) R(x, 0, 6, 140, "#bda8e0");      // stripes
      R(0, 132, 320, 8, "#8f79b8");                                      // skirting
      R(0, 140, 320, 40, "#c89b63");                                     // floor
      for (let x = 0; x < 320; x += 26) R(x, 140, 2, 40, "#a87f4d");
      R(0, 140, 320, 2, "#e0b884");
      // window + night sky
      R(122, 18, 76, 54, "#f4efe6");
      R(126, 22, 68, 46, "#16204a");
      for (let i = 0; i < 26; i++) {
        const sx = 128 + ((i * 37) % 64), sy = 24 + ((i * 53) % 42);
        R(sx, sy, 1, 1, i % 4 ? "#dfe9ff" : "#ffe9a8");
      }
      R(170, 30, 10, 10, "#fff3c4");                                     // moon
      R(158, 22, 2, 46, "#f4efe6"); R(126, 44, 68, 2, "#f4efe6");
      // fairy lights
      for (let x = 10; x < 310; x += 20) {
        R(x, 8 + ((x / 20) % 2) * 4, 3, 3, ["#ffd23d", "#ff7fa8", "#6fe3d2"][(x / 20) % 3]);
      }
      // rug
      R(96, 148, 96, 24, "#e0768f"); R(104, 154, 80, 12, "#f0a2b4");
      // poster
      R(40, 24, 34, 26, "#f4efe6"); R(43, 27, 28, 20, "#4a7bd4");
      R(46, 40, 6, 5, "#ffd23d"); R(56, 34, 6, 11, "#ff7fa8");
      // shelf
      R(230, 40, 60, 5, "#8b5a2b");
      R(236, 28, 6, 12, "#d8452b"); R(244, 30, 5, 10, "#00c46a"); R(251, 27, 6, 13, "#4a7bd4");
    },

    office(ctx) {
      const R = mk(ctx);
      R(0, 0, 320, 132, "#d8d4c8");
      R(0, 0, 320, 26, "#e6e3da");                                       // ceiling
      for (let x = 0; x < 320; x += 40) { R(x, 0, 2, 26, "#c9c5b8"); }
      R(46, 6, 40, 6, "#fffbe0"); R(206, 6, 40, 6, "#fffbe0");           // fluorescents
      R(0, 26, 320, 4, "#b8b4a8");
      // cubicle walls
      R(0, 60, 320, 4, "#9aa3ad");
      R(10, 64, 300, 40, "#aeb6bf");
      for (let x = 14; x < 306; x += 8) R(x, 68, 4, 32, "#9aa3ad");
      // window with grey city
      R(96, 30, 128, 28, "#cfd6e0");
      R(100, 33, 120, 22, "#7f93b5");
      for (let i = 0; i < 12; i++) R(104 + i * 10, 40 - (i % 4) * 4, 7, 20, "#5f7290");
      // floor: office carpet
      R(0, 132, 320, 48, "#6f7a6b");
      for (let y = 132; y < 180; y += 4) for (let x = (y % 8); x < 320; x += 8) R(x, y, 2, 2, "#66705f");
      R(0, 132, 320, 2, "#8e998a");
      // motivational poster nobody believes
      R(252, 32, 52, 24, "#f4efe6"); R(255, 35, 46, 18, "#1f3d8f");
      R(258, 40, 40, 2, "#ffd23d"); R(258, 46, 28, 2, "#ffd23d");
    },

    store(ctx) {
      const R = mk(ctx);
      R(0, 0, 320, 128, "#fff3d9");
      R(0, 0, 320, 18, "#d8452b");                                       // banner
      for (let x = 6; x < 320; x += 24) R(x, 4, 12, 10, "#ffd23d");
      // shelving units
      for (let i = 0; i < 3; i++) {
        const y = 30 + i * 34;
        R(8, y, 304, 26, "#e6d9bd");
        R(8, y + 24, 304, 4, "#b89b6b");
        R(8, y, 304, 2, "#c9b58c");
        for (let x = 24; x < 312; x += 32) R(x, y + 2, 2, 22, "#d5c49c");
      }
      // tiled floor
      R(0, 128, 320, 52, "#e8eaec");
      for (let y = 128; y < 180; y += 13) R(0, y, 320, 1, "#cfd6e0");
      for (let x = 0; x < 320; x += 13) R(x, 128, 1, 52, "#cfd6e0");
      // checkout counter hint
      R(0, 150, 46, 30, "#4a7bd4"); R(0, 148, 46, 3, "#7fa4e8");
    },

    city(ctx) {
      const R = mk(ctx);
      const g = ctx.createLinearGradient(0, 0, 0, 180);
      g.addColorStop(0, "#0d1030"); g.addColorStop(.55, "#2a1a55"); g.addColorStop(1, "#5b2a63");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 320, 180);
      for (let i = 0; i < 70; i++) {
        const x = (i * 71) % 320, y = (i * 37) % 90;
        R(x, y, 1, 1, i % 5 ? "#e8f0ff" : "#ffd6a8");
      }
      R(268, 16, 12, 12, "#fff3c4");                                     // moon
      // far skyline
      for (let i = 0; i < 16; i++) {
        const bw = 18 + (i % 3) * 8, bh = 26 + ((i * 13) % 34), bx = i * 21 - 6;
        R(bx, 92 - bh, bw, bh, "#1b1740");
        for (let wy = 92 - bh + 4; wy < 88; wy += 7)
          for (let wx = bx + 3; wx < bx + bw - 3; wx += 6)
            R(wx, wy, 2, 3, ((wx + wy) % 3) ? "#3a3470" : "#ffd98a");
      }
      // ground + road
      R(0, 92, 320, 88, "#2b2350");
      R(0, 130, 320, 20, "#1b1738");
      for (let x = 4; x < 320; x += 24) R(x, 139, 12, 2, "#e8d98a");
      R(0, 128, 320, 2, "#4a3f7a"); R(0, 150, 320, 2, "#4a3f7a");
      // pavement speckles + lamps
      for (let i = 0; i < 60; i++) R((i * 53) % 320, 152 + ((i * 29) % 26), 1, 1, "#4f4680");
      for (let x = 30; x < 320; x += 90) {
        R(x, 104, 2, 26, "#6b6099"); R(x - 3, 100, 8, 4, "#ffe9a8");
      }
    },

    mind(ctx) {
      const R = mk(ctx);
      const g = ctx.createLinearGradient(0, 0, 0, 180);
      g.addColorStop(0, "#180a35"); g.addColorStop(.5, "#40105c"); g.addColorStop(1, "#8a2a72");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 320, 180);
      for (let i = 0; i < 120; i++) {
        const x = (i * 97) % 320, y = (i * 61) % 180, s = i % 7 === 0 ? 2 : 1;
        R(x, y, s, s, i % 3 ? "#ffffff" : "#ffd6f4");
      }
      // orbit rings
      ctx.strokeStyle = "rgba(255,214,244,.25)"; ctx.lineWidth = 1;
      for (let r = 26; r < 130; r += 26) {
        ctx.beginPath(); ctx.ellipse(160, 96, r * 1.5, r * .5, 0, 0, Math.PI * 2); ctx.stroke();
      }
      // a soft core
      const c2 = ctx.createRadialGradient(160, 96, 2, 160, 96, 46);
      c2.addColorStop(0, "rgba(255,255,255,.75)"); c2.addColorStop(1, "rgba(255,120,200,0)");
      ctx.fillStyle = c2; ctx.fillRect(110, 46, 100, 100);
    },

    blank(ctx) {
      ctx.fillStyle = "#05060a"; ctx.fillRect(0, 0, 320, 180);
    }
  };

  window.RX = window.RX || {};
  window.RX.px = { PAL, SPR, url, dims, rithvika, face, scenes, OUTFITS };
})();
