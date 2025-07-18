// Enhanced VideoPlayer.js with better location handling
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Play, Volume2, VolumeX, Bookmark, Truck, Store } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function VideoPlayer({ 
  source, 
  isVisible = false,
  isPaused = false,
  height = screenHeight * 0.6,
  onSave,
  isPostSaved = false,
  saveAnimation,
  ClaimOverlay,
  onInstoreClick, // Callback for instore navigation
  onLocationPress, // Alternative prop name for consistency
  postLocation, // Location data to pass to callback
  fulfillmentType: propFulfillmentType, // Allow override of random fulfillment
}) {
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);
  const mounted = useRef(true);
  
  // Use prop fulfillmentType if provided, otherwise random selection
  const [fulfillmentType] = useState(() => {
    if (propFulfillmentType) return propFulfillmentType;
    const types = ['delivery', 'instore'];
    return types[Math.floor(Math.random() * types.length)];
  });
  
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    isMuted: true,
    isLoaded: false,
    showControls: false,
    hasError: false
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Main autoplay effect - handles visibility changes
  useEffect(() => {
    if (!videoRef.current || !videoState.isLoaded || videoState.hasError) return;

    const handleAutoplay = async () => {
      try {
        if (isVisible && !isPaused) {
          // Play when visible
          if (!videoState.isPlaying) {
            await videoRef.current.playAsync();
          }
        } else {
          // Pause when not visible or isPaused is true
          if (videoState.isPlaying) {
            await videoRef.current.pauseAsync();
          }
        }
      } catch (error) {
        console.log('Autoplay error:', error);
      }
    };

    // Add small delay to ensure smooth transitions
    const timer = setTimeout(handleAutoplay, 100);
    return () => clearTimeout(timer);
  }, [isVisible, isPaused, videoState.isLoaded, videoState.hasError]);

  const onVideoPress = async () => {
    if (!videoRef.current || videoState.hasError) return;
    try {
      if (videoState.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      
      // Show controls temporarily
      setVideoState(s => ({ ...s, showControls: true }));
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (mounted.current) setVideoState(s => ({ ...s, showControls: false }));
      }, 3000);
    } catch (e) {
      console.log('Playback error:', e);
    }
  };

  const onMuteToggle = async () => {
    if (!videoRef.current) return;
    try {
      const newMuted = !videoState.isMuted;
      await videoRef.current.setIsMutedAsync(newMuted);
      setVideoState(s => ({ ...s, isMuted: newMuted, showControls: true }));
      
      // Hide controls after delay
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (mounted.current) setVideoState(s => ({ ...s, showControls: false }));
      }, 3000);
    } catch (e) {
      console.log('Mute toggle error:', e);
    }
  };

  const onStatusUpdate = (status) => {
    if (!mounted.current) return;
    
    if (status.isLoaded && !videoState.isLoaded) {
      setVideoState(s => ({ ...s, isLoaded: true, hasError: false }));
    }
    
    if (status.isLoaded) {
      setVideoState(s => ({
        ...s,
        isPlaying: status.isPlaying || false,
        hasError: false
      }));
    }
    
    if (status.didJustFinish) {
      videoRef.current?.replayAsync();
    }
    
    if (status.error) {
      console.log('Video error:', status.error);
      setVideoState(s => ({ ...s, hasError: true, isPlaying: false }));
    }
  };

  const onLoad = () => {
    setVideoState(s => ({ ...s, isLoaded: true, hasError: false }));
  };

  const onError = (error) => {
    console.log('Video load error:', error);
    setVideoState(s => ({ ...s, hasError: true, isPlaying: false }));
  };

  // Handle fulfillment indicator click
  const onFulfillmentClick = () => {
    if (fulfillmentType === 'instore') {
      // Try both prop names for backward compatibility
      const callback = onInstoreClick || onLocationPress;
      if (callback) {
        callback(postLocation); // Pass location data to callback
      }
    }
    // For delivery, do nothing (no location needed)
  };

  // Function to render the fulfillment indicator
  const renderFulfillmentIndicator = () => {
    let backgroundColor, textColor, iconColor, text, IconComponent;

    if (fulfillmentType === 'delivery') {
      backgroundColor = 'rgba(0,0,0,0.6)';
      textColor = '#FFFFFF';
      iconColor = '#FFFFFF';

      IconComponent = Truck;
    } else if (fulfillmentType === 'instore') {
      backgroundColor = 'rgba(0,0,0,0.6)';
      textColor = '#FFFFFF';
      iconColor = '#FFFFFF';
      
      IconComponent = Store;
    }

    return (
      <TouchableOpacity 
        style={[styles.fulfillmentIndicator, { backgroundColor }]}
        onPress={onFulfillmentClick}
        disabled={fulfillmentType === 'delivery'} // Only clickable for instore
      >
        <IconComponent size={16} color={iconColor} />
        <Text style={[styles.fulfillmentText, { color: textColor }]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!source) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.videoContainer, { height }]}
        onPress={onVideoPress}
      >
        <Video
          ref={videoRef}
          source={{ uri: source }}
          style={[styles.video, { height }]}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted={videoState.isMuted}
          onPlaybackStatusUpdate={onStatusUpdate}
          onLoad={onLoad}
          onError={onError}
          shouldPlay={isVisible && !isPaused && videoState.isLoaded && !videoState.hasError}
        />

        {/* Fulfillment Indicator - Top Left (Clickable for instore) */}
        {renderFulfillmentIndicator()}

        {/* Controls */}
        {(!videoState.isPlaying || videoState.showControls) && !videoState.hasError && (
          <View style={styles.controls}>
            {/* Mute Button */}
            <TouchableOpacity style={styles.mute} onPress={onMuteToggle}>
              {videoState.isMuted ? (
                <VolumeX size={24} color="#fff" />
              ) : (
                <Volume2 size={24} color="#fff" />
              )}
            </TouchableOpacity>

            {/* Play Button */}
            {!videoState.isPlaying && (
              <TouchableOpacity style={styles.play} onPress={onVideoPress}>
                <Play size={40} color="#fff" />
              </TouchableOpacity>
            )}

            {onSave && (
              <TouchableOpacity style={styles.save} onPress={onSave}>
                <Animated.View style={{ transform: [{ scale: saveAnimation || 1 }] }}>
                  <Bookmark 
                    size={15} 
                    color="#FFFFFF" 
                    fill={isPostSaved ? "#FFFFFF" : "transparent"} 
                  />
                </Animated.View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Loading */}
        {!videoState.isLoaded && !videoState.hasError && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Loading...</Text>
          </View>
        )}

        {/* Error */}
        {videoState.hasError && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Video unavailable</Text>
            <TouchableOpacity
              style={styles.retry}
              onPress={() =>
                setVideoState(s => ({ ...s, hasError: false, isLoaded: false }))
              }
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Claim Overlay */}
        {ClaimOverlay && ClaimOverlay}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  videoContainer: { backgroundColor: '#000' },
  video: { width: '100%' },
  controls: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  play: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 35,
    width: 70, height: 70,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 20
  },
  mute: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 10
  },
  save: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding:8,
 borderRadius: 20,
    justifyContent: 'center', alignItems: 'center'
  },
  fulfillmentIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius:50,
   backgroundColor:'rgba(0,0,0,0.6)',
  },
  // fulfillmentText: {
  //   fontSize: 12,
  //   fontWeight: '600',
  //   marginLeft: 4,
  // },
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  overlayText: { color: '#fff', fontSize: 16 },
  retry: {
    marginTop: 10, paddingHorizontal: 20, paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 5
  },
  retryText: { color: '#fff' }
});