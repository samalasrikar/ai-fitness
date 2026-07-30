export default function StreakCard({ streak }) {
  if (!streak) return null;

  return (
    <div className="bg-surface-container p-5 rounded-2xl border border-white/5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl font-black">local_fire_department</span>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Streak Analytics</span>
            <h4 className="text-xs font-bold text-on-surface">Consistency Tracker</h4>
          </div>
        </div>
        <span className="text-xs font-bold text-primary font-[JetBrains_Mono,monospace] bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
          {streak.currentStreak} Days 🔥
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Longest</span>
          <span className="text-sm font-bold text-white font-[JetBrains_Mono,monospace]">{streak.longestStreak} days</span>
        </div>

        <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Consistency</span>
          <span className="text-sm font-bold text-primary font-[JetBrains_Mono,monospace]">{streak.monthlyConsistencyPct}%</span>
        </div>

        <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Workouts</span>
          <span className="text-sm font-bold text-white font-[JetBrains_Mono,monospace]">{streak.totalWorkouts} logged</span>
        </div>
      </div>
    </div>
  );
}
