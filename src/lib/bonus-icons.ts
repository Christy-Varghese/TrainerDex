// Map an event-bonus / reward line to a visual marker so trainers can scan the
// list at a glance instead of re-reading the official wording. Well-known items
// (Stardust, Candy, Rare Candy XL, Incense, …) use the official Pokémon GO item
// sprites from the PokeMiners asset mirror; everything else falls back to an
// emoji. Keyword-matched, most-specific first.

const ITEMS = "https://raw.githubusercontent.com/PokeMiners/pogo_assets/master/Images/Items";

interface SpriteRule {
  re: RegExp;
  url: string;
}

// Official GO item sprites — order matters (XL/Rare Candy before plain Candy).
const SPRITE_RULES: SpriteRule[] = [
  { re: /rare\s*candy\s*xl|rare\s*xl\s*candy/i, url: `${ITEMS}/RareXLCandy_PSD.png` },
  { re: /candy\s*xl|xl\s*candy/i, url: `${ITEMS}/LV40_XLCandy_RGB_PSD.png` },
  { re: /rare\s*candy/i, url: `${ITEMS}/RareXLCandy_PSD.png` },
  { re: /candy/i, url: `${ITEMS}/candy_rgb.png` },
  { re: /stardust/i, url: `${ITEMS}/stardust_painted.png` },
  { re: /star\s*piece/i, url: `${ITEMS}/starpiece.png` },
  { re: /lucky\s*egg/i, url: `${ITEMS}/luckyegg.png` },
  { re: /incense/i, url: `${ITEMS}/Incense_0.png` },
  { re: /egg|hatch|incubat/i, url: `${ITEMS}/EggIncubatorSuper_Activated.png` },
  { re: /great\s*ball/i, url: `${ITEMS}/greatball_sprite.png` },
  { re: /poké?\s*ball|ultra\s*ball|\bballs?\b/i, url: `${ITEMS}/pokeball_sprite.png` },
  { re: /gift/i, url: `${ITEMS}/GiftBox.png` },
];

/** Official item sprite URL for a bonus line, or null if there isn't a good one. */
export function bonusSprite(text: string): string | null {
  for (const r of SPRITE_RULES) if (r.re.test(text)) return r.url;
  return null;
}

// Emoji fallback for bonuses without a dedicated item sprite.
const EMOJI_RULES: { re: RegExp; icon: string }[] = [
  { re: /lure/i, icon: "🧲" },
  { re: /lucky|friendship|friends/i, icon: "🤝" },
  { re: /trade/i, icon: "🔄" },
  { re: /\bxp\b|experience/i, icon: "📈" },
  { re: /premium battle pass|raid pass|battle pass/i, icon: "🎟️" },
  { re: /snapshot|photo/i, icon: "📸" },
  { re: /shiny/i, icon: "🌟" },
  { re: /buddy/i, icon: "🐾" },
  { re: /walk|distance|steps/i, icon: "👟" },
  { re: /timed research/i, icon: "⏱️" },
  { re: /field research/i, icon: "🔬" },
  { re: /special research|research/i, icon: "📜" },
  { re: /raid/i, icon: "🛡️" },
  { re: /mega|primal/i, icon: "🔆" },
  { re: /spawn|wild|appear|encounter/i, icon: "🌿" },
  { re: /ticket/i, icon: "🎫" },
];

export function bonusIcon(text: string): string {
  for (const r of EMOJI_RULES) if (r.re.test(text)) return r.icon;
  return "✨";
}
