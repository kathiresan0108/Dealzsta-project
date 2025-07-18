import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import EventHeader from '../../components/event/EventHeader';
import CategoryFilterBar from '../../components/event/CategoryFilter';
import EventCard from '../../components/event/EventCard';
import sampleEvents from '../../components/event/eventsData';

// Define all available categories
const ALL_CATEGORIES = [
  'Music',
  'Comedy',
  'Sports',
  'Theater',
  'Dance',
  'Art',
  'Food',
  'Technology',
  'Business',
  'Health',
  'Education',
  'Kids',
  'Fashion',
  'Photography',
  'Literature',
  'Film',
  'Gaming',
  'Fitness',
  'Travel',
  'Workshop'
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleEventPress = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  // Option 1: Use predefined categories (shows all categories even if no events)
  const categories = ALL_CATEGORIES;

  // Option 2: Extract categories from events (only shows categories that have events)
  // const categories = useMemo(() => {
  //   const allCategories = sampleEvents.flatMap(event => event.categories || []);
  //   return [...new Set(allCategories)];
  // }, []);

  // Filter events based on selected category and search query
  const filteredEvents = useMemo(() => {
    let filtered = sampleEvents;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => 
        event.categories && event.categories.includes(selectedCategory)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.categories && event.categories.some(cat => 
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <ScrollView style={styles.container}>
      <EventHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryFilterBar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <View style={styles.cardsWrapper}>
        {filteredEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onPress={() => handleEventPress(event.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  cardsWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});