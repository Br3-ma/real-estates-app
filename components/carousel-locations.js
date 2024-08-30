// RenderLocationCarousel.js

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RenderLocationCarousel = ({ locationOptions, selectedLocations, handleLocationChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
        {locationOptions.map((location, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleLocationChange(location.id)}
            style={[
              styles.locationButton,
              selectedLocations.includes(location.id) && styles.selectedLocation
            ]}
          >
            <Icon
              name={location.icon}
              size={18}
              color={selectedLocations.includes(location.id) ? '#FFFFFF' : '#48BB78'}
            />
            <Text
              style={[
                styles.buttonLabel,
                selectedLocations.includes(location.id) && styles.selectedLocationLabel
              ]}
            >
              {location.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 3,
  },
  carousel: {
    paddingHorizontal: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  selectedLocation: {
    backgroundColor: '#48BB78',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F855A',
    marginLeft: 6,
  },
  selectedLocationLabel: {
    color: '#FFFFFF',
  },
});

export default RenderLocationCarousel;