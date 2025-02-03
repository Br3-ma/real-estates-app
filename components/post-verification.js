import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';

const PropertyVerificationModal = ({ visible, onClose, propertyId }) => {
  const [files, setFiles] = useState({
    deed: null,
    id: null,
    self: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const pickFile = async (type) => {
    try {
      let result;
      if (type === 'self') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      } else {
        result = await DocumentPicker.getDocumentAsync({
          type: ['image/*', 'application/pdf'],
          copyToCacheDirectory: true,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name || `file_${Date.now()}`;
        const fileType = result.assets[0].mimeType || 'application/octet-stream';

        setFiles((prev) => ({
          ...prev,
          [type]: { uri: fileUri, name: fileName, type: fileType },
        }));
      }
    } catch (error) {
      console.error('File picking error:', error);
      Alert.alert('Error', 'Could not select file');
    }
  };

  const removeFile = (type) => {
    setFiles((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const convertUriToBlob = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist at the given URI');
    }

    const file = await fetch(uri);
    return file.blob();
  };

  const handleSubmit = async () => {
    if (!files.deed || !files.id || !files.self || !fullName || !phone) {
      Alert.alert('Error', 'Please fill all fields and upload required documents');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('property_id', propertyId);
      formData.append('full_name', fullName);
      formData.append('phone', phone);

      for (const key of ['deed', 'id', 'self']) {
        const file = files[key];
        const fileBlob = await convertUriToBlob(file.uri);

        formData.append(key, {
          uri: file.uri,
          name: file.name,
          type: file.type,
          file: fileBlob,
        });
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      };

      await axios.post(`${API_BASE_URL}/property/verify`, formData, config);

      Alert.alert('Success', 'Documents uploaded successfully', [{ text: 'OK', onPress: onClose }]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Property Ownership</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter Full Name"
          />

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
          />

          {['deed', 'id', 'self'].map((type) => (
            <View key={type} style={styles.section}>
              <Text style={styles.label}>{type === 'self' ? 'Self Photo' : `Property ${type}`}</Text>
              {files[type] ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: files[type].uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFile(type)}
                  >
                    <MaterialIcons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={() => pickFile(type)}>
                  <MaterialIcons
                    name={type === 'self' ? 'camera-alt' : 'upload-file'}
                    size={24}
                    color="#666"
                  />
                  <Text style={styles.uploadText}>
                    {type === 'self' ? 'Take Photo' : 'Upload File'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {isUploading && (
            <View style={styles.progressBarContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text>{uploadProgress}%</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          <Text style={styles.submitText}>{isUploading ? `Uploading... ${uploadProgress}%` : 'Submit Documents'}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600' },
  closeButton: { padding: 4 },
  content: { flex: 1, padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, padding: 8, marginBottom: 16 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' },
  uploadText: { marginLeft: 12, fontSize: 16, color: '#666' },
  previewContainer: { marginBottom: 12, position: 'relative' },
  previewImage: { width: '100%', height: 200, backgroundColor: '#f5f5f5' },
  removeButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 4 },
  submitButton: { backgroundColor: '#2196F3', padding: 16, margin: 16, borderRadius: 8, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#bdbdbd' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  progressBarContainer: { alignItems: 'center', marginVertical: 10 },
});

export default PropertyVerificationModal;
