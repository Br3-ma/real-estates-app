import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import { API_BASE_URL, SERVER_BASE_URL } from '../../../confg/config';
import { Card, Button } from '@rneui/themed';
import styles from '../../../assets/css/my-properties.css';
import UploadPost from '../../../components/upload-post';
import mime from "mime";
import Constants from 'expo-constants';
import CommentsModal from '../../../components/post-comments-modal';
import PostViewerModal from '../../../components/post-details';
import { Menu, Provider } from 'react-native-paper';  // Import Menu from react-native-paper
import { usePropertyActions } from '../../../tools/api/PropertyActions';

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
    title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '', property_type_id: '', category_id: '', location_id: '', status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', images: [],
  });
  const [uploadImages, setUploadImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuVisible, setMenuVisible] = useState({}); // Use a state to manage menu visibility for each item

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

  const showImageViewer = useCallback(async (images, itemId, property) => {
    setCurrentImages(images);
    setSelectedProperty(property);
    setPostViewerModalVisible(true);
  },[]);

  const openCommentsModal = useCallback(async (itemId) => {
    try {
      setSelectedItemId(itemId);
      setCommentsModalVisible(true);
    } catch (error) {
      console.error('Failed to open comments modal:', error);
    }
  }, []);
  
  const closeCommentsModal = useCallback(() => {
    setCommentsModalVisible(false);
  }, []);

  const handleDeleteProperty = useCallback(async (propertyId) => {
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
              fetchProperties();  // Reload the properties after successful deletion
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
      // Append property details
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
            <Menu.Item
              onPress={() => hideFromPosts(item.id)}
              title={item.status_id === 1 ? 'Hide' : 'Show'}
              leadingIcon={item.status_id === 1 ? 'eye-off-outline' : 'eye-on-outline'}
            />
            <Menu.Item
              onPress={() => bidForTopPosts(item.id)}
              title={item.on_bid ? 'Remove from Bids' : 'Bid for Top Posts'}
              leadingIcon={item.on_bid ? 'check-circle-outline' : 'rocket-outline'}
            />
            <Menu.Item
              onPress={() => editProperty(item.id)}
              title="Edit"
              leadingIcon="pencil-outline"
            />
            <Menu.Item
              onPress={() => handleDeleteProperty(item.id)}
              title="Delete"
              leadingIcon="delete-outline"
            />
          </Menu>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.images.length > 0 ? (
            item.images.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => showImageViewer(item.images, item.id, item)}>
                <Image source={{ uri: `${SERVER_BASE_URL}/storage/app/` + img.path }} style={styles.cardImage} />
              </TouchableOpacity>
            ))
          ) : (
            <Image
              source={{ uri: 'https://bearhomes.com/wp-content/uploads/2019/01/default-featured.png' }}
              style={styles.illustrativeImage}
            />
          )}
        </ScrollView>
        <View>
          <View style={styles.priceLocationRow}>
            <Text style={styles.priceText}>K{item.price}</Text>
            <TouchableOpacity>
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
              <Text style={styles.iconText}>{item.area} Sqm</Text>
            </View>
          </View>
        </View>
        <Text>{item.description}</Text>
        <View style={styles.buttonRow}>
          <Button type="clear" icon={() => <MaterialIcons name="comment" size={24} color="blue" />} onPress={() => openCommentsModal(item.id)} />
          <Button
            type="clear"
            icon={() => deleting ? <ActivityIndicator size="small" color="red" /> : <MaterialIcons name="delete" size={24} color="red" />}
            onPress={() => handleDeleteProperty(item.id)}
          />
        </View>
      </Card>
    );
  }, [deleting, showImageViewer, handleDeleteProperty, openCommentsModal, menuVisible]);
  


  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          {properties.map((property, index) => (
            <View key={index}>
              {renderPropertyItem({ item: property })}
            </View>
          ))}
        </ScrollView>
        {/* Floating button to open UploadPost modal */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
        <UploadPost
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
          propertyDetails={propertyDetails}
          setPropertyDetails={setPropertyDetails}
          uploadImages={uploadImages}
          setUploadImages={setUploadImages}
          uploadPost={uploadPost}
          uploading={uploading}
        />
        <PostViewerModal
          visible={isPostViewerModalVisible}
          images={currentImages}
          property={selectedProperty}
          openCommentsModal={openCommentsModal}
          onClose={() => setPostViewerModalVisible(false)}
        />
        <CommentsModal
          visible={isCommentsModalVisible}
          postId={selectedItemId}
          onClose={closeCommentsModal}
        />
      </SafeAreaView>
    </Provider>
  );
};

export default MyPropertyScreen;
