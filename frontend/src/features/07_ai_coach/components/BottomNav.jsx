import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home_max', path: '/dashboard' },
  { id: 'workout', label: 'Workout', icon: 'fitness_center', path: '/workout/assistant' },
  { id: 'progress', label: 'Progress', icon: 'query_stats', path: '/dashboard' },
  { id: 'records', label: 'Records', icon: 'emoji_events', path: '/dashboard' },
  { id: 'profile', label: 'Profile', icon: 'person_2', path: '/dashboard' },
];

export default function BottomNav({ activeId = 'workout' }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[1000] bg-[#0e0e0e]/90 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-xl">
      <div className="flex justify-around items-center pt-3 pb-6 px-4 w-full">
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 duration-150 cursor-pointer ${
                isActive ? 'text-[#f5c400] font-bold' : 'text-[#d1c5ab]/60 hover:text-[#d1c5ab]'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
