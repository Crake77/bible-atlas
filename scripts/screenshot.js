/**
 * screenshot.js — headless screenshot of the bible-atlas terrain
 *
 * Usage:
 *   node scripts/screenshot.js [url] [outputPath] [view]
 *
 * view options:
 *   default   - default oblique angle (default)
 *   topdown   - zoomed out, more top-down for full-map comparison
 *   close     - zoomed in on Israel/Jordan
 */

const { chromium } = require("playwright");
const path = require("path");

const URL       = process.argv[2] || "http://localhost:3004";
const OUTPUT    = process.argv[3] || path.join(__dirname, "screenshot.png");
const VIEW      = process.argv[4] || "default";
const SETTLE_MS = 5000;

(async () => {
  const browser = await chromium.launch({
    args: ["--enable-webgl", "--use-gl=swiftshader", "--no-sandbox"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("console", msg => { if (msg.type() === "error") console.error("[err]", msg.text()); });

  await page.goto(URL, { waitUntil: "networkidle" });

  try {
    await page.waitForFunction(
      () => !document.querySelector("p")?.textContent?.includes("Loading terrain"),
      { timeout: 90000 }
    );
  } catch { console.warn("Terrain load timed out — continuing anyway"); }

  await page.waitForTimeout(3000);

  // Reset to default view first
  const resetBtn = page.locator("button[title='Reset view']");
  if (await resetBtn.count()) await resetBtn.click();
  await page.waitForTimeout(1500);

  if (VIEW === "topdown") {
    // Zoom out 12× and tilt up for a wide overview
    const zoomOut = page.locator("button[title='Zoom out']");
    const tiltUp  = page.locator("button[title='Tilt up']");
    for (let i = 0; i < 12; i++) { await zoomOut.click(); await page.waitForTimeout(120); }
    for (let i = 0; i < 8; i++) { await tiltUp.click();  await page.waitForTimeout(120); }
  } else if (VIEW === "close") {
    // Zoom in 3× to see Israel detail
    const zoomIn = page.locator("button[title='Zoom in']");
    for (let i = 0; i < 4; i++) { await zoomIn.click(); await page.waitForTimeout(120); }
  }

  console.log(`Settling for ${SETTLE_MS / 1000}s…`);
  await page.waitForTimeout(SETTLE_MS);
  await page.screenshot({ path: OUTPUT });
  console.log("Screenshot saved →", OUTPUT);
  await browser.close();
})();
