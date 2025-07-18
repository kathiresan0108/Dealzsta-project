import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function CategoryFilter({ categories, selectedCategory, onCategorySelect }) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All category */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'All' && styles.selectedButton
          ]}
          onPress={() => onCategorySelect('All')}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === 'All' && styles.selectedText
          ]}>
            All
          </Text>
        </TouchableOpacity>

        {/* Individual categories */}
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedButton
            ]}
            onPress={() => onCategorySelect(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#c59d00',
    borderColor: '#c59d00',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});