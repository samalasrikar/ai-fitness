import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi } from '../../../services/api/workout.api';
import ManualWorkoutCreator from '../../04_workout_plan/components/ManualWorkoutCreator';
import RestTimerModal from '../../04_workout_plan/components/RestTimerModal';
import DailyWorkoutPlanner from '../../04_workout_plan/components/DailyWorkoutPlanner';

export default function WorkoutTab({ generatedPlan, isGeneratingPlan, handleGeneratePlan }) {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('Monday');
  const [plan, setPlan] = useState(generatedPlan ? generatedPlan : null);
  const [isLoading, setIsLoading] = useState(!generatedPlan);
  const [completedExercises, setCompletedExercises] = useState({});
  const [error, setError] = useState(null);

  // Modals state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Session timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    if (generatedPlan) {
      setPlan(generatedPlan);
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    setIsLoading(true);
    workoutApi.getActivePlan()
      .then((res) => {
        if (isMounted && res.data) {
          setPlan(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message ? err.response.data.message : null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [generatedPlan]);

  // Session elapsed timer interval
  useEffect(() => {
    let interval = null;
    if (isSessionActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const toggleExercise = (idx) => {
    const nextState = !completedExercises[idx];
    setCompletedExercises((prev) => ({ ...prev, [idx]: nextState }));
    if (nextState) {
      if (!isSessionActive) setIsSessionActive(true);
      // Trigger Rest Timer automatically on exercise set completion
      setTimerSeconds(60);
      setIsRestTimerOpen(true);
    }
  };

  const handleSaveManualPlan = async (manualData) => {
    try {
      setIsLoading(true);
      const res = await workoutApi.createManualPlan(manualData);
      const newPlan = res.data?.data ? res.data.data : res.data;
      setPlan(newPlan);
      setCompletedExercises({});
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message ? err.response.data.message : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteWorkoutSession = async () => {
    if (!plan) return;
    try {
      setIsLoading(true);
      const volume = (plan.exercises ? plan.exercises : []).reduce(
        (acc, ex) => acc + (Number(ex.sets ? ex.sets : 3) * 10 * 80),
        0
      );
      await workoutApi.logSession({
        title: `${plan.title} Session`,
        durationSeconds: Math.max(elapsedSeconds, 1800),
        totalVolumeKg: volume,
        caloriesBurned: Math.round(Math.max(elapsedSeconds, 1800) / 60 * 7.5),
        sets: (plan.exercises ? plan.exercises : []).map((ex, i) => ({
          exerciseName: ex.name,
          setNumber: 1,
          weightKg: ex.weightKg ? Number(ex.weightKg) : 80,
          reps: 10,
          rpe: 8.5,
          completed: Boolean(completedExercises[i]),
        })),
      });
      setIsSessionActive(false);
      alert('Workout session logged successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message ? err.response.data.message : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatElapsed = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const totalExercises = plan?.exercises?.length ? plan.exercises.length : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
        <p className="text-xs text-on-surface-variant font-medium">Loading training protocol...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-6 space-y-6 pt-6 pb-24 animate-in fade-in duration-300">
      {/* Header & Mode Switcher Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-label-caps text-primary uppercase tracking-[0.2em] font-bold">Daily Workout</span>
          <h2 className="text-lg font-extrabold text-on-surface">Training Planner</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-1.5 bg-surface-container border border-primary/30 text-primary text-xs font-bold rounded-xl hover:bg-primary/10 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Manual
          </button>
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="px-3 py-1.5 bg-primary text-black text-xs font-bold rounded-xl hover:brightness-105 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            AI Plan
          </button>
        </div>
      </div>

      {/* Daily Workout Planner Day Selector (Monday-Sunday) */}
      <DailyWorkoutPlanner activeDay={activeDay} onSelectDay={setActiveDay} />

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 text-center font-bold">
          ⚠️ {error}
        </div>
      )}

      {!plan ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-surface-container rounded-[28px] border border-white/5 p-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
          </div>
          <h3 className="text-lg font-bold text-white">No Active Workout Plan</h3>
          <p className="text-xs text-on-surface-variant max-w-[260px]">
            Choose an option above: create your custom workout manually or generate a personalized AI routine.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-5 py-2.5 bg-surface-bright border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:border-primary/40"
            >
              + Manual Workout
            </button>
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="px-5 py-2.5 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(245,196,0,0.3)]"
            >
              ⚡ Generate AI Plan
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Active Plan Header */}
          <section className="bg-surface-container rounded-[28px] p-6 border border-primary/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">Active Routine</span>
                <h3 className="text-xl font-extrabold text-on-surface">{plan.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-bold">
                  {plan.duration}
                </span>
                <button
                  onClick={() => setIsRestTimerOpen(true)}
                  className="p-2 bg-surface-bright border border-primary/30 text-primary rounded-full hover:bg-primary/10 transition-colors"
                  title="Open Rest Timer"
                >
                  <span className="material-symbols-outlined text-base">timer</span>
                </button>
              </div>
            </div>

            {/* Session Timer & Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-medium">Session Time: <strong className="text-primary font-[JetBrains_Mono,monospace]">{formatElapsed(elapsedSeconds)}</strong></span>
                <span className="text-primary font-bold">{completedCount}/{totalExercises} Completed</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0}%` }}
                />
              </div>
            </div>
          </section>

          {/* Exercise List with Rest Timer Actions */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Target Exercises ({totalExercises})
              </h3>
              <button
                onClick={() => setIsRestTimerOpen(true)}
                className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 hover:bg-primary/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">timer</span>
                REST TIMER
              </button>
            </div>

            <div className="space-y-3">
              {(plan.exercises ? plan.exercises : []).map((ex, idx) => {
                const done = Boolean(completedExercises[idx]);
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      done
                        ? 'bg-primary/10 border-primary/40'
                        : 'bg-surface-container border-white/5 hover:border-white/10'
                    }`}
                  >
                    <button
                      onClick={() => toggleExercise(idx)}
                      className="flex-1 flex items-center gap-4 text-left cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                        done ? 'bg-primary border-primary' : 'border-white/20'
                      }`}>
                        {done ? (
                          <span className="material-symbols-outlined text-black text-sm font-black">check</span>
                        ) : (
                          <span className="text-xs font-bold text-on-surface-variant">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                          {ex.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-medium">
                          {ex.sets} Sets • {ex.reps} Reps {ex.weightKg ? `• ${ex.weightKg} kg` : ''}
                        </p>
                        {ex.note && <p className="text-[9px] text-[#d1c5ab]/60 italic mt-0.5">{ex.note}</p>}
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                        RPE {ex.rpe ? ex.rpe : 8}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Log Completed Session CTA */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleCompleteWorkoutSession}
              disabled={completedCount === 0}
              className="w-full py-3.5 bg-primary text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(245,196,0,0.3)] disabled:opacity-40 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              Complete & Log Session
            </button>

            <button
              onClick={() => {
                setPlan(null);
                setCompletedExercises({});
                setIsSessionActive(false);
                setElapsedSeconds(0);
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface-variant hover:text-white font-bold text-xs tracking-widest uppercase transition-all cursor-pointer"
            >
              Reset Current Routine
            </button>
          </div>
        </>
      )}

      {/* Manual Workout Creator Modal */}
      <ManualWorkoutCreator
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleSaveManualPlan}
      />

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        defaultSeconds={timerSeconds}
        onTimerComplete={() => alert('Rest period complete! Get ready for your next set. 💪')}
      />
    </div>
  );
}
