export default function CalorieRing({ consumedCalories, targetCalories, onLogClick }) {
  const target = targetCalories || 2400;
  const consumed = Math.max(0, consumedCalories || 0);
  const remaining = target - consumed;
  const pct = Math.min(Math.round((consumed / target) * 100), 100);

  const circumference = 603; // 2 * PI * 96
  const strokeOffset = circumference * (1 - pct / 100);

  return (
    <div className="relative flex items-center justify-center py-6">
      <svg className="w-56 h-56 transform -rotate-90">
        <circle
          className="text-surface-container-high"
          cx="112"
          cy="112"
          fill="transparent"
          r="96"
          stroke="currentColor"
          strokeWidth="8"
        />
        <circle
          className="drop-shadow-[0_0_12px_rgba(245,196,0,0.3)] transition-all duration-1000"
          cx="112"
          cy="112"
          fill="transparent"
          r="96"
          stroke="#F5C400"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: strokeOffset }}
          strokeLinecap="round"
          strokeWidth="12"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-data-lg text-[28px] text-primary font-bold font-[JetBrains_Mono,monospace]">
          {consumed.toLocaleString()}
        </span>
        <span className="font-label-caps text-on-surface-variant text-[11px] -mt-1 font-bold tracking-wider">
          / {target.toLocaleString()} KCAL
        </span>
        <button
          onClick={onLogClick}
          className="mt-4 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full font-bold text-xs text-primary transition-colors cursor-pointer active:scale-95"
        >
          {remaining > 0 ? `${remaining.toLocaleString()} kcal left` : 'Goal Met! Log Meal'}
        </button>
      </div>
    </div>
  );
}
