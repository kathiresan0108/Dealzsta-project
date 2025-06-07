import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import GrandPopup from '@/components/common/GrandPopup';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setPopupConfig({
        title: 'Error',
        message: 'Please fill in all fields',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
      return;
    }

    setLoading(true);
    
    // Simulate login API call
    setTimeout(async () => {
      try {
        const userData = {
          id: '1',
          email: email,
          name: 'John Doe',
          accountType: 'user', // or 'business'
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          verified: true,
          followers: 1234,
          following: 567,
          posts: 89
        };
        
        await login(userData);
        router.replace('/(tabs)');
      } catch (error) {
        setPopupConfig({
          title: 'Login Failed',
          message: 'Invalid credentials. Please try again.',
          type: 'error',
          buttons: [
            { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
          ]
        });
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>NearO</Text>
              <Text style={styles.subtitle}>{t.welcome}</Text>
              <Text style={styles.description}>{t.find_deals}</Text>
            </View>

            <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: theme.primary }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Logging in...' : t.login}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signupLink}
                onPress={() => router.push('/auth/signup')}
              >
                <Text style={[styles.signupText, { color: theme.textSecondary }]}>
                  Don't have an account? <Text style={[styles.signupTextBold, { color: theme.primary }]}>{t.signup}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <GrandPopup
        visible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
        buttons={popupConfig.buttons}
        onDismiss={() => setShowPopup(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupTextBold: {
    fontWeight: '600',
  },
});