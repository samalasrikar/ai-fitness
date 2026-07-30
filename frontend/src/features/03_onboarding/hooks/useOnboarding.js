import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TICKER_MESSAGES } from '../constants/onboardingConstants';
import { onboardingApi } from '../../shared/services/onboarding.api';
import { profileApi } from '../../shared/services/profile.api';

export function useOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Auto-redirect if onboarding was already completed
  useEffect(() => {
    const isCompleted = localStorage.getItem('onboardingCompleted') === 'true';
    if (isCompleted && step !== 6) {
      navigate('/dashboard', { replace: true });
    }
  }, [step, navigate]);

  // Step 2: Personal Details state (Weight in KG, Height in CM)
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');

  // Step 3: Preferences state
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [frequency, setFrequency] = useState(3);
  const [location, setLocation] = useState('Gym');
  const [duration, setDuration] = useState(45);

  // Step 4: Fitness Goals state
  const [selectedGoal, setSelectedGoal] = useState('Lose Weight');

  // Step 5 & 6: Loading & submission state
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Analyzing Biometrics...');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Step 5: Progress loop
  useEffect(() => {
    if (step !== 5) return;

    setProgress(0);
    setStatusText('Analyzing Biometrics...');
    let successTimeout = null;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const increment = Math.random() * 2 + 0.5;
        const next = Math.min(prev + increment, 100);

        if (next >= 75) {
          setStatusText('Syncing Neural Pathways...');
        } else if (next >= 40) {
          setStatusText('Predicting Hypertrophy Cycles...');
        } else if (next >= 15) {
          setStatusText('Calculating Metabolic Load...');
        }

        if (Math.random() > 0.90) {
          setTickerIndex(Math.floor(Math.random() * TICKER_MESSAGES.length));
        }

        if (next >= 100 && !successTimeout) {
          clearInterval(progressInterval);
          successTimeout = setTimeout(() => {
            setStep(6);
          }, 800);
        }

        return next;
      });
    }, 80);

    return () => {
      clearInterval(progressInterval);
      if (successTimeout) clearTimeout(successTimeout);
    };
  }, [step]);

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      gender,
      age: Number(age) || 26,
      weight: Number(weight) || 74,
      heightCm: Number(heightCm) || 178,
      fitnessLevel,
      frequency: String(frequency),
      location,
      duration: String(duration),
      selectedGoal,
      isCompleted: true
    };

    try {
      // 1. Submit onboarding completion to backend
      await onboardingApi.submitOnboarding(payload).catch(() => {});

      // 2. Update profile biometrics in backend
      await profileApi.updateProfile({
        displayName: 'Rahul Sharma',
        fitnessLevel,
        weight: Number(weight) || 74,
        heightCm: Number(heightCm) || 178
      }).catch(() => {});

      const userProfile = {
        gender,
        age: Number(age) || 26,
        weight: Number(weight) || 74,
        heightCm: Number(heightCm) || 178,
        fitnessLevel,
        frequency,
        location,
        duration,
        selectedGoal,
        displayName: 'Rahul Sharma',
        username: '@rahul_fit'
      };

      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    gender,
    setGender,
    age,
    setAge,
    weight,
    setWeight,
    heightCm,
    setHeightCm,
    fitnessLevel,
    setFitnessLevel,
    frequency,
    setFrequency,
    location,
    setLocation,
    duration,
    setDuration,
    selectedGoal,
    setSelectedGoal,
    progress,
    statusText,
    tickerIndex,
    isSubmitting,
    submitError,
    handleFinishOnboarding
  };
}
