import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterScroll = ({ filters, selectedFilter, onSelectFilter }) => {
  const renderFilterIcon = (filter) => {
    const iconMap = {
      'Price': 'currency-usd',
      'Category': 'tag-outline',
      'Location': 'map-marker-outline',
      'Date': 'calendar-range',
      'Rating': 'star-outline',
      'Amenities': 'home-city-outline',
    };
    return (
      <MaterialCommunityIcons 
        name={iconMap[filter] || 'filter-variant'} 
        size={20} 
        color={selectedFilter === filter ? '#FFFFFF' : '#1A202C'}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilterButton
            ]}
            onPress={() => onSelectFilter(filter)}
          >
            {renderFilterIcon(filter)}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFilterButton: {
    backgroundColor: '#7D7399',
  },
});

export default FilterScroll;