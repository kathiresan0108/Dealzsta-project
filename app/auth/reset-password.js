import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import GrandPopup from '@/components/common/GrandPopup';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  const router = useRouter();
  const { theme } = useTheme();

  const handleResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setPopupConfig({
        title: 'Error',
        message: 'Please fill in all fields',
        type: 'error',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }]
      });
      setShowPopup(true);
      return;
    }

    if (password !== confirmPassword) {
      setPopupConfig({
        title: 'Error',
        message: 'Passwords do not match',
        type: 'error',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }]
      });
      setShowPopup(true);
      return;
    }

    setLoading(true);

    // Simulate API Call to reset password
    setTimeout(() => {
      setPopupConfig({
        title: 'Success',
        message: 'Your password has been reset successfully!',
        type: 'success',
        buttons: [{
          text: 'OK',
          style: 'primary',
          onPress: () => { setShowPopup(false); router.replace('/auth/login'); }
        }]
      });
      setShowPopup(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Back Arrow Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={'red'} onPress={() => router.push('/auth/forgot-password-otp')}/>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.description}>
                Enter your new password and confirm to reset.
              </Text>
            </View>

            <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="New Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: theme.primary }]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.resetButtonText}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backLink}
                onPress={() => router.back()}
              >
                <Text style={[styles.backText, { color: theme.primary }]}>
                  Go Back
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
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  content: { flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 6,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: 'red', marginBottom: 12 },
  description: { fontSize: 14, color: 'red', opacity: 0.8, textAlign: 'center', paddingHorizontal: 12 },
  form: {
    padding: 24, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  input: {
    height: 50, borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 16, marginBottom: 20, fontSize: 16,
  },
  resetButton: {
    height: 50, borderRadius: 12, justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
  },
  resetButtonText: { color: 'red', fontSize: 16, fontWeight: '600' },
  backLink: { alignItems: 'center' },
});
