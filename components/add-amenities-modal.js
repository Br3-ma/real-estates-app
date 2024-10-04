import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AddAmenitiesModal = ({ visible, onClose, onSave, selectedAmenities, setSelectedAmenities }) => {
  const amenitiesList = [
    { name: 'Wi-Fi', icon: 'wifi' },
    { name: 'Parking', icon: 'car' },
    { name: 'Swimming Pool', icon: 'pool' },
    { name: 'Gym', icon: 'dumbbell' },
    { name: 'Security', icon: 'security' },
    { name: 'Laundry', icon: 'washing-machine' },
    { name: 'Air Conditioning', icon: 'air-conditioner' },
    { name: 'Pet Friendly', icon: 'paw' },
    // Add more amenities as needed
  ];

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Amenities</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.amenitiesContainer}>
            {amenitiesList.map((amenity, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.amenityItem,
                  selectedAmenities.includes(amenity.name) && styles.amenitySelected
                ]}
                onPress={() => toggleAmenity(amenity.name)}
              >
                <MaterialCommunityIcons 
                  name={amenity.icon} 
                  size={24} 
                  color={selectedAmenities.includes(amenity.name) ? "#4c669f" : "white"} 
                />
                <Text style={[
                  styles.amenityText,
                  selectedAmenities.includes(amenity.name) && styles.amenityTextSelected
                ]}>
                  {amenity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(selectedAmenities);
              onClose();
            }}
          >
            <Text style={styles.saveButtonText}>Save Amenities</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 5,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  amenitySelected: {
    backgroundColor: 'white',
  },
  amenityText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'white',
  },
  amenityTextSelected: {
    color: '#4c669f',
  },
  saveButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#4c669f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddAmenitiesModal;