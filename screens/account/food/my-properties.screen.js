import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Platform, RefreshControl  } from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import { API_BASE_URL, SERVER_BASE_URL } from '../../../confg/config';
import { Card, Button } from '@rneui/themed';
import styles from '../../../assets/css/my-properties.css';
import UploadPost from '../../../components/upload-post';
import mime from "mime";
import CommentsModal from '../../../components/post-comments-modal';
import PostViewerModal from '../../../components/post-details';
import { Menu, Provider } from 'react-native-paper';  // Import Menu from react-native-paper
import { usePropertyActions } from '../../../tools/api/PropertyActions';
import * as FileSystem from 'expo-file-system';
import BidWizardModal from '../../../components/bidwiz-modal'; // Import BidWizardModal
import Toast from 'react-native-toast-message';


const { width, height } = Dimensions.get('window');

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
  const [uploadVideos, setUploadVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuVisible, setMenuVisible] = useState({}); // Use a state to manage menu visibility for each item
  const [isBidModalVisible, setBidModalVisible] = useState(false); // State for BidWizardModal visibility
  const [bidPropertyId, setBidPropertyId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
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
              Toast.show({
                type: 'success',
                text1: 'Posted Deleted',
                text2: 'Property deleted successfully!'
              });
              fetchProperties();  // Reload the properties after successful deletion
            } catch (error) {
              console.error('Failed to delete property:', error);
              Toast.show({
                type: 'error',
                text1: 'Failed Deleting',
                text2: 'Failed to delete property!'
              });
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


const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const uploadPost = useCallback(async () => {
  setUploading(true);
  try {
    // Append property details
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

    // Append images to formData to be compatible with Android
    for (let index = 0; index < uploadImages.length; index++) {
      const image = uploadImages[index];
      const newImageUri = Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '');
      const fileType = mime.getType(newImageUri) || 'image/jpeg';
      formData.append(`images[${index}]`, {
        name: `photo_${index}.jpg`,
        type: fileType,
        uri: newImageUri,
      });
    }

    // Upload Post details first
    const response = await axios.post(`${API_BASE_URL}/post`, formData, {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    });

    // Now handle multiple video uploads
    if (uploadVideos.length > 0) {
      for (let index = 0; index < uploadVideos.length; index++) {
        const video = uploadVideos[index];
        const videoInfo = await FileSystem.getInfoAsync(video.uri);
        const videoSize = videoInfo.size;
        console.log(`Video ${index + 1} size:`, videoSize);

        if (videoSize > MAX_VIDEO_SIZE) {
          Alert.alert('Error', `Video ${index + 1} file size exceeds 25MB limit.`);
          throw new Error(`Video ${index + 1} file size exceeds 25MB limit.`);
        }

        const formData2 = new FormData();
        formData2.append('post_id', response.data.property.id);

        const videoUri = Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '');
        const fileType = mime.getType(videoUri) || 'video/mp4';
        formData2.append('video', {
          name: `video_${index}.mp4`,
          type: fileType,
          uri: videoUri,
        });

        await axios.post(`${API_BASE_URL}/upload-video`, formData2, {
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    }
    Toast.show({
      type: 'success',
      text1: 'Posted',
      text2: 'Post uploaded successfully!'
    });
    setModalVisible(false);
    setUploadImages([]);
    setUploadVideos([]);  // Clear uploaded videos as well

  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Post Failed',
      text2: `Failed to create property post: ${error.message}`
    });
  } finally {
    setUploading(false);
  }
}, [propertyDetails, uploadImages, uploadVideos, userInfo]);

  
  const { hideFromPosts, bidForTopPosts, editProperty } = usePropertyActions(fetchProperties);

  const openSetBidModal = useCallback((itemId) => {
    setBidPropertyId(itemId);
    setBidModalVisible(true);
  }, []);
  
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
            onPress={() => openSetBidModal(item.id)}
            title={item.on_bid ? 'Cancel Boost' : 'Boost Post'}
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
      {/* <Text>{item.description}</Text> */}
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
      <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3D6DCC']}  />
        }>
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
        uploadVideos={uploadVideos}
        setUploadImages={setUploadImages}
        setUploadVideos={setUploadVideos}
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
      <BidWizardModal 
        visible={isBidModalVisible} 
        onDismiss={() => setBidModalVisible(false)} 
        property={bidPropertyId}  // Pass the propertyId here
      />
    </SafeAreaView>
  </Provider>
);
};

export default MyPropertyScreen;
