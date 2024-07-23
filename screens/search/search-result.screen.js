import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Image, RefreshControl } from 'react-native';
import { Button, Card, IconButton, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { API_BASE_URL, SERVER_BASE_URL } from '../../confg/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';
import ShareModal from '../../components/share-modal';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 10;

const SearchResultScreen = ({ route, navigation }) => {
  const { results, searchKeyword } = route.params;

  const [filters, setFilters] = useState(['All', 'Price', 'Category', 'Location']);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [data, setData] = useState(results);
  const [page, setPage] = useState(1);
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
    // Fetch new data here
    getAllProperties();
    setRefreshing(false);
  }, []);

  const loadMore = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`${API_BASE_URL}/search-all?page=${nextPage}&limit=${PAGE_SIZE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newData = await response.json();
      setData(prevData => [...prevData, ...newData]); // Append new data to existing data
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more:', error);
    }
    setLoading(false);
  }, [loading, page]);

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
  
  const renderModalContent = () => {
    switch (selectedFilter) {
      case 'Price':
        return (
          <>
            <View style={styles.formGroup}>
              <Text>Price Range</Text>
              <TextInput
                style={styles.input}
                placeholder="Min Price"
                value={filterForm.minPrice}
                onChangeText={(text) => handleFilterChange('minPrice', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Max Price"
                value={filterForm.maxPrice}
                onChangeText={(text) => handleFilterChange('maxPrice', text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text>Bedrooms</Text>
              <View style={styles.checkboxContainer}>
                {[1, 2, 3, 4, 5].map(num => (
                  <BouncyCheckbox
                    key={`bedrooms-${num}`}
                    size={25}
                    fillColor="#4a90e2"
                    unfillColor="#FFFFFF"
                    text={`${num}`}
                    iconStyle={{ borderColor: '#4a90e2' }}
                    onPress={(isChecked) => handleBedroomsChange(num, isChecked)}
                    isChecked={filterForm[`bedrooms${num}`] || false}
                    style={styles.checkbox}
                  />
                ))}
              </View>
              <Text>Bathrooms</Text>
              <View style={styles.checkboxContainer}>
                {[1, 2, 3, 4, 5].map(num => (
                  <BouncyCheckbox
                    key={`bathrooms-${num}`}
                    size={25}
                    fillColor="#4a90e2"
                    unfillColor="#FFFFFF"
                    text={`${num}`}
                    iconStyle={{ borderColor: '#4a90e2' }}
                    onPress={(isChecked) => handleBathroomsChange(num, isChecked)}
                    isChecked={filterForm[`bathrooms${num}`] || false}
                    style={styles.checkbox}
                  />
                ))}
              </View>
            </View>
          </>
        );
      case 'Category':
        return renderCategoryCarousel();
      case 'Location':
        return renderLocationCarousel();
      default:
        return (
          <>
            <View style={styles.formGroup}>
              <Text>Price Range</Text>
              <TextInput
                style={styles.input}
                placeholder="Min Price"
                value={filterForm.minPrice}
                onChangeText={(text) => handleFilterChange('minPrice', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Max Price"
                value={filterForm.maxPrice}
                onChangeText={(text) => handleFilterChange('maxPrice', text)}
              />
            </View>
            <View style={styles.formGroup}>
              <Text>Bedrooms</Text>
              <View style={styles.checkboxContainer}>
                {[1, 2, 3, 4, 5].map(num => (
                  <BouncyCheckbox
                  key={`bedrooms-${num}`}
                  size={25}
                  fillColor="#4a90e2"
                  unfillColor="#FFFFFF"
                  text={`${num}`}
                  iconStyle={{ borderColor: '#4a90e2' }}
                  onPress={(isChecked) => handleBedroomsChange(num, isChecked)}
                  isChecked={filterForm[`bedrooms${num}`] || false}
                  style={styles.checkbox}
                />
                ))}
              </View>
              <Text>Bathrooms</Text>
              <View style={styles.checkboxContainer}>
                {[1, 2, 3, 4, 5].map(num => (
                  <BouncyCheckbox
                  key={`bathrooms-${num}`}
                  size={25}
                  fillColor="#4a90e2"
                  unfillColor="#FFFFFF"
                  text={`${num}`}
                  iconStyle={{ borderColor: '#4a90e2' }}
                  onPress={(isChecked) => handleBathroomsChange(num, isChecked)}
                  isChecked={filterForm[`bathrooms${num}`] || false}
                  style={styles.checkbox}
                />
                ))}
              </View>
            </View>
            <Text>Location</Text>
            {renderLocationCarousel()}
            {renderCategoryCarousel()}
          </>
        );
    }
  };

  const renderItem = ({ item, index }) => (
    <Card style={styles.card} key={`${item.id}-${index}`}>
      <Card.Title
        title={item.title || 'No Title'}
        titleStyle={styles.cardTitle}
        subtitle={`K${item.price.toLocaleString()}`}
        subtitleStyle={styles.cardSubtitle}
        left={(props) => <Avatar.Icon {...props} icon="home-outline" style={styles.avatarIcon} color="#ffffff" />}
        right={(props) => (
          <IconButton
            {...props}
            icon={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-outline'}
            color={favorites.some(fav => fav.id === item.id) ? '#e74c3c' : '#7f8c8d'}
            size={24}
            onPress={() => toggleFavorite(item)}
          />
        )}
      />
      <Card.Content>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        <View style={styles.bedBathContainer}>
          <View style={styles.bedBathIconContainer}>
            <MaterialCommunityIcons name="bed" size={24} color="#3498db" style={styles.bedBathIcon} />
            <Text style={styles.bedBathText}>{item.bedrooms} Bedrooms</Text>
          </View>
          <View style={styles.bedBathIconContainer}>
            <MaterialCommunityIcons name="bathtub" size={24} color="#3498db" style={styles.bedBathIcon} />
            <Text style={styles.bedBathText}>{item.bathrooms} Bathrooms</Text>
          </View>
        </View>
        {item.images && item.images.length > 0 ? (
          <TouchableOpacity onPress={() => showImageViewer(item.images, item.id, item)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[0].path }} style={styles.image} />
              {item.images.length > 1 && (
                <View style={styles.imageCountContainer}>
                  <Text style={styles.imageCount}>{`+${item.images.length - 1}`}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : item.videos && item.videos.length > 0 ? (
          <TouchableOpacity onPress={() => showImageViewer(item.images, item.id, item)}>
          <Video
            source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.videos[0].path }}
            style={styles.video}
            // useNativeControls
            resizeMode="cover"
            isLooping
          /></TouchableOpacity>
        ) : (
          <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/images/home.webp` }} style={styles.image} />
        )}
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button icon="phone" mode="contained" onPress={() => Linking.openURL(`tel:26${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>Call</Button>
        <Button icon="whatsapp" mode="contained" onPress={() => Linking.openURL(`https://wa.me/26${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>WhatsApp</Button>
        <Button icon="message" mode="contained" onPress={() => Linking.openURL(`sms:${item.user.phone}`)} style={styles.actionButton} labelStyle={styles.actionButtonLabel}>SMS</Button>
        <IconButton icon="share" size={24} onPress={() => openShareModal(item)} />
        <IconButton icon="comment-outline" size={24} onPress={() => openCommentsModal(item.id)} />
      </Card.Actions>
    </Card>
  );

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
      >
        <View style={styles.modalContent}>
          
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{selectedFilter} Filter</Text>
          {renderModalContent()}
          <Button mode="contained" onPress={applyFilters}>
            Apply
          </Button>
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    backdropFilter: 'blur(10px)', // This works for web, but not for React Native
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
  carousel: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryButton: {
    marginHorizontal: 8,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#4299E1',
    backgroundColor: '#EBF8FF',
  },
  selectedCategory: {
    backgroundColor: '#4299E1',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4299E1',
  },
  selectedCategoryLabel: {
    color: '#FFFFFF',
  },
  locationButton: {
    marginHorizontal: 8,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  selectedLocation: {
    backgroundColor: '#48BB78',
  },
  selectedLocationLabel: {
    color: '#FFFFFF',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: 24,
    width: '100%',
  },
  input: {
    height: 52,
    borderColor: '#CBD5E0',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 18,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#2D3748',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    marginHorizontal: 10,
    marginVertical: 6,
  },
  card: {
    marginHorizontal: 2,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  bedBathContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 14,
  },
  bedBathIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bedBathIcon: {
    marginRight: 8,
    color: '#4A5568',
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
  imageCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 'bold',
    overflow: 'hidden',
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
});


export default SearchResultScreen;
