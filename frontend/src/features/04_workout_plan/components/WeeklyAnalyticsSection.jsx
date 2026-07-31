import React from 'react';
import { useWorkoutAnalytics } from '../hooks/useWorkoutAnalytics';

export default function WeeklyAnalyticsSection() {
  const { analytics, isLoading, error } = useWorkoutAnalytics();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-surface-container/40 rounded-3xl border border-white/5 p-6">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">analytics</span>
        <p className="text-xs text-on-surface-variant font-semibold">Aggregating weekly training metrics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-bold text-center">
        ⚠️ Failed to load weekly analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-surface-container/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase">Workout Days</span>
          <p className="text-xl font-black text-white">{analytics.workoutDays} Days</p>
        </div>

        <div className="bg-surface-container/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase">Workout Time</span>
          <p className="text-xl font-black text-primary">{analytics.workoutTimeMin} min</p>
        </div>

        <div className="bg-surface-container/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase">Calories</span>
          <p className="text-xl font-black text-amber-400">{analytics.totalCalories} kcal</p>
        </div>

        <div className="bg-surface-container/90 border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase">Total Volume</span>
          <p className="text-xl font-black text-white">{analytics.totalVolumeKg.toLocaleString()} kg</p>
        </div>

        <div className="bg-surface-container/90 border border-white/10 rounded-2xl p-4 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase">Exercises</span>
          <p className="text-xl font-black text-emerald-400">{analytics.exercisesCompleted} Done</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Frequency Bar Chart */}
        <div className="bg-surface-container/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Workout Frequency</h4>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">This Week</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6">
            {analytics.frequencyData.map((item, idx) => {
              const maxS = Math.max(...analytics.frequencyData.map((d) => d.sessions), 1);
              const heightPct = (item.sessions / maxS) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-surface-bright rounded-xl overflow-hidden h-32 flex items-end p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        item.sessions > 0 ? 'bg-primary' : 'bg-white/5'
                      }`}
                      style={{ height: `${Math.max(heightPct, 10)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workout Duration Chart */}
        <div className="bg-surface-container/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Workout Duration (Mins)</h4>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Weekly</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6">
            {analytics.durationData.map((item, idx) => {
              const maxM = Math.max(...analytics.durationData.map((d) => d.minutes), 60);
              const heightPct = (item.minutes / maxM) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-surface-bright rounded-xl overflow-hidden h-32 flex items-end p-1">
                    <div
                      className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-lg transition-all duration-500"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Muscle Distribution */}
        <div className="bg-surface-container/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Muscle Distribution</h4>
          <div className="space-y-3">
            {analytics.muscleDistribution.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{m.name}</span>
                  <span className="text-primary font-bold">{m.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-surface-bright rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Records */}
        <div className="bg-surface-container/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Personal Records (PRs)</h4>
          <div className="space-y-3">
            {analytics.personalRecords.map((pr, idx) => (
              <div key={idx} className="p-3 bg-surface-bright/60 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-extrabold text-white">{pr.exercise}</h5>
                  <span className="text-[10px] text-on-surface-variant">{pr.date}</span>
                </div>
                <span className="text-sm font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-xl border border-emerald-400/20">
                  {pr.record} 🔥
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
