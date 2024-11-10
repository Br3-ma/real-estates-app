import React, { useState, useEffect, useCallback, useRef  } from 'react';
import { Modal, TextInput, ScrollView, Platform, View, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button as RNButton } from '@rneui/themed';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';
import { Video } from 'expo-av';
import PingMapModal from '../screens/maps/ping-location.screen';
import AddAmenitiesModal from './add-amenities-modal';
import StepOne from './upload-post-step1';
import StepTwo from './upload-post-step2';
import StepThree from './upload-post-step3';
import StepFour from './upload-post-step4';
import StepFive from './upload-post-step5';
import StepSix from './upload-post-step6';

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
  // const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [step, setStep] = useState(1);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const addressRef = useRef(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
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
      if (result && !result.canceled && result.assets) {
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
        <AntDesign name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const handleKeyboardShow = () => {
    if (Keyboard.isVisible()) {
      if (titleRef.current) {
        titleRef.current.focus();
      } else if (descriptionRef.current) {
        descriptionRef.current.focus();
      } else if (addressRef.current) {
        addressRef.current.focus();
      }
    }
  };

  const handleKeyboardHide = () => {
    Keyboard.dismiss();
  };

  const handleLocationSelect = (longitude, latitude) => {
    setPropertyDetails({
      ...propertyDetails,
      long: longitude.toString(),
      lat: latitude.toString(),
    });
    setMapModalVisible(false); 
  };

  // const handleSaveAmenities = (amenities) => {
  //   setSelectedAmenities(amenities);
  //   setPropertyDetails({ ...propertyDetails, amenities });
  // };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <StepOne propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} />;
      case 2:
        return <StepTwo propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} />;
      case 3:
        return (
          <StepThree propertyTypes={propertyTypes} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails}/>
        );
      case 4:
        return <StepFour locations={locations} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} />;
      case 5:
        return <StepFive categories={categories} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} />;
      case 6:
        return (
          <StepSix
            pickImages={pickImages}
            pickVideos={pickVideos}
            uploadImages={uploadImages}
            uploadVideos={uploadVideos}
            uploadingImages={uploadingImages}
            uploadingVideos={uploadingVideos}
            setUploadImages={setUploadImages} // Ensure these are passed
            setUploadVideos={setUploadVideos}
        />
        );
      default:
        return null;
    }
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
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollViewContent}>
                  {renderStepContent()}
                </ScrollView>
              </KeyboardAvoidingView>
              {/* Sticky Bottom Toolbar */}
              <View style={styles.bottomToolbar}>
                {step > 1 && (
                  <RNButton title="Back" onPress={prevStep} buttonStyle={styles.toolbarButton} titleStyle={styles.toolbarButtonText} />
                )}
                {step < 6 ? (
                  <RNButton title="Continue" onPress={nextStep} buttonStyle={styles.toolbarButton} titleStyle={styles.toolbarButtonText} />
                ) : (
                  <RNButton title="Create Post" onPress={uploadPost} disabled={uploading} buttonStyle={styles.toolbarButton} titleStyle={styles.toolbarButtonText} />
                )}
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
      <PingMapModal visible={mapModalVisible} onClose={() => setMapModalVisible(false)} onSelectLocation={handleLocationSelect} />
      {/* AddAmenitiesModal goes here if needed */}
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
    paddingTop: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
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
  modalScrollView: {
    flexGrow: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  toolbarButton: {
    backgroundColor: '#69209c',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  toolbarButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
export default UploadPost;