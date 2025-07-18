import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import GrandPopup from '@/components/common/GrandPopup';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  const router = useRouter();
  const { theme } = useTheme();

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setPopupConfig({
        title: 'Error',
        message: 'Please enter the OTP',
        type: 'error',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }]
      });
      setShowPopup(true);
      return;
    }

    setLoading(true);

    // Simulate API call to verify OTP
    setTimeout(() => {
      setPopupConfig({
        title: 'Success',
        message: 'OTP verified successfully!',
        type: 'success',
        buttons: [{
          text: 'OK',
          style: 'primary',
          onPress: () => { setShowPopup(false); router.push('/auth/reset-password'); }
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
          onPress={() => router.push('/auth/forgot-password')}
        >
          <Ionicons name="arrow-back" size={24} color={'red'} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Forgot Password OTP</Text>
              <Text style={styles.description}>
                Enter the OTP sent to your registered email.
              </Text>
            </View>

            <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }
                ]}
                placeholder="Enter OTP"
                placeholderTextColor={theme.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: theme.primary }]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <Text style={styles.verifyButtonText}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
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
  verifyButton: {
    height: 50, borderRadius: 12, justifyContent: 'center',
    alignItems: 'center', marginBottom: 16,
  },
  verifyButtonText: { color: 'red', fontSize: 16, fontWeight: '600' },
});
