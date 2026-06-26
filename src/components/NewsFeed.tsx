"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

/** Official newsroom feed with a category filter. Cards link out to the
 *  official article for the full write-up. */
export default function NewsFeed() {
  const cats = useMemo(() => [...new Set(NEWS.map((n) => n.category))], []);
  const [cat, setCat] = useState<NewsCategory | "all">("all");
  const shown = cat === "all" ? NEWS : NEWS.filter((n) => n.category === cat);

  return (
    <>
      <div className="mb-5 -mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2">
          <Pill active={cat === "all"} onClick={() => setCat("all")}>
            All
          </Pill>
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
        {shown.map((item) => {
          const m = newsCategoryMeta(item.category);
          const hasPage = !!getArticle(item.slug);
          const ev = formatEventDate(item);
          const inner = (
            <>
              <span className={`mt-0.5 shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${m.badge}`}>
                {m.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">{item.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
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
              <Icon name="arrowRight" aria-hidden className="shrink-0 self-center text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </>
          );
          const cls =
            "group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200";
          return (
            <li key={item.slug}>
              {hasPage ? (
                <Link href={`/news/${item.slug}`} className={cls}>
                  {inner}
                </Link>
              ) : (
                <div className={cls.replace("group ", "")}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </>
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
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
