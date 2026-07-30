export default function StepFinalProtocol({ onFinish }) {
  return (
    <div className="w-full flex flex-col items-center text-center space-y-6 pt-8 animate-in fade-in duration-300">
      {/* Check Circle Icon */}
      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(245,196,0,0.25)] relative my-4">
        <span className="material-symbols-outlined text-[54px] font-black">check_circle</span>
      </div>

      {/* Protocol Title & Subtitle */}
      <div className="space-y-3">
        <h1 className="text-display-lg-mobile font-bold tracking-tight text-white leading-tight">
          Protocol Finalized
        </h1>
        <p className="text-sm text-on-surface-variant/80 max-w-xs mx-auto leading-relaxed">
          Your hyper-personalized training environment is ready. Welcome to the elite tier.
        </p>
      </div>

      {/* Access details */}
      <div className="w-full max-w-xs bg-surface-container p-4 rounded-xl border border-white/5 flex items-center justify-between mt-4">
        <div className="text-left">
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">ACCESS LEVEL</p>
          <p className="text-sm font-data-lg text-primary font-bold">DIAMOND</p>
        </div>
        <div className="w-px h-8 bg-white/10"></div>
        <div className="text-right">
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">EXPIRY</p>
          <p className="text-sm font-data-lg text-primary font-bold">PERPETUAL</p>
        </div>
      </div>

      {/* Enter Dashboard Button */}
      <button 
        onClick={onFinish}
        className="w-full py-4 rounded-full bg-primary text-black font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
      >
        Enter Dashboard
        <span className="material-symbols-outlined text-black text-sm font-bold">arrow_forward</span>
      </button>
    </div>
  );
}
