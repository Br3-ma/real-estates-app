
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, TextInput, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button as RNButton } from '@rneui/themed';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import { Video } from 'expo-av';

const EditPropertyModal = ({ isVisible, onClose, property, onUpdate }) => {
  const [propertyDetails, setPropertyDetails] = useState(property);
  const [uploadImages, setUploadImages] = useState(property.images || []);
  const [uploadVideos, setUploadVideos] = useState(property.videos || []);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState(property.property_type_id);
  const [selectedLocation, setSelectedLocation] = useState(property.location_id);
  const [selectedCategory, setSelectedCategory] = useState(property.category_id);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [updating, setUpdating] = useState(false);

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
        <Image source={{ uri: item.uri || item.path }} style={styles.uploadedMedia} />
      ) : (
        <Video
          source={{ uri: item.uri || item.path }}
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

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate(propertyDetails, uploadImages, uploadVideos);
      Alert.alert('Success', 'Property updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating property:', error);
      Alert.alert('Error', 'Failed to update property');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <BlurView intensity={90} style={StyleSheet.absoluteFill}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Property</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollView}>
              <TextInput
                placeholder="Title"
                style={styles.input}
                value={propertyDetails.title}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, title: text })}
              />
              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Property description"
                style={styles.textarea}
                value={propertyDetails.description}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, description: text })}
              />
              <TextInput
                placeholder="Address"
                style={styles.input}
                value={propertyDetails.location}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, location: text })}
              />
              <TextInput
                placeholder="Price"
                style={styles.input}
                value={propertyDetails.price.toString()}
                onChangeText={(text) => setPropertyDetails({ ...propertyDetails, price: text })}
              />
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="No. of Beds"
                  style={[styles.input, styles.inputRowItem]}
                  value={propertyDetails.bedrooms}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bedrooms: text })}
                />
                <TextInput
                  placeholder="No. of Baths"
                  style={[styles.input, styles.inputRowItem]}
                  value={propertyDetails.bathrooms}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, bathrooms: text })}
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Square Foot"
                  style={[styles.input, styles.inputRowItem]}
                  value={propertyDetails.area.toString()}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, area: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Longitude"
                  style={[styles.input, styles.inputRowItem]}
                  value={propertyDetails.long.toString()}
                  onChangeText={(text) => setPropertyDetails({ ...propertyDetails, long: text })}
                />
                <TextInput
                  placeholder="Latitude"
                  style={[styles.input, styles.inputRowItem]}
                  value={propertyDetails.lat.toString()}
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
                {uploadVideos.map((video, index) => renderMediaItem(video, index, 'video'))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <RNButton
                title="Update Property"
                onPress={handleUpdate}
                disabled={updating}
                buttonStyle={styles.btnUpdate}
                titleStyle={styles.btnUpdateText}
              />
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
        borderRadius: 2,
        width: '100%',
        height: '100%',
        paddingTop: 10,
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#438ab5',
      },
      modalScrollView: {
        flexGrow: 1,
      },
      input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 16,
        paddingVertical: 10,
      },
      textarea: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
        padding: 10,
        textAlignVertical: 'top',
        minHeight: 100,
      },
      inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
      },
      inputRowItem: {
        flex: 1,
        marginRight: 8,
      },
      categoryContainer: {
        marginBottom: 24,
      },
      categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingHorizontal: 16,
      },
      categoryScrollView: {
        paddingLeft: 16,
      },
      categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#E8F4FD',
        borderRadius: 20,
        marginRight: 8,
      },
      categoryItemSelected: {
        backgroundColor: '#438ab5',
      },
      categoryItemText: {
        color: '#438ab5',
        fontWeight: '600',
      },
      uploadButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
      },
      uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#438ab5',
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 8,
      },
      uploadButtonText: {
        marginLeft: 8,
        color: '#438ab5',
        fontWeight: '600',
      },
      uploadedMediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
      },
      mediaItemContainer: {
        position: 'relative',
        margin: 4,
      },
      uploadedMedia: {
        width: 100,
        height: 100,
        borderRadius: 8,
      },
      removeMediaButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
      },
      modalFooter: {
        marginTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 16,
      },
    btnUpdate: {
        backgroundColor: '#438ab5',
        borderRadius: 8,
        height: 48,
    },
    btnUpdateText: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export default EditPropertyModal;