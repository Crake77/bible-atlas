import {
  ZOOM,
  X_MIN, X_MAX,
  Y_MIN, Y_MAX,
  TILE_PX,
  GRID_W, GRID_H,
  SAMPLE,
  MESH_COLS, MESH_ROWS,
} from "./constants";

/**
 * Decode a single PNG blob into a flat Uint8Array of RGBA pixels (256×256×4).
 * Uses OffscreenCanvas where available (workers + modern browsers),
 * falls back to a regular HTMLCanvasElement on older browsers.
 */
async function decodeTile(blob: Blob): Promise<Uint8ClampedArray> {
  try {
    const bitmap = await createImageBitmap(blob);
    const oc = new OffscreenCanvas(TILE_PX, TILE_PX);
    const ctx = oc.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, TILE_PX, TILE_PX).data;
  } catch {
    // Fallback for environments without OffscreenCanvas
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = TILE_PX;
        canvas.height = TILE_PX;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(ctx.getImageData(0, 0, TILE_PX, TILE_PX).data);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load tile image"));
      };
      img.src = url;
    });
  }
}

/**
 * Fetch all Terrarium elevation tiles for the biblical world extent,
 * stitch them into a single pixel grid, then sample every SAMPLE pixels
 * to produce a Float32Array of elevation values (meters) for the mesh.
 *
 * Grid is MESH_COLS wide × MESH_ROWS tall, row-major (row 0 = top = north).
 */
export async function buildHeightmap(): Promise<Float32Array> {
  const tilesX = X_MAX - X_MIN + 1; // 7
  const tilesY = Y_MAX - Y_MIN + 1; // 4

  // Allocate the full stitched pixel grid (elevation per pixel, not RGBA)
  // We only need elevation so store a Float32Array of GRID_W * GRID_H floats
  const fullGrid = new Float32Array(GRID_W * GRID_H);

  // Fetch all tiles in parallel
  const fetches: Promise<void>[] = [];

  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const tileX = X_MIN + tx;
      const tileY = Y_MIN + ty;

      const p = fetch(`/api/terrain-tile?z=${ZOOM}&x=${tileX}&y=${tileY}`)
        .then((r) => {
          if (!r.ok) throw new Error(`Tile ${tileX}/${tileY} failed: ${r.status}`);
          return r.blob();
        })
        .then(decodeTile)
        .then((pixels) => {
          // Copy this tile's elevation data into the full grid
          const originX = tx * TILE_PX;
          const originY = ty * TILE_PX;

          for (let py = 0; py < TILE_PX; py++) {
            for (let px = 0; px < TILE_PX; px++) {
              const i = (py * TILE_PX + px) * 4;
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              // Terrarium elevation decode
              const elevation = r * 256 + g + b / 256 - 32768;

              const gridX = originX + px;
              const gridY = originY + py;
              fullGrid[gridY * GRID_W + gridX] = elevation;
            }
          }
        })
        .catch(() => {
          // On failure, leave this tile as 0 (sea level) — non-fatal
        });

      fetches.push(p);
    }
  }

  await Promise.all(fetches);

  // Down-sample: pick one pixel per SAMPLE×SAMPLE block (top-left of block)
  // Result: MESH_COLS × MESH_ROWS
  const heightmap = new Float32Array(MESH_COLS * MESH_ROWS);

  for (let row = 0; row < MESH_ROWS; row++) {
    for (let col = 0; col < MESH_COLS; col++) {
      const gridY = row * SAMPLE;
      const gridX = col * SAMPLE;
      heightmap[row * MESH_COLS + col] = fullGrid[gridY * GRID_W + gridX];
    }
  }

  return heightmap;
}
