import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useAICoach } from '../../../hooks/useAICoach';

const BODY_PARTS = ['Right Knee', 'Left Shoulder', 'Lower Back (L4/L5)', 'Neck', 'Right Hip', 'Left Ankle'];

export default function InjuryGuard() {
  const navigate = useNavigate();
  const { injuryGuardStatus, loading, error, fetchInjuryGuard, logInjury } = useAICoach();
  const [severity, setSeverity] = useState(4);
  const [bodyPart, setBodyPart] = useState('Right Knee');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchInjuryGuard();
  }, [fetchInjuryGuard]);

  const handleSave = async () => {
    try {
      await logInjury({ bodyPart, discomfortLevel: severity, notes });
      setSaved(true);
      setNotes('');
      setTimeout(() => setSaved(false), 3000);
    } catch (_) {}
  };

  const circumference = 2 * Math.PI * 70;
  const safetyScore = injuryGuardStatus?.activeAlerts?.length > 0 ? 80 : 100;
  const dashOffset = circumference * (1 - safetyScore / 100);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight font-[Manrope]">FITAIX</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full">
        {loading && (
          <div className="flex items-center justify-center py-6 gap-2">
            <span className="material-symbols-outlined text-[#f5c400] text-xl animate-spin">autorenew</span>
            <span className="text-xs text-[#d1c5ab]">Scanning biomechanical risks...</span>
          </div>
        )}

        {/* Safety Score Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden"
          style={{
            background: 'rgba(32,31,31,0.7)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderLeft: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-[#f5c400]/30 text-4xl">shield_with_heart</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mb-5">
            Current Joint Safety Score
          </span>
          <div className="relative w-36 h-36 flex justify-center items-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(42,42,42,1)" strokeWidth="8" />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="#f5c400"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-[#f5c400] leading-none">{safetyScore}%</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab] mt-1">
                {safetyScore === 100 ? 'Optimized' : 'Protected'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form to Log Discomfort */}
        <section className="space-y-4 rounded-xl p-5 border border-white/10 bg-[#201f1f]/80">
          <div className="flex items-center gap-2 text-[#f5c400]">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              medical_services
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider">Log Area Discomfort</h3>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#d1c5ab] uppercase tracking-wider block mb-1.5">Target Body Part</label>
            <select
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#e5e2e1] focus:border-[#f5c400] outline-none"
            >
              {BODY_PARTS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-[#d1c5ab] uppercase tracking-wider">Discomfort Level (1-10)</label>
              <span className="text-xs font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">{severity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-[#f5c400] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#d1c5ab] uppercase tracking-wider block mb-1.5">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild tendon tightness during squat lockout"
              className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#e5e2e1] placeholder:text-[#d1c5ab]/30 focus:border-[#f5c400] outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-[#f5c400] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            {saved ? '✓ Discomfort Saved to AI Core' : 'Submit Discomfort Report'}
          </button>
        </section>

        {/* Logged Alerts */}
        {injuryGuardStatus?.activeAlerts?.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-[#f5c400] uppercase tracking-wider">Active Protective Adjustments</h3>
            {injuryGuardStatus.activeAlerts.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-[#f5c400]/20 bg-[#f5c400]/5 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#f5c400] text-lg">warning</span>
                <div>
                  <h4 className="text-xs font-bold text-[#e5e2e1]">{a.bodyPart} (Severity: {a.severity}/10)</h4>
                  <p className="text-[11px] text-[#d1c5ab] mt-0.5">{a.recommendation}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
