import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../confg/config';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.18; // Reduced from 0.22 for more compact layout

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
          if (isMountedRef.current) {
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
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMountedRef.current = false;
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
        body: JSON.stringify(Object.fromEntries(searchData)),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      navigation.navigate('SearchResultScreen', { results: data, searchKeyword: 'Search Results' });
    } catch (err) {
      console.error('Error during search:', err);
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
        <Icon name="error-outline" type="material" size={24} color="#FF4757" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Browse For Property</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
        snapToInterval={ITEM_WIDTH + 8} // Added smooth snapping
        decelerationRate="fast"
      >
        {Array.isArray(categories) && categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.featuredItem}
            onPress={() => handlePress(category.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon 
                name={category.icon_name || 'home'} 
                type={category.type} 
                size={20} 
                color="#4FACFE"
                style={styles.icon}
              />
            </View>
            <Text style={styles.featuredItemTitle} numberOfLines={1}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 6,
    paddingHorizontal: 12,
    letterSpacing: 0.3,
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredItem: {
    width: ITEM_WIDTH,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  iconContainer: {
    width: ITEM_WIDTH * 0.75,
    height: ITEM_WIDTH * 0.75,
    borderRadius: ITEM_WIDTH * 0.375,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    marginBottom: 4,
    shadowColor: '#4FACFE',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  icon: {
    transform: [{ scale: 1.1 }],
  },
  featuredItemTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2D3748',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  shimmerItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  errorContainer: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    marginHorizontal: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4757',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default FeaturedItems;