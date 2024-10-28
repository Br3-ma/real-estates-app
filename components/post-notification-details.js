import React, { useRef, useState, useCallback } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Platform, StyleSheet, Linking, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { SERVER_BASE_URL } from '../confg/config';
import Communications from 'react-native-communications';

const { width, height } = Dimensions.get('window');

const PostNotifyViewerModal = ({ visible, property, onClose, openCommentsModal }) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  console.log('Your property is:');
  console.log(property);
//   const renderImageViewerModal = () => {
//     return (
//       <Modal
//         animationType="slide"
//         transparent={false}
//         visible={visible}
//         onRequestClose={onClose}
//       >
//         <SafeAreaView style={styles.container}>
//           <View style={styles.header}>
//             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//               <MaterialIcons name="arrow-back" size={24} color="#8E2DE2" />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>Property Details</Text>
//           </View>

//           <ScrollView
//             contentContainerStyle={styles.modalContent}
//             ref={scrollViewRef} 
//           >
//             <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageSlider}>
//               {property.images.map((image, index) => (
//                 <ImageBackground
//                   key={index}
//                   source={{ uri: `${SERVER_BASE_URL}/storage/app/` + image.path }}
//                   style={styles.imageBackground}
//                 >
//                   <View style={styles.imageOverlay}>
//                     <Text style={styles.imageCount}>{`${index + 1}/${property.images.length}`}</Text>
//                   </View>
//                 </ImageBackground>
//               ))}
//             </ScrollView>

//             {property && (
//               <View style={styles.contentContainer}>
//                 <Text style={styles.propertyTitle}>{property.title}</Text>
//                 <Text style={styles.propertyPrice}>K{property.price.toLocaleString()}</Text>
                
//                 <View style={styles.propertyDetailsRow}>
//                   <View style={styles.propertyDetailsItem}>
//                     <MaterialIcons name="hotel" size={20} color="#165F56" />
//                     <Text style={styles.propertyDetailsText}>{property.bedrooms} Bedrooms</Text>
//                   </View>
//                   <View style={styles.propertyDetailsItem}>
//                     <MaterialIcons name="bathtub" size={20} color="#165F56" />
//                     <Text style={styles.propertyDetailsText}>{property.bathrooms} Bathrooms</Text>
//                   </View>
//                   <View style={styles.propertyDetailsItem}>
//                     <MaterialIcons name="aspect-ratio" size={20} color="#165F56" />
//                     <Text style={styles.propertyDetailsText}>{property.area} sqr. foot</Text>
//                   </View>
//                 </View>

//                 <Text style={styles.propertyDescription}>{property.description}</Text>

//                 <View style={styles.amenitiesContainer}>
//                   <Text style={styles.sectionTitle}>Amenities</Text>
//                   <View style={styles.amenitiesList}>
//                     {property.amenities.map((amenity, index) => (
//                       <View key={index} style={styles.amenityItem}>
//                         <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
//                         <Text style={styles.amenityText}>{amenity.amenity_name}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>

//                 <View style={styles.promoContainer}>
//                   <Text style={styles.sectionTitle}>Special Offer</Text>
//                   <View style={styles.promoBox}>
//                     <Text style={styles.promoText}>Get 5% off if you book within the next 24 hours!</Text>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </ScrollView>

//           {loading && (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//           )}

//           <View style={styles.actionButtons}>
//             <TouchableOpacity style={styles.actionButton} onPress={() => openCommentsModal(property.id)}>
//               <MaterialCommunityIcons name="chat" size={20} color="#fff" />
//               <Text style={styles.buttonLabel}>Comments</Text>
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </Modal>
//     );
//   };

//   return renderImageViewerModal();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#4CAF50',
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
    color: '#4CAF50',
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
    backgroundColor: '#165F56',
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

export default PostNotifyViewerModal;
