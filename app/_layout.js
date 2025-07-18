import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SavedPostsProvider } from '@/context/SavedPostsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <SavedPostsProvider>
              <>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="auth/signup" />
                  <Stack.Screen name="auth/account-type" />
                  <Stack.Screen name="auth/reset-password" />
                  <Stack.Screen name="auth/business-verification" />
                  <Stack.Screen name="auth/forgot-password" />
                  <Stack.Screen name="auth/forgot-password-otp" />
                  <Stack.Screen name="auth/profile-setup" />
                  <Stack.Screen name="profile/[username]" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="profile/[userId]" />
                  <Stack.Screen name="post/[postId]" />
                  <Stack.Screen name="scanner" />
                   <Stack.Screen name="events/[eventId]" />
                  <Stack.Screen name="messages" />
                  <Stack.Screen name="message" />
                  <Stack.Screen name="notification" />
                  <Stack.Screen name="saved" />
                  <Stack.Screen name="groupmessagepage" />
                  <Stack.Screen name="event" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="createTemplate" />
                  <Stack.Screen name="saved-posts" />
                  <Stack.Screen name="edit-profile" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </>
            </SavedPostsProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
