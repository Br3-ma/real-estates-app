import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal, Button as RNButton } from 'react-native';
import { BlurView } from 'expo-blur';
import { Card, Button, Icon, SearchBar, ButtonGroup } from '@rneui/themed';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import { TextField, Grid } from '@mui/material';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import moment from 'moment';
import axios from 'axios';

const { width } = Dimensions.get('window');

const MyPropertyScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
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
  const [uploadImages, setUploadImages] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const user = await fetchUserInfo();
        const response = await axios.get(`http://192.168.43.63/realestserver/est-server/api/my-property-posts/${user.user.id}`);
        setProperties(response.data); // Assuming the response data is an object containing properties
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };    

    fetchProperties();
  }, []);

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
  };

  const renderPropertyItem = ({ item }) => (
    <Card>
      <Card.Title>{item.name}</Card.Title>
  
      {item.images.length > 0 ? ( // Check if images array is not empty
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => showImageViewer(item.images)}>
              <Image source={img} style={getImageStyle(item.images.length)} />
            </TouchableOpacity>
          ))}
          {/* Overlay with buttons and ribbon ${item.postedHours} */}
          <View style={styles.overlayStyle}>
            <Text style={styles.ribbonTag}>{`Posted 2 hours ago`}</Text>
          </View>
        </ScrollView>
      ) : ( // If images array is empty, render the illustrative image
        <TouchableOpacity onPress={() => showImageViewer([])}> 
          <Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/021/433/526/non_2x/empty-box-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-vector.jpg' }} style={styles.illustrativeImage} />
        </TouchableOpacity>

      )}
  
      <View>
        {/* Content align in a row for price and location */}
        <View style={styles.priceLocationRow}>
          {/* Stylized price text */}
          <Text style={styles.priceText}>K{item.price}</Text>
  
          {/* Location with a map icon */}
          <TouchableOpacity onPress={() => navigation.navigate('MapScreen', {location: item.location})}>
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
      return null; // Safeguard against undefined properties
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
                <Image source={image} style={{ width, height: width, resizeMode: 'contain' }} />
                <View style={styles.overlayDetails}>
                  <Text style={styles.overlayText}>{property.name} - ${property.price}</Text>
                  <View style={styles.overlayIconRow}>
                    <Icon name="bed" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.beds} Beds</Text>
                    <Icon name="bathtub" type="material" size={15} color="#fff" />
                    <Text style={styles.overlayTextSmall}>{property.baths} Baths</Text>
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
              <TextField
                label="Address"
                placeholder="Address"
                style={styles.input}
                onChange={(event) => setPropertyDetails({ ...propertyDetails, location: event.target.value })}
              />
               <TextField
                label="Price"
                placeholder="Price"
                style={styles.input}
                onChange={(event) => setPropertyDetails({ ...propertyDetails, price: event.target.value })}
              />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Beds"
                    placeholder="Beds"
                    style={styles.input}
                    onChange={(event) => setPropertyDetails({ ...propertyDetails, bedrooms: event.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Baths"
                    placeholder="Baths"
                    style={styles.input}
                    onChange={(event) => setPropertyDetails({ ...propertyDetails, bathrooms: event.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Square Foot"
                    placeholder="Square Foot"
                    style={styles.input}
                    onChange={(event) => setPropertyDetails({ ...propertyDetails, area: event.target.value })}
                  />
                </Grid>
              </Grid>
              <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
                <Image
                  source={require('../../../assets/icon/image.png')} 
                  style={{ width: 24, height: 24, tintColor: 'white' }}
                />
                <Text style={styles.uploadButtonText}>Upload Images</Text>
              </TouchableOpacity>
              <View style={styles.uploadedImageContainer}>
                {uploadImages.map((image, index) => (
                  <Image key={index} source={{ uri: image.uri }} style={styles.uploadedImage} />
                ))}
              </View>
  
              <View style={styles.buttonContainer}>
                <Button onPress={() => setModalVisible(false)} variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button onPress={handleSubmit} variant="contained" color="primary">
                  Post
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
        </BlurView>
      </Modal>
    );
  };  

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setUploadImages([...uploadImages, { uri: result.uri }]);
    }
  };
  

  const handleSubmit = async () => {
    try {
      const { title, description, price, location, long, lat, user_id, property_type_id, status_id, bedrooms, bathrooms, area, amenities } = propertyDetails;
  
      // Create FormData object
      const formData = new FormData();
  
      // Append fields to FormData
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('location', location);
      formData.append('long', long);
      formData.append('lat', lat);
      formData.append('user_id', user_id);
      formData.append('property_type_id', property_type_id);
      formData.append('status_id', status_id);
      formData.append('bedrooms', bedrooms);
      formData.append('bathrooms', bathrooms);
      formData.append('area', area);
      formData.append('amenities', amenities);

      // Append images to FormData
      uploadImages.forEach((image, index) => {      
          const imageData = {
            uri: image.uri,
            type: 'image/jpeg', // Adjust MIME type if needed
            name: `image_${index}.jpg`, // Adjust file name if needed
          };
          // Append the image file to the formData
          formData.append(`images[${index}]`, {
            uri: imageData.uri,
            type: imageData.type,
            name: imageData.name,
          });
      });
  
      // Send POST request to Laravel API endpoint
      const response = await axios.post('http://192.168.43.63/realestserver/est-server/api/property-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for FormData
        },
      });
  
      // Handle success response
      console.log('Property posted successfully:', response.data);
  
      // Close modal
      setModalVisible(false);
    } catch (error) {
      // Handle error
      console.error('Failed to post property:', error);
    }
  };
  

  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Card>
        <SearchBar placeholder="Type Here..." onChangeText={updateSearch} value={search} />
        <ButtonGroup buttons={buttons} selectedIndex={selectedIndex} onPress={updateIndex} />
      </Card> */}
      <ScrollView>
        {loading ? (
          <ShimmerPlaceholder />
        ) : (
          properties.map((property) => (
            <React.Fragment key={property.id}>
              {renderPropertyItem({ item: property })}
            </React.Fragment>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      {renderImageViewerModal()}
      {renderUploadModal()}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  // Current styles
  screenContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  topBarCard: {
    flexDirection: 'column', // Makes the children of the card stack vertically
    justifyContent: 'space-between', // Distributes space evenly between children
    alignItems: 'center', // Centers children horizontally
    padding: 5,
    marginHorizontal: 20, // Centers the card horizontally with some margin
    marginTop: 10, // Give some margin at the top
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4, // Adds shadow for elevation effect
  },
  searchBarContainer: {
    width: '100%', // Ensures the search bar fills the card width
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: '#EFEFEF',
  },
  buttonGroupContainer: {
    width: '100%', // Ensures the button group fills the card width
    marginTop: 5, // Gives some space between the search bar and button group
  },
  cardContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    padding: 0,
  },
  fullScreenImage: {
    width: width,
    height: width,
    resizeMode: 'contain',
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  propertyLocation: {
    fontSize: 14,
    marginBottom: 10,
  },
  detailsContainer: {
    paddingLeft: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 5,
    marginRight: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  shimmerPlaceholder: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  scrollViewStyle: {
    marginTop: 10,
  },
  overlayDetails: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 10,
  },
  overlayText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overlayTextSmall: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  overlayIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Ensures icons and text are aligned vertically
    justifyContent: 'center' // Centers each icon and text horizontally
  },
  iconText: {
    marginLeft: 5, // Adds space between the icon and the text
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // This will distribute the icon containers evenly
    alignItems: 'center',          // This will align the icons vertically centered
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  ribbonTag: {
    color: 'white',
    fontWeight: 'bold',
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  priceText: {
    fontSize: 18,
    color: '#4169E1',  // A blueish color
    fontWeight: 'bold',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  uploadedImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  uploadedImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalScrollView: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginRight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textarea: {
    width: '95%',
    height: 100,
    padding: 10,
    marginHorizontal:10,
    fontSize: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  illustrativeImage: {
    width: 100, // Adjust width according to your design
    height: 100, // Adjust height according to your design
    resizeMode: 'contain', // Adjust resizeMode according to your design
    borderRadius: 10, // Optional: add border radius for rounded corners
  },
});

export default MyPropertyScreen;
