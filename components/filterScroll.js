import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterScroll = ({ filters, selectedFilter, onSelectFilter }) => {
  return (
    <View style={styles.container}>
      {/* Badge for Filters */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Filters</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {filters.map((filter) => (
          <View key={filter} style={styles.filterItem}>
            <IconButton
              icon={() => {
                switch (filter) {
                  case 'Price':
                    return <MaterialCommunityIcons name="currency-usd" size={20} color="black" />;
                  case 'Category':
                    return <MaterialCommunityIcons name="tag-outline" size={20} color="black" />;
                  case 'Location':
                    return <MaterialCommunityIcons name="map-marker-outline" size={20} color="black" />;
                  default:
                    return <MaterialCommunityIcons name="filter" size={20} color="black" />;
                }
              }}
              style={[styles.filterButton, { backgroundColor: selectedFilter === filter ? '#7D7399' : '#fff' }]}
              onPress={() => onSelectFilter(filter)}
              size={35} // Increased size for IconButton
              color={selectedFilter === filter ? '#fff' : 'black'}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Ensure items are placed in a row
    alignItems: 'center', // Align items vertically centered
    backgroundColor:'transparent'
  },
  filterScroll: {
    marginLeft: 5, // Adjust spacing from the badge
    paddingVertical: 4,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent background
    borderRadius: 10,
    overflow: 'hidden', // Ensure children are clipped
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  filterButton: {
    borderRadius: 20, // Make the IconButton rounded
    padding: 10, // Adjust padding for IconButton
  },
  badge: {
    backgroundColor: '#7D7399',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginLeft: 10, // Add margin to separate badge from IconButton
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FilterScroll;
