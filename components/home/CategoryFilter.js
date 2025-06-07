import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const categories = [
  'trending',
  'food',
  'fashion',
  'electronics',
  'beauty',
  'sports',
  'automotive',
  'health',
  'home',
  'travel'
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category ? theme.primary : theme.surface,
                borderColor: selectedCategory === category ? theme.primary : theme.border,
              }
            ]}
            onPress={() => onCategoryChange(category)}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category ? 'white' : theme.text,
                }
              ]}
            >
              {t[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});