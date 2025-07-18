import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';

// Sample data generator for followers/following
const generateSampleUsers = (count = 20) => {
  const users = [];
  const sampleNames = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
    'Emily Davis', 'Chris Miller', 'Lisa Garcia', 'Tom Anderson', 'Amy Taylor',
    'Ryan Martinez', 'Jessica Thompson', 'Kevin White', 'Michelle Lee', 'Daniel Clark',
    'Ashley Rodriguez', 'Jason Lewis', 'Amanda Walker', 'Brandon Hall', 'Stephanie Young'
  ];
  
  const sampleBios = [
    '📸 Photography enthusiast', '🎨 Digital artist', '✈️ Travel blogger', 
    '🍕 Food lover', '💪 Fitness coach', '📚 Book reader', '🎵 Music producer',
    '👗 Fashion designer', '🌱 Plant parent', '🏃‍♂️ Marathon runner'
  ];

  for (let i = 0; i < count; i++) {
    users.push({
      id: `user_${i + 1}`,
      name: sampleNames[i % sampleNames.length],
      username: `@${sampleNames[i % sampleNames.length].toLowerCase().replace(' ', '')}${i + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      bio: sampleBios[i % sampleBios.length],
      isFollowing: Math.random() > 0.3, // 70% chance of following
      isFollowedBy: Math.random() > 0.5, // 50% chance of being followed back
    });
  }
  return users;
};

export default function FollowersFollowing() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get the tab and userId from route params
  const { tab = 'followers', userId } = params;
  
  const [activeTab, setActiveTab] = useState(tab);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleFollowers = generateSampleUsers(15);
      const sampleFollowing = generateSampleUsers(12);
      
      setFollowers(sampleFollowers);
      setFollowing(sampleFollowing);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const users = activeTab === 'followers' ? followers : following;
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, activeTab, followers, following]);

  const handleFollowToggle = (targetUserId) => {
    const updateUsers = (users) => 
      users.map(user => 
        user.id === targetUserId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      );

    if (activeTab === 'followers') {
      setFollowers(updateUsers);
    } else {
      setFollowing(updateUsers);
    }
  };

  const handleUserPress = (user) => {
    router.push(`/profile/${user.id}`);
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.userItem, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleUserPress(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.userUsername, { color: theme.textSecondary }]}>{item.username}</Text>
        {item.bio && (
          <Text style={[styles.userBio, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.bio}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.followButton,
          {
            backgroundColor: item.isFollowing ? theme.surface : theme.primary,
            borderColor: item.isFollowing ? theme.border : theme.primary,
          }
        ]}
        onPress={() => handleFollowToggle(item.id)}
      >
        <Text style={[
          styles.followButtonText,
          { color: item.isFollowing ? theme.text : '#fff' }
        ]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
        {searchQuery ? 'No users found' : `No ${activeTab} yet`}
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
        {searchQuery 
          ? 'Try searching with different keywords'
          : `${activeTab === 'followers' ? 'People who follow you' : 'People you follow'} will appear here`
        }
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {userId === user?.id ? user?.name : 'User'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search users..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('followers')}
        >
          <Text style={[
            styles.tabLabel, 
            { color: activeTab === 'followers' ? theme.primary : theme.textSecondary }
          ]}>
            {followers.length} Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[
            styles.tabLabel, 
            { color: activeTab === 'following' ? theme.primary : theme.textSecondary }
          ]}>
            {following.length} Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading {activeTab}...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  listContainer: {
    paddingVertical: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    marginBottom: 2,
  },
  userBio: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});