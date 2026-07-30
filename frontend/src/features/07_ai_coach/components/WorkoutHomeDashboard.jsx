import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useWorkout } from '../../../hooks/useWorkout';

const C = 2 * Math.PI * 110; // ≈ 691

export default function WorkoutHomeDashboard() {
  const navigate = useNavigate();
  const { homeSummary, loading, error, fetchHomeSummary } = useWorkout();

  useEffect(() => {
    fetchHomeSummary();
  }, [fetchHomeSummary]);

  const readiness = homeSummary?.readiness || 85;
  const offset = C * (1 - readiness / 100);
  const recentList = homeSummary?.recentWorkouts || [];
  const rec = homeSummary?.recommendation || {
    title: 'High Performance: Hypertrophy Focus',
    description: 'Based on elevated HRV and 8.5h sleep, posterior chain development is recommended.',
    time: '75m',
    intensity: '8/10',
    sets: 24,
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#f5c400]/20">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Athlete"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <span className="material-symbols-outlined text-[#f5c400] text-2xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Loading intelligence dashboard...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {/* Readiness Ring */}
        <section className="flex flex-col items-center py-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(245,196,0,0.1),transparent_70%)]" />
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="110" fill="transparent" stroke="#353534" strokeWidth="8" />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                fill="transparent"
                stroke="#f5c400"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mb-1">Readiness</p>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-[#f5c400]">{readiness}</span>
                <span className="text-2xl font-bold text-[#f5c400]/60">%</span>
              </div>
              <div className="mt-2 flex items-center gap-1 justify-center px-3 py-1 rounded-full bg-[#f5c400]/10 border border-[#f5c400]/20">
                <span className="material-symbols-outlined text-sm text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                <span className="text-[11px] font-bold text-[#f5c400] uppercase font-[JetBrains_Mono,monospace]">Optimal</span>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/workout/create-ai')}
            className="mt-6 w-full max-w-xs py-4 bg-[#f5c400] text-black font-bold text-base rounded-xl shadow-[0_4px_20px_rgba(245,196,0,0.25)] hover:brightness-110 transition-all cursor-pointer"
          >
            Create Today's Workout
          </motion.button>
        </section>

        {/* AI Recommendation + Quick Metrics */}
        <section className="grid grid-cols-12 gap-3">
          {/* Rec card */}
          <div
            className="col-span-8 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-[#f5c400]/40 transition-all"
            onClick={() => navigate('/workout/assistant')}
            style={{
              background:
                'radial-gradient(at 0% 0%, rgba(245,196,0,0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245,196,0,0.04) 0px, transparent 50%), rgba(32,31,31,0.4)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#f5c400] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]">FitAI Recommendation</h3>
            </div>
            <h2 className="text-base font-bold text-[#e5e2e1] mb-2">{rec.title}</h2>
            <p className="text-xs text-[#d1c5ab] leading-relaxed mb-4">{rec.description}</p>
            <div className="flex flex-wrap gap-2">
              {[`Time: ${rec.time}`, `Intensity: ${rec.intensity}`, `Sets: ${rec.sets}`].map((t) => (
                <div key={t} className="bg-[#0e0e0e] border border-white/10 px-3 py-1 rounded-lg">
                  <span className="text-[11px] text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick metrics */}
          <div className="col-span-4 flex flex-col gap-3">
            <div
              className="rounded-xl p-3 flex flex-col flex-1"
              style={{
                background: 'rgba(32,31,31,0.4)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]">Weekly Goal</span>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-end">
                  <span className="text-xl font-semibold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">
                    {homeSummary?.weeklyGoal?.completed || 4}/5
                  </span>
                  <span className="text-[10px] text-[#d1c5ab] font-[JetBrains_Mono,monospace]">80%</span>
                </div>
                <div className="h-1.5 w-full bg-[#353534] rounded-full overflow-hidden">
                  <div className="h-full bg-[#f5c400] rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate('/workout/perf-lab')}
              className="rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
              style={{
                background: 'rgba(32,31,31,0.4)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]">HRV</span>
                <p className="text-xl font-semibold text-[#f5c400] font-[JetBrains_Mono,monospace] mt-1">
                  {homeSummary?.hrvMs || 78} ms
                </p>
              </div>
              <span className="material-symbols-outlined text-[#f5c400]/40 text-3xl">show_chart</span>
            </div>
          </div>
        </section>

        {/* Recent History */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-[#e5e2e1]">Recent History</h2>
            <button
              onClick={() => navigate('/workout/history')}
              className="text-[11px] font-bold text-[#f5c400] hover:underline uppercase tracking-widest cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentList.map((r, i) => (
              <motion.div
                key={r.id || r.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                onClick={() => navigate('/workout/history')}
                className="rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                style={{
                  background: 'rgba(32,31,31,0.4)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#353534] flex items-center justify-center border border-white/5">
                    <span className="material-symbols-outlined text-[#e5e2e1] text-xl">{r.icon || 'fitness_center'}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#e5e2e1]">{r.name}</h4>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]/60">{r.when}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{r.kcal}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]">{r.bpm}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}
