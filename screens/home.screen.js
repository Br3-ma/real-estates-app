import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Animated, Easing, ActivityIndicator, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Dimensions, RefreshControl } from 'react-native';
import { Button, Icon, SearchBar, Avatar } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import FeaturedItems from './../components/featured-categories'; // Import the new component
import moment from 'moment';
import axios from 'axios';
import styles from '../assets/css/home.css';
import { API_BASE_URL } from '../confg/config';
import { SERVER_BASE_URL } from '../confg/config';
import AdAdPost from '../components/ad-ad-post';
import BlankView from '../components/blank-bottom';
import { LinearGradient } from 'expo-linear-gradient';
import SearchModal from '../components/search-filter';
import MovingPlaceholder from '../components/placeholder-effect';
import { fetchUserInfo } from '../controllers/auth/userController';
import RenderPropertyItem from '../components/display-properties';
import CategoryButtonGroup from '../components/button-group';
import UploadPost from '../components/upload-post';
import RecommendedProperties from '../components/recommended';
import Communications from 'react-native-communications';

const { width } = Dimensions.get('window');
const placeholderImage = 'https://cdn.vectorstock.com/i/500p/90/02/profile-photo-placeholder-icon-design-vector-43189002.jpg';

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({
    title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '', property_type_id: '', category_id: '', location_id: '',
    status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', images: [],
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [buttons, setButtons] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef();
  const fetchIntervalRef = useRef(null);
  const [category, setCategory] = useState('');
  const [filterForm, setFilterForm] = useState({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [numBeds, setNumBeds] = useState(0);
  const [numBaths, setNumBaths] = useState(0);
  const [uploadImages, setUploadImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-posts`);
        setProperties(response.data);

        const response2 = await axios.get(`${API_BASE_URL}/categories`); // Replace with your API endpoint
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
    // Fetch data again
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-posts`);
        setProperties(response.data);
  
        const response2 = await axios.get(`${API_BASE_URL}/categories`); // Replace with your API endpoint
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

  const uploadPost = useCallback(async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', propertyDetails.title);
      formData.append('description', propertyDetails.description);
      formData.append('price', propertyDetails.price);
      formData.append('location', propertyDetails.location);
      formData.append('long', propertyDetails.long);
      formData.append('lat', propertyDetails.lat);
      formData.append('user_id', userInfo.user.id);
      formData.append('status_id', propertyDetails.status_id);
      formData.append('bedrooms', propertyDetails.bedrooms);
      formData.append('bathrooms', propertyDetails.bathrooms);
      formData.append('area', propertyDetails.area);
      formData.append('amenities', propertyDetails.amenities);
      formData.append('property_type_id', propertyDetails.property_type_id);
      formData.append('location_id', propertyDetails.location_id);
      formData.append('category_id', propertyDetails.category_id);
      formData.append('status_id', 1);

      // Convert image URIs to Blobs and append them to formData
      for (let index = 0; index < uploadImages.length; index++) {
        const image = uploadImages[index];
        const newImageUri = Constants.platform.android
          ? image.uri
          : image.uri.replace('file://', '');
        
        const fileType = mime.getType(newImageUri) || 'image/jpeg';
        formData.append(`images[${index}]`, {
          name: `photo_${index}.jpg`,
          type: fileType,
          uri: newImageUri,
        });
      }

      const response = await fetch(`${API_BASE_URL}/post`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Post created successfully');
        setUploadModalVisible(false);
        setUploadImages([]);
      } else {
        const errorResponse = await response.json();
        Alert.alert('Error', `Failed to create property post: ${errorResponse.message}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to create property post: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }, [propertyDetails, uploadImages, userInfo]);
  
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

  const handleButtonPress = (buttonId) => {
    console.log('Button Id:', buttonId);
    // Implement further logic based on buttonId
  };

  const showImageViewer = async (images, itemId, property) => {
    setImageViewVisible(false);
    setCurrentImages([]);
    setSelectedProperty(null);
    setCurrentImages(images);
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
      alert('Please insert mobile no');
    }
  
    console.log('Opening WhatsApp for number:', phoneNumber);
  };

  const openCommentsModal = async (itemId) => {
    try {
      // Mock implementation of fetching comments
      const response = await axios.get(`${API_BASE_URL}/post-comments/${itemId}`);
      setMessages(response.data);

      terminateFetchInterval();

      fetchIntervalRef.current = setInterval(async () => {
        const newResponse = await axios.get(`${API_BASE_URL}/post-comments/${itemId}`);
        setMessages(newResponse.data);
      }, 4000);

      setCommentsModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const closeCommentsModal = () => {
    setCommentsModalVisible(false);
    terminateFetchInterval();
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      // Mock implementation of sending message
      await axios.post(`${API_BASE_URL}/comment-reply`, {
        post_id: selectedProperty.id,
        user_id: userInfo.id,
        content: newMessage,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    setNewMessage('');
    Keyboard.dismiss();

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const updateSelectedButton = (id) => {
    setSelectedButton(id);
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterForm((prevForm) => ({ ...prevForm, [filterName]: filterValue }));
  };  

  const timeElapsed = (date) => {
    return moment(date).fromNow();
  };

  const renderPropertyItem = ({ item }) => {
    return (
      <RenderPropertyItem 
        item={item} 
        showImageViewer={showImageViewer} 
        openCommentsModal={openCommentsModal}
      />
    );
  };

  const renderMessage = (message) => (
    <View key={message.id} style={styles.messageContainer}>
      <Avatar
        rounded
        source={{ uri: `${SERVER_BASE_URL}/storage/app/${message?.user?.picture}` || placeholderImage }}
        size="small"
        containerStyle={{ marginRight: 10 }}
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageTextTitle}>{message.user?.name}</Text>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageTime}>{timeElapsed(message.created_at)}</Text>
        {/* <TouchableOpacity onPress={() => console.log('Reply to:', message.user.name)}>
          <Text style={styles.replyLink}>Reply</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const renderImageViewerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isImageViewVisible}
        onRequestClose={() => {
          setImageViewVisible(false);
          setSelectedProperty(null);
          terminateFetchInterval();
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setImageViewVisible(false);
              setSelectedProperty(null);
              terminateFetchInterval();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
  
          <ScrollView contentContainerStyle={styles.modalContent}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.topImageContainer}>
              {currentImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <ImageBackground
                    source={{ uri: `${SERVER_BASE_URL}/storage/app/` + image.path }}
                    style={styles.imageBackground}
                  >
                    {selectedProperty && (
                      <View style={styles.overlayDetails}>
                        <Text style={styles.overlayText}>{selectedProperty.title} - K{selectedProperty.price}</Text>
                        <Text style={styles.overlayTextSmall}>{selectedProperty.description}</Text>
                        <View style={styles.overlayIconRow}>
                          <Icon name="bed" type="material" size={18} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{selectedProperty?.beds} Beds</Text>
                          <Icon name="bathtub" type="material" size={18} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{selectedProperty.baths} Baths</Text>
                          <Icon name="square-foot" type="material" size={18} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{selectedProperty.sqft} Sqft</Text>
                        </View>
                      </View>
                    )}
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
  
            <View style={styles.detailsContainer}>
              {selectedProperty && (
                <>
                  <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                  <Text style={styles.propertyPrice}>Price: K{selectedProperty.price}</Text>
                  <Text style={styles.propertyDescription}>{selectedProperty.description}</Text>
                  <View style={styles.propertyDetailsRow}>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="hotel" size={20} color="#ffeded" />
                      <Text style={styles.propertyDetailsText}>{selectedProperty.bedrooms} Beds</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="bathtub" size={20} color="#ffeded" />
                      <Text style={styles.propertyDetailsText}>{selectedProperty.bathrooms} Baths</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="aspect-ratio" size={20} color="#ffeded" />
                      <Text style={styles.propertyDetailsText}>{selectedProperty.area} sqft</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
  
            {/* Features & Amenities */}
            <View style={styles.featureAmenitiesContainer}>
              <Text style={styles.featureAmenitiesTitle}>Features & Amenities</Text>
              {selectedProperty && selectedProperty.features ? (
                selectedProperty.features.map((feature, index) => (
                  <View key={index} style={styles.featureAmenitiesItem}>
                    <MaterialIcons name="check" size={20} color="#000" />
                    <Text style={styles.featureAmenitiesText}>{feature.name}</Text>
                    {feature.link && (
                      <TouchableOpacity onPress={() => openFeatureLink(feature.link)}>
                        <Text style={styles.featureAmenitiesLink}>View More</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text>No features available</Text>
              )}
            </View>
  
            {/* Map Finder */}
          <View style={styles.mapFinderContainer}>
            <Text style={styles.sectionTitle}>Map Finder</Text>
            <ImageBackground
              source={{ uri: 'https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/346/posts/6709/final_image/informativemap_final.jpg' }}
              style={styles.mapImage}
            >
              <Button title="Open Map" style={styles.openMapButton} onPress={() => openMap(selectedProperty.location)} />
            </ImageBackground>
          </View>
          <RecommendedProperties showImageViewer={showImageViewer} recommendedPropertiesData={properties} />
        </ScrollView>

        {/* View Comments Button */}
        <View style={styles.toggleButton}>
          {/* SMS Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => sendSMS(selectedProperty.phone)}>
            <MaterialIcons name="message" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>SMS</Text>
          </TouchableOpacity>

          {/* Call Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => callNumber(selectedProperty.phone)}>
            <MaterialIcons name="call" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>Call</Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity style={styles.whatsappIcon} onPress={() => openWhatsApp(selectedProperty.phone)}>
            <MaterialCommunityIcons name="whatsapp" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>WhatsApp</Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => openCommentsModal(selectedProperty.id)}>
            <MaterialCommunityIcons name="chat" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>Comments</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
    );
  };

  const renderCommentsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCommentsModalVisible}
        onRequestClose={closeCommentsModal}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.closeButton} onPress={closeCommentsModal}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
            {messages.map((message) => renderMessage(message))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Add a comment..."
              multiline
            />
            <TouchableOpacity onPress={sendMessage}>
              <MaterialIcons name="send" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
        <ScrollView style={styles.homeBody} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          
          <CategoryButtonGroup onButtonPress={updateSelectedButton} />

          {/* Add the new section below the ButtonGroup */}
          <View style={styles.featuredSection}>
            <Text style={styles.featuredSectionTitle}>This might help you</Text>
            <FeaturedItems />
          </View>

          {loading ? (
            <View style={styles.loader}>
              {[1, 2, 3].map((item) => (
                <ShimmerPlaceholder key={item} style={styles.placeholder} />
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
      {renderCommentsModal()}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setUploadModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
      
      <UploadPost
        isModalVisible={isUploadModalVisible}
        setModalVisible={setUploadModalVisible}
        propertyDetails={propertyDetails}
        setPropertyDetails={setPropertyDetails}
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
        uploadPost={uploadPost}
        uploading={uploading}
      />
      {isLoading && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;