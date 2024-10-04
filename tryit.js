import React, { useState, useEffect, useCallback } from 'react';
import { Modal, TextInput, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button as RNButton } from '@rneui/themed';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import { Video } from 'expo-av';
import MapModal from './MapModal'; // Import the new MapModal component

const UploadPost = ({ isModalVisible, setModalVisible, propertyDetails, setPropertyDetails, uploadImages, uploadVideos, setUploadImages, setUploadVideos, uploadPost, uploading }) => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false); // State to control the map modal visibility

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

  // Function to handle the selected coordinates from the map
  const handleLocationSelect = (longitude, latitude) => {
    setPropertyDetails({
      ...propertyDetails,
      long: longitude.toString(),
      lat: latitude.toString(),
    });
    setMapModalVisible(false); // Close the map modal
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
                  {/* Add a link here (ping map location) that opens a new modal screen */}
                  <TouchableOpacity
                    style={styles.mapLinkButton}
                    onPress={() => setMapModalVisible(true)}
                  >
                    <Text style={styles.mapLinkText}>Ping Location</Text>
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Longitude"
                    style={[styles.input, styles.inputRowItem]}
                    value={propertyDetails.long}
                    onChangeText={(text) => setPropertyDetails({ ...propertyDetails, long: text })}
                  />
                  <TextInput
                    placeholder="Latitude"
                    style={[styles.input, styles.inputRowItem]}
                    value={propertyDetails.lat}
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
                        <Text style={styles.categoryItemText}>{type.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Location selection */}
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>Select a Location</Text>
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
                  <Text style={styles.categoryTitle}>Select a Category</Text>
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

                {/* Upload Media */}
                <TouchableOpacity style={styles.mediaButton} onPress={pickImages}>
                  <Text style={styles.mediaButtonText}>Upload Images</Text>
                </TouchableOpacity>
                {uploadImages.map((item, index) => renderMediaItem(item, index, 'image'))}

                <TouchableOpacity style={styles.mediaButton} onPress={pickVideos}>
                  <Text style={styles.mediaButtonText}>Upload Videos</Text>
                </TouchableOpacity>
                {uploadVideos.map((item, index) => renderMediaItem(item, index, 'video'))}

                {/* Submit Button */}
                <RNButton
                  title={uploading ? 'Uploading...' : 'Submit'}
                  onPress={uploadPost}
                  loading={uploading}
                  buttonStyle={styles.submitButton}
                />
              </ScrollView>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Map Modal */}
      <MapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onSelectLocation={handleLocationSelect}
      />
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 8, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalScrollView: { paddingVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 10 },
  textarea: { height: 100, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 10 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputRowItem: { flex: 1, marginRight: 5 },
  categoryContainer: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  categoryScrollView: { paddingHorizontal: 10 },
  categoryItem: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 4, marginRight: 5 },
  categoryItemSelected: { backgroundColor: '#007BFF' },
  categoryItemText: { color: '#000' },
  mediaButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 4, marginBottom: 10 },
  mediaButtonText: { color: '#fff', textAlign: 'center' },
  mediaItemContainer: { position: 'relative', marginBottom: 10 },
  uploadedMedia: { width: '100%', height: 150, borderRadius: 4 },
  removeMediaButton: { position: 'absolute', top: 5, right: 5 },
  submitButton: { backgroundColor: '#28a745' },
  mapLinkButton: { backgroundColor: '#f0ad4e', padding: 10, borderRadius: 4, marginBottom: 10 },
  mapLinkText: { color: '#fff', textAlign: 'center' },
});

export default UploadPost;
