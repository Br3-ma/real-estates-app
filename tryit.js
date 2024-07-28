// src/screens/SearchResultScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Image, RefreshControl } from 'react-native';
import { Button, IconButton, Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { API_BASE_URL } from '../../config/config';
import PostViewerModal from '../../components/post-details';
import CommentsModal from '../../components/post-comments-modal';
import FilterScroll from '../../components/filterScroll';
import ShareModal from '../../components/share-modal';
import RenderItem from '../../components/RenderItem';

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
  }, []);

  const fetchLocationOptions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      const data = await response.json();
      setLocationOptions(data.data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  const saveFavorites = useCallback(async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, []);

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
  }, []);

  const showImageViewer = useCallback((images, itemId, item) => {
    setCurrentImages(images);
    setSelectedItemId(itemId);
    setSelectedProperty(item);
    setPostViewerModalVisible(true);
  }, []);

  const handleFilter = useCallback(async () => {
    // Handle filter logic
  }, []);

  const fetchMoreData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search?keyword=${searchKeyword}&page=${page + 1}`);
      const newData = await response.json();
      setData([...data, ...newData.data]);
      setPage(page + 1);
    } catch (error) {
      console.error('Failed to fetch more data:', error);
    }
    setLoading(false);
  }, [page, data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search?keyword=${searchKeyword}&page=1`);
      const newData = await response.json();
      setData(newData.data);
      setPage(1);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
    setRefreshing(false);
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <FilterScroll
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      />
      <PostViewerModal
        isVisible={isPostViewerModalVisible}
        images={currentImages}
        selectedItemId={selectedItemId}
        selectedProperty={selectedProperty}
        onClose={() => setPostViewerModalVisible(false)}
      />
      <CommentsModal
        isVisible={isCommentsModalVisible}
        itemId={selectedItemId}
        onClose={() => setCommentsModalVisible(false)}
      />
      <ShareModal
        isVisible={isShareModalVisible}
        item={selectedItem}
        onClose={() => setShareModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  avatarIcon: {
    backgroundColor: '#3498db',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
  },
  bedBathContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bedBathIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bedBathIcon: {
    marginRight: 5,
  },
  bedBathText: {
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageCountContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#00000099',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCount: {
    color: '#ffffff',
    fontSize: 12,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    margin: 5,
  },
  actionButtonLabel: {
    fontSize: 12,
  },
});

export default SearchResultScreen;
