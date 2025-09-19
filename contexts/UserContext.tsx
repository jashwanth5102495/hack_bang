import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  fullName: string;
  occupation: string;
  interests: string[];
  joinedDate: string;
  moodSessions?: number;
  connections?: number;
  daysActive?: number;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  saveUserData: (userData: Partial<UserProfile>) => Promise<void>;
  loadUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (userData: Partial<UserProfile>) => {
    try {
      const currentUser = user || {
        fullName: '',
        occupation: '',
        interests: [],
        joinedDate: new Date().toISOString(),
        moodSessions: 0,
        connections: 0,
        daysActive: 1,
      };

      const updatedUser = { ...currentUser, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('user', 'authenticated'); // For auth check
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateUser,
      saveUserData,
      loadUserData,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
}