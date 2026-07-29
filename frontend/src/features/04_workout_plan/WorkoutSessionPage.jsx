import React, { useEffect, useState } from 'react';
import { TopAppBar } from '../../components/TopAppBar';
import { BottomNavBar } from '../../components/BottomNavBar';
import { apiClient } from '../../lib/axios';

export function WorkoutSessionPage() {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await apiClient.get('/workout/current');
        setWorkout(res.data.workout);
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    fetchWorkout();
  }, []);

  const toggleExercise = async (sessionExerciseId) => {
    try {
      const res = await apiClient.post('/workout/exercise/toggle', { sessionExerciseId });
      setWorkout((prev) => {
        if (!prev) return prev;
        const updatedExercises = prev.exercises.map((item) => {
          if (item.id === sessionExerciseId) {
            return { ...item, isCompleted: res.data.item.isCompleted };
          }
          return item;
        });
        const completedCount = updatedExercises.filter((e) => e.isCompleted).length;
        const progressPct = Math.round((completedCount / updatedExercises.length) * 100);
        return { ...prev, exercises: updatedExercises, completedCount, progressPct };
      });
    } catch (err) {
      // Toggle locally
    }
  };

  const w = workout || {
    title: 'Hypertrophy: Pull A',
    durationMinutes: 65,
    estCalories: 420,
    progressPct: 33,
    completedCount: 2,
    totalCount: 6,
    exercises: [
      {
        id: '1',
        order: 1,
        isCompleted: true,
        exercise: {
          title: 'Weighted Pull-ups',
          setsCount: 4,
          repsCount: '8-10 REPS',
          restSeconds: 90,
          mediaUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuC_tvbaoZN5781tm0hNpTNSv5guxg8NuZDAA0721bHwF0a_vSffGfkjPUuxTSB0JVPID7kS61uY7-6DLFeGXQ-vAvGPIO31blATMeu9YNg2tf-o55dRy9GT-xCUXX7C5HmLkoRZXtwnfodfEN2MbJD53Xc-HWl_NafY5rLrfDil66qOlaxgEqg6hLyHdpP8M0f0V1Qny741yokFF-bdqnabwaU_cmw47B31MWHdorQqmgNHdwqWXSqAqw',
          isLocked: false,
        },
      },
      {
        id: '2',
        order: 2,
        isCompleted: true,
        exercise: {
          title: 'Bent Over Rows',
          setsCount: 3,
          repsCount: '12 REPS',
          restSeconds: 60,
          mediaUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDCAiY2r7HvGPszgVpF5c490qR9s_kUFrtqRXZhPbWRnKmHebggbg2ai4KofX86-FObtSD3ozOJq1n8yuH9AH6PiNBVXTDvLAtmgCkPNzqj0Vd92qnBrogEz_KUboZbBzvjDV8-6k9VJxDfD7MhH5tqmzGvjtIiP6oToldwpx1LgL_RD5tVkGINj34X8P4JIS_gl_d2Zvl8XqRi5PwuCkMEExNESxM3jeMxBuKoOltUBRNkeWT5F49MRA',
          isLocked: false,
        },
      },
      {
        id: '3',
        order: 3,
        isCompleted: false,
        exercise: {
          title: 'Face Pulls',
          setsCount: 3,
          repsCount: '15 REPS',
          restSeconds: 45,
          mediaUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCMzP07Nj6lF6nd-jDewdfIm7tZFt7aPgcwxYPO85JzexIJxjNvEDYufm6eKlBmDjdaxLOP7_U1rP-CvXpA6NYa1MpidZCMlI81uiGVrf26IpVS3X6RZs4k1ZmII1I84RqFPtw6WBVNC37Op74XtxKZtM41LgUASDrYulO6G1AZBgs39gLjQrT0RfDQuu6XmWSZWvtUWIrR89ynLUkLUVrDJ5vsGu_rdXXO9hx7f8AnUVzv4mqVIWhBKQ',
          isLocked: false,
        },
      },
      {
        id: '4',
        order: 4,
        isCompleted: false,
        exercise: {
          title: 'Incline Curls',
          setsCount: 3,
          repsCount: '12 REPS',
          restSeconds: 60,
          mediaUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCJLwGMZwAhR04EiGZauF6Zfk7XDHw4T4FAaJ9qkvFYyubqWoTUuygrLRf0Re2schc3qjGtt6qtbqPyiTLQbft5b4idMmpq8GewVT1_ZyYoyPgTB9WvVDzOOjos4WTvMU_URlOdMPniANQde0sinhKJF7hL39YuXCiEbFvzqi0Qbgvz1FAKXCgCInxtcA57Pydl4OgGPMZtENiv2PHKEymiPj0ip6_JW8DvzCJqKL3g3TYQZLJFREiHvQ',
          isLocked: true,
        },
      },
    ],
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <TopAppBar />

      <main className="pt-[72px] pb-32">
        {/* Hero Section */}
        <section className="relative w-full h-[380px] flex items-end">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdMsEw0Fr1eVT23ryVN_FybG09m_6yVdiP9uMieKyX_-paqwynrGSPg9o0oDHVp-hyG7LjmLul6uH4TrTMI0GE1fsY8TqJkfhX-8ypejRnB16mxyfDtc4KzMQkrhNXifOGz5T0AK6iM1NoxutRLejZ8Bo23ZY-GDBohPHXbf_StW-aXydPlQKnp9_LnRDwwDK_X_4w773AFjh_aBeQ23O_zt7cQSe2Uk6S6u1IenF1xaYkKQdPNEGjFg"
              alt="AI Assistant"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>
          <div className="relative z-10 px-container-margin pb-lg w-full max-w-4xl mx-auto">
            <span className="font-label-caps text-label-caps text-primary tracking-widest block mb-xs">CURRENT SESSION</span>
            <h2 className="font-display-lg text-display-lg text-on-surface leading-none mb-md">{w.title}</h2>
            <div className="flex gap-lg">
              <div className="flex flex-col">
                <span className="font-data-lg text-data-lg text-primary">{w.durationMinutes} MIN</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">Duration</span>
              </div>
              <div className="flex flex-col">
                <span className="font-data-lg text-data-lg text-primary">{w.estCalories} KCAL</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase">Est. Burn</span>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="px-container-margin mt-xl max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-lg flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="font-body-lg text-body-lg text-on-surface font-bold">Session Progress</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {w.completedCount} of {w.totalCount || w.exercises.length} exercises completed
              </p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/5" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                <circle
                  className="text-primary"
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="28"
                  stroke="currentColor"
                  strokeDasharray="175.9"
                  strokeDashoffset={175.9 - (175.9 * (w.progressPct || 0)) / 100}
                  strokeLinecap="round"
                  strokeWidth="6"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-data-sm text-data-sm text-primary">{w.progressPct}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise Queue */}
        <section className="px-container-margin mt-xl flex flex-col gap-md max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-on-surface">Exercise Queue</h3>
            <span className="font-label-caps text-label-caps text-primary uppercase">VIEW ALL</span>
          </div>

          {w.exercises?.map((item) => {
            const ex = item.exercise;
            return (
              <div
                key={item.id}
                onClick={() => toggleExercise(item.id)}
                className={`glass-card rounded-xl p-md flex gap-md cursor-pointer transition-colors ${
                  ex?.isLocked ? 'opacity-50' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden border border-white/5 shrink-0">
                  {ex?.mediaUrl ? (
                    <img className="w-full h-full object-cover" src={ex.mediaUrl} alt={ex.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/20 text-3xl">lock</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-body-lg text-body-lg font-bold text-on-surface">{ex?.title}</h4>
                    {item.isCompleted ? (
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-white/20">circle</span>
                    )}
                  </div>
                  <div className="flex gap-md mt-sm flex-wrap">
                    <div className="bg-surface-container-lowest px-sm py-xs rounded border border-white/5">
                      <span className="font-data-sm text-data-sm text-on-surface-variant">{ex?.setsCount} SETS</span>
                    </div>
                    <div className="bg-surface-container-lowest px-sm py-xs rounded border border-white/5">
                      <span className="font-data-sm text-data-sm text-on-surface-variant">{ex?.repsCount}</span>
                    </div>
                    <div className="bg-surface-container-lowest px-sm py-xs rounded border border-white/5">
                      <span className="font-data-sm text-data-sm text-primary">{ex?.restSeconds}s REST</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
