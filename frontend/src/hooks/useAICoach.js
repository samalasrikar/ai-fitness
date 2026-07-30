import { useState, useCallback } from 'react';
import { aiCoachApi } from '../services/api/aicoach.api';

export function useAICoach() {
  const [chatHistory, setChatHistory] = useState([]);
  const [injuryGuardStatus, setInjuryGuardStatus] = useState(null);
  const [exerciseAnalysis, setExerciseAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiCoachApi.getHistory();
      const payload = res.data?.data ?? res.data ?? [];
      setChatHistory(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (text) => {
    setError(null);
    const userMsg = { id: `temp-${Date.now()}`, sender: 'user', text, createdAt: new Date().toISOString() };
    setChatHistory((prev) => [...prev, userMsg]);
    try {
      const res = await aiCoachApi.sendMessage(text);
      const coachMsg = res.data?.data ?? res.data;
      setChatHistory((prev) => [
        ...prev.filter((m) => m.id !== userMsg.id),
        { id: `u-${Date.now()}`, sender: 'user', text, createdAt: new Date().toISOString() },
        {
          id: coachMsg?.id || `c-${Date.now()}`,
          sender: coachMsg?.sender || 'coach',
          text: coachMsg?.text || coachMsg?.reply || coachMsg?.message || (typeof coachMsg === 'string' ? coachMsg : 'Reply received.'),
          createdAt: coachMsg?.createdAt || new Date().toISOString(),
        },
      ]);
      return coachMsg;
    } catch (err) {
      setChatHistory((prev) => prev.filter((m) => m.id !== userMsg.id));
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send message';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const generateWorkout = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiCoachApi.generateWorkout(params);
      const payload = res.data?.data ?? res.data;
      return payload;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'AI Workout generation failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchInjuryGuard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiCoachApi.getInjuryGuard();
      const payload = res.data?.data ?? res.data;
      setInjuryGuardStatus(payload);
      return payload;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load injury guard status');
    } finally {
      setLoading(false);
    }
  }, []);

  const logInjury = async (injuryData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiCoachApi.logInjury(injuryData);
      await fetchInjuryGuard();
      return res.data?.data ?? res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to log injury';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseAnalysis = useCallback(async (exerciseId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiCoachApi.getExerciseAnalysis(exerciseId);
      const payload = res.data?.data ?? res.data;
      setExerciseAnalysis(payload);
      return payload;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to analyze exercise biomechanics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    chatHistory,
    injuryGuardStatus,
    exerciseAnalysis,
    loading,
    error,
    fetchHistory,
    sendMessage,
    generateWorkout,
    fetchInjuryGuard,
    logInjury,
    fetchExerciseAnalysis,
  };
}
