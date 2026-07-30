import { ShaderCanvas } from '@features/01_auth';
import { TICKER_MESSAGES } from '../constants/onboardingConstants';

export default function StepAIPersonalization({
  statusText,
  progress,
  tickerIndex
}) {
  return (
    <div className="w-full flex flex-col items-center text-center space-y-6 pt-6 animate-in fade-in duration-300">
      
      {/* WebGL Pulsing Shader Orb */}
      <div className="relative w-48 h-48 mx-auto my-4">
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full overflow-hidden bg-black shadow-[0_0_45px_rgba(245,196,0,0.35)] flex items-center justify-center">
          <ShaderCanvas className="w-full h-full" />
        </div>
      </div>

      {/* Status Header */}
      <div className="h-16 flex items-center justify-center">
        <h1 className="text-lg font-bold text-white transition-opacity duration-300" aria-live="polite">
          {statusText}
        </h1>
      </div>

      {/* Progress Panel */}
      <div 
        className="w-full bg-surface-container-low p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl"
        role="progressbar"
        aria-valuenow={Math.floor(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-bold text-on-surface-variant/70 tracking-widest">NEURAL ARCHITECTING</span>
          <span className="font-data-lg text-lg text-primary font-bold">{Math.floor(progress)}%</span>
        </div>
        
        {/* Bar */}
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 progress-shimmer"></div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 text-[10px]">
          <div className="flex items-center gap-1.5 font-bold text-on-surface-variant/60">
            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
            Secured AI Encryption
          </div>
          <div className="animate-spin h-3.5 w-3.5 border-2 border-primary/20 border-t-primary rounded-full"></div>
        </div>
      </div>

      {/* Console data ticker */}
      <div className="h-6 overflow-hidden pt-2">
        <p className="font-data-sm text-[11px] text-primary/40 tracking-wider">
          {TICKER_MESSAGES[tickerIndex]}
        </p>
      </div>
    </div>
  );
}
