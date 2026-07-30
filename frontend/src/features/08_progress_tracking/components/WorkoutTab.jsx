import { useState, useEffect } from 'react';
import { workoutApi } from '../../shared/services/workout.api';

export default function WorkoutTab({ generatedPlan, isGeneratingPlan, handleGeneratePlan, setActiveTab }) {
  const [plan, setPlan] = useState(generatedPlan || null);
  const [isLoading, setIsLoading] = useState(!generatedPlan);
  const [completedExercises, setCompletedExercises] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (generatedPlan) { setPlan(generatedPlan); setIsLoading(false); return; }
    let isMounted = true;
    setIsLoading(true);
    workoutApi.getActivePlan()
      .then(res => { if (isMounted && res.data) { setPlan(res.data); setError(null); } })
      .catch(() => { if (isMounted) setError(null); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [generatedPlan]);

  const toggleExercise = (idx) => {
    setCompletedExercises(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalExercises = plan?.exercises?.length ?? 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
        <p className="text-xs text-on-surface-variant font-medium">Loading workout plan...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
        </div>
        <h2 className="text-xl font-bold">Training Program</h2>
        <p className="text-xs text-on-surface-variant max-w-[240px]">
          No active plan found. Generate a personalized AI routine to start tracking your training.
        </p>
        <button
          onClick={() => { handleGeneratePlan(); setActiveTab('home'); }}
          disabled={isGeneratingPlan}
          className="mt-4 px-8 py-3 bg-primary text-black rounded-full font-bold text-xs uppercase tracking-widest disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
        >
          {isGeneratingPlan ? 'Generating...' : 'Generate AI Plan'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 space-y-6 pt-6 animate-in fade-in duration-300">
      {/* Plan Header */}
      <section className="bg-surface-container rounded-[28px] p-6 border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active Plan</p>
            <h2 className="text-xl font-bold text-on-surface">{plan.title}</h2>
          </div>
          <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold">
            {plan.duration}
          </span>
        </div>

        {/* Progress Bar */}
        {totalExercises > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span>Session Progress</span>
              <span className="text-primary">{completedCount}/{totalExercises}</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Exercise List */}
      <section className="space-y-3">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">
          Today's Exercises
        </h3>
        <div className="space-y-3">
          {(plan.exercises || []).map((ex, idx) => {
            const done = Boolean(completedExercises[idx]);
            return (
              <button
                key={idx}
                onClick={() => toggleExercise(idx)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] text-left ${
                  done
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-surface-container border-white/5 hover:border-white/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                  done ? 'bg-primary border-primary' : 'border-white/20'
                }`}>
                  {done
                    ? <span className="material-symbols-outlined text-black text-sm font-black">check</span>
                    : <span className="text-xs font-bold text-on-surface-variant">{idx + 1}</span>
                  }
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                    {ex.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-medium">{ex.sets}</p>
                </div>
                <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded-full">
                  {ex.rpe}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Session Complete CTA */}
      {completedCount === totalExercises && totalExercises > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center space-y-2">
          <span className="material-symbols-outlined text-primary text-3xl">emoji_events</span>
          <p className="text-sm font-bold text-primary">Session Complete! 🔥</p>
          <p className="text-xs text-on-surface-variant">Great work. Your progress has been recorded.</p>
        </div>
      )}

      {/* Reset Plan */}
      <button
        onClick={() => { setPlan(null); setCompletedExercises({}); }}
        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface-variant hover:text-white font-bold text-xs tracking-widest uppercase transition-all active:scale-95 cursor-pointer mb-4"
      >
        Reset & Recalculate
      </button>
    </div>
  );
}
