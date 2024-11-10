import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AddAmenitiesModal from './add-amenities-modal';
import PingMapModal from '../screens/maps/ping-location.screen';

const StepTwo = ({ propertyDetails, setPropertyDetails }) => {
  const [amenitiesModalVisible, setAmenitiesModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleSaveAmenities = (amenities) => {
    setPropertyDetails({ ...propertyDetails, amenities });
    setSelectedAmenities(amenities);
    setAmenitiesModalVisible(false);
  };

  const handleLocationSelect = (longitude, latitude) => {
    setPropertyDetails({
      ...propertyDetails,
      long: longitude.toString(),
      lat: latitude.toString(),
    });
    setMapModalVisible(false);
  };

  const InputWithIcon = ({ icon, placeholder, value, onChangeText, keyboardType }) => (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name={icon} size={20} color="#666" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Amenities</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setAmenitiesModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus-circle" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Add Amenities</Text>
        </TouchableOpacity>

        {selectedAmenities.length > 0 && (
          <View style={styles.selectedAmenitiesContainer}>
            <Text style={styles.subtitle}>Selected Amenities:</Text>
            <View style={styles.amenitiesList}>
              {selectedAmenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Details</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.mapButton]}
          onPress={() => setMapModalVisible(true)}
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Select Location on Map</Text>
        </TouchableOpacity>

        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateField}>
            <Text style={styles.label}>Longitude</Text>
            <InputWithIcon
              icon="longitude"
              placeholder="Enter longitude"
              value={propertyDetails.long || ''}
              onChangeText={(text) => setPropertyDetails({ ...propertyDetails, long: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.coordinateField}>
            <Text style={styles.label}>Latitude</Text>
            <InputWithIcon
              icon="latitude"
              placeholder="Enter latitude"
              value={propertyDetails.lat || ''}
              onChangeText={(text) => setPropertyDetails({ ...propertyDetails, lat: text })}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <AddAmenitiesModal
        visible={amenitiesModalVisible}
        onClose={() => setAmenitiesModalVisible(false)}
        onSave={handleSaveAmenities}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
      />
      
      <PingMapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onSelectLocation={handleLocationSelect}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectedAmenitiesContainer: {
    marginTop: 16,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    color: '#1976D2',
    fontSize: 14,
  },
  coordinatesContainer: {
    marginTop: 16,
  },
  coordinateField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default StepTwo;