import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_USER_PROFILE } from '../constants/dashboardConstants';
import { useCountUp } from './useCountUp';
import { useNutritionState } from './useNutritionState';
import { workoutApi } from '../../../services/api/workout.api';
import { aiCoachApi } from '../../shared/services/aicoach.api';
import { progressApi } from '../../shared/services/progress.api';
import { authApi } from '../../shared/services/auth.api';
import { profileApi } from '../../shared/services/profile.api';

export function useDashboardState() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  // Profile state — start from localStorage cache, hydrate from API
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USER_PROFILE;
  });

  useEffect(() => {
    let isMounted = true;
    profileApi.getProfile()
      .then((res) => {
        if (!isMounted || !res.data) return;
        const p = res.data;
        const merged = {
          displayName: p.displayName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || userProfile.displayName,
          username: p.username || userProfile.username || `@${(p.firstName || 'user').toLowerCase()}_fit`,
          fitnessLevel: p.fitnessLevel || userProfile.fitnessLevel,
          weight: p.weight ?? userProfile.weight,
          heightFt: p.heightFt ?? userProfile.heightFt,
          heightIn: p.heightIn ?? userProfile.heightIn,
          age: p.age ?? userProfile.age,
          gender: p.gender || userProfile.gender
        };
        setUserProfile(merged);
        localStorage.setItem('userProfile', JSON.stringify(merged));
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const firstName = userProfile.displayName
    ? userProfile.displayName.split(' ')[0]
    : (userProfile.firstName || 'Athlete');

  // Timers ref for component cleanup
  const timersRef = useRef([]);
  const addTimer = (id) => { timersRef.current.push(id); return id; };
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  // Nutrition state hook
  const nutritionState = useNutritionState();

  // Chat container ref for auto-scroll
  const chatContainerRef = useRef(null);

  // Workout generator state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Fetch active workout plan on mount
  useEffect(() => {
    let isMounted = true;
    workoutApi.getActivePlan()
      .then(res => { if (isMounted && res.data) setGeneratedPlan(res.data); })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Fetch dashboard progress metrics & challenge/streak status on mount
  useEffect(() => {
    let isMounted = true;
    progressApi.getDashboardMetrics()
      .then(res => {
        if (!isMounted || !res.data) return;
        setHasJoinedChallenge(Boolean(res.data.hasJoinedChallenge));
        setStreakDays(res.data.activeStreak ?? res.data.streakDays ?? 0);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // AI Coach chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: `Hey! Ready to crush your goals today? Let me know if you want me to generate a personalized routine or review your stats.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    aiCoachApi.getHistory()
      .then(res => {
        if (isMounted && res.data && res.data.length > 0) setChatMessages(res.data);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  // Profile specific states
  const [selectedGoals, setSelectedGoals] = useState(['Muscle Gain', 'Strength Training']);
  const [aiPreferences, setAiPreferences] = useState({
    workoutGen: true, nutritionInsights: true, recoveryAnalysis: false
  });
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [logoutState, setLogoutState] = useState('idle');

  // Offsets
  const [muscleOffset, setMuscleOffset] = useState(213.628);
  const [fatOffset, setFatOffset] = useState(213.628);
  const [fitnessOffset, setFitnessOffset] = useState(175.9);

  useEffect(() => {
    if (activeTab === 'home') {
      const t = setTimeout(() => {
        setMuscleOffset(213.628 - 0.72 * 213.628);
        setFatOffset(213.628 - 0.48 * 213.628);
      }, 200);
      return () => clearTimeout(t);
    } else { setMuscleOffset(213.628); setFatOffset(213.628); }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'profile') {
      const t = setTimeout(() => setFitnessOffset(175.9 - 0.88 * 175.9), 200);
      return () => clearTimeout(t);
    } else { setFitnessOffset(175.9); }
  }, [activeTab]);

  // Count up animations
  const heartRate = useCountUp(78, 1000);
  const steps = useCountUp(8425, 1200);
  const energy = useCountUp(2450, 1200);
  const hydration = useCountUp(1.8, 1200, 1);
  const activeBurn = useCountUp(480, 1000);
  const profileWeight = useCountUp(userProfile.weight || 60, 800, 0, activeTab === 'profile');
  const profileFitnessScore = useCountUp(88, 1000, 0, activeTab === 'profile');

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await workoutApi.generatePlan();
      if (res.data) setGeneratedPlan(res.data);
    } catch (e) {
      setGeneratedPlan({
        title: 'Hypertrophy Push A', duration: '45 mins',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: '4x8-10 reps', rpe: 'RPE 8.5' },
          { name: 'Overhead Barbell Press', sets: '3x6-8 reps', rpe: 'RPE 8' },
          { name: 'Weighted Chest Dips', sets: '3x10 reps', rpe: 'RPE 9' },
          { name: 'Cable Lateral Raises', sets: '4x12-15 reps', rpe: 'RPE 9' },
          { name: 'Triceps Overhead Extensions', sets: '3x10-12 reps', rpe: 'RPE 8.5' }
        ]
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleResetPlan = async () => {
    try { await workoutApi.resetPlan(); } catch (e) {}
    setGeneratedPlan(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');
    try {
      const res = await aiCoachApi.sendMessage(userMsg);
      if (res.data) setChatMessages(prev => [...prev, { sender: 'coach', text: res.data.text }]);
    } catch {
      let reply = "Keep pushing! Let me know if you need any adjustments.";
      if (userMsg.toLowerCase().includes('plan') || userMsg.toLowerCase().includes('workout'))
        reply = "I recommend the 'Hypertrophy Push A' routine today. Should I lock that in?";
      setChatMessages(prev => [...prev, { sender: 'coach', text: reply }]);
    }
  };

  const handleToggleChallenge = async () => {
    const prev = hasJoinedChallenge;
    setHasJoinedChallenge(!prev);
    try { await progressApi.toggleChallenge(); }
    catch { setHasJoinedChallenge(prev); }
  };

  const handleToggleGoal = async (goal) => {
    const next = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(next);
    try { await profileApi.updateGoals(next); } catch {}
  };

  const handleToggleAiPreference = async (key) => {
    const next = { ...aiPreferences, [key]: !aiPreferences[key] };
    setAiPreferences(next);
    try { await profileApi.updatePreferences(next); } catch {}
  };

  const handleSecureLogout = async () => {
    setLogoutState('securing');
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    setLogoutState('closed');
    const t = setTimeout(() => { navigate('/login'); setLogoutState('idle'); }, 1000);
    addTimer(t);
  };

  return {
    activeTab, setActiveTab,
    hasJoinedChallenge, setHasJoinedChallenge: handleToggleChallenge,
    streakDays, userProfile, setUserProfile, firstName,
    chatContainerRef,
    isGeneratingPlan, generatedPlan, setGeneratedPlan: handleResetPlan,
    isChatOpen, setIsChatOpen,
    chatMessages, inputMessage, setInputMessage,
    selectedGoals, aiPreferences,
    selectedTheme, setSelectedTheme,
    logoutState,
    muscleOffset, fatOffset, fitnessOffset,
    heartRate, steps, energy, hydration, activeBurn,
    profileWeight, profileFitnessScore,
    handleGeneratePlan, handleSendMessage,
    handleToggleGoal, handleToggleAiPreference, handleSecureLogout,
    ...nutritionState
  };
}
