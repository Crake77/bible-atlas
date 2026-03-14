"use client";

import { useState } from "react";
import { bibleEvents } from "@/data/events/deuteronomy";

/**
 * BibleReader
 *
 * A scrollable sidebar that shows Bible passages and events.
 * Clicking an event will (eventually) fly the map camera to that location.
 *
 * Next steps:
 *   - Connect to a Bible API or local text files for full passage text
 *   - Wire up click handlers to move the 3D map camera
 *   - Add book/chapter navigation
 */
export default function BibleReader() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold text-parchment border-b border-stone/40 pb-3">
        Bible Atlas
      </h1>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-sand mb-3">
          Key Events
        </h2>

        <ul className="space-y-2">
          {bibleEvents.map((event) => (
            <li key={event.id}>
              <button
                onClick={() => setSelectedEventId(event.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedEventId === event.id
                    ? "bg-stone/60 text-parchment"
                    : "bg-stone/20 text-parchment/70 hover:bg-stone/40"
                }`}
              >
                <div className="font-semibold text-sm">{event.name}</div>
                <div className="text-xs text-sand/80 mt-0.5">
                  {event.reference}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Show description when an event is selected */}
      {selectedEventId && (
        <section className="bg-stone/20 rounded-lg p-4">
          {(() => {
            const event = bibleEvents.find((e) => e.id === selectedEventId);
            if (!event) return null;
            return (
              <>
                <h3 className="font-bold text-parchment mb-1">{event.name}</h3>
                <p className="text-xs text-sand mb-2">{event.reference}</p>
                <p className="text-sm text-parchment/80 leading-relaxed">
                  {event.description}
                </p>
              </>
            );
          })()}
        </section>
      )}
    </div>
  );
}
