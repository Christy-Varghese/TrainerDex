"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NEWS, newsCategoryMeta, getArticle, type NewsCategory } from "@/lib/news";

const DAY_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };

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
          const inner = (
            <>
              <span className={`mt-0.5 shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${m.badge}`}>
                {m.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 group-hover:text-indigo-600">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {new Date(item.date).toLocaleDateString(undefined, DAY_FMT)}
                </p>
              </div>
              <span className="shrink-0 self-center text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500">
                →
              </span>
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
        "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
