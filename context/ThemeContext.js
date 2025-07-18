import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Clean White Theme
export const lightTheme = {
  primary: '#5F4B8B',         // iOS red
  secondary: '#FF9500',       // orange
  accent: '#FFCC00',          // yellow
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#1C1C1E',
  textSecondary: '#3A3A3C',
  border: '#E5E5EA',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  like: '#FF375F',
  gradient: ['#FFFFFF', '#F2F2F7'],
  cardBackground: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarActive: '#FF3B30',
  tabBarInactive: '#A1A1A1',
};

// Red & Black Theme
export const darkTheme = {
  primary: '#FF3B30',
  secondary: '#FF453A',
  accent: '#FF9F0A',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#A1A1A1',
  border: '#2C2C2E',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FFD60A',
  like: '#FF375F',
  gradient: ['#1C1C1E', '#000000'],
  cardBackground: '#1C1C1E',
  tabBar: '#1C1C1E',
  tabBarActive: '#FF453A',
  tabBarInactive: '#A1A1A1',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        const isDarkMode = savedTheme === 'dark';
        setIsDark(isDarkMode);
        setTheme(isDarkMode ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme);
      await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
