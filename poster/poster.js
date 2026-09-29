/* A fixed 2:3 print composition. All illustration elements are native pixel art. */
(() => {
  "use strict";
  const canvas = document.getElementById("furnace");
  const ctx = canvas.getContext("2d", { alpha: false });
  const W = 720,
    H = 1080;
  const art = window.AIchemyArt;
  const pose = 7.6;
  function random(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function poly(points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], i) =>
      i
        ? ctx.lineTo(Math.round(x), Math.round(y))
        : ctx.moveTo(Math.round(x), Math.round(y)),
    );
    ctx.closePath();
    ctx.fill();
  }
  function line(x0, y0, x1, y1, color, size = 1) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0),
      sx = x0 < x1 ? 1 : -1,
      dy = -Math.abs(y1 - y0),
      sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    for (;;) {
      rect(x0, y0, size, size, color);
      if (x0 === x1 && y0 === y1) break;
      const e = 2 * error;
      if (e >= dy) {
        error += dy;
        x0 += sx;
      }
      if (e <= dx) {
        error += dx;
        y0 += sy;
      }
    }
  }
  function glow(x, y, radius, color, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = opacity;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();
  }
  function arc(x, y, r, start, end, color, size = 1, stretch = 1) {
    const steps = Math.ceil(Math.abs(end - start) * r * 1.4);
    for (let i = 0; i <= steps; i++) {
      const a = start + ((end - start) * i) / steps;
      rect(
        x + Math.cos(a) * r,
        y + Math.sin(a) * r * stretch,
        size,
        size,
        color,
      );
    }
  }
  function spark(x, y, size, color) {
    rect(x - size, y, size * 2 + 1, 1, color);
    rect(x, y - size, 1, size * 2 + 1, color);
    if (size > 3) {
      rect(x - 1, y - 1, 3, 3, "#fff1bd");
      rect(x - 2, y - 2, 5, 5, "#ffd88222");
    }
  }
  function glassWindow(x, y, w, h, mode) {
    poly(
      [
        [x + 7, y],
        [x + w, y],
        [x + w, y + h - 7],
        [x + w - 7, y + h],
        [x, y + h],
        [x, y + 7],
      ],
      "#051e1acb",
    );
    line(x + 7, y, x + w, y, "#83c0a1");
    line(x, y + 7, x, y + h, "#4b947b");
    line(x, y + h, x + w - 7, y + h, "#659c7b");
    line(x + w, y, x + w, y + h - 7, "#80ae83");
    rect(x + 8, y + 8, 5, 5, "#e3bc77");
    rect(x + w - 24, y + 9, 6, 2, "#8ea984");
    rect(x + w - 13, y + 8, 4, 4, "#7bb493");
    rect(x + 2, y + 21, w - 4, 1, "#7da88a44");
    for (let row = 0; row < 3; row++)
      rect(x + 9, y + 34 + row * 19, w - 18, 1, "#6c9c7222");
    if (mode === "network") {
      const nodes = [];
      for (let col = 0; col < 3; col++)
        for (let row = 0; row < 3; row++)
          nodes.push([
            x + 22 + (col * (w - 44)) / 2,
            y + 37 + (row * (h - 51)) / 2,
          ]);
      for (let i = 0; i < 6; i++)
        for (let j = 0; j < 3; j++)
          line(
            ...nodes[i],
            ...nodes[Math.floor(i / 3) * 3 + 3 + j],
            "#63966f77",
          );
      nodes.forEach(([px, py], i) => {
        rect(px - 3, py - 3, 7, 7, "#163f2d");
        rect(px - 2, py - 2, 5, 5, i % 3 ? "#acd8a1" : "#efc882");
      });
    } else if (mode === "loss") {
      for (let i = 1; i < w - 22; i++) {
        const f = (n) =>
          y + 30 + (1 - Math.exp((-n / (w - 22)) * 4)) * (h - 45);
        line(x + 10 + i - 1, f(i - 1), x + 10 + i, f(i), "#efc27a", 2);
        line(x + 10 + i - 1, f(i - 1) - 6, x + 10 + i, f(i) - 6, "#80c0a1");
      }
    } else {
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 7; col++) {
          const v = random(row * 17 + col + 21);
          rect(
            x + 12 + (col * (w - 23)) / 7,
            y + 31 + (row * (h - 40)) / 4,
            Math.max(2, (w - 23) / 7 - 4),
            Math.max(2, (h - 40) / 4 - 4),
            v > 0.65 ? "#e3be79" : v > 0.3 ? "#92c29b" : "#316d58",
          );
        }
    }
    line(x + w, y + h - 14, x + w + 12, y + h - 14, "#83ae7655");
    line(x + w + 12, y + h - 14, x + w + 28, y + h + 2, "#83ae7655");
  }

  function background() {
    rect(0, 0, W, H, "#071b1d");
    const base = ctx.createRadialGradient(360, 461, 40, 360, 461, 710);
    base.addColorStop(0, "#244838");
    base.addColorStop(0.6, "#102e2a");
    base.addColorStop(1, "#06181d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);
    // Diagonal architecture guides the eye inward, rather than preserving the old web layout.
    poly(
      [
        [0, 0],
        [169, 0],
        [120, 160],
        [76, 747],
        [0, 866],
      ],
      "#0b2628",
    );
    poly(
      [
        [720, 0],
        [551, 0],
        [600, 160],
        [644, 747],
        [720, 866],
      ],
      "#0a2428",
    );
    poly(
      [
        [0, 0],
        [43, 0],
        [35, 881],
        [0, 906],
      ],
      "#12322b",
    );
    poly(
      [
        [720, 0],
        [677, 0],
        [685, 881],
        [720, 906],
      ],
      "#12322b",
    );
    for (const side of [-1, 1]) {
      const x = 360 + side * 313;
      line(x, 0, x - side * 5, 159, "#668064", 2);
      line(x - side * 5, 159, x + side * 21, 823, "#436952", 2);
      line(x + side * 8, 0, x + side * 8, 740, "#345a47");
      for (let i = 0; i < 9; i++) {
        const yy = 100 + i * 82;
        rect(x + side * (i * 0.7) - 4, yy, 10, 3, "#7a895555");
      }
      const start = side < 0 ? 0 : 720;
      line(start, 61, 360 + side * 246, 61, "#6b7148", 7);
      line(360 + side * 246, 61, 360 + side * 208, 99, "#6b7148", 7);
      line(start, 61, 360 + side * 246, 61, "#bfad6d", 2);
      line(360 + side * 246, 61, 360 + side * 208, 99, "#bfad6d", 2);
      for (let i = 0; i < 4; i++)
        rect(360 + side * (260 + i * 29) - 2, 56, 5, 15, "#63765a");
    }
    // Quiet wall circuits remain visible in the darker edges.
    for (let i = 0; i < 18; i++) {
      const side = i % 2 ? -1 : 1,
        x = 360 + side * (229 + random(i + 33) * 71),
        y = 183 + random(i + 51) * 580;
      line(x, y, x - side * 22, y, "#50795d55");
      line(x - side * 22, y, x - side * 22, y + 24, "#50795d55");
      rect(x - 2, y - 2, 4, 4, "#7f9f673f");
    }
    rect(0, 854, W, H - 854, "#0c2520");
    for (let i = -7; i <= 7; i++)
      line(360 + i * 36, 854, 360 + i * 126, 1080, "#50714a55");
    for (const y of [882, 927, 992, 1074]) line(0, y, W, y, "#50714a44");
    for (const side of [-1, 1]) {
      const x = side < 0 ? 25 : 607;
      rect(x, 634, 88, 249, "#092019");
      rect(x + 3, 638, 82, 241, "#284a37");
      rect(x + 7, 641, 74, 234, "#0c2920");
      for (let row = 0; row < 6; row++) {
        rect(x + 12, 651 + row * 35, 64, 28, "#244d37");
        rect(x + 14, 653 + row * 35, 60, 2, "#69845a");
        for (let v = 0; v < 4; v++)
          rect(x + 17, 660 + row * 35 + v * 4, 38, 1, "#77916a");
        rect(x + 64, 660 + row * 35, 4, 4, row % 2 ? "#9dd796" : "#d6b06a");
      }
    }
    glow(360, 309, 332, "#da9c3e35");
    glow(360, 642, 316, "#ab844932");
  }

  function halo() {
    const x = 360,
      y = 383,
      r = 156;
    // A luminous, broken circular seal is the large graphic hook of the poster.
    glow(x, y, 233, "#ffc15430");
    for (let yy = -r; yy <= r; yy++) {
      const half = Math.floor(Math.sqrt(r * r - yy * yy));
      rect(
        x - half,
        y + yy,
        half * 2,
        1,
        Math.abs(yy) > r - 9 ? "#d9b96533" : "#b5a1530d",
      );
    }
    for (let section = 0; section < 9; section++) {
      const a = (section * Math.PI * 2) / 9 + 0.04;
      arc(x, y, r, a, a + 0.5, section % 3 ? "#baae6699" : "#f3ce86", 2);
      arc(x, y, r - 8, a + 0.05, a + 0.48, "#8cba853b");
      arc(x, y, r + 9, a + 0.15, a + 0.38, "#e5be664c");
    }
    for (let i = 0; i < 60; i++) {
      const a = (i * Math.PI) / 30;
      const inner = i % 5 === 0 ? r - 19 : r - 13;
      line(
        x + Math.cos(a) * inner,
        y + Math.sin(a) * inner,
        x + Math.cos(a) * (r - 9),
        y + Math.sin(a) * (r - 9),
        i % 5 === 0 ? "#e6cb86" : "#85976477",
        i % 5 === 0 ? 2 : 1,
      );
    }
    // Sparse fragments break out of the seal and suggest data becoming matter.
    for (let i = 0; i < 42; i++) {
      const angle = random(i + 201) * Math.PI * 2,
        rad = 129 + random(i + 301) * 67;
      const px = x + Math.cos(angle) * rad,
        py = y + Math.sin(angle) * rad;
      const size = i % 9 === 0 ? 4 : 2;
      rect(px, py, size, size, i % 4 ? "#d3bb7888" : "#ffe0a0");
    }
    spark(224, 266, 6, "#e6c886");
    spark(501, 448, 5, "#b7d6a1");
    spark(461, 243, 4, "#e8cb8d");
  }

  function energy() {
    // A tapered energy column ties the two focal points into one vertical composition.
    poly(
      [
        [326, 414],
        [394, 414],
        [409, 481],
        [311, 481],
      ],
      "#ffc26009",
    );
    poly(
      [
        [340, 423],
        [380, 423],
        [398, 478],
        [322, 478],
      ],
      "#ffd47b0b",
    );
    for (let strand = 0; strand < 5; strand++) {
      let previous = null;
      for (let step = 0; step < 57; step++) {
        const f = step / 56;
        const x = 360 + Math.sin(f * 6.8 + strand * 1.23) * (18 + f * 24);
        const y = 421 + f * 59;
        if (previous && step % 5 !== 0)
          line(...previous, x, y, strand % 2 ? "#78b58c88" : "#eeb66099", 1);
        if (step % 9 === 0)
          rect(x - 1, y - 1, 3, 3, strand % 2 ? "#c1dea0" : "#ffe4a3");
        previous = [x, y];
      }
    }
    for (let i = 0; i < 48; i++) {
      const y = 433 + random(i + 813) * 53;
      const spread = 24 + (y - 433) * 0.18;
      const x = 360 + (random(i + 71) - 0.5) * spread * 2;
      rect(
        x,
        y,
        i % 6 === 0 ? 3 : 1,
        i % 6 === 0 ? 6 : 3,
        i % 3 ? "#f0bf6977" : "#ffdd95",
      );
    }
  }

  function paint() {
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;
    background();
    halo();
    art.draw(ctx, "fan", 66, 212, 1.35, 0, 0, 13, pose);
    art.draw(ctx, "fan", 654, 212, 1.35, 0, 0, 13, pose + 0.8);
    // Supporting mechanisms are staggered vertically, with the furnace left unobstructed.
    art.draw(ctx, "arm", 310, 496, 0.94, pose);
    glow(360, 383, 152, "#ffe2a159");
    energy();
    art.draw(ctx, "core", 360, 593, 2.3, 1.05);
    // Same industrial blast furnace as the current website, isolated for print.
    glow(360, 658, 221, "#f4a04148");
    art.draw(ctx, "furnace", 360, 626, 1.5, pose);
    glow(360, 673, 70, "#ffa43c38");
    glow(360, 481, 81, "#ffce6730");
    // Glowing spill and debris connect the furnace to the surrounding floor.
    for (let i = 0; i < 20; i++) {
      const side = i % 2 ? 1 : -1,
        x = 360 + side * (135 + random(i + 449) * 121),
        y = 827 + random(i + 585) * 126;
      rect(x, y, 2 + random(i + 828) * 5, 1, i % 3 ? "#8ca26b77" : "#dcaf6955");
    }
    art.draw(ctx, "workstation", 86, 812, 0.72, pose, 0, 0);
    art.draw(ctx, "shelf", 632, 808, 0.68, pose, 0, 0);
    art.draw(ctx, "bottle", 540, 842, 0.85, 0, 0, 44, "#7c9d68", pose, 0.2);
    // A circuit path at the foot of the poster finishes the composition, without copy.
    for (const side of [-1, 1]) {
      line(360 + side * 228, 1036, 360 + side * 91, 1036, "#7aa079", 2);
      line(360 + side * 91, 1036, 360 + side * 60, 1007, "#7aa079", 2);
      rect(360 + side * 225 - 3, 1033, 7, 7, "#b2c888");
    }
    poly(
      [
        [360, 1001],
        [371, 1012],
        [360, 1023],
        [349, 1012],
      ],
      "#caa961",
    );
    poly(
      [
        [360, 1006],
        [366, 1012],
        [360, 1018],
        [354, 1012],
      ],
      "#edcc86",
    );
    // Discrete grain is printed into the illustration, not a web overlay.
    for (let i = 0; i < 6500; i++)
      rect(
        random(i * 3) * W,
        random(i * 3 + 1) * H,
        1,
        1,
        i % 2 ? "#bce0b407" : "#03100c12",
      );
    const vignette = ctx.createRadialGradient(360, 510, 320, 360, 510, 680);
    vignette.addColorStop(0, "#00000000");
    vignette.addColorStop(1, "#020b0e80");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
  }
  const backgroundArt = document.createElement("canvas");
  function renderPoster(target, width, height) {
    target.width = width;
    target.height = height;
    const output = target.getContext("2d", { alpha: false });
    output.imageSmoothingEnabled = false;
    output.drawImage(backgroundArt, 0, 0, width, height);
    output.setTransform(width / W, 0, 0, height / H, 0, 0);
    window.drawAIchemyPosterOverlay(output);
  }
  window.AIchemyPoster = {
    width: W,
    height: H,
    exportPNG(width = 7087, height = 10630) {
      if (!window.__posterReady) throw new Error("Poster fonts are not ready");
      const output = document.createElement("canvas");
      renderPoster(output, width, height);
      const data = output.toDataURL("image/png");
      output.width = 1;
      output.height = 1;
      return data;
    },
  };
  async function initialize() {
    await Promise.all([
      document.fonts.load('600 20px "Poster Sans"', "炼丹社神经网络"),
      document.fonts.load('900 70px "Poster Sans"', "炼丹社AIchemy"),
    ]);
    paint();
    backgroundArt.width = W;
    backgroundArt.height = H;
    backgroundArt.getContext("2d").drawImage(canvas, 0, 0);
    renderPoster(canvas, W * 3, H * 3);
    window.__posterReady = true;
  }
  initialize().catch((error) => {
    console.error(error);
    window.__posterError = error.message;
  });
})();
