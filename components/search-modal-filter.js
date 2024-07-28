// ModalContent.js
import React from 'react';
import { View, Platform, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Image, RefreshControl } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 10;

const renderModalContent = ({ 
  selectedFilter, 
  filterForm, 
  handleFilterChange, 
  handleBedroomsChange, 
  handleBathroomsChange, 
  renderCategoryCarousel, 
  renderLocationCarousel 
}) => {
  switch (selectedFilter) {
    case 'Price':
      return (
        <>
          <View style={styles.formGroup}>
            <Text>Price Range</Text>
            <TextInput
              style={styles.input}
              placeholder="Min Price"
              value={filterForm.minPrice}
              onChangeText={(text) => handleFilterChange('minPrice', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Max Price"
              value={filterForm.maxPrice}
              onChangeText={(text) => handleFilterChange('maxPrice', text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text>Bedrooms</Text>
            <View style={styles.checkboxContainer}>
              {[1, 2, 3, 4, 5].map(num => (
                <BouncyCheckbox
                  key={`bedrooms-${num}`}
                  size={25}
                  fillColor="#4a90e2"
                  unfillColor="#FFFFFF"
                  text={`${num}`}
                  iconStyle={{ borderColor: '#4a90e2' }}
                  onPress={(isChecked) => handleBedroomsChange(num, isChecked)}
                  isChecked={filterForm[`bedrooms${num}`] || false}
                  style={styles.checkbox}
                />
              ))}
            </View>
            <Text>Bathrooms</Text>
            <View style={styles.checkboxContainer}>
              {[1, 2, 3, 4, 5].map(num => (
                <BouncyCheckbox
                  key={`bathrooms-${num}`}
                  size={25}
                  fillColor="#4a90e2"
                  unfillColor="#FFFFFF"
                  text={`${num}`}
                  iconStyle={{ borderColor: '#4a90e2' }}
                  onPress={(isChecked) => handleBathroomsChange(num, isChecked)}
                  isChecked={filterForm[`bathrooms${num}`] || false}
                  style={styles.checkbox}
                />
              ))}
            </View>
          </View>
        </>
      );
    case 'Category':
      return renderCategoryCarousel();
    case 'Location':
      return renderLocationCarousel();
    default:
      return (
        <>
          <View style={styles.formGroup}>
            <Text>Price Range</Text>
            <TextInput
              style={styles.input}
              placeholder="Min Price"
              value={filterForm.minPrice}
              onChangeText={(text) => handleFilterChange('minPrice', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Max Price"
              value={filterForm.maxPrice}
              onChangeText={(text) => handleFilterChange('maxPrice', text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text>Bedrooms</Text>
            <View style={styles.checkboxContainer}>
              {[1, 2, 3, 4, 5].map(num => (
                <BouncyCheckbox
                key={`bedrooms-${num}`}
                size={25}
                fillColor="#4a90e2"
                unfillColor="#FFFFFF"
                text={`${num}`}
                iconStyle={{ borderColor: '#4a90e2' }}
                onPress={(isChecked) => handleBedroomsChange(num, isChecked)}
                isChecked={filterForm[`bedrooms${num}`] || false}
                style={styles.checkbox}
              />
              ))}
            </View>
            <Text>Bathrooms</Text>
            <View style={styles.checkboxContainer}>
              {[1, 2, 3, 4, 5].map(num => (
                <BouncyCheckbox
                key={`bathrooms-${num}`}
                size={25}
                fillColor="#4a90e2"
                unfillColor="#FFFFFF"
                text={`${num}`}
                iconStyle={{ borderColor: '#4a90e2' }}
                onPress={(isChecked) => handleBathroomsChange(num, isChecked)}
                isChecked={filterForm[`bathrooms${num}`] || false}
                style={styles.checkbox}
              />
              ))}
            </View>
          </View>
          <Text>Location</Text>
          {renderLocationCarousel()}
          {renderCategoryCarousel()}
        </>
      );
  }
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F4F8',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    headerText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A202C',
      marginLeft: 10,
      letterSpacing: 0.5,
    },
    carousel: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
    },
    categoryButton: {
      marginHorizontal: 8,
      borderRadius: 24,
      padding: 2,
      borderWidth: 2,
      borderColor: '#4299E1',
      backgroundColor: '#EBF8FF',
    },
    selectedCategory: {
      backgroundColor: '#4299E1',
    },
    buttonLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: '#4299E1',
    },
    selectedCategoryLabel: {
      color: '#FFFFFF',
    },
    locationButton: {
      marginHorizontal: 8,
      borderRadius: 24,
      padding: 2,
      borderWidth: 2,
      borderColor: '#48BB78',
      backgroundColor: '#F0FFF4',
    },
    selectedLocation: {
      backgroundColor: '#48BB78',
    },
    selectedLocationLabel: {
      color: '#FFFFFF',
    },
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 28,
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    modalTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#1A202C',
      marginBottom: 20,
      letterSpacing: 0.5,
    },
    formGroup: {
      marginBottom: 24,
      width: '100%',
    },
    input: {
      height: 52,
      borderColor: '#CBD5E0',
      borderWidth: 2,
      borderRadius: 12,
      paddingHorizontal: 18,
      marginVertical: 10,
      backgroundColor: '#FFFFFF',
      fontSize: 16,
      color: '#2D3748',
    },
    checkboxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      marginTop: 8,
    },
    checkbox: {
      marginHorizontal: 10,
      marginVertical: 6,
    },
    card: {
      marginHorizontal: 2,
      marginVertical: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    cardSubtitle: {
      fontSize: 16,
      color: '#27ae60',
      fontWeight: '600',
    },
    bedBathContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: 14,
    },
    bedBathIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      backgroundColor: '#EDF2F7',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    bedBathIcon: {
      marginRight: 8,
      color: '#4A5568',
    },
    imageContainer: {
      marginTop: 16,
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: height * 0.25,
      borderRadius: 12,
    },
    video: {
      width: '100%',
      height: height * 0.25,
      borderRadius: 12,
    },
    imageCount: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 'bold',
      overflow: 'hidden',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: '#FFFFFF',
    },
    placeholderImage: {
      width: width * 0.4,
      height: width * 0.4,
      marginBottom: 28,
      opacity: 0.7,
    },
    emptyText: {
      fontSize: 20,
      color: '#4A5568',
      marginBottom: 20,
      textAlign: 'center',
      lineHeight: 28,
    },
    listContainer: {
      paddingBottom: 140,
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    // New styles
    labelText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4A5568',
      marginBottom: 8,
    },
    priceRangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    priceText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4299E1',
    },
    slider: {
      width: '100%',
      height: 40,
    },
    chipButton: {
      backgroundColor: '#EDF2F7',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    chipButtonSelected: {
      backgroundColor: '#4299E1',
    },
    chipButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4A5568',
    },
    chipButtonTextSelected: {
      color: '#FFFFFF',
    },
  });

export default renderModalContent;
