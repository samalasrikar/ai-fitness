export default function OnboardingHeader({ step }) {
  if (step < 2 || step > 4) return null;

  return (
    <header className="absolute top-0 left-0 w-full z-50 pt-safe bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-md">
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
          <span className="font-display-lg-mobile text-sm font-bold text-primary tracking-tighter">FitAI X</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-data-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
            Step {step - 1} of 3
          </div>
          <div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
}
