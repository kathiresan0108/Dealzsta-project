import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';
import HeaderComponent from '@/components/home/HeaderComponent';
import CategoryFilter from '@/components/home/CategoryFilter';
import PostCard from '@/components/home/PostCard';
import { generateSamplePosts } from '@/utils/sampleData';
import { useRouter } from 'expo-router';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const { location } = useLocation();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setRefreshing(true);
    setTimeout(() => {
      const samplePosts = generateSamplePosts(20, selectedCategory);
      setPosts(samplePosts);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    loadPosts();
  };

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
    // No Alert added here, as per your request
  };

  const handleComment = (postId, commentText) => {
    if (commentText) {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );
      console.log('Comment added to post:', postId, commentText);
    } else {
      router.push(`/post/${postId}/comments`);
    }
  };

  const handleShare = (postId) => {
    console.log('Share post:', postId);
  };

  const handleClaim = (postId) => {
    console.log('Claim post:', postId);
    router.push('/scanner');
  };

  const handleFollowToggle = async (userId) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.user.id === userId) {
            const currentStatus = post.user.followStatus;
            const isPrivate = post.user.isPrivate;

            let newStatus;
            let newFollowersCount = post.user.followersCount || 0;

            switch (currentStatus) {
              case 'following':
                newStatus = 'not_following';
                newFollowersCount = Math.max(0, newFollowersCount - 1);
                break;
              case 'requested':
                newStatus = 'not_following';
                break;
              case 'not_following':
              default:
                if (isPrivate) {
                  newStatus = 'requested';
                } else {
                  newStatus = 'following';
                  newFollowersCount += 1;
                }
                break;
            }

            return {
              ...post,
              user: {
                ...post.user,
                followStatus: newStatus,
                followersCount: newFollowersCount,
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Follow toggle error:', error);
      Alert.alert('Error', 'Failed to update follow status. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <HeaderComponent />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
              onClaim={handleClaim}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  postsContainer: {
    paddingBottom: 20,
  },
});
