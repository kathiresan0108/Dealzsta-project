import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { useRouter } from 'expo-router';
import { Bookmark, MessageCircle, MapPin, Bell } from 'lucide-react-native';
import logo from '../../assets/images/icon.png';


export default function HeaderComponent() {
  const { theme } = useTheme();
  const { address } = useLocation();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topRow}>
        {/* Replace App Name with Logo */}
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => router.push('/saved-posts')}>
            <Bookmark size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/messages')}>
            <MessageCircle size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationRow}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={theme.textSecondary} />
          <TextInput
            style={[styles.locationInput, { color: theme.text }]}
            value={address || 'Select location'}
            placeholder="Select location"
            placeholderTextColor={theme.textSecondary}
            editable={false}
          />
        </View>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Bell size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 32,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
  },
});
