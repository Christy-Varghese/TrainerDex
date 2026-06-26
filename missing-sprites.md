# Missing Sprites — Coverage Checklist

Living checklist of Pokémon whose sprite assets are missing, placeholdered, or
unrenderable in the app. Update on every sprite gap you add or discover.

**Row format**

```
| #XXX | Pokémon Name | variant (default/shiny/shadow/mega/regional/costume) | source URL or N/A | status |
```

**Status values:** `missing` · `placeholder` · `resolved`

Default sprites resolve to the PokeMiners addressable mirror
(`…/Addressable Assets/pm<dex>.icon.png`). When that 404s, a local override in
`src/lib/pokedex.ts` (`SPRITE_OVERRIDE`) points to a file in `public/` or
`public/sprites/`.

---

## Default sprites — resolved via local override

PokeMiners has no `pm<dex>.icon.png` for these; downloaded from PokémonDB HOME
renders into `public/sprites/` (Kyurem provided manually).

| Dex | Pokémon Name | variant | source URL | status |
|---|---|---|---|---|
| #646 | Kyurem | default | provided manually → `/kyurem_sprite.png` | resolved |
| #649 | Genesect | default | https://img.pokemondb.net/sprites/home/normal/genesect.png | resolved |
| #837 | Rolycoly | default | https://img.pokemondb.net/sprites/home/normal/rolycoly.png | resolved |
| #838 | Carkol | default | https://img.pokemondb.net/sprites/home/normal/carkol.png | resolved |
| #839 | Coalossal | default | https://img.pokemondb.net/sprites/home/normal/coalossal.png | resolved |
| #845 | Cramorant | default | https://img.pokemondb.net/sprites/home/normal/cramorant.png | resolved |
| #852 | Clobbopus | default | https://img.pokemondb.net/sprites/home/normal/clobbopus.png | resolved |
| #853 | Grapploct | default | https://img.pokemondb.net/sprites/home/normal/grapploct.png | resolved |
| #917 | Tarountula | default | https://img.pokemondb.net/sprites/home/normal/tarountula.png | resolved |
| #918 | Spidops | default | https://img.pokemondb.net/sprites/home/normal/spidops.png | resolved |
| #932 | Nacli | default | https://img.pokemondb.net/sprites/home/normal/nacli.png | resolved |
| #933 | Naclstack | default | https://img.pokemondb.net/sprites/home/normal/naclstack.png | resolved |
| #934 | Garganacl | default | https://img.pokemondb.net/sprites/home/normal/garganacl.png | resolved |
| #940 | Wattrel | default | https://img.pokemondb.net/sprites/home/normal/wattrel.png | resolved |
| #941 | Kilowattrel | default | https://img.pokemondb.net/sprites/home/normal/kilowattrel.png | resolved |
| #950 | Klawf | default | https://img.pokemondb.net/sprites/home/normal/klawf.png | resolved |
| #969 | Glimmet | default | https://img.pokemondb.net/sprites/home/normal/glimmet.png | resolved |
| #970 | Glimmora | default | https://img.pokemondb.net/sprites/home/normal/glimmora.png | resolved |

---

## Regional forms — resolved

All 51 regional forms (Galarian / Alolan / Hisuian / Paldean) render from the
PokeMiners mirror via `pm<dex>.f<FORM>.icon.png` and were verified 200. Tracked
here as a group; add individual rows only if one regresses.

| Dex range | variant | source | status |
|---|---|---|---|
| various (50 species) | regional (Galarian/Alolan/Hisuian/Paldean) | `…/pm<dex>.f<FORM>.icon.png` | resolved |

---

## Variant coverage — not yet implemented

These variant sprite sets are not wired into the app yet. They are placeholders
on the roadmap (idea.md Pokédex spec: shiny / shadow / purified / mega /
gigantamax / costume / gender). Filled in as each variant module ships.

| Variant | coverage | source candidate | status |
|---|---|---|---|
| Shiny | not rendered (shiny flag only) | `img.pokemondb.net/sprites/home/shiny/<name>.png` | missing |
| Shadow / Purified | flame badge only, no distinct art | overlay on default | placeholder |
| Mega / Primal | not rendered (CP only via Pokédex) | `…/pm<dex>.fMEGA[_X/_Y].icon.png` (naming varies) | missing |
| Gigantamax | not rendered | N/A (no GO assets) | missing |
| Costume forms | not rendered | PokeMiners costume suffixes | missing |
| Gender differences | not rendered | PokeMiners `.fFEMALE` suffix | missing |

---

## Special / fused forms — variant viewer

Surfaced on the Pokédex detail page via `getVariants` (fusions/crowned from
`special-forms.ts`, megas from the feed + supplement). Mega Mewtwo X/Y are
announced but have no GO asset yet — they 404 and render the Poké Ball
placeholder until PokeMiners ships them.

| #XXX | Pokémon Name | variant | source URL | status |
|---|---|---|---|---|
| #150 | Mega Mewtwo X | mega (datamined) | local → `/sprites/mega-mewtwo-x.png` | resolved |
| #150 | Mega Mewtwo Y | mega (datamined) | local → `/sprites/mega-mewtwo-y.png` | resolved |
| #807 | Zeraora | default | local → `/sprites/zeraora.png` (SPRITE_OVERRIDE) | resolved |
| #800 | Dusk Mane Necrozma | fusion | `…/pm800.fDUSK_MANE.icon.png` | resolved |
| #800 | Dawn Wings Necrozma | fusion | `…/pm800.fDAWN_WINGS.icon.png` | resolved |
| #888 | Crowned Sword Zacian | crowned | `…/pm888.fCROWNED_SWORD.icon.png` | resolved |
| #889 | Crowned Shield Zamazenta | crowned | `…/pm889.fCROWNED_SHIELD.icon.png` | resolved |

---

_Last reviewed: 2026-06-25 — default + regional sprite coverage complete._
