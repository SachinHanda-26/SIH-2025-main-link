import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tourist' | 'authority';
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate fetching user data from Clerk or local storage
    const fetchUser = async () => {
      try {
        // In a real app, this would be an API call to get the current user
        // For now, we'll simulate a logged-in user
        const mockUser: User = {
          id: 'user_123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'tourist',
          token: 'mock-jwt-token'
        };
        
        setUser(mockUser);
        setError(null);
      } catch (err) {
        setError('Failed to authenticate user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  const logout = () => {
    // In a real app, this would call the logout API
    setUser(null);
  };
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout
  };
}