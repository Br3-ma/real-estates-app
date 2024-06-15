import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Dimensions } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup, Avatar } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import moment from 'moment';
import axios from 'axios';
import styles from '../assets/css/home.css';
import { API_BASE_URL } from '../confg/config';
import { SERVER_BASE_URL } from '../confg/config';

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
  {
    id: 2,
    title: 'Luxury Apartment Downtown',
    price: 180000,
    description: 'Modern apartment with stunning city views and amenities.',
    image: 'https://example.com/recommended-apartment-1.jpg',
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
  const [currentImages, setCurrentImages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const scrollViewRef = useRef();
  const fetchIntervalRef = useRef(null);

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
      // Mock implementation of fetching user info
      const user = { id: 1, name: 'John Doe', picture: 'https://example.com/user.jpg' };
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

  const updateSearch = (search) => {
    setSearch(search);
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

  const renderPropertyItem = ({ item }) => (
    <Card containerStyle={styles.fullWidthCard}>
      <Card.Title>{item.title}</Card.Title>
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
            <MaterialIcons name="hotel" size={20} color="#000" />
            <Text style={styles.iconText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#000" />
            <Text style={styles.iconText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="aspect-ratio" size={20} color="#000" />
            <Text style={styles.iconText}>{item.area} sqft</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <Button type="clear" icon={<MaterialIcons name="favorite-border" size={24} color="black" />} />
        <Button type="clear" icon={<MaterialIcons name="comment" size={24} color="black" />} onPress={() => openCommentsModal(item.id)} />
        <Button type="clear" icon={<MaterialIcons name="share" size={24} color="black" />} />
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
                          <Icon name="bed" type="material" size={15} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{selectedProperty?.beds} Beds</Text>
                          <Icon name="bathtub" type="material" size={15} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{selectedProperty.baths} Baths</Text>
                          <Icon name="square-foot" type="material" size={15} color="#fff" />
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
                      <MaterialIcons name="hotel" size={20} color="#000" />
                      <Text style={styles.propertyDetailsText}>{selectedProperty.bedrooms} Beds</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="bathtub" size={20} color="#000" />
                      <Text style={styles.propertyDetailsText}>{selectedProperty.bathrooms} Baths</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="aspect-ratio" size={20} color="#000" />
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
          <TouchableOpacity style={styles.button} onPress={() => sendSMS(selectedProperty.phone)}>
            <MaterialIcons name="message" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>SMS</Text>
          </TouchableOpacity>

          {/* Call Button */}
          <TouchableOpacity style={styles.button} onPress={() => callNumber(selectedProperty.phone)}>
            <MaterialIcons name="call" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>Call</Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity style={styles.whatsappIcon} onPress={() => openWhatsApp(selectedProperty.phone)}>
            <MaterialCommunityIcons name="whatsapp" size={24} color="#165F56" />
            <Text style={styles.buttonLabel}>WhatsApp</Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity style={styles.button} onPress={() => openCommentsModal(selectedProperty.id)}>
            <MaterialCommunityIcons name="chat" size={24} color="#165F56" />
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
      <StatusBar barStyle="dark-content" />
      <SearchBar
        placeholder="Search properties..."
        onChangeText={updateSearch}
        value={search}
        platform={Platform.OS}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <ButtonGroup
        buttons={buttons}
        selectedIndex={selectedIndex}
        onPress={updateIndex}
        containerStyle={styles.buttonGroupContainer}
        selectedButtonStyle={styles.selectedButton}
      />
      <ScrollView>
        {loading ? (
          <View style={styles.loader}>
            {[1, 2, 3].map((item) => (
              <ShimmerPlaceholder key={item} style={styles.placeholder} />
            ))}
          </View>
        ) : (
          <View>
            {properties.map((property) => (
              <View key={property.id}>{renderPropertyItem({ item: property })}</View>
            ))}
          </View>
        )}
      </ScrollView>
      {renderImageViewerModal()}
      {renderCommentsModal()}
    </SafeAreaView>
  );
};

export default HomeScreen;

