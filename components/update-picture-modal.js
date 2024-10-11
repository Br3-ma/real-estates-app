import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const UploadProfilePictureModal = ({ isVisible, onClose, uploadImages, setUploadImages, handleSavePicture, saving }) => {
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
  }, []);

  const pickImages = async () => {
    try {
      setUploadingImages(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        if (result.assets && Array.isArray(result.assets)) {
          setUploadImages(prevImages => [...prevImages, ...result.assets]);
        } else if (result.uri) {
          setUploadImages(prevImages => [...prevImages, result]);
        }
      } else {
        console.log('Image picking was cancelled');
      }
    } catch (error) {
      console.log('Error picking images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.bottomModal}
    >
      <View style={styles.bottomSheetContainer}>
        <Text style={styles.modalTitle}>Upload Profile Picture</Text>
        <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
          <AntDesign name="camera" style={{ width: 30, height: 25 }} />
          <Text style={styles.uploadButtonText}>
            {uploadingImages ? 'Opening...' : 'Upload Images'}
          </Text>
        </TouchableOpacity>
        <View style={styles.uploadedImageContainer}>
          {uploadImages && uploadImages.length > 0 ? (
            uploadImages.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={styles.uploadedImage} />
            ))
          ) : (
            <Text style={styles.noImageText}>No images uploaded</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSavePicture} disabled={saving || uploadingImages}>
            <Text style={styles.buttonText}>
              {saving || uploadingImages ? <ActivityIndicator size="small" color="#fff" /> : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  uploadButtonText: {
    marginLeft: 10,
  },
  uploadedImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default UploadProfilePictureModal;
