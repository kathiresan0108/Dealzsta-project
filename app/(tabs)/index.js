import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
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
    // Simulate API call
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
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
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
  };

  const handleComment = (postId) => {
    router.push(`/post/${postId}/comments`);
    // Navigate to post detail for comments
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId) => {
    // Implement share functionality
    console.log('Share post:', postId);
  };

const handleClaim = (postId) => {
  console.log('Claim post:', postId);
  router.push('/scanner');
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderComponent />
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
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