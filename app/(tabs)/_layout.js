import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Search,
  Store,
  MessageCircle,
  CalendarDays,
  User,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [accountType, setAccountType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountType = async () => {
      try {
        const type = await AsyncStorage.getItem('accountType');
        setAccountType(type);
      } catch (error) {
        console.error('Error fetching account type:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountType();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        // Removed the listeners prop that was causing auto-refresh
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Home size={size} color={focused ? '#5F4B8B' : '#9CA3AF'} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Search size={size} color={focused ? '#5F4B8B' : '#9CA3AF'} />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: focused ? '#E5DFF5' : '#F3F4F6',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="add-outline"
                size={24}
                color={focused ? '#5F4B8B' : '#9CA3AF'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name={accountType === 'business' ? 'create' : 'events'}
        options={{
          tabBarIcon: ({ focused, size }) =>
            accountType === 'business' ? (
              <Store size={size} color={focused ? '#9051c3' : '#cba3ea'} />
            ) : (
              <CalendarDays size={size} color={focused ? '#5F4B8B' : '#9CA3AF'} />
            ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <MessageCircle size={size} color={focused ? '#5F4B8B' : '#9CA3AF'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, size }) =>
            user?.avatar ? (
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? '#9051c3' : 'transparent',
                  }}
                />
                
              </View>
            ) : (
              <User size={size} color={focused ? '#5F4B8B' : '#9CA3AF'} />
            ),
        }}
      />
    </Tabs>
  );
}