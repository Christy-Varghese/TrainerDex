import { notFound } from "next/navigation";
import { getArticle, getNewsItem } from "@/lib/news";
import { extractPokemon, hundoCpAt, spriteUrl } from "@/lib/pokedex";
import ShadowBadge from "@/components/ShadowBadge";

export const revalidate = 3600;

// Curated event posters — title/subtitle for the events we feature.
const POSTERS: Record<string, { title: string; subtitle: string; gradient: string }> = {
  "road-of-legends-2026": {
    title: "Road of Legends",
    subtitle: "Raid-exclusive Legendaries · hundo CP (raid catch)",
    gradient: "radial-gradient(130% 90% at 50% -10%, #f59e0b 0%, #b45309 45%, #7c2d12 100%)",
  },
  "community-celebrations-go-fest-2026": {
    title: "GO Fest 2026: Global",
    subtitle: "Raid-exclusive Legendaries · hundo CP (raid catch)",
    gradient: "radial-gradient(130% 90% at 50% -10%, #8b5cf6 0%, #6d28d9 45%, #4c1d95 100%)",
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTERS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/graphic/event/[slug]">) {
  const { slug } = await params;
  return { title: `${POSTERS[slug]?.title ?? "Event"} — TrainerDex Graphic` };
}

export default async function EventGraphic({ params }: PageProps<"/graphic/event/[slug]">) {
  const { slug } = await params;
  const cfg = POSTERS[slug];
  const item = getNewsItem(slug);
  const blocks = getArticle(slug);
  if (!cfg || !blocks) notFound();

  const mons = extractPokemon(
    blocks.flatMap((b) => (b.type === "list" ? b.items : [b.text])),
    30,
  );

  return (
    <div className="grid min-h-screen place-items-center bg-slate-200 p-6">
      <div
        id="poster"
        className="relative w-[720px] overflow-hidden rounded-3xl px-8 py-9 text-white shadow-2xl"
        style={{ background: cfg.gradient }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#fbbf24 2px, transparent 2.2px), radial-gradient(#34d399 2px, transparent 2.2px), radial-gradient(#f472b6 2px, transparent 2.2px), radial-gradient(#60a5fa 2px, transparent 2.2px)",
            backgroundSize: "46px 46px, 64px 64px, 80px 80px, 104px 104px",
            backgroundPosition: "0 0, 23px 18px, 40px 6px, 12px 34px",
          }}
        />
        <div className="relative">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-xl shadow">
                ⚡
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Trainer<span className="text-sky-300">Dex</span>
              </span>
            </div>
            {item && <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">{item.date}</span>}
          </div>
          <h1 className="text-center text-3xl font-black uppercase tracking-wide drop-shadow">{cfg.title}</h1>
          <p className="mb-7 text-center text-sm font-medium text-white/75">{cfg.subtitle}</p>

          {mons.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {mons.map(({ pokemon: p, shadow }) => (
                <div
                  key={p.dex}
                  className="flex flex-col items-center rounded-2xl bg-white/10 px-2 pb-2.5 pt-2 ring-1 ring-white/15 backdrop-blur-sm"
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={spriteUrl(p.dex)} alt={p.name} className="h-24 w-24 object-contain drop-shadow-lg" />
                    {shadow && (
                      <span className="absolute left-0 top-0">
                        <ShadowBadge size={6} />
                      </span>
                    )}
                    {p.shiny && <span className="absolute right-0 top-0 text-lg text-amber-300 drop-shadow">✨</span>}
                  </div>
                  <p className="max-w-full truncate text-center text-sm font-bold leading-tight">{p.name}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded-md bg-black/85 px-2 py-0.5 text-sm font-extrabold tabular-nums">
                      {shadow ? hundoCpAt(p, 8).toLocaleString() : hundoCpAt(p, 20).toLocaleString()}
                    </span>
                    <span className="rounded-md bg-black/85 px-2 py-0.5 text-sm font-extrabold tabular-nums text-amber-300">
                      {shadow ? hundoCpAt(p, 13).toLocaleString() : hundoCpAt(p, 25).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/70">No Pokémon found for this event.</p>
          )}

          <div className="mt-8 flex items-center justify-center gap-5 text-xs text-white/75">
            <span>
              <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold">white</span> raid catch (L20)
            </span>
            <span>
              <span className="rounded bg-black/85 px-1.5 py-0.5 font-bold text-amber-300">gold</span> weather boosted (L25)
            </span>
            <span>✨ shiny · raid-exclusive</span>
          </div>
          <p className="mt-1 text-center text-[11px] text-white/55">TrainerDex · source: official Pokémon GO newsroom</p>
        </div>
      </div>
    </div>
  );
}
