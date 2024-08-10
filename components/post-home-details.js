// ImageViewerModal.js
import React from 'react';
import { View, Animated, Linking, Easing, ActivityIndicator, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Icon } from 'react-native-elements';
import { SERVER_BASE_URL } from '../confg/config';
import styles from '../assets/css/home-post-details.css';

const { width } = Dimensions.get('window');
const HomeImageViewerModal = ({
  isImageViewVisible,
  setImageViewVisible,
  currentImages,
  currentVideos,
  selectedProperty,
  terminateFetchInterval,
  openFeatureLink,
  openMap,
  sendSMS,
  callNumber,
  openWhatsApp,
  openCommentsModal
}) => {

return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isImageViewVisible}
      onRequestClose={() => {
        setImageViewVisible(false);
        setSelectedProperty(null);
        terminateFetchInterval();
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setImageViewVisible(false);
            setSelectedProperty(null);
            terminateFetchInterval();
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.topImageContainer}>
            {currentImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <ImageBackground
                  source={{ uri: `${SERVER_BASE_URL}/storage/app/` + image.path }}
                  style={styles.imageBackground}
                >
                  {selectedProperty && (
                    <View style={styles.overlayDetails}>
                      <Text style={styles.overlayText}>{selectedProperty.title} - K{selectedProperty.price}</Text>
                      <View style={styles.overlayIconRow}>
                        <Icon name="bed" type="material" size={18} color="#fff" />
                        <Text style={styles.overlayTextSmall}>{selectedProperty?.beds} Bedroom(s)</Text>
                        <Icon name="bathtub" type="material" size={18} color="#fff" />
                        <Text style={styles.overlayTextSmall}>{selectedProperty.baths} Bathroom(s)</Text>
                        <Icon name="square-foot" type="material" size={18} color="#fff" />
                        <Text style={styles.overlayTextSmall}>{selectedProperty.sqft} Square foot</Text>
                      </View>
                    </View>
                  )}
                </ImageBackground>
              </View>
            ))}
            {currentVideos.map((video, index) => (
              <Video
                key={index}
                source={{ uri: `${SERVER_BASE_URL}/storage/app/` + video.path }}
                style={styles.videoCover}
                useNativeControls
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={styles.detailsContainer}>
            {selectedProperty && (
              <>
                <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                <Text style={styles.propertyPrice}>Price: K{selectedProperty.price}</Text>
                <Text style={styles.propertyDescription}>{selectedProperty.description}</Text>
                <Text style={styles.propertyDescription}>{selectedProperty.location}</Text>
                <View style={styles.propertyDetailsRow}>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="hotel" size={20} color="#ffeded" />
                    <Text style={styles.propertyDetailsText}>{selectedProperty.bedrooms} Bedrooms</Text>
                  </View>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="bathtub" size={20} color="#ffeded" />
                    <Text style={styles.propertyDetailsText}>{selectedProperty.bathrooms} Bathroom</Text>
                  </View>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="aspect-ratio" size={20} color="#ffeded" />
                    <Text style={styles.propertyDetailsText}>{selectedProperty.area} Square foot</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Features & Amenities */}
          <View style={styles.featureAmenitiesContainer}>
            <Text style={styles.featureAmenitiesTitle}>Features & Amenities</Text>
            {selectedProperty && selectedProperty.features ? (
              selectedProperty.features.map((feature, index) => (
                <View key={index} style={styles.featureAmenitiesItem}>
                  <MaterialIcons name="check" size={20} color="#000" />
                  <Text style={styles.featureAmenitiesText}>{feature.name}</Text>
                  {feature.link && (
                    <TouchableOpacity onPress={() => openFeatureLink(feature.link)}>
                      <Text style={styles.featureAmenitiesLink}>View More</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <Text>No features available</Text>
            )}
          </View>

          {/* Map Finder */}
          <View style={styles.mapFinderContainer}>
            <Text style={styles.sectionTitle}>Map Finder</Text>
            <ImageBackground
              source={{ uri: 'https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/346/posts/6709/final_image/informativemap_final.jpg' }}
              style={styles.mapImage}
            >
              <Button title="Open Map" style={styles.openMapButton} onPress={() => openMap(selectedProperty.location)} />
            </ImageBackground>
          </View>
        </ScrollView>

        {/* View Comments Button */}
        <View style={styles.toggleButton}>
          {/* SMS Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => sendSMS(selectedProperty.phone)}>
            <MaterialIcons name="message" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>SMS</Text>
          </TouchableOpacity>

          {/* Call Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => callNumber(selectedProperty.phone)}>
            <MaterialIcons name="call" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>Call</Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity style={styles.whatsappIcon} onPress={() => openWhatsApp(selectedProperty.phone)}>
            <MaterialCommunityIcons name="whatsapp" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>WhatsApp</Text>
          </TouchableOpacity>

          {/* Comments Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => openCommentsModal(selectedProperty.id)}>
            <MaterialCommunityIcons name="chat" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>Comments</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default HomeImageViewerModal;
