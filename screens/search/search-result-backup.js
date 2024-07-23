import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Image, RefreshControl } from 'react-native';
import { Button, Card, IconButton, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { API_BASE_URL, SERVER_BASE_URL } from '../../confg/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';
import ShareModal from '../../components/share-modal';

const { width } = Dimensions.get('window');
const checkboxWidth = (width - 40) / 5;
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
        subtitle={`K${item.price}`}
        left={(props) => <Avatar.Icon {...props} icon="home-outline" />}
        right={(props) => (
          <IconButton
            {...props}
            icon={favorites.some(fav => fav.id === item.id) ? 'heart' : 'heart-outline'}
            color={favorites.some(fav => fav.id === item.id) ? '#f00' : undefined}
            onPress={() => toggleFavorite(item)}
          />
        )}
      />
      <Card.Content>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.propertyDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="bed" size={18} color="#555" />
            <Text style={styles.detailText}>{item.bedrooms}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="bath" size={18} color="#555" />
            <Text style={styles.detailText}>{item.bathrooms}</Text>
          </View>
        </View>
        {item.images && item.images.length > 0 && (
          <TouchableOpacity onPress={() => showImageViewer(item.images, item.id, item)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[0].path }} style={styles.image} />
              {item.images.length > 1 (
                <>
                  <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[1].path }} style={styles.image} />
                  {item.images.length > 2 && (
                    <Text style={styles.imageCount}>{`+${item.images.length - 2}`}</Text>
                  )}
                </>
              )}
            </View>
            <Text style={styles.imageCountText}>{`Total Images: ${item.images.length}`}</Text>
          </TouchableOpacity>
        )}
      </Card.Content>
      <Card.Actions>
        <IconButton icon="phone" onPress={() => Linking.openURL(`tel:26${item.user.phone}`)} />
        <IconButton icon="whatsapp" onPress={() => Linking.openURL(`https://wa.me/26${item.user.phone}`)} />
        <IconButton icon="message" onPress={() => Linking.openURL(`sms:${item.user.phone}`)} />
        <IconButton icon="share" onPress={() => openShareModal(item)} />
        <IconButton icon="comment-outline" onPress={() => openCommentsModal(item.id)} />
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
    backgroundColor: '#fff',
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },  
  card: {
    margin: 10,
    paddingVertical: 10,
  },
  description: {
    marginBottom: 10,
    fontSize: 14,
    color: '#555',
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  imageCount: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imageCountText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  carousel:{
    paddingHorizontal:5,
  },
  formGroup: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  checkbox: {
    width: checkboxWidth,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  categoryButton: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  buttonLabel: {
    fontSize: 14,
    color: '#4a90e2',
  },
  selectedCategory: {
    backgroundColor: '#4a90e2',
    marginHorizontal: 10,
  },
  selectedCategoryLabel: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 150,
    height: 100,
    marginBottom: 40,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 20,
    color: 'gray',
  },
  bedBathContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  bedBathIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bedBathIcon: {
    marginRight: 5,
  },
});

export default SearchResultScreen;
