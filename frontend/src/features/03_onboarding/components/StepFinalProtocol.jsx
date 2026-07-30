export default function StepFinalProtocol({
  selectedGoal,
  fitnessLevel,
  frequency,
  weight,
  heightCm,
  location,
  duration,
  isSubmitting,
  submitError,
  onFinish
}) {
  return (
    <div className="w-full flex flex-col items-center text-center space-y-6 pt-4 pb-8 animate-in fade-in duration-300 max-w-[430px] mx-auto">
      {/* Check Circle Hero Icon */}
      <div className="relative my-2">
        <div className="w-20 h-20 bg-[#f5c400] rounded-full flex items-center justify-center text-black shadow-[0_0_35px_rgba(245,196,0,0.35)] relative z-10">
          <span className="material-symbols-outlined text-4xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <div className="absolute -inset-2 bg-[#f5c400]/20 rounded-full blur-md animate-pulse"></div>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
          Welcome to FitAI X!
        </h1>
        <p className="text-xs text-[#B0AA9A] max-w-xs mx-auto leading-relaxed font-medium">
          Your personalized fitness profile has been created successfully. We've generated your fitness plan based on your goals and preferences.
        </p>
      </div>

      {/* Confirmation Status Badges */}
      <div className="w-full bg-[#161616] p-4 rounded-2xl border border-white/5 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-[#f5c400] text-sm font-bold">check_circle</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Profile Created</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-white/10 px-1">
          <span className="material-symbols-outlined text-[#f5c400] text-sm font-bold">check_circle</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Plan Generated</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="material-symbols-outlined text-[#f5c400] text-sm font-bold">check_circle</span>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Dashboard Ready</span>
        </div>
      </div>

      {/* Personalized Onboarding Summary Card */}
      <div className="w-full bg-[#161616] p-5 rounded-2xl border border-white/10 space-y-3.5 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">tune</span>
            Your Fitness Profile Summary
          </span>
          <span className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded-full">
            AI Configured
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#101010] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-[#B0AA9A] font-bold uppercase tracking-wider block mb-0.5">Primary Goal</span>
            <span className="text-white font-bold">{selectedGoal || 'Lose Weight'}</span>
          </div>

          <div className="bg-[#101010] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-[#B0AA9A] font-bold uppercase tracking-wider block mb-0.5">Experience</span>
            <span className="text-white font-bold">{fitnessLevel || 'Beginner'}</span>
          </div>

          <div className="bg-[#101010] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-[#B0AA9A] font-bold uppercase tracking-wider block mb-0.5">Workout Days</span>
            <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">{frequency || 3} days / wk</span>
          </div>

          <div className="bg-[#101010] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-[#B0AA9A] font-bold uppercase tracking-wider block mb-0.5">Current Weight</span>
            <span className="text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">{weight || 74} kg</span>
          </div>

          <div className="bg-[#101010] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-[#B0AA9A] font-bold uppercase tracking-wider block mb-0.5">Height</span>
            <span className="text-white font-bold font-[JetBrains_Mono,monospace]">{heightCm || 178} cm</span>
          </div>

          <div className="bg-[#101010] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] text-[#B0AA9A] font-bold uppercase tracking-wider block mb-0.5">Duration & Venue</span>
            <span className="text-white font-bold">{duration || 45}m • {location || 'Gym'}</span>
          </div>
        </div>
      </div>

      {/* Error Message Banner if Submit Failed */}
      {submitError && (
        <div className="w-full bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-center">
          <p className="text-xs text-red-400 font-medium">{submitError}</p>
        </div>
      )}

      {/* Primary CTA Button */}
      <button 
        onClick={onFinish}
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl bg-[#f5c400] text-black font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-[#f5c400]/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
            Setting up your fitness profile...
          </>
        ) : (
          <>
            Go to Dashboard
            <span className="material-symbols-outlined text-black text-sm font-bold">arrow_forward</span>
          </>
        )}
      </button>
    </div>
  );
}
