"use client";

import { useAppState } from "@/lib/AppStateContext";
import { deuteronomyEvents } from "@/data/events/deuteronomy";

export default function BibleReader() {
  const {
    currentBook,
    currentChapter,
    totalChapters,
    nextChapter,
    prevChapter,
    selectedEventIndex,
    setSelectedEvent,
  } = useAppState();

  // Filter events to just the current chapter
  const chapterEvents = deuteronomyEvents.filter(
    (e) => e.book === currentBook && e.chapter === currentChapter
  );

  const selectedEvent = selectedEventIndex !== null ? chapterEvents[selectedEventIndex] : null;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-xl font-bold text-parchment border-b border-stone/40 pb-3">
        Bible Atlas
      </h1>

      {/* Chapter Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={prevChapter}
          disabled={currentChapter <= 1}
          className="px-3 py-1.5 rounded bg-stone/30 text-parchment/80 text-sm hover:bg-stone/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        <div className="text-center flex-1">
          <div className="text-parchment font-semibold text-sm">{currentBook}</div>
          <div className="text-sand text-xs">Chapter {currentChapter} of {totalChapters}</div>
        </div>

        <button
          onClick={nextChapter}
          disabled={currentChapter >= totalChapters}
          className="px-3 py-1.5 rounded bg-stone/30 text-parchment/80 text-sm hover:bg-stone/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Event List for this chapter */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-sand mb-3">
          Geographic Events
        </h2>

        {chapterEvents.length === 0 ? (
          <p className="text-parchment/40 text-sm italic">
            No geographic events recorded for this chapter.
            <br />
            <span className="text-xs">The map shows the current region context.</span>
          </p>
        ) : (
          <ul className="space-y-2">
            {chapterEvents.map((event, i) => (
              <li key={`${event.chapter}-${i}`}>
                <button
                  onClick={() => setSelectedEvent(selectedEventIndex === i ? null : i)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedEventIndex === i
                      ? "bg-stone/60 text-parchment"
                      : "bg-stone/20 text-parchment/70 hover:bg-stone/40"
                  }`}
                >
                  <div className="font-semibold text-sm leading-snug">
                    {event.summary.split(".")[0]}
                  </div>
                  <div className="text-xs text-sand/80 mt-0.5">
                    {event.book} {event.chapter}:{event.verseRange[0]}–{event.verseRange[1]}
                  </div>
                  {event.locations.length > 0 && (
                    <div className="text-xs text-parchment/40 mt-1">
                      {event.locations.map((l) => l.name).join(" · ")}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Detail panel for selected event */}
      {selectedEvent && (
        <section className="bg-stone/20 rounded-lg p-4 space-y-3">
          <div>
            <h3 className="font-bold text-parchment text-sm leading-snug">
              {selectedEvent.summary.split(".")[0]}
            </h3>
            <p className="text-xs text-sand mt-0.5">
              {selectedEvent.book} {selectedEvent.chapter}:{selectedEvent.verseRange[0]}–{selectedEvent.verseRange[1]}
            </p>
          </div>

          <p className="text-sm text-parchment/80 leading-relaxed">
            {selectedEvent.summary}
          </p>

          {selectedEvent.locations.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-sand/60 mb-1">Locations</p>
              <ul className="space-y-1">
                {selectedEvent.locations.map((loc) => (
                  <li key={loc.name} className="text-xs text-parchment/70 flex gap-2">
                    <span className="text-sand/60 capitalize">{loc.role}</span>
                    <span>{loc.name}</span>
                    {loc.notes && <span className="text-parchment/40">— {loc.notes}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedEvent.crossReferences && selectedEvent.crossReferences.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-sand/60 mb-1">Cross References</p>
              <p className="text-xs text-parchment/60">
                {selectedEvent.crossReferences.join(" · ")}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
