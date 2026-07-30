export default function StepOverview({ onNext }) {
  return (
    <div className="w-full flex flex-col space-y-6 pt-4 animate-in fade-in duration-300">
      <div className="text-center space-y-1">
        <h1 className="text-display-lg-mobile font-bold tracking-tight text-primary leading-tight">FitAI X</h1>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
          Experience the evolution of training. Your transformation is governed by precision and intelligence.
        </p>
      </div>

      {/* Vertical steps progress mapping */}
      <div className="bg-surface-container p-5 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-8 bottom-8 left-[23px] w-[2px] bg-gradient-to-b from-primary via-primary/30 to-transparent"></div>
        
        <div className="space-y-6">
          {/* Phase 1 */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center relative z-10 flex-shrink-0 animate-pulse-gold">
              <span className="material-symbols-outlined text-black text-xs font-bold">person</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Phase 01</p>
              <h4 className="text-xs font-bold text-on-surface">Personal Details</h4>
              <p className="text-[9px] text-on-surface-variant mt-0.5">Biometric baseline parameters.</p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-xs">fitness_center</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Phase 02</p>
              <h4 className="text-xs font-bold text-on-surface-variant">Preferences</h4>
              <p className="text-[9px] text-on-surface-variant/50 mt-0.5">Sync environment and frequency.</p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-xs">target</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Phase 03</p>
              <h4 className="text-xs font-bold text-on-surface-variant">Fitness Goals</h4>
              <p className="text-[9px] text-on-surface-variant/50 mt-0.5">Define core performance arc targets.</p>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-xs">psychology</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Phase 04</p>
              <h4 className="text-xs font-bold text-on-surface-variant">AI Analysis</h4>
              <p className="text-[9px] text-on-surface-variant/50 mt-0.5">Generate adaptive neural program.</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI info card */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
          <h4 className="text-xs font-bold text-on-surface">FitAI Core Engine</h4>
        </div>
        <p className="text-[10px] text-on-surface-variant leading-relaxed">
          Our proprietary neural net analyzes over 5,000 data parameters to construct a training regime that adapts to your physiology in real-time.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {['Biometric Sync', 'Predictive Recovery', 'Volume Tuning'].map(chip => (
            <span key={chip} className="px-2 py-0.5 bg-black border border-white/5 rounded-full text-[8px] font-bold text-primary">{chip}</span>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onNext}
        className="w-full py-4 rounded-full bg-primary text-black font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        Start Your Transformation
        <span className="material-symbols-outlined text-black text-sm font-bold">arrow_forward</span>
      </button>
    </div>
  );
}
