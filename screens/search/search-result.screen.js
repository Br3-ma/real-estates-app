import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Image } from 'react-native';
import { Button, Card, IconButton, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL, SERVER_BASE_URL } from '../../confg/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';

const { width } = Dimensions.get('window');
const checkboxWidth = (width - 40) / 5;

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
  const [selectedLocations, setSelectedLocations] = useState([]);


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

  const toggleFavorite =useCallback( (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== item.id)
      : [...favorites, item];
    saveFavorites(updatedFavorites);
  },[]);

  const openCommentsModal = useCallback(async (itemId) => {
    try {
      setSelectedItemId(itemId);
      setCommentsModalVisible(true);
    } catch (error) {
      console.error('Failed to open comments modal:', error);
    }
  },[]);

  const handleFilterChange = useCallback((field, value) => {
    setFilterForm({
      ...filterForm,
      [field]: value,
    });
  },[]);

  const showImageViewer = useCallback(async (images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setPostViewerModalVisible(true);
  },[]);
  // checkboxes 
  const handleBedroomsChange = useCallback((num, isChecked) => {
    console.log('Previous numBeds:', numBeds);
    if (Array.isArray(numBeds)) {
      if (isChecked) {
        setNumBeds(prev => [...prev, num]); // Add num to the array
      } else {
        setNumBeds(prev => prev.filter(item => item !== num)); // Remove num from the array
      }
      handleFilterChange(`bedrooms${num}`, isChecked);
    } else {
      console.error('numBeds is not an array:', numBeds);
    }
  },[]);
  
  const handleBathroomsChange = useCallback((num, isChecked) => {
    console.log('Previous numBaths:', numBaths);
    if (Array.isArray(numBaths)) {
      if (isChecked) {
        setNumBaths(prev => [...prev, num]); // Add num to the array
      } else {
        setNumBaths(prev => prev.filter(item => item !== num)); // Remove num from the array
      }
      handleFilterChange(`bathrooms${num}`, isChecked);
    } else {
      console.error('numBaths is not an array:', numBaths);
    }
  },[]);
  
  const handleLocationChange = useCallback((locationId) => {
    setSelectedLocations(prevSelectedLocations => {
      if (prevSelectedLocations.includes(locationId)) {
        return prevSelectedLocations.filter(id => id !== locationId);
      } else {
        return [...prevSelectedLocations, locationId];
      }
    });
  },[]);  

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
        <Text>{item.description}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Bedrooms: {item.bedrooms}, Bathrooms: {item.bathrooms}</Text>
        {item.images && item.images.length > 0 && (
          <TouchableOpacity onPress={() => showImageViewer(item.images, item.id, item)}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + item.images[0].path }} style={styles.image} />
              {item.images.length > 1 && (
                <Text style={styles.imageCount}>{`+${item.images.length - 1}`}</Text>
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
        <IconButton icon="share" />
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
          ListFooterComponent={loading ? <ActivityIndicator animating size="large" /> : null}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <PostViewerModal
        visible={isPostViewerModalVisible}
        images={currentImages}
        property={selectedProperty}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: (width - 40) / 2 - 10,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  imageCount: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  imageCountText: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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
});

export default SearchResultScreen;
