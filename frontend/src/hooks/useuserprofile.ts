import { useState, useEffect, useCallback } from 'react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  memberSince: string;
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}

const API_BASE_URL = 'http://localhost:5001/api';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('👤 SafarSuraksha: Fetching user profile...');
      
      const token = localStorage.getItem('safar_auth_token');
      if (!token) {
        // Create a demo user profile for testing
        const demoProfile: UserProfile = {
          id: 'demo_user_' + Date.now(),
          firstName: 'SafarSuraksha',
          lastName: 'User',
          email: 'user@safar.com',
          memberSince: new Date().toISOString(),
          preferences: {
            language: 'en',
            theme: 'light',
            notifications: true
          }
        };
        setUserProfile(demoProfile);
        localStorage.setItem('safar_user_profile', JSON.stringify(demoProfile));
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUserProfile(data.data);
          localStorage.setItem('safar_user_profile', JSON.stringify(data.data));
          console.log('✅ SafarSuraksha: User profile loaded:', data.data.firstName);
        }
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.warn('⚠️ SafarSuraksha: Profile API failed, using cached/demo data');
      
      // Try to load from localStorage as fallback
      const cachedProfile = localStorage.getItem('safar_user_profile');
      if (cachedProfile) {
        setUserProfile(JSON.parse(cachedProfile));
      } else {
        // Demo profile as final fallback
        const demoProfile: UserProfile = {
          id: 'demo_user',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@safar.com',
          memberSince: '2024-01-01T00:00:00Z'
        };
        setUserProfile(demoProfile);
      }
      
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    userProfile,
    loading,
    error,
    refetchProfile: fetchUserProfile
  };
};
