// FeaturedItems.js
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../confg/config';
import { useNavigation } from '@react-navigation/native';

const FeaturedItems = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-types`);
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error('Expected array but received:', response.data.message);
          setError('Unexpected response format');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error fetching categories');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePress = useCallback(async (categoryId) => {
    const searchData = new FormData();
    searchData.append('property_type_id', categoryId);

    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData),
    });
    const data = await response.json();
    navigation.navigate('SearchResultScreen', { results: data, searchKeyword: 'Search Results' });
  }, []);

  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={featuredItemsStyles.featuredItemsContainer}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={featuredItemsStyles.featuredItem}>
            <ShimmerPlaceholder style={featuredItemsStyles.shimmerIcon} />
            <ShimmerPlaceholder style={featuredItemsStyles.shimmerTextTitle} />
          </View>
        ))}
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={featuredItemsStyles.errorContainer}>
        <Text style={featuredItemsStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={featuredItemsStyles.featuredItemsContainer}>
      {Array.isArray(categories) && categories.map((category) => (
        <TouchableOpacity 
          key={category.id} 
          style={featuredItemsStyles.featuredItem}
          onPress={() => handlePress(category.id)}
        >
          <View style={featuredItemsStyles.iconContainer}>
            <Icon name={category.icon_name || 'home'} type={category.type} size={30} color="#438ab5" />
          </View>
          <Text style={featuredItemsStyles.featuredItemTitle}>{category.name}</Text>
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
    width: 80,
    marginRight: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C1D5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  featuredItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#438ab5',
    marginTop: 5,
  },
  shimmerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  shimmerTextTitle: {
    width: 60,
    height: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default FeaturedItems;