// src/components/propertyActions.js

import { useCallback } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../confg/config';

export const usePropertyActions = (fetchProperties) => {


  const hideFromPosts = useCallback(async (propertyId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/toggle-hide-post/${propertyId}`);
      if (response.status === 200) {
        Alert.alert('Success', 'Property hidden from posts successfully');
        fetchProperties();
      } else {
        Alert.alert('Error', 'Failed to hide property from posts');
      }
    } catch (error) {
      console.error('Failed to hide property:', error);
      Alert.alert('Error', `Failed to hide property: ${error.message}`);
    }
  }, [fetchProperties]);



  const bidForTopPosts = useCallback(async (propertyId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/bid-top-post/${propertyId}`);
      if (response.status === 200) {
        Alert.alert('Success', 'Bid for top posts successful');
        fetchProperties();
      } else {
        Alert.alert('Error', 'Failed to bid for top posts');
      }
    } catch (error) {
      console.error('Failed to bid for top posts:', error);
      Alert.alert('Error', `Failed to bid for top posts: ${error.message}`);
    }
  }, [fetchProperties]);



  const editProperty = useCallback((propertyId) => {
    // Add your logic to navigate to the edit screen or open an edit modal
  }, []);

  return {
    hideFromPosts,
    bidForTopPosts,
    editProperty
  };
};
