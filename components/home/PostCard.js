import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { Linking, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSavedPosts } from '@/context/SavedPostsContext';
import { useRouter } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreVertical,
  UserPlus,
  UserCheck,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Gift,
  Star,
  MapPin,
  Zap,
  Send,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react-native';
import PostOptionsModal from '@/components/modals/PostOptionsModal';
import CommentModal from '@/components/modals/CommentModal';
import ShareModal from '@/components/modals/ShareModal';
import VideoPlayer from '@/components/modals/VideoPlayer';
import ClaimOverlay from '@/components/modals/ClaimOverlay';
import PostImageComponent from '@/components/modals/PostImageComponent';
import { calculateShopDistance, formatDistance } from '@/utils/distanceCalculator';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onClaim,
  onFollowToggle,
  onShareToFriend,
  isVisible = false,
  isPaused = false,
  isMuted = false,
  isInViewport = true,
  scrollY = 0,
  userLocation = null,
  onVideoPlay,
  onVideoPause,
  onVideoMute,
  onVideoUnmute,
}) {
  const { theme } = useTheme();
  const { toggleSavePost, isPostSaved } = useSavedPosts();
  const router = useRouter();

  // Component state
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [likeAnimation] = useState(new Animated.Value(0));
  const [followAnimation] = useState(new Animated.Value(0));
  const [saveAnimation] = useState(new Animated.Value(0));
  const [claimAnimation] = useState(new Animated.Value(0));
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  
  // Claim feedback state
  const [showClaimFeedbackModal, setShowClaimFeedbackModal] = useState(false);
  const [claimFeedbackGiven, setClaimFeedbackGiven] = useState(false);
  const [claimThumbsUpPressed, setClaimThumbsUpPressed] = useState(false);
  const [claimThumbsDownPressed, setClaimThumbsDownPressed] = useState(false);
  const [claimThumbsUpAnimation] = useState(new Animated.Value(0));
  const [claimThumbsDownAnimation] = useState(new Animated.Value(0));
  
  // Description state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

  // Distance calculation state
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [displayDistance, setDisplayDistance] = useState(post.shopkm || 'N/A');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  // Video control state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(isMuted);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const videoControlsTimeout = useRef(null);

  // Like and engagement state
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  
  // Updated thumbs state - based on feedback system
  const [thumbsUpCount, setThumbsUpCount] = useState(post.goodFeedbackCount || Math.floor(Math.random() * 50) + 10);
  const [thumbsDownCount, setThumbsDownCount] = useState(post.badFeedbackCount || Math.floor(Math.random() * 10) + 2);
  const [userHasGivenFeedback, setUserHasGivenFeedback] = useState(false);
  const [userFeedbackType, setUserFeedbackType] = useState(null); // 'good' or 'bad'
  
  const [doubleTapAnimation] = useState(new Animated.Value(0));
  const [thumbsUpAnimation] = useState(new Animated.Value(0));
  const [thumbsDownAnimation] = useState(new Animated.Value(0));
  const lastTap = useRef(null);
  
  // Generate random star rating (0-5)
  const [starRating] = useState((Math.random() * 4 + 1).toFixed(1));

  // Determine media type
  const isVideo =
    post.mediaType === 'video' ||
    post.video ||
    (post.media && post.media.type === 'video');
  const mediaSource = isVideo
    ? post.video || post.media?.url
    : post.image || post.media?.url;

  // Modified claim handler to show feedback popup
  const handleClaim = () => {
    // Call the original onClaim function
    onClaim?.(post.id);
    
    // Show the feedback popup after successful claim
    setShowClaimFeedbackModal(true);
    
    // Animate claim button
    Animated.sequence([
      Animated.timing(claimAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(claimAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle claim feedback thumbs up
  const handleClaimThumbsUp = () => {
    if (claimThumbsDownPressed) {
      setClaimThumbsDownPressed(false);
    }
    
    setClaimThumbsUpPressed(true);
    setClaimFeedbackGiven(true);
    setUserHasGivenFeedback(true);
    setUserFeedbackType('good');
    
    // Increase the thumbs up count
    setThumbsUpCount(prev => prev + 1);
    
    // Animate thumbs up
    Animated.sequence([
      Animated.timing(claimThumbsUpAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(claimThumbsUpAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto close modal after 2 seconds
    setTimeout(() => {
      setShowClaimFeedbackModal(false);
    }, 2000);
  };

  // Handle claim feedback thumbs down
  const handleClaimThumbsDown = () => {
    if (claimThumbsUpPressed) {
      setClaimThumbsUpPressed(false);
    }
    
    setClaimThumbsDownPressed(true);
    setClaimFeedbackGiven(true);
    setUserHasGivenFeedback(true);
    setUserFeedbackType('bad');
    
    // Increase the thumbs down count
    setThumbsDownCount(prev => prev + 1);
    
    // Animate thumbs down
    Animated.sequence([
      Animated.timing(claimThumbsDownAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(claimThumbsDownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto close modal after 2 seconds
    setTimeout(() => {
      setShowClaimFeedbackModal(false);
    }, 2000);
  };

  // Updated thumbs up handler - only visual feedback, no count increase
  const handleThumbsUp = () => {
    // Only animate, don't increase count
    Animated.sequence([
      Animated.timing(thumbsUpAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(thumbsUpAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Show a message that they need to claim first to give feedback
    Alert.alert(
      'Claim Required',
      'Please claim this offer first to give feedback!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Updated thumbs down handler - only visual feedback, no count increase
  const handleThumbsDown = () => {
    // Only animate, don't increase count
    Animated.sequence([
      Animated.timing(thumbsDownAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(thumbsDownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Show a message that they need to claim first to give feedback
    Alert.alert(
      'Claim Required',
      'Please claim this offer first to give feedback!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Video control effects
  useEffect(() => {
    if (isVideo) {
      if (isInViewport && isVisible) {
        setIsVideoPlaying(true);
        onVideoPlay?.(post.id);
      } else {
        setIsVideoPlaying(false);
        onVideoPause?.(post.id);
      }
    }
  }, [isInViewport, isVisible, isVideo, post.id, onVideoPlay, onVideoPause]);

  // Auto-mute when scrolling
  useEffect(() => {
    if (isVideo) {
      if (isPaused || !isInViewport) {
        setIsVideoMuted(true);
        onVideoMute?.(post.id);
      } else {
        setIsVideoMuted(isMuted);
        if (isMuted) {
          onVideoMute?.(post.id);
        } else {
          onVideoUnmute?.(post.id);
        }
      }
    }
  }, [isPaused, isInViewport, isMuted, isVideo, post.id, onVideoMute, onVideoUnmute]);

  // Show/hide video controls
  const showVideoControlsTemporarily = () => {
    if (!isVideo) return;
    
    setShowVideoControls(true);
    
    if (videoControlsTimeout.current) {
      clearTimeout(videoControlsTimeout.current);
    }
    
    videoControlsTimeout.current = setTimeout(() => {
      setShowVideoControls(false);
    }, 3000);
  };

  // Video control handlers
  const handleVideoPlayPause = () => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      onVideoPause?.(post.id);
    } else {
      setIsVideoPlaying(true);
      onVideoPlay?.(post.id);
    }
    showVideoControlsTemporarily();
  };

  const handleVideoMuteToggle = () => {
    const newMutedState = !isVideoMuted;
    setIsVideoMuted(newMutedState);
    
    if (newMutedState) {
      onVideoMute?.(post.id);
    } else {
      onVideoUnmute?.(post.id);
    }
    showVideoControlsTemporarily();
  };

  const handleVideoTouch = () => {
    if (isVideo) {
      showVideoControlsTemporarily();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (videoControlsTimeout.current) {
        clearTimeout(videoControlsTimeout.current);
      }
    };
  }, []);

  // Function to get last two parts of location for display
  const getDisplayLocation = (location) => {
    if (!location) return '';
    const parts = location.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return parts.slice(-2).join(', ');
    }
    return location;
  };

  // Calculate distance when component mounts or user location changes
  useEffect(() => {
    const calculateDistance = async () => {
      if (userLocation && post.location && !isCalculatingDistance) {
        setIsCalculatingDistance(true);
        try {
          const distance = await calculateShopDistance(userLocation, post.location);
          if (distance !== null) {
            setCalculatedDistance(distance);
            setDisplayDistance(formatDistance(distance));
          } else {
            setDisplayDistance(post.shopkm || 'N/A');
          }
        } catch (error) {
          console.error('Error calculating distance:', error);
          setDisplayDistance(post.shopkm || 'N/A');
        } finally {
          setIsCalculatingDistance(false);
        }
      } else if (!userLocation) {
        setDisplayDistance(post.shopkm || 'N/A');
      }
    };

    calculateDistance();
  }, [userLocation, post.location, post.shopkm]);

  // Check if description needs "Read more" on layout
  const handleDescriptionLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    if (height > 66 && !isDescriptionExpanded) {
      setShouldShowReadMore(true);
    }
  };

  // Map function - uses full location for navigation
  const handleOpenMap = (location) => {
    const query = encodeURIComponent(location);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });

    Linking.openURL(url).catch((err) =>
      console.error('Failed to open map:', err)
    );
  };

  // INSTANT LIKE HANDLER - No delay, immediate response
const handleLike = () => {
  const newLikedState = !isLiked;
  
  // Immediate state updates - no delay
  setIsLiked(newLikedState);
  setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
  
  // Call parent's onLike immediately
  onLike?.(post.id);
  
  // Ultra fast single animation - 50ms total
  Animated.timing(likeAnimation, {
    toValue: 1,
    duration: 20, // 0.05 seconds
    useNativeDriver: true,
  }).start(() => {
    // Auto reset after animation
    likeAnimation.setValue(0);
  });
};

  // INSTANT DOUBLE TAP HANDLER - Faster response
  const DOUBLE_PRESS_DELAY = 100; // Reduced from 300ms

const handleDoubleTap = () => {
  const now = Date.now();

  if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
    // Double tap detected - instant response
    lastTap.current = null;

    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      onLike?.(post.id);

      // Super fast single animation - 50ms total
      Animated.timing(doubleTapAnimation, {
        toValue: 1,
        duration: 20, // 0.05 seconds
        useNativeDriver: true,
      }).start(() => {
        // Auto reset
        doubleTapAnimation.setValue(0);
      });
    }
  } else {
    lastTap.current = now;
  }
};

  const handleSave = () => {
    try {
      const wasSaved = toggleSavePost(post);

      Animated.sequence([
        Animated.timing(saveAnimation, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(saveAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      console.log('Save error:', error);
      Alert.alert('Error', 'Unable to save post. Please try again.');
    }
  };

  const handleProfilePress = () => {
    router.push(`/profile/${post.user.id}`);
  };

  // Silent follow toggle handler
  const handleFollowToggle = () => {
    onFollowToggle?.(post.user.id);

    Animated.sequence([
      Animated.timing(followAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(followAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };
const handleLikeInstant = () => {
  const newLikedState = !isLiked;
  setIsLiked(newLikedState);
  setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
  onLike?.(post.id);
  // No animation - pure instant response
};
  // Animation interpolations
  const likeScale = likeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02], // Reduced from 1.2 for more subtle effect
  });

  const followScale = followAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  const saveScale = saveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const claimScale = claimAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  // Double tap animation interpolations
  const doubleTapScale = doubleTapAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.1, 0], // Reduced from 1.2
  });

  const doubleTapOpacity = doubleTapAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  // Thumbs animations
  const thumbsUpScale = thumbsUpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const thumbsDownScale = thumbsDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  // Claim feedback animations
  const claimThumbsUpScale = claimThumbsUpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const claimThumbsDownScale = claimThumbsDownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  // Modal handlers
  const openCommentModal = () => setCommentModalVisible(true);
  const closeCommentModal = () => setCommentModalVisible(false);
  const closeShareModal = () => setShareModalVisible(false);

  // Follow button render logic
  const renderFollowButton = () => {
    const { followStatus } = post.user;

    if (followStatus === 'following') {
      return null;
    }

    return (
      <Animated.View style={{ transform: [{ scale: followScale }] }}>
        <TouchableOpacity
          style={[styles.followButton, styles.followActionButton]}
          onPress={handleFollowToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render claim feedback modal
  const renderClaimFeedbackModal = () => {
    return (
      <Modal
        visible={showClaimFeedbackModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClaimFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackModalContainer}>
            <Text style={styles.feedbackTitle}>
              {claimFeedbackGiven ? 'Thank you for your feedback!' : 'Was your claim successful?'}
            </Text>
            
            {!claimFeedbackGiven ? (
              <View style={styles.feedbackButtons}>
                <TouchableOpacity
                  style={styles.feedbackButton}
                  onPress={handleClaimThumbsUp}
                  activeOpacity={0.8}
                >
                  <Animated.View style={{ transform: [{ scale: claimThumbsUpScale }] }}>
                    <ThumbsUp
                      size={32}
                      color="#4CAF50"
                      fill="transparent"
                    />
                  </Animated.View>
                  <Text style={styles.feedbackButtonText}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.feedbackButton}
                  onPress={handleClaimThumbsDown}
                  activeOpacity={0.8}
                >
                  <Animated.View style={{ transform: [{ scale: claimThumbsDownScale }] }}>
                    <ThumbsDown
                      size={32}
                      color="#F44336"
                      fill="transparent"
                    />
                  </Animated.View>
                  <Text style={styles.feedbackButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.feedbackGivenContainer}>
                <View style={styles.feedbackGivenIcon}>
                  {claimThumbsUpPressed ? (
                    <ThumbsUp size={40} color="#4CAF50" fill="#4CAF50" />
                  ) : (
                    <ThumbsDown size={40} color="#F44336" fill="#F44336" />
                  )}
                </View>
                <Text style={styles.feedbackGivenText}>
                  {claimThumbsUpPressed ? 'Glad you had a good experience!' : 'We\'ll work to improve!'}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.closeFeedbackButton}
              onPress={() => setShowClaimFeedbackModal(false)}
            >
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Render video controls overlay
  const renderVideoControls = () => {
    if (!isVideo || !showVideoControls) return null;

    return (
      <View style={styles.videoControlsOverlay}>
        <TouchableOpacity
          style={styles.videoControlButton}
          onPress={handleVideoPlayPause}
          activeOpacity={0.8}
        >
          {isVideoPlaying ? (
            <Pause size={24} color="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.videoControlButton}
          onPress={handleVideoMuteToggle}
          activeOpacity={0.8}
        >
          {isVideoMuted ? (
            <VolumeX size={24} color="#FFFFFF" />
          ) : (
            <Volume2 size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render media with claim overlay
  const renderMedia = () => {
    const mediaHeight = isVideo ? screenHeight * 0.6 : screenHeight * 0.5;

    if (isVideo && mediaSource) {
      const claimOverlay = (
        <ClaimOverlay
          postId={post.id}
          onClaim={handleClaim}
          claimAnimation={claimScale}
        />
      );
      return (
        <View style={styles.mediaContainer}>
          <TouchableOpacity 
            onPressIn={handleDoubleTap} 
            onPress={handleVideoTouch}
            activeOpacity={1}
          >
            <VideoPlayer
              source={mediaSource}
              isVisible={isVisible && isInViewport}
              isPaused={!isVideoPlaying}
              isMuted={isVideoMuted}
              height={mediaHeight}
              onSave={handleSave}
              isPostSaved={isPostSaved(post.id)}
              saveAnimation={saveScale}
              ClaimOverlay={claimOverlay}
               postLocation={post.location}
          onLocationPress={handleOpenMap}
            />
          </TouchableOpacity>
          {renderVideoControls()}
        </View>
      );
    } else if (mediaSource) {
      return (
        <PostImageComponent
          mediaSource={mediaSource}
          mediaHeight={mediaHeight}
          onDoubleTap={handleDoubleTap}
          onSave={handleSave}
          isPostSaved={isPostSaved(post.id)}
          saveScale={saveScale}
          doubleTapScale={doubleTapScale}
          doubleTapOpacity={doubleTapOpacity}
          claimScale={claimScale}
          postId={post.id}
          onClaim={handleClaim}
          postLocation={post.location}
          onLocationPress={handleOpenMap}
        />
      );
    }

    return null;
  };

  return (
    <View style={[styles.postCard, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleProfilePress}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
            <View style={styles.ratingBadge}>
              <Star size={10} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingBadgeText}>{starRating}</Text>
            </View>
          </View>

          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.username} numberOfLines={1}>
                {post.user.name}
              </Text>
              <View style={styles.distanceContainer}>
                <Text style={styles.distance}>
                  {isCalculatingDistance ? '...' : displayDistance}
                </Text>
              </View>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#8B9DC3" />
                <TouchableOpacity onPress={() => handleOpenMap(post.location)}>
                  <Text style={styles.location} numberOfLines={1}>
                    {getDisplayLocation(post.location)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {renderFollowButton()}
          <TouchableOpacity
            onPress={() => setShowOptionsModal(true)}
            style={styles.moreButton}
          >
            <MoreVertical size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Media */}
      {renderMedia()}

      {/* Action Buttons */}
     <View style={styles.actionButtons}>
  {/* Left: Like, Comment, Share */}
  <View style={styles.leftActions}>
    <TouchableOpacity style={styles.actionButton} onPress={handleLike} activeOpacity={0.2}>
      <Animated.View style={{ transform: [{ scale: likeScale }] }}>
        <Heart
          size={24}
          color={isLiked ? '#FF3040' : theme.textSecondary}
          fill={isLiked ? '#FF3040' : 'transparent'}
        />
      </Animated.View>
      <Text style={[styles.actionText, { color: theme.textSecondary }]}>
        {likeCount}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionButton} onPress={openCommentModal}>
      <MessageCircle size={24} color={theme.textSecondary} />
      <Text style={[styles.actionText, { color: theme.textSecondary }]}>
        {post.comments || 0}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
      <Send size={24} color={theme.textSecondary} />
      <Text style={[styles.actionText, { color: theme.textSecondary }]}>
        {post.send || 0}
      </Text>
    </TouchableOpacity>
  </View>

  {/* Right: Thumbs Up & Down */}
  <View style={styles.rightActions}>
    <TouchableOpacity style={styles.statItem} onPress={handleThumbsUp}>
      <Animated.View style={{ transform: [{ scale: thumbsUpScale }] }}>
        <ThumbsUp 
          size={24} 
          color={userFeedbackType === 'good' ? '#4CAF50' : '#8B9DC3'} 
          fill={userFeedbackType === 'good' ? '#4CAF50' : 'transparent'}
        />
      </Animated.View>
      <Text style={[styles.statText, { color: '#4A5568' }]}>
        {thumbsUpCount}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.statItem} onPress={handleThumbsDown}>
      <Animated.View style={{ transform: [{ scale: thumbsDownScale }] }}>
        <ThumbsDown 
          size={24} 
          color={userFeedbackType === 'bad' ? '#F44336' : '#8B9DC3'} 
          fill={userFeedbackType === 'bad' ? '#F44336' : 'transparent'}
        />
      </Animated.View>
      <Text style={[styles.statText, { color: '#4A5568' }]}>
        {thumbsDownCount}
      </Text>
    </TouchableOpacity>
  </View>
</View>


     {/* Post Title with Clock */}
      <View style={styles.titleSection}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title + ' '}
          <Text style={styles.inlineTime}>
            <Clock size={12} color="#8B9DC3" /> {post.timeAgo}
          </Text>
        </Text>
      </View>

   {/* Description */}
     <View style={styles.content}>
        <View onLayout={handleDescriptionLayout}>
          <View style={[
            styles.descriptionContainer,
            !isDescriptionExpanded && shouldShowReadMore && styles.descriptionCollapsed
          ]}>
            {post.description && (
              <Text style={styles.description}>
                {post.description}
              </Text>
            )}
             <Text style={styles.hastag}>
                {post.hashtags}
              </Text>
          </View>
          
          {shouldShowReadMore && (
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              <Text style={styles.readMoreText}>
                {isDescriptionExpanded ? 'Show less' : '... more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Modals */}
      <PostOptionsModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        post={post}
        onEdit={() => {}}
        onDelete={() => {}}
        onReport={() => {}}
        onBlock={() => {}}
      />

      <CommentModal
        visible={commentModalVisible}
        onClose={closeCommentModal}
        post={post}
        onComment={onComment}
      />

      <ShareModal
        visible={shareModalVisible}
        onClose={closeShareModal}
        post={post}
        onShareToFriend={onShareToFriend}
      />

      {renderClaimFeedbackModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  ratingBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000000ff',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 24,
    justifyContent: 'center',
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    gap:10,
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    // flex: 1,
  },
  distanceContainer: {
    backgroundColor: '#f1f1f1ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  distance: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: '#8B9DC3',
    marginLeft: 4,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#A593E0',
  },
  followActionButton: {
    backgroundColor: '#A593E0',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  mediaContainer: {
    position: 'relative',
  },
  videoControlsOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  videoControlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
 actionButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  marginTop: 10,
  marginBottom:20,
},

leftActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

rightActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
},

actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

actionText: {
  fontSize: 14,
  fontWeight: '500',
},

statItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

statText: {
  fontSize: 14,
  fontWeight: '500',
},

  titleSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    width:"95%",
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    lineHeight: 16,
  },
  inlineTime: {
    fontSize: 12,
    color: '#8B9DC3',
    fontWeight: '400',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
 
descriptionContainer: {
    overflow: 'hidden',
  },
  descriptionCollapsed: {
    maxHeight: 66,
  },
  description: {
    fontSize: 16,
    // lineHeight: 22,
    color: '#4A5568',
  },
  hastag: {
    fontSize: 16,
    marginTop:20,
    // lineHeight: 15,
    color: '#A593E0',
  },
  readMoreButton: {
    marginTop: 4,
  },
  readMoreText: {
    color: '#8B9DC3',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 280,
    position: 'relative',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 20,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  feedbackButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F7FAFC',
    minWidth: 80,
  },
  feedbackButtonText: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 8,
    fontWeight: '500',
  },
  feedbackGivenContainer: {
    alignItems: 'center',
  },
  feedbackGivenIcon: {
    marginBottom: 12,
  },
  feedbackGivenText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
  },
  closeFeedbackButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
});