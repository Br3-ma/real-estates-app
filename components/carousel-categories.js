// RenderCategoryCarousel.js

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RenderCategoryCarousel = ({ categoryOptions, selectedCategory, handleCategoryChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {categoryOptions.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategoryChange(category.id)}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
          >
            <Icon
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? '#FFFFFF' : '#6C63FF'}
            />
            <Text
              style={[
                styles.buttonLabel,
                selectedCategory === category.id && styles.selectedCategoryLabel
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 3,
  },
  carousel: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  selectedCategory: {
    backgroundColor: '#6C63FF',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginLeft: 8,
  },
  selectedCategoryLabel: {
    color: '#FFFFFF',
  },
});

export default RenderCategoryCarousel;