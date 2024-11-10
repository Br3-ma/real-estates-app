// StepSix.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const StepSix = ({
  pickImages,
  pickVideos,
  uploadImages = [], // Ensure these arrays are initialized to avoid errors
  uploadVideos = [],
  uploadingImages,
  uploadingVideos,
  setUploadImages,
  setUploadVideos,
}) => {
  
  // Function to render individual media items
  const renderMediaItem = (media, index, type) => (
    <View key={index} style={styles.uploadedMedia}>
      {type === 'image' ? (
        <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
      ) : (
        <View style={styles.mediaThumbnail}>
          {/* Display an icon for video files */}
          <AntDesign name="playcircleo" size={48} color="gray" />
        </View>
      )}
      <TouchableOpacity
        style={styles.removeMediaButton}
        onPress={() => handleRemoveMedia(index, type)}
      >
        <AntDesign name="close" size={18} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Function to handle removing media items
  const handleRemoveMedia = (index, type) => {
    if (type === 'image') {
      setUploadImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      setUploadVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Upload Buttons */}
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

      {/* Uploaded Media Thumbnails */}
      <ScrollView contentContainerStyle={styles.uploadedMediaContainer}>
        {uploadImages.map((image, index) => renderMediaItem(image, index, 'image'))}
        {uploadVideos.map((video, index) => renderMediaItem(video, index, 'video'))}
      </ScrollView>
    </View>
  );
};

export default StepSix;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingVertical: 20,
    paddingBottom: 200,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  uploadButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#438ab5',
    flexDirection: 'row',
  },
  uploadButtonText: {
    marginLeft: 8,
    color: '#438ab5',
  },
  uploadedMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  uploadedMedia: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    borderRadius: 12,
    margin: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
