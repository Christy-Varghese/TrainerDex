import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsBrowser, { type EventGroup } from "@/components/EventsBrowser";
import Icon from "@/components/Icon";
import RoadOfLegendsSpotlight from "@/components/RoadOfLegendsSpotlight";
import { getEvents } from "@/lib/events";
import type { EventType, PogoEvent } from "@/lib/types";
import {
  endsBucket,
  hasEnded,
  parseLocal,
  startsBucket,
  type EndBucket,
  type StartBucket,
} from "@/lib/time";

export const revalidate = 3600; // rebuild the page hourly to track the feed

const END_LABELS: { key: EndBucket; label: string }[] = [
  { key: "today", label: "Ends Today" },
  { key: "week", label: "Ends This Week" },
  { key: "month", label: "Ends This Month" },
  { key: "later", label: "Ends Later" },
];

const START_LABELS: { key: StartBucket; label: string }[] = [
  { key: "today", label: "Starts Today" },
  { key: "this-week", label: "Starts This Week" },
  { key: "next-week", label: "Starts Next Week" },
  { key: "month", label: "Starts This Month" },
  { key: "later", label: "Starts Later" },
];

function group<K extends string>(
  events: PogoEvent[],
  labels: { key: K; label: string }[],
  classify: (e: PogoEvent) => K,
  sort: (a: PogoEvent, b: PogoEvent) => number,
): EventGroup[] {
  const byKey = new Map<K, PogoEvent[]>();
  for (const e of events) {
    const k = classify(e);
    (byKey.get(k) ?? byKey.set(k, []).get(k)!).push(e);
  }
  return labels
    .map(({ key, label }) => ({ label, events: (byKey.get(key) ?? []).sort(sort) }))
    .filter((g) => g.events.length > 0);
}

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();

  const live = events.filter((e) => !hasEnded(e.end, now));
  const started = (e: PogoEvent) => parseLocal(e.start).getTime() <= now.getTime();

  const byEnd = (a: PogoEvent, b: PogoEvent) =>
    parseLocal(a.end).getTime() - parseLocal(b.end).getTime();
  const byStart = (a: PogoEvent, b: PogoEvent) =>
    parseLocal(a.start).getTime() - parseLocal(b.start).getTime();

  const happeningNow = group(live.filter(started), END_LABELS, (e) => endsBucket(e.end, now), byEnd);
  const upcoming = group(live.filter((e) => !started(e)), START_LABELS, (e) => startsBucket(e.start, now), byStart);

  // Completed events from THIS calendar month — kept (not dropped) so trainers
  // can look back at what just happened. Most-recently-ended first.
  const endedThisMonth = events
    .filter((e) => {
      if (!hasEnded(e.end, now)) return false;
      const end = parseLocal(e.end);
      return end.getFullYear() === now.getFullYear() && end.getMonth() === now.getMonth();
    })
    .sort((a, b) => parseLocal(b.end).getTime() - parseLocal(a.end).getTime());
  const past: EventGroup[] = endedThisMonth.length
    ? [{ label: "Past events this month", events: endedThisMonth }]
    : [];

  // Filter universe spans live + past so a chosen type still matches past events.
  const types = [...new Set([...live, ...endedThisMonth].map((e) => e.eventType))] as EventType[];
  const liveCount = happeningNow.reduce((n, g) => n + g.events.length, 0);
  const soonCount = upcoming.reduce((n, g) => n + g.events.length, 0);

  return (
    <>
      <Header active="events" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-sky-500 to-blue-600 p-6 sm:p-8 shadow-lg shadow-sky-200 dark:shadow-none">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-sky-100">Your Pokémon GO Companion</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Events &amp; Activities</h1>
          <p className="mt-2 max-w-2xl text-sky-100">
            Live events, Spotlight &amp; Raid Hours, Community Days and what&apos;s coming up. All times in your local
            timezone, updated hourly.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="flame" /> {liveCount} live now
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="calendar" /> {soonCount} coming up
            </span>
          </div>
        </section>

        <RoadOfLegendsSpotlight />

        <EventsBrowser happeningNow={happeningNow} upcoming={upcoming} past={past} types={types} />
      </main>

      <Footer />
    </>
  );
}
