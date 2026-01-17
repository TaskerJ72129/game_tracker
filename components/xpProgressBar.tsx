type Props = {
  level: number;
  currentXP: number;
  nextLevelXP: number;
};

export default function XPProgressBar({
  level,
  currentXP,
  nextLevelXP,
}: Props) {
  const progress = Math.round((currentXP / nextLevelXP) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>Lv {level}</span>
        <span>
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
