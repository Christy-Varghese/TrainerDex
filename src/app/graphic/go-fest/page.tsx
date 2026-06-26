import { typeColor } from "@/lib/pokedex";

export const revalidate = 3600;

export const metadata = { title: "GO Fest 2026: Global (July 11–12) — TrainerDex Graphic" };

const SPRITE =
  "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Pokemon/Addressable%20Assets";

// GO Fest 2026: Global — July 11 & 12, 2026. Source: pokemongo.com/en/gofest/global
// + official newsroom. Mega Mewtwo / Zeraora use locally-provided art.
const HEADLINERS = [
  { name: "Mega Mewtwo X", tag: "Sat · Super Mega Raid", sprite: "/sprites/mega-mewtwo-x.png" },
  { name: "Mega Mewtwo Y", tag: "Sun · Super Mega Raid", sprite: "/sprites/mega-mewtwo-y.png" },
  { name: "Zeraora", tag: "Special Research", sprite: "/sprites/zeraora.png" },
];

const HABITATS: { day: string; accent: string; blocks: { time: string; name: string; types: string[] }[] }[] = [
  {
    day: "Saturday, July 11",
    accent: "from-amber-400 to-orange-600",
    blocks: [
      { time: "10 AM – 1 PM", name: "Stormfire Peaks", types: ["Ice", "Electric", "Fire"] },
      { time: "1 – 4 PM", name: "Astral Tides", types: ["Psychic", "Ghost", "Water"] },
      { time: "4 – 7 PM", name: "Dragonflight Summit", types: ["Flying", "Rock", "Dragon"] },
    ],
  },
  {
    day: "Sunday, July 12",
    accent: "from-violet-400 to-purple-600",
    blocks: [
      { time: "10 AM – 1 PM", name: "Earthforged Domain", types: ["Ground", "Steel", "Normal"] },
      { time: "1 – 4 PM", name: "Verdant Anomaly", types: ["Poison", "Bug", "Grass"] },
      { time: "4 – 7 PM", name: "Twilight Battlefield", types: ["Dark", "Fairy", "Fighting"] },
    ],
  },
];

const WILD = [
  { name: "Squirtle", sprite: `${SPRITE}/pm7.icon.png`, rare: false },
  { name: "Alolan Vulpix", sprite: `${SPRITE}/pm37.fALOLA.icon.png`, rare: false },
  { name: "Krabby", sprite: `${SPRITE}/pm98.icon.png`, rare: false },
  { name: "Staryu", sprite: `${SPRITE}/pm120.icon.png`, rare: false },
  { name: "Galarian Zigzagoon", sprite: `${SPRITE}/pm263.fGALARIAN.icon.png`, rare: false },
  { name: "Lapras", sprite: `${SPRITE}/pm131.icon.png`, rare: true },
  { name: "Vaporeon", sprite: `${SPRITE}/pm134.icon.png`, rare: true },
  { name: "Larvitar", sprite: `${SPRITE}/pm246.icon.png`, rare: true },
];

export default function GoFestGraphic() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-200 p-6">
      <div
        id="poster"
        className="relative w-[760px] overflow-hidden rounded-3xl px-8 py-9 text-white shadow-2xl"
        style={{ background: "radial-gradient(130% 90% at 50% -10%, #8b5cf6 0%, #6d28d9 45%, #3b0764 100%)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#c4b5fd 2px, transparent 2.2px), radial-gradient(#f0abfc 2px, transparent 2.2px)",
            backgroundSize: "46px 46px, 80px 80px",
            backgroundPosition: "0 0, 40px 6px",
          }}
        />
        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-sky-400 to-blue-600 text-xl shadow">
                ⚡
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Trainer<span className="text-sky-300">Dex</span>
              </span>
            </div>
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">FREE for all Trainers</span>
          </div>

          <h1 className="text-center text-3xl font-black uppercase tracking-wide drop-shadow">GO Fest 2026: Global</h1>
          <p className="mb-6 text-center text-sm font-medium text-white/75">
            July 11 &amp; 12, 2026 · 10 AM – 7 PM local time
          </p>

          {/* Headliners */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {HEADLINERS.map((h) => (
              <div
                key={h.name}
                className="flex flex-col items-center rounded-2xl bg-white/10 px-2 pb-2.5 pt-2 ring-1 ring-white/15 backdrop-blur-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.sprite} alt={h.name} className="h-20 w-20 object-contain drop-shadow-lg" />
                <p className="text-center text-sm font-bold leading-tight">{h.name}</p>
                <p className="mt-0.5 text-center text-[11px] font-semibold text-amber-200">{h.tag}</p>
              </div>
            ))}
          </div>

          {/* Habitats / regions per day */}
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-violet-200">
            Rotating Habitats
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3">
            {HABITATS.map((d) => (
              <div key={d.day} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                <p className={`mb-2 inline-block rounded-md bg-linear-to-br ${d.accent} px-2 py-0.5 text-xs font-black`}>
                  {d.day}
                </p>
                <div className="space-y-2">
                  {d.blocks.map((bl) => (
                    <div key={bl.name}>
                      <p className="text-[13px] font-bold leading-tight">{bl.name}</p>
                      <p className="text-[10px] font-medium text-white/60">{bl.time}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {bl.types.map((t) => (
                          <span key={t} className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${typeColor(t)}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Wild spawns */}
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-violet-200">
            Featured Wild Pokémon
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {WILD.map((w) => (
              <div
                key={w.name}
                className="flex flex-col items-center rounded-xl bg-white/10 px-1.5 pb-2 pt-1.5 ring-1 ring-white/15"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.sprite} alt={w.name} className="h-16 w-16 object-contain drop-shadow-lg" />
                  {w.rare && (
                    <span className="absolute -right-1 top-0 rounded bg-black/80 px-1 text-[8px] font-bold text-amber-300">
                      rare
                    </span>
                  )}
                </div>
                <p className="max-w-full truncate text-center text-[11px] font-bold leading-tight">{w.name}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 text-center text-[11px] text-white/55">
            TrainerDex · source: pokemongo.com/gofest/global &amp; official newsroom · all 18 types featured across habitats
          </p>
        </div>
      </div>
    </div>
  );
}
