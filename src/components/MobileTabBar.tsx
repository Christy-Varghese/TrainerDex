"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { NAV_LINKS } from "./Header";

/**
 * Fixed bottom tab bar for mobile — the "official app" navigation pattern. The
 * 5-item desktop header overflows at 375px, so below `sm` we hide it and show
 * this instead. Each tab is a 44px+ touch target with an icon + label. Lives in
 * the root layout and derives the active section from the URL, so pages don't
 * need to pass anything.
 */
export default function MobileTabBar() {
  const pathname = usePathname() ?? "/";
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-md sm:hidden dark:border-white/10 dark:bg-[#0b1020]/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV_LINKS.map((l) => {
          const on = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <li key={l.key} className="flex-1">
              <Link
                href={l.href}
                aria-current={on ? "page" : undefined}
                className={[
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[10px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400",
                  on
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white",
                ].join(" ")}
              >
                <Icon name={l.icon} className="text-xl" title={l.label} />
                <span>{l.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
