// app/splash.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Assume null if not logged in

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        router.replace('/index'); // Already logged in
      } else {
        router.replace('/auth/login'); // Not logged in
      }
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/sparrow-5687_256.gif')} // or .png for static logo
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
