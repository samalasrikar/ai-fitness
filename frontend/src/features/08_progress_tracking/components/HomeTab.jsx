import HomeReadinessHero from './HomeReadinessHero';
import HomeMetricsGrid from './HomeMetricsGrid';

export default function HomeTab({
  firstName,
  generatedPlan,
  setGeneratedPlan,
  isGeneratingPlan,
  handleGeneratePlan,
  heartRate,
  steps,
  energy,
  hydration,
  muscleOffset,
  fatOffset,
  hasJoinedChallenge,
  setHasJoinedChallenge,
  streakDays
}) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const streak = streakDays ?? 0;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDow = (now.getDay() + 6) % 7; // Mon=0

  return (
    <div className="flex flex-col w-full px-6 space-y-6 pt-6 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <section className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-display-lg-mobile font-bold tracking-tight text-on-surface">
            Welcome Back, <span className="text-primary">{firstName || 'Athlete'} 👋</span>
          </h1>
          <p className="text-on-surface-variant font-medium">{timeStr} • {dateStr}</p>
        </div>
        <div className="bg-surface-container px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Sync</span>
        </div>
      </section>

      {/* AI Readiness Hero / Active Workout Plan */}
      <HomeReadinessHero
        generatedPlan={generatedPlan}
        setGeneratedPlan={setGeneratedPlan}
        isGeneratingPlan={isGeneratingPlan}
        handleGeneratePlan={handleGeneratePlan}
      />

      {/* Live Statistics & Objectives Grid */}
      <HomeMetricsGrid
        heartRate={heartRate}
        steps={steps}
        energy={energy}
        hydration={hydration}
        muscleOffset={muscleOffset}
        fatOffset={fatOffset}
      />

      {/* Weekly Streak */}
      <section className="bg-surface-container rounded-3xl p-6 space-y-6 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flicker-flame flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
            </div>
            <div>
              <p className="font-data-lg text-2xl text-primary">{streak > 0 ? `${streak} Day${streak !== 1 ? 's' : ''}` : 'No streak yet'}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Streak</p>
            </div>
          </div>
          {streak > 0 && (
            <div className="text-right">
              <p className="text-xs font-bold text-primary">+{streak * 15} XP</p>
              <p className="text-[10px] text-on-surface-variant italic">Keep it going!</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-1">
          {weekDays.map((day, idx) => {
            const completed = streak >= (todayDow - idx + 7) % 7 + 1 && idx <= todayDow;
            const isToday = idx === todayDow;
            return (
              <div key={idx} className={`flex flex-col items-center gap-2 ${idx > todayDow ? 'opacity-30' : ''}`}>
                <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-on-surface-variant'}`}>{day}</span>
                {isToday ? (
                  <div className="w-9 h-9 rounded-full border-2 border-primary ring-4 ring-primary/10 pulse-ring relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                ) : completed ? (
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(245,196,0,0.4)]">
                    <span className="material-symbols-outlined text-black text-sm font-bold">check</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full border border-white/10"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-4">
        <h4 className="text-label-caps text-on-surface-variant px-1 font-bold">Trophies & Milestones</h4>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          <div className={`flex-none w-32 aspect-square rounded-[32px] bg-surface-container border flex flex-col items-center justify-center gap-2 p-4 text-center ${streak >= 14 ? 'border-primary/20' : 'border-white/5 grayscale opacity-50'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${streak >= 14 ? 'bg-primary/10 ai-glow' : 'bg-surface-container-low'}`}>
              <span className={`material-symbols-outlined text-3xl ${streak >= 14 ? 'text-primary' : 'text-on-surface-variant'}`}>military_tech</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-tighter leading-tight text-on-surface-variant">14 Day System Lock</p>
          </div>
          <div className={`flex-none w-32 aspect-square rounded-[32px] bg-surface-container border border-white/5 flex flex-col items-center justify-center gap-2 p-4 text-center grayscale opacity-50`}>
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-3xl">cycle</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-tighter leading-tight text-on-surface-variant">100 Session Prime</p>
          </div>
          <div className={`flex-none w-32 aspect-square rounded-[32px] bg-surface-container border border-white/5 flex flex-col items-center justify-center gap-2 p-4 text-center`}>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-3xl">rocket_launch</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-tighter leading-tight text-on-surface-variant">Hyper Focus Mode</p>
          </div>
        </div>
      </section>

      {/* Community Challenges */}
      <section className="bg-surface-container rounded-[32px] p-8 border border-white/5 overflow-hidden relative mb-6">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-[80px] text-primary">groups</span>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <h4 className="text-label-caps text-on-surface font-bold">Global Challenge</h4>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-primary">May Sprint: 50k Steps</h3>
            <p className="text-xs text-on-surface-variant">
              {hasJoinedChallenge ? 'You are competing! Join thousands of athletes active.' : 'Join thousands of other athletes today.'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <img
                alt="avatar"
                className="w-6 h-6 rounded-full border border-background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnh4DqrxFwUMZsd71CGOL7JOozK_oaDbMcZgpyD6zLI_2U4EGZQDIlMtuZwGZYgrsaWXDSj8hC6-vD8JiGdiPpPo2oLCmNXPWtPLQNYMCcCQoXFs3QDFD9xVIg_gfT7zIOtmNbKaqbEBiP5DF4e9EK3u3kqbAQYNVNexcXMCI9o29bkhvJxyG8nKXyyoJldzUDrUFGGcWIhDrQyDrqNAcv-nFNwXJstzzSEGkuqVCdUrn7ZqaEOH1v"
              />
              <div className="w-6 h-6 rounded-full border border-background bg-surface-container-low flex items-center justify-center text-[8px] font-bold text-primary">
                +10k
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-primary">500 XP REWARD</span>
              <button
                onClick={() => setHasJoinedChallenge(prev => !prev)}
                className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  hasJoinedChallenge ? 'bg-green-600 text-white' : 'bg-primary text-black hover:brightness-105'
                }`}
              >
                {hasJoinedChallenge ? 'Joined ✓' : 'Join Now'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
