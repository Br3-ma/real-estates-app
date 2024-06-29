import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Easing, ActivityIndicator, Text, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Dimensions } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup, Avatar } from 'react-native-elements';
import { BlurView } from 'expo-blur';
import { Picker } from '@react-native-picker/picker';
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
import ReactNativeModal from 'react-native-modal';
import SearchModal from '../components/search-filter';
import MovingPlaceholder from '../components/placeholder-effect';
import { fetchUserInfo } from '../controllers/auth/userController';

const { width } = Dimensions.get('window');

// Mock data for Recommended Properties
const recommendedPropertiesData = [
  {
    id: 1,
    title: 'Beautiful House in Suburbia',
    price: 250000,
    description: 'A lovely house with a big garden and beautiful surroundings.',
    image: 'https://example.com/recommended-house-1.jpg',
  },
  // Add more items as needed
];

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property-posts`);
        setProperties(response.data);
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

  const buttons = ['Buy', 'Rent', 'Projects'];
  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const showImageViewer = async (images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setImageViewVisible(true);
  };

  const sendSMS = (phoneNumber) => {
    // Implement SMS sending functionality
    console.log('Sending SMS to:', phoneNumber);
  };

  const callNumber = (phoneNumber) => {
    // Implement phone call functionality
    console.log('Calling number:', phoneNumber);
  };

  const openWhatsApp = (phoneNumber) => {
    // Implement WhatsApp opening functionality
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

  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  const handleFilterChange = (filterName, filterValue) => {
    setFilterForm((prevForm) => ({ ...prevForm, [filterName]: filterValue }));
  };

  const renderPropertyItem = ({ item }) => (
    <Card containerStyle={styles.fullWidthCard}>
      <Card.Title style={styles.postTitle}>{item.title}</Card.Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => showImageViewer(item.images, item.id, item)}>
            <Image
              source={{ uri: `${SERVER_BASE_URL}/storage/app/` + img.path }}
              style={getImageStyle(item.images.length)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.overlayStyle}>
        <Text style={styles.ribbonTag}>{  `posted `+moment(item.created_at).fromNow() }</Text>
      </View>
      <View>
        <View style={styles.priceLocationRow}>
          <Text style={styles.priceText}>K{item.price}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MapScreen', { location: item.location })}>
            <Text>
              <MaterialIcons name="place" size={20} color="#000" />
              {item.location}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="hotel" size={20} color="#165F56" />
            <Text style={styles.iconText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#165F56" />
            <Text style={styles.iconText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="aspect-ratio" size={20} color="#165F56" />
            <Text style={styles.iconText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button type="clear" style={styles.buttonCover} icon={<MaterialIcons name="favorite-border" size={24} color="gray" />} />
        <Button type="clear" style={styles.buttonCover} icon={<MaterialIcons name="comment" size={24} color="gray" />} onPress={() => openCommentsModal(item.id)} />
        <Button type="clear" style={styles.buttonCover} icon={<MaterialIcons name="share" size={24} color="gray" />} />
      </View>
    </Card>
  );

  const timeElapsed = (date) => {
    return moment(date).fromNow();
  };

  const renderMessage = (message) => (
    <View key={message.id} style={styles.messageContainer}>
      <Avatar
        rounded
        source={{ uri: message?.user?.picture }}
        size="small"
        containerStyle={{ marginRight: 10 }}
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageTextTitle}>{message.user?.name}</Text>
        <Text style={styles.messageText}>{message.content}</Text>
        <Text style={styles.messageTime}>{timeElapsed(message.created_at)}</Text>
        <TouchableOpacity onPress={() => console.log('Reply to:', message.user.name)}>
          <Text style={styles.replyLink}>Reply</Text>
        </TouchableOpacity>
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
              source={{ uri: 'https://www.dubizzle.com.eg/assets/mapPlaceholder_noinline.af3a4b7300a65b66f974eed7023840ac.svg' }}
              style={styles.mapImage}
            >
              <Button title="Open Map" style={styles.openMapButton} onPress={() => openMap(selectedProperty.location)} />
            </ImageBackground>
          </View>

          {/* Recommended Properties */}
          <View style={styles.recommendedPropertiesContainer}>
            <Text style={styles.sectionTitle}>Recommended Properties</Text>
            {recommendedPropertiesData && recommendedPropertiesData.length > 0 ? (
              recommendedPropertiesData.map((property, index) => (
                <View key={index} style={styles.recommendedPropertyItem}>
                  <ImageBackground
                    source={{ uri: `${SERVER_BASE_URL}/storage/app/` + property.image }}
                    style={styles.recommendedPropertyImage}
                  >
                    <Text style={styles.recommendedPropertyTitle}>{property.title}</Text>
                  </ImageBackground>
                  <Text style={styles.recommendedPropertyPrice}>K{property.price}</Text>
                  <Text style={styles.recommendedPropertyDescription}>{property.description}</Text>
                </View>
              ))
            ) : (
              <Text>No recommended properties available</Text>
            )}
          </View>
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
        colors={['#fff', '#7D7399', '#173955']}
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
        searchIcon={<Icon name="search" color="#438ab5" />}
        renderPlaceholder={(focused) => <MovingPlaceholder text="Search properties..." />}
      />
        <ScrollView style={styles.homeBody}>
          <ButtonGroup
            buttons={buttons}
            selectedIndex={selectedIndex}
            onPress={updateIndex}
            containerStyle={styles.buttonGroupContainer}
            selectedButtonStyle={styles.selectedButton}
          />

          {/* Add the new section below the ButtonGroup */}
          <View style={styles.featuredSection}>
            <Text style={styles.featuredSectionTitle}>Featured Items</Text>
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
      {isLoading && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;