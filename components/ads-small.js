import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SmallBannerAd = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Simulate ad loading after a delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000); // Show ad after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const closeAd = () => {
    setVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeAd}
    >
      <View style={styles.centeredView}>
        <View style={styles.adContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeAd}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.adTitle}>Special Offer!</Text>
          <Text style={styles.adContent}>
            Get 50% off on your next purchase. Limited time only!
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  adContainer: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  adTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  adContent: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#60279C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SmallBannerAd;