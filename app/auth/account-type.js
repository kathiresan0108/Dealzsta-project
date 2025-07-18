
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, Store } from 'lucide-react-native';

export default function AccountType() {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();

  const handleContinue = async () => {
    if (!selectedType) return;

    const updatedUser = { ...user, accountType: selectedType };
    await updateUser(updatedUser); // ✅ Wait for the update to complete

    if (selectedType === 'business') {
      router.push('/auth/business-verification');
    } else {
      router.push('/auth/profile-setup');
    }
  };

  const AccountOption = ({ icon, title, description, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: theme.cardBackground,
          borderColor: isSelected ? theme.primary : theme.border,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={isSelected ? theme.gradient : [theme.surface, theme.surface]}
        style={styles.iconContainer}
      >
        {icon}
      </LinearGradient>
      <Text style={[styles.optionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Choose Account Type</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Select the type that best describes you
          </Text>
        </View>

        <View style={styles.options}>
          <AccountOption
            icon={<User size={32} color={selectedType === 'user' ? theme.primary : theme.textSecondary} />}
            title={t.user || 'User'}
            description="Discover and claim amazing deals near you"
            isSelected={selectedType === 'user'}
            onPress={() => setSelectedType('user')}
          />

          <AccountOption
            icon={<Store size={32} color={selectedType === 'business' ? theme.primary : theme.textSecondary} />}
            title={t.business || 'Business'}
            description="Promote your business and create deals for customers"
            isSelected={selectedType === 'business'}
            onPress={() => setSelectedType('business')}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: selectedType ? theme.primary : theme.border,
              opacity: selectedType ? 1 : 0.5,
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedType}
        >
          <Text style={[styles.continueButtonText, { color: theme.buttonText || '#fff' }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  },
  options: {
    gap: 20,
    marginBottom: 40,
  },
  option: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  continueButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});