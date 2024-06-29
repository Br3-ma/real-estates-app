import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const ChangePasswordModal = ({ isVisible, onClose, formData, handleInputChange, handleSavePassword, saving }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.bottomModal}
    >
      <View style={styles.bottomSheetContainer}>
        <Text style={styles.modalTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          onChangeText={(text) => handleInputChange('password', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          onChangeText={(text) => handleInputChange('newPassword', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          onChangeText={(text) => handleInputChange('confirmNewPassword', text)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
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

export default ChangePasswordModal;
