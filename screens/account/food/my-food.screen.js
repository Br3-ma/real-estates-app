import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Modal, Button as RNButton } from 'react-native';
import { BlurView } from 'expo-blur';
import { Card, Button, Icon, SearchBar, ButtonGroup } from '@rneui/themed';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import { TextField, Grid } from '@mui/material';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const MyPropertyScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    name: '',
    price: '',
    location: '',
    beds: '',
    baths: '',
    area: ''
  });
  const [uploadImages, setUploadImages] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));  // Simulating fetch delay
        setProperties([
          { id: '1', name: 'Cozy Cottage', images: [require('../../../assets/house1.jpg'), require('../../../assets/house2.jpeg'), require('../../../assets/house3.jpg')], price: '250,000', location: 'Suburb', beds: 3, baths: 2, area: 1200 },
          { id: '2', name: 'Luxury Villa', images: [require('../../../assets/house1.jpg'), require('../../../assets/house3.jpg')], price: '950,000', location: 'City Center', beds: 5, baths: 4, area: 3500 },
          { id: '3', name: '2 Bedroom House in Kalundu', images: [require('../../../assets/house3.jpg')], price: '950,000', location: 'City Center', beds: 5, baths: 4, area: 3500 },
        ]);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const buttons = ['Add Post'];

  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
  };

  const showImageViewer = (images) => {
    setCurrentImages(images);
    setImageViewVisible(true);
  };

  const renderPropertyItem = ({ item }) => (
    <Card>
      <Card.Title>{item.name}</Card.Title>
  
      {/* Include overlay on the ScrollView with buttons and ribbon tags */}
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
            <Text style={styles.iconText}>{item.beds} Beds</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialIcons name="bathtub" size={20} color="#000" />
            <Text style={styles.iconText}>{item.baths} Baths</Text>
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
        
        <BlurView intensity={100} style={styles.modalContainer}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Post</Text>

              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Property description"
                style={styles.textarea}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, name: text })}
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
                    onChange={(event) => setPropertyDetails({ ...propertyDetails, beds: event.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Baths"
                    placeholder="Baths"
                    style={styles.input}
                    onChange={(event) => setPropertyDetails({ ...propertyDetails, baths: event.target.value })}
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
                  source={{ uri: 'https://example.com/your-image.png' }}
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

            </View>
          </View>
        </ScrollView>
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

  const handleSubmit = () => {
    // Form your request data here and submit to Laravel API endpoint
    console.log('Submitting property details:', propertyDetails);
    console.log('Submitting images:', uploadImages);
    setModalVisible(false);
  };

  const getImageStyle = (imageCount) => ({
    width: imageCount === 1 ? width : width / Math.min(imageCount, 3),
    height: 250,
    resizeMode: 'cover',
    marginRight: 5,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card>
        {/* <SearchBar placeholder="Type Here..." onChangeText={updateSearch} value={search} /> */}
        <ButtonGroup buttons={buttons} selectedIndex={selectedIndex} onPress={updateIndex} />
      </Card>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '96%',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
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
});

export default MyPropertyScreen;
