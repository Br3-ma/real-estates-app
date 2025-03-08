import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity,Alert, ImageBackground, Dimensions, Platform, StyleSheet, Linking, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePropertyActions } from '../tools/api/PropertyActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchUserInfo } from '../controllers/auth/userController';
import moment from 'moment';
import { SERVER_BASE_URL, API_BASE_URL } from '../confg/config';
import Communications from 'react-native-communications';
import LongRectangleAd from './ads-long';
import BidWizardModal from './bidwiz-modal'; 
import Toast from 'react-native-toast-message';
import axios from 'axios';
import StatusFlag from './status-flag';
import InlineAd from './InlineBannerAd';

const { width, height } = Dimensions.get('window');

const PostViewerModal = ({ visible, images, property, onClose, openCommentsModal, allProperties, openPostDetails, fetchProperties = null }) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null); 
  const [loading, setLoading] = useState(false);
  const [isBidModalVisible, setBidModalVisible] = useState(false); 
  const [bidPropertyId, setBidPropertyId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserInfo();
        setUserInfo(user);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const { hideFromPosts, bidForTopPosts } = usePropertyActions(fetchProperties);

  useEffect(() => {
    // Log userInfo after it’s been set
    if (userInfo !== null) {
      console.log('Updated userInfo:', userInfo);
    }
  }, [userInfo]);

  const sendSMS = (phoneNumber) => {
    Communications.text(phoneNumber, 'Hello, I\'m interested in your property listing.');
  };

  const callNumber = (phoneNumber) => {
    Communications.phonecall(phoneNumber, true);
  };

  const openWhatsApp = (phoneNumber) => {
    let msg = 'Hello, I\'m interested in your property listing.';
    let mobile = Platform.OS === 'ios' ? phoneNumber : `+${phoneNumber}`;
    
    if (mobile) {
      let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
      Linking.openURL(url)
        .then(() => console.log('WhatsApp Opened'))
        .catch(() => console.log('Make sure WhatsApp is installed on your device'));
    } else {
      alert('Please insert mobile no');
    }
  };
  
  const handleShowDetails = useCallback(async (images, property) => {
    setLoading(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }

    setTimeout(() => {
      openPostDetails(images, property);
      setLoading(false); 
    }, 500); 
  }, [openPostDetails]);

  const handleBoostProperty = useCallback((itemId) => {
    console.log('Boosting...');
    console.log(itemId);
    setBidPropertyId(itemId);
    setBidModalVisible(true);
  }, []);

  const handleVisibilityProperty = useCallback((itemId) => {
  }, []);

  // CRUDS
  const handleDeleteProperty = useCallback(async (propertyId) => {
      console.log('I am here');
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this property?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: async () => {
              // setDeleting(true);
              try {
                await axios.delete(`${API_BASE_URL}/delete-post/${propertyId}`);
                Alert.alert("Deleted");
                fetchProperties(); 
              } catch (error) {
                console.error('Failed to delete property:', error);
                Alert.alert("Failed");
              } finally {
                // setDeleting(false);
                onClose
              }
            },
            style: "destructive"
          }
        ],
        { cancelable: true }
      );
  }, []);

  const renderImageViewerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="arrow-back" size={24} color="#e0e0e0" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Property Info</Text>
            <View style={styles.adminActions}>
              {/* <TouchableOpacity
                style={[styles.adminButton, styles.boostButton]} 
                onPress={()=>handleBoostProperty(property?.id)}
              >
                <MaterialIcons name="trending-up" size={16} color="#fff" />
                <Text style={styles.adminButtonText}>Boost</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButton, property?.hidden ? styles.showButton : styles.hideButton]} 
                onPress={()=>hideFromPosts(property?.id)}
              >
                <MaterialIcons 
                  name={property?.hidden ? "visibility" : "visibility-off"} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.adminButtonText}>
                  {property?.hidden ? 'Show' : 'Hide'}
                </Text>
              </TouchableOpacity> */}
              {userInfo && property && userInfo.id === property.user_id && (
                <TouchableOpacity 
                  style={[styles.adminButton, styles.deleteButton]} 
                  onPress={() => handleDeleteProperty(property.id)}
                >
                  <MaterialIcons name="delete-outline" size={16} color="#fff" />
                  <Text style={styles.adminButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <StatusFlag status={property?.verified_status} />

            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            ref={scrollViewRef} 
          >
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageSlider}>
              {images.map((image, index) => (
                <ImageBackground
                  key={index}
                  source={{ uri: `${SERVER_BASE_URL}/storage/app/` + image.path }}
                  style={styles.imageBackground}
                >
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageCount}>{`${index + 1}/${images.length}`}</Text>
                  </View>
                </ImageBackground>
              ))}
            </ScrollView>

            {property && (
              <View style={styles.contentContainer}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertyPrice}>K{property.price.toLocaleString()}</Text>
                
                <View style={styles.propertyDetailsRow}>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="hotel" size={20} color="#165F56" />
                    <Text style={styles.propertyDetailsText}>{property.bedrooms} Bedrooms</Text>
                  </View>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="bathtub" size={20} color="#165F56" />
                    <Text style={styles.propertyDetailsText}>{property.bathrooms} Bathrooms</Text>
                  </View>
                  <View style={styles.propertyDetailsItem}>
                    <MaterialIcons name="aspect-ratio" size={20} color="#165F56" />
                    <Text style={styles.propertyDetailsText}>{property.area} sqr. foot</Text>
                  </View>
                </View>

                <Text style={styles.propertyDescription}>{property.description}</Text>

                <View style={styles.amenitiesContainer}>
                  <Text style={styles.sectionTitle}>Features & Amenities</Text>
                  <View style={styles.amenitiesList}>
                    {property.amenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityItem}>
                        <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                        <Text style={styles.amenityText}>{amenity.amenity_name}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* replace this and put an  */}
                {/* <LongRectangleAd/> */}
                <InlineAd/>
                <View style={styles.relatedPropertiesContainer}>
                  <Text style={styles.sectionTitle}>You might also like this</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {allProperties.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.relatedPropertyItem}
                        onPress={() => handleShowDetails(item.images, item)} 
                      >
                        <Image
                          source={{ uri: item.images.length > 0 ? `${SERVER_BASE_URL}/storage/app/` + item.images[0].path : `${SERVER_BASE_URL}/storage/app/no-img.png` }}
                          style={styles.relatedPropertyImage}
                        />
                        <Text style={styles.relatedPropertyTitle}>
                          {item.name || item.title} {/* Adjust property name accordingly */}
                        </Text>
                        <Text style={styles.relatedPropertyPrice}>
                          K{item.price}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </ScrollView>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => sendSMS(property.phone)}>
              <MaterialIcons name="message" size={20} color="#fff" />
              <Text style={styles.buttonLabel}>SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => callNumber(property.phone)}>
              <MaterialIcons name="call" size={20} color="#fff" />
              <Text style={styles.buttonLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => openWhatsApp(property.phone)}>
              <MaterialCommunityIcons name="whatsapp" size={20} color="#fff" />
              <Text style={styles.buttonLabel}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => openCommentsModal(property.id)}>
              <MaterialCommunityIcons name="chat" size={20} color="#fff" />
              <Text style={styles.buttonLabel}>Comments</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
        <BidWizardModal 
            visible={isBidModalVisible} 
            onDismiss={() => setBidModalVisible(false)} 
            property={bidPropertyId}  
          />
      </Modal>
    );
  };

  return renderImageViewerModal();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#e0e0e0',
  // },
  // headerTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 15,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 8,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  boostButton: {
    backgroundColor: '#4CAF50',
  },
  hideButton: {
    backgroundColor: '#FFA000',
  },
  showButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  closeButton: {
    marginRight: 15,
  },
  modalContent: {
    flexGrow: 1,
  },
  imageSlider: {
    height: height * 0.4,
  },
  imageBackground: {
    width: width,
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  imageCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C850C0',
    marginBottom: 15,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  locationText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  amenityText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  promoContainer: {
    marginBottom: 20,
  },
  promoBox: {
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 10,
  },
  promoText: {
    fontSize: 14,
    color: '#333',
  },
  relatedPropertiesContainer: {
    marginBottom: 20,
  },
  relatedPropertyItem: {
    width: 150,
    marginRight: 15,
  },
  relatedPropertyImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  relatedPropertyTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  relatedPropertyPrice: {
    fontSize: 12,
    color: '#FFCC70',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#8E2DE2',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
  },
  buttonLabel: {
    fontSize: 12,
    color: '#fff',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default PostViewerModal;
