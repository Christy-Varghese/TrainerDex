import type { SVGProps } from "react";

// Inline SVG icon set (Lucide-derived 24x24, currentColor stroke). Replaces the
// emoji we used as UI icons — emoji read as "fan site" and have no accessible
// label. Every icon is decorative by default (aria-hidden); pass `title` to
// expose an accessible name (renders role="img" + <title>).

export type IconName =
  | "bolt"
  | "pokedex"
  | "shield"
  | "calendar"
  | "megaphone"
  | "image"
  | "lightbulb"
  | "hourglass"
  | "spotlight"
  | "star"
  | "egg"
  | "sparkles"
  | "sun"
  | "moon"
  | "search"
  | "flame"
  | "chevronRight"
  | "arrowRight"
  | "ghost"
  | "globe"
  | "check"
  | "info";

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  /** Accessible label. When set, the icon is exposed to assistive tech. */
  title?: string;
};

// Path data only — the <svg> wrapper is shared.
const PATHS: Record<IconName, React.ReactNode> = {
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
  pokedex: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </>
  ),
  shield: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />,
  calendar: (
    <>
      <path d="M8 2v4M16 2v4M3 10h18" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
    </>
  ),
  megaphone: (
    <>
      <path d="m3 11 18-5v12L3 14v-3Z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
    </>
  ),
  hourglass: <path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2" />,
  spotlight: (
    <>
      <path d="M12 3v2M5.6 5.6l1.4 1.4M3 12h2M18.4 5.6 17 7M19 12h2" />
      <circle cx="12" cy="14" r="5" />
    </>
  ),
  star: <path d="M11.5 3.6a.6.6 0 0 1 1 0l2.3 4.6 5.1.75a.6.6 0 0 1 .33 1l-3.7 3.6.87 5.08a.6.6 0 0 1-.87.63L12 17.5l-4.56 2.4a.6.6 0 0 1-.87-.64l.87-5.07-3.7-3.6a.6.6 0 0 1 .34-1.02l5.1-.74Z" />,
  egg: <path d="M12 22c4 0 7-2.7 7-7 0-5-3.5-13-7-13S5 10 5 15c0 4.3 3 7 7 7Z" />,
  sparkles: (
    <>
      <path d="M9.9 4.2 11 7.6l3.4 1.1L11 9.8 9.9 13.2 8.8 9.8 5.4 8.7 8.8 7.6 9.9 4.2Z" />
      <path d="M18 5v3M19.5 6.5h-3M17.5 16v2M18.5 17h-2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  flame: <path d="M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.5C9 10 9 8 8 7c3 0 4-3 4-5Z" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
  ghost: (
    <>
      <path d="M9 10h.01M15 10h.01" />
      <path d="M12 2a8 8 0 0 0-8 8v12l3-2 2 2 3-2 3 2 2-2 3 2V10a8 8 0 0 0-8-8Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
};

export default function Icon({ name, title, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
