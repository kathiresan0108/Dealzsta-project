import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Globe, Palette, LogOut, Shield, Bell, User } from 'lucide-react-native';
import GrandPopup from '@/components/common/GrandPopup';

export default function Settings() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const languages = {
    en: 'English',
    ta: 'Tamil',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    hi: 'हिन्दी'
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const SettingItem = ({ icon, title, onPress, rightComponent, subtitle }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        {icon}
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            try {
              router.back();
            } catch (e) {
              router.replace('/profile'); // optional fallback
            }
          }}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t.settings}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>

          <SettingItem
            icon={<Globe size={20} color={theme.primary} />}
            title={t.change_language}
            subtitle={languages[currentLanguage]}
            onPress={() => setShowLanguageModal(true)}
          />

          <SettingItem
            icon={<Palette size={20} color={theme.primary} />}
            title={t.theme}
            subtitle={isDark ? 'Dark' : 'Light'}
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={isDark ? 'white' : theme.surface}
              />
            }
          />

          <SettingItem
            icon={<Bell size={20} color={theme.primary} />}
            title={t.notifications}
            subtitle="Manage notification preferences"
            onPress={() => console.log('Notifications settings')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>

          <SettingItem
            icon={<User size={20} color={theme.primary} />}
            title="Account Settings"
            subtitle="Privacy, security, and account info"
            onPress={() => console.log('Account settings')}
          />

          <SettingItem
            icon={<Shield size={20} color={theme.primary} />}
            title="Privacy & Security"
            subtitle="Control your privacy settings"
            onPress={() => console.log('Privacy settings')}
          />
        </View>

        <View style={styles.section}>
          <SettingItem
            icon={<LogOut size={20} color={theme.error} />}
            title={t.logout}
            subtitle="Sign out of your account"
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>

      {/* Language Modal */}
      <GrandPopup
        visible={showLanguageModal}
        title="Select Language"
        onDismiss={() => setShowLanguageModal(false)}
        buttons={[
          ...availableLanguages.map(lang => ({
            text: languages[lang],
            style: currentLanguage === lang ? 'primary' : 'secondary',
            onPress: () => {
              changeLanguage(lang);
              setShowLanguageModal(false);
            }
          })),
          {
            text: 'Cancel',
            style: 'secondary',
            onPress: () => setShowLanguageModal(false)
          }
        ]}
      />

      {/* Logout Modal */}
      <GrandPopup
        visible={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        type="warning"
        buttons={[
          {
            text: 'Cancel',
            style: 'secondary',
            onPress: () => setShowLogoutModal(false)
          },
          {
            text: 'Logout',
            style: 'primary',
            onPress: () => {
              setShowLogoutModal(false);
              handleLogout();
            }
          }
        ]}
        onDismiss={() => setShowLogoutModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
