import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  Dimensions, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { API_BASE_URL } from '../confg/config';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingOverlay from './preloader';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.18; 

const FeaturedItems = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
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
    setIsProcessing(true); // Show loading overlay

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
    } finally {
      setIsProcessing(false); // Hide loading overlay
    }
  }, [navigation]);

  if (isLoading) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
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
        snapToInterval={ITEM_WIDTH + 8} // Smooth snapping
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
                size={30} 
                color="#8E2DE2"
                style={styles.icon}
              />
            </View>
            <Text style={styles.featuredItemTitle} numberOfLines={1}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Full-Screen Loading Modal */}
      {/* <Modal visible={visible} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <View style={styles.glowContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
            <Text style={styles.loadingText}>{message}</Text>
            <View style={styles.dots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      </Modal> */}

      <LoadingOverlay visible={isProcessing} message="Processing..." />
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
    shadowOffset: { width: 0, height: 2 },
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
    fontFamily: 'Montserrat-Bold',
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
    shadowOffset: { width: 0, height: 2 },
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
    color: '#574568',
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
  // Preloader effect theme
  // loadingOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0,0,0,0.7)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // loadingContainer: {
  //   backgroundColor: 'rgba(30,30,30,0.9)',
  //   borderRadius: 16,
  //   padding: 24,
  //   alignItems: 'center',
  //   minWidth: 150,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 8,
  //   elevation: 10,
  //   borderWidth: 1,
  //   borderColor: 'rgba(255,255,255,0.1)',
  // },
  // glowContainer: {
  //   width: 70,
  //   height: 70,
  //   borderRadius: 35,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(59,130,246,0.1)',  // Very subtle blue glow
  // },
  // loadingText: {
  //   marginTop: 16,
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: '600',
  //   letterSpacing: 0.5,
  // },
  // dots: {
  //   flexDirection: 'row',
  //   marginTop: 12,
  // },
  // dot: {
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: 'rgba(255,255,255,0.2)',
  //   marginHorizontal: 3,
  // },
  // dotActive: {
  //   backgroundColor: '#3B82F6',
  // },
});

export default FeaturedItems;
