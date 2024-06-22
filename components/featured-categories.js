// FeaturedItems.js

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'; // Assuming you use react-native-elements for icons

const categories = [
  { id: 1, title: 'Category 1', icon: 'heart', description: 'Description for Category 1' },
  { id: 2, title: 'Category 2', icon: 'star', description: 'Description for Category 2' },
  { id: 3, title: 'Category 3', icon: 'user', description: 'Description for Category 3' },
  // Add more categories as needed
];

const FeaturedItems = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={featuredItemsStyles.featuredItemsContainer}>
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={featuredItemsStyles.featuredItem}>
          <Icon name={category.icon} type='font-awesome' size={30} color='#6c63ff' />
          <Text style={featuredItemsStyles.featuredItemTitle}>{category.title}</Text>
          <Text style={featuredItemsStyles.featuredItemDescription}>{category.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const featuredItemsStyles = StyleSheet.create({
  featuredItemsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    marginVertical: 10,
  },
  featuredItem: {
    width: 150,
    padding: 10,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
  },
  featuredItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featuredItemDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default FeaturedItems;
