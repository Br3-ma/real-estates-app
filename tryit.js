// src/screens/MyPropertyScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import { API_BASE_URL, SERVER_BASE_URL } from '../../../config/config';
import { Card, Button } from '@rneui/themed';
import styles from '../../../assets/css/my-properties.css';
import UploadPost from '../../../components/upload-post';
import mime from "mime";
import Constants from 'expo-constants';
import CommentsModal from '../../../components/post-comments-modal';
import PostViewerModal from '../../../components/post-details';
import { Menu, Provider } from 'react-native-paper';
import { usePropertyActions } from '../../../components/propertyActions';  // Import property actions

const { width } = Dimensions.get('window');

const MyPropertyScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPostViewerModalVisible, setPostViewerModalVisible] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '', property_type_id: '', category_id: '', location_id: '',
    status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', images: [],
  });
  const [uploadImages, setUploadImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const user = await fetchUserInfo();
      const response = await axios.get(`${API_BASE_URL}/my-property-posts/${user.user.id}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserInfo();
        setUserInfo(user);
        await fetchProperties();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [fetchProperties]);

  const showImageViewer = useCallback((images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setPostViewerModalVisible(true);
  }, []);

  const openCommentsModal = useCallback((itemId) => {
    setSelectedItemId(itemId);
    setCommentsModalVisible(true);
  }, []);
  
  const closeCommentsModal = useCallback(() => {
    setCommentsModalVisible(false);
  }, []);

  const handleDeleteProperty = useCallback((propertyId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this property?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            setDeleting(true);
            try {
              await axios.delete(`${API_BASE_URL}/delete-post/${propertyId}`);
              Alert.alert("Property deleted successfully");
              fetchProperties();
            } catch (error) {
              console.error('Failed to delete property:', error);
              Alert.alert("Failed to delete property");
            } finally {
              setDeleting(false);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  }, [fetchProperties]);

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
        setModalVisible(false);
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

  const { hideFromPosts, bidForTopPosts, editProperty } = usePropertyActions(fetchProperties);

  const renderPropertyItem = useCallback(({ item }) => {
    const openMenu = (id) => setMenuVisible(prevState => ({ ...prevState, [id]: true }));
    const closeMenu = (id) => setMenuVisible(prevState => ({ ...prevState, [id]: false }));
  
    return (
      <Card>
        <Card.Title>{item.name}</Card.Title>
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible[item.id] || false}
            onDismiss={() => closeMenu(item.id)}
            anchor={
              <TouchableOpacity style={styles.kabutton} onPress={() => openMenu(item.id)}>
                <MaterialIcons name="more-vert" size={24} color="black" />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => hideFromPosts(item.id)} title="Hide" />
              <Menu.Item onPress={() => bidForTopPosts(item.id)} title="Bid for Top Posts" />
              <Menu.Item onPress={() => editProperty(item.id)} title="Edit" />
              <Menu.Item onPress={() => handleDeleteProperty(item.id)} title="Delete" />
            </Menu>
          </View>
          <Card.Image 
            style={{ padding: 0 }}
            source={{ uri: `${SERVER_BASE_URL}/images/${item.image}` }}
          />
          <Card.Divider/>
          <Text style={{ marginBottom: 10 }}>
            {item.description}
          </Text>
          <Button
            icon={<MaterialIcons name='comment' color='#ffffff' />}
            backgroundColor='#03A9F4'
            onPress={() => openCommentsModal(item.id)}
            title='Comments'
          />
        </Card>
      );
    }, [menuVisible, hideFromPosts, bidForTopPosts, editProperty, handleDeleteProperty, openCommentsModal]);
  
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  
    return (
      <Provider>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.title}>My Properties</Text>
              <Button
                title="Add New Property"
                onPress={() => setModalVisible(true)}
              />
              {properties.map(property => (
                <View key={property.id} style={styles.propertyContainer}>
                  {renderPropertyItem({ item: property })}
                </View>
              ))}
            </View>
          </ScrollView>
          <UploadPost
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            propertyDetails={propertyDetails}
     
  