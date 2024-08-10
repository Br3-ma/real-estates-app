import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Platform, StyleSheet, Linking } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { SERVER_BASE_URL } from '../confg/config';
import Communications from 'react-native-communications';

const { width, height } = Dimensions.get('window');

const PostViewerModal = ({ visible, images, property, onClose, openCommentsModal }) => {

  const sendSMS = (phoneNumber) => {
    Communications.text(phoneNumber, 'Hello, I\'m interested in your property listing.');
    console.log('Sending SMS to:', phoneNumber);
  };

  const callNumber = (phoneNumber) => {
    Communications.phonecall(phoneNumber, true);
    console.log('Calling number:', phoneNumber);
  };

  const openWhatsApp = (phoneNumber) => {
    let msg = 'Hello, I\'m interested in your property listing.';
    let mobile =
      Platform.OS === 'ios' ? phoneNumber : `+${phoneNumber}`;
  
    if (mobile) {
      let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
      Linking.openURL(url)
        .then((data) => {
          console.log('WhatsApp Opened');
        })
        .catch(() => {
          console.log('Make sure WhatsApp installed on your device');
        });
    } else {
      alert('Please insert mobile no');
    }
  
    console.log('Opening WhatsApp for number:', phoneNumber);
  };

  const renderImageViewerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
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
                        <Text style={styles.overlayText}>{property.title}</Text>
                        <Text style={styles.overlayPrice}>K{property.price.toLocaleString()}</Text>
                        <View style={styles.overlayIconRow}>
                          <View style={styles.iconContainer}>
                            <MaterialIcons name="bed" size={18} color="#fff" />
                            <Text style={styles.overlayTextSmall}>{property?.beds}</Text>
                          </View>
                          <View style={styles.iconContainer}>
                            <MaterialIcons name="bathtub" size={18} color="#fff" />
                            <Text style={styles.overlayTextSmall}>{property.baths}</Text>
                          </View>
                          <View style={styles.iconContainer}>
                            <MaterialIcons name="square-foot" size={18} color="#fff" />
                            <Text style={styles.overlayTextSmall}>{property?.sqft}</Text>
                          </View>
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
                  <Text style={styles.propertyPrice}>K{property.price.toLocaleString()}</Text>
                  <Text style={styles.propertyDescription}>{property.description}</Text>
                  <View style={styles.propertyDetailsRow}>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="hotel" size={24} color="#165F56" />
                      <Text style={styles.propertyDetailsText}>{property.bedrooms} Beds</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="bathtub" size={24} color="#165F56" />
                      <Text style={styles.propertyDetailsText}>{property.bathrooms} Baths</Text>
                    </View>
                    <View style={styles.propertyDetailsItem}>
                      <MaterialIcons name="aspect-ratio" size={24} color="#165F56" />
                      <Text style={styles.propertyDetailsText}>{property.area} sqft</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
  
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => sendSMS(property.phone)}>
                <MaterialIcons name="message" size={30} color="#fff" />
                <Text style={styles.buttonLabel}>SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => callNumber(property.phone)}>
                <MaterialIcons name="call" size={30} color="#fff" />
                <Text style={styles.buttonLabel}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => openWhatsApp(property.phone)}>
                <MaterialCommunityIcons name="whatsapp" size={30} color="#fff" />
                <Text style={styles.buttonLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => openCommentsModal(property.id)}>
                <MaterialCommunityIcons name="chat" size={30} color="#fff" />
                <Text style={styles.buttonLabel}>Comments</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return renderImageViewerModal();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalContent: {
    flexGrow: 1,
  },
  topImageContainer: {
    height: height * 0.5,
  },
  imageContainer: {
    width: width,
    height: '100%',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayDetails: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  overlayPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  overlayIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayTextSmall: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  propertyDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  propertyDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  propertyDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyDetailsText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#165F56',
    borderRadius: 10,
    padding: 10,
  },
  buttonLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#fff',
  },
});

export default PostViewerModal;