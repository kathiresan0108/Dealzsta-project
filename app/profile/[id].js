import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NUM_COLUMNS = 3;
const POST_IMAGE_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

const mockUsers = {
  kathiresan: {
    username: 'kathiresan',
    verified: true,
    name: 'Kathir Yoyo',
    bio: 'Welcome to my Instagram profile! 📸🌟',
    website: 'https://yourwebsite.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    postsCount: 128,
    followersCount: 2300,
    followingCount: 180,
    posts: [
      { id: '1', image: 'https://placekitten.com/300/300' },
      { id: '2', image: 'https://placekitten.com/301/300' },
      { id: '3', image: 'https://placekitten.com/302/300' },
      { id: '4', image: 'https://placekitten.com/303/300' },
      { id: '5', image: 'https://placekitten.com/304/300' },
      { id: '6', image: 'https://placekitten.com/305/300' },
    ],
  },
  john: {
    username: 'john',
    verified: false,
    name: 'John Doe',
    bio: 'Traveler ✈️ | Photographer 📷',
    website: 'https://johndoe.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    postsCount: 34,
    followersCount: 980,
    followingCount: 150,
    posts: [
      { id: '1', image: 'https://placekitten.com/310/300' },
      { id: '2', image: 'https://placekitten.com/311/300' },
    ],
  },
};

export default function InstagramProfile() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const foundUser = mockUsers[username];
    if (foundUser) {
      setUser(foundUser);
    } else {
      setUser(null); // Or navigate to 404 page
    }
  }, [username]);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 18, color: '#666' }}>User not found</Text>
      </View>
    );
  }

  const renderPost = ({ item }) => (
    <Image source={{ uri: item.image }} style={styles.postImage} />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.userInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.username}>{user.username}</Text>
          {user.verified && (
            <Ionicons name="checkmark-circle" size={16} color="#3897f0" style={{ marginLeft: 6 }} />
          )}
        </View>

        <TouchableOpacity style={styles.editProfileBtn}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        {user.website && <Text style={styles.website}>{user.website}</Text>}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons
            name="grid-outline"
            size={24}
            color={activeTab === 'posts' ? '#000' : '#8e8e8e'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'reels' && styles.activeTab]}
          onPress={() => setActiveTab('reels')}
        >
          <Ionicons
            name="film-outline"
            size={24}
            color={activeTab === 'reels' ? '#000' : '#8e8e8e'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'tagged' && styles.activeTab]}
          onPress={() => setActiveTab('tagged')}
        >
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={activeTab === 'tagged' ? '#000' : '#8e8e8e'}
          />
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' && (
        <FlatList
          data={user.posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          style={{ marginBottom: 80 }}
        />
      )}

      {(activeTab === 'reels' || activeTab === 'tagged') && (
        <View style={styles.emptyState}>
          <Text style={{ color: '#8e8e8e' }}>No content yet.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTop: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#ccc',
  },
  backButton: { padding: 6 },
  headerTitle: { fontWeight: 'bold', fontSize: 20 },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  stat: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 18 },
  statLabel: { fontSize: 14, color: '#8e8e8e' },
  userInfo: { paddingHorizontal: 16, paddingBottom: 16 },
  username: { fontWeight: 'bold', fontSize: 20 },
  editProfileBtn: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editProfileText: { fontWeight: '600', fontSize: 16 },
  name: { fontWeight: '600', fontSize: 16 },
  bio: { marginTop: 4, fontSize: 14, color: '#262626' },
  website: { color: '#00376b', marginTop: 2, fontSize: 14 },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#000' },
  postImage: { width: POST_IMAGE_SIZE, height: POST_IMAGE_SIZE, margin: 0.5 },
  emptyState: { padding: 40, alignItems: 'center' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
