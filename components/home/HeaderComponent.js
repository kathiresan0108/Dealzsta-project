import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Bookmark,
  MessageCircle,
  MapPin,
  Bell,
  ChevronDown,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCarousel from './EventCarousel';

const { width, height } = Dimensions.get('window');

export default function HeaderComponent({ scrollY, onEventCarouselToggle }) {
  const { theme } = useTheme();
  const { address } = useLocation();
  const router = useRouter();
  const lastScrollY = useRef(0);
  const headerTranslate = useRef(new Animated.Value(0)).current;
  const slideDownTranslate = useRef(new Animated.Value(-height * 0.6)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;
  const jumpAnimation = useRef(new Animated.Value(0)).current;

  const [messageCount, setMessageCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showEventCarousel, setShowEventCarousel] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchCounts = async () => {
        try {
          const storedMessages = await AsyncStorage.getItem('persistedMessages');
          const storedNotifications = await AsyncStorage.getItem('persistedNotifications');
          setMessageCount(JSON.parse(storedMessages || '[]').length);
          setNotificationCount(JSON.parse(storedNotifications || '[]').length);
        } catch {
          setMessageCount(0);
          setNotificationCount(0);
        }
      };
      fetchCounts();
    }, [])
  );

  useEffect(() => {
    if (scrollY) {
      const listener = scrollY.addListener(({ value }) => {
        const diff = value - lastScrollY.current;

        if (value > 100 && diff > 0 && !showEventCarousel) {
          setShowEventCarousel(true);
          onEventCarouselToggle?.(true);
        } else if (value < 50 && diff < 0 && showEventCarousel) {
          setShowEventCarousel(false);
          onEventCarouselToggle?.(false);
        }

        Animated.timing(headerTranslate, {
          toValue: diff > 0 && value > 50 ? -300 : 0,
          duration: 150,
          useNativeDriver: true,
        }).start();

        lastScrollY.current = value;
      });
      return () => scrollY.removeListener(listener);
    }
  }, [scrollY, showEventCarousel, onEventCarouselToggle]);

  useEffect(() => {
    let jumpLoop;

    if (!isPanelOpen) {
      jumpLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(jumpAnimation, {
            toValue: -6,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(jumpAnimation, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      jumpLoop.start();
    }

    return () => {
      jumpLoop?.stop();
    };
  }, [isPanelOpen]);

  const togglePanel = () => {
    const toValue = isPanelOpen ? -height * 0.6 : 0;
    setIsPanelOpen(!isPanelOpen);
    Animated.parallel([
      Animated.timing(slideDownTranslate, {
        toValue,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(arrowRotation, {
        toValue: isPanelOpen ? 0 : 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateArrow = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <>
      <Animated.View
        style={[styles.animatedHeaderContainer, { transform: [{ translateY: headerTranslate }] }]}
      >
        <View style={styles.statusBarBackground} />
        <View style={styles.headerContent}>
          <View style={styles.solidBackground}>
            <View style={styles.container}>
              <View style={styles.leftSection}>
                <TouchableOpacity
                  style={styles.locationContainer}
                  onPress={() => router.push('/location')}
                  activeOpacity={0.7}
                >
                  <MapPin color="black" size={20} />
                  <Text style={styles.locationText}>Location</Text>
                  <ChevronDown color="black" size={16} />
                </TouchableOpacity>
                <Text style={styles.addressText}>{address || 'Choose Location'}</Text>
              </View>
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={styles.notificationWrapper}
                  onPress={() => router.push('/notification')}
                >
                  <Bell color="black" size={24} />
                  {notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{notificationCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.notificationWrapper}
                  onPress={() => router.push('/message')}
                >
                  <MessageCircle color="black" size={24} />
                  {messageCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{messageCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/saved-posts')}>
                  <Bookmark color="black" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.toggleButton} onPress={togglePanel}>
          <Animated.View
            style={{
              transform: [
                { rotate: rotateArrow },
                { translateY: jumpAnimation },
              ],
            }}
          >
            <ChevronDown color="#9051c3" size={26} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.slidingPanel,
          { transform: [{ translateY: slideDownTranslate }] },
        ]}
        pointerEvents={isPanelOpen ? 'auto' : 'none'}
      >
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
        <View style={{ paddingTop: 20 }}>
          <Text style={styles.panelTitle}>Popular Events</Text>
          <EventCarousel />
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  animatedHeaderContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  // statusBarBackground: {
  //   height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  //   backgroundColor: '#9051c3',
  // },
  headerContent: {
    position: 'relative',
  },
  solidBackground: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    paddingRight: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    marginTop: 4,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'black',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignSelf: 'center',
    marginTop: -30,
    borderRadius: 20,
    padding: 6,
  },
  slidingPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  panelHeader: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});