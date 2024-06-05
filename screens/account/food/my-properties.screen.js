import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Button as RNButton,
  ActivityIndicator,
  Clipboard,
  Share,
  StatusBar
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Card, Button, Icon } from '@rneui/themed';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import axios from 'axios';

const { width } = Dimensions.get('window');

const MyPropertyScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [properties, setProperties] = useState([]);
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const user = await fetchUserInfo();
        const response = await axios.get(`http://192.168.43.63/realestserver/est-server/api/my-property-posts/${user.user.id}`);
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
  }, []);

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
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
        <Button type="clear" icon={() => <MaterialIcons name="comment" size={24} color="black" />} />
        <Button type="clear" icon={() => <MaterialIcons name="share" size={24} color="black" />} />
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
        onRequestClose={() => setImageViewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={true}>
            {currentImages.map((image, index) => (
              <View key={index} style={{ width, height: width, position: 'relative' }}>
                <Image source={{ uri: image.url }} style={{ width, height: width, resizeMode: 'contain' }} />
                <View style={styles.overlayDetails}>
                  <Text style={styles.overlayText}>{property.name} - ${property.price}</Text>
                  <View style={styles.overlayIconRow}>
                    <Icon name="bed" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.bedrooms} Beds</Text>
                    <Icon name="bathtub" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.bathrooms} Baths</Text>
                    <Icon name="square-foot" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.area} sqft</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
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
      formData.append('propertyDetails', JSON.stringify(propertyDetails));
      uploadImages.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });
      const response = await axios.post('http://192.168.43.63/realestserver/est-server/api/property-posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        console.log('Post created successfully');
        setModalVisible(false);
        setPropertyDetails({
          title: '', description: '', price: '', location: '', long: '', lat: '', user_id: '', property_type_id: '',
          status_id: '', bedrooms: '', bathrooms: '', area: '', amenities: '', images: [],
        });
        setUploadImages([]);
      }
    } catch (error) {
      console.error('Error uploading post:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Position the "Create New Post" button */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  illustrativeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'contain',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  createPostButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 10, // Adjust as needed
    right: 10,
    zIndex: 1, // Ensure it's above other content
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding:0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScrollView: {
    paddingVertical: 20,
    width: width - 40,
    margin:0,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputRowItem: {
    width: '30%',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  uploadButtonText: {
    marginLeft: 10,
  },
  uploadedImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  uploadedImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    margin: 5,
  },
  modalFooter: {
    marginTop: 10,
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  overlayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  overlayTextSmall: {
    color: '#fff',
    fontSize: 14,
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPropertyScreen;
