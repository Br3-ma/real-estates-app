import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Easing,
  ActivityIndicator,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal,
  Platform,
  StatusBar,
  Keyboard,
  TextInput,
  ImageBackground,
  Dimensions
} from 'react-native';
import {
  Card,
  Button,
  Icon,
  SearchBar,
  ButtonGroup,
  Avatar
} from 'react-native-elements';
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
          <Text style={styles.locationText}><MaterialIcons name="location-on" size={20} />{item.location}</Text>
        </View>
        <View style={styles.bedBathRow}>
          <Text style={styles.bedText}><MaterialIcons name="hotel" size={20} />{item.beds} Beds</Text>
          <Text style={styles.bathText}><MaterialIcons name="bathtub" size={20} />{item.baths} Baths</Text>
        </View>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Call"
          buttonStyle={styles.callButton}
          onPress={() => callNumber(item.phone)}
          icon={<MaterialIcons name="phone" size={24} color="white" />}
        />
        <Button
          title="SMS"
          buttonStyle={styles.smsButton}
          onPress={() => sendSMS(item.phone)}
          icon={<MaterialIcons name="message" size={24} color="white" />}
        />
        <Button
          title="WhatsApp"
          buttonStyle={styles.whatsappButton}
          onPress={() => openWhatsApp(item.phone)}
          icon={<MaterialCommunityIcons name="whatsapp" size={24} color="white" />}
        />
        <Button
          title="Comments"
          buttonStyle={styles.commentButton}
          onPress={() => openCommentsModal(item.id)}
          icon={<MaterialIcons name="comment" size={24} color="white" />}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.carouselContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ButtonGroup
              onPress={updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={styles.buttonGroup}
            />
          </ScrollView>
        </View>
        <FeaturedItems
          data={recommendedPropertiesData}
          onItemPress={(property) => navigation.navigate('PropertyDetailScreen', { property })}
        />
        <SearchBar
          placeholder="Search..."
          onChangeText={setSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchBarContainer}
        />
        <Button
          title="Filter"
          onPress={openModal}
          buttonStyle={styles.filterButton}
        />
        <SearchModal
          isVisible={isModalVisible}
          onClose={closeModal}
          onApplyFilter={handleSearch}
          filterForm={filterForm}
          setFilterForm={setFilterForm}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          numBeds={numBeds}
          setNumBeds={setNumBeds}
          numBaths={numBaths}
          setNumBaths={setNumBaths}
          handleFilterChange={handleFilterChange}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          properties.map((property) => (
            <TouchableOpacity key={property.id} onPress={() => navigation.navigate('PropertyDetailScreen', { property })}>
              {renderPropertyItem({ item: property })}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <ReactNativeModal isVisible={isCommentsModalVisible} onBackdropPress={closeCommentsModal}>
        <View style={styles.commentsModal}>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg, index) => (
              <View key={index} style={styles.messageContainer}>
                <Text style={styles.messageText}>{msg.content}</Text>
                <Text style={styles.messageTime}>{moment(msg.created_at).fromNow()}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message"
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={sendMessage}>
              <MaterialIcons name="send" size={28} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const TextElement = ({ text = "Default Text" }) => (
  <Text>{text}</Text>
);
