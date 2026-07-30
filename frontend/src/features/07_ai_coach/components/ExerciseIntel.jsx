import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useExercise } from '../../../hooks/useExercise';

export default function ExerciseIntel() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { exerciseDetail, loading, error, fetchExerciseById } = useExercise();
  const [activeTab, setActiveTab] = useState('Instructions');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchExerciseById(id || 'ex-1');
  }, [id, fetchExerciseById]);

  const exercise = exerciseDetail || {
    name: 'Barbell Back Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Glutes',
    instructions: [
      'Position the barbell across your upper traps. Feet shoulder-width apart, toes slightly flared out. Engage core.',
      'Inhale and hinge at hips. Keep chest up and back flat. Lower until thighs are parallel to floor (3-sec eccentric).',
      'Exhale and drive through mid-foot. Explode upward keeping knees in line with toes.',
    ],
    formCues: [
      'Maintain intra-abdominal pressure during axial load.',
      'Track knees over middle toes.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400',
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX INTEL</h1>
          <button onClick={() => navigate('/dashboard')} className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-5 max-w-[430px] mx-auto w-full">
        {loading && (
          <div className="flex items-center justify-center py-6 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Loading exercise intel...</span>
          </div>
        )}

        {/* Video Player Hero */}
        <section className="relative rounded-xl overflow-hidden aspect-video border border-white/10 group shadow-2xl bg-[#201f1f]">
          <img
            src={exercise.imageUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400'}
            alt={exercise.name}
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-16 h-16 bg-[#f5c400]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-[#f5c400]/30 hover:bg-[#f5c400]/40 transition-all cursor-pointer active:scale-90"
            >
              <span className="material-symbols-outlined text-[#f5c400] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {playing ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold text-[#e5e2e1]">{exercise.name}</h2>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 bg-black/60 border border-white/5 rounded-full text-[10px] font-bold text-[#d1c5ab]">
                  {exercise.category}
                </span>
                <span className="px-2 py-0.5 bg-black/60 border border-white/5 rounded-full text-[10px] font-bold text-[#d1c5ab]">
                  {exercise.targetMuscle}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Card */}
        <div
          className="rounded-xl p-4 border border-[#f5c400]/20 flex items-start gap-3"
          style={{ background: 'radial-gradient(at 0% 0%, rgba(245,196,0,0.08) 0px, transparent 50%), rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)' }}
        >
          <span className="material-symbols-outlined text-[#f5c400] text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <div>
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-widest block mb-1">FITAIX Form Insight</span>
            <p className="text-xs text-[#e5e2e1] leading-relaxed">
              "Focus on a <span className="text-[#f5c400] font-bold underline">3-second eccentric phase</span> to maximize muscle fiber recruitment."
            </p>
          </div>
        </div>

        {/* Instructions Tabs */}
        <section className="space-y-3">
          <div className="flex gap-4 border-b border-white/10 pb-2">
            {['Instructions', 'Form Cues'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold transition-colors pb-1 border-b-2 cursor-pointer ${
                  activeTab === tab ? 'text-[#f5c400] border-[#f5c400]' : 'text-[#d1c5ab]/60 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {activeTab === 'Instructions' &&
              exercise.instructions.map((step, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#201f1f] border border-white/5 text-xs text-[#e5e2e1] flex gap-3">
                  <span className="font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">0{i + 1}</span>
                  <p>{step}</p>
                </div>
              ))}

            {activeTab === 'Form Cues' &&
              (exercise.formCues || []).map((cue, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#201f1f] border border-white/5 text-xs text-[#e5e2e1] flex gap-3">
                  <span className="material-symbols-outlined text-[#f5c400] text-sm">check_circle</span>
                  <p>{cue}</p>
                </div>
              ))}
          </div>
        </section>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
