import { useState, useCallback } from 'react';
import { onboardingApi } from '../services/api/onboarding.api';

export function useOnboarding() {
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveProtocol = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await onboardingApi.saveProtocol(data);
      setProtocol(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to save onboarding protocol');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProtocol = useCallback(async () => {
    setLoading(true);
    try {
      const res = await onboardingApi.getProtocol();
      setProtocol(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { protocol, loading, error, saveProtocol, getProtocol };
}
