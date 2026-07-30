export default function DashboardHeader({ activeTab, nutritionSubView }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="h-14 px-6 flex items-center justify-between">
        {activeTab === 'home' ? (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
            <span className="font-display-lg-mobile text-base font-bold text-primary tracking-tighter">FitAI X</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-[18px]">person</span>
          </div>
        )}
        
        <h1 className="font-label-caps text-label-caps uppercase tracking-[0.2em] text-primary">
          {activeTab === 'calories' && nutritionSubView === 'tracker' ? 'AI Tracker' : 'FitAI X'}
        </h1>
        
        <button className="w-8 h-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface text-[22px]">notifications</span>
        </button>
      </div>
    </header>
  );
}
