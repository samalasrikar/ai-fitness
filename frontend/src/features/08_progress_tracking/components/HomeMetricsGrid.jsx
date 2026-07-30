export default function HomeMetricsGrid({
  heartRate,
  steps,
  energy,
  hydration,
  muscleOffset,
  fatOffset
}) {
  return (
    <>
      {/* Live Statistics Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center relative flex-shrink-0">
            <span className="material-symbols-outlined text-error text-xl">favorite</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-background animate-live"></span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Heart Rate</p>
            <p className="font-data-lg text-lg text-white">
              {heartRate} <span className="text-xs text-on-surface-variant">BPM</span>
            </p>
          </div>
        </div>
        <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">footprint</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Steps</p>
            <p className="font-data-lg text-lg text-white">{steps}</p>
          </div>
        </div>
        <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Energy</p>
            <p className="font-data-lg text-lg text-white">
              {energy} <span className="text-xs text-on-surface-variant">KCAL</span>
            </p>
          </div>
        </div>
        <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-tertiary text-xl">water_drop</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hydration</p>
            <p className="font-data-lg text-lg text-white">
              {hydration} <span className="text-xs text-on-surface-variant">L</span>
            </p>
          </div>
        </div>
      </section>

      {/* Goal Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-label-caps text-on-surface-variant font-bold">Core Objectives</h4>
          <span className="text-[10px] font-bold text-primary underline cursor-pointer hover:text-white transition-colors">EDIT GOALS</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container p-6 rounded-[24px] border border-white/5 space-y-4 flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-low" cx="40" cy="40" fill="none" r="34" stroke="currentColor" strokeWidth="4"></circle>
                <circle 
                  className="text-primary chart-path" 
                  cx="40" 
                  cy="40" 
                  fill="none" 
                  r="34" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  style={{ strokeDashoffset: muscleOffset }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-on-surface">72%</span>
              </div>
            </div>
            <div className="text-center text-on-surface">
              <p className="font-bold text-sm">Build Muscle</p>
              <p className="text-[10px] text-green-400 font-bold uppercase mt-1">ON TRACK</p>
              <p className="text-[9px] text-on-surface-variant mt-2">Expected: 12 Aug</p>
            </div>
          </div>

          <div className="bg-surface-container p-6 rounded-[24px] border border-white/5 space-y-4 flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-container-low" cx="40" cy="40" fill="none" r="34" stroke="currentColor" strokeWidth="4"></circle>
                <circle 
                  className="text-secondary chart-path" 
                  cx="40" 
                  cy="40" 
                  fill="none" 
                  r="34" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  style={{ strokeDashoffset: fatOffset }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-on-surface">48%</span>
              </div>
            </div>
            <div className="text-center text-on-surface">
              <p className="font-bold text-sm">Lose Fat</p>
              <p className="text-[10px] text-primary font-bold uppercase mt-1">ACCELERATING</p>
              <p className="text-[9px] text-on-surface-variant mt-2">Expected: 28 Jul</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
