import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TICKER_MESSAGES } from '../constants/onboardingConstants';
import { onboardingApi } from '../../shared/services/onboarding.api';

export function useOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

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

  // Step 5: Progress loop & backend submission
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
          // Persist protocol to backend API
          onboardingApi.submitOnboarding({
            gender,
            age: Number(age) || 24,
            weight: Number(weight) || 60,
            heightFt: Number(heightFt) || 5,
            heightIn: Number(heightIn) || 5,
            fitnessLevel,
            frequency: String(frequency),
            location,
            duration: String(duration),
            selectedGoal,
            isCompleted: true
          }).catch(() => {});

          successTimeout = setTimeout(() => {
            setStep(6);
          }, 1000);
        }

        return next;
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      if (successTimeout) clearTimeout(successTimeout);
    };
  }, [step, gender, age, weight, heightFt, heightIn, fitnessLevel, frequency, location, duration, selectedGoal]);

  const handleFinishOnboarding = () => {
    const userProfile = {
      gender,
      age: Number(age) || 24,
      weight: Number(weight) || 60,
      heightFt: Number(heightFt) || 5,
      heightIn: Number(heightIn) || 5,
      fitnessLevel,
      frequency,
      location,
      duration,
      selectedGoal,
      displayName: 'Rahul Sharma',
      username: '@rahul_fit'
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
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
    heightFt,
    setHeightFt,
    heightIn,
    setHeightIn,
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
    handleFinishOnboarding
  };
}
