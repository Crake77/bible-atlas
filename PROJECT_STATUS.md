# Project Status — Bible Atlas

> Last updated: March 14, 2026

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
- [x] City coordinates seed data (Deuteronomy-era focus, 30+ cities with tiers) in `src/data/geography/cities.ts`
- [x] Cesium ion token configured — real NASA SRTM terrain active on live site
- [x] On-screen camera controls (tilt ▲▼, rotate ◀▶, zoom ＋－, reset ⌂) — bottom-right corner of map
- [x] Map loads at 45° tilt over ancient Near East so terrain depth is immediately visible
- [x] **Vertical exaggeration ×6** — terrain is now dramatically scaled; Dead Sea depression and Mt. Hermon tower
- [x] **Natural Earth II base imagery** (Cesium ion asset 3845) — no modern roads, labels, or political borders
- [x] **Full type system** in `src/types/index.ts` — Region, Tribe, River, Route, SpecialSite, City, LayerId, LayerVisibility, etc.
- [x] **Political entities** (18) with hex colors in `src/data/political-entities.ts`
- [x] **20-layer system** with groups, defaults, and labels in `src/data/layers/layer-config.ts`
- [x] **AppStateContext** — shared React context for currentBook, currentChapter, layerVisibility, selectedEvent
- [x] **Chapter navigation** (Prev/Next) in BibleReader sidebar
- [x] **Full Deuteronomy event dataset** — all 34 chapters in `src/data/events/deuteronomy.ts` with real coordinates from research data
- [x] **Rivers** (9): Jordan, Arnon, Jabbok, Brook Zered, Yarmuk, Kishon, Nile, Euphrates, Tigris — `src/data/geography/rivers.ts`
- [x] **Regions** (12+): all major political territories with controlOverrides per chapter — `src/data/geography/regions.ts`
- [x] **Tribe territories** (13): all 12 tribes + split Manasseh — `src/data/geography/tribes.ts`
- [x] **Routes** (10): 4 trade routes (Via Maris, King's Highway, Ridge Route, Way of Arabah) + 6 chapter-specific routes — `src/data/geography/routes.ts`
- [x] **Special sites** (11): tabernacles, covenants, battles, theophany, burial, altar — `src/data/geography/special-sites.ts`
- [x] **8 layer components** all building successfully:
  - `RiverLayer` — polylines clampToGround
  - `RegionLayer` — political polygons that recolor by chapter
  - `TribeLayer` — tribe territory polygons at 25% alpha
  - `RouteLayer` — trade routes + chapter-specific arrows
  - `CityLayer` — PinBuilder markers sized by tier (major/minor/archaeological)
  - `SpecialSiteLayer` — site markers by type, filtered by chapterRef
  - `MovementLayer` — chapter-driven military/journey arrows
  - `LabelLayer` — region, river, city, and tribe labels with depthTest disabled
- [x] **LayerPanel** — collapsible floating panel, group toggles + individual layer switches
- [x] **Tailwind political color palette** added
- [x] **Build passes cleanly** (TypeScript errors all resolved)

---

## Next Steps (in priority order)

### Immediate
1. **Commit and push to GitHub** → triggers Vercel deploy → see it live
2. **Verify map visually** — confirm Natural Earth II imagery, dramatic terrain, layer toggles work

### Phase 2: Enhancements
3. **Bible text integration** — load WEB/BSB text for Deuteronomy chapters
   - BSB (Berean Standard Bible) is free for display; use for any quoted verse text
4. **Chapter → camera fly** — when chapter advances, camera flies to the relevant region
5. **City click behavior** — click pin → camera fly + sidebar shows city detail
6. **Conquest flash animation** — brief color flash when region changes controller
7. **Full OpenBible.info city dataset** — import ~1,000 geocoded places when Phase 1 is solid

### Phase 3: Beyond Deuteronomy
8. **Expand event data to Genesis, Exodus, Joshua, Judges**
9. **New Testament: Jesus's ministry routes, Paul's journeys**
10. **iOS app wrapper via Capacitor**

---

## Data Sources Reference

| Data | Source | License | Status |
|------|--------|---------|--------|
| Elevation/terrain | NASA SRTM via Cesium ion | Public domain | **Active** |
| Base imagery | Natural Earth II via Cesium ion (asset 3845) | Free | **Active** |
| Biblical city coordinates | OpenBible.info | Free to use | Partial (30+ cities; full set TBD) |
| Deuteronomy event data | Research data (deuteronomy-atlas-data2.json) | Internal | **Integrated** |
| Ancient place data | Pleiades gazetteer / AWMC | Open access | Not yet explored |
| Bible text (display) | Berean Standard Bible (BSB) | Free for use | Not yet integrated |
| Bible text (goal) | Legacy Standard Bible | Requires Lockman license | Not pursued yet |

---

## Architecture Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| 3D engine | CesiumJS | Native real-world terrain; handles NASA SRTM natively |
| Base imagery | Natural Earth II (Cesium ion 3845) | Free, no modern features, no billing risk at scale |
| React version | React 18 (pinned) | CesiumJS/Resium not yet compatible with React 19 |
| Next.js version | 14 (not 15) | Stable with React 18; Next.js 15 requires React 19 |
| Overlay rendering | Pure Cesium entities (no Mapbox) | No per-tile billing risk; all overlays from our own data |
| Terrain exaggeration | ×6 | Makes Dead Sea depression and hill country visually striking |
| Polygon clamping | `height:0` + `heightReference:CLAMP_TO_GROUND` + `classificationType:TERRAIN` | CesiumJS PolygonGraphics doesn't support `clampToGround` directly |
| Label depth | `disableDepthTestDistance: Infinity` | Prevents labels from being hidden behind hills with ×6 exaggeration |
| Data format | TypeScript files (not database) | Simple, no server needed; can migrate to SQLite later |
| Bible text | BSB translation | Free for use, closest to LSB without licensing issues |
| Map controls | On-screen buttons (not gestures) | Trackpad pinch/tilt gestures unreliable in CesiumJS on Windows |

---

## Known Issues

- **Trackpad gestures:** Two-finger pinch/tilt don't work reliably in CesiumJS on Windows trackpads. On-screen buttons are the workaround.
- **LSB licensing:** Need to contact Lockman Foundation. Using BSB for now.
- **Full city dataset:** OpenBible.info has ~1,000 geocoded places — import when Phase 2 is ready.
- **Layer component lazy loading:** `require()` in TerrainMap.tsx works but is not ideal TypeScript. Can migrate to `dynamic()` imports later if needed.
