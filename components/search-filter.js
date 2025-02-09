import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import axios from 'axios';
import { API_BASE_URL } from '../confg/config';

const { height, width } = Dimensions.get('window');

const SearchModal = ({
  isVisible,
  closeModal,
  handleSearch,
  isLoading,
  filterForm,
  handleFilterChange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  propertyType,
  setPropertyType,
  category,
  setCategory,
  numBeds,
  setNumBeds,
  numBaths,
  setNumBaths,
}) => {
  const [location, setLocation] = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const response1 = await axios.get(`${API_BASE_URL}/property-types`);
        const response2 = await axios.get(`${API_BASE_URL}/locations`);
        const fetchedCategories = response.data.data || [];
        const fetchedTypes = response1.data.data || [];
        const fetchedLocations = response2.data.data || [];

        setPropertyTypes(fetchedTypes);
        setCategories(fetchedCategories);
        setLocations(fetchedLocations);
      } catch (err) {
        setError(err);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = () => {
    const searchData = {
      location,
      minPrice,
      maxPrice,
      propertyType,
      category,
      numBeds,
      numBaths,
      filterForm,  
    };
    handleSearch(searchData);
    closeModal(); 
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <ReactNativeModal
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
      style={styles.bottomModal}
    >
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.modalTitle}>Looking For</Text>

          <Text style={styles.label}>Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {locations.map((item) => (
              <TouchableOpacity key={item.id} style={styles.scrollItem} onPress={() => setLocation(item.id)}>
                <Text style={[styles.scrollItemText, location === item.id && styles.selectedItem]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={styles.searchInput}
            placeholder="Min Price"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Max Price"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Property Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {propertyTypes.map((item) => (
              <TouchableOpacity key={item.id} style={styles.scrollItem} onPress={() => setPropertyType(item.id)}>
                <Text style={[styles.scrollItemText, propertyType === item.id && styles.selectedItem]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.formGroup}>
            <Text>Bedrooms</Text>
            <View style={styles.checkboxContainer}>
              {[1, 2, 3, 4, 5].map(num => (
                <BouncyCheckbox
                  key={`bedrooms-${num}`}
                  size={25}
                  fillColor="#C850C0"
                  unfillColor="#FFFFFF"
                  text={`${num}`}
                  iconStyle={{ borderColor: '#FFCC70' }}
                  onPress={(isChecked) => {
                    handleFilterChange(`bedrooms${num}`, isChecked);
                    setNumBeds(isChecked ? num : 0);
                  }}
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
                  fillColor="#C850C0"
                  unfillColor="#FFFFFF"
                  text={`${num}`}
                  iconStyle={{ borderColor: '#FFCC70' }}
                  onPress={(isChecked) => {
                    handleFilterChange(`bathrooms${num}`, isChecked);
                    setNumBaths(isChecked ? num : 0);
                  }}
                  isChecked={filterForm[`bathrooms${num}`] || false}
                  style={styles.checkbox}
                />
              ))}
            </View>
          </View>

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {categories.map((item) => (
              <TouchableOpacity key={item.id} style={styles.scrollItem} onPress={() => setCategory(item.id)}>
                <Text style={[styles.scrollItemText, category === item.id && styles.selectedItem]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onSubmit} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>

          {isLoading && (
            <View style={styles.fullScreenLoading}>
              <ActivityIndicator size="large" color="#C850C0" />
            </View>
          )}
        </ScrollView>
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
    height: height * 0.7,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
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
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  horizontalScroll: {
    width: '100%',
    marginBottom: 20,
  },
  scrollItem: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#C1D5E1',
  },
  scrollItemText: {
    fontSize: 16,
  },
  selectedItem: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  searchButton: {
    width: '100%',
    backgroundColor: '#C850C0',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
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
  formGroup: {
    marginBottom: 20,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  checkbox: {
    width: '20%',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default SearchModal;
