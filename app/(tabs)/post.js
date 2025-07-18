import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';

import CreatePost from '../posts/CreatePost';
import CreateEvent from '../posts/CreateEvent';
import CreateStory from '../posts/CreateStory';

const { width } = Dimensions.get('window');
const tabWidth = width / 3;
const PURPLE = '#cba3ea'; // Light purple

// Enhanced Premium Icon Component
const PremiumIcon = ({ size = 16 }) => {
  const [pulseAnim] = useState(new Animated.Value(0));
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.premiumIconContainer}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      
      {/* Main premium badge */}
      <View style={styles.premiumBadge}>
        {/* Shimmer overlay */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              opacity: shimmerAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateX: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 20],
                  }),
                },
              ],
            },
          ]}
        />
        
        {/* Crown icon */}
        <Text style={styles.crownEmoji}>👑</Text>
        
        {/* PRO text */}
        <Text style={styles.proText}>PRO</Text>
      </View>
      
      {/* Sparkle effects */}
      <Animated.View
        style={[
          styles.sparkle1,
          {
            opacity: pulseAnim,
            transform: [
              { rotate: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }) }
            ],
          },
        ]}
      >
        <Text style={styles.sparkleText}>✨</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.sparkle2,
          {
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <Text style={styles.sparkleText}>⭐</Text>
      </Animated.View>
    </View>
  );
};

export default function PostTabScreen() {
  const [activeTab, setActiveTab] = useState('post');

  // Animation for Premium badge
  const premiumAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(premiumAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={PURPLE} barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header with Tabs */}
          <View style={styles.tabHeader}>
            <View style={styles.tabRow}>
              {['post', 'story', 'event'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={styles.tabItem}
                    onPress={() => setActiveTab(tab)}
                  >
                    <View style={styles.tabTextContainer}>
                      <Text
                        style={[
                          styles.tabText,
                          isActive && styles.activeTabText,
                        ]}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                      
                      {/* Premium badge only on 'story' */}
                      {tab === 'story' && (
                        <Animated.View
                          style={[
                            styles.premiumIcon,
                            {
                              opacity: premiumAnim,
                              transform: [
                                { scale: premiumAnim },
                                { 
                                  rotate: premiumAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '10deg'],
                                  })
                                }
                              ],
                            },
                          ]}
                        >
                          <PremiumIcon />
                        </Animated.View>
                      )}
                    </View>

                    {isActive && <View style={styles.underline} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {activeTab === 'post' && <CreatePost />}
            {activeTab === 'story' && <CreateStory />}
            {activeTab === 'event' && <CreateEvent />}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#cba3ea',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  tabHeader: {
    backgroundColor: '#cba3ea',
    paddingTop: Platform.OS === 'android' ? 60 : 50,
    paddingBottom: 25,
    paddingHorizontal: 10,
    elevation: 6,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItem: {
    width: tabWidth,
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 10,
  },
  tabTextContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  activeTabText: {
    color: 'white',
  },
  underline: {
    height: 3,
    backgroundColor: 'white',
    width: '40%',
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
  },
  premiumIcon: {
    position: 'absolute',
    top: -15,
    right: -25,
    zIndex: 1,
  },
  premiumIconContainer: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  premiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -10,
    right: -10,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ skewX: '-20deg' }],
  },
  crownEmoji: {
    fontSize: 8,
    lineHeight: 10,
    marginBottom: -2,
  },
  proText: {
    fontSize: 6,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle2: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleText: {
    fontSize: 8,
    textAlign: 'center',
  },
});