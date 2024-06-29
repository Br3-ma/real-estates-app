import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import axios from 'axios';
import { API_BASE_URL } from '../../../confg/config';
import { Card, Button } from '@rneui/themed';
import styles from '../../../assets/css/my-properties.css';
import UploadPost from '../../../components/upload-post';

const { width } = Dimensions.get('window');

const MyPropertyScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '', property_type_id: '', category_id: '', location_id : '',
    status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', images: [],
  });
  const [uploadImages, setUploadImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
  };

  const handleDeleteProperty = async (propertyId) => {
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
              setProperties([]);  // Reset
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
  };

  const renderPropertyItem = ({ item }) => (
    <Card>
      <Card.Title>{item.name}</Card.Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images.length > 0 ? (
          item.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => showImageViewer(item.images)}>
              <Image source={{ uri: img.url }} style={styles.cardImage} />
            </TouchableOpacity>
          ))
        ) : (
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/021/433/526/non_2x/empty-box-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-vector.jpg' }}
            style={styles.illustrativeImage}
          />
        )}
      </ScrollView>
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
        <Button type="clear" icon={() => <MaterialIcons name="favorite-border" size={24} color="black" />} />
        <Button type="clear" icon={() => <MaterialIcons name="comment" size={24} color="black" />} onPress={openCommentsModal} />
        <Button type="clear" icon={() => <MaterialIcons name="share" size={24} color="black" />} />
        <Button
          type="clear"
          icon={() => deleting ? <ActivityIndicator size="small" color="red" /> : <MaterialIcons name="delete" size={24} color="red" />}
          onPress={() => handleDeleteProperty(item.id)}
        />
      </View>
    </Card>
  );

  const uploadPost = async () => {
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
        console.log(image);
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const file = new File([blob], image.fileName || `photo_${index}.jpg`, {
          type: image.mimeType || 'image/jpeg',
          lastModified: Date.now(),
        });
        formData.append(`images[${index}]`, file);
      }

      console.error('Form Data:', formData);
      const response = await fetch(`${API_BASE_URL}/post`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: formData,
      });

      if (response.status === 201) {
        console.log('Post created successfully');
        setModalVisible(false);
        setUploadImages([]);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to create property post:', errorResponse);
      }
    } catch (error) {
      console.error('Failed to create property post:', error);
    } finally {
      setUploading(false);
    }
  };

  const openCommentsModal = () => {
    setCommentsModalVisible(true);
  };

  const closeCommentsModal = () => {
    setCommentsModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        title="Create New Post"
        onPress={() => setModalVisible(true)}
        style={styles.createPostButton}
      />
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
    </SafeAreaView>
  );
};

export default MyPropertyScreen;
