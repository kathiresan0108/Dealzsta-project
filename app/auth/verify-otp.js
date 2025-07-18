import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import GrandPopup from '@/components/common/GrandPopup';

export default function VerifyOTP() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useLocalSearchParams(); // Getting name, email, password from Signup screen

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  const handleVerifyOTP = async () => {
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

    // Simulate OTP Verification (replace this with real API later)
    setTimeout(() => {
      setLoading(false);
      if (otp === '123456') { // Example correct OTP for simulation
        router.push({
          pathname: '/auth/account-type',
          params: {
            name: params.name,
            email: params.email,
            password: params.password
          }
        });
      } else {
        setPopupConfig({
          title: 'Invalid OTP',
          message: 'The OTP you entered is incorrect.',
          type: 'error',
          buttons: [{ text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }]
        });
        setShowPopup(true);
      }
    }, 1500);
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color={'red'} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>Check your email for the verification code</Text>
            </View>

            <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="Enter OTP"
                placeholderTextColor={theme.textSecondary}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: theme.primary }]}
                onPress={handleVerifyOTP}
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

      {/* Grand Popup for errors / messages */}
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'red',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  form: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
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
    textAlign: 'center',
    letterSpacing: 5,
  },
  verifyButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
