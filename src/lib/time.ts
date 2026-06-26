// Pokémon GO schedules most recurring activities (Spotlight Hour, Raid Hour,
// Community Day) at a fixed *local* time. The feed stores local-naive ISO
// strings (no timezone). `new Date("2026-06-25T18:00:00")` parses that as local
// time in the browser, which is exactly what we want — each trainer sees the
// event in their own timezone with no conversion math.

export function parseLocal(iso: string): Date {
  return new Date(iso);
}

export function isActive(startISO: string, endISO: string, now: Date = new Date()): boolean {
  const t = now.getTime();
  return t >= parseLocal(startISO).getTime() && t <= parseLocal(endISO).getTime();
}

export function isToday(startISO: string, endISO: string, now: Date = new Date()): boolean {
  const start = parseLocal(startISO);
  const end = parseLocal(endISO);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  // Overlaps any part of today.
  return start.getTime() <= dayEnd.getTime() && end.getTime() >= dayStart.getTime();
}

export function isUpcoming(startISO: string, now: Date = new Date()): boolean {
  return parseLocal(startISO).getTime() > now.getTime();
}

export function hasEnded(endISO: string, now: Date = new Date()): boolean {
  return parseLocal(endISO).getTime() < now.getTime();
}

/** ms until an event starts (negative if already started). */
export function msUntil(iso: string, now: Date = new Date()): number {
  return parseLocal(iso).getTime() - now.getTime();
}

/** Human countdown like "2d 4h", "3h 12m", "8m 5s". */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

const TIME_FMT: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
const DAY_FMT: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

export function formatTimeRange(startISO: string, endISO: string): string {
  const start = parseLocal(startISO);
  const end = parseLocal(endISO);
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    return `${start.toLocaleString(undefined, DAY_FMT)} · ${start.toLocaleTimeString(
      undefined,
      TIME_FMT,
    )} – ${end.toLocaleTimeString(undefined, TIME_FMT)}`;
  }
  return `${start.toLocaleString(undefined, DAY_FMT)} – ${end.toLocaleString(undefined, DAY_FMT)}`;
}

export function formatDay(iso: string): string {
  return parseLocal(iso).toLocaleString(undefined, DAY_FMT);
}

// ---- Time-proximity bucketing (Confirmed Phase 1 plan) ---------------------
// "Happening Now" cards are grouped by how soon they end; "Upcoming" cards by
// how soon they start. Weeks are Monday-based calendar weeks so "this week" /
// "next week" line up with how trainers read a calendar, not a rolling 7 days.

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/** End-of-day of the coming Sunday (Monday-based week). */
function endOfWeek(now: Date): Date {
  const dow = now.getDay(); // 0=Sun … 6=Sat
  const daysToSunday = dow === 0 ? 0 : 7 - dow;
  const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysToSunday);
  return endOfDay(sunday);
}

function endOfNextWeek(now: Date): Date {
  const eow = endOfWeek(now);
  return endOfDay(new Date(eow.getFullYear(), eow.getMonth(), eow.getDate() + 7));
}

function endOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

export type EndBucket = "today" | "week" | "month" | "later";
export type StartBucket = "today" | "this-week" | "next-week" | "month" | "later";

/** Bucket a currently-live event by how soon it ends. */
export function endsBucket(endISO: string, now: Date = new Date()): EndBucket {
  const end = parseLocal(endISO).getTime();
  if (end <= endOfDay(now).getTime()) return "today";
  if (end <= endOfWeek(now).getTime()) return "week";
  if (end <= endOfMonth(now).getTime()) return "month";
  return "later";
}

/** Bucket an upcoming event by how soon it starts. */
export function startsBucket(startISO: string, now: Date = new Date()): StartBucket {
  const start = parseLocal(startISO).getTime();
  if (start <= endOfDay(now).getTime()) return "today";
  if (start <= endOfWeek(now).getTime()) return "this-week";
  if (start <= endOfNextWeek(now).getTime()) return "next-week";
  if (start <= endOfMonth(now).getTime()) return "month";
  return "later";
}
