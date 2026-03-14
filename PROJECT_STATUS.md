# Project Status — Bible Atlas

> Last updated: March 13, 2026

---

## Completed

- [x] GitHub repo created and connected (github.com/Crake77/bible-atlas)
- [x] Next.js 14 + TypeScript + Tailwind CSS scaffold
- [x] Vercel deployment pipeline working (auto-deploys from GitHub pushes)
- [x] Live URL active on Vercel
- [x] Git for Windows installed (required for Claude Code on Windows)
- [x] Claude Code installed and working on Windows PC
- [x] Proof-of-concept 3D map built (separate Claude.ai chat — React artifact with math-approximated terrain, 5 chapters of Deuteronomy hardcoded)
- [x] **Folder structure reorganized to `src/` layout** (matches CLAUDE.md spec)
- [x] **Switched 3D engine from React Three Fiber → CesiumJS** (better real-terrain support)
- [x] CesiumJS postinstall script (copies assets to `public/cesium/` automatically)
- [x] `GeographicEvent` TypeScript interface implemented (matches CLAUDE.md data model)
- [x] Placeholder Deuteronomy event data (chapters 1–3 + 34) in `src/data/events/deuteronomy.ts`
- [x] City coordinates seed data (Deuteronomy-era focus) in `src/data/geography/cities.ts`

---

## In Progress

### Deuteronomy Geographic Event Dataset (BLOCKED — waiting on deep research)
- A deep research task is running in a separate Claude.ai chat
- It is compiling a structured dataset for all 34 chapters of Deuteronomy
- Output should include: city coordinates, region boundaries, political control changes, troop movements, cross-references
- **When this completes:** Paste the output here and Claude Code will format it into `src/data/events/deuteronomy.ts` matching the `GeographicEvent` interface in `src/types/index.ts`

---

## Next Steps (in priority order)

### Phase 1: Real Terrain & Data Foundation

1. **Add Cesium ion token for real NASA SRTM terrain**
   - Sign up free at cesium.com/ion
   - Add `NEXT_PUBLIC_CESIUM_ION_TOKEN=your_token` to `.env.local`
   - Also add the token to Vercel's environment variables (Settings → Environment Variables)
   - TerrainMap.tsx already has the logic — it auto-enables world terrain when the token is present

2. **Import full Deuteronomy event dataset**
   - Waiting on deep research output (see "In Progress" above)
   - Drop the data into `src/data/events/deuteronomy.ts`

3. **Add city marker pins to the map**
   - Read from `src/data/geography/cities.ts`
   - Show as clickable pins on the Cesium globe
   - Click → sidebar shows city info

4. **Add rivers and major geographic features**
   - Jordan River, Sea of Galilee, Dead Sea, Arnon, Jabbok, Mediterranean

### Phase 2: Bible Reader + Map Sync

5. **Load World English Bible text for Deuteronomy**
   - WEB is public domain, no licensing needed
   - Store as JSON in `src/data/bible-text/`
   - Display in the BibleReader sidebar

6. **Chapter navigation**
   - Prev / next chapter buttons
   - Chapter picker dropdown

7. **Chapter → map sync**
   - When chapter changes, camera flies to the relevant region
   - Relevant cities highlight on the map

8. **Movement arrows**
   - WW2-style arrows from origin to destination
   - Color-coded: military = red, journey = blue, migration = yellow

### Phase 3: Animated Conquests & Political Changes

9. **Region color overlays** — political control visualization
10. **Conquest animations** — flash + recolor when a region is taken
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
| Elevation/terrain | NASA SRTM via Cesium ion | Public domain | Ready (needs free ion token) |
| Biblical city coordinates | OpenBible.info | Free to use | Partial (seed set in cities.ts) |
| Ancient place data | Pleiades gazetteer / AWMC | Open access | Not yet explored |
| Bible text (initial) | World English Bible | Public domain | Not yet integrated |
| Bible text (goal) | Legacy Standard Bible | Requires Lockman license | Not pursued yet |
| Historical roads | Barrington Atlas (via Pleiades) | Partially open | Not yet explored |

---

## Architecture Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| 3D engine | CesiumJS (not React Three Fiber) | Native real-world terrain support; handles NASA SRTM natively |
| React version | React 18 (not 19) | CesiumJS/Resium compatibility |
| Next.js version | 14 (not 15) | Stable with React 18; .ts config files not supported in 14 |
| Data format | TypeScript files (not database) | Simple, no server needed; can migrate to SQLite later |
| Bible text | WEB translation for now | Public domain; LSB requires licensing |
| Cesium assets | Postinstall script copies to `public/cesium/` | Works on both local dev and Vercel |

---

## Known Decisions Still Open

- **LSB licensing:** Need to contact Lockman Foundation. Use WEB for now.
- **Full city dataset:** OpenBible.info has ~1,000 geocoded places — import when Phase 1 map markers are ready.
