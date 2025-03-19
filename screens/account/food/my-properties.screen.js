import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Platform, RefreshControl  } from 'react-native';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import { API_BASE_URL, SERVER_BASE_URL } from '../../../confg/config';
import { Card, Button } from '@rneui/themed';
import { Menu, Provider } from 'react-native-paper'; 
import { usePropertyActions } from '../../../tools/api/PropertyActions';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import styles from '../../../assets/css/my-properties.css';
import UploadPost from '../../../components/upload-post';
import mime from "mime";
import CommentsModal from '../../../components/post-comments-modal';
import PostViewerModal from '../../../components/post-details';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BidWizardModal from '../../../components/bidwiz-modal'; 
import Toast from 'react-native-toast-message';
import MenuContainer from '../../../components/menu-action-list';
import EditProfileModal from '../../../components/update-profile-modal';
import TimedAdPopup from '../../../components/ad-timed-modal';
import StatusFlag from '../../../components/status-flag';
import LoadingOverlay from '../../../components/preloader';
import BlankView from '../../../components/blank-bottom';
import InlineAd from '../../../components/InlineBannerAd';

const { width, height } = Dimensions.get('window');
const MyPropertyScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPostViewerModalVisible, setPostViewerModalVisible] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '',
    property_type_id: '', category_id: '', location_id: '',
    status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', phone:'',
    images: [], utility_file: [], support_file: [], 
  });
  const [uploadImages, setUploadImages] = useState([]);
  const [uploadVideos, setUploadVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuVisible, setMenuVisible] = useState({}); 
  const [isBidModalVisible, setBidModalVisible] = useState(false); 
  const [bidPropertyId, setBidPropertyId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const isMountedRef = useRef(true);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const user = await fetchUserInfo();
      const response = await axios.get(`${API_BASE_URL}/my-property-posts/${user.id}`);
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

  useEffect(() => {
    // Log userInfo after it’s been set
    if (userInfo !== null) {
      console.log('Updated userInfo:', userInfo);
    }
  }, [userInfo]);

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

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    {/*setIsEditModalVisible(true);*/}
  };

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
              fetchProperties(); 
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

const MAX_VIDEO_SIZE = 25 * 1024 * 1024; 
const uploadPost = useCallback(async () => {
  // setProcessing(true);
  console.log('Uploading post........');
  console.log(propertyDetails);
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('title', propertyDetails.title);
    formData.append('description', propertyDetails.description);
    formData.append('price', propertyDetails.price);
    formData.append('location', propertyDetails.location);
    formData.append('phone', propertyDetails.phone);
    formData.append('long', propertyDetails.long);
    formData.append('lat', propertyDetails.lat);
    formData.append('user_id', userInfo.id);
    formData.append('status_id', propertyDetails.status_id);
    formData.append('bedrooms', propertyDetails.bedrooms);
    formData.append('bathrooms', propertyDetails.bathrooms);
    formData.append('area', propertyDetails.area);
    formData.append('amenities', propertyDetails.amenities);
    formData.append('property_type_id', propertyDetails.property_type_id);
    formData.append('location_id', propertyDetails.location_id);
    formData.append('category_id', propertyDetails.category_id);
    formData.append('status_id', 1);

    // Append images
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

    const response = await axios.post(`${API_BASE_URL}/post`, formData, {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Post uploaded successfully:', response.data);

    // Video upload logic remains unchanged
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
    setUploadVideos([]);
    onRefresh();
  } catch (error) {
    console.log(error.message);
    Toast.show({
      type: 'error',
      text1: 'Post Failed',
      text2: `Failed to create property post: ${error.message}`
    });
  } finally {
    setUploading(false);
    setProcessing(false);
    setModalVisible(false);
    setUploadImages([]);
    setUploadVideos([]);
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
    <View style={styles.propertyContainer}>
    <View style={styles.headerContainer}>
      <Text style={styles.propertyTitle}>{item.title}</Text>
      <View style={styles.menuContainer}>
        <MenuContainer 
          itemId={item.id} 
          hideFromPosts={() => {}}
          openSetBidModal={openSetBidModal} 
          editProperty={() => {}}
          handleDeleteProperty={handleDeleteProperty}
          item={item}
        />
      </View>
    </View>

    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.imageScrollView}
    >
      <StatusFlag status={item?.verified_status} />
      {item.images.length > 0 ? (
        item.images.map((img, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => showImageViewer(item.images, item.id, item)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: `${SERVER_BASE_URL}/storage/app/` + img.path }} 
              style={styles.propertyImage} 
            />
            {index === 0 && item.images.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>{item.images.length} Photos</Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <Image
          source={{ uri: 'https://bearhomes.com/wp-content/uploads/2019/01/default-featured.png' }}
          style={styles.propertyImage}
        />
      )}
    </ScrollView>

    <View style={styles.detailsContainer}>
      <View style={styles.priceLocationRow}>
        <Text style={styles.priceText}>K{item.price}</Text>
        <TouchableOpacity style={styles.locationContainer}>
          <MaterialIcons name="place" size={20} color="#7B8794" />
          <Text style={styles.locationText}>{item.location}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconRow}>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="hotel" size={20} color="#7B8794" />
          <Text style={styles.iconText}>{item.bedrooms} Beds</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="bathtub" size={20} color="#7B8794" />
          <Text style={styles.iconText}>{item.bathrooms} Baths</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="aspect-ratio" size={20} color="#7B8794" />
          <Text style={styles.iconText}>{item.area} Sqm</Text>
        </View>
      </View>
    </View>

    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity 
        style={styles.boostButton}
        onPress={() => openSetBidModal(item.id)}
      >
        <MaterialIcons name="trending-up" size={20} color="white" />
        <Text style={styles.boostButtonText}>Boost Post</Text>
      </TouchableOpacity>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity style={styles.commentButton} onPress={() => openCommentsModal(item.id)}>
          <MaterialIcons name="comment" size={24} color="#4C6EF5" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProperty(item.id)}>
          {deleting ? 
            <ActivityIndicator size="small" color="#FF4757" /> : 
            <MaterialIcons name="delete" size={24} color="#FF4757" />
          }
        </TouchableOpacity>
      </View>
    </View>
  </View>
  );
}, [deleting, showImageViewer, handleDeleteProperty, openCommentsModal, menuVisible]);



  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image source={require('../../../assets/gifs/empty.gif')} style={styles.emptyStateImage} />
      <Text style={styles.emptyStateText}>No properties available. Start by adding your first property!</Text>
    </View>
  );

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3D6DCC']}  />
          }>
          {/* {userInfo?.isSub === 0 && <TimedAdModal />} */}
          {properties.length === 0 ? (
              renderEmptyState() // Render empty state if no properties
            ) : (
              properties.map((property, index) => (
                <View key={index}>
                  {/* Render individual property item */}
                  {renderPropertyItem({ item: property })}
                </View>
              ))
            )}
        </ScrollView>

        {/* Smaller floating button for refreshing */}
        <TouchableOpacity
          onPress={onRefresh}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 80,
            backgroundColor: '#7c209c',
            padding: 10,
            borderRadius: 50,
            elevation: 5,
          }}
        >
          <MaterialIcons name="refresh" size={24} color="#FFF" />
        </TouchableOpacity>
        
        {/* Floating button to open UploadPost modal */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
        <InlineAd/>
        
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
        {/* {selectedProperty && (
          <EditProfileModal
            isVisible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            property={selectedProperty}
            onUpdate={handleUpdateProperty}
          />
        )} */}
        <PostViewerModal
          visible={isPostViewerModalVisible}
          images={currentImages}
          property={selectedProperty}
          allProperties={properties}
          openCommentsModal={openCommentsModal}
          onClose={() => setPostViewerModalVisible(false)}
          fetchProperties={fetchProperties}
        />
        <CommentsModal
          visible={isCommentsModalVisible}
          postId={selectedItemId}
          onClose={closeCommentsModal}
        />
        <BidWizardModal 
          visible={isBidModalVisible} 
          onDismiss={() => setBidModalVisible(false)} 
          property={bidPropertyId}  
        />
        {/* {userInfo?.isSub === 0 && <TimedAdPopup/>} */}
        {userInfo?.isSub === 0 && <TimedAdPopup/>}
        <LoadingOverlay visible={processing} message="Processing..." />
      </SafeAreaView>
    </Provider>
  );
};

export default MyPropertyScreen;