import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { useWorkout } from '../../../hooks/useWorkout';

const C = 2 * Math.PI * 110; // ≈ 691

export default function WorkoutInProgress() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;
  const { logSession } = useWorkout();

  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [setNum, setSetNum] = useState(1);
  const [weightKg, setWeightKg] = useState(80);
  const [repsDone, setRepsDone] = useState(10);
  const [isFinishing, setIsFinishing] = useState(false);

  const totalSets = 4;
  const progress = setNum / totalSets;
  const dashOffset = C * (1 - progress);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleCompleteSet = async () => {
    if (setNum >= totalSets) {
      setIsFinishing(true);
      try {
        const session = await logSession({
          title: plan?.title || 'Hypertrophy Push Session',
          durationSeconds: seconds,
          totalVolumeKg: weightKg * repsDone * totalSets,
          caloriesBurned: Math.round((seconds / 60) * 8.5) || 320,
          rpeAvg: 8.5,
          aiFeedback: 'Excellent neuromuscular intensity. Target volume threshold achieved.',
          rating: 5,
          sets: [
            { exerciseName: 'Barbell Back Squat', setNumber: 1, weightKg, reps: repsDone, rpe: 8.5, completed: true },
            { exerciseName: 'Barbell Back Squat', setNumber: 2, weightKg, reps: repsDone, rpe: 8.5, completed: true },
            { exerciseName: 'Barbell Back Squat', setNumber: 3, weightKg, reps: repsDone, rpe: 9, completed: true },
            { exerciseName: 'Barbell Back Squat', setNumber: 4, weightKg, reps: repsDone, rpe: 9.5, completed: true },
          ],
        });
        navigate('/workout/session-complete', { state: { session } });
      } catch (err) {
        setIsFinishing(false);
      }
    } else {
      setSetNum((s) => s + 1);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-28 text-[#e5e2e1] font-[Manrope,sans-serif]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => setPaused(!paused)} className="text-[#f5c400] text-xs font-bold uppercase tracking-wider bg-[#f5c400]/10 px-3 py-1 rounded-full border border-[#f5c400]/20 cursor-pointer">
              {paused ? 'Resume' : 'Pause'}
            </button>
            <h1 className="text-[22px] font-extrabold text-[#f5c400] tracking-tight">FITAIX</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="material-symbols-outlined text-[#f5c400] hover:opacity-80 transition-opacity">
            settings_heart
          </button>
        </div>
      </header>

      <main className="flex-1 pt-20 pb-28 px-6 max-w-lg mx-auto w-full space-y-5">
        {/* Timer Ring */}
        <section className="flex flex-col items-center">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="110" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                fill="transparent"
                stroke="#f5c400"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={C}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d1c5ab]/60 mb-1">Session Time</span>
              <h1 className="text-5xl font-extrabold text-[#f5c400] tracking-tighter" style={{ textShadow: '0 0 20px rgba(245,196,0,0.4)' }}>
                {fmt(seconds)}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#f5c400] animate-pulse" />
                <span className="text-[11px] font-bold text-[#f5c400] font-[JetBrains_Mono,monospace]">
                  {paused ? 'Paused' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Current Exercise */}
        <section
          className="rounded-xl p-5 relative overflow-hidden border border-white/5 group"
          style={{ background: 'rgba(32,31,31,0.6)', backdropFilter: 'blur(24px)' }}
        >
          <div className="flex justify-between items-start mb-3 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f5c400] block mb-1">Current Movement</span>
              <h2 className="text-lg font-bold text-[#e5e2e1] leading-tight">Barbell Back Squat</h2>
            </div>
            <div className="bg-[#353534]/50 px-3 py-1 rounded-full border border-white/5">
              <span className="text-[11px] font-bold text-[#d1c5ab] font-[JetBrains_Mono,monospace]">
                Set {setNum} of {totalSets}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#0e0e0e]/80 border border-white/5 p-3 rounded-lg">
              <span className="text-[10px] font-semibold text-[#d1c5ab]/60 block mb-1">Weight (kg)</span>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
            <div className="bg-[#0e0e0e]/80 border border-white/5 p-3 rounded-lg">
              <span className="text-[10px] font-semibold text-[#d1c5ab]/60 block mb-1">Reps Done</span>
              <input
                type="number"
                value={repsDone}
                onChange={(e) => setRepsDone(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-bold text-[#f5c400] font-[JetBrains_Mono,monospace] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCompleteSet}
            disabled={isFinishing}
            className="w-full py-4 bg-[#f5c400] text-black font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,196,0,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {isFinishing
              ? 'Logging Session to Database...'
              : setNum >= totalSets
              ? '✓ Finish & Complete Session'
              : `✓ Complete Set ${setNum}`}
          </button>
        </section>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
