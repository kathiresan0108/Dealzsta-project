import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ScrollView, StatusBar, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import GrandPopup from '@/components/common/GrandPopup';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const logoScaleAnim = new Animated.Value(0.9);
  const cardSlideAnim = new Animated.Value(50);

  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = ({ name, email, password, confirmPassword }) => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return 'Please fill in all fields';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[^\w\s]).{4,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 4 characters, include 1 uppercase letter, 1 number, and 1 special character.';
    }

    return null;
  };

  const handleSignup = async () => {
    const error = validateForm(formData);
    if (error) {
      setPopupConfig({
        title: 'Validation Error',
        message: error,
        type: 'error',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }]
      });
      setShowPopup(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/auth/verify-otp',
        params: formData
      });
    }, 1500);
  };

  const handleGoogleSignup = () => {
    console.log('Google signup pressed');
  };

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#cba3ea" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>

            {/* Header Section */}
            <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoContainer}>
                <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScaleAnim }] }]}>
                  <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="cover"
                  />
                </Animated.View>
              </View>
              <Text style={styles.appTitle}>Dealzsta</Text>
              {/* <Text style={styles.welcomeText}>Welcome to Dealzsta</Text> */}
              <Text style={styles.subText}>Find amazing deals near you</Text>
            </Animated.View>

            {/* Sign Up Card */}
            <Animated.View style={[styles.signupCard, { transform: [{ translateY: cardSlideAnim }] }]}>
              <Text style={styles.signupTitle}>Sign Up</Text>
              <Text style={styles.signupSubtitle}>Create your account</Text>

              {/* Form Fields */}
              {['name', 'email', 'password', 'confirmPassword'].map((field, index) => (
                <Animated.View 
                  style={[
                    styles.inputContainer,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                  ]} 
                  key={index}
                >
                  <Ionicons
                    name={
                      field === 'name' ? 'person-outline' :
                      field === 'email' ? 'mail-outline' :
                      field === 'password' ? 'lock-closed-outline' :
                      'shield-checkmark-outline'
                    }
                    size={18} color="#9051c3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      field === 'name' ? 'Full Name' :
                      field === 'email' ? 'Email Address' :
                      field === 'password' ? 'Password' :
                      'Confirm Password'
                    }
                    placeholderTextColor="#999"
                    value={formData[field]}
                    onChangeText={(value) => handleInputChange(field, value)}
                    keyboardType={field === 'email' ? 'email-address' : 'default'}
                    autoCapitalize="none"
                    secureTextEntry={field.includes('password') && (field === 'password' ? !showPassword : !showConfirmPassword)}
                  />
                  {field.includes('password') && (
                    <TouchableOpacity 
                      onPress={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={
                          (field === 'password' ? showPassword : showConfirmPassword)
                            ? 'eye-outline'
                            : 'eye-off-outline'
                        }
                        size={18} color="#9051c3"
                      />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              ))}

              {/* Sign Up Button */}
              <AnimatedTouchableOpacity
                style={[styles.signupButton, { opacity: fadeAnim }]}
                onPress={handleSignup}
                disabled={loading}
              >
                <View style={styles.signupButtonContent}>
                  <Text style={styles.signupButtonText}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.arrowIcon} />
                </View>
              </AnimatedTouchableOpacity>

              {/* Divider */}
              <Animated.View style={[styles.divider, { opacity: fadeAnim }]}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </Animated.View>

              {/* Google Sign Up Button */}
              <AnimatedTouchableOpacity 
                style={[styles.googleButton, { opacity: fadeAnim }]} 
                onPress={handleGoogleSignup}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </AnimatedTouchableOpacity>

              {/* Sign In Link */}
              <Animated.View style={[styles.signInContainer, { opacity: fadeAnim }]}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms & Privacy Policy
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <GrandPopup
        visible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
        buttons={popupConfig.buttons}
        onDismiss={() => setShowPopup(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cba3ea',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingBottom: 40,
    minHeight: height - 100,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  logoContainer: {
    marginBottom: height * 0.015,
  },
  logoWrapper: {
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#9051c3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appTitle: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: '#9051c3',
    marginBottom: 6,
    // textShadowColor: 'rgba(144, 81, 195, 0.3)',
    // textShadowOffset: { width: 0, height: 2 },
    // textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  subText: {
    fontSize: Math.min(width * 0.035, 13),
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 2,
  },
  signupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: width * 0.06,
    marginHorizontal: width * 0.02,
    shadowColor: '#9051c3',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    flex: 1,
  },
  signupTitle: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#9051c3',
    textAlign: 'center'
  },
  signupSubtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.025,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: height * 0.018,
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#9051c3',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: Math.min(width * 0.035, 15),
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    color: '#333',
  },
  signupButton: {
    borderRadius: 18,
    backgroundColor: '#9051c3',
    marginTop: height * 0.015,
    shadowColor: '#9051c3',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    minHeight: 54,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.025,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(144, 81, 195, 0.2)',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: Math.min(width * 0.03, 12),
    color: '#999',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(144, 81, 195, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginBottom: height * 0.018,
    minHeight: 54,
    shadowColor: '#9051c3',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#444',
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.015,
    flexWrap: 'wrap',
  },
  signInText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
  },
  signInLink: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#9051c3',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: height * 0.04,
    paddingBottom: 20,
    paddingHorizontal: width * 0.05,
  },
  footerText: {
    fontSize: Math.min(width * 0.03, 12),
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
  eyeButton: {
    padding: 4,
    borderRadius: 12,
  },
});