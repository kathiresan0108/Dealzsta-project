// EventHeader.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

export default function EventHeader({ searchQuery, setSearchQuery }) {
  return (
    <View style={styles.headerContainer}>
      {/* Top Row: Location and Profile */}
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="#000" />
          <View>
            <Text style={styles.locationTitle}>Mani Nagar <MaterialIcons name="keyboard-arrow-down" size={18} /></Text>
            <Text style={styles.locationSubtitle}>Toovipuram, Thoothukudi</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/100/user-male-circle.png' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for 'A. R. Rahman'"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  locationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: -2,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 15,
    flex: 1,
  },
});