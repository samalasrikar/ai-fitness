import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useAICoach } from '../../../hooks/useAICoach';
import ManualWorkoutModal from '../../04_workout_plan/components/ManualWorkoutModal';
import FloatingAIButton from '../../04_workout_plan/components/FloatingAIButton';
import { workoutApi } from '../../../services/api/workout.api';

const CHIPS = ['Hypertrophy Focus', 'Fat Loss HIIT', 'Pure Strength', 'Dumbbells Only', 'Leg & Glute Focus'];
const GOALS = ['Hypertrophy', 'Strength', 'Endurance', 'Active Recovery'];
const EQUIPMENT = ['Full Gym', 'Home Gym', 'Bodyweight Only', 'Resistance Bands'];
const TIMES = ['30 Minutes', '45 Minutes', '60 Minutes', '90 Minutes'];

export default function CreateWithAI() {
  const navigate = useNavigate();
  const { generateWorkout, loading, error } = useAICoach();
  const [prompt, setPrompt] = useState('');
  const [goal, setGoal] = useState(GOALS[0]);
  const [equipment, setEquipment] = useState(EQUIPMENT[0]);
  const [time, setTime] = useState(TIMES[1]);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleGenerate = async () => {
    try {
      const minutes = parseInt(time) || 45;
      const result = await generateWorkout({
        focusArea: prompt || goal,
        targetDuration: minutes,
        equipment: [equipment],
      });
      navigate('/workout/ai-workout', { state: { workout: result } });
    } catch (_) {}
  };

  const glassPanel = {
    background: 'rgba(32,31,31,0.5)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen
                    pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">

      {/* ── Fixed Header ── */}
      <header
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]
                   z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5
                   h-16 shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 h-full gap-3">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                         text-[#e5e2e1] hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_back
              </span>
            </button>
            <h1 className="text-[20px] font-extrabold text-[#f5c400] tracking-tight truncate">
              FITAIX
            </h1>
          </div>

          {/* Right: Manual + settings – flex-shrink-0 prevents clipping */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsManualOpen(true)}
              aria-label="Create workout manually"
              className="flex items-center gap-1.5 h-9 px-3
                         bg-[#201f1f] border border-white/10
                         text-[#e5e2e1] hover:text-white hover:border-[#f5c400]/40
                         rounded-xl text-[11px] font-bold uppercase tracking-wide
                         transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">
                edit_note
              </span>
              <span>Manual</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Settings"
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center
                         text-[#d1c5ab]/60 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                settings_heart
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="relative pt-20 px-5 space-y-5">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Hero text */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-4xl font-extrabold text-[#e5e2e1] tracking-tight mb-2">
            Build your{' '}
            <span className="text-[#f5c400] italic">blueprint.</span>
          </h2>
          <p className="text-sm text-[#d1c5ab] leading-relaxed">
            The AI engine will synthesize your optimal workout session based on your
            target focus and physical state.
          </p>
        </motion.section>

        {/* AI prompt input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-xl p-5 space-y-3"
          style={glassPanel}
        >
          <label
            htmlFor="ai-prompt"
            className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400]"
          >
            Prompt the AI Engine
          </label>
          <div className="relative">
            <input
              id="ai-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Upper Body Push with High Quadriceps Isolation..."
              className="w-full bg-[#0e0e0e] border border-[#4e4632]/50 rounded-lg
                         px-4 py-4 pr-12 text-sm text-[#e5e2e1]
                         placeholder:text-[#d1c5ab]/40
                         focus:border-[#f5c400] outline-none transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="material-symbols-outlined text-[#f5c400]/60" aria-hidden="true">
                auto_awesome
              </span>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setPrompt(chip)}
                className="bg-[#353534]/50 px-3 py-1.5 rounded-full
                           border border-[#4e4632]/30 text-[#d1c5ab]
                           text-[10px] font-bold min-h-[32px]
                           hover:border-[#f5c400]/50 hover:text-[#f5c400]
                           transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Goal / Equipment / Time selectors */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: 'target',         label: 'GOAL',      val: goal,      set: setGoal,      opts: GOALS     },
            { icon: 'fitness_center', label: 'EQUIPMENT', val: equipment, set: setEquipment, opts: EQUIPMENT },
            { icon: 'schedule',       label: 'TIME',      val: time,      set: setTime,      opts: TIMES     },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 flex flex-col gap-1.5"
              style={glassPanel}
            >
              <span className="text-[9px] font-semibold uppercase tracking-widest
                               text-[#d1c5ab]/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]" aria-hidden="true">
                  {s.icon}
                </span>
                {s.label}
              </span>
              <select
                value={s.val}
                onChange={(e) => s.set(e.target.value)}
                aria-label={s.label}
                className="bg-transparent text-xs font-bold text-[#f5c400]
                           outline-none cursor-pointer w-full"
              >
                {s.opts.map((o) => (
                  <option key={o} value={o} className="bg-[#131313] text-[#e5e2e1]">
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </motion.div>

        {/* Generate + Manual CTAs */}
        <div className="space-y-3 pb-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 bg-[#f5c400] text-black font-bold text-sm
                       tracking-widest uppercase rounded-xl flex items-center
                       justify-center gap-2
                       shadow-[0_0_25px_rgba(245,196,0,0.3)]
                       hover:brightness-105 active:scale-[0.98]
                       transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin" aria-hidden="true">
                  autorenew
                </span>
                <span>Generating Blueprint...</span>
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  auto_awesome
                </span>
                <span>Generate AI Workout</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsManualOpen(true)}
            className="w-full h-12 bg-[#201f1f] border border-white/10
                       text-[#e5e2e1] hover:text-white font-bold text-xs
                       tracking-widest uppercase rounded-xl flex items-center
                       justify-center gap-2 hover:border-[#f5c400]/40
                       transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              edit_note
            </span>
            <span>Create Workout Manually</span>
          </button>
        </div>
      </main>

      {/* ── Floating AI button – hidden while manual modal is open ── */}
      <FloatingAIButton
        onPress={handleGenerate}
        isModalOpen={isManualOpen}
      />

      {/* ── Manual Workout Modal ── */}
      <ManualWorkoutModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onSave={async (manualData) => {
          // Let errors bubble up – the modal's hook catches them and shows an inline banner
          const res = await workoutApi.createManualPlan(manualData);
          const newPlan = res.data?.data ? res.data.data : res.data;
          navigate('/workout/ai-workout', { state: { workout: newPlan } });
        }}
      />

      <BottomNav activeId="workout" />
    </div>
  );
}
