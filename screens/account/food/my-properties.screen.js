import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal, Button as RNButton, ActivityIndicator, Alert, ImageBackground} from 'react-native';
import { BlurView } from 'expo-blur';
import { Card, Button, Icon } from '@rneui/themed';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import axios from 'axios';
import { API_BASE_URL } from '../../../confg/config';
import { SERVER_BASE_URL } from '../../../confg/config';
import styles from '../../../assets/css/my-properties.css';

const { width } = Dimensions.get('window');

const MyPropertyScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '', property_type_id: '',
    status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', images: [],
  });
  const [uploadImages, setUploadImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deleting, setDeleting] = useState(false); 

  const [isCommentsModalVisible, setCommentsModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef(null);

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
    const fetchUser = async () => {
      const user = await fetchUserInfo();
      setUserInfo(user);
    };

    fetchUser();
    fetchProperties();
  }, [fetchProperties]);

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
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

  const renderImageViewerModal = () => {
    if (!isImageViewVisible || selectedIndex === null || !properties[selectedIndex]) {
      return null;
    }

    const property = properties[selectedIndex];

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

  const renderUploadModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={90} style={StyleSheet.absoluteFill}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Post</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
  
              <ScrollView contentContainerStyle={styles.modalScrollView}>
                <TextInput
                  placeholder="Title"
                  style={styles.input}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, title: text })}
                />
                <TextInput
                  multiline
                  numberOfLines={5}
                  placeholder="Property description"
                  style={styles.textarea}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, description: text })}
                />
                <TextInput
                  placeholder="Address"
                  style={styles.input}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, location: text })}
                />
                <TextInput
                  placeholder="Price"
                  style={styles.input}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, price: text })}
                />
                <View style={styles.inputRow}>
                  <TextInput
                    placeholder="Beds"
                    style={[styles.input, styles.inputRowItem]}
                    onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bedrooms: text })}
                  />
                  <TextInput
                    placeholder="Baths"
                    style={[styles.input, styles.inputRowItem]}
                    onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bathrooms: text })}
                  />
                  <TextInput
                    placeholder="Square Foot"
                    style={[styles.input, styles.inputRowItem]}
                    onChangeText={(text) => setPropertyDetails({ ...propertyDetails, area: text })}
                  />
                </View>
                <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
                  <AntDesign
                    name="camera"
                    style={{ width: 30, height: 25 }}
                  />
                  <Text style={styles.uploadButtonText}>
                    {uploadingImages ? 'Opening...' : 'Upload Images'} {/* Step 2: Display loading text */}
                  </Text>
                </TouchableOpacity>
                <View style={styles.uploadedImageContainer}>
                  {uploadImages.map((image, index) => (
                    <Image key={index} source={{ uri: image.uri }} style={styles.uploadedImage} />
                  ))}
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <RNButton title="Create Post" onPress={uploadPost} disabled={uploading} />
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    );
  };
  
  const pickImages = async () => {
    try {
      setUploadingImages(true); // Step 1: Set loading state when button is clicked
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        // Ensure result.assets is an array before setting it in state
        if (Array.isArray(result.assets)) {
          setUploadImages(prevImages => [...prevImages, ...result.assets]);
        } else {
          setUploadImages(prevImages => [...prevImages, result.assets]);
        }
      }
    } catch (error) {
      console.log('Error picking images:', error);
    } finally {
      setUploadingImages(false); // Step 1: Reset loading state after upload process
    }
  };

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
      formData.append('property_type_id', propertyDetails.property_type_id);
      formData.append('status_id', propertyDetails.status_id);
      formData.append('bedrooms', propertyDetails.bedrooms);
      formData.append('bathrooms', propertyDetails.bathrooms);
      formData.append('area', propertyDetails.area);
      formData.append('amenities', propertyDetails.amenities);
  
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
        setPropertyDetails({
          title: '',
          description: '',
          price: '',
          location: '',
          long: '',
          lat: '',
          user_id: '',
          property_type_id: '',
          status_id: '',
          bedrooms: '',
          bathrooms: '',
          area: '',
          amenities: '',
          images: [],
        });
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

  const fetchComments = async () => {
    // Fetch comments logic here
    setMessages([
      { id: 1, text: 'This is a great property!' },
      { id: 2, text: 'Can you provide more details?' },
    ]);
  };

  const postComment = async () => {
    // Post comment logic here
    setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
    setNewMessage('');
  };

  const renderCommentsModal = () => (
    <Modal
      visible={isCommentsModalVisible}
      animationType="slide"
      onRequestClose={closeCommentsModal}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
          {messages.map((message) => (
            <View key={message.id} style={styles.comment}>
              <Text>{message.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a comment..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text style={styles.sendButton}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking for your Properties...</Text>
      </SafeAreaView>
    );
  }

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
      {renderUploadModal()}
      {renderImageViewerModal()}
      {renderCommentsModal()}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyPropertyScreen;