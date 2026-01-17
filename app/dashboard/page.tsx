import { mockUserXP, mockEarnedXP } from "./mockUserXP";
import { calculateLevel } from "@/lib/xp/xpUtils";
import { GENRE_XP } from "@/lib/xp/xpConfig";

export default function DashboardPage() {
  const updatedGenres: Record<string, number> = {
    ...mockUserXP.genres,
  };

  for (const genre in mockEarnedXP.genres) {
    updatedGenres[genre] =
      (updatedGenres[genre] ?? 0) +
      mockEarnedXP.genres[genre];
  }

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Genre Levels</h1>
      </section>

      <section className="space-y-4">
        {Object.entries(updatedGenres).map(([genre, xp]) => {
          const data = calculateLevel(xp, GENRE_XP);

          return (
            <div key={genre}>
              <div className="flex justify-between text-sm mb-1">
                <span>{genre}</span>
                <span>Lv {data.level}</span>
              </div>

              <div className="h-3 bg-zinc-800 rounded">
                <div
                  className="h-3 bg-emerald-600 rounded"
                  style={{ width: `${data.progress * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
