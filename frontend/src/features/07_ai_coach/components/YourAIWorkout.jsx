import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

export default function YourAIWorkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const workout = location.state?.workout || {
    title: 'Hypertrophy Push A',
    duration: '45 mins',
    exercises: [
      { name: 'Barbell Back Squat', sets: 4, reps: '8-10', rpe: 9, imgSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200' },
      { name: 'Incline Dumbbell Press', sets: 4, reps: '8-10', rpe: 8.5, imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', rpe: 8, imgSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200' },
    ],
  };

  const handleLaunch = () => {
    navigate('/workout/in-progress', { state: { plan: workout } });
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131313] min-h-screen pb-32 text-[#e5e2e1]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-[#e5e2e1] hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-[#f5c400] tracking-tight font-[Manrope]">Your AI Workout</h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-[#d1c5ab]/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings_heart</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6 max-w-[430px] mx-auto w-full">
        {/* Header Summary */}
        <section className="p-5 rounded-xl border border-[#f5c400]/20 bg-[#f5c400]/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-wider">AI Blueprint Ready</span>
            <span className="text-xs font-bold text-[#d1c5ab] font-[JetBrains_Mono,monospace]">{workout.duration}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#e5e2e1]">{workout.title}</h2>
        </section>

        {/* Exercises */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-[#d1c5ab] uppercase tracking-wider">Prescribed Sequence</h3>
          <div className="space-y-3">
            {workout.exercises.map((ex, i) => (
              <motion.div
                key={ex.name + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="p-4 rounded-xl border border-white/10 bg-[#201f1f] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#131313] overflow-hidden shrink-0 border border-white/5">
                    <img className="w-full h-full object-cover" src={ex.imgSrc || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200'} alt={ex.name} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#e5e2e1]">{ex.name}</h4>
                    <p className="text-[11px] text-[#d1c5ab] font-[JetBrains_Mono,monospace]">
                      {ex.sets} Sets × {ex.reps} Reps {ex.rpe ? `• RPE ${ex.rpe}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/workout/ai-analysis')}
                  className="text-xs font-bold text-[#f5c400] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Intel
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Launch Button */}
        <div className="pt-4">
          <button
            onClick={handleLaunch}
            className="w-full h-14 bg-[#f5c400] text-black font-bold text-base uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,196,0,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
            <span>Launch Workout Session</span>
          </button>
        </div>
      </main>

      <BottomNav activeId="workout" />
    </div>
  );
}
