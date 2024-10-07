import React, { useState, useEffect } from 'react';
import { View, Text,Linking, TouchableOpacity, SafeAreaView, StyleSheet, Image, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { Modal, Portal, ProgressBar, IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../confg/config';

const { width } = Dimensions.get('window');

const bidPackages = [
  { id: 1, amount: '100 ZMW', desc: '1 Week', icon: 'calendar-week' },
  { id: 2, amount: '200 ZMW', desc: '2 Weeks', icon: 'calendar-range' },
  { id: 3, amount: '300 ZMW', desc: '3 Weeks', icon: 'calendar-month' },
  { id: 4, amount: '400 ZMW', desc: '4 Weeks', icon: 'calendar-clock' },
  { id: 5, amount: '500 ZMW', desc: '5 Weeks', icon: 'calendar-check' },
];

const BidWizardModal = ({ visible, onDismiss, property }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ propertyId: property });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ propertyId: property }); 
  }, [property]);

  const steps = [
    { title: 'Let’s Go', image: require('../assets/icon/boost.webp') },
    { title: 'Choose Your Best Package', image: '' },
    { title: 'Review', image:''},
    { title: 'Proceed to Payment', image: '' },
  ];

  const handleNext = async () => {
    if (step < steps.length - 1) {
        if (step === 1) {
            setFormData({ ...formData, selectedPackage });
        }
        setStep(step + 1);
    } else {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/pay-w-broadpay`, formData, {
                headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
                },
            });
            console.log(response);
            if(response.url === null){
                Toast.show({
                    type: 'warning',
                    text1: 'Oops',
                    text2: 'Failed to process transaction, please try again!'
                });
            }else{
                Linking.openURL(response.url).catch(err => console.error('Error opening URL:', err));
            }
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Your bid has been submitted successfully!'
            });
            onDismiss();
            setStep(0); 
            setFormData({ propertyId: property }); 
            setSelectedPackage(null); 
        } catch (error) {
            console.log('Full error:', error);
            console.log('Error response:', error.response);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed: ' + (error.response?.data?.msg || error.message)
            });
        } finally {
            setLoading(false);
        }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderStepContent = (currentStep) => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.contentText}>Welcome to the Bid Wizard! Here you can place a bid on the property you're interested in.</Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <FlatList
              data={bidPackages}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.packageItem, selectedPackage === item.id && styles.selectedPackage]}
                  onPress={() => setSelectedPackage(item.id)}
                >
                  <LinearGradient
                    colors={selectedPackage === item.id ? ['#4CAF50', '#45a049'] : ['#f0f0f0', '#e0e0e0']}
                    style={styles.packageGradient}
                  >
                    <IconButton icon={item.icon} size={32} color={selectedPackage === item.id ? '#fff' : '#4CAF50'} />
                    <Text style={[styles.packageText, selectedPackage === item.id && styles.selectedPackageText]}>{item.amount}</Text>
                    <Text style={[styles.packageDesc, selectedPackage === item.id && styles.selectedPackageText]}>{item.desc}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.packageGrid}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.contentText}>Review your bid details carefully before submitting:</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>Selected Package: {bidPackages.find(p => p.id === selectedPackage)?.amount}</Text>
              <Text style={styles.reviewText}>Duration: {bidPackages.find(p => p.id === selectedPackage)?.desc}</Text>
              <Text style={styles.reviewText}>Property ID: {property}</Text>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.contentText}>Make payment for your house property to show on top listing.</Text>
            <Image source={require('../assets/icon/payment.webp')} style={styles.successImage} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <SafeAreaView style={styles.container}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4CAF50" />
            </View>
          )}
          <View style={styles.header}>
            <IconButton icon="close" size={24} onPress={onDismiss} />
            <Text style={styles.headerTitle}>Bid Wizard</Text>
            <View style={styles.placeholder} />
          </View>
          <ProgressBar progress={(step + 1) / steps.length} color="#4CAF50" style={styles.progressBar} />
          <View style={styles.content}>
            {steps[step].image && (
            <Image source={steps[step].image} style={styles.stepImage} />
            )}
            <Text style={styles.stepTitle}>{steps[step].title}</Text>
            {renderStepContent(step)}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, step === 0 && styles.disabledButton]}
              onPress={handlePrevious}
              disabled={step === 0}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>{step === steps.length - 1 ? "Finish" : "Next"}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Toast />
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  placeholder: {
    width: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    color: '#333',
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
    top: 0,
    marginBottom: 0,
    color: '#555',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  packageGrid: {
    alignItems: 'center',
  },
  packageItem: {
    width: (width - 80) / 2,
    aspectRatio: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  packageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectedPackage: {
    elevation: 5,
  },
  packageText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 8,
  },
  packageDesc: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  selectedPackageText: {
    color: '#fff',
  },
  welcomeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 24,
  },
  successImage: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
    marginTop: 2,
  },
  reviewContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
});

export default BidWizardModal;