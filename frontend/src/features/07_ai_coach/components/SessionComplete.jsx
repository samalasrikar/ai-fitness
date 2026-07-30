import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

export default function SessionComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple festive confetti canvas effect
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      r: Math.random() * 4 + 2,
      color: '#f5c400',
      vy: Math.random() * 2 + 1,
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy;
        if (p.y > canvas.height) p.y = -10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1] font-[Manrope,sans-serif] relative overflow-hidden">
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-10 opacity-70" />

      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button className="text-[#f5c400] hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-lg mx-auto w-full relative z-20">
        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}
          className="text-center py-6 space-y-2">
          <div className="w-20 h-20 rounded-full bg-[#f5c400]/10 border border-[#f5c400]/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(245,196,0,0.3)]">
            <span className="material-symbols-outlined text-[#f5c400] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f5c400]">WORKOUT FINISHED</span>
          <h2 className="text-3xl font-extrabold text-[#e5e2e1]">Session Complete!</h2>
          <p className="text-xs text-[#d1c5ab]">All sets logged & biomechanical feedback processed.</p>
        </motion.div>

        {/* Stats Bento */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'DURATION', val: '62', unit: 'min' },
            { label: 'CALORIES', val: '512', unit: 'kcal' },
            { label: 'VOLUME', val: '14.2', unit: 'tons' },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-xl p-3 text-center" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1c5ab]/60 block mb-1">{s.label}</span>
              <span className="text-2xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{s.val}</span>
              <span className="text-xs text-[#d1c5ab] font-[JetBrains_Mono,monospace] ml-0.5">{s.unit}</span>
            </motion.div>
          ))}
        </div>

        {/* AI Performance Insight */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl p-5 border border-[#f5c400]/20 relative overflow-hidden"
          style={{ background: 'radial-gradient(at 0% 0%, rgba(245,196,0,0.1) 0px, transparent 50%), rgba(26,26,26,1)' }}>
          <div className="flex items-start gap-4">
            <div className="bg-[#f5c400] p-3 rounded-xl text-black shrink-0 shadow-[0_0_20px_rgba(245,196,0,0.4)]">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-widest block mb-1">AI Performance Insight</span>
              <p className="text-base font-bold text-white italic leading-tight">
                "Elite performance today. Your power output peaked at minute 42 during the final heavy set."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recovery Protocol */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(32,31,31,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-black text-[#f5c400] tracking-tight">RECOVERY PROTOCOL</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5c400]/10 border border-[#f5c400]/30 flex items-center justify-center shrink-0 text-[#f5c400]">
                <span className="material-symbols-outlined text-lg">medication</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#e5e2e1]">Magnesium Supplement</p>
                <p className="text-xs text-[#d1c5ab]">Take 400mg within 60 mins to support muscle relaxation and prevent cramping.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5c400]/10 border border-[#f5c400]/30 flex items-center justify-center shrink-0 text-[#f5c400]">
                <span className="material-symbols-outlined text-lg">bedtime</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#e5e2e1]">Optimized Sleep</p>
                <p className="text-xs text-[#d1c5ab]">Target 8.5 hours tonight. Your CNS requires extended REM for this load.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/workout/perf-lab')} className="w-full bg-[#f5c400] text-black py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-[0_10px_20px_rgba(245,196,0,0.2)] hover:brightness-110 active:scale-95 transition-all">
            View Performance Lab
          </button>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-[#1c1b1b] text-[#e5e2e1] border border-[#f5c400]/20 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white/5 active:scale-95 transition-all">
            Back to Dashboard
          </button>
        </div>
      </main>

      <BottomNav activeId="records" />
    </div>
  );
}
