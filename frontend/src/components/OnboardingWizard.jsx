import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlShaderCanvas from './GlShaderCanvas';

const tickerMessages = [
  "PARSING_USER_DATA_v2.0.4...",
  "MAPPING_METABOLIC_SYNERGY...",
  "CALIBRATING_INTENSITY_VECTORS...",
  "FETCHING_GENOMIC_PROFILES...",
  "ENCRYPTING_ELITE_DATASET..."
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Overview, 2: Personal Details, 3: Preferences, 4: Fitness Goals, 5: AI Personalization, 6: Final Protocol

  // Step 2: Personal Details state
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  // Step 3: Preferences state
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [frequency, setFrequency] = useState(3);
  const [location, setLocation] = useState('Gym');
  const [duration, setDuration] = useState(45);

  // Step 4: Fitness Goals state
  const [selectedGoal, setSelectedGoal] = useState('Lose Weight');

  // Step 5: AI Personalization loading state
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Analyzing Biometrics...');
  const [tickerIndex, setTickerIndex] = useState(0);

  // Step 5: Progress loop
  useEffect(() => {
    if (step !== 5) return;

    setProgress(0);
    setStatusText('Analyzing Biometrics...');

    // Progress increments
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          const increment = Math.random() * 2 + 0.5;
          const next = Math.min(prev + increment, 100);

          // Update status texts based on range
          if (next >= 75) {
            setStatusText('Syncing Neural Pathways...');
          } else if (next >= 40) {
            setStatusText('Predicting Hypertrophy Cycles...');
          } else if (next >= 15) {
            setStatusText('Calculating Metabolic Load...');
          }

          // Random ticker message updates
          if (Math.random() > 0.90) {
            setTickerIndex(Math.floor(Math.random() * tickerMessages.length));
          }

          return next;
        } else {
          clearInterval(progressInterval);
          // Proceed to success page
          const successTimeout = setTimeout(() => {
            setStep(6);
          }, 1000);
          return 100;
        }
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
    };
  }, [step]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-on-surface font-body-md flex items-center justify-center selection:bg-primary/30 relative overflow-hidden">
      
      {/* Mobile Simulator Viewport */}
      <div className="w-full max-w-md h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden border-x border-white/5 shadow-2xl">
        
        {/* Top App Bar (Only visible on input Steps 2, 3 & 4) */}
        {step >= 2 && step <= 4 && (
          <header className="absolute top-0 left-0 w-full z-50 pt-safe bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-md">
            <div className="h-14 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
                <span className="font-display-lg-mobile text-sm font-bold text-primary tracking-tighter">FitAI X</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-data-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Step {step - 1} of 3
                </div>
                <div className="w-16 h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Scrollable Wizard Canvas */}
        <main className={`flex-1 overflow-y-auto no-scrollbar flex flex-col px-6 ${step >= 2 && step <= 4 ? 'pt-16 pb-6' : 'py-6'}`}>
          
          {/* STEP 1: ONBOARDING OVERVIEW */}
          {step === 1 && (
            <div className="w-full flex flex-col space-y-6 pt-4 animate-in fade-in duration-300">
              <div className="text-center space-y-1">
                <h1 className="text-display-lg-mobile font-bold tracking-tight text-primary leading-tight">FitAI X</h1>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                  Experience the evolution of training. Your transformation is governed by precision and intelligence.
                </p>
              </div>

              {/* Vertical steps progress mapping */}
              <div className="bg-surface-container p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-8 bottom-8 left-[23px] w-[2px] bg-gradient-to-b from-primary via-primary/30 to-transparent"></div>
                
                <div className="space-y-6">
                  {/* Phase 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center relative z-10 flex-shrink-0 animate-pulse-gold">
                      <span className="material-symbols-outlined text-black text-xs font-bold">person</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-primary uppercase tracking-wider">Phase 01</p>
                      <h4 className="text-xs font-bold text-on-surface">Personal Details</h4>
                      <p className="text-[9px] text-on-surface-variant mt-0.5">Biometric baseline parameters.</p>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-xs">target</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Phase 02</p>
                      <h4 className="text-xs font-bold text-on-surface-variant">Fitness Goals</h4>
                      <p className="text-[9px] text-on-surface-variant/50 mt-0.5">Define core performance arc targets.</p>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-xs">fitness_center</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Phase 03</p>
                      <h4 className="text-xs font-bold text-on-surface-variant">Preferences</h4>
                      <p className="text-[9px] text-on-surface-variant/50 mt-0.5">Sync environment and frequency.</p>
                    </div>
                  </div>

                  {/* Phase 4 */}
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center relative z-10 flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-xs">psychology</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Phase 04</p>
                      <h4 className="text-xs font-bold text-on-surface-variant">AI Analysis</h4>
                      <p className="text-[9px] text-on-surface-variant/50 mt-0.5">Generate adaptive neural program.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI info card */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                  <h4 className="text-xs font-bold text-on-surface">FitAI Core Engine</h4>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Our proprietary neural net analyzes over 5,000 data parameters to construct a training regime that adapts to your physiology in real-time.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Biometric Sync', 'Predictive Recovery', 'Volume Tuning'].map(chip => (
                    <span key={chip} className="px-2 py-0.5 bg-black border border-white/5 rounded-full text-[8px] font-bold text-primary">{chip}</span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-full bg-primary text-black font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Your Transformation
                <span className="material-symbols-outlined text-black text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-on-surface">Personal Details</h2>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Help us calibrate your AI model by providing basic bio-metrics for precision tracking.
                </p>
              </div>

              {/* Bento Input Cards */}
              <div className="space-y-4">
                {/* Biological Gender */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Biological Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Male', 'Female'].map((gen) => {
                      const isActive = gender === gen;
                      let icon = gen === 'Male' ? 'male' : 'female';
                      return (
                        <button
                          key={gen}
                          type="button"
                          onClick={() => setGender(gen)}
                          className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-primary border-primary text-black font-bold' 
                              : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{icon}</span>
                          <span className="text-xs">{gen}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age & Weight Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 focus-within:border-primary transition-colors">
                    <label className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      Age
                    </label>
                    <div className="flex items-baseline gap-1 pt-1">
                      <input 
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="28"
                        className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">yrs</span>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 focus-within:border-primary transition-colors">
                    <label className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-xs">scale</span>
                      Weight
                    </label>
                    <div className="flex items-baseline gap-1 pt-1">
                      <input 
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="185"
                        className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">lbs</span>
                    </div>
                  </div>
                </div>

                {/* Height (col-span-2) */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">straighten</span>
                    Height
                  </label>
                  <div className="flex gap-4 pt-1">
                    <div className="flex items-baseline gap-1 flex-1 border-b border-white/10 pb-1 focus-within:border-primary transition-colors">
                      <input 
                        type="number"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        placeholder="6"
                        className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">ft</span>
                    </div>
                    <div className="flex items-baseline gap-1 flex-1 border-b border-white/10 pb-1 focus-within:border-primary transition-colors">
                      <input 
                        type="number"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        placeholder="1"
                        className="bg-transparent border-none p-0 focus:ring-0 w-full font-data-lg text-2xl text-primary placeholder:text-primary/20 focus:outline-none"
                      />
                      <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">in</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-full border border-white/10 text-on-surface hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!age || !weight || !heightFt}
                  className="flex-[2] py-4 rounded-full bg-primary text-black font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERENCES SCREEN */}
          {step === 3 && (
            <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-on-surface">Tailor Your Experience</h2>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Our AI uses these details to calibrate your initial performance baseline.
                </p>
              </div>

              {/* Preferences Cards */}
              <div className="space-y-4">
                {/* 1. Fitness Level */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">1. Current Fitness Level</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#0e0e0e] p-1 rounded-lg border border-white/5">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                      const isActive = fitnessLevel === lvl;
                      let subtitle = '0-1 yrs';
                      if (lvl === 'Intermediate') subtitle = '1-3 yrs';
                      if (lvl === 'Advanced') subtitle = '3+ yrs';

                      return (
                        <button
                          key={lvl}
                          onClick={() => setFitnessLevel(lvl)}
                          className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all cursor-pointer ${
                            isActive ? 'bg-primary text-black font-bold' : 'text-on-surface-variant hover:bg-white/5'
                          }`}
                        >
                          <span className="text-xs font-bold">{lvl}</span>
                          <span className="text-[8px] opacity-75">{subtitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Weekly Training Frequency */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">2. Weekly Training Frequency</label>
                  <div className="flex justify-between px-2">
                    {[2, 3, 4, 5, 6].map((num) => {
                      const isActive = frequency === num;
                      return (
                        <button
                          key={num}
                          onClick={() => setFrequency(num)}
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg transition-all cursor-pointer ${
                            isActive 
                              ? 'border-2 border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(245,196,0,0.2)]' 
                              : 'border-white/10 text-on-surface-variant hover:border-primary/50'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-center text-[9px] text-on-surface-variant font-medium">Days per week recommended for your baseline.</p>
                </div>

                {/* 3. Primary Training Location */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-3">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">3. Primary Training Location</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Home', 'Gym', 'Both'].map((loc) => {
                      const isActive = location === loc;
                      let icon = 'home';
                      if (loc === 'Gym') icon = 'fitness_center';
                      if (loc === 'Both') icon = 'dynamic_form';

                      return (
                        <button
                          key={loc}
                          onClick={() => setLocation(loc)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${
                            isActive 
                              ? 'border-2 border-primary bg-primary/10 text-primary' 
                              : 'border-white/10 text-on-surface-variant hover:border-primary/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{icon}</span>
                          <span className="text-xs font-bold">{loc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Session Duration Slider */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">4. Average Session Duration</label>
                    <span className="text-sm font-bold text-primary">
                      {duration} <span className="text-[10px] font-bold text-on-surface-variant uppercase">min</span>
                    </span>
                  </div>
                  <div className="px-2">
                    <input 
                      type="range"
                      min="15"
                      max="90"
                      step="5"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full cursor-pointer accent-primary bg-surface-container-high h-1 rounded-lg"
                    />
                    <div className="flex justify-between text-[8px] text-on-surface-variant/50 font-bold mt-1">
                      <span>15M</span>
                      <span>90M</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      <span className="text-primary font-bold">AI Insight:</span> {duration}-minute sessions are optimal to prevent cortisol spikes in {fitnessLevel.toLowerCase()} athletes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-full border border-white/10 text-on-surface hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="flex-[2] py-4 rounded-full bg-primary text-black font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 cursor-pointer active:scale-95 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: FITNESS GOALS SCREEN */}
          {step === 4 && (
            <div className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-on-surface">What is your primary focus?</h2>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  FitAI X will calibrate your nutrition and training algorithms based on this selection.
                </p>
              </div>

              {/* Bento Grid of Goals */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { title: 'Lose Weight', desc: 'Fat loss & metabolic health', icon: 'monitor_weight' },
                  { title: 'Gain Muscle', desc: 'Hypertrophy & muscle density', icon: 'fitness_center' },
                  { title: 'Build Strength', desc: 'Raw power & lifting PRs', icon: 'weight' },
                  { title: 'Improve Endurance', desc: 'Cardiovascular & stamina', icon: 'directions_run' },
                  { title: 'General Fitness', desc: 'Longevity & balanced health', icon: 'health_and_safety' },
                  { title: 'Athletic Performance', desc: 'Elite agility & sport skill', icon: 'rocket_launch' }
                ].map((item) => {
                  const isActive = selectedGoal === item.title;
                  return (
                    <button
                      key={item.title}
                      onClick={() => setSelectedGoal(item.title)}
                      className={`p-4 rounded-xl text-left flex items-center gap-4 border transition-all cursor-pointer active:scale-[0.98] ${
                        isActive 
                          ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(245,196,0,0.1)]' 
                          : 'border-white/5 bg-surface-container-low hover:border-primary/20'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full border border-white/5 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? 'text-primary' : 'text-on-surface-variant'
                      }`}>
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                        <p className="text-[10px] text-on-surface-variant/70 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2 border-t border-white/5">
                <button 
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 rounded-full border border-white/10 text-on-surface hover:bg-white/5 font-bold text-xs uppercase tracking-widest cursor-pointer active:scale-95 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(5)}
                  className="flex-[2] py-4 rounded-full bg-primary text-black font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 cursor-pointer active:scale-95 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: AI PERSONALIZATION (LOADING PROGRESS SHADER) */}
          {step === 5 && (
            <div className="w-full flex flex-col items-center text-center space-y-6 pt-6 animate-in fade-in duration-300">
              
              {/* WebGL Pulsing Shader Orb */}
              <div className="relative w-48 h-48 mx-auto my-4">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full overflow-hidden bg-black shadow-[0_0_45px_rgba(245,196,0,0.35)] flex items-center justify-center">
                  <GlShaderCanvas className="w-full h-full" />
                </div>
              </div>

              {/* Status Header */}
              <div className="h-16 flex items-center justify-center">
                <h1 className="text-lg font-bold text-white transition-opacity duration-300">
                  {statusText}
                </h1>
              </div>

              {/* Progress Panel */}
              <div className="w-full bg-surface-container-low p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
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
                  {tickerMessages[tickerIndex]}
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: PROTOCOL FINALIZED */}
          {step === 6 && (
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
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 rounded-full bg-primary text-black font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                Enter Dashboard
                <span className="material-symbols-outlined text-black text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          )}

        </main>

        {/* Footer Identity */}
        <footer className="py-6 px-6 text-center">
          <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.25em]">
            POWERED BY FITAI NEURAL CORE v4.0
          </p>
        </footer>

      </div>
    </div>
  );
}
