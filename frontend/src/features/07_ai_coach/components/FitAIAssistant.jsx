import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useWorkout } from '../../../hooks/useWorkout';

const STATS = [
  { label: 'EST. DURATION', value: '64', unit: 'min', color: 'text-[#f5c400]' },
  { label: 'INTENSITY RATIO', value: '8.2', unit: '/10', color: 'text-[#ffe171]' },
  { label: 'VOLUME ADJUST.', value: '+12%', icon: 'trending_up', color: 'text-[#ffba38]' },
  { label: 'RECOVERY NEED', value: 'High', color: 'text-[#f5c400]' },
];

export default function FitAIAssistant() {
  const navigate = useNavigate();
  const { activePlan, loading, error, fetchActivePlan } = useWorkout();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetchActivePlan();
  }, [fetchActivePlan]);

  const exercises = activePlan?.exercises || [
    {
      name: 'Barbell Back Squat',
      tag: 'REGENERATED',
      tagColor: 'bg-[#f5c400] text-black',
      sets: 4,
      reps: '8-10',
      rpe: 9,
      note: '+2 Sets added',
      imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Bulgarian Split Squat',
      tag: null,
      sets: 3,
      reps: '12',
      extra: 'REST: 90s',
      imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Leg Extension',
      tag: 'SWAPPED',
      tagColor: 'bg-[#ffbf4d] text-[#432c00]',
      sets: 4,
      reps: '15',
      extra: 'DROP: Last Set',
      imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const handleStartSession = () => {
    navigate('/workout/in-progress', { state: { plan: activePlan } });
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#f5c400]/20">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Profile"
              />
            </div>
            <span className="text-[28px] font-extrabold text-[#f5c400] tracking-tight leading-none font-[Manrope]">
              FITAIX
            </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Loading AI Plan...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* AI Optimization Status */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden bg-[radial-gradient(circle_at_center,rgba(245,196,0,0.06),transparent_70%)]" />
          <div
            className="rounded-xl p-5 flex items-center gap-4 relative overflow-hidden"
            style={{
              background: 'rgba(32,31,31,0.7)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative shrink-0"
            >
              <div className="w-16 h-16 rounded-xl bg-[#f5c400]/10 flex items-center justify-center border border-[#f5c400]/30">
                <span
                  className="material-symbols-outlined text-[#f5c400] text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_toy
                </span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#f5c400] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-black text-[11px] font-black">check</span>
                </div>
              </div>
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-[#f5c400] mb-1">{activePlan?.title || 'Plan Optimized.'}</h2>
              <p className="text-sm text-[#d1c5ab] leading-relaxed">
                Sequence adjusted for peak neuromuscular recruitment. Volume increased on weak points.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.35 }}
              className="rounded-xl p-4 space-y-1"
              style={{
                background: 'rgba(32,31,31,0.7)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#d1c5ab]/60 font-[Manrope]">
                {s.label}
              </span>
              <div className="flex items-baseline gap-1">
                {s.icon && <span className={`material-symbols-outlined text-sm ${s.color}`}>{s.icon}</span>}
                <span className={`text-2xl font-semibold font-[JetBrains_Mono,monospace] ${s.color}`}>
                  {s.value}
                </span>
                {s.unit && <span className="text-sm text-[#d1c5ab] font-[JetBrains_Mono,monospace]">{s.unit}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Alternatives CTA */}
        <button
          onClick={() => navigate('/workout/alternatives')}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#f5c400]/20 bg-[#f5c400]/5 hover:bg-[#f5c400]/10 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#f5c400]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">AI Smart Swap</span>
          </div>
          <span className="material-symbols-outlined text-[#d1c5ab]/40 group-hover:text-[#f5c400] transition-colors">
            chevron_right
          </span>
        </button>

        {/* Workout Sequence List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#e5e2e1]">Revised Sequence</h3>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#f5c400]/10 text-[#f5c400] px-3 py-1 rounded-full border border-[#f5c400]/20">
              {exercises.length} Exercises
            </span>
          </div>

          <div className="space-y-3">
            {exercises.map((ex, idx) => (
              <motion.div
                key={ex.name + idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * idx, duration: 0.35 }}
                onClick={() => navigate('/workout/exercise-intel')}
                className="rounded-xl overflow-hidden group hover:border-[#f5c400]/30 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'rgba(32,31,31,0.7)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center p-4 gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5 relative bg-[#201f1f]">
                    <img
                      className="w-full h-full object-cover"
                      src={ex.imgSrc || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200'}
                      alt={ex.name}
                    />
                    <div className="absolute inset-0 bg-[#f5c400]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_circle
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-bold truncate">{ex.name}</h4>
                      {ex.tag && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ex.tagColor || 'bg-[#f5c400] text-black'}`}>
                          {ex.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-medium text-[#d1c5ab]/60 uppercase">Sets:</span>
                        <span className="text-[11px] font-medium text-[#f5c400] font-[JetBrains_Mono,monospace]">{ex.sets}</span>
                      </div>
                      {ex.reps && (
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-medium text-[#d1c5ab]/60 uppercase">Reps:</span>
                          <span className="text-[11px] font-medium text-[#f5c400] font-[JetBrains_Mono,monospace]">{ex.reps}</span>
                        </div>
                      )}
                      {ex.rpe && (
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-medium text-[#d1c5ab]/60 uppercase">RPE:</span>
                          <span className="text-[11px] font-medium text-[#f5c400] font-[JetBrains_Mono,monospace]">{ex.rpe}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/workout/alternatives', { state: { exerciseName: ex.name } });
                      }}
                      className="material-symbols-outlined text-[#d1c5ab]/40 hover:text-[#f5c400] transition-colors text-lg cursor-pointer"
                    >
                      swap_horiz
                    </button>
                    {ex.note && <span className="text-[9px] text-[#ffba38] font-semibold">{ex.note}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI Insight Box */}
        <section
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(32,31,31,0.7)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-[#f5c400]">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <h3 className="text-[11px] font-bold uppercase tracking-widest">FITAIX Performance Insight</h3>
            </div>
            <p className="text-sm text-[#d1c5ab] italic leading-relaxed">
              "I have prioritized your back squats based on CNS readiness scores. Added volume is calibrated to trigger
              myofibrillar protein synthesis in the quadriceps medialis."
            </p>
          </div>
        </section>
      </main>

      {/* Start Session Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 z-40">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleStartSession}
          className="w-full h-14 bg-[#f5c400] text-black font-bold rounded-xl flex items-center justify-center gap-3 text-base shadow-[0_0_25px_rgba(245,196,0,0.3)] hover:brightness-105 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            play_arrow
          </span>
          <span>Start Session</span>
        </motion.button>
      </div>

      <BottomNav activeId="workout" />
    </div>
  );
}
