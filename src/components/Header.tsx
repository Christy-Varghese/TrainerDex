import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Icon, { type IconName } from "./Icon";

export type Section = "events" | "raids" | "pokemon" | "news" | "graphics";

/** Nav links shared by the desktop header and the mobile tab bar. */
export const NAV_LINKS: { label: string; href: string; key: Section; icon: IconName }[] = [
  { label: "Events", href: "/events", key: "events", icon: "calendar" },
  { label: "Pokémon", href: "/pokemon", key: "pokemon", icon: "pokedex" },
  { label: "Raids", href: "/raids", key: "raids", icon: "shield" },
  { label: "News", href: "/news", key: "news", icon: "megaphone" },
  { label: "Graphics", href: "/graphics", key: "graphics", icon: "image" },
];

export default function Header({ active = "events" }: { active?: Section }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-[#0b1020]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-lg text-white shadow-sm">
            <Icon name="bolt" title="TrainerDex" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Trainer<span className="text-sky-500 dark:text-sky-400">Dex</span>
            <span className="ml-1.5 hidden text-xs font-normal text-slate-400 sm:inline dark:text-slate-500">
              Pokémon GO Trainer Hub
            </span>
          </span>
        </Link>

        {/* Nav — desktop only; mobile uses the bottom tab bar. */}
        <div className="flex items-center gap-1.5">
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                aria-current={active === l.key ? "page" : undefined}
                className={[
                  "whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                  active === l.key
                    ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
