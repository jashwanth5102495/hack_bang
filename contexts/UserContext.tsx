import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  interests: string[];
  profileImage?: string;
  currentMood: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  moodHistory?: Array<{
    mood: string;
    timestamp: string;
  }>;
  stats?: {
    sessions: number;
    connections: number;
    streak: number;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  saveUserData: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const isAuth = await apiService.isAuthenticated();
      
      if (isAuth) {
        // Try to get user profile from backend
        const response = await apiService.getUserProfile();
        if (response.success && response.data) {
          const userData = response.data;
          setUser({
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            age: userData.age,
            bio: userData.bio,
            interests: userData.interests || [],
            currentMood: userData.currentMood || 'Happy',
            profileImage: userData.profileImage,
            moodHistory: userData.moodHistory || [],
            stats: {
              sessions: userData.moodHistory?.length || 0,
              connections: userData.connections?.length || 0,
              streak: 0 // Calculate streak from mood history
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        // Update locally first for immediate UI feedback
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        // Update on backend
        const response = await apiService.updateUserProfile({
          name: updates.name,
          age: updates.age,
          bio: updates.bio,
          interests: updates.interests,
          currentMood: updates.currentMood
        });

        if (!response.success) {
          // Revert local changes if backend update fails
          setUser(user);
          throw new Error(response.error || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  };

  const saveUserData = async (userData: any) => {
    try {
      if (user) {
        const profileData = {
          name: userData.fullName || userData.name,
          age: userData.age,
          bio: userData.bio,
          interests: userData.interests || userData.selectedInterests,
          currentMood: userData.currentMood || user.currentMood
        };

        const response = await apiService.updateUserProfile(profileData);
        
        if (response.success) {
          // Update local user state
          const updatedUser: User = {
            ...user,
            ...profileData,
            stats: user.stats || {
              sessions: 0,
              connections: 0,
              streak: 0
            }
          };
          setUser(updatedUser);
          console.log('User data saved successfully:', updatedUser);
        } else {
          throw new Error(response.error || 'Failed to save user data');
        }
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        const newUser: User = {
          id: userData._id || userData.id,
          name: userData.name,
          email: userData.email,
          age: userData.age,
          bio: userData.bio,
          interests: userData.interests || [],
          currentMood: userData.currentMood || 'Happy',
          profileImage: userData.profileImage,
          moodHistory: userData.moodHistory || [],
          stats: {
            sessions: userData.moodHistory?.length || 0,
            connections: userData.connections?.length || 0,
            streak: 0
          }
        };
        
        setUser(newUser);
        
        // Store user data locally for offline access
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
        
        return true;
      } else {
        console.error('Login failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.register({
        name: userData.name || 'New User',
        email: userData.email,
        password: userData.password,
        age: userData.age,
        bio: userData.bio,
        interests: userData.interests || []
      });
      
      if (response.success && response.data) {
        const backendUser = response.data.user;
        const newUser: User = {
          id: backendUser._id || backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          age: backendUser.age,
          bio: backendUser.bio,
          interests: backendUser.interests || [],
          currentMood: backendUser.currentMood || 'Happy',
          profileImage: backendUser.profileImage,
          moodHistory: [],
          stats: {
            sessions: 0,
            connections: 0,
            streak: 0
          }
        };
        
        setUser(newUser);
        
        // Store user data locally
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
        
        return true;
      } else {
        console.error('Registration failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      setUser(null);
    }
  };

  const refreshUserProfile = async () => {
    try {
      if (user) {
        const response = await apiService.getUserProfile();
        if (response.success && response.data) {
          const userData = response.data;
          const updatedUser: User = {
            ...user,
            name: userData.name,
            age: userData.age,
            bio: userData.bio,
            interests: userData.interests || [],
            currentMood: userData.currentMood || 'Happy',
            profileImage: userData.profileImage,
            moodHistory: userData.moodHistory || user.moodHistory,
            stats: {
              sessions: userData.moodHistory?.length || user.stats?.sessions || 0,
              connections: userData.connections?.length || user.stats?.connections || 0,
              streak: user.stats?.streak || 0
            }
          };
          setUser(updatedUser);
          await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateUser,
      saveUserData,
      isAuthenticated,
      loading,
      login,
      logout,
      register,
      refreshUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};