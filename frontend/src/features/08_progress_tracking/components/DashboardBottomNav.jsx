import { useLocation, useNavigate } from 'react-router-dom';

export default function DashboardBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', path: '/dashboard' },
    { id: 'calories', label: 'Calories', icon: 'local_fire_department', path: '/dashboard/calories' },
    { id: 'workout', label: 'Workout', icon: 'exercise', path: '/dashboard/workout' },
    { id: 'records', label: 'Records', icon: 'trophy', path: '/dashboard/records' },
    { id: 'profile', label: 'Profile', icon: 'person', path: '/dashboard/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[1000] bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 px-4 h-16 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = tab.path === '/dashboard' 
          ? (location.pathname === '/dashboard' || location.pathname === '/dashboard/')
          : location.pathname.startsWith(tab.path);

        return (
          <button 
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
              isActive ? 'text-primary scale-105' : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-primary font-bold' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
