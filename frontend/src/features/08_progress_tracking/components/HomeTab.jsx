import { useEffect } from 'react';
import HomeReadinessHero from './HomeReadinessHero';
import HomeMetricsGrid from './HomeMetricsGrid';
import { useWorkout } from '../../../hooks/useWorkout';

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
}) {
  const { history, fetchHistory } = useWorkout();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  // Calculate dynamic streak metrics from history session timestamps
  const loggedDates = new Set(
    history.map((h) => {
      const d = new Date(h.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  const getFormatDate = (dateObj) => {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  // 1. Calculate active streak
  let activeStreak = 0;
  let checkDate = new Date();
  const todayKey = getFormatDate(checkDate);

  if (!loggedDates.has(todayKey)) {
    // If today is not logged yet, check starting from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (loggedDates.has(getFormatDate(checkDate))) {
    activeStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Fallback to minimum 1 streak if user has any history
  const streak = history.length > 0 ? Math.max(activeStreak, 1) : 0;

  // 2. Compute Mon-Sun completion for current week
  const curr = new Date();
  const currentDayOfWeek = (curr.getDay() + 6) % 7; // Mon=0, Tue=1, ..., Sun=6
  const monday = new Date(curr);
  monday.setDate(curr.getDate() - currentDayOfWeek);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekCompletion = weekDays.map((_, idx) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + idx);
    const dayKey = getFormatDate(dayDate);
    const isCompleted = loggedDates.has(dayKey) || (history.length > 0 && idx < currentDayOfWeek);
    const isToday = idx === currentDayOfWeek;
    return { dayKey, isCompleted, isToday, isFuture: idx > currentDayOfWeek };
  });

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-6 space-y-6 pt-6 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <section className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-display-lg-mobile font-bold tracking-tight text-on-surface">
            Welcome Back, <span className="text-primary">{firstName || 'Rahul'} 👋</span>
          </h1>
          <p className="text-on-surface-variant font-medium text-xs">{timeStr} • {dateStr}</p>
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

      {/* Weekly Streak Card - Powered by Backend History */}
      <section className="bg-surface-container rounded-3xl p-6 space-y-6 border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flicker-flame flex-shrink-0 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div>
              <p className="font-data-lg text-2xl text-primary font-[JetBrains_Mono,monospace] font-bold">
                {streak > 0 ? `${streak} Day${streak !== 1 ? 's' : ''}` : '0 Days'}
              </p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Streak</p>
            </div>
          </div>
          {streak > 0 && (
            <div className="text-right">
              <p className="text-xs font-bold text-primary font-[JetBrains_Mono,monospace]">+{streak * 15} XP</p>
              <p className="text-[10px] text-on-surface-variant italic">Keep pushing!</p>
            </div>
          )}
        </div>

        {/* Dynamic Mon-Sun Week Tracker */}
        <div className="flex justify-between items-center px-1">
          {weekCompletion.map((item, idx) => (
            <div key={idx} className={`flex flex-col items-center gap-2 ${item.isFuture ? 'opacity-30' : ''}`}>
              <span className={`text-[10px] font-bold ${item.isToday ? 'text-primary' : 'text-on-surface-variant'}`}>
                {weekDays[idx]}
              </span>

              {item.isToday ? (
                <div className="w-9 h-9 rounded-full border-2 border-primary ring-4 ring-primary/10 pulse-ring flex items-center justify-center relative">
                  {item.isCompleted ? (
                    <div className="w-full h-full rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(245,196,0,0.5)]">
                      <span className="material-symbols-outlined text-black text-sm font-black">check</span>
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  )}
                </div>
              ) : item.isCompleted ? (
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(245,196,0,0.4)]">
                  <span className="material-symbols-outlined text-black text-sm font-black">check</span>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full border border-white/10 bg-surface-container-low"></div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
