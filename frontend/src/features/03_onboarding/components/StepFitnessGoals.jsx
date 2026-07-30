import { GOAL_OPTIONS } from '../constants/onboardingConstants';

export default function StepFitnessGoals({
  selectedGoal,
  setSelectedGoal,
  onNext,
  onBack
}) {
  return (
    <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-on-surface">What is your primary focus?</h2>
        <p className="text-xs text-on-surface-variant/80 leading-relaxed">
          FitAI X will calibrate your nutrition and training algorithms based on this selection.
        </p>
      </div>

      {/* Bento Grid of Goals */}
      <div className="grid grid-cols-1 gap-3">
        {GOAL_OPTIONS.map((item) => {
          const isActive = selectedGoal === item.title;
          return (
            <button
              key={item.title}
              onClick={() => setSelectedGoal(item.title)}
              className={`p-4 rounded-xl text-left flex items-center gap-4 border transition-all cursor-pointer active:scale-[0.98] ${
                isActive 
                  ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(245,196,0,0.1)]' 
                  : 'border-white/5 bg-surface-container-low hover:border-primary/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-full border border-white/5 flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                <p className="text-[10px] text-on-surface-variant/70 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-2 border-t border-white/5">
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
