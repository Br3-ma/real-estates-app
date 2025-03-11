import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, ScrollView, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SERVER_BASE_URL } from '../confg/config';

const { width, height } = Dimensions.get('window');

const ProfileBottomSheet = ({ isVisible, onClose, userData }) => {
  // Mock additional profile data that wasn't in the original data
  const profileData = {
    bio: userData?.bio !== "No bio" ? userData?.bio : "Hello, I am using Square.",
    totalListings: userData?.total_active_posts_count ?? 0,
    verifiedSince: new Date(userData?.created_at).toLocaleDateString(),
    responseRate: userData?.response_rate ?? "80%",
    responseTime: "Within 2 hours",
    languages: ["English"],
    contact: {
      phone: userData?.phone ? `+26${userData.phone}` : "Not available",
      email: userData?.email ?? "Not available",
    },
    rating: 4.3,
    reviewCount: 37,
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      propagateSwipe={true}
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        <View style={styles.dragHandle} />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image 
              source={{ 
                uri: userData?.profile_image 
                  ? `${SERVER_BASE_URL}/storage/app/${userData?.picture}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=random`
              }}
              style={styles.profileImage}
            />
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData?.name || 'User Name'}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}>{profileData.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({profileData.reviewCount} reviews)</Text>
              </View>
              <View style={styles.verifiedContainer}>
                <MaterialIcons name="verified" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified Agent</Text>
              </View>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{profileData.bio}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.totalListings}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.responseRate}</Text>
              <Text style={styles.statLabel}>Response Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.responseTime}</Text>
              <Text style={styles.statLabel}>Response Time</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.infoItem}>
              <MaterialIcons name="event" size={18} color="#555" />
              <Text style={styles.infoText}>Verified since {profileData.verifiedSince}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="language" size={18} color="#555" />
              <Text style={styles.infoText}>Speaks {profileData.languages.join(', ')}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={18} color="#555" />
              <Text style={styles.infoText}>{profileData.contact.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={18} color="#555" />
              <Text style={styles.infoText}>{profileData.contact.email}</Text>
            </View>
          </View>
          
          {/* <TouchableOpacity style={styles.viewListingsButton}>
            <Text style={styles.viewListingsText}>View All Listings</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity> */}
        </ScrollView>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => Linking.openURL(`sms:${profileData?.contact.phone}`)} style={styles.messageButton}>
            <MaterialIcons name="message" size={20} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:26${profileData?.contact.phone}`)} style={styles.callButton}>
            <MaterialIcons name="phone" size={20} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.7,
    maxHeight: height * 0.9,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#777',
    marginLeft: 4,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  bioContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  bioText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#DDD',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
  },
  viewListingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  viewListingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  }
});

export default ProfileBottomSheet;