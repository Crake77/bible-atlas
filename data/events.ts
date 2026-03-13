/**
 * events.ts
 *
 * Bible events that have a geographic location.
 * Each event links to a location in locations.ts via locationId.
 *
 * This is the data that powers the Bible Reader sidebar and map markers.
 */

export type BibleEvent = {
  id: string;
  name: string;
  /** Scripture reference, e.g. "Genesis 1:1" */
  reference: string;
  /** Which location from locations.ts this event happened at */
  locationId: string;
  description: string;
};

export const bibleEvents: BibleEvent[] = [
  {
    id: "nativity",
    name: "Birth of Jesus",
    reference: "Luke 2:1–7",
    locationId: "bethlehem",
    description:
      "Jesus was born in Bethlehem during the reign of Caesar Augustus. Mary laid him in a manger because there was no room in the inn.",
  },
  {
    id: "baptism",
    name: "Baptism of Jesus",
    reference: "Matthew 3:13–17",
    locationId: "jordan-river",
    description:
      "Jesus came from Galilee to the Jordan to be baptized by John. A voice from heaven said, 'This is my beloved Son, with whom I am well pleased.'",
  },
  {
    id: "sermon-on-mount",
    name: "Sermon on the Mount",
    reference: "Matthew 5–7",
    locationId: "capernaum",
    description:
      "Jesus went up on a mountainside near Galilee and taught the Beatitudes, the Lord's Prayer, and foundational teachings of the Kingdom.",
  },
  {
    id: "jericho-walls",
    name: "Fall of Jericho",
    reference: "Joshua 6:1–27",
    locationId: "jericho",
    description:
      "God commanded Joshua to march around Jericho for seven days. On the seventh day the walls collapsed and Israel took the city.",
  },
  {
    id: "ten-commandments",
    name: "Ten Commandments Given",
    reference: "Exodus 20:1–17",
    locationId: "sinai",
    description:
      "Moses ascended Mount Sinai and received the Law from God, including the Ten Commandments written on stone tablets.",
  },
  {
    id: "crucifixion",
    name: "Crucifixion of Jesus",
    reference: "John 19:16–30",
    locationId: "jerusalem",
    description:
      "Jesus was crucified at Golgotha outside Jerusalem. He died and was buried in a nearby tomb provided by Joseph of Arimathea.",
  },
  {
    id: "resurrection",
    name: "Resurrection",
    reference: "John 20:1–18",
    locationId: "jerusalem",
    description:
      "On the third day, Mary Magdalene found the tomb empty. Jesus appeared to her, then to the disciples, confirming his resurrection.",
  },
];
