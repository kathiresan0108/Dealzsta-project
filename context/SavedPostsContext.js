import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedPostsContext = createContext();

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved posts from AsyncStorage on app start
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const savedPostsData = await AsyncStorage.getItem('savedPosts');
      if (savedPostsData) {
        setSavedPosts(JSON.parse(savedPostsData));
      }
    } catch (error) {
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePosts = async (posts) => {
    try {
      await AsyncStorage.setItem('savedPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  const savePost = (post) => {
    const updatedPosts = [...savedPosts, { ...post, savedAt: new Date().toISOString() }];
    setSavedPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const unsavePost = (postId) => {
    const updatedPosts = savedPosts.filter(post => post.id !== postId);
    setSavedPosts(updatedPosts);
    savePosts(updatedPosts);
  };

  const isPostSaved = (postId) => {
    return savedPosts.some(post => post.id === postId);
  };

  const toggleSavePost = (post) => {
    if (isPostSaved(post.id)) {
      unsavePost(post.id);
      return false; // Post was unsaved
    } else {
      savePost(post);
      return true; // Post was saved
    }
  };

  const value = {
    savedPosts,
    loading,
    savePost,
    unsavePost,
    isPostSaved,
    toggleSavePost,
  };

  return (
    <SavedPostsContext.Provider value={value}>
      {children}
    </SavedPostsContext.Provider>
  );
};