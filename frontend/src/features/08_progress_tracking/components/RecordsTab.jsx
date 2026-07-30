import { useState, useEffect } from 'react';
import { progressApi } from '../../shared/services/progress.api';

export default function RecordsTab() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    progressApi.getDashboardMetrics()
      .then(res => {
        if (isMounted && res.data) { setMetrics(res.data); setError(null); }
      })
      .catch(() => {
        if (isMounted) setError('Could not load analytics. Please try again later.');
      })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in duration-300">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">autorenew</span>
        <p className="text-xs text-on-surface-variant font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
        <span className="material-symbols-outlined text-error text-4xl">error_outline</span>
        <p className="text-sm font-bold text-error">Failed to load records</p>
        <p className="text-xs text-on-surface-variant">{error}</p>
      </div>
    );
  }

  const hasData = metrics && (metrics.streakDays > 0 || metrics.totalSessions > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
        </div>
        <h2 className="text-xl font-bold">Analytics & Records</h2>
        <p className="text-xs text-on-surface-variant max-w-[240px]">
          Bio-metric analytics and progressive overload trends will appear here once you complete your first training session.
        </p>
      </div>
    );
  }

  const stats = [
    { label: 'Day Streak', value: metrics.streakDays ?? 0, unit: 'days', icon: 'local_fire_department', color: 'text-primary' },
    { label: 'Total Sessions', value: metrics.totalSessions ?? 0, unit: 'sessions', icon: 'fitness_center', color: 'text-primary' },
    { label: 'Calories Burned', value: metrics.totalCaloriesBurned ?? 0, unit: 'kcal', icon: 'bolt', color: 'text-yellow-400' },
    { label: 'Active Days', value: metrics.activeDays ?? 0, unit: 'this week', icon: 'calendar_today', color: 'text-green-400' }
  ];

  return (
    <div className="flex flex-col w-full px-6 space-y-6 pt-6 animate-in fade-in duration-300">
      <section>
        <h2 className="text-display-lg-mobile font-bold text-on-surface mb-1">Analytics</h2>
        <p className="text-xs text-on-surface-variant">Your performance overview</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container rounded-2xl p-5 border border-white/5 flex flex-col gap-2">
            <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</span>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <p className="text-[9px] text-on-surface-variant/60">{stat.unit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Personal Bests */}
      <section className="bg-surface-container rounded-3xl p-6 border border-white/5 space-y-4">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold">Personal Bests</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-sm font-medium text-on-surface">Best Streak</span>
            <span className="text-sm font-bold text-primary">{metrics.streakDays ?? 0} days</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-sm font-medium text-on-surface">Most Sessions/Week</span>
            <span className="text-sm font-bold text-primary">{metrics.bestWeeklySessions ?? 0}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-on-surface">Goal Adherence</span>
            <span className="text-sm font-bold text-primary">{metrics.goalAdherence ?? 0}%</span>
          </div>
        </div>
        <p className="text-[9px] text-on-surface-variant/50 text-center pt-2">
          Full biometric analytics unlock after 7+ training sessions
        </p>
      </section>
    </div>
  );
}
