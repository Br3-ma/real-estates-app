import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to fetch user info from AsyncStorage
export const fetchUserInfo = async () => {
  const userInfoString = await AsyncStorage.getItem('userInfo');
  return userInfoString ? JSON.parse(userInfoString) : null;
};
