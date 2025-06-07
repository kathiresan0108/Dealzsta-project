import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible while we check auth status
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        if (user) {
          router.replace('/(tabs)');
        } else if (hasSeenOnboarding) {
          router.replace('/auth/login');
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Error during splash screen:', error);
        router.replace('/auth/login');
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [user]);

  if (!isReady) {
    return (
      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2061168/pexels-photo-2061168.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' }}
            style={styles.logo}
          />
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});