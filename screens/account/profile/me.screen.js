import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import { fetchUserInfo } from '../../../controllers/auth/userController';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, SERVER_BASE_URL } from '../../../confg/config';
import mime from "mime";
import Constants from 'expo-constants';
import ChangePasswordModal from '../../../components/update-password-modal';
import EditProfileModal from '../../../components/update-profile-modal';
import UploadProfilePictureModal from '../../../components/update-picture-modal';
import Preloader from '../../../components/preloader-full';

const MeScreen = () => {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [uploadProfileModalVisible, setUploadProfileModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [likesCount, setLikesCount] = useState(0); 
  const [uploadImages, setUploadImages] = useState([]);
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '', email: '', bio: '', location: '', website: '', password: '', newPassword: '', confirmNewPassword: '', picture: '',
  });
  const [refreshing, setRefreshing] = useState(false);

  // Define fetchUser to fetch user info
  const fetchUser = useCallback(async () => {
    try {
      const user = await fetchUserInfo();
      setUserInfo(user);
      setFormData({
        name: user.user.name,
        email: user.user.email,
        bio: user.user.bio,
        location: user.user.location,
        website: user.user.website,
        picture: user.user.picture,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, []); 

  const fetchLikesCount = useCallback(async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      setLikesCount(favoritesArray.length);
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  }, []);

  useEffect(() => {
    // Fetch user info on component mount
    fetchUser();
    fetchLikesCount();
  }, [fetchUser, fetchLikesCount]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUser();
    await fetchLikesCount();
    setRefreshing(false);
  }, [fetchUser, fetchLikesCount]);

  const openChangePasswordModal = () => setChangePasswordModalVisible(true);
  const openEditProfileModal = () => setEditProfileModalVisible(true);
  const openUploadProfileModal = () => setUploadProfileModalVisible(true);

  const closeChangePasswordModal = () => setChangePasswordModalVisible(false);
  const closeEditProfileModal = () => setEditProfileModalVisible(false);
  const closeUploadProfileModal = () => setUploadProfileModalVisible(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const saveChanges = async (updatedData) => {
    setSaving(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/update-profile`, updatedData);
      setUserInfo(null);
      setUserInfo(response.data.user);
      onRefresh();
      toast.show(JSON.stringify(response.data.message), {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    } catch (error) {
      toast.show(JSON.stringify(error), {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const handleSaveProfile = () => {
    const segment = 'profile';
    const user_id = userInfo.user.id;
    const { name, email, bio, location, website } = formData;
    saveChanges({ name, email, bio, location, website, segment, user_id });
    closeEditProfileModal();
  };

  const handleSavePassword = () => {
    const segment = 'password';
    const user_id = userInfo.user.id;
    const { password, newPassword, confirmNewPassword } = formData;
    saveChanges({ password, newPassword, confirmNewPassword, segment, user_id });
    closeChangePasswordModal();
  };

  const handleSavePicture = async () => {
    try {
      setSaving(true);
      
      const formPicData = new FormData();
      formPicData.append('segment', 'picture');
      formPicData.append('user_id', userInfo.user.id);
      // Convert image URIs to Blobs and append them to formPicData
      for (let index = 0; index < uploadImages.length; index++) {
        const image = uploadImages[index];
        const newImageUri = Constants.platform.android
          ? image.uri
          : image.uri.replace('file://', '');
        
        const fileType = mime.getType(newImageUri) || 'image/jpeg';
        formPicData.append(`picture[${index}]`, {
          name: `photo_${index}.jpg`,
          type: fileType,
          uri: newImageUri,
        });
      }
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data',
        },
        body: formPicData,
      });
      
      const responseData = await response.json();

      // Save the updated user info back to AsyncStorage
      await AsyncStorage.setItem('userInfo', JSON.stringify(responseData));

      // Update state with new user info
      setUserInfo(null);
      setUserInfo(responseData.user);
      setSaving(false); 
      closeUploadProfileModal();
      onRefresh();
      toast.show("Profile Picture Updated Successfully", {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    } catch (error) {
      console.error();
      toast.show("Check your image and try again", {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    } finally {
      setSaving(false);
    }
  };

  const placeholderCoverImage = 'https://arteye.co.za/wp-content/uploads/2022/06/Fiona-Rowette-Diptych-140-x-100-cm-003-scaled.jpg';
  const placeholderProfileImage = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-icon-design-600nw-1682415103.jpg';

  return (
    <ScrollView contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Profile Header with editable cover image */}
      <View style={styles.profileHeader}>
      <Image
        source={{
          uri: userInfo?.user?.cover
            ? `${SERVER_BASE_URL}/storage/app/${userInfo.user.cover}`
            : `${SERVER_BASE_URL}/storage/app/profile/no-cover.jpg`,
        }}
        style={styles.coverImage}
      />
        <TouchableOpacity onPress={() => alert('Change Cover')} style={styles.editCoverButton}>
          <AntDesign name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image source={{ uri:`${SERVER_BASE_URL}/storage/app/` +  userInfo?.user?.picture || placeholderProfileImage }} style={styles.profilePicture} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{userInfo?.user?.name}</Text>
            <Text style={styles.profileBio}>{userInfo?.user?.bio}</Text>
          </View>
        </View>
      </View>

      {/* Profile Stats */}
      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statText}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statText}>Properties</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{likesCount}</Text>
          <Text style={styles.statText}>Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statText}>Profit</Text>
        </View>
      </View>

      {/* Profile Links */}
      <View style={styles.profileLinks}>
        <TouchableOpacity onPress={openChangePasswordModal} style={styles.linkButton}>
          <MaterialCommunityIcons name="lock" style={styles.linkIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openEditProfileModal} style={styles.linkButton}>
          <MaterialCommunityIcons name="account-edit-outline" size={24} style={styles.linkIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openUploadProfileModal} style={styles.linkButton}>
          <AntDesign name="picture" style={styles.linkIcon} size={24} />
        </TouchableOpacity>
      </View>

      {/* Change Password Bottom Sheet */}
      <ChangePasswordModal
        isVisible={changePasswordModalVisible}
        onClose={closeChangePasswordModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSavePassword={handleSavePassword}
        saving={saving}
      />

      {/* Edit Profile Bottom Sheet */}  
      <EditProfileModal
        isVisible={editProfileModalVisible}
        onClose={closeEditProfileModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSaveProfile={handleSaveProfile}
        saving={saving}
      />

      {/* Upload Profile Picture Bottom Sheet */}
      <UploadProfilePictureModal
        isVisible={uploadProfileModalVisible}
        onClose={closeUploadProfileModal}
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
        handleSavePicture={handleSavePicture}
        saving={saving}
      />

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        <Card title="Location" value={userInfo.user?.location} />
        <Card title="Email" value={userInfo.user?.email} />
        <Card title="Website" value={userInfo.user?.website} onPress={() => alert('Visit website')} />
      </View>
      {/* Add more cards as needed */}

      
      {saving && <Preloader />}
    </ScrollView>
  );
};

const Card = ({ title, value, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  profileHeader: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  editCoverButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  profileBio: {
    fontSize: 16,
    color: '#34495e',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statText: {
    fontSize: 12,
    color: '#555',
  },
  profileLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  linkButton: {
    borderRadius: 50,
    backgroundColor: '#3498db',
    padding: 15,
  },
  linkIcon: {
    fontSize: 24,
    color: '#fff',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicturePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
    alignSelf: 'center',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

const Screen = () => (
  <ToastProvider>
    <MeScreen />
  </ToastProvider>
);

export default Screen;