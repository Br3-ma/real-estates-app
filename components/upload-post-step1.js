import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StepOne = ({ propertyDetails, setPropertyDetails }) => {
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const bedroomsInputRef = useRef(null);
  const bathroomsInputRef = useRef(null);
  const areaInputRef = useRef(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleInputChange = (field, value) => {
    setPropertyDetails((prev) => ({ ...prev, [field]: value }));
  };

  const focusNextInput = (currentRef) => {
    switch (currentRef) {
      case titleInputRef: descriptionInputRef.current?.focus(); break;
      case descriptionInputRef: addressInputRef.current?.focus(); break;
      case addressInputRef: priceInputRef.current?.focus(); break;
      case priceInputRef: bedroomsInputRef.current?.focus(); break;
      case bedroomsInputRef: bathroomsInputRef.current?.focus(); break;
      case bathroomsInputRef: areaInputRef.current?.focus(); break;
      default: break;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="home" size={20} color="#666" style={styles.icon} />
            <TextInput ref={titleInputRef} placeholder="Property Title" value={propertyDetails.title} onChangeText={(text) => handleInputChange('title', text)} style={styles.input} onSubmitEditing={() => focusNextInput(titleInputRef)} returnKeyType="next" accessibilityLabel="Property Title" />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="text" size={20} color="#666" style={styles.icon} />
            <TextInput ref={descriptionInputRef} placeholder="Describe your property" value={propertyDetails.description} onChangeText={(text) => handleInputChange('description', text)} style={[styles.input, styles.textarea, { minHeight: 50, lineHeight: 20 }]} multiline numberOfLines={4} onSubmitEditing={() => focusNextInput(descriptionInputRef)} returnKeyType="next" accessibilityLabel="Property Description" />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" style={styles.icon} />
            <TextInput ref={addressInputRef} placeholder="Enter property address" value={propertyDetails.location} onChangeText={(text) => handleInputChange('location', text)} style={styles.input} onSubmitEditing={() => focusNextInput(addressInputRef)} returnKeyType="next" accessibilityLabel="Property Address" />
          </View>

          {/* Price Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="currency-usd" size={20} color="#666" style={styles.icon} />
            <TextInput ref={priceInputRef} placeholder="Enter property price" value={propertyDetails.price} onChangeText={(text) => handleInputChange('price', text)} style={styles.input} keyboardType="numeric" onSubmitEditing={() => focusNextInput(priceInputRef)} returnKeyType="next" accessibilityLabel="Property Price" />
          </View>

          {/* Bedrooms & Bathrooms Row */}
          <View style={[styles.rowContainer, { flexWrap: 'wrap' }]}>
            <View style={[styles.inputContainer, styles.halfInputContainer]}>
              <MaterialCommunityIcons name="bed" size={20} color="#666" style={styles.icon} />
              <TextInput ref={bedroomsInputRef} placeholder="Bedrooms" value={propertyDetails.bedrooms} onChangeText={(text) => handleInputChange('bedrooms', text.replace(/[^0-9]/g, ''))} style={styles.input} keyboardType="numeric" onSubmitEditing={() => focusNextInput(bedroomsInputRef)} returnKeyType="next" accessibilityLabel="Bedrooms" />
            </View>
            <View style={[styles.inputContainer, styles.halfInputContainer]}>
              <MaterialCommunityIcons name="shower" size={20} color="#666" style={styles.icon} />
              <TextInput ref={bathroomsInputRef} placeholder="Bathrooms" value={propertyDetails.bathrooms} onChangeText={(text) => handleInputChange('bathrooms', text.replace(/[^0-9]/g, ''))} style={styles.input} keyboardType="numeric" onSubmitEditing={() => focusNextInput(bathroomsInputRef)} returnKeyType="next" accessibilityLabel="Bathrooms" />
            </View>
          </View>

          {/* Square Footage Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="ruler-square" size={20} color="#666" style={styles.icon} />
            <TextInput ref={areaInputRef} placeholder="Enter square footage (optional)" value={propertyDetails.area} onChangeText={(text) => handleInputChange('area', text.replace(/[^0-9]/g, ''))} style={styles.input} keyboardType="numeric" onSubmitEditing={() => areaInputRef.current?.blur()} accessibilityLabel="Property Area" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 16 },
  formContainer: { paddingBottom: 60 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, backgroundColor: '#f8f9fa', paddingHorizontal: 6, marginBottom: 16, flex: 1 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 12 },
  textarea: { textAlignVertical: 'top' },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  halfInputContainer: { width: '60%', marginHorizontal: 8 },
});

export default StepOne;