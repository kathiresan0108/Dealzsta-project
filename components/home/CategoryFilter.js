import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Modal,
  StatusBar,
  FlatList,
  TextInput,
  Alert,
   Play, Pause, Music, Volume2, VolumeX, Search, Heart, Share2, MessageCircle, Bookmark,
} from 'react-native';
import { categoriesData } from '@/utils/sampleData';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [categoryStories, setCategoryStories] = useState([]); // Only current category stories
  const [currentStoryIndexInCategory, setCurrentStoryIndexInCategory] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewedStories, setViewedStories] = useState(new Set());
  const [viewedCategories, setViewedCategories] = useState(new Set());
  const storyModalRef = useRef(null);
  const timerRef = useRef(null);

  const STORY_DURATION = 9000; 

  // Open category stories - only loads stories from selected category
  const openCategoryStories = (category) => {
    const stories = category.stories.map(story => ({
      ...story,
      categoryName: category.name,
      categoryImage: category.image
    }));
    
    setCategoryStories(stories);
    setCurrentStoryIndexInCategory(0);
    setSelectedCategory(category);
    setSelectedStory(stories[0]);
    setStoryProgress(0);
    setIsPaused(false);
    
    // Start timer after modal opens
    setTimeout(() => {
      startTimer();
    }, 500);
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setStoryProgress(0);
    setIsPaused(false);
    const startTime = Date.now();
    let pausedTime = 0;
    
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime - pausedTime;
        const progress = Math.min(elapsed / STORY_DURATION, 1);
        setStoryProgress(progress);
        
        if (progress >= 1) {
          clearInterval(timerRef.current);
          // Mark current story as viewed
          if (selectedStory) {
            setViewedStories(prev => new Set([...prev, selectedStory.id]));
          }
          setTimeout(() => {
            nextStory();
          }, 100);
        }
      } else {
        pausedTime += 50;
      }
    }, 50);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const nextStory = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Mark current story as viewed
    if (selectedStory) {
      setViewedStories(prev => new Set([...prev, selectedStory.id]));
    }
    
    // Check if there are more stories in the current category
    if (currentStoryIndexInCategory < categoryStories.length - 1) {
      const nextIndex = currentStoryIndexInCategory + 1;
      setCurrentStoryIndexInCategory(nextIndex);
      setSelectedStory(categoryStories[nextIndex]);
      
      if (storyModalRef.current) {
        storyModalRef.current.scrollToIndex({
          index: nextIndex,
          animated: true
        });
      }
      
      // Start timer for next story in same category
      setTimeout(() => {
        startTimer();
      }, 200);
    } else {
      // All stories in current category finished
      if (selectedCategory) {
        setViewedCategories(prev => new Set([...prev, selectedCategory.id]));
      }
      
      // Find next category with unviewed stories (only if selectedCategory exists)
      if (selectedCategory && selectedCategory.id) {
        const currentCategoryIndex = categoriesData.findIndex(cat => cat.id === selectedCategory.id);
        let nextCategoryIndex = currentCategoryIndex + 1;
        
        // Look for next category with unviewed stories
        while (nextCategoryIndex < categoriesData.length) {
          const nextCategory = categoriesData[nextCategoryIndex];
          if (nextCategory && nextCategory.stories) {
            const hasUnviewedStories = nextCategory.stories.some(story => !viewedStories.has(story.id));
            
            if (hasUnviewedStories) {
              // Found next category with unviewed stories, open it
              openCategoryStories(nextCategory);
              return;
            }
          }
          nextCategoryIndex++;
        }
      }
      
      // No more categories with unviewed stories, close modal
      closeStoryModal();
    }
  };

  const previousStory = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (currentStoryIndexInCategory > 0) {
      const prevIndex = currentStoryIndexInCategory - 1;
      setCurrentStoryIndexInCategory(prevIndex);
      setSelectedStory(categoryStories[prevIndex]);
      
      if (storyModalRef.current) {
        storyModalRef.current.scrollToIndex({
          index: prevIndex,
          animated: true
        });
      }
      
      // Start timer for previous story
      setTimeout(() => {
        startTimer();
      }, 200);
    }
  };

  const closeStoryModal = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Mark current story as viewed if it was being watched
    if (selectedStory && storyProgress > 0) {
      setViewedStories(prev => new Set([...prev, selectedStory.id]));
    }
    
    // Check if all stories in the category have been viewed
    if (selectedCategory) {
      const allCategoryStoryIds = selectedCategory.stories.map(story => story.id);
      const currentViewedStories = new Set([...viewedStories]);
      if (selectedStory && storyProgress > 0) {
        currentViewedStories.add(selectedStory.id);
      }
      
      const allViewed = allCategoryStoryIds.every(id => currentViewedStories.has(id));
      
      if (allViewed) {
        setViewedCategories(prev => new Set([...prev, selectedCategory.id]));
      }
    }
    
    // Reset all states
    setSelectedCategory(null);
    setSelectedStory(null);
    setCurrentStoryIndex(0);
    setCategoryStories([]);
    setCurrentStoryIndexInCategory(0);
    setStoryProgress(0);
    setIsPaused(false);
  };

  const onStoryScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / width);
    
    if (index !== currentStoryIndexInCategory && index < categoryStories.length) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Mark previous story as viewed
      if (selectedStory) {
        setViewedStories(prev => new Set([...prev, selectedStory.id]));
      }
      
      setCurrentStoryIndexInCategory(index);
      setSelectedStory(categoryStories[index]);
      
      // Start timer for the new story after scroll
      setTimeout(() => {
        startTimer();
      }, 300);
    }
  };

  // Function to get viewed stories count for a category
  const getViewedStoriesCount = (category) => {
    if (!category || !category.stories) return 0;
    return category.stories.filter(story => viewedStories.has(story.id)).length;
  };

  // Function to render dotted border based on stories count
  const renderDottedBorder = (category) => {
    const totalStories = category.stories.length;
    const viewedCount = getViewedStoriesCount(category);
    const isFullyViewed = viewedCategories.has(category.id);
    
    if (totalStories === 1) {
      // Single story - solid border
      return (
        <View style={[
          styles.categoryImageWrapper,
          { 
            borderColor: isFullyViewed ? '#C0C0C0' : '#A593E0',
            borderWidth: 2,
            borderStyle: 'solid'
          }
        ]}>
          <Image
            source={{ uri: category.image }}
            style={styles.categoryImage}
            resizeMode="cover"
          />
        </View>
      );
    }

    // Multiple stories - create dotted segments
    const segments = [];
    const segmentAngle = 360 / totalStories;
    const gapAngle = 8; // Gap between segments in degrees
    
    for (let i = 0; i < totalStories; i++) {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle - gapAngle;
      const isViewed = i < viewedCount;
      
      segments.push(
        <View
          key={i}
          style={[
            styles.borderSegment,
            {
              transform: [{ rotate: `${startAngle}deg` }],
              borderColor: isViewed ? '#C0C0C0' : '#A593E0',
            }
          ]}
        />
      );
    }

    return (
      <View style={styles.dottedBorderContainer}>
        {segments}
        <Image
          source={{ uri: category.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const ProgressBar = () => {
    if (!selectedStory || categoryStories.length === 0) return null;
    
    return (
      <View style={styles.progressContainer}>
        {categoryStories.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBarBackground,
              { width: `${100 / categoryStories.length - 0.5}%` }
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                {
                  width: index < currentStoryIndexInCategory ? '100%' : 
                         index === currentStoryIndexInCategory ? `${storyProgress * 100}%` : '0%'
                }
              ]}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderStoryItem = ({ item, index }) => {
    return (
      <View style={styles.storyContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.storyImage}
          resizeMode="cover"
        />
        
        {/* User Info Header */}
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.user.profileImage }}
              style={styles.userProfileImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{item.user.username}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        </View>

        {/* Category indicator */}
        <View style={styles.categoryIndicator}>
          <View style={styles.categoryIndicatorContent}>
            <Image
              source={{ uri: item.categoryImage }}
              style={styles.categoryIndicatorImage}
            />
            <Text style={styles.categoryIndicatorText}>{item.categoryName}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => openCategoryStories(item)}
      >
        <View style={styles.categoryImageContainer}>
          {renderDottedBorder(item)}
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.storiesRowContainer}>
        <FlatList
          data={categoriesData}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <Modal
        visible={!!selectedStory}
        transparent={true}
        animationType="slide"
        onRequestClose={closeStoryModal}
      >
        <View style={styles.storyModal}>
          <ProgressBar />
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeStoryModal}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leftTap}
            onPress={previousStory}
            onPressIn={pauseTimer}
            onPressOut={resumeTimer}
          />
          
          <TouchableOpacity
            style={styles.rightTap}
            onPress={nextStory}
            onPressIn={pauseTimer}
            onPressOut={resumeTimer}
          />

          <FlatList
            ref={storyModalRef}
            data={categoryStories}
            renderItem={renderStoryItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onStoryScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id.toString()}
            initialScrollIndex={currentStoryIndexInCategory}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                storyModalRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 100,
  },
  storiesRowContainer: {
    paddingVertical: 4,
  },
  storiesRow: {
    paddingHorizontal: 0,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 0,
    width: 80,
  },
  categoryImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 2,
    marginBottom: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A593E0',
    overflow: 'hidden',
  },
  dottedBorderContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  borderSegment: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#A593E0',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 1,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  storyModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  storyImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  userHeader: {
    position: 'absolute',
    top: 80,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timestamp: {
    color: '#ddd',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  categoryIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicatorImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  categoryIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginHorizontal: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  leftTap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width / 2,
    height: '100%',
    zIndex: 10,
  },
  rightTap: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width / 2,
    height: '100%',
    zIndex: 10,
  },
});