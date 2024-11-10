// StepFive.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const StepFive = ({ categories, propertyDetails, setPropertyDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState(propertyDetails.category_id);

  const handleSelectCategory = (category) => {
    setPropertyDetails({ ...propertyDetails, category_id: category.id });
    setSelectedCategory(category.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.item,
              selectedCategory === category.id && styles.itemSelected,
            ]}
            onPress={() => handleSelectCategory(category)}
          >
            <Text style={styles.itemText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default StepFive;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingBottom: 60,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  itemSelected: {
    backgroundColor: '#438ab5',
  },
  itemText: {
    color: '#333',
    textAlign: 'center',
  },
});
