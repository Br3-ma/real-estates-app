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

  const handlePress = useCallback( async (categoryId) => {
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
  },[]);

  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={featuredItemsStyles.featuredItemsContainer}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <View key={index} style={featuredItemsStyles.featuredItem}>
            <ShimmerPlaceholder style={featuredItemsStyles.shimmerIcon} />
            <ShimmerPlaceholder style={featuredItemsStyles.shimmerTextTitle} />
            <ShimmerPlaceholder style={featuredItemsStyles.shimmerTextDescription} />
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
          <Icon name={category.icon_name || 'home'} type={category.type} size={30} color="#438ab5" />
          <Text style={featuredItemsStyles.featuredItemTitle}>{category.name}</Text>
          <Text style={featuredItemsStyles.featuredItemDescription}>{category.desc}</Text>
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
    backgroundColor: '#FAF4FC',
    borderColor:'#FAF4FC',
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 3,
    alignItems: 'center',
  },
  featuredItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    color:'#438ab5',
  },
  featuredItemDescription: {
    fontSize: 14,
    color:'#438ab5',
    textAlign: 'center',
  },
  shimmerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 10,
  },
  shimmerTextTitle: {
    width: 100,
    height: 20,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  shimmerTextDescription: {
    width: 80,
    height: 15,
    borderRadius: 5,
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
