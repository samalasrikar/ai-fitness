export default function HomeReadinessHero({
  generatedPlan,
  setGeneratedPlan,
  isGeneratingPlan,
  handleGeneratePlan
}) {
  return (
    <section className="relative overflow-hidden p-8 rounded-[32px] bg-gradient-to-br from-surface-container to-surface-container-low border border-primary/10 shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <div className="flex flex-col items-center text-center space-y-6 relative z-10">
        {!generatedPlan ? (
          <>
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center border border-primary/10 shadow-inner">
              <span className={`material-symbols-outlined text-primary text-4xl ${isGeneratingPlan ? 'animate-spin' : ''}`}>
                {isGeneratingPlan ? 'autorenew' : 'calendar_today'}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Workout Status</p>
              <h2 className="text-display-lg-mobile font-bold text-on-surface">
                {isGeneratingPlan ? 'Analyzing Stats...' : 'No Active Plan'}
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
                {isGeneratingPlan 
                  ? 'Synthesizing metabolic rate, sleep patterns, and progressive overload history...' 
                  : "Your personalized training journey hasn't started yet. Let's build your first routine."}
              </p>
            </div>
            <button 
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full py-4 rounded-xl cta-gradient text-black font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingPlan ? 'Generating...' : 'Generate Your First AI Plan'}
            </button>
          </>
        ) : (
          <div className="w-full space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active Plan Locked</p>
                <h3 className="text-xl font-bold text-on-surface">{generatedPlan.title}</h3>
              </div>
              <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-bold">
                {generatedPlan.duration}
              </span>
            </div>
            <div className="space-y-3">
              {generatedPlan.exercises.map((ex, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 text-xs">
                  <div>
                    <span className="text-primary font-bold mr-2">{idx + 1}</span>
                    <span className="text-on-surface font-medium">{ex.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{ex.sets}</p>
                    <p className="text-[9px] text-primary uppercase font-bold">{ex.rpe}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setGeneratedPlan(null)}
              className="w-full py-3 mt-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface-variant hover:text-white font-bold text-xs tracking-widest uppercase transition-all active:scale-95 cursor-pointer"
            >
              Reset & Recalculate
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
