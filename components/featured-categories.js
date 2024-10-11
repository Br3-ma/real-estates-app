import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../confg/config';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.22;

const FeaturedItems = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const isMountedRef = useRef(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-types`);
        if (Array.isArray(response.data.data)) {
          if (isMountedRef.current) { // Check if the component is still mounted
            setCategories(response.data.data);
          }
        } else {
          console.error('Expected array but received:', response.data.message);
          if (isMountedRef.current) {
            setError('Unexpected response format');
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        if (isMountedRef.current) {
          setError('Error fetching categories');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false); // Ensure loading state is updated
        }
      }
    };

    fetchCategories();

    return () => {
      isMountedRef.current = false; // Cleanup: set ref to false when component unmounts
    };
  }, []);

  const handlePress = useCallback(async (categoryId) => {
    const searchData = new FormData();
    searchData.append('property_type_id', categoryId);

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(searchData)), // Convert FormData to JSON
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      navigation.navigate('SearchResultScreen', { results: data, searchKeyword: 'Search Results' });
    } catch (err) {
      console.error('Error during search:', err);
      // Handle any additional error state or user feedback here
    }
  }, [navigation]);

  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {[1, 2, 3, 4].map((index) => (
          <ShimmerPlaceholder
            key={`shimmer-${index}`}
            LinearGradient={LinearGradient}
            style={styles.shimmerItem}
          />
        ))}
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" type="material" size={36} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Browse categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {Array.isArray(categories) && categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.featuredItem}
            onPress={() => handlePress(category.id)}
          >
            <View style={styles.iconContainer}>
              <Icon name={category.icon_name || 'home'} type={category.type} size={24} color="#4FACFE" />
            </View>
            <Text style={styles.featuredItemTitle}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  container: {
    paddingHorizontal: 12,
  },
  featuredItem: {
    width: ITEM_WIDTH,
    marginRight: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: ITEM_WIDTH * 0.8,
    height: ITEM_WIDTH * 0.8,
    borderRadius: ITEM_WIDTH * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuredItemTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4A5568',
    marginTop: 4,
  },
  shimmerItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    marginRight: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default FeaturedItems;