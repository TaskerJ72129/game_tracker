import { handleGameCompletion } from "@/lib/xp/gameCompletion";
import { calculateLevel } from "@/lib/xp/xpUtils";
import { OVERALL_XP, GENRE_XP } from "@/lib/xp/xpConfig";

export default function XPTestPage() {
  const result = handleGameCompletion({
    currentOverallXP: 240,
    currentGenreXP: { RPG: 80 },
    gameGenres: ["RPG", "Action"],
  });

  const overall = calculateLevel(result.newOverallXP, OVERALL_XP);
  const rpg = calculateLevel(result.newGenreXP.RPG, GENRE_XP);

  return (
    <pre>{JSON.stringify({ result, overall, rpg }, null, 2)}</pre>
  );
}
