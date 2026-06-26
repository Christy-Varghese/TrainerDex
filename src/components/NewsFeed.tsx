"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NEWS, newsCategoryMeta, getArticle, type NewsCategory, type NewsItem } from "@/lib/news";
import Icon from "./Icon";

const DAY_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
const MONTH_DAY: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatEventDate(item: NewsItem): { label: string; status: "upcoming" | "live" | "ended" } | null {
  if (!item.eventStart) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = parseDate(item.eventStart);
  const end = item.eventEnd ? parseDate(item.eventEnd) : start;

  const status = today < start ? "upcoming" : today <= end ? "live" : "ended";

  const startStr = start.toLocaleDateString(undefined, MONTH_DAY);
  const endStr = end.toLocaleDateString(undefined, MONTH_DAY);
  const label = item.eventEnd && item.eventEnd !== item.eventStart ? `${startStr} – ${endStr}` : startStr;

  return { label, status };
}

/** Official newsroom feed with a category filter. */
export default function NewsFeed() {
  const cats = useMemo(() => [...new Set(NEWS.map((n) => n.category))], []);
  const [cat, setCat] = useState<NewsCategory | "all">("all");
  const shown = cat === "all" ? NEWS : NEWS.filter((n) => n.category === cat);

  return (
    <>
      <div className="mb-5 -mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          <Pill active={cat === "all"} onClick={() => setCat("all")}>All</Pill>
          {cats.map((c) => {
            const m = newsCategoryMeta(c);
            return (
              <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
                {m.label}
              </Pill>
            );
          })}
        </div>
      </div>

      <ul className="space-y-2.5">
        {shown.map((item) => <NewsCard key={item.slug} item={item} />)}
      </ul>
    </>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const m = newsCategoryMeta(item.category);
  const hasPage = !!getArticle(item.slug);
  const ev = formatEventDate(item);

  const inner = (
    <div className="flex min-h-[72px] overflow-hidden">
      {/* ── Left category panel ── */}
      <div className={`flex w-24 shrink-0 flex-col items-center justify-center gap-1.5 px-2 py-4 ${m.panelBg}`}>
        <Icon name={m.icon} className={`h-5 w-5 ${m.panelText}`} aria-hidden />
        <span className={`text-center text-[10px] font-bold uppercase leading-tight tracking-wide ${m.panelText}`}>
          {m.label}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
          {item.title}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-slate-400">
            {new Date(item.date).toLocaleDateString(undefined, DAY_FMT)}
          </p>
          {ev && (
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                ev.status === "live"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : ev.status === "upcoming"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
                  : "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500",
              ].join(" ")}
            >
              {ev.status === "live" && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
              )}
              {ev.status === "upcoming" && <Icon name="calendar" />}
              {ev.status === "live" ? "Live" : ev.status === "upcoming" ? "Upcoming" : "Ended"}
              <span className="opacity-80">{ev.label}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Thumbnail (when available) ── */}
      {item.image && (
        <div className="relative hidden w-28 shrink-0 sm:block">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
      )}

      {/* ── Arrow ── */}
      <div className="flex items-center pr-4 pl-2">
        <Icon
          name="arrowRight"
          aria-hidden
          className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
        />
      </div>
    </div>
  );

  const cls =
    "group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200 dark:border-white/10 dark:bg-white/5 dark:hover:shadow-black/20";

  return (
    <li>
      {hasPage ? (
        <Link href={`/news/${item.slug}`} className={cls}>
          {inner}
        </Link>
      ) : (
        <div className={cls.replace("group ", "")}>{inner}</div>
      )}
    </li>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        active
          ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
