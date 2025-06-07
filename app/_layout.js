import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="auth/account-type" />
              <Stack.Screen name="auth/business-verification" />
              <Stack.Screen name="auth/profile-setup" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="profile/[userId]" />
              <Stack.Screen name="post/[postId]" />
              <Stack.Screen name="scanner" />
              <Stack.Screen name="messages" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="saved-posts" />
              <Stack.Screen name="edit-profile" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}