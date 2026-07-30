import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const QUICK_LINKS = [
  { label: 'Injury Guard', path: '/workout/injury-guard', icon: 'shield_with_heart' },
  { label: 'Goal Preservation', path: '/workout/goal-preservation', icon: 'target' },
];

export default function OverloadAnalysis() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden border border-white/10">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoAdxpUhlL99xvEGqfa3ZEo4uG8TEQQRasNEk9PCMKdfKAhyKnwgiWk_VI4ri3PsuxFWaRi_v1d-PSsPPSzZAU8Si_hfNL-SYXOZINelGGktVMNqUOwR45RPFq53eFPsgFAtgFAjwF8VKrnu1gNIpgx-j3OHwD5wYgpor6bIH7E9D0wJFKLQ9VEuti_fLgGT2UWkOXyxrMbR50LtsPPuNo5DuYbwtT6Hu_Htd71exIW77mdfrM3NtICA"
                alt="Profile"
              />
            </div>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="text-[#d1c5ab]/60 hover:text-white transition-colors active:scale-95">
            <span className="material-symbols-outlined text-2xl">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-5">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-2"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f5c400] block mb-1">
            Precision Adaptation
          </span>
          <h2 className="text-3xl font-extrabold text-[#e5e2e1] tracking-tight">Progressive Overload</h2>
        </motion.div>

        {/* Quick links */}
        <div className="flex gap-3">
          {QUICK_LINKS.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#f5c400]/15 bg-[#f5c400]/5 hover:bg-[#f5c400]/10 transition-all text-left"
            >
              <span className="material-symbols-outlined text-[#f5c400] text-sm">{l.icon}</span>
              <span className="text-[11px] font-bold text-[#d1c5ab] leading-tight">{l.label}</span>
            </button>
          ))}
        </div>

        {/* Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[280px]"
          style={{
            background: 'rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#e5e2e1]">Bench Press</h3>
              <p className="text-sm text-[#d1c5ab]">Standard Barbell / Strength Focus</p>
            </div>
            <div className="bg-[#353534] px-3 py-1 rounded border border-white/5">
              <span className="text-[11px] font-medium text-[#f5c400] uppercase tracking-tight font-[JetBrains_Mono,monospace]">
                +4.1% Increase
              </span>
            </div>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end justify-around h-36 gap-8 px-2">
            {/* Last Session */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <motion.div
                className="w-full rounded-t-lg border border-white/5"
                style={{ background: 'linear-gradient(to top, #1c1b1b, #353534)' }}
                initial={{ height: 0 }}
                animate={{ height: '85%' }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d1c5ab] mt-2">LAST</span>
              <span className="text-xl font-semibold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">60.0kg</span>
            </div>
            {/* Today Target */}
            <div className="flex flex-col items-center flex-1 max-w-[100px]">
              <motion.div
                className="w-full rounded-t-lg"
                style={{
                  background: 'linear-gradient(to top, #685200, #f5c400)',
                  boxShadow: '0 4px 15px rgba(245,196,0,0.3)',
                }}
                initial={{ height: 0 }}
                animate={{ height: '92%' }}
                transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400] mt-2">TARGET</span>
              <span className="text-xl font-semibold text-[#f5c400] font-[JetBrains_Mono,monospace]">62.5kg</span>
            </div>
          </div>
        </motion.div>

        {/* AI Rationale Card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl p-5 border border-[#f5c400]/20 flex flex-col gap-4"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(245,196,0,0.06) 0%, transparent 70%), rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h3 className="text-lg font-bold text-[#e5e2e1]">AI Rationale</h3>
          </div>
          <p className="text-sm text-[#d1c5ab] leading-relaxed">
            "Recovery metrics indicate optimal neurological readiness. Your Sleep Quality Score was{' '}
            <span className="text-[#f5c400] font-bold">94%</span> (Deep Sleep: 2h 12m), and last session's RPE 7
            suggests reserve capacity."
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] block mb-1">
                RPE Trend
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">7.2</span>
                <span className="material-symbols-outlined text-sm text-[#f5c400]">trending_down</span>
              </div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] block mb-1">
                CNS Ready
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-[#e5e2e1] font-[JetBrains_Mono,monospace]">High</span>
                <span className="material-symbols-outlined text-sm text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strength Velocity Trend (SVG Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-xl p-5 flex flex-col min-h-[220px]"
          style={{
            background: 'rgba(32,31,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d1c5ab]">show_chart</span>
              <h3 className="text-base font-bold text-[#e5e2e1]">Strength Velocity Trend</h3>
            </div>
            <span className="bg-[#f5c400]/10 text-[#f5c400] text-[11px] font-medium px-3 py-1 rounded-full border border-[#f5c400]/20 font-[JetBrains_Mono,monospace]">
              1 RM: 78kg
            </span>
          </div>
          <div className="flex-1 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="line-grad-oa" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'rgba(245,196,0,0.1)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(245,196,0,1)', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow-oa">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 0 180 Q 200 160 400 130 T 600 90 T 800 60 T 1000 40"
                fill="none"
                stroke="url(#line-grad-oa)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow-oa)"
              />
              {[
                { cx: 0, cy: 180 }, { cx: 200, cy: 165 }, { cx: 400, cy: 130 }, { cx: 600, cy: 90 },
              ].map((p) => (
                <circle key={`${p.cx}-${p.cy}`} cx={p.cx} cy={p.cy} r="4" fill="#353534" />
              ))}
              <circle cx="800" cy="60" r="4" fill="#f5c400" className="animate-pulse" />
              <circle cx="1000" cy="40" r="6" fill="#f5c400" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between px-1 pt-3">
              {['WEEK 1', 'WEEK 4', 'WEEK 8'].map((w) => (
                <span key={w} className="text-[10px] text-[#d1c5ab]/40 font-[JetBrains_Mono,monospace]">{w}</span>
              ))}
              <span className="text-[10px] text-[#f5c400] font-bold font-[JetBrains_Mono,monospace]">CURRENT</span>
            </div>
          </div>
        </motion.div>

        {/* Commit to Target CTA */}
        <div className="flex justify-center pb-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/workout/assistant')}
            className="relative px-10 py-4 bg-[#f5c400] text-black rounded-full font-extrabold text-sm uppercase tracking-tight overflow-hidden group transition-all active:scale-95"
            style={{ boxShadow: '0 8px 32px rgba(245,196,0,0.25)' }}
          >
            <span className="relative z-10">Commit to Target</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
