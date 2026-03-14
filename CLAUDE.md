# Bible Atlas — Interactive 3D Biblical Map & Reader

## What This Project Is

A web-based Bible companion app that syncs a 3D terrain map of the ancient Near East with Bible reading. As the user reads through Scripture (chapter by chapter), the map updates to show:

- Where events are happening (cities, regions highlighted)
- Troop/people movements (WW2-style arrows showing invasions, migrations, journeys)
- Political control changes (regions flashing and changing color when conquered, city names updating)
- Terrain context (real elevation so you can see the Jordan Valley depth, Mt. Hermon height, etc.)

The primary user is reading through the Legacy Standard Bible (LSB) and currently in Deuteronomy. The app should eventually cover Genesis through Revelation.

---

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js (React) | Vercel-native, good routing, Claude Code writes it well |
| 3D Rendering | CesiumJS or React Three Fiber | Real terrain elevation, interactive 3D globe/map |
| Styling | Tailwind CSS | Fast, utility-based, works well with Next.js |
| Data Layer | JSON files (for now) | Simple, no database server needed. Can migrate to SQLite later |
| Elevation Data | NASA SRTM (~30m resolution) | Free, public domain, real topography |
| City Coordinates | OpenBible.info geocoded data | ~1,000 biblical places with lat/long, free to use |
| Deployment | Vercel (hobby/free tier) | Already set up, auto-deploys from GitHub |
| Source Control | GitHub | Already connected |
| Future iOS | Capacitor (Ionic) | Wraps web app as native iOS app |

---

## Project Structure

```
bible-atlas/
├── CLAUDE.md              # This file — project context for Claude Code
├── PROJECT_STATUS.md      # What's done, what's next, what's blocked
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/
│   │   ├── map/           # 3D terrain map, city markers, movement arrows
│   │   ├── reader/        # Bible text panel, chapter navigation
│   │   └── ui/            # Shared UI components (buttons, panels, legends)
│   ├── data/
│   │   ├── geography/     # City coordinates, region boundaries, rivers, roads
│   │   ├── events/        # Chapter-by-chapter geographic events (the core dataset)
│   │   ├── bible-text/    # Bible text data (WEB translation initially, LSB later)
│   │   └── terrain/       # Elevation data references / processing
│   ├── lib/               # Utility functions, data loaders, types
│   └── types/             # TypeScript type definitions
├── public/                # Static assets (textures, icons)
└── scripts/               # Data processing scripts (SRTM conversion, etc.)
```

---

## Core Data Model

The app's secret sauce is a structured dataset mapping Bible verses to geographic events. Each entry looks roughly like:

```typescript
interface GeographicEvent {
  book: string;                    // "Deuteronomy"
  chapter: number;                 // 3
  verseRange: [number, number];    // [1, 11]
  summary: string;                 // "Defeat of Og king of Bashan"
  locations: {
    name: string;                  // "Edrei"
    lat: number;
    lng: number;
    role: "battle" | "origin" | "destination" | "mentioned";
    notes?: string;
  }[];
  movements?: {
    from: string;                  // city/region name
    to: string;
    type: "military" | "journey" | "migration";
    description: string;
  }[];
  regionChanges?: {
    region: string;                // "Bashan"
    previousController: string;   // "Og (Amorite)"
    newController: string;        // "Israel (tribe of Manasseh)"
    cityRenames?: { old: string; new: string }[];
  }[];
  crossReferences?: string[];     // ["Numbers 21:33-35", "Joshua 12:4"]
}
```

---

## Bible Text Licensing Strategy

- **Phase 1 (now):** Use World English Bible (WEB) — fully public domain, no licensing needed
- **Phase 2 (later):** Pursue LSB licensing from the Lockman Foundation for inline display
- **Alternative:** Show chapter/verse references with annotations and link out to LSB text externally

---

## Key Design Principles

1. **Data accuracy matters most.** A beautiful map with wrong city locations is useless. Always prefer verified scholarly sources for coordinates and boundaries.
2. **Chapter-level navigation first.** Don't over-engineer verse-level syncing yet. Get chapter-by-chapter working solidly.
3. **Progressive enhancement.** Each phase should produce a working, deployable app. Don't build a skeleton that only works when everything is done.
4. **The user is not a developer.** Explain what you're doing in plain English. If something needs a decision, present options clearly with your recommendation.
5. **Keep it deployable.** Every significant change should be something we can push to Vercel and see live.

---

## Coding Standards

- TypeScript for all new code
- Use Tailwind CSS for styling (no custom CSS files unless absolutely necessary)
- Components should be small and focused — one component per file
- Data files go in `src/data/` as typed JSON or TypeScript exports
- Always test that the dev server runs before committing (`npm run dev`)
- Write clear commit messages describing what changed and why

---

## What NOT To Do

- Don't use a database server (Postgres, MongoDB, etc.) — JSON/SQLite only
- Don't add authentication or user accounts yet
- Don't try to build the iOS wrapper yet
- Don't spend time on SEO, analytics, or marketing features
- Don't try to cover the entire Bible at once — start with Deuteronomy
- Don't use copyrighted map tiles without checking licensing
