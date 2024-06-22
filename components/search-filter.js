import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ReactNativeModal from 'react-native-modal';
const { height } = Dimensions.get('window');

const SearchModal = ({ 
  isVisible, 
  closeModal, 
  search, 
  updateSearch, 
  category, 
  setCategory, 
  handleSearch, 
  isLoading 
}) => {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
      style={styles.bottomModal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Search Properties</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Type keyword..."
          value={search}
          onChangeText={updateSearch}
        />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select category..." value="" />
          <Picker.Item label="Buy" value="buy" />
          <Picker.Item label="Rent" value="rent" />
          <Picker.Item label="Projects" value="projects" />
        </Picker>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {isLoading && (
          <View style={styles.fullScreenLoading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </ReactNativeModal>
  );
};


const styles = StyleSheet.create({
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: height * 0.5, // Adjust height as needed
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    searchInput: {
      width: '100%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    picker: {
      width: '100%',
      height: 40,
      marginBottom: 20,
    },
    searchButton: {
      width: '100%',
      backgroundColor: '#165F56',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    searchButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    fullScreenLoading: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default SearchModal;
