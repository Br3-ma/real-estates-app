import React, { useState, useEffect, useCallback } from 'react';
import { Modal, TextInput, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button as RNButton } from '@rneui/themed';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import { Video } from 'expo-av';

const UploadPost = ({ isModalVisible, setModalVisible, propertyDetails, setPropertyDetails, uploadImages, uploadVideos, setUploadImages, setUploadVideos, uploadPost, uploading }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  // Fetch mock data for property types, locations, and categories
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
    // requestPermissions();
    fetchData();
  }, []);
  // Function to pick images from gallery
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

  // Function to pick videos from gallery
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
                  placeholder="No. of Beds"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bedrooms: text })}
                />
                <TextInput
                  placeholder="No. of Baths"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bathrooms: text })}
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Square Foot"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, area: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Longitute"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, long: text })}
                />
                <TextInput
                  placeholder="Latitude"
                  style={[styles.input, styles.inputRowItem]}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, lat: text })}
                />
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
                      <Text>{type.name}</Text>
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
                      <Text>{location.name}</Text>
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
                      <Text>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
                <AntDesign name="camera" style={{ width: 30, height: 25 }} />
                <Text style={styles.uploadButtonText}>
                  {uploadingImages ? 'Opening...' : 'Upload Images'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={pickVideos} style={styles.uploadButton}>
                <AntDesign name="videocamera" style={{ width: 30, height: 25 }} />
                <Text style={styles.uploadButtonText}>
                  {uploadingVideos ? 'Opening...' : 'Upload Videos'}
                </Text>
              </TouchableOpacity>


              <View style={styles.uploadedImageContainer}>
                {uploadImages.map((image, index) => (
                  <Image key={index} source={{ uri: image.uri }} style={styles.uploadedImage} />
                ))}
                
                {(uploadVideos ?? []).map((video, index) => (
                  <Video
                    key={index}
                    source={{ uri: video.uri }}
                    style={styles.uploadedVideo}
                    resizeMode="cover"
                    useNativeControls={false}
                    isLooping
                    shouldPlay={false}
                  />
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <RNButton style={styles.btnCreate} title="Create Post" onPress={uploadPost} disabled={uploading} />
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%', // Full width
    height: '100%', // Full height
    paddingHorizontal: 5,
    paddingTop: 40, // Adjust top padding as needed
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#438ab5',
  },
  modalScrollView: {
    flexGrow: 1,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 100, // Adjust as needed
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputRowItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryScrollView: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#C1D5E1',
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
  },
  categoryItemSelected: {
    backgroundColor: '#ddd', // Selected style
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    marginLeft: 10,
  },
  uploadedImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius:10,
  },
  uploadedVideo: {
    width: 100,
    height: 100,
    marginRight: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  btnCreate:{
    backgroundColor:'#438ab5',
  },
  modalFooter: {
    marginTop: 20,
  },
});

export default UploadPost;
