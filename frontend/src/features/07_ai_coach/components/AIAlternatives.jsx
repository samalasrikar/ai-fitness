import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useExercise } from '../../../hooks/useExercise';

export default function AIAlternatives() {
  const navigate = useNavigate();
  const location = useLocation();
  const exerciseName = location.state?.exerciseName || 'Barbell Back Squat';
  const { alternatives, loading, error, fetchAlternatives } = useExercise();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAlternatives(exerciseName);
  }, [exerciseName, fetchAlternatives]);

  const handleSelect = (name) => {
    setSelected(name);
    setTimeout(() => navigate('/workout/assistant'), 600);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">FITAIX</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              settings_heart
            </span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Current Selection */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#d1c5ab]">Targeting Exercise</h2>
          <div
            className="rounded-xl p-5 flex items-center gap-4"
            style={{
              background: 'rgba(32,31,31,0.7)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#2a2a2a] relative shrink-0">
              <img
                className="w-full h-full object-cover opacity-60"
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200"
                alt={exerciseName}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#e5e2e1]">{exerciseName}</h3>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="bg-[#353534] text-[#f5c400] px-3 py-1 rounded-full text-[11px] font-medium font-[JetBrains_Mono,monospace]">
                  Primary: Quads
                </span>
                <span className="bg-[#353534] text-[#d1c5ab] px-3 py-1 rounded-full text-[11px] font-medium font-[JetBrains_Mono,monospace]">
                  Compound
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#131313] px-4 text-[10px] uppercase font-bold tracking-widest text-[#f5c400] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              AI Smart Alternatives
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Calculating biomechanical matches...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Alternatives List */}
        <div className="space-y-4">
          {alternatives.map((alt, i) => {
            const isSel = selected === alt.name;
            return (
              <motion.div
                key={alt.id || alt.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  isSel ? 'border-2 border-[#f5c400] shadow-[0_0_25px_rgba(245,196,0,0.2)]' : ''
                }`}
                style={{
                  background: 'rgba(32,31,31,0.7)',
                  backdropFilter: 'blur(30px)',
                  border: isSel ? undefined : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block bg-[#f5c400]/10 text-[#f5c400] border border-[#f5c400]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                        {alt.matchScore}% Match ({alt.fatigueImpact})
                      </span>
                      <h3 className="text-xl font-bold text-[#e5e2e1]">{alt.name}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-[#201f1f]">
                      <img className="w-full h-full object-cover" src={alt.imgSrc || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'} alt={alt.name} />
                    </div>
                  </div>

                  <p className="text-sm text-[#d1c5ab] leading-relaxed">{alt.reason}</p>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#f5c400] text-sm">analytics</span>
                      <span className="text-xs font-semibold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">Tension: {alt.mechanicalTension}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#f5c400] text-sm">bolt</span>
                      <span className="text-xs font-semibold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">{alt.equipment}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelect(alt.name)}
                    className={`w-full h-12 rounded-xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#f5c400] text-black shadow-[0_0_20px_rgba(245,196,0,0.4)]'
                        : 'bg-white/5 hover:bg-[#f5c400]/20 hover:text-[#f5c400] border border-white/10 text-[#e5e2e1]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm font-black">
                      {isSel ? 'check_circle' : 'swap_horiz'}
                    </span>
                    <span>{isSel ? 'Swapped Successfully' : 'Select Alternative'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
