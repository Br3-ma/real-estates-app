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
            <MaterialIcons name="message" size={20} color="#165F56" />
            <Text style={styles.buttonLabel}>SMS</Text>
          </TouchableOpacity>

          {/* Call Button */}
          <TouchableOpacity style={styles.callButton} onPress={() => callNumber(selectedProperty.phone)}>
            <MaterialIcons name="call" size={20} color="#165F56" />
            <Text style={styles.buttonLabel}>Call</Text>
          </TouchableOpacity>

          {/* WhatsApp Button */}
          <TouchableOpacity style={styles.whatsappIcon} onPress={() => openWhatsApp(selectedProperty.phone)}>
            <MaterialCommunityIcons name="whatsapp" size={20} color="#165F56" />
            <Text style={styles.buttonLabel}>WhatsApp</Text>
          </TouchableOpacity>

          {/* Comments Button */}
          <TouchableOpacity style={styles.commentButton} onPress={() => openCommentsModal(selectedProperty.id)}>
            <MaterialCommunityIcons name="chat" size={20} color="#165F56" />
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
    top: Platform.OS === 'ios' ? 44 : 24,
    left: 16,
    zIndex: 10,
    padding: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  topImageContainer: {
    height: height * 0.65, // Slightly larger images
    width: width,
    backgroundColor: '#F0F0F0',
  },
  imageContainer: {
    width: width,
    height: height * 0.65,
    position: 'relative',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#F0F0F0',
  },
  videoCover: {
    width: width,
    height: height * 0.65,
    backgroundColor: '#F0F0F0',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  propertyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  propertyPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 16,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(37, 99, 235, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  propertyDetailsItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  propertyDetailsText: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  featureAmenitiesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginTop: 4,
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureAmenitiesTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featureAmenitiesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureAmenitiesText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  featureAmenitiesLink: {
    color: '#2563EB',
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  smstButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 14,
    minWidth: 75,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  callButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 14,
    minWidth: 75,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  whatsappIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 14,
    minWidth: 75,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  commentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 14,
    minWidth: 75,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonLabel: {
    marginTop: 8,
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 24,
    marginHorizontal: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
};

export default HomeImageViewerModal;
