import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StepOne = ({ propertyDetails, setPropertyDetails }) => {
  const handleInputChange = (field, value) => {
    setPropertyDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const InputWithIcon = ({ icon, placeholder, value, onChangeText, multiline, keyboardType }) => (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name={icon} size={20} color="#666" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          multiline && styles.textarea,
        ]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor="#999"
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Property Title</Text>
            <InputWithIcon
              icon="home"
              placeholder="Enter property title"
              value={propertyDetails.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
          </View>

          {/* Description Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <InputWithIcon
              icon="text"
              placeholder="Describe your property"
              value={propertyDetails.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline={true}
            />
          </View>

          {/* Address Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Address</Text>
            <InputWithIcon
              icon="map-marker"
              placeholder="Enter property address"
              value={propertyDetails.location}
              onChangeText={(text) => handleInputChange('location', text)}
            />
          </View>

          {/* Price Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Price</Text>
            <InputWithIcon
              icon="currency-usd"
              placeholder="Enter property price"
              value={propertyDetails.price}
              onChangeText={(text) => handleInputChange('price', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Bedrooms & Bathrooms Row */}
          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Bedrooms</Text>
              <InputWithIcon
                icon="bed"
                placeholder="Bedrooms"
                value={propertyDetails.bedrooms}
                onChangeText={(text) => handleInputChange('bedrooms', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Bathrooms</Text>
              <InputWithIcon
                icon="shower"
                placeholder="Bathrooms"
                value={propertyDetails.bathrooms}
                onChangeText={(text) => handleInputChange('bathrooms', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Square Footage Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Square Footage</Text>
            <InputWithIcon
              icon="ruler-square"
              placeholder="Enter square footage (optional)"
              value={propertyDetails.area}
              onChangeText={(text) => handleInputChange('area', text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 2,
    paddingTop: 0,
    paddingVertical: 20,
    paddingBottom: 60,
  },
  fieldContainer: {
    marginBottom: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  textarea: {
    height: 90,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  halfWidth: {
    width: '48%',
  },
});

export default StepOne;
