import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/chat';

interface AuthContextType {
  user: User | null;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);

  useEffect(() => {
    // Load onboarding status from storage
    AsyncStorage.getItem('hasCompletedOnboarding').then((value) => {
      if (value === 'true') setHasCompletedOnboardingState(true);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API

      if (email && password) {
        setUser({
          id: '1',
          email,
          name: email.split('@')[0],
        });
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setHasCompletedOnboardingState(false);
    AsyncStorage.removeItem('hasCompletedOnboarding');
  };

  const setHasCompletedOnboarding = (value: boolean) => {
    setHasCompletedOnboardingState(value);
    AsyncStorage.setItem('hasCompletedOnboarding', value ? 'true' : 'false');
  };

  return (
    <AuthContext.Provider value={{
      user,
      hasCompletedOnboarding,
      setHasCompletedOnboarding,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
