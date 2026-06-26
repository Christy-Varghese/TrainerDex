import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";
import Icon from "@/components/Icon";
import { NEWS, OFFICIAL_NEWS_BASE } from "@/lib/news";
import { TIP_GROUPS } from "@/lib/tips";

export const metadata: Metadata = {
  title: "News & Tips — TrainerDex",
  description:
    "Latest official Pokémon GO news plus evergreen tips & tricks for Community Day, raids, catching, PvP, and egg hatching.",
};

export default function NewsPage() {
  return (
    <>
      <Header active="news" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <section className="mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 to-violet-600 p-6 sm:p-8 shadow-lg shadow-indigo-200">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-indigo-100">News &amp; Strategy</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">What&apos;s New in Pokémon GO</h1>
          <p className="mt-2 max-w-2xl text-indigo-100">
            The latest straight from the official newsroom, plus battle-tested tips that stay useful between events.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="megaphone" /> {NEWS.length} updates
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-white">
              <Icon name="lightbulb" /> {TIP_GROUPS.reduce((n, g) => n + g.tips.length, 0)} tips
            </span>
          </div>
        </section>

        {/* Official news feed */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Icon name="megaphone" className="text-indigo-500" /> Latest News
          </h2>
          <NewsFeed />
        </section>

        {/* Tips & Tricks */}
        <section className="mb-6">
          <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Icon name="lightbulb" className="text-amber-500" /> Tips &amp; Tricks
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Grounded in official game mechanics — make every event count.
          </p>

          <div className="space-y-8">
            {TIP_GROUPS.map((group) => (
              <div key={group.category}>
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
                  <Icon name="lightbulb" className="text-amber-500" />
                  {group.label}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {group.tips.map((tip) => (
                    <article
                      key={tip.title}
                      className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <h4 className="mb-1 font-semibold text-slate-900 dark:text-white">{tip.title}</h4>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tip.body}</p>
                      {tip.sourceSlug && (
                        <a
                          href={`${OFFICIAL_NEWS_BASE}/${tip.sourceSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-sky-600 underline-offset-2 hover:underline"
                        >
                          Official source ↗
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
