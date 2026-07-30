import { useLocation, useNavigate } from 'react-router-dom';

export default function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSubPage = location.pathname.includes('/meal-ai') || location.pathname.includes('/workout/');

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[1000] bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSubPage ? (
            <button
              onClick={() => navigate(-1)}
              className="text-on-surface-variant hover:text-white p-1 cursor-pointer transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              fitness_center
            </span>
          )}
          <span className="font-display-lg-mobile text-base font-bold text-primary tracking-tighter">FitAI X</span>
        </div>

        <button className="w-8 h-8 flex items-center justify-center cursor-pointer hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-on-surface text-[22px]">notifications</span>
        </button>
      </div>
    </header>
  );
}
