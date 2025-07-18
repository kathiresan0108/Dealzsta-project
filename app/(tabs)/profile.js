import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSavedPosts } from '@/context/SavedPostsContext';
import { useRouter } from 'expo-router';
import { Settings, Edit, Grid, Bookmark } from 'lucide-react-native';
import { generateSamplePosts } from '@/utils/sampleData';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState(generateSamplePosts(6));
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { savedPosts, loading } = useSavedPosts();
  const router = useRouter();

  const handlePostPress = (post) => {
    router.push(`/post/${post.id}`);
  };

  // Navigation handlers for followers/following
  const handleFollowersPress = () => {
    router.push({
      pathname: '/followers-following',
      params: { 
        tab: 'followers',
        userId: user?.id 
      }
    });
  };

  const handleFollowingPress = () => {
    router.push({
      pathname: '/followers-following',
      params: { 
        tab: 'following',
        userId: user?.id 
      }
    });
  };

  const renderPostsGrid = (posts) => {
    if (posts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Grid size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
            {activeTab === 'posts' ? 'No posts yet' : 'No saved posts yet'}
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
            {activeTab === 'posts' 
              ? 'Share your first post to get started!' 
              : 'Posts you save will appear here'}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.postsGrid}>
        {posts.map((post, index) => (
          <TouchableOpacity
            key={`${post.id}-${index}`}
            style={styles.postItem}
            onPress={() => handlePostPress(post)}
          >
            <Image source={{ uri: post.image }} style={styles.postImage} />
            {activeTab === 'saved' && (
              <View style={styles.savedIndicator}>
                <Bookmark size={16} color="#fff" fill="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.username, { color: theme.text }]}>{user?.name}</Text>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Settings size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Image source={{ uri: user?.avatar }} style={styles.profileImage} />
            
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{userPosts.length}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t.posts || 'Posts'}</Text>
              </View>
              
              {/* Clickable Followers */}
              <TouchableOpacity style={styles.stat} onPress={handleFollowersPress}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{user?.followers || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t.followers || 'Followers'}</Text>
              </TouchableOpacity>
              
              {/* Clickable Following */}
              <TouchableOpacity style={styles.stat} onPress={handleFollowingPress}>
                <Text style={[styles.statNumber, { color: theme.text }]}>{user?.following || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t.following || 'Following'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text style={[styles.displayName, { color: theme.text }]}>{user?.name}</Text>
            {user?.bio && (
              <Text style={[styles.bio, { color: theme.textSecondary }]}>{user.bio}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push('/edit-profile')}
          >
            <Edit size={16} color={theme.text} />
            <Text style={[styles.editButtonText, { color: theme.text }]}>{t.edit_profile || 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && { borderBottomColor: theme.primary }]}
            onPress={() => setActiveTab('posts')}
          >
            <Grid size={20} color={activeTab === 'posts' ? theme.primary : theme.textSecondary} />
            <Text style={[
              styles.tabLabel, 
              { color: activeTab === 'posts' ? theme.primary : theme.textSecondary }
            ]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && { borderBottomColor: theme.primary }]}
            onPress={() => setActiveTab('saved')}
          >
            <Bookmark size={20} color={activeTab === 'saved' ? theme.primary : theme.textSecondary} />
            <Text style={[
              styles.tabLabel, 
              { color: activeTab === 'saved' ? theme.primary : theme.textSecondary }
            ]}>
              Saved ({savedPosts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Loading...
              </Text>
            </View>
          ) : (
            <>
              {activeTab === 'posts' ? (
                renderPostsGrid(userPosts)
              ) : (
                renderPostsGrid(savedPosts)
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 24,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    paddingVertical: 4, // Added padding for better touch target
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  bioSection: {
    marginBottom: 16,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postItem: {
    width: '32.66%',
    aspectRatio: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  savedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});