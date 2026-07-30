export default function DashboardHeader({ activeTab, nutritionSubView }) {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[1000] bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
          <span className="font-display-lg-mobile text-base font-bold text-primary tracking-tighter">FitAI X</span>
        </div>
        
        {activeTab === 'calories' && nutritionSubView === 'tracker' ? (
          <h1 className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary">
            AI Tracker
          </h1>
        ) : (
          <div></div>
        )}
        
        <button className="w-8 h-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface text-[22px]">notifications</span>
        </button>
      </div>
    </header>
  );
}
