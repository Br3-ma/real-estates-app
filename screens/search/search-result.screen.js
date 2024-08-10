import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { API_BASE_URL, SERVER_BASE_URL } from '../../confg/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';
import ShareModal from '../../components/share-modal';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import renderModalContent from '../../components/search-modal-filter';
import RenderItem from '../../components/search-render-item';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { width, height } = Dimensions.get('window');

const SearchResultScreen = ({ route, navigation }) => {
  const { results, searchKeyword } = route.params;

  const [filters] = useState(['All', 'Price', 'Category', 'Location']);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [data, setData] = useState(results);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filterForm, setFilterForm] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isPostViewerModalVisible, setPostViewerModalVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [numBeds, setNumBeds] = useState([]);
  const [numBaths, setNumBaths] = useState([]);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
    fetchCategoryOptions();
    fetchLocationOptions();
  }, []);

  const fetchCategoryOptions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategoryOptions(data.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },[]);

  const fetchLocationOptions = useCallback( async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      const data = await response.json();
      setLocationOptions(data.data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  },[]);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  },[]);

  const saveFavorites = useCallback(async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },[]);

  const toggleFavorite = useCallback((item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== item.id)
      : [...favorites, item];
    saveFavorites(updatedFavorites);
  }, [favorites]);

  const openCommentsModal = useCallback(async (itemId) => {
    try {
      setSelectedItemId(itemId);
      setCommentsModalVisible(true);
    } catch (error) {
      console.error('Failed to open comments modal:', error);
    }
  }, []);

  const openShareModal = useCallback((item) => {
    setSelectedItem(item);
    setShareModalVisible(true);
  }, [setSelectedItem, setShareModalVisible]);
  
  const closeShareModal = useCallback( () => {
    setSelectedItem(null);
    setShareModalVisible(false);
  },[setShareModalVisible]);

  const handleFilterChange = useCallback((field, value) => {
    setFilterForm({
      ...filterForm,
      [field]: value,
    });
  },[filterForm]);

  const showImageViewer = useCallback(async (images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setPostViewerModalVisible(true);
  },[]);
  
  const handleBedroomsChange = useCallback((num, isChecked) => {
    setNumBeds(prev => {
      const updatedBeds = isChecked ? [...prev, num] : prev.filter(item => item !== num);
      handleFilterChange('bedrooms', updatedBeds);
      return updatedBeds;
    });
  }, [handleFilterChange]);
  
  const handleBathroomsChange = useCallback((num, isChecked) => {
    setNumBaths(prev => {
      const updatedBaths = isChecked ? [...prev, num] : prev.filter(item => item !== num);
      handleFilterChange('bathrooms', updatedBaths);
      return updatedBaths;
    });
  }, [handleFilterChange]); 

  const handleLocationChange = useCallback((locationId) => {
    setSelectedLocations(prevSelectedLocations => {
      const updatedLocations = prevSelectedLocations.includes(locationId)
        ? prevSelectedLocations.filter(id => id !== locationId)
        : [...prevSelectedLocations, locationId];
      handleFilterChange('locations', updatedLocations);
      return updatedLocations;
    });
  }, [handleFilterChange]);


// Submit Filter Form
  
// Submit Filter Form
  const applyFilters = async () => {
    setData([]);
    setModalVisible(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterForm),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
    setLoading(false);
  };

  const getAllProperties = useCallback(async () => {
    setData([]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
    setLoading(false);
  },[]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllProperties();
    setRefreshing(false);
  }, []);

  const renderCategoryCarousel = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
      {categoryOptions.map((category, index) => (
        <Button
          key={index}
          mode={filterForm.category === category.id ? 'contained' : 'outlined'}
          onPress={() => handleCategoryChange(category.id)}
          style={[styles.categoryButton, filterForm.category === category.id && styles.selectedCategory]}
          labelStyle={[styles.buttonLabel, filterForm.category === category.id && styles.selectedCategoryLabel]}
        >
          {category.name}
        </Button>
      ))}
    </ScrollView>
  );

  const handleCategoryChange = (selectedCategory) => {
    const newCategory = filterForm.category === selectedCategory ? null : selectedCategory;
    handleFilterChange('category', newCategory);
  };

  const renderLocationCarousel = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
      {locationOptions.map((location, index) => (
        <Button
          key={index}
          mode={selectedLocations.includes(location.id) ? 'contained' : 'outlined'}
          onPress={() => handleLocationChange(location.id)}
          style={[styles.locationButton, selectedLocations.includes(location.id) && styles.selectedLocation]}
          labelStyle={[styles.buttonLabel, selectedLocations.includes(location.id) && styles.selectedLocationLabel]}
        >
          {location.name}
        </Button>
      ))}
    </ScrollView>
  );

  const renderItem = useCallback(({ item, index }) => (
    <RenderItem
      item={item}
      index={index}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      showImageViewer={showImageViewer}
      openShareModal={openShareModal}
      openCommentsModal={openCommentsModal}
      styles={styles}
    />
  ), [favorites]);

  // Placeholder view when data is empty
  const renderEmptyView = () => (
    <View style={styles.emptyContainer}>
      <Image source={require('../../assets/icon/empty.webp')} style={styles.placeholderImage} />
      <Text style={styles.emptyText}>Didnt find anything?</Text>
      <Button mode="contained" onPress={() => getAllProperties()}>
        Look for properties here
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{searchKeyword}</Text>
      </View>
      <FilterScroll
        filters={filters}
        selectedFilter={selectedFilter}
        onSelectFilter={filter => {
          setSelectedFilter(filter);
          setModalVisible(true);
        }}
      />
      {data.length === 0 ? (
        renderEmptyView()
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReachedThreshold={0.5}
          // onEndReached={loadMore}
          ListFooterComponent={loading ? <ActivityIndicator animating size="large" /> : null}
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          refreshing={refreshing} 
          onRefresh={onRefresh} 
        />
      )}
      <PostViewerModal
        visible={isPostViewerModalVisible}
        images={currentImages}
        property={selectedProperty}
        showImageViewer={showImageViewer}
        onClose={() => setPostViewerModalVisible(false)}
      />
      <CommentsModal
        visible={isCommentsModalVisible}
        postId={selectedItemId}
        onClose={() => setCommentsModalVisible(false)}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        propagateSwipe
      >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedFilter} Filter</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#4A5568" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedFilter} Filter</Text>
            {renderModalContent({ 
              selectedFilter, 
              filterForm, 
              handleFilterChange, 
              handleBedroomsChange, 
              handleBathroomsChange, 
              renderCategoryCarousel, 
              renderLocationCarousel 
            })}
          </ScrollView>
        </View>
      </Modal>
      <ShareModal
        isVisible={isShareModalVisible}
        onClose={closeShareModal}
        item={selectedItem}
        serverBaseUrl={SERVER_BASE_URL}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingTop: 16,
    width: '100%',
    maxHeight: '100%', // Increased to 90% for more content visibility
  },
  filterContent: {
    marginBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    letterSpacing: 0.5,
  },
  applyButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  carousel: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryButton: {
    marginHorizontal: 4,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4299E1',
    backgroundColor: '#EBF8FF',
  },
  selectedCategory: {
    backgroundColor: '#4299E1',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4299E1',
  },
  selectedCategoryLabel: {
    color: '#FFFFFF',
  },
  locationButton: {
    marginHorizontal: 4,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  selectedLocation: {
    backgroundColor: '#48BB78',
  },
  selectedLocationLabel: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  placeholderImage: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 28,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 20,
    color: '#4A5568',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  listContainer: {
    paddingBottom: 140,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 16,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 12,
  },
  video: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 12,
  },
});
export default SearchResultScreen;