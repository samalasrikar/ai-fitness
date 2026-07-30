import { useState, useEffect, useCallback } from 'react';
import { profileApi } from '../services/api/profile.api';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await profileApi.getProfile();
      setProfile(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await profileApi.updateProfile(data);
      setProfile(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}
