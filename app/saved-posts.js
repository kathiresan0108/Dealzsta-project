import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark } from 'lucide-react-native';
import { generateSamplePosts } from '@/utils/sampleData';

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Simulate loading saved posts
    const posts = generateSamplePosts(8).map(post => ({ ...post, isSaved: true }));
    setSavedPosts(posts);
  }, []);

  const handlePostPress = (postId) => {
    router.push(`/post/${postId}`);
  };

  const handleUnsave = (postId) => {
    setSavedPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Saved Posts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {savedPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Bookmark size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Saved Posts</Text>
            <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
              Posts you save will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.postsGrid}>
            {savedPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postItem}
                onPress={() => handlePostPress(post.id)}
              >
                <Image source={{ uri: post.image }} style={styles.postImage} />
                <TouchableOpacity
                  style={[styles.unsaveButton, { backgroundColor: theme.cardBackground }]}
                  onPress={() => handleUnsave(post.id)}
                >
                  <Bookmark size={16} color={theme.primary} fill={theme.primary} />
                </TouchableOpacity>
                <View style={[styles.postInfo, { backgroundColor: theme.cardBackground }]}>
                  <Text style={[styles.postTitle, { color: theme.text }]} numberOfLines={2}>
                    {post.title}
                  </Text>
                  <Text style={[styles.postPrice, { color: theme.success }]}>
                    ₹{post.discountPrice}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  postItem: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  unsaveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    padding: 12,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  postPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});