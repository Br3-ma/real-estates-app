// StepThree.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const StepThree = ({ propertyTypes, propertyDetails, setPropertyDetails }) => {
  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyDetails.property_type_id);

  const handleSelectPropertyType = (type) => {
    setPropertyDetails({ ...propertyDetails, property_type_id: type.id });
    setSelectedPropertyType(type.id);
  };

  return (
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
            <Text style={styles.itemText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default StepThree;

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
