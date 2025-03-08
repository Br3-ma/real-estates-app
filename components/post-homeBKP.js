import React, { useState, useRef } from 'react';
import { View, Animated, Dimensions, Modal, Platform, Text, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { Video } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const overlayAnim = useRef(new Animated.Value(1)).current;

  const toggleOverlay = () => {
    const toValue = isOverlayVisible ? 0 : 1;
    Animated.spring(overlayAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
    setIsOverlayVisible(!isOverlayVisible);
  };

  const translateY = overlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0]
  });

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={isImageViewVisible}
      onRequestClose={() => {
        setImageViewVisible(false);
        terminateFetchInterval();
      }}
    >
      <SafeAreaView style={styles.container}>
        {/* Toggle Overlay Button */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleOverlay}
        >
          <MaterialIcons 
            name={isOverlayVisible ? "keyboard-arrow-down" : "keyboard-arrow-up"} 
            size={28} 
            color="#FFF" 
          />
        </TouchableOpacity>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setImageViewVisible(false);
            terminateFetchInterval();
          }}
        >
          <MaterialIcons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
{/* Full-screen media viewer */}
<ScrollView 
  horizontal 
  pagingEnabled 
  showsHorizontalScrollIndicator={false} 
  style={styles.mediaScroller}
>
  {currentImages.map((image, index) => (
    <ImageBackground
      key={`bg-${index}`}
      source={{ uri: `${SERVER_BASE_URL}/storage/app/${image.path}` }}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <ImageBackground
        source={{ uri: `${SERVER_BASE_URL}/storage/app/${image.path}` }}
        style={styles.mediaItem}
        resizeMode="contain"
      />
    </ImageBackground>
  ))}
  {currentVideos.map((video, index) => (
    <ImageBackground
      key={`bg-video-${index}`}
      source={{ uri: `${SERVER_BASE_URL}/storage/app/${video.path}` }}
      style={styles.backgroundImage}
      blurRadius={10}
    >
      <Video
        key={`video-${index}`}
        source={{ uri: `${SERVER_BASE_URL}/storage/app/${video.path}` }}
        style={styles.mediaItem}
        useNativeControls
        resizeMode="contain"
      />
    </ImageBackground>
  ))}
</ScrollView>


        {/* Animated Content Overlay */}
        <Animated.View 
          style={[
            styles.contentOverlay,
            { transform: [{ translateY }] }
          ]}
        >
          <ScrollView>
            {/* Marketing Banner */}
            <View style={styles.marketingBanner}>
              <MaterialIcons name="local-offer" size={24} color="#FFF" />
              <Text style={styles.marketingText}>Special Offer: Schedule a viewing today!</Text>
            </View>

            <View style={styles.propertyHeader}>
              <Text style={styles.price}>K{selectedProperty?.price}</Text>
              <Text style={styles.title}>{selectedProperty?.title}</Text>
              <Text style={styles.location}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                {selectedProperty?.location}
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="king-bed" size={24} color="#C850C0" />
                <Text style={styles.statValue}>{selectedProperty?.bedrooms}<Text style={styles.statLabel}>Beds</Text></Text>
                
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialIcons name="bathtub" size={24} color="#C850C0" />
                <Text style={styles.statValue}>{selectedProperty?.bathrooms}<Text style={styles.statLabel}>Baths</Text></Text>
                
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialIcons name="square-foot" size={24} color="#C850C0" />
                <Text style={styles.statValue}>{selectedProperty?.area}<Text style={styles.statLabel}>Sq.ft</Text></Text>
                
              </View>
            </View>

            <Text style={styles.description}>{selectedProperty?.description}</Text>

            {/* Featured Highlights */}
            <View style={styles.highlightsContainer}>
              <Text style={styles.sectionTitle}>Property Highlights</Text>
              <View style={styles.highlightsList}>
                <View style={styles.highlightItem}>
                  <MaterialIcons name="verified" size={20} color="#4CAF50" />
                  <Text style={styles.highlightText}>Verified Property</Text>
                </View>
                <View style={styles.highlightItem}>
                  <MaterialIcons name="schedule" size={20} color="#2196F3" />
                  <Text style={styles.highlightText}>Immediate Availability</Text>
                </View>
                <View style={styles.highlightItem}>
                  <MaterialIcons name="security" size={20} color="#FF9800" />
                  <Text style={styles.highlightText}>24/7 Security</Text>
                </View>
              </View>
            </View>

            {selectedProperty?.amenities && (
              <View style={styles.amenitiesContainer}>
                <Text style={styles.sectionTitle}>Features & Amenities</Text>
                <View style={styles.amenitiesGrid}>
                  {selectedProperty.amenities.map((feature, index) => (
                    <View key={index} style={styles.amenityItem}>
                      <MaterialIcons name="check-circle" size={20} color="#8E2DE2" />
                      <Text style={styles.amenityText}>{feature.amenity_name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={() => callNumber(selectedProperty?.phone)}>
              <MaterialIcons name="call" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={() => sendSMS(selectedProperty?.phone)}>
              <MaterialIcons name="message" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={() => openWhatsApp(selectedProperty?.phone)}>
              <MaterialCommunityIcons name="whatsapp" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.commentButton]} onPress={() => openCommentsModal(selectedProperty?.id)}>
              <MaterialCommunityIcons name="comment-text" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  toggleButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
    zIndex: 10,
  },
  backgroundImage: {
    width,
    height: height * 1.0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaItem: {
    width: width * 1.9,  // Slightly smaller than the background
    height: height * 1.65,  // Slightly smaller than the background
    backgroundColor: 'transparent',
  },
  mediaScroller: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.8,
  },
  marketingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E2DE2',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  marketingText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  propertyHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C850C0',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  highlightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  highlightsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#444',
  },
  amenitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 8,
  },
  amenityText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 8,
  },
  relatedContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  relatedScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  relatedItem: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
  },
  relatedImage: {
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C850C0',
    marginBottom: 4,
  },
  relatedLocation: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  messageButton: {
    backgroundColor: '#2196F3',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  commentButton: {
    backgroundColor: '#8E2DE2',
  },
};

export default HomeImageViewerModal;