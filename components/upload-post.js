import React, { useState, useEffect, useCallback } from 'react';
import { Modal, TextInput, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button as RNButton } from '@rneui/themed';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import { Video } from 'expo-av';
import PingMapModal from '../screens/maps/ping-location.screen';
import AddAmenitiesModal from './add-amenities-modal';


const { width, height } = Dimensions.get('window');

const UploadPost = ({ isModalVisible, setModalVisible, propertyDetails, setPropertyDetails, uploadImages, uploadVideos, setUploadImages, setUploadVideos, uploadPost, uploading }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [amenitiesModalVisible, setAmenitiesModalVisible] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyTypesRes, locationsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/property-types`),
          axios.get(`${API_BASE_URL}/locations`),
          axios.get(`${API_BASE_URL}/categories`),
        ]);
        setPropertyTypes(propertyTypesRes.data.data);
        setLocations(locationsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const pickImages = useCallback(async () => {
    try {
      setUploadingImages(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (result && !result.cancelled && result.assets) {
        setUploadImages(prevImages => [...prevImages, ...result.assets]);
      }
    } catch (error) {
      console.log('Error picking images:', error);
    } finally {
      setUploadingImages(false);
    }
  }, []);

  
  const pickVideos = useCallback(async () => {
    try {
      setUploadingVideos(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        quality: 1,
      });
      if (result && !result.cancelled && result.assets) {
        setUploadVideos(prevVideos => [...prevVideos, ...result.assets]);
      }
    } catch (error) {
      console.log('Error picking videos:', error);
    } finally {
      setUploadingVideos(false);
    }
  }, []);

  const removeMedia = (type, index) => {
    if (type === 'image') {
      setUploadImages(prevImages => prevImages.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setUploadVideos(prevVideos => prevVideos.filter((_, i) => i !== index));
    }
  };

  const renderMediaItem = (item, index, type) => (
    <View key={index} style={styles.mediaItemContainer}>
      {type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.uploadedMedia} />
      ) : (
        <Video
          source={{ uri: item.uri }}
          style={styles.uploadedMedia}
          resizeMode="cover"
          useNativeControls={false}
          isLooping
          shouldPlay={false}
        />
      )}
      <TouchableOpacity
        style={styles.removeMediaButton}
        onPress={() => removeMedia(type, index)}
      >
        <AntDesign name="closecircle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
  
  
  const handleLocationSelect = (longitude, latitude) => {
    setPropertyDetails({
      ...propertyDetails,
      long: longitude.toString(),
      lat: latitude.toString(),
    });
    setMapModalVisible(false); 
  };
  const handleSaveAmenities = (amenities) => {
    setSelectedAmenities(amenities);
    setPropertyDetails({ ...propertyDetails, amenities });
  };

  return (
    <>
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
                  placeholder="Number of Bedrooms"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bedrooms: text })}
                />
                <TextInput
                  placeholder="Number of Bathrooms"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bathrooms: text })}
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Square Foot (Optional)"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, area: text })}
                />
              </View>

              <View style={styles.inputRow}>
                  <TouchableOpacity
                      style={styles.amenitiesButton}
                      onPress={() => setAmenitiesModalVisible(true)} // Open amenities modal
                    >
                    <Text style={styles.amenitiesButtonText}>Add Amenities</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                      style={styles.mapLinkButton}
                      onPress={() => setMapModalVisible(true)}
                    >
                      <Text style={styles.mapLinkText}>Ping Location</Text>
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Longitute"
                    style={[styles.input, styles.inputRowItem]}
                    onChangeText={(text) => setPropertyDetails({ ...propertyDetails, long: text })}
                  />
                  <TextInput
                    placeholder="Latitude"
                    style={[styles.input, styles.inputRowItem]}
                    onChangeText={(text) => setPropertyDetails({ ...propertyDetails, lat: text })}
                  /> */}
              </View>
              
              {/* Property Type selection */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>What's the type of property?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollView}>
                  {propertyTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.categoryItem,
                        selectedPropertyType === type.id && styles.categoryItemSelected
                      ]}
                      onPress={() => {
                        setPropertyDetails({ ...propertyDetails, property_type_id: type.id });
                        setSelectedPropertyType(type.id);
                      }}
                    >
                      <Text style={styles.categoryItemText}>{type.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Location selection */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Where is the property located?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollView}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      style={[
                        styles.categoryItem,
                        selectedLocation === location.id && styles.categoryItemSelected
                      ]}
                      onPress={() => {
                        setPropertyDetails({ ...propertyDetails, location_id: location.id });
                        setSelectedLocation(location.id);
                      }}
                    >
                      <Text style={styles.categoryItemText}>{location.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Category selection */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Select a category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollView}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryItem,
                        selectedCategory === category.id && styles.categoryItemSelected
                      ]}
                      onPress={() => {
                        setPropertyDetails({ ...propertyDetails, category_id: category.id });
                        setSelectedCategory(category.id);
                      }}
                    >
                      <Text style={styles.categoryItemText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
                  <AntDesign name="camera" size={24} color="#438ab5" />
                  <Text style={styles.uploadButtonText}>
                    {uploadingImages ? 'Opening...' : 'Upload Images'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={pickVideos} style={styles.uploadButton}>
                  <AntDesign name="videocamera" size={24} color="#438ab5" />
                  <Text style={styles.uploadButtonText}>
                    {uploadingVideos ? 'Opening...' : 'Upload Videos'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.uploadedMediaContainer}>
                {uploadImages.map((image, index) => renderMediaItem(image, index, 'image'))}
                {(uploadVideos ?? []).map((video, index) => renderMediaItem(video, index, 'video'))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <RNButton
                title="Create Post"
                onPress={uploadPost}
                disabled={uploading}
                buttonStyle={styles.btnCreate}
                titleStyle={styles.btnCreateText}
              />
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>      
    <PingMapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onSelectLocation={handleLocationSelect}
      />

    <AddAmenitiesModal
      visible={amenitiesModalVisible}
      onClose={() => setAmenitiesModalVisible(false)}
      onSave={handleSaveAmenities}
      selectedAmenities={selectedAmenities}
      setSelectedAmenities={setSelectedAmenities}
    />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    maxHeight: height * 0.9,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 8,
  },
  modalScrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  inputWrapper: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  categoryScrollView: {
    paddingBottom: 8,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryItemSelected: {
    backgroundColor: '#007aff',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  },
  categoryItemText: {
    color: '#f5dc4d0',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryItemTextSelected: {
    color: '#ffffff',
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007aff',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#f0f8ff',
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#007aff',
    fontWeight: '600',
    fontSize: 14,
  },
  uploadedMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  mediaItemContainer: {
    position: 'relative',
    margin: 6,
  },
  uploadedMedia: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    borderRadius: 12,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  btnCreate: {
    backgroundColor: '#007aff',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCreateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  mapLinkButton: {
    backgroundColor: '#34c759',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapLinkText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  amenitiesButton: {
    padding: 14,
    backgroundColor: '#5856d6',
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  amenitiesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UploadPost;