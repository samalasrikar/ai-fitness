import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_USER_PROFILE } from '../constants/dashboardConstants';
import { useCountUp } from './useCountUp';
import { useNutritionState } from './useNutritionState';
import { workoutApi } from '../../shared/services/workout.api';
import { aiCoachApi } from '../../shared/services/aicoach.api';
import { progressApi } from '../../shared/services/progress.api';
import { authApi } from '../../shared/services/auth.api';

export function useDashboardState() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [hasJoinedChallenge, setHasJoinedChallenge] = useState(false);

  // Profile state
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USER_PROFILE;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.displayName) setUserProfile(parsed);
      }
    } catch (e) {}
  }, []);

  const firstName = userProfile.displayName ? userProfile.displayName.split(' ')[0] : 'Rahul';

  // Timers ref for component cleanup
  const timersRef = useRef([]);
  const addTimer = (id) => {
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  // Nutrition state hook
  const nutritionState = useNutritionState(addTimer);

  // Chat container ref for auto-scroll
  const chatContainerRef = useRef(null);

  // Workout generator state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Fetch active workout plan on mount
  useEffect(() => {
    let isMounted = true;
    workoutApi.getActivePlan()
      .then((res) => {
        if (isMounted && res.data) setGeneratedPlan(res.data);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Fetch dashboard progress metrics & challenge status on mount
  useEffect(() => {
    let isMounted = true;
    progressApi.getDashboardMetrics()
      .then((res) => {
        if (isMounted && res.data) {
          setHasJoinedChallenge(Boolean(res.data.hasJoinedChallenge));
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // AI Coach chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: `Hey ${firstName}! Ready to crush your goals today? Let me know if you want me to generate a personalized routine or review your stats.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Fetch chat history on mount
  useEffect(() => {
    let isMounted = true;
    aiCoachApi.getHistory()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setChatMessages(res.data);
        }
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
    workoutGen: true,
    nutritionInsights: true,
    recoveryAnalysis: false
  });
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [logoutState, setLogoutState] = useState('idle');

  // Offsets
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
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleResetPlan = async () => {
    try {
      await workoutApi.resetPlan();
    } catch (e) {}
    setGeneratedPlan(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');

    try {
      const res = await aiCoachApi.sendMessage(userMsg);
      if (res.data) {
        setChatMessages((prev) => [...prev, { sender: 'coach', text: res.data.text }]);
      }
    } catch (err) {
      let responseText = "That sounds great! Keep pushing hard and let me know if you need any adjustments.";
      if (userMsg.toLowerCase().includes('plan') || userMsg.toLowerCase().includes('workout')) {
        responseText = "I highly recommend starting with the 'Hypertrophy Push A' routine today to build upper chest volume. Should I lock that in for you?";
      }
      setChatMessages((prev) => [...prev, { sender: 'coach', text: responseText }]);
    }
  };

  const handleToggleChallenge = async () => {
    const prev = hasJoinedChallenge;
    setHasJoinedChallenge(!prev);
    try {
      await progressApi.toggleChallenge();
    } catch (e) {
      setHasJoinedChallenge(prev);
    }
  };

  const handleToggleGoal = (goal) => {
    setSelectedGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const handleToggleAiPreference = (key) => {
    setAiPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecureLogout = async () => {
    setLogoutState('securing');
    try {
      await authApi.logout();
    } catch (e) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
    setLogoutState('closed');
    const timer = setTimeout(() => {
      navigate('/login');
      setLogoutState('idle');
    }, 1000);
    addTimer(timer);
  };

  return {
    activeTab,
    setActiveTab,
    hasJoinedChallenge,
    setHasJoinedChallenge: handleToggleChallenge,
    userProfile,
    firstName,
    chatContainerRef,
    isGeneratingPlan,
    generatedPlan,
    setGeneratedPlan: handleResetPlan,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    inputMessage,
    setInputMessage,
    selectedGoals,
    aiPreferences,
    selectedTheme,
    setSelectedTheme,
    logoutState,
    muscleOffset,
    fatOffset,
    fitnessOffset,
    heartRate,
    steps,
    energy,
    hydration,
    activeBurn,
    profileWeight,
    profileFitnessScore,
    handleGeneratePlan,
    handleSendMessage,
    handleToggleGoal,
    handleToggleAiPreference,
    handleSecureLogout,
    ...nutritionState
  };
}
