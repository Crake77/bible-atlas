/**
 * utils.ts
 *
 * General utility functions used across the app.
 */

/**
 * Converts a biblical city's lat/lng to a Cesium Cartesian3 position.
 * Import Cesium separately to keep this file server-safe.
 */
export function formatReference(book: string, chapter: number, verseRange: [number, number]): string {
  return `${book} ${chapter}:${verseRange[0]}–${verseRange[1]}`;
}
