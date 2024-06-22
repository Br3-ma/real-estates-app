import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import moment from 'moment';
import { SERVER_BASE_URL } from '../confg/config';
import styles from '../assets/css/home.css'; // Ensure to adjust import path as per your project structure

const { width } = Dimensions.get('window');

const PostViewerModal = ({ visible, images, property, onClose }) => {
  const renderImageViewerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
  
          <ScrollView contentContainerStyle={styles.modalContent}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.topImageContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <ImageBackground
                    source={{ uri: `${SERVER_BASE_URL}/storage/app/` + image.path }}
                    style={styles.imageBackground}
                  >
                    {property && (
                      <View style={styles.overlayDetails}>
                        <Text style={styles.overlayText}>{property.title} - K{property.price}</Text>
                        <Text style={styles.overlayTextSmall}>{property.description}</Text>
                        <View style={styles.overlayIconRow}>
                          <MaterialIcons name="bed" size={18} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{property?.beds} Beds</Text>
                          <MaterialIcons name="bathtub" size={18} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{property.baths} Baths</Text>
                          <MaterialIcons name="square-foot" size={18} color="#fff" />
                          <Text style={styles.overlayTextSmall}>{property?.sqft} Sqft</Text>
                        </View>
                      </View>
                    )}
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
  
            <View style={styles.detailsContainer}>
              {property && (
                <>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text style={styles.propertyPrice}>Price: K{property.price}</Text>
                  <Text style={styles.propertyDescription}>{property.description}</Text>
                  <View style={styles.propertyDetailsRow}>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="hotel" size={20} color="#ffeded" />
                      <Text style={styles.propertyDetailsText}>{property.bedrooms} Beds</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="bathtub" size={20} color="#ffeded" />
                      <Text style={styles.propertyDetailsText}>{property.bathrooms} Baths</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="aspect-ratio" size={20} color="#ffeded" />
                      <Text style={styles.propertyDetailsText}>{property.area} sqft</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
  
            {/* Additional Sections */}
            {/* Features & Amenities, Map Finder, Recommended Properties */}
            {/* These sections can be reused as per your requirement */}
  
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return renderImageViewerModal();
};

export default PostViewerModal;
