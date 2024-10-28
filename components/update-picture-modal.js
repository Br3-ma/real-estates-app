import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const UploadProfilePictureModal = ({ isVisible, onClose, uploadImages, setUploadImages, handleSavePicture, saving }) => {
  const [uploadingImages, setUploadingImages] = useState(false);

  const pickImages = async () => {
    try {
      setUploadingImages(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
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
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Upload Profile Picture</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImages} style={styles.uploadContainer}>
          {uploadImages && uploadImages.length > 0 ? (
            <Image source={{ uri: uploadImages[0].uri }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <AntDesign name="camera" size={40} color="#3498db" />
              <Text style={styles.uploadText}>
                {uploadingImages ? 'Opening...' : 'Tap to upload'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, (uploadImages.length === 0 || saving || uploadingImages) && styles.disabledButton]} 
          onPress={handleSavePicture} 
          disabled={uploadImages.length === 0 || saving || uploadingImages}
        >
          {saving || uploadingImages ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  uploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3498db',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadProfilePictureModal;
