import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom hook to animate numeric count-ups
function useCountUp(target, duration = 1200, decimals = 0, trigger = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * target;
      setValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration, trigger]);

  if (decimals === 0) {
    return Math.floor(value).toLocaleString();
  }
  return value.toFixed(decimals);
}

export default function FitXAIDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState(false);
  
  // Workout generator state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  
  // AI Coach state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: 'Hey Rahul! Ready to crush your goals today? Let me know if you want me to generate a personalized routine or review your stats.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Nutrition state
  const [nutritionSubView, setNutritionSubView] = useState('dashboard'); // 'dashboard' or 'tracker'
  const [currentCalories, setCurrentCalories] = useState(2450);
  const [currentProtein, setCurrentProtein] = useState(165);
  const [currentCarbs, setCurrentCarbs] = useState(210);
  const [currentFat, setCurrentFat] = useState(65);
  
  const [mealInput, setMealInput] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [isAnalyzingMeal, setIsAnalyzingMeal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [loggedMeals, setLoggedMeals] = useState([
    {
      title: 'Morning Breakfast',
      time: '08:30 AM',
      calories: 620,
      protein: 42,
      carbs: 50,
      fat: 20,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnh4DqrxFwUMZsd71CGOL7JOozK_oaDbMcZgpyD6zLI_2U4EGZQDIlMtuZwGZYgrsaWXDSj8hC6-vD8JiGdiPpPo2oLCmNXPWtPLQNYMCcCQoXFs3QDFD9xVIg_gfT7zIOtmNbKaqbEBiP5DF4e9EK3u3kqbAQYNVNexcXMCI9o29bkhvJxyG8nKXyyoJldzUDrUFGGcWIhDrQyDrqNAcv-nFNwXJstzzSEGkuqVCdUrn7ZqaEOH1v'
    },
    {
      title: 'Afternoon Lunch',
      time: '12:30 PM',
      calories: 850,
      protein: 65,
      carbs: 80,
      fat: 30,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMyjPpj_U5Xf8s6PeT7Qn750PgQTEvXvUBd4SF2aIOFTuYkRrOwo5tyABnzfGS_c9CjiQsiBjcQtvSBY7Tkc0Vsq_Cd9qv2ecBmPsxjFgL_tUzbNk2zlBQVtz5UOMpCw3oQGrp3bU8t6f-q8v5HFmXBb0Zp7mE-wMOB-b6ef6w81NbaqksdwyXlpdO6dEkLiemfuQrppNqph3CCoEx_S1D4PFPpkViwCWFhx8cNwoSY4hdcc3NyTei'
    },
    {
      title: 'Night Dinner',
      time: '08:00 PM',
      calories: 980,
      protein: 58,
      carbs: 80,
      fat: 28,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARhKQxBGElXZhkjqNxXsbLzQmpXNHVdbfoUa50tL1eYuEv9WqiQl5TY3dPCmRaypwTNSYOdNAOaZWj7veitfk7jjSqWOooRmGjoDDM8buPVXvOoOUJglYggMZ_0YOAMmBBChBQhlP5P7QqeeNAK3IQxDQ2XqF-O_VRmAAkXyfogkkvn2pUzClizUld8AThJxoVCANkDj7oUsD3b4CF22Veg0Zdvu9xhOTq2V172gwfdUf-Hra4jWN8'
    }
  ]);

  // Profile specific states
  const [selectedGoals, setSelectedGoals] = useState(['Muscle Gain', 'Strength Training']);
  const [aiPreferences, setAiPreferences] = useState({
    workoutGen: true,
    nutritionInsights: true,
    recoveryAnalysis: false
  });
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [logoutState, setLogoutState] = useState('idle'); // 'idle' | 'securing' | 'closed'

  // Main Dashboard Circular progress offsets (circumference = 213.628)
  const [muscleOffset, setMuscleOffset] = useState(213.628);
  const [fatOffset, setFatOffset] = useState(213.628);
  const [fitnessOffset, setFitnessOffset] = useState(175.9);

  useEffect(() => {
    if (activeTab === 'home') {
      const timer = setTimeout(() => {
        setMuscleOffset(213.628 - (72 / 100) * 213.628);
        setFatOffset(213.628 - (48 / 100) * 213.628);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setMuscleOffset(213.628);
      setFatOffset(213.628);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'profile') {
      const timer = setTimeout(() => {
        setFitnessOffset(175.9 - (88 / 100) * 175.9);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setFitnessOffset(175.9);
    }
  }, [activeTab]);

  // Animate values
  const heartRate = useCountUp(78, 1000);
  const steps = useCountUp(8425, 1200);
  const energy = useCountUp(2450, 1200);
  const hydration = useCountUp(1.8, 1200, 1);
  const activeBurn = useCountUp(480, 1000);

  // Profile Animated stats
  const profileWeight = useCountUp(60, 800, 0, activeTab === 'profile');
  const profileFitnessScore = useCountUp(88, 1000, 0, activeTab === 'profile');

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setGeneratedPlan({
        title: 'Hypertrophy Push A',
        duration: '45 mins',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: '4x8-10 reps', rpe: 'RPE 8.5' },
          { name: 'Overhead Barbell Press', sets: '3x6-8 reps', rpe: 'RPE 8' },
          { name: 'Weighted Chest Dips', sets: '3x10 reps', rpe: 'RPE 9' },
          { name: 'Cable Lateral Raises', sets: '4x12-15 reps', rpe: 'RPE 9' },
          { name: 'Triceps Overhead Extensions', sets: '3x10-12 reps', rpe: 'RPE 8.5' }
        ]
      });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');

    // Simulate AI coach response
    setTimeout(() => {
      let responseText = "That sounds great! Keep pushing hard and let me know if you need any adjustments.";
      if (userMsg.toLowerCase().includes('plan') || userMsg.toLowerCase().includes('workout')) {
        responseText = "I highly recommend starting with the 'Hypertrophy Push A' routine today to build upper chest volume. Should I lock that in for you?";
      } else if (userMsg.toLowerCase().includes('sore') || userMsg.toLowerCase().includes('pain')) {
        responseText = "Understood. Make sure to prioritize hydration and active mobility today. We can scale down the intensity or focus on recovery metrics.";
      } else if (userMsg.toLowerCase().includes('water') || userMsg.toLowerCase().includes('hydrate')) {
        responseText = "Excellent. Shoot for another 500ml before your workout. It will help optimize cellular volume and muscle pumps!";
      }

      setChatMessages((prev) => [...prev, { sender: 'coach', text: responseText }]);
    }, 1000);
  };

  // AI Meal Analysis simulation
  const handleAnalyzeMeal = () => {
    if (!mealInput.trim()) return;
    setIsAnalyzingMeal(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzingMeal(false);
      // Simulate calories & macros based on text
      let cals = 350;
      let p = 12;
      let c = 40;
      let f = 8;
      let fib = 2;

      const lowerInput = mealInput.toLowerCase();
      if (lowerInput.includes('chicken') || lowerInput.includes('egg') || lowerInput.includes('meat') || lowerInput.includes('fish')) {
        cals = 540;
        p = 45;
        c = 15;
        f = 14;
      } else if (lowerInput.includes('rice') || lowerInput.includes('roti') || lowerInput.includes('chapati') || lowerInput.includes('bread')) {
        cals = 480;
        p = 8;
        c = 85;
        f = 4;
      } else if (lowerInput.includes('shake') || lowerInput.includes('whey') || lowerInput.includes('protein')) {
        cals = 220;
        p = 30;
        c = 6;
        f = 3;
      } else if (lowerInput.includes('salad') || lowerInput.includes('vegetable') || lowerInput.includes('fruit')) {
        cals = 180;
        p = 4;
        c = 28;
        f = 2;
        fib = 8;
      }

      setAnalysisResult({
        calories: cals,
        protein: p,
        carbs: c,
        fat: f,
        fiber: fib,
        description: mealInput
      });
    }, 1500);
  };

  // Add analyzed meal to logs
  const handleAddMealToLog = () => {
    if (!analysisResult) return;

    const newMeal = {
      title: `Logged ${mealType}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnh4DqrxFwUMZsd71CGOL7JOozK_oaDbMcZgpyD6zLI_2U4EGZQDIlMtuZwGZYgrsaWXDSj8hC6-vD8JiGdiPpPo2oLCmNXPWtPLQNYMCcCQoXFs3QDFD9xVIg_gfT7zIOtmNbKaqbEBiP5DF4e9EK3u3kqbAQYNVNexcXMCI9o29bkhvJxyG8nKXyyoJldzUDrUFGGcWIhDrQyDrqNAcv-nFNwXJstzzSEGkuqVCdUrn7ZqaEOH1v'
    };

    setLoggedMeals((prev) => [newMeal, ...prev]);
    setCurrentCalories((prev) => prev + analysisResult.calories);
    setCurrentProtein((prev) => prev + analysisResult.protein);
    setCurrentCarbs((prev) => prev + analysisResult.carbs);
    setCurrentFat((prev) => prev + analysisResult.fat);

    // Reset input states and go back to dashboard
    setMealInput('');
    setAnalysisResult(null);
    setNutritionSubView('dashboard');
  };

  // Toggle active goals
  const handleToggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(prev => prev.filter(g => g !== goal));
    } else {
      setSelectedGoals(prev => [...prev, goal]);
    }
  };

  // Toggle AI switch
  const handleToggleAiPreference = (key) => {
    setAiPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Secure Logout simulation
  const handleSecureLogout = () => {
    console.log('Logout clicked! State:', logoutState);
    setLogoutState('securing');
    setTimeout(() => {
      setLogoutState('closed');
      setTimeout(() => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
        setLogoutState('idle');
      }, 1000);
    }, 1500);
  };

  // Calorie progress ring calculation (circumference = 691.15)
  const limitCalories = 2800;
  const calPercent = Math.min(currentCalories / limitCalories, 1);
  const nutritionRingOffset = 691.15 * (1 - calPercent);

  // Dynamic progress percentages
  const proteinPct = Math.min((currentProtein / 180) * 100, 100);
  const carbsPct = Math.min((currentCarbs / 250) * 100, 100);
  const fatPct = Math.min((currentFat / 80) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-on-surface font-body-md flex items-center justify-center selection:bg-primary/30">
      {/* Mobile Simulator Viewport */}
      <div className="w-full max-w-md h-screen bg-background flex flex-col relative overflow-hidden border-x border-white/5 shadow-2xl">
        
        {/* Header (Fits standard layout or adjusts based on subview) */}
        <header className="absolute top-0 left-0 w-full z-50 pt-safe bg-background/80 backdrop-blur-xl border-b border-white/5">
          <div className="h-14 px-6 flex items-center justify-between">
            {activeTab === 'calories' && nutritionSubView === 'tracker' ? (
              <button 
                onClick={() => { setNutritionSubView('dashboard'); setAnalysisResult(null); setMealInput(''); }}
                className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
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

        {/* Scrollable Main Content */}
        <main className="flex-1 pt-14 pb-20 overflow-y-auto no-scrollbar">
          
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'home' && (
            <div className="flex flex-col w-full px-6 space-y-6 pt-6 animate-in fade-in duration-300">
              {/* Welcome Header */}
              <section className="flex justify-between items-end">
                <div className="space-y-1">
                  <h1 className="text-display-lg-mobile font-bold tracking-tight text-on-surface">
                    Welcome Back, <span className="text-primary">Rahul 👋</span>
                  </h1>
                  <p className="text-on-surface-variant font-medium">14:32 • Tuesday, May 14</p>
                </div>
                <div className="bg-surface-container px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Sync</span>
                </div>
              </section>

              {/* AI Readiness Hero / Active Workout Plan */}
              <section className="relative overflow-hidden p-8 rounded-[32px] bg-gradient-to-br from-surface-container to-surface-container-low border border-primary/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                  {!generatedPlan ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center border border-primary/10 shadow-inner">
                        <span className={`material-symbols-outlined text-primary text-4xl ${isGeneratingPlan ? 'animate-spin' : ''}`}>
                          {isGeneratingPlan ? 'autorenew' : 'calendar_today'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Workout Status</p>
                        <h2 className="text-display-lg-mobile font-bold text-on-surface">
                          {isGeneratingPlan ? 'Analyzing Stats...' : 'No Active Plan'}
                        </h2>
                        <p className="text-sm text-on-surface-variant leading-relaxed max-w-[280px] mx-auto">
                          {isGeneratingPlan 
                            ? 'Synthesizing metabolic rate, sleep patterns, and progressive overload history...' 
                            : "Your personalized training journey hasn't started yet. Let's build your first routine."}
                        </p>
                      </div>
                      <button 
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan}
                        className="w-full py-4 rounded-xl cta-gradient text-black font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingPlan ? 'Generating...' : 'Generate Your First AI Plan'}
                      </button>
                    </>
                  ) : (
                    <div className="w-full space-y-4 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Active Plan Locked</p>
                          <h3 className="text-xl font-bold text-on-surface">{generatedPlan.title}</h3>
                        </div>
                        <span className="text-xs bg-primary/20 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-bold">
                          {generatedPlan.duration}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {generatedPlan.exercises.map((ex, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 text-xs">
                            <div>
                              <span className="text-primary font-bold mr-2">{idx + 1}</span>
                              <span className="text-on-surface font-medium">{ex.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">{ex.sets}</p>
                              <p className="text-[9px] text-primary uppercase font-bold">{ex.rpe}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setGeneratedPlan(null)}
                        className="w-full py-3 mt-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface-variant hover:text-white font-bold text-xs tracking-widest uppercase transition-all active:scale-95 cursor-pointer"
                      >
                        Reset & Recalculate
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Live Statistics Grid */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center relative flex-shrink-0">
                    <span className="material-symbols-outlined text-error text-xl">favorite</span>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-background animate-live"></span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Heart Rate</p>
                    <p className="font-data-lg text-lg text-white">
                      {heartRate} <span className="text-xs text-on-surface-variant">BPM</span>
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">footprint</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Steps</p>
                    <p className="font-data-lg text-lg text-white">{steps}</p>
                  </div>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Energy</p>
                    <p className="font-data-lg text-lg text-white">
                      {energy} <span className="text-xs text-on-surface-variant">KCAL</span>
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-xl">water_drop</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hydration</p>
                    <p className="font-data-lg text-lg text-white">
                      {hydration} <span className="text-xs text-on-surface-variant">L</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Goal Progress */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-label-caps text-on-surface-variant font-bold">Core Objectives</h4>
                  <span className="text-[10px] font-bold text-primary underline cursor-pointer hover:text-white transition-colors">EDIT GOALS</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-6 rounded-[24px] border border-white/5 space-y-4 flex flex-col items-center">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-container-low" cx="40" cy="40" fill="none" r="34" stroke="currentColor" strokeWidth="4"></circle>
                        <circle 
                          className="text-primary chart-path" 
                          cx="40" 
                          cy="40" 
                          fill="none" 
                          r="34" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          style={{ strokeDashoffset: muscleOffset }}
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-on-surface">72%</span>
                      </div>
                    </div>
                    <div className="text-center text-on-surface">
                      <p className="font-bold text-sm">Build Muscle</p>
                      <p className="text-[10px] text-green-400 font-bold uppercase mt-1">ON TRACK</p>
                      <p className="text-[9px] text-on-surface-variant mt-2">Expected: 12 Aug</p>
                    </div>
                  </div>

                  <div className="bg-surface-container p-6 rounded-[24px] border border-white/5 space-y-4 flex flex-col items-center">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90">
                        <circle className="text-surface-container-low" cx="40" cy="40" fill="none" r="34" stroke="currentColor" strokeWidth="4"></circle>
                        <circle 
                          className="text-secondary chart-path" 
                          cx="40" 
                          cy="40" 
                          fill="none" 
                          r="34" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          style={{ strokeDashoffset: fatOffset }}
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-on-surface">48%</span>
                      </div>
                    </div>
                    <div className="text-center text-on-surface">
                      <p className="font-bold text-sm">Lose Fat</p>
                      <p className="text-[10px] text-primary font-bold uppercase mt-1">ACCELERATING</p>
                      <p className="text-[9px] text-on-surface-variant mt-2">Expected: 28 Jul</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Weekly Streak */}
              <section className="bg-surface-container rounded-3xl p-6 space-y-6 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flicker-flame flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
                    </div>
                    <div>
                      <p className="font-data-lg text-2xl text-primary">14 Days</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">+240 XP</p>
                    <p className="text-[10px] text-on-surface-variant italic">Next: Bronze III</p>
                  </div>
                </div>
                <div className="flex justify-between items-center px-1">
                  {['M', 'T', 'W'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-on-surface-variant">{day}</span>
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(245,196,0,0.4)]">
                        <span className="material-symbols-outlined text-black text-sm font-bold">check</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-primary">T</span>
                    <div className="w-9 h-9 rounded-full border-2 border-primary ring-4 ring-primary/10 pulse-ring relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  {['F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 opacity-30">
                      <span className="text-[10px] font-bold text-on-surface-variant">{day}</span>
                      <div className="w-9 h-9 rounded-full border border-white/10"></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements */}
              <section className="space-y-4">
                <h4 className="text-label-caps text-on-surface-variant px-1 font-bold">Trophies & Milestones</h4>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                  <div className="flex-none w-32 aspect-square rounded-[32px] bg-surface-container border border-primary/20 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ai-glow">
                      <span className="material-symbols-outlined text-primary text-3xl">military_tech</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-tighter leading-tight text-on-surface-variant">14 Day System Lock</p>
                  </div>
                  <div className="flex-none w-32 aspect-square rounded-[32px] bg-surface-container border border-white/5 flex flex-col items-center justify-center gap-2 p-4 text-center grayscale opacity-50">
                    <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-3xl">cycle</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-tighter leading-tight text-on-surface-variant">100 Session Prime</p>
                  </div>
                  <div className="flex-none w-32 aspect-square rounded-[32px] bg-surface-container border border-white/5 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-3xl">rocket_launch</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-tighter leading-tight text-on-surface-variant">Hyper Focus Mode</p>
                  </div>
                </div>
              </section>

              {/* Community Challenges */}
              <section className="bg-surface-container rounded-[32px] p-8 border border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="material-symbols-outlined text-[80px] text-primary">groups</span>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    <h4 className="text-label-caps text-on-surface font-bold">Global Challenge</h4>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-primary">May Sprint: 50k Steps</h3>
                    <p className="text-xs text-on-surface-variant">
                      {hasJoinedChallenge ? 'You are competing! 18,403 athletes active.' : 'Join 18,402 other athletes today.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <img
                        alt="avatar"
                        className="w-6 h-6 rounded-full border border-background"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnh4DqrxFwUMZsd71CGOL7JOozK_oaDbMcZgpyD6zLI_2U4EGZQDIlMtuZwGZYgrsaWXDSj8hC6-vD8JiGdiPpPo2oLCmNXPWtPLQNYMCcCQoXFs3QDFD9xVIg_gfT7zIOtmNbKaqbEBiP5DF4e9EK3u3kqbAQYNVNexcXMCI9o29bkhvJxyG8nKXyyoJldzUDrUFGGcWIhDrQyDrqNAcv-nFNwXJstzzSEGkuqVCdUrn7ZqaEOH1v"
                      />
                      <div className="w-6 h-6 rounded-full border border-background bg-surface-container-low flex items-center justify-center text-[8px] font-bold text-primary">
                        +18k
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-primary">500 XP REWARD</span>
                      <button 
                        onClick={() => setHasJoinedChallenge(prev => !prev)}
                        className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer ${
                          hasJoinedChallenge 
                            ? 'bg-primary/20 text-primary border border-primary/30' 
                            : 'bg-white text-black'
                        }`}
                      >
                        {hasJoinedChallenge ? 'Joined ✓' : 'Join Unit'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: CALORIES / NUTRITION SECTION */}
          {activeTab === 'calories' && (
            <div className="animate-in fade-in duration-300">
              
              {/* SUBVIEW A: DAILY NUTRITION DASHBOARD */}
              {nutritionSubView === 'dashboard' && (
                <div className="flex flex-col w-full space-y-6 pt-4">
                  {/* Title Header */}
                  <div className="px-6 flex flex-col gap-1">
                    <span className="text-label-caps text-primary uppercase tracking-[0.2em] font-bold">Daily Summary</span>
                    <div className="flex items-center justify-between">
                      <h2 className="text-headline-md text-on-surface">Today, Oct 24</h2>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full">
                        <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                        <span className="text-[9px] font-label-caps text-on-surface-variant font-bold">AI SYNCED</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Progress Ring */}
                  <div className="relative flex items-center justify-center py-6">
                    <svg className="w-56 h-56 transform -rotate-90">
                      <circle class="text-surface-container-high" cx="112" cy="112" fill="transparent" r="96" stroke="currentColor" strokeWidth="8"></circle>
                      <circle 
                        className="drop-shadow-[0_0_12px_rgba(245,196,0,0.3)] transition-all duration-1000" 
                        cx="112" 
                        cy="112" 
                        fill="transparent" 
                        r="96" 
                        stroke="#F5C400" 
                        strokeDasharray="603" 
                        style={{ strokeDashoffset: 603 * (1 - Math.min(currentCalories / 2800, 1)) }}
                        strokeLinecap="round" 
                        strokeWidth="12"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-data-lg text-[28px] text-primary">{currentCalories.toLocaleString()}</span>
                      <span className="font-label-caps text-on-surface-variant text-[11px] -mt-1 font-bold">/ 2,800 KCAL</span>
                      <button 
                        onClick={() => setNutritionSubView('tracker')}
                        className="mt-4 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full font-bold text-xs text-primary transition-colors cursor-pointer"
                      >
                        {currentCalories < 2800 ? `${2800 - currentCalories} kcal left` : 'Goal Met! Log More'}
                      </button>
                    </div>
                  </div>

                  {/* Macro Breakdown */}
                  <div className="px-6 grid grid-cols-1 gap-4">
                    {/* Protein */}
                    <div className="bg-surface-container p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">PROTEIN</span>
                        <span className="font-data-sm text-[12px] text-on-surface">
                          <span className="text-primary font-bold">{currentProtein}g</span> / 180g
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${proteinPct}%` }}></div>
                      </div>
                    </div>
                    {/* Carbs */}
                    <div className="bg-surface-container p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">CARBS</span>
                        <span className="font-data-sm text-[12px] text-on-surface">
                          <span className="text-primary font-bold">{currentCarbs}g</span> / 250g
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${carbsPct}%` }}></div>
                      </div>
                    </div>
                    {/* Fat */}
                    <div className="bg-surface-container p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">FAT</span>
                        <span className="font-data-sm text-[12px] text-on-surface">
                          <span className="text-primary font-bold">{currentFat}g</span> / 80g
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container-lowest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${fatPct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Timeline */}
                  <div className="px-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-label-caps text-on-surface-variant tracking-widest uppercase font-bold">Meal Log</h3>
                      <button 
                        onClick={() => setNutritionSubView('tracker')}
                        className="text-[10px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                        ADD MEAL
                      </button>
                    </div>

                    <div className="space-y-3">
                      {loggedMeals.map((meal, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-surface-container p-4 rounded-xl border border-white/5">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-bright flex-shrink-0">
                            <img alt={meal.title} className="w-full h-full object-cover" src={meal.img} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-on-surface truncate">{meal.title}</h4>
                              <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                            <div className="flex gap-3 mt-1 text-xs">
                              <span className="font-data-sm text-primary">{meal.calories} kcal</span>
                              <span className="font-data-sm text-on-surface-variant">P: {meal.protein}g / C: {meal.carbs}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW B: AI MEAL CALORIE TRACKER */}
              {nutritionSubView === 'tracker' && (
                <div className="flex flex-col w-full space-y-6 pt-4 px-6">
                  {/* Header title */}
                  <header className="flex flex-col gap-1">
                    <h2 className="text-display-lg-mobile font-bold text-on-surface">AI Meal Tracker</h2>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Type what you ate, and AI will instantly calculate your nutrition metrics.
                    </p>
                  </header>

                  {/* Meal Input Section */}
                  <section className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-container/20 to-transparent blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative bg-surface-container-low rounded-[24px] p-4 flex flex-col gap-4 border border-white/5 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <textarea 
                        value={mealInput}
                        onChange={(e) => setMealInput(e.target.value)}
                        className="w-full bg-surface-container-lowest border-none rounded-xl p-4 font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary-container transition-all resize-none h-32 focus:outline-none" 
                        placeholder="Example: 2 chapatis, 1 bowl dal, grilled chicken..."
                      ></textarea>
                      <div className="flex gap-3">
                        <div className="flex-1 bg-surface-container-highest/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">restaurant_menu</span>
                          <select 
                            value={mealType} 
                            onChange={(e) => setMealType(e.target.value)}
                            className="bg-transparent border-none text-on-surface font-label-caps text-[10px] uppercase tracking-wider w-full focus:ring-0 focus:outline-none cursor-pointer"
                          >
                            <option className="bg-surface-container-high text-on-surface" value="Breakfast">Breakfast</option>
                            <option className="bg-surface-container-high text-on-surface" value="Lunch">Lunch</option>
                            <option className="bg-surface-container-high text-on-surface" value="Dinner">Dinner</option>
                            <option className="bg-surface-container-high text-on-surface" value="Snack">Snack</option>
                          </select>
                        </div>
                        <div className="flex-1 bg-surface-container-highest/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-primary-container">schedule</span>
                          <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface">12:30 PM</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleAnalyzeMeal}
                        disabled={isAnalyzingMeal || !mealInput.trim()}
                        className="w-full bg-primary hover:bg-primary-fixed-dim text-black font-bold text-xs tracking-widest uppercase py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary-container/10 cursor-pointer disabled:opacity-50"
                      >
                        <span className={`material-symbols-outlined text-[20px] ${isAnalyzingMeal ? 'animate-spin' : ''}`}>
                          {isAnalyzingMeal ? 'autorenew' : 'temp_preferences_custom'}
                        </span>
                        {isAnalyzingMeal ? 'ANALYZING...' : 'ANALYZE MEAL'}
                      </button>
                    </div>
                  </section>

                  {/* Results Section */}
                  {analysisResult && (
                    <section className="flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-end justify-between border-b border-white/5 pb-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Analysis Result</span>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-data-lg text-[40px] leading-none text-on-surface">{analysisResult.calories}</span>
                            <span className="text-xs text-on-surface-variant font-bold uppercase">kcal</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-surface-container flex items-center justify-center ring-1 ring-white/10">
                          <span className="material-symbols-outlined text-primary">verified</span>
                        </div>
                      </div>
                      
                      {/* Macros Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">egg_alt</span>
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Protein</span>
                          </div>
                          <span className="font-data-lg text-lg text-on-surface">{analysisResult.protein}g</span>
                        </div>
                        <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">bakery_dining</span>
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Carbs</span>
                          </div>
                          <span className="font-data-lg text-lg text-on-surface">{analysisResult.carbs}g</span>
                        </div>
                        <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">nutrition</span>
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fat</span>
                          </div>
                          <span className="font-data-lg text-lg text-on-surface">{analysisResult.fat}g</span>
                        </div>
                        <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1 border border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
                            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Fiber</span>
                          </div>
                          <span className="font-data-lg text-lg text-on-surface">{analysisResult.fiber}g</span>
                        </div>
                      </div>

                      {/* Log Action Button */}
                      <button
                        onClick={handleAddMealToLog}
                        className="w-full bg-white text-black font-bold text-xs tracking-widest uppercase py-3.5 mt-2 rounded-full transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_task</span>
                        LOG MEAL INTO DIET
                      </button>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORKOUT / TRAINING PLACEHOLDER */}
          {activeTab === 'workout' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
              </div>
              <h2 className="text-xl font-bold">Training Program</h2>
              <p className="text-xs text-on-surface-variant max-w-[240px]">
                Your AI Coach is tracking your volume load. Lock in a daily routine from the home tab to start recording sets.
              </p>
            </div>
          )}
          
          {/* TAB 4: RECORDS PLACEHOLDER */}
          {activeTab === 'records' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
              </div>
              <h2 className="text-xl font-bold">Analytics & Records</h2>
              <p className="text-xs text-on-surface-variant max-w-[240px]">
                Bio-metric analytics and progressive overload trends will render here once training sessions are completed.
              </p>
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS (NEW HIGH-FIDELITY IMPLEMENTATION) */}
          {activeTab === 'profile' && (
            <div className="flex flex-col w-full px-6 space-y-6 pt-6 pb-12 animate-in fade-in duration-300">
              
              {/* Profile Card Header */}
              <div className="relative flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-transparent rounded-full blur-sm opacity-30"></div>
                  <div className="w-32 h-32 rounded-full border-2 border-primary/20 p-1 relative z-10 overflow-hidden">
                    <img 
                      alt="Profile photo" 
                      className="w-full h-full rounded-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida/AP1WRLubYPreEN0Np5ILc_IMMyRXfNLTk83c_N7ubh1OmxU40fjj5uzEqMhvS_FJeH12te_nJk6hBTyALAuAZ9m3clSVK8b4vsc1GTlVjwc-LSpiLJtySsFGi8_al4HBgIrSkAF3STFCGfHs9p2YrTFIT7eCq1ihLieRktwCfcPbQU_8xa_PBUbDCMXBz8RjG9NABss6s9pLES-zyu07NX6tfeH7NYvoWRqHhsON22O0451rIWHrYPzIlHixKuw"
                    />
                    <div className="absolute bottom-1 right-1 bg-primary text-black rounded-full p-1 shadow-lg flex items-center justify-center border-2 border-black">
                      <span className="material-symbols-outlined text-[14px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-display-lg-mobile font-bold text-on-surface">Priyanshi Sharma</h2>
                  <p className="text-xs text-on-surface-variant font-semibold">@priyanshi_fit</p>
                </div>
                <div className="flex items-center mt-4">
                  <div className="px-4 py-1 bg-surface-container rounded-full border border-primary/20">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Intermediate</span>
                  </div>
                </div>
                <button className="mt-6 px-6 py-2.5 bg-surface-container-high text-on-surface rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-bright transition-colors border border-white/5 cursor-pointer active:scale-95">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Height</span>
                  <span className="font-data-lg text-lg text-primary">165<span className="text-xs ml-0.5 text-on-surface-variant font-semibold">cm</span></span>
                </div>
                <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Weight</span>
                  <span className="font-data-lg text-lg text-primary">{profileWeight}<span className="text-xs ml-0.5 text-on-surface-variant font-semibold">kg</span></span>
                </div>
                <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Age</span>
                  <span className="font-data-lg text-lg text-white">24</span>
                </div>
                <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">BMI</span>
                  <span className="font-data-lg text-lg text-white">22.0</span>
                </div>
                
                {/* Fitness Score Card */}
                <div className="col-span-2 bg-surface-container rounded-xl p-5 flex items-center justify-between border border-primary/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Fitness Score</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-data-lg text-2xl text-primary">{profileFitnessScore}</span>
                      <span className="font-data-sm text-xs text-on-surface-variant">/ 100</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 relative z-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-surface-bright" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4"></circle>
                      <circle 
                        className="text-primary transition-all duration-1000" 
                        cx="28" 
                        cy="28" 
                        fill="transparent" 
                        r="24" 
                        stroke="currentColor" 
                        strokeDasharray="150.8" 
                        style={{ strokeDashoffset: fitnessOffset }}
                        strokeLinecap="round" 
                        strokeWidth="4"
                      ></circle>
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                </div>
              </div>

              {/* Active Goals */}
              <section className="space-y-3">
                <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">Active Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {['Muscle Gain', 'Strength Training', 'Weight Loss', 'Fat Loss', 'Endurance'].map((goal) => {
                    const isActive = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => handleToggleGoal(goal)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer active:scale-95 ${
                          isActive 
                            ? 'bg-primary text-black border-primary' 
                            : 'bg-surface-container text-on-surface-variant border-white/5 hover:text-white'
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* AI Preferences */}
              <section className="space-y-3">
                <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">AI Preferences</h3>
                <div className="space-y-3">
                  <div 
                    onClick={() => handleToggleAiPreference('workoutGen')}
                    className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-white/5 cursor-pointer active:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">AI Workout Generation</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">Real-time progressive load adjustments</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 ${
                      aiPreferences.workoutGen ? 'bg-primary' : 'bg-surface-bright'
                    }`}>
                      <div className={`w-4 h-4 rounded-full shadow transition-transform duration-200 ${
                        aiPreferences.workoutGen ? 'translate-x-6 bg-black' : 'translate-x-0 bg-on-surface-variant'
                      }`}></div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleToggleAiPreference('nutritionInsights')}
                    className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-white/5 cursor-pointer active:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">Nutrition Insights</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">Smart macronutrient profile balancing</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 ${
                      aiPreferences.nutritionInsights ? 'bg-primary' : 'bg-surface-bright'
                    }`}>
                      <div className={`w-4 h-4 rounded-full shadow transition-transform duration-200 ${
                        aiPreferences.nutritionInsights ? 'translate-x-6 bg-black' : 'translate-x-0 bg-on-surface-variant'
                      }`}></div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleToggleAiPreference('recoveryAnalysis')}
                    className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-white/5 cursor-pointer active:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">Recovery Analysis</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">Wearables, Sleep &amp; HRV synchronization</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 ${
                      aiPreferences.recoveryAnalysis ? 'bg-primary' : 'bg-surface-bright'
                    }`}>
                      <div className={`w-4 h-4 rounded-full shadow transition-transform duration-200 ${
                        aiPreferences.recoveryAnalysis ? 'translate-x-6 bg-black' : 'translate-x-0 bg-on-surface-variant'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* App Theme */}
              <section className="space-y-3">
                <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">App Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Dark', 'Light', 'System'].map((theme) => {
                    const isSelected = selectedTheme === theme;
                    let icon = 'dark_mode';
                    if (theme === 'Light') icon = 'light_mode';
                    if (theme === 'System') icon = 'settings_brightness';

                    return (
                      <div 
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className={`w-full aspect-square bg-surface-container rounded-lg flex items-center justify-center border transition-all ${
                          isSelected 
                            ? 'border-primary shadow-[0_0_12px_rgba(245,196,0,0.2)] text-primary' 
                            : 'border-white/5 text-on-surface-variant hover:text-white'
                        }`}>
                          <span className="material-symbols-outlined">{icon}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-primary' : 'text-on-surface-variant'
                        }`}>{theme}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Account & Security settings */}
              <section className="space-y-3">
                <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">Account &amp; Security</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-xl">lock</span>
                      <span className="text-sm font-semibold text-on-surface">Change Password</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-xl">privacy_tip</span>
                      <span className="text-sm font-semibold text-on-surface">Privacy Settings</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-xl">download</span>
                      <span className="text-sm font-semibold text-on-surface">Export Data (CSV/PDF)</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
                  </div>
                </div>
              </section>

              {/* Logout Button */}
              <div className="pt-6">
                <button 
                  onClick={handleSecureLogout}
                  disabled={logoutState !== 'idle'}
                  className={`w-full py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 active:scale-95 transition-all rounded-lg shadow-lg ${
                    logoutState === 'idle' ? 'bg-[#93000a] text-white shadow-red-950/20' :
                    logoutState === 'securing' ? 'bg-[#93000a]/80 text-white cursor-wait' :
                    'bg-green-600 text-white'
                  }`}
                >
                  {logoutState === 'idle' && (
                    <>
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Secure Logout
                    </>
                  )}
                  {logoutState === 'securing' && (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      Securing session...
                    </>
                  )}
                  {logoutState === 'closed' && (
                    <>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Session Closed
                    </>
                  )}
                </button>
                <p className="text-center text-[9px] font-bold text-on-surface-variant uppercase mt-4 tracking-wider">
                  Version 2.4.0-pro • FitAI X Elite
                </p>
              </div>
            </div>
          )}

        </main>

        {/* Floating AI Coach Button */}
        <div className="absolute bottom-20 right-6 z-[60] orb-float">
          <button 
            onClick={() => setIsChatOpen(prev => !prev)}
            className="relative w-16 h-16 rounded-full cta-gradient ai-glow shadow-2xl flex items-center justify-center transition-transform active:scale-90 group overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            <span className="material-symbols-outlined text-black text-3xl font-bold group-hover:scale-110 transition-transform">
              {isChatOpen ? 'close' : 'auto_awesome'}
            </span>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border-2 border-primary flex items-center justify-center">
              <span className="text-[8px] font-black text-primary uppercase">Hi</span>
            </div>
          </button>
        </div>

        {/* Floating AI Coach Assistant Chat Drawer */}
        {isChatOpen && (
          <div className="absolute inset-x-0 bottom-16 z-50 bg-surface-container border-t border-primary/20 rounded-t-[32px] shadow-2xl flex flex-col h-[400px] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">FitXAI Coach</h4>
                  <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Active Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-on-surface-variant hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-black font-semibold rounded-tr-none' 
                        : 'bg-surface-container-low text-on-surface border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t border-white/5 bg-surface-container flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about workout, sore muscles, water intake..."
                className="flex-1 bg-surface-container-low border border-white/10 rounded-full px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary/50"
              />
              <button 
                type="submit"
                className="w-10 h-10 rounded-full cta-gradient flex items-center justify-center text-black cursor-pointer active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm font-bold">send</span>
              </button>
            </form>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 w-full z-50 pb-safe glass">
          <div className="h-16 px-4 flex items-center justify-between">
            <button 
              onClick={() => { setActiveTab('home'); setNutritionSubView('dashboard'); }}
              className={`flex flex-col items-center gap-1 px-2 transition-all cursor-pointer ${
                activeTab === 'home' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
            </button>
            <button 
              onClick={() => setActiveTab('workout')}
              className={`flex flex-col items-center gap-1 px-2 transition-all cursor-pointer ${
                activeTab === 'workout' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'workout' ? "'FILL' 1" : "'FILL' 0" }}>fitness_center</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Workout</span>
            </button>
            <div className="relative w-14 h-14 -mt-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <button 
                onClick={() => { setActiveTab('calories'); setNutritionSubView('dashboard'); }}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full cta-gradient shadow-xl active:scale-90 transition-transform cursor-pointer ${
                  activeTab === 'calories' ? 'shadow-primary/60 border-2 border-white/20' : 'shadow-primary/40'
                }`}
              >
                <span className="material-symbols-outlined text-black text-3xl font-black">local_fire_department</span>
              </button>
              <span className="absolute -bottom-5 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Calories</span>
            </div>
            <button 
              onClick={() => setActiveTab('records')}
              className={`flex flex-col items-center gap-1 px-2 transition-all cursor-pointer ${
                activeTab === 'records' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'records' ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Records</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-2 transition-all cursor-pointer ${
                activeTab === 'profile' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
