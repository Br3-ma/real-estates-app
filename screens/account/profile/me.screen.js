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
import UploadCoverPictureModal from '../../../components/update-cover-picture';

const MeScreen = () => {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [uploadProfileModalVisible, setUploadProfileModalVisible] = useState(false);
  const [uploadCoverProfileModalVisible, setUploadCoverProfileModalVisible] = useState(false);
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
      console.log(user);
      if (user && user.user) {
        setUserInfo(user);
        setFormData({
          name: user.user.name,
          email: user.user.email,
          bio: user.user.bio,
          location: user.user.location,
          website: user.user.website,
          picture: user.user.picture,
        });
      } else {
        alert('Incorrect Structure');
      }
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

  // Fetch user info on component mount
  useEffect(() => {
    fetchUser();
    fetchLikesCount();
  }, [fetchUser, fetchLikesCount]);

  const onRefresh = useCallback(async () => {
    setUserInfo(null); 
    setRefreshing(true);
    await fetchUser();
    await fetchLikesCount();
    setRefreshing(false);
  }, [fetchUser, fetchLikesCount]);

  const openChangePasswordModal = () => setChangePasswordModalVisible(true);
  const openEditProfileModal = () => setEditProfileModalVisible(true);
  const openUploadProfileModal = () => setUploadProfileModalVisible(true);
  const openUploadCoverProfileModal = () => setUploadCoverProfileModalVisible(true);

  const closeChangePasswordModal = () => setChangePasswordModalVisible(false);
  const closeEditProfileModal = () => setEditProfileModalVisible(false);
  const closeUploadProfileModal = () => setUploadProfileModalVisible(false);
  const closeUploadCoverProfileModal = () => setUploadCoverProfileModalVisible(false);
  
  const formatEstimateProfit = (amount) => {
    if (!amount) {
      return '0';
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`;
    }
    return amount.toString();
  };
  
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const saveChanges = async (updatedData) => {
    setSaving(true);
    try {
      const responseData = await axios.post(`${API_BASE_URL}/update-profile`, updatedData);
      console.log('Server: '+JSON.stringify(responseData.data));
      await AsyncStorage.setItem('userInfo', JSON.stringify(responseData.data));
      setUserInfo(null);
      setUserInfo(responseData.data.user);
      onRefresh();
      toast.show('Profile updated successfully', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    } catch (error) {
      console.log(error);
      toast.show('Failed to update your profile', {
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
  
  const handleSaveCoverPicture = async () => {
    try {
      setSaving(true);
      const formPicData = new FormData();
      formPicData.append('segment', 'cover');
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
      closeUploadCoverProfileModal();
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

  const placeholderProfileImage = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-icon-design-600nw-1682415103.jpg';

  return (
    <ScrollView contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {saving && <Preloader />}


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
        <View style={styles.coverOverlay} />
        <View style={styles.blurOverlay} />
        <TouchableOpacity onPress={openUploadCoverProfileModal} style={styles.editCoverButton}>
          <AntDesign name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: `${SERVER_BASE_URL}/storage/app/` + userInfo?.user?.picture || placeholderProfileImage }}
              style={styles.profilePicture}
            />
            <TouchableOpacity onPress={openUploadProfileModal} style={[styles.linkButton, styles.pictureButton]}>
              <AntDesign name="picture" color={'#fff'} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{userInfo?.user?.name}</Text>            
          </View>
        </View>
      </View>
  
      {/* Profile Stats */}
      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userInfo.user?.total_posts}</Text>
          <Text style={styles.statText}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userInfo.user?.total_properties}</Text>
          <Text style={styles.statText}>Properties</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{likesCount}</Text>
          <Text style={styles.statText}>Likes</Text>
        </View>
        <View style={styles.statItem}>
          {/* shorten estimate_profit amont */}
          <Text style={styles.statNumber}>{formatEstimateProfit(userInfo.user?.estimate_profit)}</Text>
          <Text style={styles.statText}>Estimate Profits</Text>
        </View>
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
  
      {/* Upload Profile Picture Bottom Sheet */}
      <UploadCoverPictureModal
        isVisible={uploadCoverProfileModalVisible}
        onClose={closeUploadCoverProfileModal}
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
        handleSavePicture={handleSaveCoverPicture}
        saving={saving}
      />
    {/* Details Container */}
    <View style={styles.detailsContainer}>
      {/* User Details Section */}
      <View style={styles.userDetailsSection}>
        <TouchableOpacity onPress={openEditProfileModal} style={styles.editButton}>
          <MaterialCommunityIcons name="account-edit-outline" style={styles.linkIcon} />
        </TouchableOpacity>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{userInfo.user?.location || 'Not set'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{userInfo.user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.detailItem}>
          <Text style={styles.detailLabel}>About</Text>
          <Text style={[styles.detailValue, styles.link]}>{userInfo.user?.bio || 'Not set'}</Text>
        </TouchableOpacity>
      </View>
      {/* Change password link action button section */}
      <TouchableOpacity onPress={openChangePasswordModal} style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Change your password</Text>
        <MaterialCommunityIcons name="lock" size={24} color="#60279C" />
      </TouchableOpacity>
    </View>
  

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
    backgroundColor: '#F0F2F5',
    marginHorizontal:0,
  },
  profileHeader: {
    position: 'relative',
    height: 300,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // Increased opacity for better readability
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backdropFilter: 'blur(5px)', // Add blur effect
  },
  editCoverButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  profilePictureContainer: {
    marginBottom: 15,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  pictureButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#60279C',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileText: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 22,
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 2,
    marginTop: -30
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#918895',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailsContainer: {
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cdc5d0',
  },
  userDetailsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal:0,
    padding: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  link: {
    color: '#60279C',
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#60279C',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#60279C',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 1000,
  },
  profilePicturePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 30,
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: '#60279C',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  input: {
    height: 55,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#333',
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F2F5',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60279C',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#60279C',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Screen = () => (
  <ToastProvider>
    <MeScreen />
  </ToastProvider>
);

export default Screen;