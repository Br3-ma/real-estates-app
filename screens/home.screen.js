import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View,Linking, ActivityIndicator, Text, ScrollView, SafeAreaView, Platform, StatusBar, Keyboard, RefreshControl } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import FeaturedItems from './../components/featured-categories'; 
import Toast from 'react-native-toast-message';
import moment from 'moment';
import axios from 'axios';
import styles from '../assets/css/home.css';
import { API_BASE_URL } from '../confg/config';
import AdAdPost from '../components/ad-ad-post';
import BlankView from '../components/blank-bottom';
import { LinearGradient } from 'expo-linear-gradient';
import SearchModal from '../components/search-filter';
import MovingPlaceholder from '../components/placeholder-effect';
import { fetchUserInfo } from '../controllers/auth/userController';
import RenderPropertyItem from '../components/display-properties';
import Communications from 'react-native-communications';
import HomeImageViewerModal from '../components/post-home-details';
import CommentsModal from '../components/post-comments-modal';
import TopListing from '../components/top-listing';

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [hot_properties, setHotProperties] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentVideos, setCurrentVideos] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchIntervalRef = useRef(null);
  const [category, setCategory] = useState('');
  const [filterForm, setFilterForm] = useState({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [numBeds, setNumBeds] = useState(0);
  const [numBaths, setNumBaths] = useState(0);
  const [btnOptions, setButtons] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-posts`);
        setProperties(response.data);

        const response1 = await axios.get(`${API_BASE_URL}/hot-property-posts`);
        setHotProperties(response1.data);

        const response2 = await axios.get(`${API_BASE_URL}/categories`); 
        setButtons(response2.data.data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchUser = async () => {
      const user = await fetchUserInfo();
      setUserInfo(user);
    };
    fetchUser();
    fetchProperties();
    return () => {
      terminateFetchInterval();
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setProperties([]);
    setHotProperties([]);
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-posts`);
        setProperties(response.data);

        const response1 = await axios.get(`${API_BASE_URL}/hot-property-posts`);
        setHotProperties(response1.data);
  
        const response2 = await axios.get(`${API_BASE_URL}/categories`); 
        setButtons(response2.data.data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const terminateFetchInterval = () => {
    if (fetchIntervalRef.current !== null) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  
  const handleSearch = async (searchData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });
      const data = await response.json();
      navigation.navigate('SearchResultScreen', { results: data, searchKeyword: 'Search Results' });
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const showImageViewer = async (images, videos, property) => {
    setImageViewVisible(false);
    setCurrentImages([]);
    setCurrentVideos([]);
    setSelectedProperty(null);
    setCurrentImages(images);
    setCurrentVideos(videos);
    setSelectedProperty(property);
    setImageViewVisible(true);
  };

  const sendSMS = (phoneNumber) => {
    Communications.text(phoneNumber, 'Hello, this is a test message.');
    console.log('Sending SMS to:', phoneNumber);
  };
  
  const callNumber = (phoneNumber) => {
    Communications.phonecall(phoneNumber, true);
    console.log('Calling number:', phoneNumber);
  };
  
  const openWhatsApp = (phoneNumber) => {
    let msg = 'Hello, this is a test message.';
    let mobile =
      Platform.OS === 'ios' ? phoneNumber : `+${phoneNumber}`;
  
    if (mobile) {
      let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
      Linking.openURL(url)
        .then((data) => {
          console.log('WhatsApp Opened');
        })
        .catch(() => {
          console.log('Make sure WhatsApp installed on your device');
        });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Missing field',
        text2: 'Please insert mobile no'
      });
    }
  };

  const openCommentsModal = async (itemId) => {
    try {
      setSelectedItemId(itemId);
      setCommentsModalVisible(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Oops..',
        text2: `Could not display post comments ${error}`
      });
    }
  };

  const closeCommentsModal = () => {
    setCommentsModalVisible(false);
    terminateFetchInterval();
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterForm((prevForm) => ({ ...prevForm, [filterName]: filterValue }));
  };  

  const handleTopListingPress = useCallback((item) => {
    showImageViewer(item.images, item.videos, item);
  }, [showImageViewer]);

  const renderPropertyItem = ({ item }) => {
    return (
      <RenderPropertyItem 
        item={item} 
        showImageViewer={showImageViewer} 
        openCommentsModal={openCommentsModal}
      />
    );
  };
  
  const renderImageViewerModal = () => {
    return (
      <HomeImageViewerModal
        isImageViewVisible={isImageViewVisible}
        setImageViewVisible={setImageViewVisible}
        currentImages={currentImages}
        currentVideos={currentVideos}
        selectedProperty={selectedProperty}
        terminateFetchInterval={terminateFetchInterval}
        openFeatureLink={function openFeatureLink(params) {
          
        }}
        openMap={function openMap(params) {
          
        }}
        sendSMS={sendSMS}
        callNumber={callNumber}
        openWhatsApp={openWhatsApp}
        openCommentsModal={openCommentsModal}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="white-content" />
      <LinearGradient
        colors={['#fff', '#fff', '#fff']}
        style={styles.gradient}
      >
      <SearchBar
        placeholder="Search properties..."
        onFocus={openModal}
        value={search}
        platform={Platform.OS}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
        inputStyle={{ color: '#000' }}
        searchIcon={<Icon name="search" color="#60279C" />}
        renderPlaceholder={(focused) => <MovingPlaceholder text="Search properties..." />}
      />
        <ScrollView style={styles.homeBody} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View style={styles.featuredSection}>
            <Text style={styles.featuredSectionTitle}>This might help you</Text>
            <FeaturedItems />
          </View>
          <TopListing 
            properties={hot_properties.slice(0, 10)} 
            loading={loading}
            onPress={handleTopListingPress}
          />
          {loading ? (
            <View style={styles.loader}>
              {[1, 2, 3].map((item) => (
                <ShimmerPlaceholder key={`loader-${item}`} style={styles.placeholder} />
              ))}
            </View>
          ) : (
            <View style={styles.bodyContent}>
              {properties.map((property) => (
                <View key={property.id}>{renderPropertyItem({ item: property })}</View>
              ))}
            </View>
          )}

          <AdAdPost />
          <BlankView />
        </ScrollView>
      </LinearGradient>

      <SearchModal
        isVisible={isModalVisible}
        closeModal={closeModal}
        handleSearch={handleSearch}
        isLoading={isLoading}
        filterForm={filterForm}
        handleFilterChange={handleFilterChange}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        category={category}
        setCategory={setCategory}
        numBeds={numBeds}
        setNumBeds={setNumBeds}
        numBaths={numBaths}
        setNumBaths={setNumBaths}
      />
      {renderImageViewerModal()}
      <CommentsModal 
        visible={isCommentsModalVisible}
        postId={selectedItemId}
        onClose={closeCommentsModal}
      />
      {isLoading && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
};

export default HomeScreen;