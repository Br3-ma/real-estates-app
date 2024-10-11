// ImageViewerModal.js
import React from 'react';
import { View, Animated, Linking, Easing, ActivityIndicator, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, Platform, StatusBar, Keyboard, TextInput, ImageBackground, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Icon } from 'react-native-elements';
import { SERVER_BASE_URL } from '../confg/config';

const { width, height } = Dimensions.get('window');

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
        terminateFetchInterval();
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setImageViewVisible(false);
            terminateFetchInterval();
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#8E2DE2" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.topImageContainer}>
            {currentImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <ImageBackground
                  source={{ uri: `${SERVER_BASE_URL}/storage/app/` + image.path }}
                  style={styles.imageBackground}
                >

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
                    <MaterialIcons name="hotel" size={20} color="#8E2DE2" />
                    <Text style={styles.propertyDetailsText}>{selectedProperty.bedrooms} Bedrooms</Text>
                  </View>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="bathtub" size={20} color="#8E2DE2" />
                    <Text style={styles.propertyDetailsText}>{selectedProperty.bathrooms} Bathroom</Text>
                  </View>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="aspect-ratio" size={20} color="#8E2DE2" />
                    <Text style={styles.propertyDetailsText}>{selectedProperty.area} Sqr. foot</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Features & Amenities */}
          <View style={styles.featureAmenitiesContainer}>
            <Text style={styles.featureAmenitiesTitle}>Features & Amenities</Text>
            {selectedProperty && selectedProperty.amenities ? (
              selectedProperty.amenities.map((feature, index) => (
                <View key={index} style={styles.featureAmenitiesItem}>
                  <MaterialIcons name="check" size={20} color="#000" />
                  <Text style={styles.featureAmenitiesText}>{feature.amenity_name}</Text>
                  {/* {feature.link && (
                    <TouchableOpacity onPress={() => openFeatureLink(feature.link)}>
                      <Text style={styles.featureAmenitiesLink}>View More</Text>
                    </TouchableOpacity>
                  )} */}
                </View>
              ))
            ) : (
              <Text>No features available</Text>
            )}
          </View>

          {/* Map Finder */}
          {/* <View style={styles.mapFinderContainer}>
            <Text style={styles.sectionTitle}>Map Finder</Text>
            <ImageBackground
              source={{ uri: 'https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/346/posts/6709/final_image/informativemap_final.jpg' }}
              style={styles.mapImage}
            >
              <Button title="Open Map" style={styles.openMapButton} onPress={() => openMap(selectedProperty.location)} />
            </ImageBackground>
          </View> */}
        </ScrollView>

        {/* View Comments Button */}
        <View style={styles.toggleButton}>
          {/* SMS Button */}
          <TouchableOpacity style={styles.smstButton} onPress={() => sendSMS(selectedProperty.phone)}>
            <MaterialIcons name="message" size={30} color="#165F56" />
            <Text style={styles.buttonLabel}>SMS</Text>
          </TouchableOpacity>

          {/* Call Button */}
          <TouchableOpacity style={styles.callButton} onPress={() => callNumber(selectedProperty.phone)}>
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

const styles = {
  modalContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 15,
    zIndex: 10,
    padding: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  topImageContainer: {
    height: height * 0.55,
    width: width,
  },
  imageContainer: {
    width: width,
    height: height * 0.55,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  videoCover: {
    width: width,
    height: height * 0.55,
  },
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -25,
    padding: 20,
    elevation: 5,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 15,
    textShadowColor: 'rgba(74, 144, 226, 0.3)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 4,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 15,
    lineHeight: 24,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  propertyDetailsItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  propertyDetailsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  featureAmenitiesContainer: {
    backgroundColor: '#F0F4F8',
    padding: 20,
    marginTop: 15,
    borderRadius: 12,
    elevation: 3,
  },
  featureAmenitiesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 10,
    padding: 12,
  },
  featureAmenitiesText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#555555',
  },
  featureAmenitiesLink: {
    color: '#4A90E2',
    marginLeft: 10,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 12,
  },
  smsButton: {
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 12,
  },
  callButton: {
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 12,
  },
  whatsappIcon: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(37, 211, 102, 0.2)',
    borderRadius: 12,
  },
  buttonLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
};


export default HomeImageViewerModal;
