// src/utils/authHandlers.js
import axios from 'axios';
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '../../confg/config';

// Handle Google Sign-In

const handleDeleteProperty = useCallback(async (propertyId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this property?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            // setDeleting(true);
            try {
              await axios.delete(`${API_BASE_URL}/delete-post/${propertyId}`);
              Toast.show({
                type: 'success',
                text1: 'Posted Deleted',
                text2: 'Property deleted successfully!'
              });
            //   fetchProperties(); 
            } catch (error) {
              console.error('Failed to delete property:', error);
              Toast.show({
                type: 'error',
                text1: 'Failed Deleting',
                text2: 'Failed to delete property!'
              });
            } finally {
            //   setDeleting(false);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
}, []);
