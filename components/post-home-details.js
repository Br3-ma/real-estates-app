import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Dimensions, 
  Modal, 
  Platform, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Image,
  StatusBar,
  FlatList
} from 'react-native';
import { Video } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SERVER_BASE_URL } from '../confg/config';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const allMedia = [...currentImages, ...currentVideos];
  const [fontsLoaded] = useFonts({
    'Montserrat-Thin': require('../assets/fonts/Montserrat-Thin.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  useEffect(() => {
    console.log(fontsLoaded ? 'FONT LOADED' : 'FONT NOT LOADED');
  }, [fontsLoaded]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentMediaIndex(newIndex);
  };

  const goToMedia = (index) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentMediaIndex(index);
  };

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
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* Media Gallery */}
          <View style={styles.mediaContainer}>
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
              ref={scrollViewRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false} 
              style={styles.mediaScroller}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {currentImages.map((image, index) => (
                <Image
                  key={`image-${index}`}
                  source={{ uri: `${SERVER_BASE_URL}/storage/app/${image.path}` }}
                  style={styles.mediaItem}
                  resizeMode="cover"
                />
              ))}
              {currentVideos.map((video, index) => (
                <Video
                  key={`video-${index}`}
                  source={{ uri: `${SERVER_BASE_URL}/storage/app/${video.path}` }}
                  style={styles.mediaItem}
                  useNativeControls
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Media Gallery Indicators */}
            <View style={styles.mediaIndicatorsContainer}>
              {allMedia.map((_, index) => (
                <TouchableOpacity 
                  key={`indicator-${index}`} 
                  style={[
                    styles.mediaIndicator, 
                    currentMediaIndex === index && styles.mediaIndicatorActive
                  ]}
                  onPress={() => goToMedia(index)}
                />
              ))}
            </View>

            {/* Media overlay gradient */}
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.3)']}
              style={styles.mediaGradient}
              locations={[0, 0.25, 0.7, 1]}
            />
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            {/* Header with Price and Location */}
            <View style={styles.propertyHeader}>
              <Text style={styles.price}>K{selectedProperty?.price}</Text>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{selectedProperty?.title}</Text>
                <TouchableOpacity 
                  style={styles.mapButton}
                  onPress={() => openMap && openMap(selectedProperty)}
                >
                  <MaterialIcons name="map" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={18} color="#666" />
                <Text style={styles.location}>{selectedProperty?.location}</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="king-bed" size={26} color="#C850C0" />
                <Text style={styles.statValue}>{selectedProperty?.bedrooms}</Text>
                <Text style={styles.statLabel}>Bedrooms</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialIcons name="bathtub" size={26} color="#C850C0" />
                <Text style={styles.statValue}>{selectedProperty?.bathrooms}</Text>
                <Text style={styles.statLabel}>Bathrooms</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialIcons name="square-foot" size={26} color="#C850C0" />
                <Text style={styles.statValue}>{selectedProperty?.area}</Text>
                <Text style={styles.statLabel}>Sq.ft</Text>
              </View>
            </View>

            {/* Marketing Banner */}
            <View style={styles.marketingBanner}>
              <MaterialIcons name="local-offer" size={24} color="#FFF" />
              <Text style={styles.marketingText}>Special Offer: Schedule a viewing today!</Text>
            </View>

            {/* Featured Highlights */}
            <View style={styles.highlightsContainer}>
              <Text style={styles.sectionTitle}>Property Highlights</Text>
              <FlatList
                data={[
                  { icon: "verified", color: "#4CAF50", text: "Verified Property" },
                  { icon: "schedule", color: "#2196F3", text: "Immediate Availability" },
                  { icon: "security", color: "#FF9800", text: "24/7 Security" }
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.highlightCard}>
                    <MaterialIcons name={item.icon} size={32} color={item.color} />
                    <Text style={styles.highlightText}>{item.text}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => `highlight-${index}`}
                contentContainerStyle={styles.highlightsList}
              />
            </View>

            {/* About Section */}
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About This Property</Text>
              <Text style={styles.description}>{selectedProperty?.description}</Text>
            </View>

            {/* Features & Amenities */}
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
            
            {/* Agent Contact Card */}
            {/* <View style={styles.agentCard}>
              <View style={styles.agentHeader}>
                <Text style={styles.agentTitle}>Property Agent</Text>
                <TouchableOpacity style={styles.agentProfileButton}>
                  <Text style={styles.agentProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.agentInfo}>
                <View style={styles.agentAvatar}>
                  <MaterialIcons name="person" size={30} color="#8E2DE2" />
                </View>
                <View style={styles.agentDetails}>
                  <Text style={styles.agentName}>Agent Name</Text>
                  <Text style={styles.agentCompany}>Real Estate Company</Text>
                  <Text style={styles.agentPhone}>{selectedProperty?.phone}</Text>
                </View>
              </View>
            </View> */}
            
            {/* Bottom space for action buttons */}
            <View style={{ height: 80 }} />
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryActionButton} 
            onPress={() => callNumber(selectedProperty?.phone)}
          >
            <MaterialIcons name="call" size={20} color="#FFF" />
            <Text style={styles.primaryActionText}>Call</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActionsContainer}>
            <TouchableOpacity 
              style={[styles.secondaryActionButton, { backgroundColor: '#2196F3' }]} 
              onPress={() => sendSMS(selectedProperty?.phone)}
            >
              <MaterialIcons name="message" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryActionButton, { backgroundColor: '#25D366' }]} 
              onPress={() => openWhatsApp(selectedProperty?.phone)}
            >
              <MaterialCommunityIcons name="whatsapp" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryActionButton, { backgroundColor: '#8E2DE2' }]} 
              onPress={() => openCommentsModal(selectedProperty?.id)}
            >
              <MaterialCommunityIcons name="comment-text" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    fontFamily: 'Montserrat-Bold',
  },
  mediaContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 10,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 30,
    zIndex: 10,
  },
  mediaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  mediaScroller: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaItem: {
    width,
    height: height * 0.6,
    backgroundColor: '#000',
  },
  mediaIndicatorsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 5,
  },
  mediaIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  mediaIndicatorActive: {
    backgroundColor: '#FFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -10,
    paddingTop: 20,
    zIndex: 2,
  },
  propertyHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C850C0',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  mapButton: {
    backgroundColor: '#8E2DE2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  marketingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E2DE2',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#8E2DE2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  marketingText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  highlightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  highlightsList: {
    paddingVertical: 5,
  },
  highlightCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    width: 130,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  highlightText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
    color: '#444',
  },
  aboutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  amenitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
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
  agentCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  agentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  agentProfileButton: {
    backgroundColor: 'rgba(142, 45, 226, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  agentProfileText: {
    color: '#8E2DE2',
    fontSize: 12,
    fontWeight: '600',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(142, 45, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  agentCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  agentPhone: {
    fontSize: 14,
    color: '#8E2DE2',
    fontWeight: '500',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  primaryActionButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryActionText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
  },
  secondaryActionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

export default HomeImageViewerModal;