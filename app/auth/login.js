import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  Platform,
  SafeAreaView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import GrandPopup from '@/components/common/GrandPopup';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const { t } = useLanguage();

  // Animation refs
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const googleButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const loadingSpinAnim = useRef(new Animated.Value(0)).current;
  const emailInputAnim = useRef(new Animated.Value(0)).current;
  const passwordInputAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: '#9051c3',
    primaryLight: '#a66bcf',
    primaryDark: '#7a3fb5',
    background: '#cba3ea',
    white: '#FFFFFF',
    black: '#000000',
    darkGray: '#333333',
    lightGray: '#E8E8E8',
    success: '#4CAF50',
    error: '#FF5722',
    shadow: 'rgba(144, 81, 195, 0.3)',
    googleBlue: '#4285F4',
    glow: 'rgba(144, 81, 195, 0.6)',
    shimmer: 'rgba(255, 255, 255, 0.3)'
  };

  useEffect(() => {
    // Simple entrance animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pulse for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animateLoading = () => {
    Animated.loop(
      Animated.timing(loadingSpinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    Animated.spring(emailInputAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    Animated.spring(emailInputAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    Animated.spring(passwordInputAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    Animated.spring(passwordInputAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleGoogleButtonPressIn = () => {
    Animated.spring(googleButtonScaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleGoogleButtonPressOut = () => {
    Animated.spring(googleButtonScaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

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
    animateLoading();

    setTimeout(async () => {
      try {
        const userData = {
          id: '1',
          email,
          name: 'John Doe',
          accountType: 'user',
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
        loadingSpinAnim.setValue(0);
      }
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    animateLoading();
    
    setTimeout(async () => {
      try {
        const userData = {
          id: '2',
          email: 'user@gmail.com',
          name: 'Google User',
          accountType: 'user',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          verified: true,
          followers: 856,
          following: 432,
          posts: 67,
          provider: 'google'
        };

        await login(userData);
        router.replace('/(tabs)');
      } catch (error) {
        setPopupConfig({
          title: 'Google Sign-In Failed',
          message: 'Unable to sign in with Google. Please try again.',
          type: 'error',
          buttons: [
            { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
          ]
        });
        setShowPopup(true);
      } finally {
        setGoogleLoading(false);
        loadingSpinAnim.setValue(0);
      }
    }, 1500);
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const loadingSpin = loadingSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const emailInputScale = emailInputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02]
  });

  const passwordInputScale = passwordInputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02]
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width]
  });

  const GoogleIcon = () => (
    <View style={styles.googleIcon}>
      <Text style={styles.googleIconText}>G</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View 
            style={[
              styles.container,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            {/* Animated Background Elements */}
            <View style={styles.backgroundElements}>
              <Animated.View 
                style={[
                  styles.backgroundCircle1,
                  { transform: [{ rotate: logoRotation }] }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.backgroundCircle2,
                  { transform: [{ rotate: logoRotation }] }
                ]} 
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Animated.View 
                style={[
                  styles.logo,
                  {
                    transform: [
                      { scale: logoScaleAnim },
                      { scale: pulseAnim }
                    ]
                  }
                ]}
              >
                <Image
                  source={require('../../assets/images/logo.png')}
                  // Or for local images: source={require('./assets/logo.png')}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </Animated.View>
              <Text style={styles.appTitle}>Dealzsta</Text>
              {/* <Text style={styles.appSubtitle}>{t.welcome || 'Welcome Back'}</Text> */}
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.formWrapper}>
                <Animated.View 
                  style={[
                    styles.loginCard,
                    {
                      transform: [{ scale: cardScaleAnim }]
                    }
                  ]}
                >
                  <Text style={styles.formTitle}>Login</Text>
                  
                  {/* Email Input */}
                  <Animated.View 
                    style={[
                      styles.inputWrapper,
                      emailFocused && styles.inputWrapperFocused,
                      {
                        transform: [{ scale: emailInputScale }]
                      }
                    ]}
                  >
                    <Ionicons 
                      name="mail-outline" 
                      size={18} 
                      color={emailFocused ? colors.primaryLight : colors.primary} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor={colors.darkGray}
                      value={email}
                      onChangeText={setEmail}
                      onFocus={handleEmailFocus}
                      onBlur={handleEmailBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </Animated.View>

                  {/* Password Input */}
                  <Animated.View 
                    style={[
                      styles.inputWrapper,
                      passwordFocused && styles.inputWrapperFocused,
                      {
                        transform: [{ scale: passwordInputScale }]
                      }
                    ]}
                  >
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={18} 
                      color={passwordFocused ? colors.primaryLight : colors.primary} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor={colors.darkGray}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      secureTextEntry={!showPassword}
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={18} 
                        color={passwordFocused ? colors.primaryLight : colors.primary} 
                      />
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Forgot Password */}
                  <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => router.push('/auth/forgot-password')}
                  >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                    <TouchableOpacity
                      style={[
                        styles.loginButton,
                        loading && styles.loginButtonLoading
                      ]}
                      onPress={handleLogin}
                      onPressIn={handleButtonPressIn}
                      onPressOut={handleButtonPressOut}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View 
                            style={[
                              styles.loadingIcon,
                              { transform: [{ rotate: loadingSpin }] }
                            ]}
                          >
                            <Ionicons name="reload-outline" size={18} color={colors.white} />
                          </Animated.View>
                          <Text style={styles.loginButtonText}>Signing In...</Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <Text style={styles.loginButtonText}>
                            {t.login || 'Sign In'}
                          </Text>
                          <Ionicons name="arrow-forward" size={18} color={colors.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Sign Up Link */}
                  <TouchableOpacity
                    style={styles.signupContainer}
                    onPress={() => router.push('/auth/signup')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.signupText}>
                      Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
                    </Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google Button */}
                  <Animated.View style={{ transform: [{ scale: googleButtonScaleAnim }] }}>
                    <TouchableOpacity
                      style={[
                        styles.googleButton,
                        googleLoading && styles.googleButtonLoading
                      ]}
                      onPress={handleGoogleLogin}
                      onPressIn={handleGoogleButtonPressIn}
                      onPressOut={handleGoogleButtonPressOut}
                      disabled={googleLoading}
                      activeOpacity={0.8}
                    >
                      {googleLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View 
                            style={[
                              styles.loadingIcon,
                              { transform: [{ rotate: loadingSpin }] }
                            ]}
                          >
                            <Ionicons name="reload-outline" size={16} color={colors.darkGray} />
                          </Animated.View>
                          <Text style={styles.googleButtonText}>Signing in...</Text>
                        </View>
                      ) : (
                        <View style={styles.googleButtonContent}>
                          <GoogleIcon />
                          <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </Animated.View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms & Privacy Policy
              </Text>
            </View>
          </Animated.View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#9051c3',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#9051c3',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    minHeight: height,
  },
  
  // Background Elements
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  backgroundCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(144, 81, 195, 0.1)',
    top: -75,
    right: -75,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(144, 81, 195, 0.08)',
    bottom: -50,
    left: -50,
  },
  
  // Header
  header: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    flex: 0.25,
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#cba3ea',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Form Container
  formContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: width * 0.88,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(95, 75, 139, 0.1)',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#9051c3',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },

  // Input Styles
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#9051c3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(144, 81, 195, 0.2)',
  },
  inputWrapperFocused: {
    borderColor: '#9051c3',
    shadowColor: '#9051c3',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 8,
  },

  // Forgot Password
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#9051c3',
    fontWeight: '600',
  },

  // Login Button
  loginButton: {
    backgroundColor: '#9051c3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#9051c3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonLoading: {
    backgroundColor: '#a66bcf',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingIcon: {
    // Animation styles handled by Animated.View
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Sign Up
  signupContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  signupText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  signupLink: {
    color: '#9051c3',
    fontWeight: '700',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(144, 81, 195, 0.3)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9051c3',
    fontWeight: '600',
  },

  // Google Button
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(144, 81, 195, 0.2)',
    paddingHorizontal: 16,
  },
  googleButtonLoading: {
    backgroundColor: '#F8F8F8',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#9051c3',
    fontWeight: '600',
  },
  googleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#9051c3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Footer
  footer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  footerText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
});