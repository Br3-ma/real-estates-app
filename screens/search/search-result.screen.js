import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { Menu, Provider } from 'react-native-paper'; 
import { API_BASE_URL, SERVER_BASE_URL } from '../../confg/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';
import ShareModal from '../../components/share-modal';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import renderModalContent from '../../components/search-modal-filter';
import RenderItem from '../../components/search-render-item';
import RenderLocationCarousel from '../../components/carousel-locations';
import RenderCategoryCarousel from '../../components/carousel-categories';
import EmptyStateView from '../../components/empty-state';
import ShimmerSearchLoading from '../../components/shimmer-loader-search';

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllProperties();
    setRefreshing(false);
  }, []);

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

  const showImageViewer = useCallback(async (images, property) => {
    try {
      if (isPostViewerModalVisible) {
        setPostViewerModalVisible(false);
      }
      // Proceed with setting the images and property
      setCurrentImages(images);
      setSelectedProperty(property);
      setPostViewerModalVisible(true);
    } catch (error) {
      console.error('Error in showImageViewer:', error);
    }
  }, [isPostViewerModalVisible]);

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
  

  const handleCategoryChange = useCallback( (selectedCategory) => { 
    const newCategory = filterForm.category === selectedCategory ? null : selectedCategory;
    handleFilterChange('category', newCategory);
    return newCategory;
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

  const renderLocationCarousel = () => (
    <RenderLocationCarousel
      locationOptions={locationOptions}
      selectedLocations={selectedLocations}
      handleLocationChange={handleLocationChange}
    />
  );
  const renderCategoryCarousel = () => (
    <RenderCategoryCarousel
      categoryOptions={categoryOptions}
      selectedCategory={filterForm.category}
      handleCategoryChange={handleCategoryChange}
    />
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
    data.length === 0 && !loading && <EmptyStateView onRefresh={getAllProperties} />
  );

  return (
    <Provider>
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
      {loading ? (
        <ShimmerSearchLoading isLoading={loading} />
      ) : data.length === 0 ? (
        renderEmptyView()
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReachedThreshold={0.5}
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
        allProperties={data}
        openPostDetails={showImageViewer}
        openCommentsModal={openCommentsModal}
        onClose={() => setPostViewerModalVisible(false)}
        fetchProperties={data}
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
          </View>
          <ScrollView style={styles.filterContent}>
            <AnimatedScrollView
              style={styles.filterContent}
              bounces={false}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              {renderModalContent({
                selectedFilter,
                filterForm,
                handleFilterChange,
                handleBedroomsChange,
                handleBathroomsChange,
                renderCategoryCarousel,
                renderLocationCarousel
              })}
            </AnimatedScrollView>
          </ScrollView>
        </View>
        </GestureHandlerRootView>
          <Button mode="contained" onPress={applyFilters}>
                Apply
          </Button>
      </Modal>
      <ShareModal
        isVisible={isShareModalVisible}
        onClose={closeShareModal}
        item={selectedItem}
        serverBaseUrl={SERVER_BASE_URL}
      />
    </SafeAreaView>
  </Provider>
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
    backgroundColor: '#fff',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 16,
    width: '100%',
    maxHeight: '100%',
  },
  filterContent: {
    marginBottom: 15,
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