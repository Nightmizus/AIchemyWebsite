// Requires Playwright and Chromium. Writes only within poster/exports/.
const { chromium } = require(process.env.AICHEMY_PLAYWRIGHT_MODULE || "playwright");
const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { execFileSync } = require("node:child_process");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"],
    ...(process.env.AICHEMY_CHROMIUM_PATH ? { executablePath: process.env.AICHEMY_CHROMIUM_PATH } : {}),
  });
  try {
    const page = await browser.newPage({ viewport: { width: 720, height: 1080 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(process.env.AICHEMY_POSTER_URL || "http://127.0.0.1:3000/poster/");
    await page.waitForFunction(() => window.__posterReady || window.__posterError);
    const initializationError = await page.evaluate(() => window.__posterError);
    if (initializationError || errors.length) throw new Error([initializationError, ...errors].filter(Boolean).join("\n"));
    const out = join(__dirname, "exports");
    mkdirSync(out, { recursive: true });
    for (const [name, width, height] of [
      ["AIchemy-preview.png", 1440, 2160],
      ["AIchemy-60x90cm-300dpi.png", 7087, 10630],
    ]) {
      const data = await page.evaluate(({ width, height }) => window.AIchemyPoster.exportPNG(width, height), { width, height });
      writeFileSync(join(out, name), Buffer.from(data.split(",")[1], "base64"));
      console.log(`${name}: ${width} x ${height}`);
    }
  } finally {
    await browser.close();
  }
  execFileSync(process.execPath, [join(__dirname, "prepare-print.mjs")], { stdio: "inherit" });
})().catch(error => { console.error(error); process.exitCode = 1; });
