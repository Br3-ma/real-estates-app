import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Easing, Text, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import { Card, Button, Icon, SearchBar, ButtonGroup, Avatar } from 'react-native-elements';
import { BlurView } from 'expo-blur';
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
import SearchModal from '../components/SearchModal'; // Import the SearchModal component

const { width } = Dimensions.get('window');

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

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: search, category }),
      });
      const data = await response.json();
      navigation.navigate('SearchResultScreen', { results: data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const buttons = ['Buy', 'Rent', 'Projects'];
  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SearchBar
        placeholder="Search properties..."
        onFocus={openModal}
        value={search}
        platform={Platform.OS}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
      />
      <LinearGradient colors={['#c4c4dd', '#9d69ff', '#fbfbfb']} style={styles.gradient}>
        <ScrollView style={styles.homeBody}>
          <ButtonGroup
            buttons={buttons}
            selectedIndex={selectedIndex}
            onPress={updateIndex}
            containerStyle={styles.buttonGroupContainer}
            selectedButtonStyle={styles.selectedButton}
          />

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
      </
