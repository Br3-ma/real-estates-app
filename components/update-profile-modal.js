import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const EditProfileModal = ({ isVisible, onClose, formData, handleInputChange, handleSaveProfile, saving }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.bottomModal}
    >
      <View style={styles.bottomSheetContainer}>
        <Text style={styles.modalTitle}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={formData.bio}
          onChangeText={(text) => handleInputChange('bio', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Website"
          value={formData.website}
          onChangeText={(text) => handleInputChange('website', text)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
            <Text style={styles.buttonText}>{saving ? <ActivityIndicator size="small" color="#fff" /> : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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

export default EditProfileModal;
