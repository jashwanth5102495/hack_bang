import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  background: string[];
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  overlay: string;
}

export const lightTheme: Theme = {
  background: ['#ffffff', '#f8fafc'],
  cardBackground: 'rgba(255, 255, 255, 0.9)',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  accent: '#3b82f6',
  border: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(255, 255, 255, 0.05)',
};

export const darkTheme: Theme = {
  background: ['#000000', '#0a0a0a'],
  cardBackground: 'rgba(255, 255, 255, 0.05)',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  accent: '#3b82f6',
  border: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(255, 255, 255, 0.05)',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}