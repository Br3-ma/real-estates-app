import React from 'react';
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SERVER_BASE_URL } from '../confg/config';

const RecommendedProperties = ({ recommendedPropertiesData, showImageViewer }) => {
  return (
    <View style={styles.recommendedPropertiesContainer}>
      <Text style={styles.sectionTitle}>Recommended Properties</Text>
      {recommendedPropertiesData && recommendedPropertiesData.length > 0 ? (
        <FlatList
          data={recommendedPropertiesData}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.recommendedPropertyItem}
              onPress={() => showImageViewer(item.images, item.id, item)}
            >
              <ImageBackground
                source={{ uri: item.images[0]?.path ? `${SERVER_BASE_URL}/storage/app/${item.images[0].path}` : 'https://bearhomes.com/wp-content/uploads/2019/01/default-featured.png' }}
                style={styles.recommendedPropertyImage}
              >
                <Text style={styles.recommendedPropertyTitle}>{item.title}</Text>
                {/* Show count total images */}
                <Text style={styles.imageCount}>+{item.images.length}</Text>
              </ImageBackground>
              <Text style={styles.recommendedPropertyPrice}>K{item.price}</Text>
              <Text style={styles.recommendedPropertyDescription}>{item.location}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No recommended properties available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recommendedPropertiesContainer: {
    marginTop: 5,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendedPropertyItem: {
    marginRight: 10,
  },
  recommendedPropertyImage: {
    width: 200,
    height: 190,
    justifyContent: 'flex-end',
    borderRadius: 10,
    padding: 10,
  },
  recommendedPropertyTitle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  imageCount: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  recommendedPropertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendedPropertyDescription: {
    fontSize: 14,
    color: 'gray',
  },
});

export default RecommendedProperties;
