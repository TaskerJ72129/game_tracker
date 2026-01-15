import { mockUserXP, mockEarnedXP } from "./mockUserXP";
import { calculateLevel } from "@/lib/xp/xpUtils";
import { OVERALL_XP, GENRE_XP } from "@/lib/xp/xpConfig";

export default function DashboardPage() {
  // Apply overall XP
  const totalOverallXP = mockUserXP.overall + mockEarnedXP.overall;
  const overallLevel = calculateLevel(totalOverallXP, OVERALL_XP);

  // Apply genre XP
  const updatedGenres: Record<string, number> = { ...mockUserXP.genres };
  for (const genre in mockEarnedXP.genres) {
    updatedGenres[genre] = (updatedGenres[genre] ?? 0) + mockEarnedXP.genres[genre];
  }

  const genreLevels: Record<string, ReturnType<typeof calculateLevel>> = {};
  for (const genre in updatedGenres) {
    genreLevels[genre] = calculateLevel(updatedGenres[genre], GENRE_XP);
  }

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-8">
      {/* User Info */}
      <section>
        <h1 className="text-3xl font-bold">{mockUserXP.username}</h1>
        <p className="text-gray-500">Level {overallLevel.level}</p>

        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded">
            <div
              className="h-4 bg-blue-600 rounded"
              style={{ width: `${overallLevel.progress * 100}%` }}
            />
          </div>
          <p className="text-sm mt-1">
            {overallLevel.currentXP} / {overallLevel.nextLevelXP} XP
          </p>
        </div>
      </section>

      {/* Genre Levels */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Genre Levels</h2>
        <div className="space-y-4">
          {Object.entries(genreLevels).map(([genre, data]) => (
            <div key={genre}>
              <div className="flex justify-between text-sm">
                <span>{genre}</span>
                <span>Lv {data.level}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded mt-1">
                <div
                  className="h-3 bg-green-600 rounded"
                  style={{ width: `${data.progress * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
