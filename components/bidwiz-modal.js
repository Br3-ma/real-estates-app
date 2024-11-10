import React, { useState, useEffect } from 'react';
import { View, Text, Linking, TouchableOpacity, SafeAreaView, StyleSheet, Image, ActivityIndicator, FlatList, Dimensions, StatusBar } from 'react-native';
import { Modal, Portal, ProgressBar, IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../confg/config';
import { BlurView } from 'expo-blur';
import PaymentBottomSheet from './payments-modal';
import { fetchUserInfo } from '../controllers/auth/userController';

const { width, height } = Dimensions.get('window');

const BidWizardModal = ({ visible, onDismiss, property }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ propertyId: property });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPaymentSheetVisible, setIsPaymentSheetVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bidPackages, setBidPackages] = useState([]);
  
  useEffect(() => {
    fetchUserInfo()
      .then((userInfo) => {
        setUser(userInfo); // Set the user state
        setFormData({ propertyId: property, userId: userInfo.id }); // Update formData to include userId
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch user information.'
        });
      });
  }, [property]);
  
  useEffect(() => {
    const fetchBidPackages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bid-packages`);
        setBidPackages(response.data);
      } catch (error) {
        console.error('Error fetching bid packages:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load bid packages.'
        });
      }
    };

    fetchBidPackages();
  }, []);
  const steps = [
    { 
      title: 'Boost Your Property',
      subtitle: 'Get more visibility for your listing',
      image: require('../assets/icon/boost.webp')
    },
    {
      title: 'Select Your Boost Plan',
      subtitle: 'Choose the perfect promotion duration',
      image: ''
    },
    {
      title: 'Review Details',
      subtitle: 'Confirm your selection',
      image: ''
    },
    {
      title: 'Complete Payment',
      subtitle: 'Secure payment process',
      image: require('../assets/icon/payment.jpg')
    },
  ];

  const handleNext = async () => {
    if (step === 1 && !selectedPackage) {
      Toast.show({
        type: 'error',
        text1: 'Package Required',
        text2: 'Please select a package to continue'
      });
      return;
    }

    if (step < steps.length - 1) {
      if (step === 1) {
        setFormData({ ...formData, selectedPackage });
      }
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        setIsPaymentSheetVisible(true);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data?.msg || 'Payment processing failed'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPackageCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.packageCard, selectedPackage === item.id && styles.selectedPackage]}
      onPress={() => setSelectedPackage(item.id)}
    >
      <LinearGradient
        colors={selectedPackage === item.id ? ['#8bbee1', '#3e74bc'] : ['#ffffff', '#ffffff']}
        style={styles.packageContent}
      >
        <IconButton 
          icon={item.icon} 
          size={30} 
          color={selectedPackage === item.id ? '#fff' : '#6c63ff'} 
        />
        <Text style={[styles.packageAmount, selectedPackage === item.id && styles.selectedText]}>
          K{item.amount}
        </Text>
        <Text style={[styles.packageDuration, selectedPackage === item.id && styles.selectedText]}>
        {item.duration} {item.duration_type}s
        </Text>
        <View style={styles.featuresList}>
            <Text 
              style={[styles.featureText, selectedPackage === item.id && styles.selectedText]}
            >
              {item.desc}
            </Text>
        </View>
        {/* <View style={styles.featuresList}>
          {item.features.map((feature, index) => (
            <Text 
              key={index} 
              style={[styles.featureText, selectedPackage === item.id && styles.selectedText]}
            >
              • {feature}
            </Text>
          ))}
        </View> */}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.welcomeContainer}>
            <Image source={steps[0].image} style={styles.welcomeImage} />
            <Text style={styles.welcomeText}>
              Enhance your property's visibility and attract more potential buyers with our premium boost packages.
            </Text>
          </View>
        );
      case 1:
        return (
          <FlatList
            data={bidPackages}
            renderItem={renderPackageCard}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.packageList}
          />
        );
      case 2:
        return (
          <View style={styles.reviewContainer}>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewHeader}>Boost Summary</Text>
            {selectedPackage && (
              <>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Selected Package</Text>
                  <Text style={styles.reviewValue}>
                    K{bidPackages.find(p => p.id === selectedPackage)?.amount}
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Duration</Text>
                  <Text style={styles.reviewValue}>
                  {bidPackages.find(p => p.id === selectedPackage)?.duration}
                  {bidPackages.find(p => p.id === selectedPackage)?.duration_type}
                  </Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Property ID</Text>
                  <Text style={styles.reviewValue}>{property}</Text>
                </View>
              </>
            )}
          </View>
          
          <View style={styles.additionalOptionsContainer}>
            <TouchableOpacity style={styles.adCard}>
              <LinearGradient
                colors={['#4FACFE', '#00F2FE']}
                style={styles.adCardGradient}
              >
                <IconButton icon="email-newsletter" size={24} color="#fff" />
                <Text style={styles.adCardTitle}>Join Newsletter</Text>
                <Text style={styles.adCardDescription}>Get latest property insights</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.adCard}>
              <LinearGradient
                colors={['#43E97B', '#38F9D7']}
                style={styles.adCardGradient}
              >
                <IconButton icon="account-group" size={24} color="#fff" />
                <Text style={styles.adCardTitle}>Invite Friends</Text>
                <Text style={styles.adCardDescription}>Share and earn rewards</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        );
      case 3:
        return (
          <View style={styles.paymentContainer}>
            <Image source={steps[3].image} style={styles.paymentImage} />
            <Text style={styles.paymentText}>
              Click proceed to complete your payment securely
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          {loading && (
            <BlurView intensity={100} style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#60279C" />
            </BlurView>
          )}
          
          <LinearGradient
            colors={['#7B2CBF', '#60279C']}
            style={styles.header}
          >
            <IconButton 
              icon="close" 
              size={30} 
              color="#fff" 
              onPress={onDismiss} 
              style={styles.closeButton}
            />
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{steps[step].title}</Text>
              <Text style={styles.headerSubtitle}>{steps[step].subtitle}</Text>
            </View>
            <ProgressBar 
              progress={(step + 1) / steps.length} 
              color="#fff" 
              style={styles.progressBar} 
            />
          </LinearGradient>

          <View style={styles.content}>
            {renderStepContent()}
          </View>

          <View style={styles.footer}>
            {step > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                {step === steps.length - 1 ? 'Proceed to Payment' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Bottom sheet for payment form */}
          <PaymentBottomSheet 
            isVisible={isPaymentSheetVisible} 
            onClose={() => setIsPaymentSheetVisible(false)} 
            amount={bidPackages.find(p => p.id === selectedPackage)?.amount}
            payFor='post_boost'
            boostData={bidPackages.find(p => p.id === selectedPackage)}
            postID={formData.propertyId}
            userID={user ? user.id : null}
          />
        </SafeAreaView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    backgroundColor: '#ffff',
    flex: 1,
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    paddingTop: 35,
    paddingBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#4a4e69',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 50,
  },
  headerContent: {
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: -0.3,
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 8,
    zIndex: 60,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 16,
  },
  welcomeImage: {
    width: width * 0.35,
    height: width * 0.35,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6c7093',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  packageList: {
    paddingVertical: 2,
  },
  packageCard: {
    marginBottom: 6,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#4a4e69',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: 'hidden',
    zIndex: 10,
  },
  packageContent: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPackage: {
    elevation: 8,
    transform: [{ scale: 1.02 }],
    zIndex: 20,
  },
  packageAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a5a6d',
    flex: 1,
    textAlign: 'center',
  },
  packageDuration: {
    fontSize: 12,
    color: '#7a7a8c',
    flex: 1,
    textAlign: 'right',
  },
  selectedText: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  reviewContainer: {
    padding: 0,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    marginBottom: 12,
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9694b0',
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#666',
  },
  reviewValue: {
    fontSize: 14,
    color: '#9694b0',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 40,
  },
  backButton: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e8',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4a4e69',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#4a4e69',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 90,
  },
  additionalOptionsContainer: {
    marginTop: 12,
  },
  adCard: {
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  adCardGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  adCardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 10,
  },
  paymentContainer: {
    alignItems: 'center',
    padding: 16,
  },
  paymentImage: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  paymentText: {
    fontSize: 16,
    color: '#6c7093',
    textAlign: 'center',
  },
});

export default BidWizardModal;