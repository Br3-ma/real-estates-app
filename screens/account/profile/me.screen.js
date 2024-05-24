import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Button, Grid, TextField } from '@mui/material';

const MeScreen = ({ route }) => {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [uploadProfileModalVisible, setUploadProfileModalVisible] = useState(false);
  const [saving, setSaving] = useState(false); // State to track saving process

  const openChangePasswordModal = () => {
    setChangePasswordModalVisible(true);
  };

  const openEditProfileModal = () => {
    setEditProfileModalVisible(true);
  };

  const openUploadProfileModal = () => {
    setUploadProfileModalVisible(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header with editable cover image */}
      <View style={styles.profileHeader}>
        <Image source={require('../../../assets/img/cover.jpg')} style={styles.coverImage} />
        <TouchableOpacity onPress={() => alert('Change Cover')} style={styles.editCoverButton}>
          <AntDesign name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image source={require('../../../assets/img/avata.jpg')} style={styles.profilePicture} />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileBio}>Public User | Agent</Text>
          </View>
        </View>
      </View>

      {/* Profile Stats */}
      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>153</Text>
          <Text style={styles.statText}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>27</Text>
          <Text style={styles.statText}>Properties</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3.5K</Text>
          <Text style={styles.statText}>Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>$12.5K</Text>
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

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModalVisible}
        animationType="slide"
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)} style={styles.closeButton}>
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Change Password</Text>
          {/* Your form elements for changing password */}
          <View style={styles.buttonContainer}>
            <Button variant="contained" color="primary" onPress={saveChanges}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text>Save Changes</Text>}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={editProfileModalVisible}
        animationType="slide"
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setEditProfileModalVisible(false)} style={styles.closeButton}>
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          {/* Your form elements for editing profile */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Full Name" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" fullWidth />
            </Grid>
            {/* Add more fields as needed */}
          </Grid>
          <View style={styles.buttonContainer}>
            <Button variant="contained" color="primary" onPress={saveChanges}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text>Save Changes</Text>}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Upload Profile Picture Modal */}
      <Modal
        visible={uploadProfileModalVisible}
        animationType="slide"
        onRequestClose={() => setUploadProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setUploadProfileModalVisible(false)} style={styles.closeButton}>
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Upload Profile Picture</Text>
          {/* Your image picker and preview */}
          <View style={styles.buttonContainer}>
            <Button variant="contained" color="primary" onPress={saveChanges}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text>Save Changes</Text>}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Details Container */}
      <View style={styles.detailsContainer}>
        <Card title="Location" value="New York, USA" />
        <Card title="Email" value="john.doe@example.com" />
        <Card title="Website" value="www.example.com" onPress={() => alert('Visit website')} />
      </View>

      {/* Add more cards as needed */}
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
    borderRadius: 50, // Make the buttons round
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
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center', // center modal vertically
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default MeScreen;
