import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PokedexBrowser from "@/components/PokedexBrowser";
import Icon from "@/components/Icon";
import { getPokedex } from "@/lib/pokedex";

export const metadata: Metadata = {
  title: "Pokédex — Pokémon GO Info Center — TrainerDex",
  description:
    "Every Pokémon released in Pokémon GO: types, regions, GO base stats, max CP, and shiny availability. Search and filter by type or region.",
};

export default function PokemonPage() {
  const pokemon = getPokedex();
  const shiny = pokemon.filter((p) => p.shiny).length;

  return (
    <>
      <Header active="pokemon" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <section className="mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 p-6 sm:p-8 shadow-lg shadow-emerald-200">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-emerald-100">Pokémon Information Center</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Pokédex</h1>
          <p className="mt-2 max-w-2xl text-emerald-100">
            Every Pokémon released in Pokémon GO — types, region, GO base stats, max CP and shiny status. Search a
            name or dex number, or filter by type and region.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="pokedex" /> {pokemon.length} Pokémon
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="sparkles" /> {shiny} shiny-eligible
            </span>
          </div>
        </section>

        <PokedexBrowser pokemon={pokemon} />
      </main>

      <Footer />
    </>
  );
}
