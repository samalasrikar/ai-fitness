export default function StepPersonalDetails({
  gender,
  setGender,
  age,
  setAge,
  weight,
  setWeight,
  heightFt,
  setHeightFt,
  heightIn,
  setHeightIn,
  onNext,
  onBack
}) {
  return (
    <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-on-surface">Personal Details</h2>
        <p className="text-xs text-on-surface-variant/80 leading-relaxed">
          Help us calibrate your AI model by providing basic bio-metrics for precision tracking.
        </p>
      </div>

      {/* Bento Input Cards */}
      <div className="space-y-4">
        {/* Biological Gender */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Biological Gender</label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Biological Gender">
            {['Male', 'Female'].map((gen) => {
              const isActive = gender === gen;
              let icon = gen === 'Male' ? 'male' : 'female';
              return (
                <button
                  key={gen}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setGender(gen)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary border-primary text-black font-bold' 
                      : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                  <span className="text-xs">{gen}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age & Weight Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 focus-within:border-primary transition-colors">
            <label htmlFor="age-input" className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider cursor-pointer">
              <span className="material-symbols-outlined text-xs">calendar_today</span>
              Age
            </label>
            <div className="flex items-baseline gap-1 pt-1">
              <input 
                id="age-input"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="28"
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
              />
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">yrs</span>
            </div>
          </div>

          {/* Weight */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 focus-within:border-primary transition-colors">
            <label htmlFor="weight-input" className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider cursor-pointer">
              <span className="material-symbols-outlined text-xs">scale</span>
              Weight
            </label>
            <div className="flex items-baseline gap-1 pt-1">
              <input 
                id="weight-input"
                type="number"
                min="1"
                max="999"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="185"
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
              />
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">lbs</span>
            </div>
          </div>
        </div>

        {/* Height (col-span-2) */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1">
          <label htmlFor="height-ft-input" className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider cursor-pointer">
            <span className="material-symbols-outlined text-xs">straighten</span>
            Height
          </label>
          <div className="flex gap-4 pt-1">
            <div className="flex items-baseline gap-1 flex-1 border-b border-white/10 pb-1 focus-within:border-primary transition-colors">
              <input 
                id="height-ft-input"
                aria-label="Height in feet"
                type="number"
                min="1"
                max="8"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="6"
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
              />
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">ft</span>
            </div>
            <div className="flex items-baseline gap-1 flex-1 border-b border-white/10 pb-1 focus-within:border-primary transition-colors">
              <input 
                id="height-in-input"
                aria-label="Height in inches"
                type="number"
                min="0"
                max="11"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="1"
                className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
              />
              <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">in</span>
            </div>
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
          disabled={!age || !weight || !heightFt}
          className="flex-[2] py-4 rounded-full bg-primary text-black font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
