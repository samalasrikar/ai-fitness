import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const STEPS = [
  { num: '01', title: 'Setup & Stance', text: 'Position the barbell across your upper traps. Feet shoulder-width apart, toes slightly flared out. Engage core.' },
  { num: '02', title: 'The Descent', text: 'Inhale and hinge at hips. Keep chest up and back flat. Lower until thighs are parallel to floor (3-sec eccentric).' },
  { num: '03', title: 'Drive Upward', text: 'Exhale and drive through mid-foot. Explode upward keeping knees in line with toes. Squeeze glutes at top.' },
];

export default function ExerciseIntel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Instructions');
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          <button className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-5">
        {/* Video Player Hero */}
        <section className="relative rounded-xl overflow-hidden aspect-video border border-white/10 group shadow-2xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4JS6AWBQaz-oFERti9sb9PcrA9l6KB8-eT4B6QdJXsnr-VB2mFqSmd0CsH4Qy4OqC1esu9zZgjZbDGtXzVBsOvKLc_yx1PKEb-WqFKXNUbEnM8UP6hxy8FsCm0KEO2NOHFUf6zvKhDCgeqP6gugTW19yW4IyfneNZChymqJ7NJLSLOZ9wxu1xVNpHM-cAomgmuCR9NgfUbwvzFBEApkaPo6JUs3GzkjfjaWAv30qNELkq42dtfsahFw"
            alt="Squat demo"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-16 h-16 bg-[#f5c400]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-[#f5c400]/30 hover:bg-[#f5c400]/40 transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-[#f5c400] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {playing ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold text-[#e5e2e1]">Barbell Back Squat</h2>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 bg-black/60 border border-white/5 rounded-full text-[10px] font-bold text-[#d1c5ab]">Compound</span>
                <span className="px-2 py-0.5 bg-black/60 border border-white/5 rounded-full text-[10px] font-bold text-[#d1c5ab]">Quadriceps</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Metrics */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Sets', val: '4' },
            { label: 'Reps', val: '8-12' },
            { label: 'Rest', val: '90s' },
            { label: 'Target', val: '185lbs' },
          ].map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="rounded-xl p-3 text-center" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab] block mb-0.5">{m.label}</span>
              <span className="text-base font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{m.val}</span>
            </motion.div>
          ))}
        </div>

        {/* AI Insight Card */}
        <div className="rounded-xl p-4 border border-[#f5c400]/20 flex items-start gap-3"
          style={{ background: 'radial-gradient(at 0% 0%, rgba(245,196,0,0.08) 0px, transparent 50%), rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)' }}>
          <span className="material-symbols-outlined text-[#f5c400] text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <div>
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-widest block mb-1">FITAIX Insight</span>
            <p className="text-xs text-[#e5e2e1] leading-relaxed">
              "Focus on a <span className="text-[#f5c400] font-bold underline">3-second eccentric phase</span> to maximize muscle fiber recruitment."
            </p>
          </div>
        </div>

        {/* Instructions Tabs */}
        <section className="space-y-3">
          <div className="flex gap-4 border-b border-white/10 pb-2">
            {['Instructions', 'Muscle Map', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold transition-colors pb-1 border-b-2 ${activeTab === tab ? 'text-[#f5c400] border-[#f5c400]' : 'text-[#d1c5ab]/60 border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Instructions' && (
            <div className="space-y-3">
              {STEPS.map(step => (
                <motion.div key={step.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl p-4 flex gap-3" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-8 h-8 rounded-lg border border-[#f5c400]/30 flex items-center justify-center text-xs font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#e5e2e1] mb-1">{step.title}</h4>
                    <p className="text-xs text-[#d1c5ab] leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'Muscle Map' && (
            <div className="rounded-xl p-4 text-center text-xs text-[#d1c5ab]" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)' }}>
              Primary: Quadriceps (85%) • Secondary: Glutes (60%), Hamstrings (40%), Core (50%)
            </div>
          )}

          {activeTab === 'History' && (
            <div className="rounded-xl p-4 text-center text-xs text-[#d1c5ab]" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)' }}>
              Personal Record: 225 lbs × 8 Reps (Logged 3 weeks ago)
            </div>
          )}
        </section>

        {/* Start Session CTA */}
        <div className="pt-2">
          <button onClick={() => navigate('/workout/in-progress')} className="w-full py-4 bg-[#f5c400] text-black font-bold rounded-xl text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,196,0,0.25)] hover:brightness-110 active:scale-95 transition-all">
            <span>Start Session</span>
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          </button>
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
