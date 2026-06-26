import { notFound } from "next/navigation";
import WeeklyPoster from "@/components/WeeklyPoster";
import { getWeek, getWeeks } from "@/lib/weekly";

export const revalidate = 3600;

export async function generateStaticParams() {
  const weeks = await getWeeks(6);
  return weeks.map((w) => ({ week: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const w = await getWeek(week);
  return { title: w ? `Weekly Hundo CP · ${w.label} — TrainerDex` : "Weekly graphic — TrainerDex" };
}

// Bare poster on its own page — used for full-size viewing and PNG capture.
export default async function WeekGraphicPage({ params }: { params: Promise<{ week: string }> }) {
  const { week } = await params;
  const w = await getWeek(week);
  if (!w) notFound();
  return (
    <div className="grid min-h-screen place-items-center bg-slate-200 p-6">
      <WeeklyPoster week={w} domId="poster" />
    </div>
  );
}
