export default function StepPreferences({
  fitnessLevel,
  setFitnessLevel,
  frequency,
  setFrequency,
  location,
  setLocation,
  duration,
  setDuration,
  onNext,
  onBack
}) {
  return (
    <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-on-surface">Tailor Your Experience</h2>
        <p className="text-xs text-on-surface-variant/80 leading-relaxed">
          Our AI uses these details to calibrate your initial performance baseline.
        </p>
      </div>

      {/* Preferences Cards */}
      <div className="space-y-4">
        {/* 1. Fitness Level */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">1. Current Fitness Level</label>
          <div className="grid grid-cols-3 gap-2 bg-[#0e0e0e] p-1 rounded-lg border border-white/5" role="radiogroup" aria-label="Current Fitness Level">
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
              const isActive = fitnessLevel === lvl;
              let subtitle = '0-1 yrs';
              if (lvl === 'Intermediate') subtitle = '1-3 yrs';
              if (lvl === 'Advanced') subtitle = '3+ yrs';

              return (
                <button
                  key={lvl}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setFitnessLevel(lvl)}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all cursor-pointer ${
                    isActive ? 'bg-primary text-black font-bold' : 'text-on-surface-variant hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold">{lvl}</span>
                  <span className="text-[8px] opacity-75">{subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Weekly Training Frequency */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">2. Weekly Training Frequency</label>
          <div className="flex justify-between px-2" role="radiogroup" aria-label="Weekly Training Frequency">
            {[2, 3, 4, 5, 6].map((num) => {
              const isActive = frequency === num;
              return (
                <button
                  key={num}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setFrequency(num)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'border-2 border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(245,196,0,0.2)]' 
                      : 'border-white/10 text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
          <p className="text-center text-[9px] text-on-surface-variant font-medium">Days per week recommended for your baseline.</p>
        </div>

        {/* 3. Primary Training Location */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">3. Primary Training Location</label>
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Primary Training Location">
            {['Home', 'Gym', 'Both'].map((loc) => {
              const isActive = location === loc;
              let icon = 'home';
              if (loc === 'Gym') icon = 'fitness_center';
              if (loc === 'Both') icon = 'dynamic_form';

              return (
                <button
                  key={loc}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setLocation(loc)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'border-2 border-primary bg-primary/10 text-primary' 
                      : 'border-white/10 text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                  <span className="text-xs font-bold">{loc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Session Duration Slider */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">4. Average Session Duration</label>
            <span className="text-sm font-bold text-primary">
              {duration} <span className="text-[10px] font-bold text-on-surface-variant uppercase">min</span>
            </span>
          </div>
          <div className="px-2">
            <input 
              type="range"
              min="15"
              max="90"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full cursor-pointer accent-primary bg-surface-container-high h-1 rounded-lg"
            />
            <div className="flex justify-between text-[8px] text-on-surface-variant/50 font-bold mt-1">
              <span>15M</span>
              <span>90M</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex gap-3 items-start">
            <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              <span className="text-primary font-bold">AI Insight:</span> {duration}-minute sessions are optimal to prevent cortisol spikes in {fitnessLevel.toLowerCase()} athletes.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-2">
        <button 
          onClick={onBack}
          className="flex-1 py-4 rounded-full border border-white/10 text-on-surface hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-all"
        >
          Back
        </button>
        <button 
          onClick={onNext}
          className="flex-[2] py-4 rounded-full bg-primary text-black font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 cursor-pointer active:scale-95 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
