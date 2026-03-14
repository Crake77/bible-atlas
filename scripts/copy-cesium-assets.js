/**
 * copy-cesium-assets.js
 *
 * Runs automatically after `npm install` (via the "postinstall" script in package.json).
 *
 * CesiumJS needs several folders of static files (Workers, Assets, Widgets) to be
 * served from the web server. This script copies them from node_modules into
 * the public/cesium/ folder so Next.js serves them automatically.
 *
 * The public/cesium/ folder is gitignored (it's generated, not source code).
 */

const { cpSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");

const cesiumBuild = join(
  __dirname,
  "..",
  "node_modules",
  "cesium",
  "Build",
  "Cesium"
);
const publicCesium = join(__dirname, "..", "public", "cesium");

if (!existsSync(cesiumBuild)) {
  console.log("Cesium build folder not found — skipping asset copy.");
  process.exit(0);
}

mkdirSync(publicCesium, { recursive: true });

const folders = ["Workers", "Assets", "Widgets", "ThirdParty"];

for (const folder of folders) {
  const src = join(cesiumBuild, folder);
  const dest = join(publicCesium, folder);
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied cesium/${folder}`);
  }
}

console.log("Cesium assets ready in public/cesium/");
