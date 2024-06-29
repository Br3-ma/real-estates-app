import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions'; // Import Permissions from Expo

//   // Function to request necessary permissions
// const requestPermissions = async () => {
//     try {
//         const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
//         const { status: readStorageStatus } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_READ_ONLY);
//         const { status: writeStorageStatus } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

//         if (cameraStatus !== 'granted' || readStorageStatus !== 'granted' || writeStorageStatus !== 'granted') {
//         Alert.alert('Permissions required', 'This app requires camera and storage permissions to function correctly.');
//         }
//     } catch (error) {
//         console.error('Error requesting permissions:', error);
//     }
// };

const UploadProfilePictureModal = ({ isVisible, onClose, uploadImages, setUploadImages, handleSavePicture, saving }) => {
  const [uploadingImages, setUploadingImages] = useState(false);


  // Request permissions on component mount
  useEffect(() => {
    // requestPermissions();
  }, []);

  // Function to pick images from gallery
  const pickImages = async () => {
    try {
      setUploadingImages(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        if (Array.isArray(result.assets)) {
          setUploadImages(prevImages => [...prevImages, ...result.assets]);
        } else {
          setUploadImages(prevImages => [...prevImages, result.assets]);
        }
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
          {uploadImages.map((image, index) => (
            <Image key={index} source={{ uri: image.uri }} style={styles.uploadedImage} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSavePicture}>
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
