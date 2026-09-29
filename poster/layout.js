/* Print typography and floating windows, redrawn at the final export resolution. */
(() => {
  "use strict";
  const ink = "#061f22",
    mint = "#a6e7bb",
    gold = "#ffd58a",
    paper = "#fff0c9";
  window.drawAIchemyPosterOverlay = (ctx) => {
    const box = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    const rule = (x1, y1, x2, y2, color, width = 1) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };
    const text = (
      value,
      x,
      y,
      size = 16,
      color = paper,
      weight = 600,
      mono = false,
    ) => {
      ctx.font = `${weight} ${size}px ${mono ? '"Courier New", monospace' : '"Poster Sans", sans-serif'}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = color;
      ctx.fillText(value, x, y);
    };
    const centered = (
      value,
      x,
      y,
      size,
      color = paper,
      weight = 600,
      mono = false,
    ) => {
      text(value, -9999, -9999, size, color, weight, mono);
      const width = ctx.measureText(value).width;
      text(value, x - width / 2, y, size, color, weight, mono);
    };
    function windowFrame(
      x,
      y,
      w,
      h,
      label,
      accent = mint,
      solidHeader = false,
    ) {
      box(x + 7, y + 8, w, h, "#020e11a6");
      box(x - 1, y + 5, w + 2, h - 10, accent);
      box(x + 5, y - 1, w - 10, h + 2, accent);
      box(x + 1, y + 5, w - 2, h - 10, ink);
      box(x + 5, y + 1, w - 10, h - 2, ink);
      box(x + 2, y + 5, w - 4, 23, solidHeader ? accent : "#173b35");
      box(x + 5, y + 2, w - 10, 5, solidHeader ? accent : "#173b35");
      rule(x + 2, y + 29, x + w - 2, y + 29, `${accent}88`);
      box(x + 10, y + 11, 7, 7, solidHeader ? ink : accent);
      text(label, x + 25, y + 20, 10.5, solidHeader ? ink : accent, 700, true);
      rule(x + w - 35, y + 18, x + w - 28, y + 18, solidHeader ? ink : accent);
      ctx.strokeStyle = solidHeader ? ink : accent;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + w - 20, y + 11, 7, 7);
      // Small detached corners give each window a pixel hologram silhouette.
      box(x - 5, y + 12, 2, 16, `${accent}66`);
      box(x + w + 3, y + h - 28, 2, 16, `${accent}66`);
    }
    function elementWindow(x, y, w, h, label) {
      // Secondary information: a quiet, thin frame without chrome or shadows.
      box(x, y, w, h, "#071f20e6");
      ctx.strokeStyle = "#74977e66";
      ctx.lineWidth = 0.75;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      rule(x + 1, y + 23, x + w - 1, y + 23, "#74977e3d", 0.75);
      box(x + 9, y + 10, 3, 3, "#7c9d83");
      text(label, x + 18, y + 15, 8, "#7e9d88", 600, true);
    }

    // A dark, spacious masthead makes the title legible from across a corridor.
    const shade = ctx.createLinearGradient(0, 0, 0, 244);
    shade.addColorStop(0, "#061b20ff");
    shade.addColorStop(0.8, "#061b20f5");
    shade.addColorStop(1, "#061b2000");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, 720, 244);
    rule(29, 23, 50, 23, mint, 2);
    rule(29, 23, 29, 44, mint, 2);
    rule(691, 23, 670, 23, mint, 2);
    rule(691, 23, 691, 44, mint, 2);
    text("AI RESEARCH CLUB", 43, 42, 11.5, mint, 700, true);
    box(568, 29, 6, 6, gold);
    text("OPEN TO EXPLORE", 584, 37, 9, gold, 700, true);
    // Chinese and English form one full-width lockup, with a stepped metal shadow.
    text("炼丹社", -9999, -9999, 68, gold, 900);
    const cnWidth = ctx.measureText("炼丹社").width;
    text("AIchemy", -9999, -9999, 87, paper, 900);
    const enWidth = ctx.measureText("AIchemy").width;
    const titleScale = 632 / (cnWidth + 20 + enWidth);
    ctx.save();
    ctx.translate(42, 132);
    ctx.scale(titleScale, titleScale);
    for (let i = 6; i >= 1; i--) {
      text("炼丹社", i, i - 2, 68, "#725c38", 900);
      text("AIchemy", cnWidth + 20 + i, i, 87, "#315446", 900);
    }
    text("炼丹社", 0, -2, 68, gold, 900);
    text("AIchemy", cnWidth + 20, 0, 87, paper, 900);
    ctx.restore();
    box(164, 162, 392, 36, "#d5b77312");
    rule(164, 162, 188, 162, gold, 2);
    rule(164, 162, 164, 174, gold, 2);
    rule(556, 198, 532, 198, gold, 2);
    rule(556, 198, 556, 186, gold, 2);
    centered("硬核AI研究社团@sdsz", 360, 188, 25, gold, 900);
    rule(42, 218, 309, 218, "#72967c66");
    rule(411, 218, 678, 218, "#72967c66");
    centered("LET'S BUILD", 360, 222, 10, mint, 700, true);

    // Smaller, muted windows leave clear space around the model and furnace.
    const elementText = "#b3c7ac", elementDetail = "#829e87";
    elementWindow(43, 285, 134, 135, "NEURAL.NET");
    text("神经网络", 55, 334, 17, elementText);
    const nodes = [];
    for (let col = 0; col < 4; col++) {
      const count = col === 0 || col === 3 ? 3 : 4;
      for (let i = 0; i < count; i++)
        nodes.push({
          col,
          x: 58 + col * 35,
          y: 356 + i * 13 + (4 - count) * 6.5,
        });
    }
    nodes.forEach((a) =>
      nodes
        .filter((b) => b.col === a.col + 1)
        .forEach((b) => rule(a.x, a.y, b.x, b.y, "#8ead8b44", 0.65)),
    );
    nodes.forEach((n, i) => {
      box(n.x - 2, n.y - 2, 4, 4, i % 3 === 0 ? "#b5a878" : "#87ab91");
    });

    elementWindow(552, 313, 125, 115, "LLM.STUDIO");
    text("LLM", 564, 366, 25, elementText);
    text("大语言模型", 564, 389, 12, elementDetail);
    text("预训练 · 微调 · 推理", 564, 413, 9.5, elementDetail);

    elementWindow(43, 504, 134, 115, "AGENT.RUN");
    text("Agent", 55, 557, 24, elementText);
    text("会规划 · 能行动", 55, 580, 12, elementDetail);
    text("计划 → 工具 → 执行", 55, 604, 10, elementDetail);

    elementWindow(552, 535, 125, 115, "TRAIN.LIVE");
    text("模型训练中", 564, 581, 12, elementText);
    for (let i = 0; i < 2; i++)
      rule(564, 600 + i * 19, 664, 600 + i * 19, "#829e8721", 0.6);
    for (let i = 1; i < 100; i++) {
      const y = (n) => 594 + (1 - Math.exp(-n / 24)) * 30;
      rule(564 + i - 1, y(i - 1), 564 + i, y(i), "#b2a377", 1.1);
      rule(564 + i - 1, y(i - 1) - 4, 564 + i, y(i) - 4, "#6e9785", 0.7);
    }

    // A small nameplate ties the illustrative furnace to model training.
    box(270, 826, 180, 21, "#071f22e8");
    rule(270, 847, 450, 847, "#c5c08a80");
    centered("以数据为料，以算力为火", 360, 841, 11.5, gold);

    // Invitation is the second strong reading point after the masthead.
    windowFrame(29, 852, 406, 180, "JOIN_US.EXE", gold, true);
    text("想找到志同道合一起玩 AI 的人？", 46, 908, 18, paper);
    text("想让 AI 更好地帮助学习？", 46, 937, 18, paper);
    text("欢迎加入炼丹社", 46, 982, 32, gold, 900);
    box(391, 959, 26, 26, gold);
    text("→", 394, 980, 24, ink, 900);
    text("入社请添加社长微信", 46, 1015, 17, mint);

    windowFrame(459, 854, 232, 176, "WECHAT / JOIN", mint, true);
    text("入社方式", 474, 911, 12, mint);
    text("添加", 474, 940, 17, paper);
    text("社长微信", 474, 967, 17, paper, 900);
    text("微信扫码", 474, 1006, 11.5, mint);
    // Same WeChat destination, with white modules and a four-module black quiet zone.
    // Align every module to the export's physical pixels to avoid hairline seams.
    const qr = window.AIchemyWechatQR;
    const transform = ctx.getTransform();
    const qrLeft = Math.round(549 * transform.a + transform.e);
    const qrTop = Math.round(889 * transform.d + transform.f);
    const qrWidth = Math.round(684 * transform.a + transform.e) - qrLeft;
    const qrHeight = Math.round(1024 * transform.d + transform.f) - qrTop;
    const modules = qr.size + qr.quiet * 2;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    box(qrLeft, qrTop, qrWidth, qrHeight, "#05090b");
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (!qr.data[y * qr.size + x]) continue;
        const left = Math.round((x + qr.quiet) * qrWidth / modules);
        const top = Math.round((y + qr.quiet) * qrHeight / modules);
        const right = Math.round((x + qr.quiet + 1) * qrWidth / modules);
        const bottom = Math.round((y + qr.quiet + 1) * qrHeight / modules);
        box(qrLeft + left, qrTop + top, right - left, bottom - top, "#ffffff");
      }
    }
    ctx.restore();

    // A dedicated footer band makes the website readable at a glance.
    box(29, 1038, 662, 36, "#0b2926");
    rule(29, 1038, 691, 1038, "#c7ab6d88");
    box(163, 1043, 54, 25, gold);
    centered("官网", 190, 1061, 14, ink, 900);
    text("aichemy.club", 235, 1065, 34, paper, 900, true);
    text("→", 510, 1064, 28, gold, 900);
  };
})();
