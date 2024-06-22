import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Image } from 'react-native';
import { Button, Card, IconButton, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
import { SERVER_BASE_URL } from '../../confg/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';

const { width } = Dimensions.get('window');
const checkboxWidth = (width - 40) / 5;

const SearchResultScreen = ({ route }) => {
  const navigation = useNavigation();
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

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== item.id)
      : [...favorites, item];
    saveFavorites(updatedFavorites);
  };

  const handleFilterChange = (field, value) => {
    setFilterForm({
      ...filterForm,
      [field]: value,
    });
  };

  const applyFilters = async () => {
    setModalVisible(false);
    setLoading(true);

    // Make API call to Laravel endpoint
    try {
      const response = await fetch(`${SERVER_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterForm),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const showImageViewer = async (images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setPostViewerModalVisible(true);
  };

  const openCommentsModal = async (itemId) => {
    try {
      // Mock implementation of fetching comments
      // const response = await axios.get(`${API_BASE_URL}/post-comments/${itemId}`);
      setSelectedItemId(itemId);
      setCommentsModalVisible(true);
    } catch (error) {
      console.error('Failed to open comments modal:', error);
    }
  };

  const renderCategoryCarousel = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'].map((item, index) => (
        <Button
          key={index}
          mode={filterForm.category === item ? 'contained' : 'outlined'}
          onPress={() => handleFilterChange('category', item)}
          style={styles.categoryButton}
          labelStyle={styles.buttonLabel} // Adjust button text style
        >
          {item}
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
                    onPress={(isChecked) => handleFilterChange(`bedrooms${num}`, isChecked)}
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
                    onPress={(isChecked) => handleFilterChange(`bathrooms${num}`, isChecked)}
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
        return (
          <>
            <Text>Province</Text>
            <RNPickerSelect
              onValueChange={(value) => handleFilterChange('province', value)}
              items={[
                { label: 'Province 1', value: 'province1' },
                { label: 'Province 2', value: 'province2' },
              ]}
            />
            <Text>City</Text>
            <RNPickerSelect
              onValueChange={(value) => handleFilterChange('city', value)}
              items={[
                { label: 'City 1', value: 'city1' },
                { label: 'City 2', value: 'city2' },
              ]}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderItem = ({ item, index }) => (
    <Card style={styles.card} key={`${item.id}-${index}`}>
      <Card.Title
        title={item.title || 'No Title'}
        subtitle={`$${item.price}`}
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
        <IconButton icon="phone" onPress={() => Linking.openURL(`tel:${item.user.phone}`)} />
        <IconButton icon="whatsapp" onPress={() => Linking.openURL(`https://wa.me/${item.user.phone}`)} />
        <IconButton icon="message" onPress={() => Linking.openURL(`sms:${item.user.phone}`)} />
        <IconButton icon="share" />
        <IconButton icon="comment-outline" onPress={() => openCommentsModal(item.id)} />
      </Card.Actions>
    </Card>
  );

  const renderAdvert = () => (
    <View style={styles.advertContainer}>
      <Text style={styles.advertText}>Advertisement</Text>
      {/* Your advertisement component goes here */}
      <Text>Advertisement Content</Text>
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
      {renderAdvert()}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator animating size="large" /> : null}
        contentContainerStyle={styles.listContainer}
      />
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
  categoryButton: {
    marginHorizontal: 5,
    marginBottom: 10,
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
  advertContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  advertText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonLabel: {
    fontSize: 14,
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
});

export default SearchResultScreen;
