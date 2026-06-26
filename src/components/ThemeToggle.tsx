"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

/** Light/dark toggle. Persists to localStorage; initial theme is set pre-paint
 *  by the inline script in the root layout to avoid a flash. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title={dark ? "Switch to light" : "Switch to dark"}
      className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-base text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-white/15 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-white/20"
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}
