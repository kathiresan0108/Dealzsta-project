import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CreatePost from './CreatePost';
import CreateEvent from './CreateEvent';

const { width } = Dimensions.get('window');

export default function CreatePostTabsScreen() {
  const [activeTab, setActiveTab] = useState('post');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6C63FF", "#B19CD9"]}
        style={styles.tabHeader}
      >
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'post' && styles.activeTab]}
            onPress={() => setActiveTab('post')}
          >
            <Text style={[styles.tabText, activeTab === 'post' && styles.activeTabText]}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'event' && styles.activeTab]}
            onPress={() => setActiveTab('event')}
          >
            <Text style={[styles.tabText, activeTab === 'event' && styles.activeTabText]}>Event</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {activeTab === 'post' ? <CreatePost /> : <CreateEvent />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  tabHeader: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  activeTabText: {
    color: '#6C63FF',
  },
  contentContainer: {
    flex: 1,
  },
});
