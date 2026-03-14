# Project Status — Bible Atlas

> Last updated: March 13, 2026

---

## Completed

- [x] GitHub repo created and connected (github.com/Crake77/bible-atlas)
- [x] Next.js 14 + TypeScript + Tailwind CSS scaffold
- [x] Vercel deployment pipeline working (auto-deploys from GitHub pushes)
- [x] Live URL active on Vercel
- [x] Git for Windows installed (required for Claude Code on Windows)
- [x] Claude Code installed and working on Windows PC (`defaultPermissionMode: dontAsk` set in config)
- [x] Proof-of-concept 3D map built (separate Claude.ai chat — React artifact with math-approximated terrain, 5 chapters of Deuteronomy hardcoded)
- [x] Folder structure reorganized to `src/` layout (matches CLAUDE.md spec)
- [x] Switched 3D engine from React Three Fiber → CesiumJS (better real-terrain support)
- [x] CesiumJS postinstall script auto-copies assets to `public/cesium/` on every `npm install`
- [x] `GeographicEvent` TypeScript interface implemented (matches CLAUDE.md data model)
- [x] Placeholder Deuteronomy event data (chapters 1–3 + 34) in `src/data/events/deuteronomy.ts`
- [x] City coordinates seed data (Deuteronomy-era focus) in `src/data/geography/cities.ts`
- [x] Cesium ion token configured — real NASA SRTM terrain active on live site
- [x] On-screen camera controls (tilt ▲▼, rotate ◀▶, zoom ＋－, reset ⌂) — bottom-right corner of map
- [x] Map loads at 45° tilt over ancient Near East so terrain depth is immediately visible

---

## In Progress

### Deuteronomy Geographic Event Dataset (BLOCKED — waiting on deep research)
- A deep research task is running in a separate Claude.ai chat
- It is compiling a structured dataset for all 34 chapters of Deuteronomy
- Output should include: city coordinates, region boundaries, political control changes, troop movements, cross-references
- **When this completes:** Paste the output into this chat and Claude Code will format it into `src/data/events/deuteronomy.ts` matching the `GeographicEvent` interface in `src/types/index.ts`

---

## Next Steps (in priority order)

### Phase 1: Real Terrain & Data Foundation

1. **Import full Deuteronomy event dataset**
   - Waiting on deep research output (see "In Progress" above)
   - Drop into `src/data/events/deuteronomy.ts`

2. **Add city marker pins to the map**
   - Read from `src/data/geography/cities.ts`
   - Show as clickable pins on the Cesium globe
   - Click → camera flies to city, sidebar shows city info

3. **Add rivers and major geographic features**
   - Jordan River, Sea of Galilee, Dead Sea, Arnon, Jabbok, Mediterranean coastline

4. **Style the map for an ancient/historical feel**
   - Replace or tint the default satellite imagery with a muted earthy style
   - Remove modern roads, city labels, borders from the base layer

### Phase 2: Bible Reader + Map Sync

5. **Load World English Bible text for Deuteronomy**
   - WEB is public domain, no licensing needed
   - Store as JSON in `src/data/bible-text/`
   - Display in the BibleReader sidebar with chapter text

6. **Chapter navigation**
   - Prev / next chapter buttons
   - Chapter picker dropdown

7. **Chapter → map sync**
   - When chapter changes, camera flies to the relevant region
   - Relevant cities highlight on the map
   - Uses the Deuteronomy event dataset

8. **Movement arrows**
   - WW2-style arrows from origin to destination
   - Color-coded: military = red, journey = blue, migration = yellow

### Phase 3: Animated Conquests & Political Changes

9. **Region color overlays** — political control visualization
10. **Conquest animations** — flash + recolor when a region changes hands
11. **Timeline slider** — scrub through biblical history

### Phase 4: Beyond Deuteronomy

12. **Expand to Genesis, Exodus, Joshua, Judges, Samuel, Kings**
13. **New Testament: Jesus's ministry routes, Paul's journeys**
14. **Cross-reference panel**

### Phase 5: Polish & Distribution

15. **Mobile-responsive layout**
16. **iOS app wrapper via Capacitor**
17. **LSB licensing from Lockman Foundation**
18. **Bookmarks, reading progress, user settings**

---

## Data Sources Reference

| Data | Source | License | Status |
|------|--------|---------|--------|
| Elevation/terrain | NASA SRTM via Cesium ion | Public domain | **Active** |
| Biblical city coordinates | OpenBible.info | Free to use | Partial (seed set in cities.ts) |
| Ancient place data | Pleiades gazetteer / AWMC | Open access | Not yet explored |
| Bible text (initial) | World English Bible | Public domain | Not yet integrated |
| Bible text (goal) | Legacy Standard Bible | Requires Lockman license | Not pursued yet |
| Historical roads | Barrington Atlas (via Pleiades) | Partially open | Not yet explored |

---

## Architecture Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| 3D engine | CesiumJS + Resium | Native real-world terrain; handles NASA SRTM natively |
| React version | React 18 (pinned) | CesiumJS/Resium not yet compatible with React 19 |
| Next.js version | 14 (not 15) | Stable with React 18; Next.js 15 requires React 19 |
| Config file | `next.config.mjs` (not `.ts`) | Next.js 14 does not support `.ts` config files |
| Data format | TypeScript files (not database) | Simple, no server needed; can migrate to SQLite later |
| Bible text | WEB translation for now | Public domain; LSB requires licensing |
| Cesium assets | `scripts/copy-cesium-assets.js` postinstall | Works automatically on local dev and Vercel |
| Map controls | On-screen buttons (not gestures) | Trackpad pinch/tilt gestures unreliable in CesiumJS on Windows |

---

## Known Issues & Decisions Still Open

- **Trackpad gestures:** Two-finger pinch/tilt don't work reliably in CesiumJS on Windows trackpads. On-screen buttons are the workaround. May revisit with custom pointer event handling later.
- **LSB licensing:** Need to contact Lockman Foundation. Using WEB translation for now.
- **Full city dataset:** OpenBible.info has ~1,000 geocoded places — import when Phase 1 map markers are ready.
- **Map style:** Default Cesium satellite imagery shows modern features (roads, borders). Will need a historical base layer or style filter.
