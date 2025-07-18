import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, User, MapPin, Link, Calendar, Phone, CheckCircle } from 'lucide-react-native';
import GrandPopup from '@/components/common/GrandPopup';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    website: '',
    location: '',
    dateOfBirth: '',
    phoneNumber: '',
    avatar: null,
    interests: [],
    accountType: 'personal', // personal, business, creator
    isPrivate: false,
    allowMessaging: true,
    showOnlineStatus: true,
    allowTagging: true,
    showActivity: true,
    gender: '',
    profession: '',
    relationship: '',
  });
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const { t } = useLanguage();

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Custom'];
  const relationshipOptions = ['Single', 'In a relationship', 'Married', 'It\'s complicated', 'Prefer not to say'];
  const interestOptions = ['Technology', 'Travel', 'Photography', 'Music', 'Sports', 'Art', 'Food', 'Fashion', 'Gaming', 'Reading', 'Movies', 'Fitness'];
  const accountTypes = [
    { type: 'personal', icon: '👤', title: 'Personal', description: 'Connect with friends and family' },
    { type: 'business', icon: '🏢', title: 'Business', description: 'Promote your brand or business' },
    { type: 'creator', icon: '✨', title: 'Creator', description: 'Share your content and build audience' }
  ];

  const steps = [
    { title: 'Basic Info', subtitle: 'Tell us about yourself' },
    { title: 'Account Type', subtitle: 'Choose your account type' },
    { title: 'Interests', subtitle: 'What are you interested in?' },
    { title: 'Privacy Settings', subtitle: 'Control your privacy' },
    { title: 'Personal Details', subtitle: 'Additional information (optional)' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check username availability
    if (field === 'username' && value.length > 2) {
      setTimeout(() => {
        const unavailableUsernames = ['admin', 'test', 'user', 'instagram', 'facebook'];
        setUsernameAvailable(!unavailableUsernames.includes(value.toLowerCase()));
      }, 500);
    }
  };

  const handleAvatarUpload = () => {
    const sampleAvatars = [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    ];
    const selectedAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    handleInputChange('avatar', selectedAvatar);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.name.trim()) {
          showError('Please enter your name');
          return false;
        }
        if (!formData.username.trim()) {
          showError('Please choose a username');
          return false;
        }
        if (usernameAvailable === false) {
          showError('Username is not available');
          return false;
        }
        return true;
      case 1:
        return true; // Account type is optional
      case 2:
        if (formData.interests.length < 3) {
          showError('Please select at least 3 interests');
          return false;
        }
        return true;
      case 3:
        return true; // Privacy settings are optional
      case 4:
        return true; // Personal details are optional
      default:
        return true;
    }
  };

  const showError = (message) => {
    setPopupConfig({
      title: 'Error',
      message,
      type: 'error',
      buttons: [
        { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
      ]
    });
    setShowPopup(true);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const userData = {
        id: '1',
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        avatar: formData.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        email: 'user@example.com',
        phoneNumber: formData.phoneNumber,
        accountType: formData.accountType,
        interests: formData.interests,
        verified: formData.accountType === 'creator',
        followers: 0,
        following: 0,
        posts: 0,
        isPrivate: formData.isPrivate,
        allowMessaging: formData.allowMessaging,
        showOnlineStatus: formData.showOnlineStatus,
        allowTagging: formData.allowTagging,
        showActivity: formData.showActivity,
        gender: formData.gender,
        createdAt: new Date().toISOString(),
      };
      
      await login(userData);
      router.replace('/(tabs)');
    } catch (error) {
      showError('Failed to create profile. Please try again.');
    }
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderAccountType();
      case 2:
        return renderInterests();
      case 3:
        return renderPrivacySettings();
      case 4:
        return renderPersonalDetails();
      default:
        return null;
    }
  };

  const renderBasicInfo = () => (
    <View>
      {/* Avatar Upload */}
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarUpload}>
          {formData.avatar ? (
            <Image source={{ uri: formData.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.surface }]}>
              <User size={40} color={theme.textSecondary} />
            </View>
          )}
          <View style={[styles.cameraIcon, { backgroundColor: theme.primary }]}>
            <Camera size={16} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.avatarText, { color: theme.textSecondary }]}>Add Profile Photo</Text>
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
        placeholder="Full Name"
        placeholderTextColor={theme.textSecondary}
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <View style={styles.usernameContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Username"
          placeholderTextColor={theme.textSecondary}
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
          autoCapitalize="none"
        />
        {formData.username.length > 2 && (
          <View style={styles.usernameStatus}>
            {usernameAvailable === true && <CheckCircle size={16} color="#4CAF50" />}
            {usernameAvailable === false && <Text style={styles.unavailableText}>Not available</Text>}
          </View>
        )}
      </View>

      <TextInput
        style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
        placeholder="Bio (Tell people about yourself)"
        placeholderTextColor={theme.textSecondary}
        value={formData.bio}
        onChangeText={(value) => handleInputChange('bio', value)}
        multiline
        numberOfLines={3}
        maxLength={150}
      />
      <Text style={[styles.charCount, { color: theme.textSecondary }]}>
        {formData.bio.length}/150
      </Text>

      <View style={styles.inputWithIcon}>
        <Link size={20} color={theme.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithPadding, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Website"
          placeholderTextColor={theme.textSecondary}
          value={formData.website}
          onChangeText={(value) => handleInputChange('website', value)}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View style={styles.inputWithIcon}>
        <MapPin size={20} color={theme.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithPadding, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Location"
          placeholderTextColor={theme.textSecondary}
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
        />
      </View>
    </View>
  );

  const renderAccountType = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose Account Type</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        You can change this later in settings
      </Text>

      {accountTypes.map((account) => (
        <TouchableOpacity
          key={account.type}
          style={[
            styles.accountTypeCard,
            {
              backgroundColor: formData.accountType === account.type ? theme.primary + '20' : theme.surface,
              borderColor: formData.accountType === account.type ? theme.primary : theme.border,
            }
          ]}
          onPress={() => handleInputChange('accountType', account.type)}
        >
          <View style={styles.accountTypeContent}>
            <Text style={styles.accountTypeIcon}>{account.icon}</Text>
            <View style={styles.accountTypeInfo}>
              <Text style={[styles.accountTypeTitle, { color: theme.text }]}>{account.title}</Text>
              <Text style={[styles.accountTypeDescription, { color: theme.textSecondary }]}>
                {account.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderInterests = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Your Interests</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        Choose at least 3 interests to personalize your experience
      </Text>

      <View style={styles.interestsContainer}>
        {interestOptions.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestChip,
              {
                backgroundColor: formData.interests.includes(interest) ? theme.primary : theme.surface,
                borderColor: formData.interests.includes(interest) ? theme.primary : theme.border,
              }
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={[
                styles.interestText,
                { color: formData.interests.includes(interest) ? 'white' : theme.text }
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.selectedCount, { color: theme.textSecondary }]}>
        {formData.interests.length} selected (minimum 3)
      </Text>
    </View>
  );

  const renderPrivacySettings = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Privacy Settings</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        Control who can see your content and interact with you
      </Text>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Private Account</Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            Only approved followers can see your posts
          </Text>
        </View>
        <Switch
          value={formData.isPrivate}
          onValueChange={(value) => handleInputChange('isPrivate', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={formData.isPrivate ? 'white' : theme.textSecondary}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Allow Messaging</Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            Let others send you direct messages
          </Text>
        </View>
        <Switch
          value={formData.allowMessaging}
          onValueChange={(value) => handleInputChange('allowMessaging', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={formData.allowMessaging ? 'white' : theme.textSecondary}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Show Online Status</Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            Let others see when you're active
          </Text>
        </View>
        <Switch
          value={formData.showOnlineStatus}
          onValueChange={(value) => handleInputChange('showOnlineStatus', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={formData.showOnlineStatus ? 'white' : theme.textSecondary}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>Allow Tagging</Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            Let others tag you in posts and stories
          </Text>
        </View>
        <Switch
          value={formData.allowTagging}
          onValueChange={(value) => handleInputChange('allowTagging', value)}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={formData.allowTagging ? 'white' : theme.textSecondary}
        />
      </View>
    </View>
  );

  const renderPersonalDetails = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal Details</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        This information is optional and helps personalize your experience
      </Text>

      <View style={styles.inputWithIcon}>
        <Calendar size={20} color={theme.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithPadding, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Date of Birth (DD/MM/YYYY)"
          placeholderTextColor={theme.textSecondary}
          value={formData.dateOfBirth}
          onChangeText={(value) => handleInputChange('dateOfBirth', value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputWithIcon}>
        <Phone size={20} color={theme.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithPadding, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Phone Number"
          placeholderTextColor={theme.textSecondary}
          value={formData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
          keyboardType="phone-pad"
        />
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
        placeholder="Profession"
        placeholderTextColor={theme.textSecondary}
        value={formData.profession}
        onChangeText={(value) => handleInputChange('profession', value)}
      />

      <View style={styles.pickerContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Gender (Optional)</Text>
        <View style={styles.optionsRow}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                {
                  backgroundColor: formData.gender === option ? theme.primary : theme.surface,
                  borderColor: formData.gender === option ? theme.primary : theme.border,
                }
              ]}
              onPress={() => handleInputChange('gender', option)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: formData.gender === option ? 'white' : theme.text }
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: 'white' }]}>{steps[currentStep].title}</Text>
            <Text style={[styles.subtitle, { color: 'white' }]}>{steps[currentStep].subtitle}</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: index <= currentStep ? 'white' : 'rgba(255,255,255,0.3)',
                      width: index <= currentStep ? 24 : 8,
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
            {renderStepContent()}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.backButton, { backgroundColor: theme.surface }]}
                onPress={handlePrevious}
              >
                <Text style={[styles.backButtonText, { color: theme.text }]}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton, { backgroundColor: theme.primary }]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Complete Profile' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
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
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  inputWithIcon: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 15,
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: 48,
    marginBottom: 0,
  },
  usernameContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  usernameStatus: {
    position: 'absolute',
    right: 16,
    top: 17,
  },
  unavailableText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  accountTypeCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  accountTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountTypeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  accountTypeInfo: {
    flex: 1,
  },
  accountTypeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  accountTypeDescription: {
    fontSize: 14,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  backButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nextButton: {
    // Primary button styling handled by backgroundColor
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});