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

export const lightTheme = {
  primary: '#6C5CE7',
  secondary: '#FD79A8',
  accent: '#FDCB6E',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#2D3436',
  textSecondary: '#636E72',
  border: '#DDD6FE',
  error: '#E17055',
  success: '#00B894',
  warning: '#FDCB6E',
  like: '#E84393',
  gradient: ['#6C5CE7', '#A29BFE'],
  cardBackground: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarActive: '#6C5CE7',
  tabBarInactive: '#636E72',
};

export const darkTheme = {
  primary: '#A29BFE',
  secondary: '#FD79A8',
  accent: '#FDCB6E',
  background: '#1A1A1A',
  surface: '#2D2D2D',
  text: '#FFFFFF',
  textSecondary: '#B2BEC3',
  border: '#444444',
  error: '#E17055',
  success: '#00B894',
  warning: '#FDCB6E',
  like: '#E84393',
  gradient: ['#2D2D2D', '#1A1A1A'],
  cardBackground: '#2D2D2D',
  tabBar: '#2D2D2D',
  tabBarActive: '#A29BFE',
  tabBarInactive: '#B2BEC3',
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