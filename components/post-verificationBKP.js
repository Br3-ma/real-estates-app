import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as Progress from 'react-native-progress';

const PropertyVerificationModal = ({ visible, onClose, propertyId }) => {
  const [files, setFiles] = useState({
    deed: null,
    id: null,
    selfie: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    phoneNumber: ''
  });

  const pickFile = async (type) => {
    try {
      // Request permissions for Android
      if (Platform.OS === 'android') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'selfie' ? ['image/*'] : ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setFiles(prev => ({
          ...prev,
          [type]: {
            uri: result.uri,
            name: result.name,
            type: result.mimeType
          }
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Could not select file');
    }
  };

  const handleSubmit = async () => {
    alert('here');
    if (!files.deed || !files.id || !files.selfie || !userData.fullName || !userData.phoneNumber) {
      Alert.alert('Error', 'Please fill all required fields and upload documents');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('property_id', propertyId);
      formData.append('full_name', userData.fullName);
      formData.append('phone_number', userData.phoneNumber);
      formData.append('deed', {
        uri: files.deed.uri,
        name: files.deed.name,
        type: files.deed.type
      });
      formData.append('id', {
        uri: files.id.uri,
        name: files.id.name,
        type: files.id.type
      });
      formData.append('selfie', {
        uri: files.selfie.uri,
        name: files.selfie.name,
        type: files.selfie.type
      });

      await axios.post('/api/property/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      Alert.alert('Success', 'Documents uploaded successfully', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderFilePreview = (file, type) => {
    if (!file) return null;

    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: file.uri }} style={styles.previewImage} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => setFiles(prev => ({ ...prev, [type]: null }))}
        >
          <MaterialIcons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Property Verification</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={userData.fullName}
            onChangeText={(text) => setUserData(prev => ({ ...prev, fullName: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={userData.phoneNumber}
            onChangeText={(text) => setUserData(prev => ({ ...prev, phoneNumber: text }))}
          />
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickFile('deed')}>
            <Text>Upload Property Deed</Text>
            {renderFilePreview(files.deed, 'deed')}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={() => pickFile('id')}>
            <Text>Upload ID Document</Text>
            {renderFilePreview(files.id, 'id')}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={() => pickFile('selfie')}>
            <Text>Upload Selfie</Text>
            {renderFilePreview(files.selfie, 'selfie')}
          </TouchableOpacity>
        </View>

        {isUploading && (
          <Progress.Bar 
            progress={uploadProgress/100} 
            width={null} 
            color="#2196F3" 
            style={styles.progressBar} 
          />
        )}

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          <Text style={styles.submitText}>
            {isUploading ? 'Uploading...' : 'Submit Verification'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  uploadSection: {
    marginBottom: 20
  },
  uploadButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
  },
  previewContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold'
  },
  progressBar: {
    marginVertical: 10
  }
});

export default PropertyVerificationModal;