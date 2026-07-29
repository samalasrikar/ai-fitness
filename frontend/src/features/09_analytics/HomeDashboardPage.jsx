import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/TopAppBar';
import { BottomNavBar } from '../../components/BottomNavBar';
import { apiClient } from '../../lib/axios';
import { Heart, Flame, Footprints, Play } from 'lucide-react';

export function HomeDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiClient.get('/dashboard/stats');
        setData(res.data);
      } catch (err) {
        setData({
          user: { name: 'John Doe', avatarUrl: null, eliteRankScore: 750 },
          biometrics: { recoveryScore: 88, stateStatus: 'Prime State', hrv: 62, restingHeartRate: 62, caloriesBurned: 1240, stepsCount: '8.4k' },
          activeWorkout: { title: 'Hypertrophy: Pull A', durationMinutes: 65, targetMuscles: 'Lats, Biceps, Rear Delts' },
          nutrition: { targetCalories: 2800, consumedCalories: 1950, proteinGrams: 142, targetProtein: 180, carbsGrams: 210, targetCarbs: 300, fatsGrams: 55, targetFats: 75 },
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const bio = data?.biometrics || {};
  const workout = data?.activeWorkout;
  const nut = data?.nutrition || {};

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen pb-32">
      <TopAppBar avatarUrl={data?.user?.avatarUrl} />

      <main className="pt-xxxl px-container-margin space-y-xl max-w-4xl mx-auto">
        {/* Recovery Ring */}
        <section className="glass-card rounded-[24px] p-lg mt-md flex flex-col items-center relative overflow-hidden">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-white/5" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle
                className="text-primary progress-ring-circle"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="30.14"
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-data-lg text-[48px] text-primary">{bio.recoveryScore || 88}</span>
              <span className="font-label-caps text-on-surface-variant/70">RECOVERY</span>
            </div>
          </div>
          <div className="mt-lg text-center">
            <h3 className="font-headline-md text-headline-md text-on-surface">{bio.stateStatus || 'Prime State'}</h3>
            <p className="font-body-md text-on-surface-variant/80 mt-xs">Your CNS is fully recharged. High intensity recommended.</p>
          </div>
        </section>

        {/* Horizontal Stats Scroll */}
        <section className="flex gap-md overflow-x-auto pb-sm -mx-container-margin px-container-margin">
          <div className="glass-card min-w-[140px] p-md rounded-xl space-y-sm">
            <div className="flex items-center gap-xs text-primary/70">
              <Heart className="w-4 h-4" />
              <span className="font-label-caps">HEART RATE</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-lg text-data-lg text-on-surface">{bio.restingHeartRate || 62}</span>
              <span className="font-data-sm text-data-sm text-on-surface-variant">BPM</span>
            </div>
          </div>
          <div className="glass-card min-w-[140px] p-md rounded-xl space-y-sm">
            <div className="flex items-center gap-xs text-primary/70">
              <Flame className="w-4 h-4" />
              <span className="font-label-caps">CALORIES</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-lg text-data-lg text-on-surface">{bio.caloriesBurned || 1240}</span>
              <span className="font-data-sm text-data-sm text-on-surface-variant">KCAL</span>
            </div>
          </div>
          <div className="glass-card min-w-[140px] p-md rounded-xl space-y-sm">
            <div className="flex items-center gap-xs text-primary/70">
              <Footprints className="w-4 h-4" />
              <span className="font-label-caps">STEPS</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-lg text-data-lg text-on-surface">{bio.stepsCount || '8.4k'}</span>
              <span className="font-data-sm text-data-sm text-on-surface-variant">STEPS</span>
            </div>
          </div>
        </section>

        {/* Today's AI Workout Card */}
        <section className="relative group">
          <div className="glass-card rounded-[24px] p-lg relative border-primary/20">
            <div className="flex justify-between items-start mb-lg">
              <div>
                <span className="font-label-caps text-primary mb-xs block">SUGGESTED SESSION</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">{workout?.title || 'Hypertrophy: Pull A'}</h2>
              </div>
              <div className="bg-primary/10 px-sm py-xs rounded-lg border border-primary/20">
                <span className="font-data-sm text-primary">{workout?.durationMinutes || 65} MIN</span>
              </div>
            </div>
            <div className="flex items-center gap-lg mb-xl">
              <div className="text-on-surface-variant/70 font-body-md">
                Targets: {workout?.targetMuscles || 'Lats, Biceps, Rear Delts'}
              </div>
            </div>
            <button
              onClick={() => navigate('/workout/session')}
              className="w-full bg-primary py-md rounded-full text-on-primary font-bold gold-glow flex items-center justify-center gap-sm active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Workout
            </button>
          </div>
        </section>

        {/* Nutrition Summary */}
        <section className="glass-card rounded-[24px] p-lg space-y-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-on-surface">Nutrition</h3>
            <span className="font-data-sm text-primary">Target: {nut.targetCalories || 2800} kcal</span>
          </div>
          <div className="space-y-md">
            <div className="space-y-xs">
              <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                <span>PROTEIN</span>
                <span>{nut.proteinGrams || 142}g / {nut.targetProtein || 180}g</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(((nut.proteinGrams || 142) / (nut.targetProtein || 180)) * 100)}%` }}></div>
              </div>
            </div>
            <div className="space-y-xs">
              <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                <span>CARBS</span>
                <span>{nut.carbsGrams || 210}g / {nut.targetCarbs || 300}g</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: `${Math.round(((nut.carbsGrams || 210) / (nut.targetCarbs || 300)) * 100)}%` }}></div>
              </div>
            </div>
            <div className="space-y-xs">
              <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                <span>FATS</span>
                <span>{nut.fatsGrams || 55}g / {nut.targetFats || 75}g</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim rounded-full" style={{ width: `${Math.round(((nut.fatsGrams || 55) / (nut.targetFats || 75)) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
