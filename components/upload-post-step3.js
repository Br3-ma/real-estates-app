// shared-imports.js
import { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Platform, 
  PermissionsAndroid, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

// useFileUpload.js
export const useFileUpload = (onFileUpload, existingFiles = []) => {
  const [uploadState, setUploadState] = useState({
    isLoading: false,
    progress: 0,
    error: null
  });

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to pick files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  const uploadFile = useCallback(async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Please grant storage permission to upload files.');
        return null;
      }

      setUploadState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true
      });

      if (result.type === 'success' || (result.assets && result.assets.length > 0)) {
        const files = result.assets || [result];
        const processedFiles = await Promise.all(
          files.map(async (file) => {
            const fileInfo = await FileSystem.getInfoAsync(file.uri);
            return {
              uri: file.uri,
              name: file.name,
              size: fileInfo.size,
              type: file.mimeType || 'application/octet-stream',
              lastModified: fileInfo.modificationTime || Date.now(),
            };
          })
        );

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadState(prev => ({ ...prev, progress: i }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        onFileUpload([...existingFiles, ...processedFiles]);
        return processedFiles;
      }
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState(prev => ({ ...prev, error: error.message }));
      return null;
    } finally {
      setUploadState(prev => ({ 
        ...prev, 
        isLoading: false, 
        progress: 0 
      }));
    }
  }, [onFileUpload, existingFiles]);

  const removeFile = useCallback((fileIndex) => {
    const newFiles = existingFiles.filter((_, index) => index !== fileIndex);
    onFileUpload(newFiles);
  }, [existingFiles, onFileUpload]);

  return {
    uploadFile,
    removeFile,
    ...uploadState
  };
};

// FileUploadButton.js
export const FileUploadButton = ({ 
  onPress, 
  onRemove,
  isLoading, 
  progress, 
  files = [], 
  label,
  disabled 
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <View style={styles.uploadWrapper}>
      <TouchableOpacity
        style={[
          styles.uploadButton,
          files.length > 0 && styles.uploadButtonSuccess,
          (disabled || isLoading) && styles.uploadButtonDisabled
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <View style={styles.uploadContent}>
            <Ionicons
              name={files.length > 0 ? 'add-circle-outline' : 'cloud-upload-outline'}
              size={24}
              color="#fff"
            />
            <Text style={styles.uploadText}>
              {`Upload ${label} ${files.length > 0 ? `(${files.length} files)` : ''}`}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {progress > 0 && progress < 100 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}

      {files.length > 0 && (
        <ScrollView style={styles.fileList}>
          {files.map((file, index) => (
            <View key={`${file.name}-${index}`} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Ionicons name="document-outline" size={20} color="#438ab5" />
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <Text style={styles.fileSize}>
                  {formatFileSize(file.size)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onRemove(index)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

// StepThree.js
const StepThree = ({ propertyTypes, propertyDetails, setPropertyDetails }) => {
  const [selectedPropertyType, setSelectedPropertyType] = useState(
    propertyDetails.property_type_id || null
  );

  const handleFileUploadSuccess = useCallback((fileKey, files) => {
    setPropertyDetails(prev => ({
      ...prev,
      [fileKey]: files
    }));

    console.log(setPropertyDetails);
  }, [setPropertyDetails]);


  const handleSelectPropertyType = useCallback((type) => {
    setSelectedPropertyType(type.id);
    setPropertyDetails(prev => ({ ...prev, property_type_id: type.id }));
  }, [setPropertyDetails]);

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollableContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>What's the type of property?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.item,
                selectedPropertyType === type.id && styles.itemSelected,
              ]}
              onPress={() => handleSelectPropertyType(type)}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedPropertyType === type.id && styles.itemTextSelected,
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollableContainer: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  scrollView: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  item: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginRight: 12,
    minWidth: 100,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  itemSelected: {
    backgroundColor: '#438ab5',
  },
  itemText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  itemTextSelected: {
    color: '#fff',
  },
  uploadSection: {
    marginTop: 24,
  },
  uploadWrapper: {
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#438ab5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  uploadButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#438ab5',
  },
  fileList: {
    maxHeight: 200,
    marginTop: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  fileSize: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    padding: 4,
  },
});

export default StepThree;