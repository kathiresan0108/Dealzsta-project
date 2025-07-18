import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  Animated,
} from 'react-native';
import events from './eventsData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.50;
const SPACING = 16;
const FULL_WIDTH = CARD_WIDTH + SPACING;

export default function EventCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % events.length;
      flatListRef.current?.scrollToOffset({
        offset: currentIndex.current * FULL_WIDTH,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={events}
        keyExtractor={(item) => item.id.toString()}
        snapToInterval={FULL_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FULL_WIDTH,
            index * FULL_WIDTH,
            (index + 1) * FULL_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.venue}>{item.venue}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: SPACING / 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.9, // Reduced image height
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  date: {
    color: '#f90',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  venue: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007aff',
  },
});