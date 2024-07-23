import axios from 'axios';
import mime from 'mime';
import { Platform, Alert } from 'react-native';
import { useCallback } from 'react';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

const uploadVideoChunk = async (chunk, index, totalChunks, videoId) => {
  const formData = new FormData();
  formData.append('chunk', {
    uri: Platform.OS === 'android' ? chunk.uri : chunk.uri.replace('file://', ''),
    type: mime.getType(chunk.uri) || 'video/mp4',
    name: `chunk_${index}`,
  });
  formData.append('index', index);
  formData.append('totalChunks', totalChunks);
  formData.append('videoId', videoId);

  const response = await axios.post(`${API_BASE_URL}/upload-video-chunk`, formData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const uploadVideoInChunks = async (video) => {
  const videoId = Date.now().toString(); // Unique ID for the video
  const totalChunks = Math.ceil(video.size / CHUNK_SIZE);

  for (let index = 0; index < totalChunks; index++) {
    const start = index * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, video.size);
    const chunk = video.slice(start, end);

    await uploadVideoChunk(chunk, index, totalChunks, videoId);
  }

  // Notify the server to reassemble the chunks
  const formData = new FormData();
  formData.append('videoId', videoId);
  await axios.post(`${API_BASE_URL}/complete-upload`, formData, {
    headers: {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data',
    },
  });
};

const uploadPost = useCallback(async () => {
  setUploading(true);
  try {
    // Append property details
    const formData = new FormData();
    formData.append('title', propertyDetails.title);
    formData.append('description', propertyDetails.description);
    formData.append('price', propertyDetails.price);
    formData.append('location', propertyDetails.location);
    formData.append('long', propertyDetails.long);
    formData.append('lat', propertyDetails.lat);
    formData.append('user_id', userInfo.user.id);
    formData.append('status_id', propertyDetails.status_id);
    formData.append('bedrooms', propertyDetails.bedrooms);
    formData.append('bathrooms', propertyDetails.bathrooms);
    formData.append('area', propertyDetails.area);
    formData.append('amenities', propertyDetails.amenities);
    formData.append('property_type_id', propertyDetails.property_type_id);
    formData.append('location_id', propertyDetails.location_id);
    formData.append('category_id', propertyDetails.category_id);
    formData.append('status_id', 1);

    // Append images to formData to be compatible with Android
    for (let index = 0; index < uploadImages.length; index++) {
      const image = uploadImages[index];
      const newImageUri = Platform.OS === 'android'
        ? image.uri
        : image.uri.replace('file://', '');
      const fileType = mime.getType(newImageUri) || 'image/jpeg';
      formData.append(`images[${index}]`, {
        name: `photo_${index}.jpg`,
        type: fileType,
        uri: newImageUri,
      });
    }

    const response = await axios.post(`${API_BASE_URL}/post`, formData, {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle video uploads in chunks
    for (let index = 0; index < uploadVideos.length; index++) {
      const video = uploadVideos[index];
      await uploadVideoInChunks(video);
    }
    
    Alert.alert('Success', 'Post created successfully');
    setModalVisible(false);
    setUploadImages([]);
  
  } catch (error) {
    console.log(error);
    Alert.alert('Error', `Failed to create property post: ${error.message}`);
  } finally {
    setUploading(false);
  }
}, [propertyDetails, uploadImages, uploadVideos, userInfo]);

