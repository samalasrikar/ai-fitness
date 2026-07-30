import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const ALTERNATIVES = [
  {
    name: 'Dumbbell Goblet Squat',
    badge: 'Lower Back Friendly',
    badgeClass: 'bg-[#f5c400]/10 text-[#f5c400] border border-[#f5c400]/20',
    desc:
      'Reduces axial loading on the spine by shifting the center of mass forward. Ideal for maintaining high intensity while prioritizing spinal decompression.',
    stats: [
      { icon: 'analytics', label: '88% Match' },
      { icon: 'bolt', label: 'High Stability' },
    ],
    imgSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjVaAt5rzUZ7Z8eiwjKxm0K4nBO1tnk1IfiLoOECYi0sm8gRv-l1zrEgHmQGpqxRMo1BTRhUF6pBxn-ka2WM_PahEHU3CxqMjNGzsi2lVx_u08qBO0EpLDu-WPR9W-sez2BeNJWj9niAvMyIh_iYoJNODzPnaQWDjCNFUqaro-GQ1luLhOJ8yD6R5kxZUBi42BhxZNbs7KQ5NPa3g_kKW7vXs7B2Y-1z2LRbyVmxfhT0dYgmXeuHRpwg',
    imgAlt: 'Goblet Squat',
  },
  {
    name: 'Leg Press',
    badge: 'Machine Alternative',
    badgeClass: 'bg-[#353534] text-[#d1c5ab] border border-white/10',
    desc:
      'Removes the balance requirement and core fatigue. Allows maximum mechanical tension on the quadriceps through a controlled, fixed path of motion.',
    stats: [
      { icon: 'psychology', label: '94% Target' },
      { icon: 'target', label: 'Hypertrophy' },
    ],
    imgSrc:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEyYsUdUN8lli79g0Dje34KmxWPF15YXpjOFFv5eR18x2W07zIPgxm53MICUHvs1Hc3U3FsYdxa8JRr9MPFF_dDi2Cd0V7FP3TJH0MzCJ48aqDBfK5sIlq6YBmAmH8bWeUFE5aG3YJq4GwYpvdM6Qvvn3o0UurmhsBblQNc3vZvMLDpap3VZI6e0DPv4kolsA9x4fGG6ycwldgogVwdauELwt9oS8FRXFTxA6SSBL9wsEzoEQ3tlmnzA',
    imgAlt: 'Leg Press',
  },
];

export default function AIAlternatives() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (name) => {
    setSelected(name);
    setTimeout(() => navigate('/workout/assistant'), 800);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">FITAIX</h1>
          </div>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              settings_heart
            </span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Current Selection */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#d1c5ab]">Current Selection</h2>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv0g4EbEfAUM3blkIdh7K2GMGFd4p2aUaKJCD3my4TgTmVrTgzOUVeQhrGhe1BKbu1DV9xEZcL-e80yEmegiT70e5vtBbH2c50Kg4jdIGkyrv8WxPTezhZ_86f3mKJaPxxf7iQWELlkgjdm1E0GDJLyipmZzPIKGuH88NzatDYW7ivkPTrhzq2JkBLKPI6K8KT2DbwITnj-5xZg6EMH-tR8yErLGPjKUT9T-1y6HVbBXDTaZ6oqEEpUg"
                alt="Barbell Squat"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#e5e2e1]">Barbell Squat</h3>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className="bg-[#353534] text-[#f5c400] px-3 py-1 rounded-full text-[11px] font-medium font-[JetBrains_Mono,monospace]">
                  Primary: Quads
                </span>
                <span className="bg-[#353534] text-[#d1c5ab] px-3 py-1 rounded-full text-[11px] font-medium font-[JetBrains_Mono,monospace]">
                  Compound
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#d1c5ab]/40 shrink-0">lock</span>
          </div>
        </section>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#131313] px-4 text-[11px] font-semibold uppercase tracking-widest text-[#f5c400] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              AI Recommendations
            </span>
          </div>
        </div>

        {/* Recommendation Grid */}
        <section className="space-y-4">
          {ALTERNATIVES.map((alt, i) => (
            <motion.div
              key={alt.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              onClick={() => handleSelect(alt.name)}
              className={`rounded-xl p-5 flex flex-col gap-4 cursor-pointer active:scale-[0.98] transition-all ${
                selected === alt.name ? 'ring-2 ring-[#f5c400]' : ''
              }`}
              style={{
                background: 'radial-gradient(at 0% 0%, rgba(245,196,0,0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(245,196,0,0.04) 0px, transparent 50%), rgba(32,31,31,0.7)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#e5e2e1] hover:text-[#f5c400] transition-colors">
                    {alt.name}
                  </h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${alt.badgeClass}`}>
                    {alt.badge}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#f5c400] flex items-center justify-center text-black shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {selected === alt.name ? 'check' : 'add'}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="aspect-video w-full rounded-lg overflow-hidden relative">
                <img className="w-full h-full object-cover" src={alt.imgSrc} alt={alt.imgAlt} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <p className="text-sm text-[#d1c5ab] leading-relaxed">{alt.desc}</p>

              <div className="flex flex-wrap gap-2">
                {alt.stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#0e0e0e]/50 border border-white/5 rounded-lg px-3 py-1.5 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#f5c400]">{s.icon}</span>
                    <span className="text-[11px] font-medium font-[JetBrains_Mono,monospace]">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>

        {/* AI Logic Insight */}
        <div
          className="rounded-xl p-5 border border-[#f5c400]/20 bg-[#f5c400]/5 relative overflow-hidden"
          style={{ backdropFilter: 'blur(30px)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5c400]/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[#f5c400] text-3xl shrink-0">info</span>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-[#f5c400]">Why these swaps?</h4>
              <p className="text-sm text-[#d1c5ab] leading-relaxed">
                Based on your previous session data and fatigue markers, FITAIX detected a slight limitation in lumbar
                mobility. These alternatives maintain volume while managing recovery for your scheduled deadlift session
                tomorrow.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
