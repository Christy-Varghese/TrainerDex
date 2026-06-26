import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0b1020]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand column */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-sm text-white shadow-sm">
                <Icon name="bolt" title="TrainerDex" />
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                Trainer<span className="text-sky-500 dark:text-sky-400">Dex</span>
              </span>
            </div>
            <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
              Your all-in-one Pokémon GO companion — events, raids, IV references, and more.
            </p>
          </div>

          {/* Attribution column */}
          <div className="text-sm text-slate-500 sm:text-right">
            <p className="mb-1">
              Event data from{" "}
              <a
                href="https://leekduck.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline-offset-2 hover:underline"
              >
                Leek Duck
              </a>{" "}
              &amp; the official{" "}
              <a
                href="https://pokemongolive.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline-offset-2 hover:underline"
              >
                Pokémon GO
              </a>{" "}
              site.
            </p>
            <p className="text-xs text-slate-400">Times shown in your local timezone.</p>
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-400">
          Unofficial fan-made resource. Not affiliated with, endorsed, or sponsored by Niantic,
          The Pokémon Company, or Nintendo. Pokémon and Pokémon GO are trademarks of their
          respective owners.
        </div>
      </div>
    </footer>
  );
}
