export default function AchievementCard({ achievement }) {
  const { title, description, icon, unlocked, unlockDate, progress, target, xpReward } = achievement;
  const pct = target ? Math.min(Math.round((progress / target) * 100), 100) : 100;

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      unlocked 
        ? 'bg-surface-container border-primary/20 shadow-md shadow-primary/5' 
        : 'bg-[#121212] border-white/5 opacity-80'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${
          unlocked 
            ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(245,196,0,0.3)]' 
            : 'bg-surface-container-high text-on-surface-variant/40 border-white/5'
        }`}>
          <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: unlocked ? "'FILL' 1" : "'FILL' 0" }}>
            {icon || 'emoji_events'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-on-surface truncate">{title}</h4>
            {xpReward && (
              <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                +{xpReward} XP
              </span>
            )}
          </div>
          <p className="text-[10px] text-on-surface-variant/80 mt-0.5 leading-snug">{description}</p>

          {/* Progress or Unlock Date */}
          {unlocked ? (
            <span className="text-[9px] font-bold text-primary flex items-center gap-1 mt-2">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              Unlocked {unlockDate || 'Recently'}
            </span>
          ) : (
            <div className="mt-2.5 space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-on-surface-variant uppercase font-[JetBrains_Mono,monospace]">
                <span>Progress</span>
                <span>{progress} / {target}</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-primary/70 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
