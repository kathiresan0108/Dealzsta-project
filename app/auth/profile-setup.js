import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, User } from 'lucide-react-native';
import GrandPopup from '@/components/common/GrandPopup';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: null,
    interests: [],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const { t } = useLanguage();

  const interestOptions = ['food', 'fashion', 'electronics', 'beauty', 'sports', 'automotive', 'health', 'home', 'travel'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAvatarUpload = () => {
    // Simulate avatar upload
    const sampleAvatars = [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    ];
    const selectedAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    handleInputChange('avatar', selectedAvatar);
  };

  const handleComplete = async () => {
    if (!formData.name.trim()) {
      setPopupConfig({
        title: 'Error',
        message: 'Please enter your name',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
      return;
    }

    try {
      const userData = {
        id: '1',
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        email: 'user@example.com',
        accountType: 'user',
        interests: formData.interests,
        verified: false,
        followers: 0,
        following: 0,
        posts: 0
      };
      
      await login(userData);
      router.replace('/(tabs)');
    } catch (error) {
      setPopupConfig({
        title: 'Error',
        message: 'Failed to create profile. Please try again.',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
    }
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Tell us about yourself</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
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
              placeholder="Your Name"
              placeholderTextColor={theme.textSecondary}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />

            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Tell us about yourself (optional)"
              placeholderTextColor={theme.textSecondary}
              value={formData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              multiline
              numberOfLines={3}
            />

            {/* Interests Selection */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Your Interests</Text>
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
                  onPress={() => handleInterestToggle(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      { color: formData.interests.includes(interest) ? 'white' : theme.text }
                    ]}
                  >
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.completeButton, { backgroundColor: theme.primary }]}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>Complete Profile</Text>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  completeButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});