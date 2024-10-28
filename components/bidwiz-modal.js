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

const bidPackages = [
  { id: 1, amount: '100', desc: '1 Week', icon: 'calendar-week', features: ['Top Listing', 'Priority Support'] },
  { id: 2, amount: '200', desc: '2 Weeks', icon: 'calendar-range', features: ['Featured Badge', 'Email Marketing'] },
  { id: 3, amount: '300', desc: '3 Weeks', icon: 'calendar-month', features: ['Social Promotion', 'Analytics Report'] },
 
];

const BidWizardModal = ({ visible, onDismiss, property }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ propertyId: property });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPaymentSheetVisible, setIsPaymentSheetVisible] = useState(false);
  
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
      image: require('../assets/icon/payment.webp')
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
        colors={selectedPackage === item.id ? ['#6c63ff', '#3e74bc'] : ['#ffffff', '#ffffff']}
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
          {item.desc}
        </Text>
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
                    {bidPackages.find(p => p.id === selectedPackage)?.desc}
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
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 1,
    color: '#ffffff',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 24,
  },
  welcomeImage: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#9694b0',
    textAlign: 'center',
    lineHeight: 26,
  },
  packageList: {
    paddingVertical: 8,
    margin: 2,
  },
  packageCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#ebebf9',
    shadowColor: '#ebebf9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  packageContent: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPackage: {
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  packageAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9694b0',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  packageDuration: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  selectedText: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresList: {
    marginTop: 8,
    paddingLeft: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  reviewContainer: {
    padding: 0,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  reviewHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9694b0',
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  reviewLabel: {
    fontSize: 16,
    color: '#666',
  },
  reviewValue: {
    fontSize: 16,
    color: '#9694b0',
    fontWeight: '500',
  },
  paymentContainer: {
    alignItems: 'center',
    padding: 24,
  },
  paymentImage: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  paymentText: {
    fontSize: 18,
    color: '#9694b0',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9694b0',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#60279C',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#60279C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  additionalOptionsContainer: {
    marginTop: 16,
  },
  adCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  adCardGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  adCardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 12,
  },
});

export default BidWizardModal;