// StepFour.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const StepFour = ({ locations, propertyDetails, setPropertyDetails }) => {
  const [selectedLocation, setSelectedLocation] = useState(propertyDetails.location_id);

  const handleSelectLocation = (location) => {
    setPropertyDetails({ ...propertyDetails, location_id: location.id });
    setSelectedLocation(location.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where is the property located?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.item,
              selectedLocation === location.id && styles.itemSelected,
            ]}
            onPress={() => handleSelectLocation(location)}
          >
            <Text style={styles.itemText}>{location.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default StepFour;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingBottom: 60,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  itemSelected: {
    backgroundColor: '#438ab5',
  },
  itemText: {
    color: '#333',
    textAlign: 'center',
  },
});
