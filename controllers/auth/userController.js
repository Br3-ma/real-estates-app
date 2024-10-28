import AsyncStorage from '@react-native-async-storage/async-storage';

// Fetch user info
export const fetchUserInfo = async () => {
  const userInfoString = await AsyncStorage.getItem('userInfo');
  const user = JSON.parse(userInfoString);
  return userInfoString ? user : null;
};



// Update user info
export const updateUserInfo = async (newUserInfo) => {
  try {
    // Fetch existing user info
    const existingUserInfo = await fetchUserInfo();

    // Merge existing user info with new info
    const updatedUserInfo = { ...existingUserInfo, ...newUserInfo };

    // Save the updated user info to AsyncStorage
    await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

    return updatedUserInfo;
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};
