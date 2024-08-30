import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const renderModalContent = ({
  selectedFilter,
  filterForm,
  handleFilterChange,
  handleBedroomsChange,
  handleBathroomsChange,
  renderCategoryCarousel,
  renderLocationCarousel
}) => {
  const renderCheckboxGroup = (title, options, handleChange, formKey) => (
    <View style={styles.checkboxGroup}>
      <Text style={styles.checkboxGroupTitle}>{title}</Text>
      <View style={styles.checkboxContainer}>
        {options.map(num => (
          <View key={`${formKey}-${num}`} style={styles.checkboxWrapper}>
            <BouncyCheckbox
              isChecked={filterForm[`${formKey}${num}`] || false}
              onPress={(isChecked) => handleChange(num, isChecked)}
              fillColor="#6C63FF"
              unfillColor="#FFFFFF"
              iconStyle={styles.checkboxIcon}
              size={24}
              textComponent={
                <Text style={styles.checkboxLabel}>{num}</Text>
              }
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderPriceRange = () => (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Price Range</Text>
      <View style={styles.priceInputContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min"
          value={filterForm.minPrice}
          onChangeText={(text) => handleFilterChange('minPrice', text)}
          keyboardType="numeric"
        />
        <Icon name="remove-outline" size={24} color="#A0AEC0" />
        <TextInput
          style={styles.priceInput}
          placeholder="Max"
          value={filterForm.maxPrice}
          onChangeText={(text) => handleFilterChange('maxPrice', text)}
          keyboardType="numeric"
        />
      </View>
      <Slider
        value={[parseInt(filterForm.minPrice) || 0, parseInt(filterForm.maxPrice) || 1000000]}
        onValueChange={(values) => {
          handleFilterChange('minPrice', values[0].toString());
          handleFilterChange('maxPrice', values[1].toString());
        }}
        minimumValue={0}
        maximumValue={1000000}
        step={1000}
        thumbTintColor="#6C63FF"
        minimumTrackTintColor="#6C63FF"
        maximumTrackTintColor="#E2E8F0"
      />
    </View>
  );

  const renderContent = () => {
    switch (selectedFilter) {
      case 'Price':
        return (
          <>
            {renderPriceRange()}
            {renderCheckboxGroup('Bedrooms', [1, 2, 3, 4, 5], handleBedroomsChange, 'bedrooms')}
            {renderCheckboxGroup('Bathrooms', [1, 2, 3, 4, 5], handleBathroomsChange, 'bathrooms')}
          </>
        );
      case 'Category':
        return renderCategoryCarousel();
      case 'Location':
        return renderLocationCarousel();
      default:
        return (
          <>
            {renderPriceRange()}
            {renderCheckboxGroup('Bedrooms', [1, 2, 3, 4, 5], handleBedroomsChange, 'bedrooms')}
            {renderCheckboxGroup('Bathrooms', [1, 2, 3, 4, 5], handleBathroomsChange, 'bathrooms')}
            <Text style={styles.sectionTitle}>Location</Text>
            {renderLocationCarousel()}
            <Text style={styles.sectionTitle}>Category</Text>
            {renderCategoryCarousel()}
          </>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderContent()}
      {/* <Button
        mode="contained"
        onPress={() => }
        style={styles.applyButton}
        labelStyle={styles.applyButtonLabel}
      >
        Apply
      </Button> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  formGroup: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    height: 48,
    borderColor: '#CBD5E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2D3748',
  },
  checkboxGroup: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  checkboxGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33.33%',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  checkboxIcon: {
    borderColor: '#A0AEC0',
    borderRadius: 4,
  },
  checkboxLabel: {
    fontWeight: '500',
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  applyButton: {
    margin: 16,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
  },
  applyButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default renderModalContent;