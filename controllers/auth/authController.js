// src/utils/authHandlers.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '../../confg/config';

// Handle Google Sign-In
export const handleGoogleSignIn = async (accessToken, navigation, setLoading) => {
  setLoading(true);
  try {
    const userData = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const response = await axios.post(`${API_BASE_URL}/google-signin`, userData.data);
    await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
    Toast.show({
      type: 'success',
      text1: 'Google Sign-In Successful',
      text2: `Welcome ${userData.data.name}!`,
    });
    navigation.navigate('Main');
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Google Sign-In Error',
      text2: 'Unable to sign in with Google. Please try again later.',
    });
  } finally {
    setLoading(false);
  }
};

// Handle Facebook Sign-In
export const handleFacebookSignIn = async (accessToken, navigation, setLoading) => {
  setLoading(true);
  try {
    const userData = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
    const response = await axios.post(`${API_BASE_URL}/facebook-signin`, userData.data);
    await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
    Toast.show({
      type: 'success',
      text1: 'Facebook Sign-In Successful',
      text2: `Welcome ${userData.data.name}!`,
    });
    navigation.navigate('Main');
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Facebook Sign-In Error',
      text2: 'Unable to sign in with Facebook. Please try again later.',
    });
  } finally {
    setLoading(false);
  }
};

// Handle standard Sign-In
export const handleSignIn = async (email, password, navigation, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
    if (response.data && response.data.message === 'success' && response.data.user) {
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
      Toast.show({
        type: 'success',
        text1: 'Sign In Successful',
        text2: 'Welcome back!',
      });
      navigation.navigate('Main');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Sign-In Failed',
        text2: response.data.message,
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Oops!',
      text2: 'Your Password or Username is wrong',
    });
  } finally {
    setLoading(false);
  }
};
