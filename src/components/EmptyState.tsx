import Link from "next/link";
import Icon, { type IconName } from "./Icon";

type Props = {
  icon?: IconName;
  title: string;
  /** One supportive sentence — context, not just "nothing here". */
  hint?: string;
  /** Optional primary action so the dead-end becomes a next step. */
  action?: { label: string; href: string };
};

/**
 * Warm empty state. Principle 1: "No items found." is not a design — every
 * empty state needs an icon, context, and (where possible) a primary action.
 */
export default function EmptyState({ icon = "search", title, hint, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-white/15 dark:bg-white/5">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-xl text-slate-500 dark:bg-white/10 dark:text-slate-300">
        <Icon name={icon} />
      </span>
      <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b1020]"
        >
          {action.label}
          <Icon name="arrowRight" />
        </Link>
      )}
    </div>
  );
}
